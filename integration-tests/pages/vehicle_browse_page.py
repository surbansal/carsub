
from selenium.webdriver.common.by import By

from .base_page import BasePage


class VehicleBrowsePage(BasePage):

  def get_all_vehicles(self):
    return self.wait_for_presence_of_all_elements("list-item", By.CLASS_NAME)

  def get_all_inactive_vehicles(self):
    return self.wait_for_presence_of_all_elements(By.CLASS_NAME, "list-item unavailable")

  def select_vehicle(self, vehicle_number):
    ele = self.wait_for_element_clickable("div.vehicle-list > div:nth-child({0})".format(vehicle_number))
    ele.click()
    self.check_successful_redirection_to_page("/details")
