from __future__ import annotations

from typing import Any

from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone

from backend.infrastructure.django_app.models import CategoriaProducto, Producto
from backend.infrastructure.inventario_meta.models import ProductoInventarioMeta, TipoInventario


ACTIVE_STATES = {'activo', 'activa', 'disponible', 'visible'}


def _normalize_optional_string(value: str | None) -> str | None:
    if value is None:
        return None

    normalized_value = value.strip()
    return normalized_value or None


def _normalize_state(value: str | None, fallback: str = 'activo') -> str:
    normalized_value = (value or '').strip().lower()
    return normalized_value or fallback


def _normalize_category_id(category_id: Any) -> int | None:
    if category_id in (None, '', 'null'):
        return None

    try:
        return int(category_id)
    except (TypeError, ValueError):
        return None


def _build_media_url(request, product: Producto) -> str:
    if product.image:
        return request.build_absolute_uri(product.image.url)
    return ''


def _build_meta_map(product_ids: list[int]) -> dict[int, ProductoInventarioMeta]:
    return {
        meta.producto_id: meta
        for meta in ProductoInventarioMeta.objects.filter(producto_id__in=product_ids)
    }


def _build_type_lookup() -> dict[tuple[int, str], TipoInventario]:
    inventory_type_lookup: dict[tuple[int, str], TipoInventario] = {}

    for inventory_type in TipoInventario.objects.select_related('id_categoria').all():
        normalized_name = _normalize_optional_string(inventory_type.nombre)
        if not normalized_name:
            continue

        inventory_type_lookup[(inventory_type.id_categoria_id, normalized_name.lower())] = inventory_type

    return inventory_type_lookup


def _serialize_category(category: CategoriaProducto) -> dict[str, Any]:
    product_count = getattr(category, 'product_count', None)
    if product_count is None:
        product_count = Producto.objects.filter(id_categoria=category).count()

    return {
        'id': category.id_categoria,
        'nombre': category.nombre or '',
        'descripcion': category.descripcion or '',
        'estado': category.estado or '',
        'productCount': product_count,
    }


def _serialize_inventory_type(inventory_type: TipoInventario) -> dict[str, Any]:
    return {
        'id': inventory_type.id_tipo,
        'categoriaId': inventory_type.id_categoria_id,
        'categoriaNombre': inventory_type.id_categoria.nombre if inventory_type.id_categoria else '',
        'nombre': inventory_type.nombre or '',
        'descripcion': inventory_type.descripcion or '',
        'estado': inventory_type.estado or '',
    }


def _serialize_product(
    request,
    product: Producto,
    meta: ProductoInventarioMeta | None,
    inventory_type_lookup: dict[tuple[int, str], TipoInventario] | None = None,
) -> dict[str, Any]:
    normalized_type_name = _normalize_optional_string(meta.tipo_item if meta else None) or ''
    inventory_type = None

    if inventory_type_lookup and normalized_type_name and product.id_categoria_id:
        inventory_type = inventory_type_lookup.get((product.id_categoria_id, normalized_type_name.lower()))

    return {
        'id': product.id_producto,
        'nombre': product.nombre or '',
        'descripcion': product.descripcion or '',
        'precioUnitario': str(product.precio_unitario),
        'cantidad': product.cantidad,
        'estado': product.estado or (meta.estado if meta else ''),
        'categoriaId': product.id_categoria_id,
        'categoriaNombre': product.id_categoria.nombre if product.id_categoria else '',
        'tipoItem': normalized_type_name,
        'tipoItemId': inventory_type.id_tipo if inventory_type else None,
        'imageSrc': _build_media_url(request, product),
    }


def _resolve_category(category_id: Any) -> CategoriaProducto | None:
    if category_id in (None, '', 'null'):
        return None

    try:
        return CategoriaProducto.objects.get(id_categoria=int(category_id))
    except (CategoriaProducto.DoesNotExist, TypeError, ValueError):
        return None


def _resolve_selected_type_name(
    category: CategoriaProducto | None,
    validated_data: dict[str, Any],
    current_type_name: str = '',
) -> str:
    if 'id_tipo_inventario' in validated_data:
        inventory_type_id = validated_data.get('id_tipo_inventario')
        if inventory_type_id in (None, '', 'null'):
            return ''

        inventory_type = TipoInventario.objects.filter(id_tipo=inventory_type_id).first()
        if not inventory_type:
            raise ValueError('El tipo de inventario seleccionado no existe.')

        if not category or inventory_type.id_categoria_id != category.id_categoria:
            raise ValueError('El tipo de inventario no pertenece a la categoria seleccionada.')

        return inventory_type.nombre or ''

    if 'tipo_item' in validated_data:
        normalized_type_name = _normalize_optional_string(validated_data.get('tipo_item')) or ''
        if not normalized_type_name:
            return ''

        if not category:
            return normalized_type_name

        inventory_type = TipoInventario.objects.filter(
            id_categoria_id=category.id_categoria,
            nombre__iexact=normalized_type_name,
        ).order_by('id_tipo').first()

        return inventory_type.nombre if inventory_type else normalized_type_name

    if 'id_categoria' in validated_data:
        normalized_current_type_name = _normalize_optional_string(current_type_name) or ''
        if not normalized_current_type_name or not category:
            return ''

        inventory_type = TipoInventario.objects.filter(
            id_categoria_id=category.id_categoria,
            nombre__iexact=normalized_current_type_name,
        ).order_by('id_tipo').first()

        return inventory_type.nombre if inventory_type else ''

    return _normalize_optional_string(current_type_name) or ''


def list_inventory_categories() -> list[dict[str, Any]]:
    categories = CategoriaProducto.objects.all().annotate(product_count=Count('productos')).order_by('nombre')
    return [_serialize_category(category) for category in categories]


def list_inventory_types(*, categoria_id: str | None = None) -> list[dict[str, Any]]:
    inventory_types = TipoInventario.objects.select_related('id_categoria').all()
    normalized_category_id = _normalize_category_id(categoria_id)

    if categoria_id not in (None, '', 'null'):
        if normalized_category_id is None:
            inventory_types = inventory_types.none()
        else:
            inventory_types = inventory_types.filter(id_categoria_id=normalized_category_id)

    inventory_types = inventory_types.order_by('id_categoria__nombre', 'nombre')
    return [_serialize_inventory_type(inventory_type) for inventory_type in inventory_types]


def list_inventory_products(
    request,
    *,
    query: str | None = None,
    categoria_id: str | None = None,
    estado: str | None = None,
) -> list[dict[str, Any]]:
    products = Producto.objects.select_related('id_categoria').all()
    normalized_query = (query or '').strip()
    normalized_state = (estado or '').strip().lower()

    if normalized_query:
        products = products.filter(
            Q(nombre__icontains=normalized_query)
            | Q(descripcion__icontains=normalized_query)
            | Q(id_categoria__nombre__icontains=normalized_query)
        )

    if categoria_id not in (None, '', 'null'):
        try:
            products = products.filter(id_categoria_id=int(categoria_id))
        except (TypeError, ValueError):
            products = products.none()

    if normalized_state:
        products = products.filter(estado__iexact=normalized_state)

    products = products.order_by('nombre')
    product_ids = [product.id_producto for product in products]
    meta_map = _build_meta_map(product_ids)
    inventory_type_lookup = _build_type_lookup()

    return [_serialize_product(request, product, meta_map.get(product.id_producto), inventory_type_lookup) for product in products]


def get_inventory_category_payload(category_id: int) -> dict[str, Any] | None:
    category = CategoriaProducto.objects.filter(id_categoria=category_id).first()
    if not category:
        return None

    return _serialize_category(category)


def get_inventory_product_payload(request, product_id: int) -> dict[str, Any] | None:
    product = Producto.objects.select_related('id_categoria').filter(id_producto=product_id).first()
    if not product:
        return None

    meta = ProductoInventarioMeta.objects.filter(producto_id=product.id_producto).first()
    return _serialize_product(request, product, meta, _build_type_lookup())


@transaction.atomic
def create_inventory_category(validated_data: dict[str, Any]) -> dict[str, Any]:
    category = CategoriaProducto.objects.create(
        nombre=_normalize_optional_string(validated_data.get('nombre')),
        descripcion=_normalize_optional_string(validated_data.get('descripcion')),
        estado=_normalize_state(validated_data.get('estado')),
    )
    return _serialize_category(category)


@transaction.atomic
def update_inventory_category(category_id: int, validated_data: dict[str, Any]) -> dict[str, Any] | None:
    category = CategoriaProducto.objects.filter(id_categoria=category_id).first()
    if not category:
        return None

    if 'nombre' in validated_data:
        category.nombre = _normalize_optional_string(validated_data.get('nombre'))
    if 'descripcion' in validated_data:
        category.descripcion = _normalize_optional_string(validated_data.get('descripcion'))
    if 'estado' in validated_data:
        category.estado = _normalize_state(validated_data.get('estado'))

    category.save()
    return _serialize_category(category)


@transaction.atomic
def create_inventory_type(category_id: int, validated_data: dict[str, Any]) -> dict[str, Any] | None:
    category = CategoriaProducto.objects.filter(id_categoria=category_id).first()
    if not category:
        return None

    normalized_name = _normalize_optional_string(validated_data.get('nombre'))
    if not normalized_name:
        raise ValueError('El nombre del tipo es obligatorio.')

    duplicated_type = TipoInventario.objects.filter(
        id_categoria=category,
        nombre__iexact=normalized_name,
    ).first()
    if duplicated_type:
        raise ValueError('Ya existe un tipo con ese nombre en la categoria seleccionada.')

    now = timezone.now()
    inventory_type = TipoInventario.objects.create(
        id_categoria=category,
        nombre=normalized_name,
        descripcion=_normalize_optional_string(validated_data.get('descripcion')),
        estado=_normalize_state(validated_data.get('estado')),
        created_at=now,
        updated_at=now,
    )

    return _serialize_inventory_type(inventory_type)


@transaction.atomic
def logical_delete_inventory_category(category_id: int) -> dict[str, Any] | None:
    category = CategoriaProducto.objects.filter(id_categoria=category_id).first()
    if not category:
        return None

    category.estado = 'inactivo'
    category.save(update_fields=['estado'])
    return _serialize_category(category)


def _get_or_create_meta(product: Producto) -> ProductoInventarioMeta:
    meta, _ = ProductoInventarioMeta.objects.get_or_create(
        producto_id=product.id_producto,
        defaults={
            'estado': product.estado or 'activo',
        },
    )
    return meta


@transaction.atomic
def create_inventory_product(request, validated_data: dict[str, Any]) -> dict[str, Any]:
    category = _resolve_category(validated_data.get('id_categoria'))
    selected_type_name = _resolve_selected_type_name(category, validated_data)

    product = Producto.objects.create(
        nombre=validated_data['nombre'],
        descripcion=validated_data.get('descripcion', ''),
        precio_unitario=validated_data['precio_unitario'],
        cantidad=validated_data['cantidad'],
        image=validated_data.get('image'),
        estado=validated_data.get('estado') or 'activo',
        id_categoria=category,
    )

    meta = ProductoInventarioMeta.objects.create(
        producto_id=product.id_producto,
        tipo_item=selected_type_name,
        estado=validated_data.get('estado') or 'activo',
    )

    return _serialize_product(request, product, meta, _build_type_lookup())


@transaction.atomic
def update_inventory_product(request, product_id: int, validated_data: dict[str, Any]) -> dict[str, Any] | None:
    product = Producto.objects.select_related('id_categoria').filter(id_producto=product_id).first()
    if not product:
        return None

    meta = _get_or_create_meta(product)
    next_category = product.id_categoria
    if 'id_categoria' in validated_data:
        next_category = _resolve_category(validated_data.get('id_categoria'))

    selected_type_name = _resolve_selected_type_name(next_category, validated_data, current_type_name=meta.tipo_item)

    if 'nombre' in validated_data:
        product.nombre = validated_data['nombre']
    if 'descripcion' in validated_data:
        product.descripcion = validated_data.get('descripcion', '')
    if 'precio_unitario' in validated_data:
        product.precio_unitario = validated_data['precio_unitario']
    if 'cantidad' in validated_data:
        product.cantidad = validated_data['cantidad']
    if 'estado' in validated_data:
        product.estado = validated_data.get('estado') or 'activo'
    if 'id_categoria' in validated_data:
        product.id_categoria = next_category
    if validated_data.get('remove_image'):
        if product.image:
            product.image.delete(save=False)
        product.image = None
    if validated_data.get('image') is not None:
        product.image = validated_data.get('image')

    product.save()

    meta.tipo_item = selected_type_name
    if 'estado' in validated_data:
        meta.estado = validated_data.get('estado') or 'activo'
    meta.save()

    product.refresh_from_db()
    return _serialize_product(request, product, meta, _build_type_lookup())


@transaction.atomic
def logical_delete_inventory_product(request, product_id: int) -> dict[str, Any] | None:
    product = Producto.objects.select_related('id_categoria').filter(id_producto=product_id).first()
    if not product:
        return None

    product.estado = 'inactivo'
    product.save(update_fields=['estado'])

    meta = _get_or_create_meta(product)
    meta.estado = 'inactivo'
    meta.save(update_fields=['estado'])

    return _serialize_product(request, product, meta)
