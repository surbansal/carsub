#!/usr/bin/python

import unittest

from pages.vehicle_browse_page import VehicleBrowsePage


class BrowseCarTest(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.browse_page = VehicleBrowsePage()

  def test_list_cars(self):
    self.browse_page.navigate("/browse")
    lists = self.browse_page.get_all_vehicles()
    total_vehicles = len(lists)
    for vehicle_number in range(1, total_vehicles):
      self.browse_page.select_vehicle(vehicle_number)
      self.browse_page.go_to_previous_window()
    self.browse_page.check_successful_redirection_to_page("/browse")


if __name__ == '__main__':
  unittest.main()
