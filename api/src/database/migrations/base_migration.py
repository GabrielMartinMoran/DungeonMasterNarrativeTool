from pymongo import MongoClient

from src.config_provider import ConfigProvider
from src.repositories.local_db_repository import LocalDBRepository


class BaseMigration:
    MIGRATION_NUMBER = None
    _local_db_repository_instance = None

    def __init__(self):
        self.client = None
        self.database = None
        self.connect_to_db()

    def apply_migration(self):
        pass

    def connect_to_db(self):
        if ConfigProvider.USE_LOCAL_DEBUGGING_DB:
            BaseMigration._local_db_repository_instance = LocalDBRepository()
            self.database = BaseMigration._local_db_repository_instance
        else:
            self.client = MongoClient(ConfigProvider.DB_URL, int(ConfigProvider.DB_PORT))
            self.database = self.client[ConfigProvider.DB_NAME]

    def create_collection(self, collection_name):
        self.database.create_collection(collection_name)

    def create_collections(self, collections_names):
        for collection in collections_names:
            self.create_collection(collection)
