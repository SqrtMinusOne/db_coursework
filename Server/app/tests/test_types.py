import unittest
from pprint import pprint
from app import db
from app.api.types import *

cursor = db.cursor()


class DataBaseTest(unittest.TestCase):
    def test_get_bus_types(self):
        bus_types = get_bus_types()
        self.assertGreater(len(bus_types), 1)
