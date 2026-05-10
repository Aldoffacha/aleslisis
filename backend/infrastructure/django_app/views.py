from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from backend.domain.services import AuthService
from backend.infrastructure.django_app.repositories import DjangoUserRepository
from backend.infrastructure.django_app.serializers import (
    LoginInputSerializer,
    RegisterInputSerializer,
    UserOutputSerializer,
)


def _get_auth_service() -> AuthService:
    return AuthService(DjangoUserRepository())


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        service = _get_auth_service()
        user = service.login(
            serializer.validated_data.get('username'),
            serializer.validated_data.get('email'),
            serializer.validated_data['password'],
        )
        django_login(request, user)
        return Response(UserOutputSerializer(user).data)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        service = _get_auth_service()
        user = service.register(
            serializer.validated_data['username'],
            serializer.validated_data.get('email', ''),
            serializer.validated_data['password'],
        )
        django_login(request, user)
        return Response(UserOutputSerializer(user).data, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    django_logout(request)
    return Response({'message': 'Sesión cerrada'})


@api_view(['GET'])
def me_view(request):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(UserOutputSerializer(request.user).data)
