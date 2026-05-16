import bcrypt
from backend.domain.interfaces import UserRepository
from backend.domain.entities import UserEntity
from backend.infrastructure.django_app.models import Usuario, Cliente, Empleado, Administrador


ADMIN_MOCK_EMAIL = 'admin@gmail.com'
ADMIN_MOCK_PASSWORD = 'admin'
ADMIN_MOCK_USER = UserEntity(
    id=0,
    nombre='Administrador Alesli',
    correo=ADMIN_MOCK_EMAIL,
    rol='administrador',
    estado='activo',
)


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def _check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def _is_active_state(value: str | None) -> bool:
    return (value or '').strip().lower() == 'activo'

def _get_rol(usuario: Usuario) -> str:
    try:
        usuario.administrador
        return 'administrador'
    except:
        pass
    try:
        usuario.empleado
        return 'empleado'
    except:
        pass
    return 'cliente'


class DjangoUserRepository(UserRepository):
    def authenticate(self, correo: str, password: str) -> UserEntity | None:
        if correo.lower() == ADMIN_MOCK_EMAIL and password == ADMIN_MOCK_PASSWORD:
            return ADMIN_MOCK_USER

        try:
            usuario = Usuario.objects.get(correo=correo)
            if not _is_active_state(usuario.estado):
                return None
            if not _check_password(password, usuario.contrasena):
                return None
            return UserEntity(
                id=usuario.id_usuario,
                nombre=usuario.nombre,
                correo=usuario.correo,
                rol=_get_rol(usuario),
                estado=usuario.estado,
            )
        except Usuario.DoesNotExist:
            return None

    def create_cliente(self, data: dict) -> UserEntity:
        usuario = Usuario.objects.create(
            nombre=data.get('nombre'),
            apellido_paterno=data.get('apellido_paterno'),
            apellido_materno=data.get('apellido_materno'),
            ci=data.get('ci'),
            telefono=data.get('telefono'),
            correo=data.get('correo'),
            contrasena=_hash_password(data.get('password')),
            genero=data.get('genero'),
            estado='activo',
            fecha_de_nacimiento=data.get('fecha_de_nacimiento') or None,
        )
        Cliente.objects.create(id_usuario=usuario, estado='activo')
        return UserEntity(
            id=usuario.id_usuario,
            nombre=usuario.nombre,
            correo=usuario.correo,
            rol='cliente',
            estado=usuario.estado,
        )

    def get_by_id(self, user_id: int) -> UserEntity | None:
        try:
            resolved_user_id = int(user_id)
        except (TypeError, ValueError):
            resolved_user_id = user_id

        if resolved_user_id == ADMIN_MOCK_USER.id:
            return ADMIN_MOCK_USER

        try:
            usuario = Usuario.objects.get(id_usuario=resolved_user_id)
            return UserEntity(
                id=usuario.id_usuario,
                nombre=usuario.nombre,
                correo=usuario.correo,
                rol=_get_rol(usuario),
                estado=usuario.estado,
            )
        except Usuario.DoesNotExist:
            return None