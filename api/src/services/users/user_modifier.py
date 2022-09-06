from typing import List

from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.exceptions.model_validation_exception import ModelValidationException
from src.models.user import User
from src.repositories.user_repository import UserRepository
from src.utils.hashing import hash_password


class UserModifier:

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    def set_password(self, username: str, password: str) -> None:
        if self._user_repository.get(username) is None:
            raise ElementNotFoundException()
        if password is None:
            raise ModelValidationException('name must not be null')
        return self._user_repository.set_password(username, hash_password(password))

    def set_name(self, username: str, name: str) -> None:
        if self._user_repository.get(username) is None:
            raise ElementNotFoundException()
        if name is None:
            raise ModelValidationException('name must not be null')
        return self._user_repository.set_name(username, name)
