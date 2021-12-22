import sys
import os
import datetime
from pymongo import MongoClient

from src.config_provider import ConfigProvider
from src.database.migrations.migration_001 import Migration001


class DBMigrator:
    MIGRATIONS = [
        Migration001
    ]

    def __init__(self):
        self.collection = None
        self.db = None
        self.client = None
        self.app_info = None
        self.load_collection()
        self.load_app_info()

    def run_migrations(self):
        print('Running DB migrations:')
        self.MIGRATIONS.sort(key=lambda x: x.MIGRATION_NUMBER)
        for x in self.MIGRATIONS:
            common_msg = F'migration {x.MIGRATION_NUMBER} from {self.get_migration_filename(x)}'
            if x.MIGRATION_NUMBER <= self.get_last_applied_migration():
                print(F' ‣ Skipping {common_msg}')
            else:
                print(F' ‣ Applying {common_msg}')
                self.apply_migration(x)
        print('\n\n')

    def load_collection(self):
        self.client = MongoClient(ConfigProvider.DB_URL, int(ConfigProvider.DB_PORT))
        self.db = self.client[ConfigProvider.DB_NAME]
        self.collection = self.db[ConfigProvider.APP_INFO_COLLECTION]

    def load_app_info(self):
        self.app_info = self.collection.find_one({})

    def get_last_applied_migration(self):
        if self.app_info:
            return self.app_info[ConfigProvider.LAST_MIGRATION_APP_INFO_KEY]
        return 0

    def apply_migration(self, migration_class):
        migration_class().apply_migration()
        self.update_to_last_migration(migration_class.MIGRATION_NUMBER)

    def update_to_last_migration(self, last_migration_number):
        json = {
            ConfigProvider.LAST_MIGRATION_APP_INFO_KEY: last_migration_number,
            ConfigProvider.LAST_MIGRATION_APP_INFO_DATE: datetime.datetime.now()
        }
        if self.app_info:
            self.collection.update_one({
                '_id': self.app_info['_id']
            }, {
                "$set": json
            })
        else:
            self.collection.insert_one(json)
            self.app_info = json

    def get_migration_filename(self, migration_class):
        return os.path.split(sys.modules[migration_class.__module__].__file__)[1]
