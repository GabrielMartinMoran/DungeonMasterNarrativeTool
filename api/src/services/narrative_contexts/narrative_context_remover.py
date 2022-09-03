from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.repositories.narrative_context_repository import NarrativeContextRepository


class NarrativeContextRemover:

    def __init__(self, narrative_context_repository: NarrativeContextRepository) -> None:
        self._narrative_context_repository = narrative_context_repository

    def delete(self, username: str, narrative_context_id: str) -> None:
        owner = self._narrative_context_repository.get_owner(narrative_context_id)
        if owner is None:
            raise ElementNotFoundException()
        if owner != username:
            raise PermissionError()
        self._narrative_context_repository.delete(narrative_context_id)
