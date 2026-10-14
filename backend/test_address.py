import unittest

from app.api import parse_data


class ParseAddressTests(unittest.TestCase):
    def test_address_stops_before_next_phone_number(self):
        data = "Address: 12/3 sadada\n0919694768"
        result = parse_data(data)
        self.assertEqual(result["address"], ["12/3 sadada"])


if __name__ == "__main__":
    unittest.main()
