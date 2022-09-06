from src.repositories.user_repository import UserRepository


class UserRoleRetriever:
    ADMIN_ROLE = 'admin'

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    def is_admin(self, username: str) -> bool:
        role = self._user_repository.get_role(username)
        return role == self.ADMIN_ROLE
