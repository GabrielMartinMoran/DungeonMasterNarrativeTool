from src.exceptions.model_validation_exception import ModelValidationException
from src.utils.id_generator import IdGenerator


class Gift:

    def __init__(self, gift_id: str, name: str, detail: str, username: str = None, claimer: str = None) -> None:
        self._gift_id = gift_id
        self._name = name
        self._detail = detail
        self._claimer = claimer
        self._username = username

    @property
    def gift_id(self) -> str:
        return self._gift_id

    @property
    def name(self) -> str:
        return self._name

    @property
    def detail(self) -> str:
        return self._detail

    @property
    def claimer(self) -> str:
        return self._claimer

    @property
    def username(self) -> str:
        return self._username

    def to_dict(self) -> dict:
        return {
            'gift_id': self.gift_id,
            'name': self.name,
            'detail': self.detail,
            'claimer': self.claimer,
            'username': self.username
        }

    @staticmethod
    def from_dict(data: dict) -> 'Gift':
        return Gift(
            gift_id=data.get('gift_id', IdGenerator.generate_unique_id()),
            name=data.get('name'),
            detail=data.get('detail'),
            claimer=data.get('claimer'),
            username=data.get('username')
        )

    def validate(self) -> None:
        if not self.gift_id or not isinstance(self.gift_id, str):
            raise ModelValidationException('gift_id is not valid')
        if not self.name or not isinstance(self.name, str):
            raise ModelValidationException('name is not valid')
        if self.detail and not isinstance(self.detail, str):
            raise ModelValidationException('detail is not valid')
        if self.claimer and not isinstance(self.claimer, str):
            raise ModelValidationException('claimer is not valid')
        if self.username and not isinstance(self.username, str):
            raise ModelValidationException('username is not valid')
