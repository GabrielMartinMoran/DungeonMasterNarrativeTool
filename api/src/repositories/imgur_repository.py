import base64
from hashlib import md5

from imgurpython import ImgurClient

# https://apidocs.imgur.com/
# https://github.com/Imgur/imgurpython
from src.config_provider import ConfigProvider


class ImgurRepository:
    _client: ImgurClient = None
    _already_uploaded_cache = dict()

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

    def _upload_img(self, base64_img: str, config=None, anon=True):
        if not config:
            config = dict()
        data = {
            'image': base64_img.replace('data:image/png;base64,', '').encode(),
            'type': 'base64',
        }
        data.update({meta: config[meta] for meta in
                     set(ImgurRepository._client.allowed_image_fields).intersection(config.keys())})

        return ImgurRepository._client.make_request('POST', 'upload', data, anon)
