from src.exceptions.user_already_exists_exception import UserAlreadyExistsException
from src.models.user import User
from src.repositories.user_repository import UserRepository


class UserCreator:

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    def create(self, user: User) -> None:
        if self._user_repository.get(user.username) is not None:
            raise UserAlreadyExistsException()
        self._user_repository.create(user)
