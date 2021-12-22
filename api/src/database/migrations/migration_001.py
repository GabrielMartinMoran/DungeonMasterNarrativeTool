import pymongo

from src.database.migrations.base_migration import BaseMigration


class Migration001(BaseMigration):
    MIGRATION_NUMBER = 1

    USERS_COLLECTION = 'users'
    DBS_COLLECTION = 'databases'

    def apply_migration(self):
        self.create_collections([self.USERS_COLLECTION, self.DBS_COLLECTION])
        # Creamos el indice a users
        self.database[self.USERS_COLLECTION].create_index(
            [('username', pymongo.TEXT)])
        # Creamos el indice a databases
        self.database[self.DBS_COLLECTION].create_index(
            [('user_id', pymongo.TEXT)])
