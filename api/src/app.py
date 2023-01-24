import functools
import gzip
import json
from typing import Optional, Tuple

from flask import Flask, request as flask_request, send_from_directory, Response, send_file
from flask_cors import CORS
from flask_compress import Compress
from pymodelio.exceptions import ModelValidationException

from src.database.db_migrator import DBMigrator
from src.exceptions.element_not_found_exception import ElementNotFoundException
from src.models.token import Token
from src.services.users.user_role_retriever import UserRoleRetriever
from src.utils import router

app = Flask(__name__, static_folder='./web')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
compress = Compress(app)


def _get_request_token() -> Optional[Token]:
    auth_header = flask_request.headers.get('Authorization')
    if not auth_header:
        return
    try:
        return Token.from_jwt(auth_header)
    except Exception as e:
        print(e)
        return None


def _get_body() -> dict:
    if not flask_request.data:
        return {}
    if getattr(flask_request, 'content_encoding') == 'gzip':
        return json.loads(gzip.decompress(flask_request.data))
    else:
        return flask_request.json


def _handle_error(e: Exception) -> Tuple[Response, int]:
    print(e)
    if isinstance(e, PermissionError):
        return jsonify({
            'type': 'permission_error',
            'message': 'Forbidden'
        }), 403
    if isinstance(e, ElementNotFoundException):
        return jsonify({
            'type': 'element_not_found_error',
            'message': 'Bad request'
        }), 400
    if isinstance(e, ModelValidationException):
        return jsonify({
            'type': 'validation_error',
            'message': str(e)
        }), 400
    return jsonify({
        'type': 'server_error',
        'message': 'Internal server error'
    }), 500


def _check_permissions(token: Optional[Token], auth_required: bool, admin_required: bool) -> None:
    if token is None and (auth_required or admin_required):
        raise PermissionError()
    if admin_required and not UserRoleRetriever(UserRepository()).is_admin(token.username):
        raise PermissionError()


def _route(path: str, http_method: str, auth_required: bool = True, admin_required: bool = False):
    def outer(endpoint_method):
        @app.route(path, methods=[http_method])
        @functools.wraps(endpoint_method)
        def inner(*f_args, **f_kwargs):
            request = Request(token=_get_request_token(), body=_get_body())
            try:
                _check_permissions(request.token, auth_required, admin_required)
                return endpoint_method(request, *f_args, **f_kwargs)
            except Exception as e:
                return _handle_error(e)

        return inner

    return outer


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath(ConfigProvider.CLIENT_APP_FOLDER)  # path react build
    if path != '' and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path, max_age=-1)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html', max_age=-1)


# Set router 'route' method with the decorator defined here based on the app
router.route = _route

# Import routes here because first we have to set router.route
from src.routes import *


def on_starting(server):
    print('Starting app')
    DBMigrator().run_migrations()


def run(debug: bool, port: int):
    on_starting(None)
    app.run(debug=debug, port=port)
