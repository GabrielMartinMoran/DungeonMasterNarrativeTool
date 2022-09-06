import json
import re
from typing import List

from src.models.narrative_context import NarrativeContext
from src.repositories.imgur_repository import ImgurRepository
from src.repositories.narrative_context_repository import NarrativeContextRepository
from src.repositories.user_database_repository import UserDatabaseRepository


class NarrativeContextModifier:

    def __init__(self, narrative_context_repository: NarrativeContextRepository,
                 imgur_repository: ImgurRepository) -> None:
        self._narrative_context_repository = narrative_context_repository
        self._imgur_repository = imgur_repository

    def save(self, narrative_context: NarrativeContext) -> bool:
        """
        Returns true in case of enlighting data
        """

        owner = self._narrative_context_repository.get_owner(narrative_context.narrative_context_id)

        if owner is not None and owner != narrative_context.username:
            raise PermissionError()

        was_enlightened = self._enlight(narrative_context)

        if owner is None:
            self._narrative_context_repository.create(narrative_context)
        else:
            self._narrative_context_repository.update(narrative_context)

        return was_enlightened

    def _enlight(self, narrative_context: NarrativeContext) -> bool:
        dumped = json.dumps(narrative_context.narrative_categories)
        images = self._get_base64_images(dumped)
        for img in images:
            try:
                uploaded_url = self._imgur_repository.upload_img(img)
                dumped = dumped.replace(img, uploaded_url)
            except Exception as e:
                print(f'An error has occurred while updating image. Skipping: {str(e)}')
        narrative_context.narrative_categories = json.loads(dumped)
        return len(images) > 0

    @classmethod
    def _get_base64_images(cls, serialized: str) -> List[str]:
        pattern = r'src=\\\"(data:image\/[^;]+;base64[^\"]+)\\\"'
        return re.findall(pattern, serialized)
