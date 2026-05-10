from abc import ABC, abstractmethod
from django.contrib.auth.models import User


class UserRepository(ABC):
    @abstractmethod
    def authenticate(self, username: str | None, email: str | None, password: str) -> User | None:
        ...

    @abstractmethod
    def create_user(self, username: str, email: str, password: str) -> User:
        ...

    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None:
        ...
