import bcrypt
from backend.domain.interfaces import UserRepository
from backend.domain.entities import UserEntity
from backend.infrastructure.django_app.models import Usuario, Cliente, Empleado, Administrador


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def _check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

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
        try:
            usuario = Usuario.objects.get(correo=correo)
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
            usuario = Usuario.objects.get(id_usuario=user_id)
            return UserEntity(
                id=usuario.id_usuario,
                nombre=usuario.nombre,
                correo=usuario.correo,
                rol=_get_rol(usuario),
                estado=usuario.estado,
            )
        except Usuario.DoesNotExist:
            return None