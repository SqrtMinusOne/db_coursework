from flask import request, jsonify
from mysql.connector import OperationalError

from app import app, reconnect
from app.api.procedures import NotEnoughArgsException, execute_procedure
from app.api.tables import *


def get_messages(msg_list):
    if not msg_list:
        return None
    res = "Сообщения: \n"
    for msg in msg_list:
        res += msg + "; \n"
    return res


@app.route('/table')
def table():
    def try_get():
        types = None
        try:
            data, types = read_table(req_data['table_name'])
        except NotEnoughArgsException:
            proc_name = req_data['table_name']
            del req_data['table_name']
            args = []
            for key, value in req_data.items():
                args.append(value)
            data, type = execute_procedure(proc_name, args)
        return data, types
    req_data = dict(request.args)
    try:
        data, types = try_get()
    except OperationalError:
        reconnect()
        data, types = try_get()
    except Exception as exp:
        return jsonify({"ok": False, "message": str(exp)})
    data = json.dumps(data, indent=4, sort_keys=True, default=str)
    return jsonify({"ok": True, "data": data, "types": types})


@app.route('/table_alter', methods=['POST'])
def table_change():
    req_data = request.get_json()
    try:
        res = save_table(req_data['table'], req_data['data'])
    except Exception as exp:
        return jsonify({"ok": False, "message": str(exp)})
    return jsonify({"ok": True, "message": get_messages(res)})
