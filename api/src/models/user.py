from src.utils import hashing


class User:

    def __init__(self, username: str, hashed_password: str, name: str) -> None:
        self._username = username
        self._hashed_password = hashed_password
        self._name = name

    @property
    def username(self) -> str:
        return self._username

    @property
    def hashed_password(self) -> str:
        return self._hashed_password

    @property
    def name(self) -> str:
        return self._name

    @staticmethod
    def from_dict(data: dict) -> 'User':
        return User(
            username=data.get('username'),
            hashed_password=data.get('hashed_password', hashing.hash_password(data.get('password'))),
            name=data.get('name')
        )

    def to_dict(self, include_hashed_password=False) -> dict:
        user_dict = {
            'username': self.username,
            'name': self.name
        }
        if include_hashed_password:
            user_dict['hashed_password'] = self.hashed_password
        return user_dict
