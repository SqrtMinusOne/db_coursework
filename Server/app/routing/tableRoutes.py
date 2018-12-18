from flask import request, jsonify

from app import app
from app.api.tables import *


@app.route('/table')
def table():
    req_data = request.args
    table, types = read_table(req_data['table_name'])
    data = json.dumps(table, indent=4, sort_keys=True, default=str)
    return jsonify({"ok": True, "data": data, "types": types})


@app.route('/table_alter', methods=['POST'])
def table_change():
    req_data = request.get_json()
    try:
        save_table(req_data['table'], req_data['data'])
    except Exception as exp:
        db.rollback()
        return jsonify({"ok": False, "message": str(exp)})
    db.commit()
    return jsonify({"ok": True})