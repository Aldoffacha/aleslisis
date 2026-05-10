from backend.domain.interfaces import UserRepository


class AuthService:
    def __init__(self, repo: UserRepository):
        self._repo = repo

    def login(self, username: str | None, email: str | None, password: str):
        if not password:
            raise ValueError('Contraseña requerida')
        if not username and not email:
            raise ValueError('Usuario o correo requerido')
        user = self._repo.authenticate(username, email, password)
        if user is None:
            raise ValueError('Credenciales inválidas')
        return user

    def register(self, username: str, email: str, password: str):
        if len(password) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return self._repo.create_user(username, email, password)
