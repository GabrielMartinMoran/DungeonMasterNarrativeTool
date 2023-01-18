import re
from hashlib import md5
from typing import Optional

from imgurpython import ImgurClient

# https://apidocs.imgur.com/
# https://github.com/Imgur/imgurpython
from src.config_provider import ConfigProvider
from src.utils.base64_image_converter import Base64ImageConverter


class ImgurRepository:
    _client: ImgurClient = None
    _already_uploaded_cache = dict()
    _FORMATS_TO_CONVERT_TO_PNG = ['webp']

    def __init__(self) -> None:
        if not ImgurRepository._client:
            ImgurRepository._client = ImgurClient(ConfigProvider.IMGUR_CLIENT_ID, ConfigProvider.IMGUR_CLIENT_SECRET)

    def upload_img(self, base64_img: str) -> str:
        hashed = self._get_img_hash(base64_img)
        if hashed not in ImgurRepository._already_uploaded_cache:
            result = self._upload_img(base64_img)
            ImgurRepository._already_uploaded_cache[hashed] = result.get('link')
        return ImgurRepository._already_uploaded_cache[hashed]

    @classmethod
    def _get_img_hash(cls, base64_img: str) -> str:
        return md5(base64_img.encode()).hexdigest()

    @classmethod
    def _get_image_format(cls, base64_img: str) -> Optional[str]:
        match = re.search(r'data:image/(\w+);base64,', base64_img)
        if match and len(match.groups()) > 0:
            return match.group(1)
        return None

    @classmethod
    def _upload_img(cls, base64_img: str, config=None, anon=True):
        if not config:
            config = dict()
        image_str = re.sub(rf'data:image/(\w+);base64,', '', base64_img)
        image_format = cls._get_image_format(base64_img)
        if image_format in cls._FORMATS_TO_CONVERT_TO_PNG:
            image_str = Base64ImageConverter.to_png(image_str)
        data = {
            'image': image_str.encode(),
            'type': 'base64',
        }
        data.update({meta: config[meta] for meta in
                     set(ImgurRepository._client.allowed_image_fields).intersection(config.keys())})

        return ImgurRepository._client.make_request('POST', 'upload', data, anon)
