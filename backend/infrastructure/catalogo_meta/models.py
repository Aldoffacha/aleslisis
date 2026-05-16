from django.db import models


class ProductoVisualMeta(models.Model):
    class TipoVisual(models.TextChoices):
        BOUQUET = 'bouquet', 'Bouquet'
        FLOR = 'flor', 'Flor'

    producto_id = models.PositiveIntegerField(unique=True, db_index=True)
    tipo_visual = models.CharField(max_length=20, choices=TipoVisual.choices)
    slug = models.SlugField(max_length=140, unique=True)
    subtitulo = models.CharField(max_length=140, blank=True)
    badge = models.CharField(max_length=120, blank=True)
    accent_color = models.CharField(max_length=20, default='#7A3535')
    tone = models.CharField(max_length=120, blank=True)
    category_label = models.CharField(max_length=40, blank=True)
    image = models.FileField(upload_to='catalogo/', blank=True, null=True)
    render_config = models.JSONField(default=dict, blank=True)
    composition_config = models.JSONField(default=dict, blank=True)
    estado = models.CharField(max_length=20, default='activo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'producto_visual_meta'
        ordering = ['tipo_visual', 'slug']
