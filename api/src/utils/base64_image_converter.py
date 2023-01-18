import base64
from io import BytesIO

from PIL import Image


class Base64ImageConverter:

    @classmethod
    def to_png(cls, base64_img: str) -> str:
        in_buffer = BytesIO(base64.b64decode(base64_img))
        img = Image.open(in_buffer)

        out_buffer = BytesIO()
        img.save(out_buffer, 'png')
        base64_out_img = base64.b64encode(out_buffer.getvalue())
        return base64_out_img.decode()
