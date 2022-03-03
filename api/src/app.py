import gzip
import os
import json

from flask import Flask, request, send_from_directory, make_response, Response, jsonify
from flask_cors import CORS
from flask_compress import Compress

from src.database.db_migrator import DBMigrator
from src.models.token import Token
from src.repositories.imgur_repository import ImgurRepository
from src.repositories.user_database_repository import UserDatabaseRepository
from src.repositories.user_repository import UserRepository
from src.config_provider import ConfigProvider
from src.services.bd_lightener import DBLightener
from src.services.dnd_5e_data_updater import DnD5EDataUpdater
from src.services.nivel_20_character_retriever import Nivel20CharacterRetriever
from src.utils import http_methods, hashing

app = Flask(__name__, static_folder='./web')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
compress = Compress(app)


@app.before_request
def before_request_callback():
    # Decoding body
    request.decoded_json = None
    if request.data:
        if getattr(request, 'content_encoding') == 'gzip':
            request.decoded_json = json.loads(gzip.decompress(request.data))
        else:
            request.decoded_json = request.json

    # Token
    request.token = None
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return
    try:
        request.token = Token.from_jwt(auth_header)
    except Exception as e:
        print(e)


@app.route('/api/auth/login', methods=[http_methods.POST])
def login():
    repo = UserRepository()
    user = repo.get_by_credentials(
        request.decoded_json.get('username'),
        hashing.hash_password(request.decoded_json.get('password'))
    )
    if user:
        return jsonify({
            'token': Token.from_user(user).to_jwt()
        })
    return jsonify({
        'message': 'Forbidden'
    }), 403


@app.route('/api/database', methods=[http_methods.GET])
def get_user_database():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    repo = UserDatabaseRepository()
    database = repo.get(request.token.username)
    return jsonify(database)


@app.route('/api/database', methods=[http_methods.POST])
def save_user_database():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    enlightned = DBLightener(UserDatabaseRepository(), ImgurRepository()).enlight_and_save(request.token.username,
                                                                                           request.decoded_json)
    return jsonify({
        'reload_suggested': enlightned
    })


@app.route('/api/dnd_5e/data', methods=[http_methods.GET])
def get_dnd_5e_data():
    return jsonify(DnD5EDataUpdater().get_data())


@app.route('/api/dnd_5e/characters/<string:character_id>', methods=[http_methods.GET])
def get_dnd_5e_character(character_id: str):
    return jsonify(Nivel20CharacterRetriever().get_character(character_id))


@app.route('/', defaults={
    'path': ''
})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath(ConfigProvider.CLIENT_APP_FOLDER)  # path react build
    if path != '' and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path, max_age=-1)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html', max_age=-1)


def on_starting(server):
    print('Starting app')
    DBMigrator().run_migrations()


def run(debug: bool, port: int):
    on_starting(None)
    app.run(debug=debug, port=port)
