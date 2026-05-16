from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ProductoVisualMeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('producto_id', models.PositiveIntegerField(db_index=True, unique=True)),
                ('tipo_visual', models.CharField(choices=[('bouquet', 'Bouquet'), ('flor', 'Flor')], max_length=20)),
                ('slug', models.SlugField(max_length=140, unique=True)),
                ('subtitulo', models.CharField(blank=True, max_length=140)),
                ('badge', models.CharField(blank=True, max_length=120)),
                ('accent_color', models.CharField(default='#7A3535', max_length=20)),
                ('tone', models.CharField(blank=True, max_length=120)),
                ('category_label', models.CharField(blank=True, max_length=40)),
                ('image', models.FileField(blank=True, null=True, upload_to='catalogo/')),
                ('render_config', models.JSONField(blank=True, default=dict)),
                ('composition_config', models.JSONField(blank=True, default=dict)),
                ('estado', models.CharField(default='activo', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'producto_visual_meta',
                'ordering': ['tipo_visual', 'slug'],
            },
        ),
    ]
