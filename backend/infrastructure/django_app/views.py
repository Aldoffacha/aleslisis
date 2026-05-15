from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from backend.domain.services import AuthService
from backend.infrastructure.django_app.repositories import DjangoUserRepository
from backend.infrastructure.django_app.serializers import (
    LoginInputSerializer, RegisterInputSerializer, UserOutputSerializer
)

def _get_auth_service():
    return AuthService(DjangoUserRepository())

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_view(request):
    return Response({'csrfToken': get_token(request)})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginInputSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = _get_auth_service().login(
            serializer.validated_data['correo'],
            serializer.validated_data['password'],
        )

        request.session['user_id'] = user.id
        request.session['user_rol'] = user.rol

        request.session.save()   # <-- IMPORTANTE

        return Response(UserOutputSerializer(user).data)

    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = _get_auth_service().register(serializer.validated_data)
        request.session['user_id'] = user.id
        request.session['user_rol'] = user.rol
        return Response(UserOutputSerializer(user).data, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    request.session.flush()
    return Response({'message': 'Sesión cerrada'})

@api_view(['GET'])
def me_view(request):
    user_id = request.session.get('user_id')
    if user_id is None:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    user = DjangoUserRepository().get_by_id(user_id)
    if not user:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    return Response(UserOutputSerializer(user).data)