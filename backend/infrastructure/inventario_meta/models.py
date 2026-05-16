from django.db import models

from backend.infrastructure.django_app.models import CategoriaProducto


class ProductoInventarioMeta(models.Model):
    producto_id = models.PositiveIntegerField(unique=True, db_index=True)
    tipo_item = models.CharField(max_length=120, blank=True)
    estado = models.CharField(max_length=20, default='activo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'producto_inventario_meta'
        ordering = ['tipo_item', 'producto_id']


class TipoInventario(models.Model):
    id_tipo = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey(
        CategoriaProducto,
        db_column='id_categoria',
        on_delete=models.CASCADE,
        related_name='tipos_inventario',
    )
    nombre = models.CharField(max_length=80)
    descripcion = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='activo')
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'tipo_inventario'
        managed = False
        unique_together = [('id_categoria', 'nombre')]
