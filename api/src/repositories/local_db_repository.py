import json
import os
from typing import List, Callable


class LocalDBRepository:
    _DB_DIR = './local_db'
    _DB_PATH = os.path.join(_DB_DIR, 'db.json')
    _db = None

    def __init__(self) -> None:
        if not os.path.exists(self._DB_PATH):
            self._db = dict()
            os.makedirs(self._DB_DIR)
            self._write_db()
        else:
            self._load_db()

    def _write_db(self) -> None:
        with open(self._DB_PATH, 'w') as f:
            f.flush()
            f.seek(0)
            to_serialize = {
                k: v.serialize() for k, v in self.db.items()
            }
            f.write(json.dumps(to_serialize, indent=2, default=str))

    def _load_db(self) -> None:
        with open(self._DB_PATH, 'r') as f:
            deserialized = json.load(f)
            self._db = {
                k: LocalDBCollection(v, self._write_db) for k, v in deserialized.items()
            }

    @property
    def db(self) -> dict:
        return self._db

    def create_collection(self, collection_name: str) -> None:
        self._db[collection_name] = LocalDBCollection([], self._write_db)
        self._write_db()

    def __getitem__(self, key: str) -> 'LocalDBCollection':
        return self.db[key]


class LocalDBCollection:

    def __init__(self, collection_data: List[dict], on_collection_change: Callable) -> None:
        self._data = collection_data
        self._on_collection_change = on_collection_change

    def serialize(self) -> List[dict]:
        return self._data

    @classmethod
    def _get_search_keys(cls, data: dict, filter_clause: dict) -> dict:
        return {k: v for k, v in data.items() if k in filter_clause.keys()}

    def create_index(self, indexes: List[dict]) -> None:
        pass

    def find(self, filter_clause: dict) -> List[dict]:
        return [x for x in self._data if self._get_search_keys(x, filter_clause) == filter_clause]

    def find_one(self, filter_clause: dict) -> dict:
        obtained = self.find(filter_clause)
        if len(obtained) > 0:
            return obtained[0]
        return None

    def count_documents(self, filter_clause: dict) -> int:
        return len(self.find(filter_clause))

    def insert_one(self, data: dict) -> None:
        self._data.append(data)
        self._on_collection_change()

    def update_one(self, filter_clause: dict, data: dict) -> None:
        to_update = self.find_one(filter_clause)
        if not to_update:
            raise Exception('Local DB element not found')
        to_update.update(data.get('$set'))
        self._on_collection_change()
