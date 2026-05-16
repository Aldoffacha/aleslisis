from __future__ import annotations

import json

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from backend.infrastructure.catalogo.serializers import CatalogoVisualInputSerializer
from backend.infrastructure.catalogo.services import (
    create_catalog_item,
    get_catalog_item,
    list_catalog_items,
    logical_delete_catalog_item,
    serialize_categorias,
    update_catalog_item,
)
from backend.infrastructure.catalogo_meta.models import ProductoVisualMeta


def _admin_guard(request):
    if request.session.get('user_rol') != 'administrador':
        return Response({'error': 'Solo un administrador puede gestionar el catalogo.'}, status=status.HTTP_403_FORBIDDEN)
    return None


def _normalize_decimal_string(value):
    if not isinstance(value, str):
        return value

    normalized_value = value.strip().replace(',', '.')
    return normalized_value


def _extract_request_payload(request):
    if not hasattr(request.data, 'keys'):
        return dict(request.data)

    payload = {}

    for key in request.data.keys():
        if key in request.FILES:
            payload[key] = request.FILES.get(key)
            continue

        payload[key] = request.data.get(key)

    return payload


def _normalize_payload(request):
    payload = _extract_request_payload(request)

    for key in ('render_config', 'composition_config'):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            try:
                payload[key] = json.loads(value)
            except json.JSONDecodeError:
                payload[key] = {}

    if payload.get('id_categoria') in ('', 'null', None):
        payload['id_categoria'] = None

    if 'precio_unitario' in payload:
        payload['precio_unitario'] = _normalize_decimal_string(payload.get('precio_unitario'))

    remove_image = payload.get('remove_image')
    if isinstance(remove_image, str):
        payload['remove_image'] = remove_image.strip().lower() == 'true'

    return payload


@api_view(['GET'])
@permission_classes([AllowAny])
def public_personalizacion_view(request):
    return Response(
        {
            'bouquets': list_catalog_items(request, tipo_visual=ProductoVisualMeta.TipoVisual.BOUQUET, only_active=True),
            'flowers': list_catalog_items(request, tipo_visual=ProductoVisualMeta.TipoVisual.FLOR, only_active=True),
        }
    )


@api_view(['GET'])
def admin_catalog_summary_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    return Response(
        {
            'categorias': serialize_categorias(),
            'items': list_catalog_items(
                request,
                tipo_visual=request.query_params.get('tipo_visual') or None,
                estado=request.query_params.get('estado') or None,
            ),
        }
    )


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_catalog_create_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    serializer = CatalogoVisualInputSerializer(data=_normalize_payload(request))
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    producto, meta = create_catalog_item(serializer.validated_data)
    return Response(list_catalog_items(request, only_active=False, estado=None, tipo_visual=meta.tipo_visual)[-1], status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_catalog_detail_view(request, producto_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    producto, meta = get_catalog_item(producto_id)
    if not producto or not meta:
        return Response({'error': 'El producto solicitado no existe en el catalogo visual.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        item = list_catalog_items(request, only_active=False)
        resolved_item = next((current_item for current_item in item if current_item['productId'] == producto_id), None)
        return Response(resolved_item)

    if request.method == 'DELETE':
        logical_delete_catalog_item(producto, meta)
        item = list_catalog_items(request, only_active=False)
        resolved_item = next((current_item for current_item in item if current_item['productId'] == producto_id), None)
        return Response(resolved_item, status=status.HTTP_200_OK)

    serializer = CatalogoVisualInputSerializer(data=_normalize_payload(request), partial=request.method == 'PATCH')
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    update_catalog_item(producto, meta, serializer.validated_data)
    item = list_catalog_items(request, only_active=False)
    resolved_item = next((current_item for current_item in item if current_item['productId'] == producto_id), None)
    return Response(resolved_item)
