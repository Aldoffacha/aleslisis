from rest_framework import serializers

from backend.infrastructure.inventario_meta.models import TipoInventario


class InventoryCategoryInputSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=50)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    estado = serializers.CharField(required=False, allow_blank=True, default='activo')


class InventoryTypeInputSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=80)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    estado = serializers.CharField(required=False, allow_blank=True, default='activo')


class InventoryProductInputSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    precio_unitario = serializers.DecimalField(max_digits=10, decimal_places=2)
    cantidad = serializers.IntegerField(min_value=0)
    estado = serializers.CharField(required=False, allow_blank=True, default='activo')
    id_categoria = serializers.IntegerField(required=False, allow_null=True)
    id_tipo_inventario = serializers.IntegerField(required=False, allow_null=True)
    tipo_item = serializers.CharField(required=False, allow_blank=True)
    image = serializers.FileField(required=False, allow_null=True)
    remove_image = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        if 'id_tipo_inventario' not in attrs:
            return attrs

        inventory_type_id = attrs.get('id_tipo_inventario')
        if inventory_type_id in (None, ''):
            attrs['tipo_item'] = (attrs.get('tipo_item') or '').strip()
            return attrs

        inventory_type = TipoInventario.objects.filter(id_tipo=inventory_type_id).first()
        if not inventory_type:
            raise serializers.ValidationError({'id_tipo_inventario': 'El tipo de inventario seleccionado no existe.'})

        category_id = attrs.get('id_categoria')
        if category_id not in (None, '') and inventory_type.id_categoria_id != category_id:
            raise serializers.ValidationError({'id_tipo_inventario': 'El tipo de inventario no pertenece a la categoria seleccionada.'})

        attrs['tipo_item'] = inventory_type.nombre
        return attrs
