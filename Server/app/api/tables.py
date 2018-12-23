from contextlib import closing

from mysql import connector

from app import db, Config
import json

from app.api.types import get_bus_types, get_drivers, get_buses, get_preferred_drivers, get_preferred_buses, \
    get_day_buses, get_day_drivers, get_preferred_routes, get_day_routes
from app.api.views import read_view


def get_readwrite_json():
    with open("app/config/readwrite.json") as f:
        data = json.load(f)
        return data


def get_table_info(table_name):
    for table in get_readwrite_json():
        if table["table"] == table_name:
            return table


def get_table_types(table_name):
    if table_name == 'buses':
        return [{
            "field": "Тип автобуса",
            "values": get_bus_types()
        }]
    if table_name == 'day_schedule':
        return[{
            "field": "Паспортные данные",
            "values": get_day_drivers()
        }, {
            "field": "Автобус",
            "values": get_day_buses()
        }, {
            "field": "№ маршрута",
            "values": get_day_routes()
        }]
    if table_name == 'preferred':
        return[{
            "field": "Паспортные данные",
            "values": get_preferred_drivers()
        }, {
            "field": "Автобус",
            "values": get_preferred_buses()
        }, {
            "field": "№ маршрута",
            "values": get_preferred_routes()
        }]


def describe_table_or_view(table_name):
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = f"DESCRIBE {table_name}"
            cursor.execute(query)
            field_names = []
            for field, type, null, key, default, extra in cursor:
                field_names.append(field)
    return field_names


def read_table(table_name):
    table = get_table_info(table_name)
    types = get_table_types(table_name)
    if not table:
        return read_view(table_name)
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = f"SELECT * FROM {table_name}"
            print(f"Executing: {query}")
            cursor.execute(query)
            res = [tuple(table["columns"])]
            [res.append(data) for data in cursor]
    return res, types


def delete_special_cases(table_name, old_row):
    return False


def save_table(table_name, data):
    old_table, types = read_table(table_name)
    if not old_table:
        raise Exception(f"Invalid table name: {table_name}")
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        table_header = describe_table_or_view(table_name)
        for old, new in zip(old_table[1:], data):
            row_changed = False
            # =============== Handle delete ===============
            if new == '%DELETE THIS%':
                if delete_special_cases(table_name, old):
                    continue
                with closing(db_local.cursor()) as cursor:
                    query = f"DELETE FROM {table_name} WHERE "
                    for column, old_value in zip(table_header, old):
                        if old_value is None:
                            continue
                        query += f"{column}='{old_value}' AND "
                    query = query[:-5]
                    print(f"Executing: {query}")
                    cursor.execute(query)
                continue
            for old_value, new_value in zip(old, new):
                if old_value != new_value:
                    row_changed = True
            # =============== Handle update ===============
            if row_changed:
                with closing(db_local.cursor()) as cursor:
                    query = f"UPDATE {table_name} SET "
                    where = "WHERE "
                    for column, old_value, new_value in zip(table_header, old, new):
                        query += f"{column}='{new_value}', "
                        if old_value is None:
                            continue
                        where += f"{column}='{old_value}' AND "
                    query = query[:-2] + " " + where[:-5]
                    print(f"Executing: {query}")
                    cursor.execute(query)
        # =============== Handle insert ===============
        if len(data) > (len(old_table) - 1):
            for new_row in data[len(old_table)-1:]:
                with closing(db_local.cursor()) as cursor:
                    query = f"INSERT INTO {table_name} VALUES ("
                    for value in new_row:
                        query += f"'{value}', "
                    query = query[:-2] + ")"
                    print(f"Executing: {query}")
                    cursor.execute(query)
        db_local.commit()


