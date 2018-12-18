from flask import Flask
from mysql import connector
from app.config.config import Config

app = Flask(__name__)
db = connector.connect(**Config.MYSQL_SETTINGS)


@app.route('/')
def hello_world():
    return 'Hello World!'
