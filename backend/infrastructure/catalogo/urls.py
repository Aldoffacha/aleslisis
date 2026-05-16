from django.urls import path

from backend.infrastructure.catalogo import views

urlpatterns = [
    path('publico/personalizacion/', views.public_personalizacion_view, name='catalogo-publico-personalizacion'),
    path('admin/resumen/', views.admin_catalog_summary_view, name='catalogo-admin-resumen'),
    path('admin/items/', views.admin_catalog_create_view, name='catalogo-admin-create'),
    path('admin/items/<int:producto_id>/', views.admin_catalog_detail_view, name='catalogo-admin-detail'),
]
