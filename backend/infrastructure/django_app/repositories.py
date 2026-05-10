from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from backend.domain.interfaces import UserRepository


class DjangoUserRepository(UserRepository):
    def authenticate(self, username: str | None, email: str | None, password: str) -> User | None:
        user = None
        if username:
            user = authenticate(username=username, password=password)
        elif email:
            try:
                u = User.objects.get(email=email)
                user = authenticate(username=u.username, password=password)
            except User.DoesNotExist:
                pass
        return user

    def create_user(self, username: str, email: str, password: str) -> User:
        return User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

    def get_by_id(self, user_id: int) -> User | None:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
