import json
from contextlib import closing

from mysql import connector

from app import db, Config
from app.api.procedures import execute_procedure


def get_view_info(view_name):
    for view in get_readonly_json():
        if view["table"] == view_name:
            return view


def get_readonly_json():
    with open("app/config/readonly.json") as f:
        data = json.load(f)
        return data


def read_view(view_name):
    table = get_view_info(view_name)
    if not table:
        return execute_procedure(view_name)
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = f"SELECT * FROM {view_name}"
            print(f"Executing: {query}")
            cursor.execute(query)
            res = [tuple(table["columns"])]
            [res.append(data) for data in cursor]
    return res, None