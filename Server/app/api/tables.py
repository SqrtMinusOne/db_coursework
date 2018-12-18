from app import db
import json


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


def read_table(table_name):
    cursor = db.cursor()
    table = get_table_info(table_name)
    if not table:
        raise Exception(f"Invalid table name: {table_name}")
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)
    res = [tuple(table["columns"])]
    [res.append(data) for data in cursor]
    cursor.close()
    return res