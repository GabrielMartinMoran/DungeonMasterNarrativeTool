import requests

from src.repositories.dnd_5e_tools_repositorty import DnD5eToolsRepository


class DnD5EDataUpdater:

    def __init__(self) -> None:
        self._5e_repo = DnD5eToolsRepository()

    def get_data(self) -> dict:
        return self._5e_repo.get_data()