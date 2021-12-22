from src.repositories.base_repository import BaseRepository


class UserDatabaseRepository(BaseRepository):
    COLLECTION_NAME = 'databases'

    def get(self, username: str) -> dict:
        database = self.collection.find_one({
            'username': username
        })
        if database:
            return database['database']
        return {}

    def set(self, username: str, database: dict) -> None:
        if self._exists(username):
            self._update(username, database)
        else:
            self._create(username, database)

    def _exists(self, username: str) -> bool:
        return self.collection.count_documents({
            'username': username
        }) > 0

    def _create(self, username: str, database: dict) -> None:
        self.collection.insert_one({
            'username': username,
            'database': database
        })

    def _update(self, username: str, database: dict) -> None:
        self.collection.update_one(
            {
                'username': username
            },
            {
                '$set': {
                    'database': database
                }
            }
        )
