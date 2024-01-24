import os
from typing import Optional

from src.config_provider import ConfigProvider
from src.utils.undefined import UNDEFINED


class ChangelogRepository:
    _changelog: Optional[str] = UNDEFINED

    def get(self) -> Optional[str]:
        if ChangelogRepository._changelog == UNDEFINED or ConfigProvider.RELOAD_CHANGELOG_ON_EACH_REQUEST:
            self._load_changelog()
        return ChangelogRepository._changelog

    @classmethod
    def _load_changelog(cls) -> None:
        if not os.path.exists(ConfigProvider.CHANGELOG_PATH):
            ChangelogRepository._changelog = None
        with open(ConfigProvider.CHANGELOG_PATH, 'r') as f:
            ChangelogRepository._changelog = f.read()
