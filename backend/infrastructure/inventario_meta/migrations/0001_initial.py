from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ProductoInventarioMeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('producto_id', models.PositiveIntegerField(db_index=True, unique=True)),
                ('tipo_item', models.CharField(blank=True, max_length=120)),
                ('image', models.FileField(blank=True, null=True, upload_to='inventario/')),
                ('estado', models.CharField(default='activo', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'producto_inventario_meta',
                'ordering': ['tipo_item', 'producto_id'],
            },
        ),
    ]
