from django.urls import path

from backend.infrastructure.inventario_admin import views

urlpatterns = [
    path('resumen/', views.admin_inventory_summary_view, name='inventario-admin-resumen'),
    path('categorias/', views.admin_inventory_categories_view, name='inventario-admin-categorias'),
    path('categorias/<int:categoria_id>/', views.admin_inventory_category_detail_view, name='inventario-admin-categoria-detail'),
    path('categorias/<int:categoria_id>/tipos/', views.admin_inventory_category_types_view, name='inventario-admin-categoria-tipos'),
    path('productos/', views.admin_inventory_products_view, name='inventario-admin-productos'),
    path('productos/<int:producto_id>/', views.admin_inventory_product_detail_view, name='inventario-admin-producto-detail'),
]
