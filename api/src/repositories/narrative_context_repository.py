from typing import List, Optional

from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.models.narrative_context import NarrativeContext
from src.models.narrative_context_reference import NarrativeContextReference
from src.repositories.base_repository import BaseRepository


class NarrativeContextRepository(BaseRepository):
    NARRATIVE_CONTEXTS_COLLECTION_NAME = 'narrative_contexts'
    SHARED_NARRATIVE_CONTEXTS_COLLECTION_NAME = 'shared_narrative_contexts'

    def __init__(self) -> None:
        super().__init__()
        self._narrative_contexts_collection = self.data_base[self.NARRATIVE_CONTEXTS_COLLECTION_NAME]
        self._shared_narrative_contexts_collection = self.data_base[self.SHARED_NARRATIVE_CONTEXTS_COLLECTION_NAME]

    def list(self, username: str) -> List[NarrativeContext]:
        """
        :param username:
        :return: Returns a list of the user's narrative contexts
        """
        items = self._narrative_contexts_collection.find(
            {
                # Filter
                'username': username,
            },
            {
                # Fields to get
                'username': 1,
                'narrative_context_id': 1,
                'type': 1,
                'name': 1
            }
        )
        return [NarrativeContext.from_dict(x) for x in items]

    def get(self, username: str, narrative_context_id: str) -> NarrativeContext:
        item = self._narrative_contexts_collection.find_one({
            'username': username,
            'narrative_context_id': narrative_context_id
        })
        if not item:
            raise ElementNotFoundException()
        return NarrativeContext.from_dict(item)

    def get_owner(self, narrative_context_id: str) -> Optional[str]:
        """
        This method is intended to validate if a narrative context can be updated
        :param narrative_context_id:
        :return: Returns the username of the owner. If the narrative context does not exist, ir returns None
        """
        item = self._narrative_contexts_collection.find_one(
            {
                # Filter
                'narrative_context_id': narrative_context_id
            },
            {
                # Fields to get
                'username': 1
            }
        )
        if not item:
            return None
        return item['username']

    def list_shared(self, username: str) -> List[NarrativeContext]:
        """
        :param username:
        :return: Returns a list of narrative contexts shared with the provided user
        """
        items = self._shared_narrative_contexts_collection.find(
            {
                # Filter
                'username': username,
            },
            {
                # Fields to get
                'username': 1,
                'narrative_context_id': 1
            }
        )
        narrative_contexts = []
        for item in items:
            narrative_context = self._narrative_contexts_collection.find_one(
                {
                    'narrative_context_id': item['narrative_context_id']
                }, {
                    # Fields to get
                    'username': 1,
                    'narrative_context_id': 1,
                    'type': 1,
                    'name': 1
                }
            )
            narrative_contexts.append(NarrativeContext.from_dict(narrative_context))
        return narrative_contexts

    def create(self, narrative_context: NarrativeContext) -> None:
        self._narrative_contexts_collection.insert_one(narrative_context.to_dict())

    def update(self, narrative_context: NarrativeContext) -> None:
        serialized = narrative_context.to_dict()
        for x in {'username', 'narrative_context_id'}:
            del serialized[x]
        self._narrative_contexts_collection.update_one(
            {
                'username': narrative_context.username,
                'narrative_context_id': narrative_context.narrative_context_id
            },
            {
                '$set': serialized
            }
        )

    def exists(self, narrative_context_id: str) -> bool:
        """
        :param narrative_context_id:
        :return: Returns true if that narrative context exists for provided user
        """
        count = self._narrative_contexts_collection.count_documents({
            'narrative_context_id': narrative_context_id
        })
        return count > 0

    def is_shared(self, username: str, narrative_context_id: str) -> bool:
        """
        :param username:
        :param narrative_context_id:
        :return: Returns true if the provided narrative context is shared with the provided user
        """
        count = self._shared_narrative_contexts_collection.count_documents(
            {
                'username': username,
                'narrative_context_id': narrative_context_id
            }
        )
        return count > 0

    def share(self, username: str, narrative_context_id: str) -> None:
        """
        Shares the provided narrative_context with the provided user
        :param username:
        :param narrative_context_id:
        """
        self._shared_narrative_contexts_collection.insert_one({
            'username': username,
            'narrative_context_id': narrative_context_id
        })

    def unshare(self, username: str, narrative_context_id: str) -> None:
        """
        Unshares the provided narrative_context with the provided user
        :param username:
        :param narrative_context_id:
        """
        self._shared_narrative_contexts_collection.delete_one({
            'username': username,
            'narrative_context_id': narrative_context_id
        })

    def delete(self, narrative_context_id: str) -> bool:
        self._narrative_contexts_collection.delete_one({
            'narrative_context_id': narrative_context_id
        })
        self._shared_narrative_contexts_collection.delete_many({
            'narrative_context_id': narrative_context_id
        })

    def list_users_shared(self, narrative_context_id: str) -> List[str]:
        """
        :param narrative_context_id:
        :return: Returns a list of uses with whom the narrative context is shared
        """
        items = self._shared_narrative_contexts_collection.find(
            {
                # Filter
                'narrative_context_id': narrative_context_id,
            },
            {
                # Fields to get
                'username': 1
            }
        )
        return [x['username'] for x in items]
