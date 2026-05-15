from abc import ABC, abstractmethod
from backend.domain.entities import UserEntity

class UserRepository(ABC):
    @abstractmethod
    def authenticate(self, correo: str, password: str) -> UserEntity | None:
        ...

    @abstractmethod
    def create_cliente(self, data: dict) -> UserEntity:
        ...

    @abstractmethod
    def get_by_id(self, user_id: int) -> UserEntity | None:
        ...