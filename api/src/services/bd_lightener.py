import json
import re
from typing import List

from src.repositories.imgur_repository import ImgurRepository
from src.repositories.user_database_repository import UserDatabaseRepository


class DBLightener:

    def __init__(self, user_database_repository: UserDatabaseRepository, imgur_repository: ImgurRepository) -> None:
        self._user_database_repository = user_database_repository
        self._imgur_repository = imgur_repository

    """
    Returns true in case of enlighting data
    """
    def enlight_and_save(self, username: str, db: dict) -> bool:
        dumped = json.dumps(db)
        images = self._get_base64_images(dumped)
        for img in images:
            try:
                uploaded_url = self._imgur_repository.upload_img(img)
                dumped = dumped.replace(img, uploaded_url)
            except Exception as e:
                print(f'An error has occurred while updating image. Skipping: {str(e)}')
        _db = json.loads(dumped)
        self._user_database_repository.set(username, _db)
        return len(images) > 0

    @classmethod
    def _get_base64_images(cls, serialized: str) -> List[str]:
        pattern = r'src=\\\"(data:image\/[^;]+;base64[^\"]+)\\\"'
        return re.findall(pattern, serialized)
