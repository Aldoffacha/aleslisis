from django.urls import path

from backend.infrastructure.usuarios_admin import views

urlpatterns = [
    path('admin/usuarios/', views.admin_users_view, name='admin-users'),
    path('admin/usuarios/<int:user_id>/', views.admin_user_detail_view, name='admin-user-detail'),
    path('admin/empleados/', views.admin_employees_view, name='admin-employees'),
    path('admin/empleados/<int:user_id>/', views.admin_employee_detail_view, name='admin-employee-detail'),
]
