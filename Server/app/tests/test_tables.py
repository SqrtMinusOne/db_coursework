import unittest
from pprint import pprint
from app import db
from app.api.tables import *

cursor = db.cursor()


class DataBaseTest(unittest.TestCase):
    def test_get_tables(self):
        tables = get_readwrite_json()
        self.assertIsNotNone(tables)
        self.assertGreater(len(tables), 0)

    def test_read_table(self):
        buses = read_table("buses")
        self.assertIsNotNone(buses)

    def test_describe_table(self):
        desc = describe_table_or_view("buses")
        self.assertIsNotNone(desc)