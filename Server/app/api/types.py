from contextlib import closing

from mysql import connector

from app import db, Config


# TODO Refactor

def get_bus_types():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT DISTINCT type FROM bus_types"
            cursor.execute(query)
            all = []
            for bus_type in cursor:
                all.append((bus_type[0], bus_type[0]))
    return [{
        'name': '%all%',
        'values': all
    }]


def get_preferred_drivers():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT passport_data, driver_name, bus, is_attributed FROM drivers_attributed_to_buses"
            cursor.execute(query)
            attributed = []
            non_attributed = []
            for passport, name, bus, is_attributed in cursor:
                if is_attributed == 'Приписан':
                    attributed.append((passport, f"{passport} ({name}; Автобус - {bus})"))
                else:
                    non_attributed.append((passport, f"{passport} ({name})"))
    return [{
        'name': 'Приписаны',
        'values': attributed
    }, {
        'name': 'Свободны',
        'values': non_attributed
    }]


def get_preferred_buses():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT bus_number, type, passport, is_attributed FROM buses_attributed_to_drivers"
            cursor.execute(query)
            attributed = []
            non_attributed = []
            for bus_number, type, passport, is_attributed in cursor:
                if is_attributed == 'Приписан':
                    attributed.append((bus_number, f"{bus_number} ({type}, Приписан к {passport})"))
                else:
                    non_attributed.append((bus_number, f"{bus_number} ({type})"))
    return [{
        'name': 'Приписаны',
        'values': attributed
    }, {
        'name': 'Свободны',
        'values': non_attributed
    }]


def get_day_drivers():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT passport_data, driver_name, is_assigned  FROM drivers_in_day_schedule"
            cursor.execute(query)
            assigned = []
            not_assigned = []
            missing = []
            for passport, name, is_assigned in cursor:
                if is_assigned == 'Назначен':
                    assigned.append((passport, f"{passport} ({name})"))
                elif is_assigned == 'Не назначен':
                    not_assigned.append((passport, f"{passport} ({name})"))
                else:
                    missing.append((passport, f"{passport} ({name})"))
    return [{
        'name': 'Назначены',
        'values': assigned
    }, {
        'name': 'Не назначены',
        'values': not_assigned
    }, {
        'name': 'Отсутствуют',
        'values': missing
    }]


def get_day_buses():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT bus_number, type, passport, bus_status  FROM buses_in_day_schedule"
            cursor.execute(query)
            assigned = []
            not_assigned = []
            broken = []
            for bus_number, bus_type, passport, bus_status in cursor:
                if bus_status == 'Приписан':
                    assigned.append((bus_number, f"{bus_number} ({bus_type}; Приписан к {passport})"))
                elif bus_status == 'Свободен':
                    not_assigned.append((bus_number, f"{bus_number} ({bus_type})"))
                else:
                    broken.append((bus_number, f"{bus_number} ({bus_type})"))
    return [{
        "name": 'Приписаны',
        'values': assigned
    }, {
        'name': 'Свободны',
        'values': not_assigned,
    }, {
        'name': 'Сломаны',
        'values': broken
    }, {
        'name': '',
        'values': [('NULL', 'NULL')]
    }]


def get_drivers():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT DISTINCT passport_data, driver_name FROM drivers"
            cursor.execute(query)
            res = []
            for passport, name in cursor:
                res.append((passport, f"{passport} ({name})"))
    return [{
        'name': '%all%',
        'values': res
    }]


def get_buses():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT DISTINCT bus_number, type FROM buses"
            cursor.execute(query)
            res = []
            for bus, bus_type in cursor:
                res.append((bus, f"{bus}({bus_type})"))
    return [{
        'name': '%all%',
        'values': res
    }]


def get_preferred_routes():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT route, total FROM routes_assigned"
            cursor.execute(query)
            covered = []
            not_covered = []
            for route, total in cursor:
                if total != 0:
                    covered.append((route, f"{route} (Водителей - {total})"))
                else:
                    not_covered.append((route, f"{route} (Водителей  нет)"))
    return [{
        "name": "Покрытые",
        "values": covered
    }, {
        "name": "Непокрытые",
        "values": not_covered
    }]


def get_day_routes():
    with closing(connector.connect(**Config.MYSQL_SETTINGS)) as db_local:
        with closing(db_local.cursor()) as cursor:
            query = "SELECT route, total FROM routes_assigned_today"
            cursor.execute(query)
            covered = []
            not_covered = []
            for route, total in cursor:
                if total != 0:
                    covered.append((route, f"{route} (Водителей - {total})"))
                else:
                    not_covered.append((route, f"{route} (Водителей  нет)"))
    return [{
        "name": "Покрытые",
        "values": covered
    }, {
        "name": "Непокрытые",
        "values": not_covered
    }]