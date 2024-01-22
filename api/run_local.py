import os.path
import secrets

import yaml

from src import app
from src.config_provider import ConfigProvider

JWT_SECRET_SIZE = 32


def get_yaml_config_path() -> str:
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'local_config.yml')


def is_yaml_config() -> bool:
    return os.path.isfile(get_yaml_config_path())


def generate_default_yaml_config() -> dict:
    data = {
        'port': ConfigProvider.APP_PORT,
        'use_local_db': True,
        'db_url': None,
        'db_port': None,
        'db_name': ConfigProvider.DB_NAME,
        'jws_secret': secrets.token_urlsafe(JWT_SECRET_SIZE)
    }
    with open(get_yaml_config_path(), 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
    return data


def load_yaml_config() -> dict:
    with open(get_yaml_config_path(), 'r') as f:
        return yaml.safe_load(f)


def patch_config() -> None:
    pass


def main() -> None:
    if not is_yaml_config():
        config = generate_default_yaml_config()
        print(f'Generada configuración local en {get_yaml_config_path()}')
        print(f'Por favor modifique este archivo en caso de querer cambiar alguna configuración')
    else:
        config = load_yaml_config()
        print(f'Se obtuvo la configuración local desde {get_yaml_config_path()}')
    print(config)

    # patch_config()
    app.run(False, ConfigProvider.APP_PORT)


if __name__ == '__main__':
    main()
