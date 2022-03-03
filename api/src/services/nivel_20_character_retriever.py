from src.repositories.nivel_20_character_repository import Nivel20CharacterRepository


class Nivel20CharacterRetriever:

    def __init__(self) -> None:
        self._nivel_20_character_repository = Nivel20CharacterRepository()

    def get_character(self, character_id: str) -> dict:
        return self._nivel_20_character_repository.get_character(character_id)
