from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('inventario_meta', '0002_move_image_to_producto'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.CreateModel(
                    name='TipoInventario',
                    fields=[
                        ('id_tipo', models.AutoField(primary_key=True, serialize=False)),
                        ('nombre', models.CharField(max_length=80)),
                        ('descripcion', models.TextField(blank=True, null=True)),
                        ('estado', models.CharField(default='activo', max_length=20)),
                        ('created_at', models.DateTimeField()),
                        ('updated_at', models.DateTimeField()),
                        (
                            'id_categoria',
                            models.ForeignKey(
                                db_column='id_categoria',
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name='tipos_inventario',
                                to='django_app.categorioproducto',
                            ),
                        ),
                    ],
                    options={
                        'db_table': 'tipo_inventario',
                        'managed': False,
                        'unique_together': {('id_categoria', 'nombre')},
                    },
                ),
            ],
            database_operations=[],
        ),
    ]