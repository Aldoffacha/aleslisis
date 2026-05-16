from rest_framework import serializers

from backend.infrastructure.catalogo_meta.models import ProductoVisualMeta


class CatalogoVisualInputSerializer(serializers.Serializer):
    tipo_visual = serializers.ChoiceField(choices=ProductoVisualMeta.TipoVisual.choices)
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    precio_unitario = serializers.DecimalField(max_digits=10, decimal_places=2)
    cantidad = serializers.IntegerField(min_value=0)
    estado = serializers.CharField(required=False, allow_blank=True, default='activo')
    id_categoria = serializers.IntegerField(required=False, allow_null=True)
    subtitulo = serializers.CharField(required=False, allow_blank=True)
    badge = serializers.CharField(required=False, allow_blank=True)
    accent_color = serializers.CharField(required=False, allow_blank=True)
    tone = serializers.CharField(required=False, allow_blank=True)
    category_label = serializers.CharField(required=False, allow_blank=True)
    render_config = serializers.JSONField(required=False)
    composition_config = serializers.JSONField(required=False)
    image = serializers.FileField(required=False, allow_null=True)
    remove_image = serializers.BooleanField(required=False, default=False)
