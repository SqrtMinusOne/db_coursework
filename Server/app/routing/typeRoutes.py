from flask import request, jsonify
from app import app
from app.api.types import *


type_switch = {
    'buses': get_bus_types,
    'drivers': get_drivers,
    'routes': get_routes,
    'points': get_points,
    'preferred_drivers': get_preferred_drivers,
    'preferred_buses': get_preferred_buses,
    'preferred_routes': get_preferred_routes,
    'day_drivers': get_day_drivers,
    'day_buses': get_day_buses,
    'day_routes': get_day_routes
}


def get_type_func(type_):
    func = type_switch.get(type_)
    return func()


@app.route('/types')
def types():
    req_data = dict(request.args)
    res = get_type_func(req_data['type'])
    if res:
        return jsonify({"ok": True, "types": res})
    return jsonify({"ok": False, "message": f"Can't get type {req_data['type']}"})