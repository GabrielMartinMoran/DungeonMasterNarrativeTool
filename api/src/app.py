import gzip
import os
import json

from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from flask_compress import Compress

from src.database.db_migrator import DBMigrator
from src.models.narrative_context import NarrativeContext
from src.models.token import Token
from src.repositories.imgur_repository import ImgurRepository
from src.repositories.narrative_context_repository import NarrativeContextRepository
from src.repositories.user_database_repository import UserDatabaseRepository
from src.repositories.user_repository import UserRepository
from src.config_provider import ConfigProvider
from src.services.narrative_contexts.narrative_context_modifier import NarrativeContextModifier
from src.services.dnd_5e_data_updater import DnD5EDataUpdater
from src.services.narrative_contexts.narrative_context_remover import NarrativeContextRemover
from src.services.narrative_contexts.narrative_context_retriever import NarrativeContextRetriever
from src.services.narrative_contexts.narrative_context_sharer import NarrativeContextSharer
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


@app.route('/api/narrative_contexts', methods=[http_methods.GET])
def list_narrative_contexts():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    repo = NarrativeContextRepository()
    narrative_contexts = repo.list(request.token.username)
    return jsonify([x.to_dict() for x in narrative_contexts])


@app.route('/api/narrative_contexts/shared', methods=[http_methods.GET])
def list_shared_narrative_contexts():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    repo = NarrativeContextRepository()
    narrative_contexts = repo.list_shared(request.token.username)
    return jsonify([x.to_dict() for x in narrative_contexts])


@app.route('/api/narrative_contexts/<string:narrative_context_id>', methods=[http_methods.GET])
def get_narrative_context(narrative_context_id: str):
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    service = NarrativeContextRetriever(NarrativeContextRepository())
    narrative_context = service.get(request.token.username, narrative_context_id)
    return jsonify(narrative_context.to_dict())


@app.route('/api/narrative_contexts', methods=[http_methods.POST])
def save_narrative_contexts():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    narrative_context = NarrativeContext.from_dict({
        **request.decoded_json,
        **{
            'username': request.token.username
        }
    })
    enlightened = NarrativeContextModifier(NarrativeContextRepository(), ImgurRepository()).save(narrative_context)
    return jsonify({
        'reload_suggested': enlightened
    })


@app.route('/api/narrative_contexts/<string:narrative_context_id>', methods=[http_methods.DELETE])
def delete_narrative_context(narrative_context_id: str):
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    service = NarrativeContextRemover(NarrativeContextRepository())
    service.delete(request.token.username, narrative_context_id)
    return jsonify({})


@app.route('/api/narrative_contexts/shared/<string:narrative_context_id>', methods=[http_methods.GET])
def get_narrative_context_shared_users(narrative_context_id: str):
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    service = NarrativeContextRetriever(NarrativeContextRepository())
    usernames = service.get_shared_usernames(request.token.username, narrative_context_id)
    return jsonify(usernames)


@app.route('/api/narrative_contexts/share', methods=[http_methods.POST])
def share_narrative_context():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    NarrativeContextSharer(NarrativeContextRepository(), UserRepository()).share(
        request.token.username,
        request.decoded_json['username'],
        request.decoded_json['narrative_context_id']
    )
    return jsonify({})

@app.route('/api/narrative_contexts/unshare', methods=[http_methods.POST])
def unshare_narrative_context():
    if not request.token:
        return jsonify({
            'message': 'Forbidden'
        }), 403
    NarrativeContextSharer(NarrativeContextRepository(), UserRepository()).unshare(
        request.token.username,
        request.decoded_json['username'],
        request.decoded_json['narrative_context_id']
    )
    return jsonify({})


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
