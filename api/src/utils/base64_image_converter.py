import base64
from io import BytesIO

from PIL import Image


class Base64ImageConverter:

    @classmethod
    def to_png(cls, base64_img: str) -> str:
        img = cls._load_base64_img(base64_img)
        return cls._to_base64_img(img, 'png')

    @classmethod
    def to_jpeg(cls, base64_img: str) -> str:
        img = cls._load_base64_img(base64_img)
        return cls._to_base64_img(img, 'jpeg')

    @classmethod
    def _load_base64_img(cls, base64_img: str) -> Image:
        in_buffer = BytesIO(base64.b64decode(base64_img))
        return Image.open(in_buffer)

    @classmethod
    def _to_base64_img(cls, image: Image, out_format: str) -> str:
        out_buffer = BytesIO()
        image.save(out_buffer, out_format)
        base64_out_img = base64.b64encode(out_buffer.getvalue())
        return base64_out_img.decode()
