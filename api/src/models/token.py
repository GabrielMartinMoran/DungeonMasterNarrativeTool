from src.config_provider import ConfigProvider
from src.models.user import User
import jwt


class Token:
    _ALGORITHM = 'HS256'

    def __init__(self, username: str) -> None:
        self._username = username

    def to_jwt(self) -> str:
        str_token = jwt.encode({'username': self.username}, ConfigProvider.JWT_SECRET, self._ALGORITHM)
        return f'Bearer {str_token}'

    @property
    def username(self) -> str:
        return self._username

    @staticmethod
    def from_user(user: User) -> 'Token':
        return Token(user.username)

    @staticmethod
    def from_jwt(str_token: str) -> 'Token':
        _str_token = str_token.replace('Bearer ', '')
        dict_token = jwt.decode(_str_token, ConfigProvider.JWT_SECRET, algorithms=[Token._ALGORITHM])
        return Token(dict_token['username'])
