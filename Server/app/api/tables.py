from app import db
import json
import logging

from app.api.types import get_bus_types


def get_tables_info():
    with open("app/config/description.json") as f:
        data = json.load(f)
        return data


def check_table(table_name):
    for table in get_tables_info():
        if table["table"] == table_name:
            return True
    return False


def get_table_info(table_name):
    for table in get_tables_info():
        if table["table"] == table_name:
            return table


def get_table_types(table_name):
    if table_name == 'buses':
        return [{
            "field": "Тип автобуса",
            "values": get_bus_types()
        }]


def describe_table(table_name):
    cursor = db.cursor()
    query = f"DESCRIBE {table_name}"
    cursor.execute(query)
    field_names = []
    for field, type, null, key, default, extra in cursor:
        field_names.append(field)
    return field_names


def read_table(table_name):
    cursor = db.cursor()
    table = get_table_info(table_name)
    types = get_table_types(table_name)
    if not table:
        raise Exception(f"Invalid table name: {table_name}")
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)
    res = [tuple(table["columns"])]
    [res.append(data) for data in cursor]
    cursor.close()
    return res, types


def delete_special_cases(table_name, old_row):
    if table_name == 'buses':
        cursor = db.cursor()
        query = f"CALL delete_bus({old_row[0]})"
        cursor.execute(query)
        cursor.close()
        return True
    return False


def save_table(table_name, data):
    old_table, types = read_table(table_name)
    if not old_table:
        raise Exception(f"Invalid table name: {table_name}")
    table_header = describe_table(table_name)
    for old, new in zip(old_table[1:], data):
        row_changed = False
        # =============== Handle delete ===============
        if new == '%DELETE THIS%':
            if delete_special_cases(table_name, old):
                continue
            cursor = db.cursor()
            query = f"DELETE FROM {table_name} WHERE "
            for column, old_value in zip(table_header, old):
                query += f"{column}='{old_value}' AND "
            query = query[:-5]
            print(f"Executing: {query}")
            cursor.execute(query)
            cursor.close()
            continue
        for old_value, new_value in zip(old, new):
            if old_value != new_value:
                row_changed = True
        # =============== Handle update ===============
        if row_changed:
            cursor = db.cursor()
            query = f"UPDATE {table_name} SET "
            where = "WHERE "
            for column, old_value, new_value in zip(table_header, old, new):
                query += f"{column}='{new_value}', "
                where += f"{column}='{old_value}' AND "
            query = query[:-2] + " " + where[:-5]
            print(f"Executing: {query}")
            cursor.execute(query)
            cursor.close()
    # =============== Handle insert ===============
    if len(data) > (len(old_table) - 1):
        for new_row in data[len(old_table)-1:]:
            cursor = db.cursor()
            query = f"INSERT INTO {table_name} VALUES ("
            for value in new_row:
                query += f"'{value}', "
            query = query[:-2] + ")"
            print(f"Executing: {query}")
            cursor.execute(query)
            cursor.close()

