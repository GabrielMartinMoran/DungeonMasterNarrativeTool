from typing import List

from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.models.narrative_context import NarrativeContext
from src.repositories.narrative_context_repository import NarrativeContextRepository


class NarrativeContextRetriever:

    def __init__(self, narrative_context_repository: NarrativeContextRepository) -> None:
        self._narrative_context_repository = narrative_context_repository

    def get(self, username: str, narrative_context_id: str) -> NarrativeContext:
        owner = self._narrative_context_repository.get_owner(narrative_context_id)
        if owner != username and not self._narrative_context_repository.is_shared(username, narrative_context_id):
            raise PermissionError()
        return self._narrative_context_repository.get(owner, narrative_context_id)

    def get_shared_usernames(self, username: str, narrative_context_id: str) -> List[str]:
        owner = self._narrative_context_repository.get_owner(narrative_context_id)
        if owner is None:
            raise ElementNotFoundException()
        if owner != username:
            raise PermissionError()
        return self._narrative_context_repository.list_users_shared(narrative_context_id)
