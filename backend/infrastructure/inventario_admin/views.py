from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from backend.infrastructure.inventario_admin.serializers import (
    InventoryCategoryInputSerializer,
    InventoryProductInputSerializer,
    InventoryTypeInputSerializer,
)
from backend.infrastructure.inventario_admin.services import (
    create_inventory_category,
    create_inventory_product,
    create_inventory_type,
    get_inventory_category_payload,
    get_inventory_product_payload,
    list_inventory_categories,
    list_inventory_products,
    list_inventory_types,
    logical_delete_inventory_category,
    logical_delete_inventory_product,
    update_inventory_category,
    update_inventory_product,
)


def _admin_guard(request):
    if request.session.get('user_rol') != 'administrador':
        return Response({'error': 'Solo un administrador puede gestionar el inventario.'}, status=status.HTTP_403_FORBIDDEN)
    return None


def _normalize_decimal_string(value):
    if not isinstance(value, str):
        return value

    return value.strip().replace(',', '.')


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

    if payload.get('id_categoria') in ('', 'null', None):
        payload['id_categoria'] = None

    if payload.get('id_tipo_inventario') in ('', 'null', None):
        payload['id_tipo_inventario'] = None

    if 'precio_unitario' in payload:
        payload['precio_unitario'] = _normalize_decimal_string(payload.get('precio_unitario'))

    remove_image = payload.get('remove_image')
    if isinstance(remove_image, str):
        payload['remove_image'] = remove_image.strip().lower() == 'true'

    return payload


@api_view(['GET'])
def admin_inventory_summary_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    return Response(
        {
            'categorias': list_inventory_categories(),
            'tipos': list_inventory_types(),
            'productos': list_inventory_products(
                request,
                query=request.query_params.get('q'),
                categoria_id=request.query_params.get('categoria_id'),
                estado=request.query_params.get('estado'),
            ),
        }
    )


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_inventory_categories_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        return Response(list_inventory_categories())

    serializer = InventoryCategoryInputSerializer(data=_normalize_payload(request))
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(create_inventory_category(serializer.validated_data), status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_inventory_category_detail_view(request, categoria_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        payload = get_inventory_category_payload(categoria_id)
        if not payload:
            return Response({'error': 'Categoria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    if request.method == 'DELETE':
        payload = logical_delete_inventory_category(categoria_id)
        if not payload:
            return Response({'error': 'Categoria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    serializer = InventoryCategoryInputSerializer(data=_normalize_payload(request), partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    payload = update_inventory_category(categoria_id, serializer.validated_data)
    if not payload:
        return Response({'error': 'Categoria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(payload)


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_inventory_category_types_view(request, categoria_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        return Response(list_inventory_types(categoria_id=str(categoria_id)))

    serializer = InventoryTypeInputSerializer(data=_normalize_payload(request))
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = create_inventory_type(categoria_id, serializer.validated_data)
    except ValueError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    if not payload:
        return Response({'error': 'Categoria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(payload, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_inventory_products_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        return Response(
            list_inventory_products(
                request,
                query=request.query_params.get('q'),
                categoria_id=request.query_params.get('categoria_id'),
                estado=request.query_params.get('estado'),
            )
        )

    serializer = InventoryProductInputSerializer(data=_normalize_payload(request))
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = create_inventory_product(request, serializer.validated_data)
    except ValueError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(payload, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_inventory_product_detail_view(request, producto_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        payload = get_inventory_product_payload(request, producto_id)
        if not payload:
            return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    if request.method == 'DELETE':
        payload = logical_delete_inventory_product(request, producto_id)
        if not payload:
            return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    serializer = InventoryProductInputSerializer(data=_normalize_payload(request), partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = update_inventory_product(request, producto_id, serializer.validated_data)
    except ValueError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    if not payload:
        return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(payload)
