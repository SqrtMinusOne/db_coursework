import unittest
from pprint import pprint

from app import db
import json

cursor = db.cursor()


class DataBaseTest(unittest.TestCase):
    def test_connection(self):
        self.assertIsNotNone(db)
        self.assertIsNotNone(cursor)

    def test_tables(self):
        query = "SHOW TABLES;"
        cursor.execute(query)
        i = 0
        for data in cursor:
            i += 1
        self.assertGreater(i, 0)

    def test_json(self):
        with open('../config/description.json') as file:
            data = json.load(file)
        self.assertIsNotNone(data)

    def test_a_table(self):
        query = "SELECT class, coef FROM class_coef"
        cursor.execute(query)
        for data in cursor:
            print(data)

