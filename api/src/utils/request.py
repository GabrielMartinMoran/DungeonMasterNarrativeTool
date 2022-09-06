from dataclasses import dataclass
from typing import Optional

from src.models.token import Token


@dataclass
class Request:
    token: Optional[Token]
    body: dict
