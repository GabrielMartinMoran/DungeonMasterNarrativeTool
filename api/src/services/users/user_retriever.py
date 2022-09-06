from typing import List

from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.models.user import User
from src.repositories.user_repository import UserRepository


class UserRetriever:

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    def list(self) -> List[User]:
        return self._user_repository.list()

    def get(self, username: str) -> User:
        user = self._user_repository.get(username)
        if user is None:
            raise ElementNotFoundException()
        return user
