from typing import List

from src.config_provider import ConfigProvider
from src.models.user import User
from src.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository):
    USERS_COLLECTION_NAME = 'users'
    NARRATIVE_CONTEXTS_COLLECTION_NAME = 'narrative_contexts'
    SHARED_NARRATIVE_CONTEXTS_COLLECTION_NAME = 'shared_narrative_contexts'

    def __init__(self) -> None:
        super().__init__()
        self._users_collection = self.data_base[self.USERS_COLLECTION_NAME]
        self._narrative_contexts_collection = self.data_base[self.NARRATIVE_CONTEXTS_COLLECTION_NAME]
        self._shared_narrative_contexts_collection = self.data_base[self.SHARED_NARRATIVE_CONTEXTS_COLLECTION_NAME]

    def get(self, username: str) -> User:
        user = self._users_collection.find_one({
            'username': username
        })
        if user:
            return User.from_dict(user)
        return None

    def get_by_credentials(self, username: str, hashed_password: str) -> User:
        user = self._users_collection.find_one({
            'username': username,
            'hashed_password': hashed_password
        })
        if user:
            return User.from_dict(user)
        return None

    def get_role(self, username: str) -> str:
        item = self._users_collection.find_one({
            'username': username
        }, {
            'role': 1
        })
        if item is None or item.get('role') is None:
            return ConfigProvider.COMMONER_ROLE
        return item['role']

    def list(self) -> List[User]:
        items = self._users_collection.find({})
        return [User.from_dict(x) for x in items]

    def set_password(self, username: str, hashed_password: str) -> None:
        self._users_collection.update_one(
            {
                'username': username
            },
            {
                '$set': {
                    'hashed_password': hashed_password
                }
            }
        )

    def set_name(self, username: str, name: str) -> None:
        self._users_collection.update_one(
            {
                'username': username
            },
            {
                '$set': {
                    'name': name
                }
            }
        )

    def create(self, user: User) -> None:
        self._users_collection.insert_one(user.to_dict(include_hashed_password=True))

    def delete(self, username: str) -> None:
        self._users_collection.delete_one({'username': username})
        self._narrative_contexts_collection.delete_many({'username': username})
        self._shared_narrative_contexts_collection.delete_many({'username': username})
