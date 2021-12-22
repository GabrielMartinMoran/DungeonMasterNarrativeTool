from src.models.user import User
from src.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository):
    COLLECTION_NAME = 'users'

    def get(self, username: str) -> User:
        user = self.collection.find_one({
            'username': username
        })
        if user:
            return User.from_dict(user)
        return None

    def get_by_credentials(self, username: str, hashed_password: str) -> User:
        user = self.collection.find_one({
            'username': username,
            'hashed_password': hashed_password
        })
        if user:
            return User.from_dict(user)
        return None
