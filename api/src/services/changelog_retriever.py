from typing import Optional

from src.repositories.changelog_repository import ChangelogRepository


class ChangelogRetriever:

    def __init__(self, changelog_repository: ChangelogRepository) -> None:
        self._changelog_repository = changelog_repository

    def get(self) -> Optional[str]:
        return self._changelog_repository.get()
