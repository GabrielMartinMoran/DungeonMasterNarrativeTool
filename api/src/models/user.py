from typing import Any

from pymodelio import pymodelio_model, Attribute
from pymodelio.exceptions import ModelValidationException
from pymodelio.validators import StringValidator

from src.config_provider import ConfigProvider
from src.utils import hashing


@pymodelio_model
class User:
    _username: Attribute[str](validator=StringValidator())
    _name: Attribute[str](validator=StringValidator())
    _hashed_password: Attribute[str](validator=StringValidator())
    _role: Attribute[str](validator=StringValidator(), default_factory=lambda: ConfigProvider.COMMONER_ROLE)

    def _when_validating_attr(self, internal_attr_name: str, exposed_attr_name: str, attr_value: Any, attr_path: str,
                              parent_path: str, pymodel_attribute: Attribute) -> None:
        if internal_attr_name == '_role' and attr_value not in {ConfigProvider.COMMONER_ROLE,
                                                                ConfigProvider.ADMIN_ROLE}:
            raise ModelValidationException('role is not valid')

    @property
    def username(self) -> str:
        return self._username

    @property
    def name(self) -> str:
        return self._name

    @property
    def hashed_password(self) -> str:
        return self._hashed_password

    @property
    def role(self) -> str:
        return self._role

    @staticmethod
    def from_dict(data: dict) -> 'User':
        return User(
            username=data.get('username'),
            hashed_password=data.get('hashed_password', hashing.hash_password(data.get('password'))),
            name=data.get('name'),
            role=data.get('role', ConfigProvider.COMMONER_ROLE)
        )

    def to_dict(self, include_hashed_password=False) -> dict:
        user_dict = {
            'username': self.username,
            'name': self.name,
            'role': self.role
        }
        if include_hashed_password:
            user_dict['hashed_password'] = self.hashed_password
        return user_dict
