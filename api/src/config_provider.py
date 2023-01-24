import os
from distutils.util import strtobool


class ConfigProvider:
    # DATABASE
    DB_URL = os.environ.get('DB_URL', 'mongodb://root:pass@localhost:27017')
    DB_PORT = os.environ.get('DB_PORT', None)
    DB_NAME = 'DMNarrativeTools'

    APP_INFO_COLLECTION = 'app'
    LAST_MIGRATION_APP_INFO_KEY = 'lastMigration'
    LAST_MIGRATION_APP_INFO_DATE = 'lastMigrationDate'

    RUN_DEBUG_MODE = os.environ.get('DEBUG_MODE', 'False').lower() == 'true'
    USE_RELOADER = os.environ.get('USE_RELOADER', 'False').lower() == 'true'
    APP_PORT = os.environ.get('PORT', 5000)
    JWT_SECRET = os.environ.get('JWT_SECRET', 'jwt_insecure_secret')
    CLIENT_APP_FOLDER = 'web'
    ASSETS_FOLDER = 'assets'
    USE_LOCAL_DEBUGGING_DB = strtobool(os.environ.get('USE_LOCAL_DEBUGGING_DB', 'false'))

    IMGUR_CLIENT_ID = os.environ.get('IMGUR_CLIENT_ID', None)
    IMGUR_CLIENT_SECRET = os.environ.get('IMGUR_CLIENT_SECRET', None)

    COMMONER_ROLE = 'commoner'
    ADMIN_ROLE = 'admin'

    DEFAULT_ERROR_IMAGE_URL = os.environ.get('DEFAULT_ERROR_IMAGE_URL', 'https://i.imgur.com/VBygx4F.png')
