from django.db import migrations


FORWARD_COPY_SQL = """
UPDATE producto AS producto
SET image = meta.image
FROM producto_inventario_meta AS meta
WHERE producto.id_producto = meta.producto_id
  AND meta.image IS NOT NULL
  AND meta.image <> ''
  AND (producto.image IS NULL OR producto.image = '');
"""


REVERSE_COPY_SQL = """
UPDATE producto_inventario_meta AS meta
SET image = producto.image
FROM producto AS producto
WHERE producto.id_producto = meta.producto_id
  AND producto.image IS NOT NULL
  AND producto.image <> ''
  AND (meta.image IS NULL OR meta.image = '');
"""


class Migration(migrations.Migration):
    dependencies = [
        ('catalogo_meta', '0002_move_image_to_producto'),
        ('inventario_meta', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql=FORWARD_COPY_SQL,
            reverse_sql=REVERSE_COPY_SQL,
        ),
        migrations.RemoveField(
            model_name='productoinventariometa',
            name='image',
        ),
    ]