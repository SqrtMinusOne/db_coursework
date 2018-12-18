import unittest
from pprint import pprint
from app import db
from app.api.tables import *

cursor = db.cursor()


class DataBaseTest(unittest.TestCase):
    def test_get_tables(self):
        tables = get_tables_info()
        self.assertIsNotNone(tables)
        self.assertGreater(len(tables), 0)

    def test_check_tables(self):
        self.assertTrue(check_table("buses"))
        self.assertFalse(check_table("b1uses"))

    def test_read_table(self):
        buses = read_table("buses")
        self.assertIsNotNone(buses)

    def test_describe_table(self):
        desc = describe_table("buses")
        self.assertIsNotNone(desc)