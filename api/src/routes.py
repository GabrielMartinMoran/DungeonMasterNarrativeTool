import os

from flask import jsonify, Response, send_file

from src.config_provider import ConfigProvider
from src.exceptions.user_already_exists_exception import UserAlreadyExistsException
from src.models.narrative_context import NarrativeContext
from src.models.token import Token
from src.models.user import User
from src.repositories.imgur_repository import ImgurRepository
from src.repositories.narrative_context_repository import NarrativeContextRepository
from src.repositories.user_repository import UserRepository
from src.services.narrative_contexts.narrative_context_modifier import NarrativeContextModifier
from src.services.dnd_5e_data_updater import DnD5EDataUpdater
from src.services.narrative_contexts.narrative_context_remover import NarrativeContextRemover
from src.services.narrative_contexts.narrative_context_retriever import NarrativeContextRetriever
from src.services.narrative_contexts.narrative_context_sharer import NarrativeContextSharer
from src.services.nivel_20_character_retriever import Nivel20CharacterRetriever
from src.services.users.user_creator import UserCreator
from src.services.users.user_modifier import UserModifier
from src.services.users.user_remover import UserRemover
from src.services.users.user_retriever import UserRetriever
from src.utils import http_methods, hashing
from src.utils.request import Request
from src.utils.router import route


@route('/api/health', http_methods.GET, auth_required=False)
def health(request: Request) -> Response:
    return jsonify({})


@route('/api/auth/login', http_methods.POST, auth_required=False)
def login(request: Request) -> Response:
    repo = UserRepository()
    user = repo.get_by_credentials(
        request.body.get('username'),
        hashing.hash_password(request.body.get('password'))
    )
    if user is None:
        raise PermissionError()
    return jsonify({
        'token': Token.from_user(user).to_jwt()
    })


@route('/api/auth/password', http_methods.PUT)
def change_logged_user_password(request: Request) -> Response:
    service = UserModifier(UserRepository())
    service.set_password(request.token.username, request.body['password'])
    return jsonify({})


@route('/api/narrative_contexts', http_methods.GET)
def list_narrative_contexts(request: Request) -> Response:
    repo = NarrativeContextRepository()
    narrative_contexts = repo.list(request.token.username)
    return jsonify([x.to_dict() for x in narrative_contexts])


@route('/api/narrative_contexts/shared', http_methods.GET)
def list_shared_narrative_contexts(request: Request) -> Response:
    repo = NarrativeContextRepository()
    narrative_contexts = repo.list_shared(request.token.username)
    return jsonify([x.to_dict() for x in narrative_contexts])


@route('/api/narrative_contexts/<string:narrative_context_id>', http_methods.GET)
def get_narrative_context(request: Request, narrative_context_id: str) -> Response:
    service = NarrativeContextRetriever(NarrativeContextRepository())
    narrative_context = service.get(request.token.username, narrative_context_id)
    return jsonify(narrative_context.to_dict())


@route('/api/narrative_contexts', http_methods.POST)
def save_narrative_contexts(request: Request) -> Response:
    narrative_context = NarrativeContext.from_dict({
        **request.body,
        **{
            'username': request.token.username
        }
    })
    enlightened = NarrativeContextModifier(NarrativeContextRepository(), ImgurRepository()).save(narrative_context)
    return jsonify({
        'reload_suggested': enlightened
    })


@route('/api/narrative_contexts/<string:narrative_context_id>', http_methods.DELETE)
def delete_narrative_context(request: Request, narrative_context_id: str) -> Response:
    service = NarrativeContextRemover(NarrativeContextRepository())
    service.delete(request.token.username, narrative_context_id)
    return jsonify({})


@route('/api/narrative_contexts/shared/<string:narrative_context_id>', http_methods.GET)
def get_narrative_context_shared_users(request: Request, narrative_context_id: str) -> Response:
    service = NarrativeContextRetriever(NarrativeContextRepository())
    usernames = service.get_shared_usernames(request.token.username, narrative_context_id)
    return jsonify(usernames)


@route('/api/narrative_contexts/share', http_methods.POST)
def share_narrative_context(request: Request) -> Response:
    NarrativeContextSharer(NarrativeContextRepository(), UserRepository()).share(
        request.token.username,
        request.body['username'],
        request.body['narrative_context_id']
    )
    return jsonify({})


@route('/api/narrative_contexts/unshare', http_methods.POST)
def unshare_narrative_context(request: Request) -> Response:
    NarrativeContextSharer(NarrativeContextRepository(), UserRepository()).unshare(
        request.token.username,
        request.body['username'],
        request.body['narrative_context_id']
    )
    return jsonify({})


@route('/api/dnd_5e/data', http_methods.GET)
def get_dnd_5e_data(request: Request) -> Response:
    return jsonify(DnD5EDataUpdater().get_data())


@route('/api/dnd_5e/characters/<string:character_id>', http_methods.GET)
def get_dnd_5e_character(request: Request, character_id: str) -> Response:
    return jsonify(Nivel20CharacterRetriever().get_character(character_id))


@route('/api/users', http_methods.GET, admin_required=True)
def list_users(request: Request) -> Response:
    service = UserRetriever(UserRepository())
    users = service.list()
    return jsonify([x.to_dict() for x in users])


@route('/api/users/password', http_methods.PUT, admin_required=True)
def set_user_password(request: Request) -> Response:
    service = UserModifier(UserRepository())
    service.set_password(request.body['username'], request.body['password'])
    return jsonify({})


@route('/api/users/name', http_methods.PUT, admin_required=True)
def set_user_name(request: Request) -> Response:
    service = UserModifier(UserRepository())
    service.set_name(request.body['username'], request.body['name'])
    return jsonify({})


@route('/api/users', http_methods.POST, admin_required=True)
def create_user(request: Request) -> Response:
    service = UserCreator(UserRepository())
    user = User.from_dict(request.body)
    try:
        service.create(user)
    except UserAlreadyExistsException as e:
        print(e)
        jsonify({
            'type': 'user_already_exists',
            'message': 'Bad request'
        }), 400
    return jsonify({})


@route('/api/users/logged', http_methods.GET)
def get_authenticated_user_info(request: Request) -> Response:
    service = UserRetriever(UserRepository())
    user = service.get(request.token.username)
    return jsonify(user.to_dict(include_hashed_password=False))


@route('/api/users/<string:username>', http_methods.DELETE, admin_required=True)
def delete_user(request: Request, username: str) -> Response:
    service = UserRemover(UserRepository())
    if username == request.token.username:
        return jsonify({
            'type': 'cant_delete_yourself',
            'message': 'Bad request'
        }), 400
    service.delete(username)
    return jsonify({})
