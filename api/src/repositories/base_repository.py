from pymongo import MongoClient

from src.config_provider import ConfigProvider
from src.repositories.local_db_repository import LocalDBRepository


class BaseRepository:
    COLLECTION_NAME = None
    _MONGO_CLIENT_INSTANCE = None
    _local_db_repository_instance = None

    def __init__(self):
        if ConfigProvider.USE_LOCAL_DEBUGGING_DB:
            if not BaseRepository._local_db_repository_instance:
                BaseRepository._local_db_repository_instance = LocalDBRepository()
            self.data_base = BaseRepository._local_db_repository_instance
            self.collection = self.get_collection()
        else:
            if not BaseRepository._MONGO_CLIENT_INSTANCE:
                BaseRepository._MONGO_CLIENT_INSTANCE = MongoClient(ConfigProvider.DB_URL, int(ConfigProvider.DB_PORT))
            self.data_base = BaseRepository._MONGO_CLIENT_INSTANCE[ConfigProvider.DB_NAME]
            self.collection = self.get_collection()

    def get_collection(self):
        return self.data_base[self.COLLECTION_NAME]
