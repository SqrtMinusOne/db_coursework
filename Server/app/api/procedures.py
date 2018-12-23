from contextlib import closing

from mysql import connector

import threading

from app import db, Config
import json


class NotEnoughArgsException(Exception):
    pass


def get_procedures_json():
    with open("app/config/procedures.json") as f:
        data = json.load(f)
        return data


def get_procedure_info(proc_name):
    for procedure in get_procedures_json():
        if procedure["procedure"] == proc_name:
            return procedure


def execute_procedure(proc_name, args=None):
    # print(f"Received req to execute {proc_name} ")
    from app import lock
    with lock:
        # print("Started one")
        if args is None:
            args = []
        proc = get_procedure_info(proc_name)
        if not proc:
            raise Exception(f"Invalid name: {proc_name}")
        query = f"CALL {proc_name}(  "
        if len(args) != len(proc["args"]):
            raise NotEnoughArgsException("Invalid argument list length")
        with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
            with closing(db_local.cursor()) as cursor:
                for arg in args:
                    query += f"'{arg}', "
                query = query[:-2] + ")"
                print(f"Executing: {query}")
                cursor.execute(query)
                res = None
                if len(proc["columns"]) > 0:
                    res = [tuple(proc["columns"])]
                    [res.append(data) for data in cursor]
                if db_local.is_connected():
                    db_local.commit()
        # print("Finished one")

    return res, None