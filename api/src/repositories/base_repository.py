from pymongo import MongoClient

from src.config_provider import ConfigProvider


class BaseRepository:
    COLLECTION_NAME = None
    _MONGO_CLIENT_INSTANCE = None

    def __init__(self):
        if not BaseRepository._MONGO_CLIENT_INSTANCE:
            BaseRepository._MONGO_CLIENT_INSTANCE = MongoClient(ConfigProvider.DB_URL, int(ConfigProvider.DB_PORT))
        self.data_base = BaseRepository._MONGO_CLIENT_INSTANCE[ConfigProvider.DB_NAME]
        self.collection = self.get_collection()

    def get_collection(self):
        return self.data_base[self.COLLECTION_NAME]
