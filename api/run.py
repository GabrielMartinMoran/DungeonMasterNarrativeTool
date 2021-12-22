from src import app
from src.config_provider import ConfigProvider

if __name__ == '__main__':
    app.run(ConfigProvider.RUN_DEBUG_MODE, ConfigProvider.APP_PORT)
