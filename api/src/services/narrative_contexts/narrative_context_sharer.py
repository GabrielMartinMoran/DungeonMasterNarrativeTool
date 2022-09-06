import json
import re
from typing import List

from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.models.narrative_context import NarrativeContext
from src.repositories.imgur_repository import ImgurRepository
from src.repositories.narrative_context_repository import NarrativeContextRepository
from src.repositories.user_database_repository import UserDatabaseRepository
from src.repositories.user_repository import UserRepository


class NarrativeContextSharer:

    def __init__(self, narrative_context_repository: NarrativeContextRepository,
                 user_repository: UserRepository) -> None:
        self._narrative_context_repository = narrative_context_repository
        self._user_repository = user_repository

    def share(self, username: str, username_to_share: str, narrative_context_id: str) -> None:
        if username == username_to_share:
            raise AssertionError()

        owner = self._narrative_context_repository.get_owner(narrative_context_id)

        if owner is None:
            raise ElementNotFoundException()

        if owner != username:
            raise PermissionError()

        if self._user_repository.get(username_to_share) is None:
            raise ElementNotFoundException()

        if not self._narrative_context_repository.is_shared(username_to_share, narrative_context_id):
            self._narrative_context_repository.share(username_to_share, narrative_context_id)

    def unshare(self, username: str, username_to_unshare: str, narrative_context_id: str) -> None:
        if username == username_to_unshare:
            raise AssertionError()

        owner = self._narrative_context_repository.get_owner(narrative_context_id)

        if owner is None:
            raise ElementNotFoundException()

        if owner != username:
            raise PermissionError()

        if self._user_repository.get(username_to_unshare) is None:
            raise ElementNotFoundException()

        if self._narrative_context_repository.is_shared(username_to_unshare, narrative_context_id):
            self._narrative_context_repository.unshare(username_to_unshare, narrative_context_id)
