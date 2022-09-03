import pymongo

from src.database.migrations.base_migration import BaseMigration


class Migration001(BaseMigration):
    MIGRATION_NUMBER = 1

    USERS_COLLECTION = 'users'
    NARRATIVE_CONTEXTS = 'narrative_contexts'
    SHARED_NARRATIVE_CONTEXTS = 'shared_narrative_contexts'

    def apply_migration(self):
        self.create_collections([self.USERS_COLLECTION, self.NARRATIVE_CONTEXTS, self.SHARED_NARRATIVE_CONTEXTS])
        # Creamos el indice a users
        self.database[self.USERS_COLLECTION].create_index(
            [('username', pymongo.TEXT)])

        # Creamos los indices a narrative contexts
        self.database[self.NARRATIVE_CONTEXTS].create_index([
            ('username', pymongo.TEXT), ('narrative_context_id', pymongo.TEXT)
        ])

        # Creamos los indices a shared narrative contexts
        self.database[self.SHARED_NARRATIVE_CONTEXTS].create_index([
            ('username', pymongo.TEXT), ('narrative_context_id', pymongo.TEXT)
        ])
