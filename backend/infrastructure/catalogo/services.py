from __future__ import annotations

from typing import Any

from django.db import transaction
from django.utils.text import slugify

from backend.infrastructure.catalogo_meta.models import ProductoVisualMeta
from backend.infrastructure.django_app.models import CategoriaProducto, Producto

ACTIVE_STATES = {'activo', 'activa', 'disponible', 'visible'}
DEFAULT_ACCENT_COLOR = '#7A3535'
DEFAULT_FLOWER_RENDER = {
    'widthPercent': 38,
    'maxWidth': 280,
    'bottomOffset': 3,
    'rotateJitter': 6,
    'priority': 1,
}
DEFAULT_MASK_POINTS = [
    {'x': 12, 'y': 14},
    {'x': 88, 'y': 14},
    {'x': 95, 'y': 28},
    {'x': 92, 'y': 45},
    {'x': 78, 'y': 66},
    {'x': 60, 'y': 91},
    {'x': 50, 'y': 98},
    {'x': 40, 'y': 91},
    {'x': 22, 'y': 66},
    {'x': 8, 'y': 45},
    {'x': 5, 'y': 28},
]
DEFAULT_BOUQUET_COMPOSITION = {
    'points': DEFAULT_MASK_POINTS,
    'clipPath': 'polygon(12% 14%, 88% 14%, 95% 28%, 92% 45%, 78% 66%, 60% 91%, 50% 98%, 40% 91%, 22% 66%, 8% 45%, 5% 28%)',
    'dragBounds': {
        'minX': 16,
        'maxX': 84,
        'minBottom': 28,
        'maxBottom': 64,
    },
    'gradient': {
        'from': 'rgba(255,255,255,0.08)',
        'to': 'rgba(122,53,53,0.34)',
        'angle': 180,
    },
}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return min(max(value, minimum), maximum)


def is_active_state(value: str | None) -> bool:
    return (value or '').strip().lower() in ACTIVE_STATES


def serialize_categorias() -> list[dict[str, Any]]:
    categorias = CategoriaProducto.objects.all().order_by('nombre')
    return [
        {
            'id': categoria.id_categoria,
            'nombre': categoria.nombre,
            'descripcion': categoria.descripcion or '',
            'estado': categoria.estado or '',
        }
        for categoria in categorias
    ]


def _serialize_points(raw_points: Any) -> list[dict[str, float]]:
    if not isinstance(raw_points, list):
        return []

    serialized_points: list[dict[str, float]] = []

    for point in raw_points:
        if not isinstance(point, dict):
            continue

        try:
            x = clamp(float(point.get('x', 0)), 0, 100)
            y = clamp(float(point.get('y', 0)), 0, 100)
        except (TypeError, ValueError):
            continue

        serialized_points.append({'x': round(x, 2), 'y': round(y, 2)})

    return serialized_points


def _points_to_clip_path(points: list[dict[str, float]]) -> str:
    if len(points) < 3:
        return DEFAULT_BOUQUET_COMPOSITION['clipPath']

    polygon_points = ', '.join(f"{point['x']}% {point['y']}%" for point in points)
    return f'polygon({polygon_points})'


def _points_to_drag_bounds(points: list[dict[str, float]]) -> dict[str, int]:
    if len(points) < 3:
        return DEFAULT_BOUQUET_COMPOSITION['dragBounds']

    xs = [point['x'] for point in points]
    ys = [point['y'] for point in points]

    min_x = int(round(clamp(min(xs) + 5, 10, 74)))
    max_x = int(round(clamp(max(xs) - 5, 26, 90)))
    min_bottom = int(round(clamp(100 - max(ys) + 4, 12, 56)))
    max_bottom = int(round(clamp(100 - min(ys) - 6, min_bottom + 8, 82)))

    return {
        'minX': min_x,
        'maxX': max_x,
        'minBottom': min_bottom,
        'maxBottom': max_bottom,
    }


def normalize_render_config(raw_config: Any) -> dict[str, Any]:
    config = dict(DEFAULT_FLOWER_RENDER)

    if isinstance(raw_config, dict):
        for key in DEFAULT_FLOWER_RENDER:
            value = raw_config.get(key)
            if value is None:
                continue
            config[key] = value

    return {
        'widthPercent': float(config['widthPercent']),
        'maxWidth': int(config['maxWidth']),
        'bottomOffset': float(config['bottomOffset']),
        'rotateJitter': float(config['rotateJitter']),
        'priority': int(config['priority']),
    }


def normalize_composition_config(raw_config: Any) -> dict[str, Any]:
    config = {
        'points': list(DEFAULT_BOUQUET_COMPOSITION['points']),
        'clipPath': DEFAULT_BOUQUET_COMPOSITION['clipPath'],
        'dragBounds': dict(DEFAULT_BOUQUET_COMPOSITION['dragBounds']),
        'gradient': dict(DEFAULT_BOUQUET_COMPOSITION['gradient']),
    }

    if isinstance(raw_config, dict):
        points = _serialize_points(raw_config.get('points'))
        if points:
            config['points'] = points
            config['clipPath'] = _points_to_clip_path(points)
            config['dragBounds'] = _points_to_drag_bounds(points)

        raw_clip_path = raw_config.get('clipPath')
        if isinstance(raw_clip_path, str) and raw_clip_path.strip():
            config['clipPath'] = raw_clip_path.strip()

        raw_drag_bounds = raw_config.get('dragBounds')
        if isinstance(raw_drag_bounds, dict):
            drag_bounds = dict(config['dragBounds'])
            for key in drag_bounds:
                if raw_drag_bounds.get(key) is not None:
                    drag_bounds[key] = int(raw_drag_bounds[key])
            config['dragBounds'] = drag_bounds

        raw_gradient = raw_config.get('gradient')
        if isinstance(raw_gradient, dict):
            gradient = dict(config['gradient'])
            for key in gradient:
                value = raw_gradient.get(key)
                if value is not None and value != '':
                    gradient[key] = value
            config['gradient'] = gradient

    return config


def _build_media_url(request, producto: Producto) -> str:
    if producto.image:
        return request.build_absolute_uri(producto.image.url)
    return ''


def _serialize_catalog_item(request, producto: Producto, meta: ProductoVisualMeta) -> dict[str, Any]:
    composition_config = normalize_composition_config(meta.composition_config)
    render_config = normalize_render_config(meta.render_config)

    return {
        'productId': producto.id_producto,
        'id': meta.slug,
        'slug': meta.slug,
        'tipoVisual': meta.tipo_visual,
        'nombre': producto.nombre,
        'descripcion': producto.descripcion or '',
        'precioUnitario': str(producto.precio_unitario),
        'cantidad': producto.cantidad,
        'estado': producto.estado or meta.estado,
        'categoriaId': producto.id_categoria_id,
        'categoriaNombre': producto.id_categoria.nombre if producto.id_categoria else '',
        'subtitulo': meta.subtitulo,
        'badge': meta.badge,
        'accentColor': meta.accent_color or DEFAULT_ACCENT_COLOR,
        'tone': meta.tone,
        'categoryLabel': meta.category_label,
        'imageSrc': _build_media_url(request, producto),
        'renderConfig': render_config,
        'compositionConfig': composition_config,
        'updatedAt': meta.updated_at.isoformat(),
    }


def list_catalog_items(
    request,
    *,
    tipo_visual: str | None = None,
    estado: str | None = None,
    only_active: bool = False,
) -> list[dict[str, Any]]:
    metas = ProductoVisualMeta.objects.all().order_by('tipo_visual', 'slug')

    if tipo_visual:
        metas = metas.filter(tipo_visual=tipo_visual)

    product_ids = [meta.producto_id for meta in metas]
    product_map = Producto.objects.in_bulk(product_ids, field_name='id_producto')
    normalized_estado = (estado or '').strip().lower()
    items: list[dict[str, Any]] = []

    for meta in metas:
        producto = product_map.get(meta.producto_id)
        if not producto:
            continue

        product_state = (producto.estado or meta.estado or '').strip().lower()
        if normalized_estado and product_state != normalized_estado:
            continue

        if only_active and not is_active_state(product_state):
            continue

        items.append(_serialize_catalog_item(request, producto, meta))

    return items


def _unique_slug(nombre: str, current_producto_id: int | None = None) -> str:
    base_slug = slugify(nombre) or 'producto'
    candidate = base_slug
    suffix = 2

    while True:
        existing = ProductoVisualMeta.objects.filter(slug=candidate).first()
        if existing is None or existing.producto_id == current_producto_id:
            return candidate
        candidate = f'{base_slug}-{suffix}'
        suffix += 1


def _resolve_categoria(category_id: Any) -> CategoriaProducto | None:
    if category_id in (None, '', 'null'):
        return None

    try:
        return CategoriaProducto.objects.get(id_categoria=int(category_id))
    except (CategoriaProducto.DoesNotExist, TypeError, ValueError):
        return None


def _meta_defaults(validated_data: dict[str, Any]) -> dict[str, Any]:
    return {
        'subtitulo': validated_data.get('subtitulo', ''),
        'badge': validated_data.get('badge', ''),
        'accent_color': validated_data.get('accent_color') or DEFAULT_ACCENT_COLOR,
        'tone': validated_data.get('tone', ''),
        'category_label': validated_data.get('category_label', ''),
        'render_config': normalize_render_config(validated_data.get('render_config')),
        'composition_config': normalize_composition_config(validated_data.get('composition_config')),
        'estado': validated_data.get('estado') or 'activo',
    }


@transaction.atomic
def create_catalog_item(validated_data: dict[str, Any]):
    producto = Producto.objects.create(
        nombre=validated_data['nombre'],
        descripcion=validated_data.get('descripcion', ''),
        precio_unitario=validated_data['precio_unitario'],
        cantidad=validated_data['cantidad'],
        image=validated_data.get('image'),
        estado=validated_data.get('estado') or 'activo',
        id_categoria=_resolve_categoria(validated_data.get('id_categoria')),
    )

    meta = ProductoVisualMeta.objects.create(
        producto_id=producto.id_producto,
        tipo_visual=validated_data['tipo_visual'],
        slug=_unique_slug(validated_data['nombre']),
        **_meta_defaults(validated_data),
    )

    return producto, meta


def get_catalog_item(producto_id: int) -> tuple[Producto, ProductoVisualMeta] | tuple[None, None]:
    producto = Producto.objects.filter(id_producto=producto_id).first()
    meta = ProductoVisualMeta.objects.filter(producto_id=producto_id).first()

    if not producto or not meta:
        return None, None

    return producto, meta


@transaction.atomic
def update_catalog_item(producto: Producto, meta: ProductoVisualMeta, validated_data: dict[str, Any]):
    if 'nombre' in validated_data:
        producto.nombre = validated_data['nombre']
        meta.slug = _unique_slug(validated_data['nombre'], current_producto_id=producto.id_producto)

    if 'descripcion' in validated_data:
        producto.descripcion = validated_data.get('descripcion', '')
    if 'precio_unitario' in validated_data:
        producto.precio_unitario = validated_data['precio_unitario']
    if 'cantidad' in validated_data:
        producto.cantidad = validated_data['cantidad']
    if 'estado' in validated_data:
        producto.estado = validated_data.get('estado') or 'activo'
        meta.estado = validated_data.get('estado') or 'activo'
    if 'id_categoria' in validated_data:
        producto.id_categoria = _resolve_categoria(validated_data.get('id_categoria'))
    if validated_data.get('remove_image'):
        if producto.image:
            producto.image.delete(save=False)
        producto.image = None
    if validated_data.get('image') is not None:
        producto.image = validated_data.get('image')

    if 'tipo_visual' in validated_data:
        meta.tipo_visual = validated_data['tipo_visual']
    if 'subtitulo' in validated_data:
        meta.subtitulo = validated_data.get('subtitulo', '')
    if 'badge' in validated_data:
        meta.badge = validated_data.get('badge', '')
    if 'accent_color' in validated_data:
        meta.accent_color = validated_data.get('accent_color') or DEFAULT_ACCENT_COLOR
    if 'tone' in validated_data:
        meta.tone = validated_data.get('tone', '')
    if 'category_label' in validated_data:
        meta.category_label = validated_data.get('category_label', '')
    if 'render_config' in validated_data:
        meta.render_config = normalize_render_config(validated_data.get('render_config'))
    if 'composition_config' in validated_data:
        meta.composition_config = normalize_composition_config(validated_data.get('composition_config'))

    producto.save()
    meta.save()
    return producto, meta


@transaction.atomic
def logical_delete_catalog_item(producto: Producto, meta: ProductoVisualMeta):
    producto.estado = 'inactivo'
    meta.estado = 'inactivo'
    producto.save(update_fields=['estado'])
    meta.save(update_fields=['estado', 'updated_at'])
    return producto, meta
