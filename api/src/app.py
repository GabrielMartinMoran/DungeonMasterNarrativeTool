from flask import Flask, request, send_from_directory, make_response, Response, jsonify
from flask_cors import CORS
from flask_compress import Compress

from src.database.db_migrator import DBMigrator
from src.models.token import Token
from src.repositories.user_database_repository import UserDatabaseRepository
from src.repositories.user_repository import UserRepository
from src.config_provider import ConfigProvider
from src.utils import http_methods, hashing

app = Flask(__name__, static_folder='./web')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
compress = Compress(app)


@app.before_request
def before_request_callback():
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
        request.json.get('username'),
        hashing.hash_password(request.json.get('password'))
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
    repo = UserDatabaseRepository()
    repo.set(request.token.username, request.json)
    return jsonify({})


@app.route('/', methods=[http_methods.GET])
@compress.compressed()
def root():
    return send_from_directory(ConfigProvider.CLIENT_APP_FOLDER, 'index.html', max_age=-1)


@app.route('/<path:path>', methods=[http_methods.GET])
@compress.compressed()
def static_file(path):
    return send_from_directory(ConfigProvider.CLIENT_APP_FOLDER, path, max_age=-1)


def on_starting(server):
    print('Starting app')
    DBMigrator().run_migrations()


def run(debug: bool, port: int):
    on_starting(None)
    app.run(debug=debug, port=port)
