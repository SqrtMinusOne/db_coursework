from mysql import connector

from app import db, Config


def get_bus_types():
    db_local = connector.connect(**Config.MYSQL_SETTINGS)
    cursor = db_local.cursor()
    query = "SELECT DISTINCT type FROM bus_types"
    cursor.execute(query)
    res = []
    for bus_type in cursor:
        res.append((bus_type[0], bus_type[0]))
    cursor.close()
    db_local.disconnect()
    return res


def get_drivers():
    db_local = connector.connect(**Config.MYSQL_SETTINGS)
    cursor = db_local.cursor()
    query = "SELECT DISTINCT passport_data, driver_name FROM drivers"
    cursor.execute(query)
    res = []
    for passport, name in cursor:
        res.append((passport, f"{passport}({name})"))
    cursor.close()
    db_local.disconnect()
    return res


def get_buses():
    db_local = connector.connect(**Config.MYSQL_SETTINGS)
    cursor = db_local.cursor()
    query = "SELECT DISTINCT bus_number, type FROM buses"
    cursor.execute(query)
    res = []
    for bus, bus_type in cursor:
        res.append((bus, f"{bus}({bus_type})"))
    cursor.close()
    db_local.disconnect()
    return res