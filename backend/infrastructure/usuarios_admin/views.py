from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from backend.infrastructure.usuarios_admin.serializers import (
    AdminUserInputSerializer,
    EmployeeAssignmentInputSerializer,
)
from backend.infrastructure.usuarios_admin.services import (
    create_user,
    get_employee_payload,
    get_user_payload,
    list_employees,
    list_users,
    logical_delete_user,
    update_employee_assignment,
    update_user,
)


def _admin_guard(request):
    if request.session.get('user_rol') != 'administrador':
        return Response({'error': 'Solo un administrador puede gestionar usuarios y roles.'}, status=status.HTTP_403_FORBIDDEN)
    return None


def _get_page(request) -> int:
    try:
        return max(1, int(request.query_params.get('page', '1')))
    except (TypeError, ValueError):
        return 1


@api_view(['GET', 'POST'])
def admin_users_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        return Response(
            list_users(
                query=request.query_params.get('q'),
                letter=request.query_params.get('letter'),
                sort=request.query_params.get('sort'),
                page=_get_page(request),
            )
        )

    serializer = AdminUserInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        return Response(create_user(serializer.validated_data), status=status.HTTP_201_CREATED)
    except ValueError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def admin_user_detail_view(request, user_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        payload = get_user_payload(user_id)
        if not payload:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    if request.method == 'DELETE':
        payload = logical_delete_user(user_id)
        if not payload:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    serializer = AdminUserInputSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = update_user(user_id, serializer.validated_data)
    except ValueError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    if not payload:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(payload)


@api_view(['GET'])
def admin_employees_view(request):
    guard = _admin_guard(request)
    if guard:
        return guard

    return Response(
        list_employees(
            query=request.query_params.get('q'),
            letter=request.query_params.get('letter'),
            sort=request.query_params.get('sort'),
            page=_get_page(request),
        )
    )


@api_view(['GET', 'PATCH', 'DELETE'])
def admin_employee_detail_view(request, user_id: int):
    guard = _admin_guard(request)
    if guard:
        return guard

    if request.method == 'GET':
        payload = get_employee_payload(user_id)
        if not payload:
            return Response({'error': 'Empleado no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    if request.method == 'DELETE':
        payload = logical_delete_user(user_id)
        if not payload:
            return Response({'error': 'Empleado no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload)

    serializer = EmployeeAssignmentInputSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    payload = update_employee_assignment(user_id, serializer.validated_data)
    if not payload:
        return Response({'error': 'Empleado no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(payload)
