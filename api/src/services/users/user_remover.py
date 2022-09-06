from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.repositories.user_repository import UserRepository


class UserRemover:

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    def delete(self, username: str) -> None:
        if self._user_repository.get(username) is None:
            raise ElementNotFoundException()
        self._user_repository.delete(username)
