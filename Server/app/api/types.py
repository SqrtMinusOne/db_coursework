from app import db


def get_bus_types():
    cursor = db.cursor()
    query = "SELECT DISTINCT type FROM bus_types"
    cursor.execute(query)
    res = []
    for bus_type in cursor:
        res.append(bus_type[0])
    return res