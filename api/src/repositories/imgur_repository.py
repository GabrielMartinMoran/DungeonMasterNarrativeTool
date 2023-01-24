import re
from hashlib import md5
from typing import Optional

from imgurpython import ImgurClient
from imgurpython.helpers.error import ImgurClientError

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
    def _remove_img_metadata(cls, base64_img: str) -> str:
        return re.sub(rf'data:image/(\w+);base64,', '', base64_img)

    def _upload_img(self, base64_img: str) -> dict:
        img_str = self._remove_img_metadata(base64_img)
        img_format = self._get_image_format(base64_img)
        if img_format in self._FORMATS_TO_CONVERT_TO_PNG:
            img_str = Base64ImageConverter.to_png(img_str)
        try:
            return self._post_img(img_str)
        except ImgurClientError as e:
            # If it fails, try again but converting the image
            print(f'Failed publishing an image, converting it to jpg: {e}')
            try:
                converted_img = Base64ImageConverter.to_jpeg(img_str)
                return self._post_img(converted_img)
            except Exception as e:
                print(f'Failed trying with the jpg converted image, returning the default error one: {e}')
                # If a second error occurs, return the default error image
                return {'link': ConfigProvider.DEFAULT_ERROR_IMAGE_URL}

    @classmethod
    def _post_img(cls, img: str, config: dict = None, anon: bool = True) -> dict:
        if config is None:
            _config = dict()
        data = {
            'image': img.encode(),
            'type': 'base64',
        }
        data.update({meta: _config[meta] for meta in
                     set(ImgurRepository._client.allowed_image_fields).intersection(_config.keys())})

        return ImgurRepository._client.make_request('POST', 'upload', data, anon)
