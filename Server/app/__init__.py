import threading

from flask import Flask
from mysql import connector
from app.config.config import Config
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = connector.connect(**Config.MYSQL_SETTINGS)
lock = threading.Lock()


def reconnect():
    global db
    db = connector.connect(**Config.MYSQL_SETTINGS)


@app.route('/')
def hello_world():
    return 'Hello World!'


from app.routing import tableViewRoutes, typeRoutes
