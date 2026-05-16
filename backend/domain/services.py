from backend.domain.interfaces import UserRepository

class AuthService:
    def __init__(self, repo: UserRepository):
        self._repo = repo

    def login(self, correo: str, password: str):
        if not correo or not password:
            raise ValueError('Correo y contraseña requeridos')
        user = self._repo.authenticate(correo, password)
        if user is None:
            raise ValueError('Credenciales inválidas')
        return user

    def register(self, data: dict):
        if len(data.get('password', '')) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return self._repo.create_cliente(data)