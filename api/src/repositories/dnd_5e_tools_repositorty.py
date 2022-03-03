from typing import List

import requests
from threading import Thread


class DnD5eToolsRepository:

    def __init__(self) -> None:
        self._base_url = 'https://5e.tools/data/'

    def _get_json(self, url: str) -> dict:
        # It blocks the requests without user agent
        return requests.get(f'{self._base_url}{url}', headers={
            'User-Agent': 'Custom'
        }).json()

    def get_data(self) -> dict:
        return {
            'bestiary': self._get_bestiary(),
            'spells': self._get_spells()
        }

    def _complete_monsters_threaded(self, source: str, destiny: dict) -> None:
        destiny[source] = self._get_json(f'/bestiary/{source}').get('monster', [])

    def _get_bestiary(self) -> dict:
        index = self._get_json('/bestiary/index.json')
        monsters_per_source = dict()
        threads = []
        for name, source in index.items():
            thread = Thread(target=self._complete_monsters_threaded, args=[source, monsters_per_source])
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        bestiary = dict()
        for source, monsters in monsters_per_source.items():
            for monster in monsters:
                bestiary[f'{monster["name"].lower()}_{monster["source"].lower()}'] = monster
        return bestiary

    def _complete_spells_threaded(self, source: str, destiny: dict) -> None:
        destiny[source] = self._get_json(f'/spells/{source}').get('spell', [])

    def _get_spells(self) -> dict:
        index = self._get_json('/spells/index.json')
        spells_per_source = dict()
        threads = []
        for name, source in index.items():
            thread = Thread(target=self._complete_spells_threaded, args=[source, spells_per_source])
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        spells = dict()
        for source, source_spells in spells_per_source.items():
            for spell in source_spells:
                spells[f'{spell["name"].lower()}_{spell["source"].lower()}'] = spell
        return spells
