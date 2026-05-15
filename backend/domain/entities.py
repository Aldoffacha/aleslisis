from dataclasses import dataclass
from typing import Optional

@dataclass
class UserEntity:
    id: int
    nombre: str
    correo: str
    rol: str  # 'cliente', 'empleado', 'administrador'
    estado: Optional[str] = None