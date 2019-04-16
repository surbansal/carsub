import time

from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class DeliveryOptionsPage(BasePage):
  INVALID_DELIVERY_ADDRESS = "123 Street Rd, Phoenix, AZ 12345, USA"
  INVALID_DELIVERY_ADDRESS_ERROR = "Delivery Address must be a valid street address"
  EMPTY_DELIVERY_TIME_ERROR = "Delivery time must not be empty"

  EMPTY_FIELD_ERRORS = ("Delivery date must not be empty", "Delivery time must not be empty")

  # INVALID_FIELD_ERRORS = ("")

  def validate_empty_field_errors(self):
    elements_with_error_messages = tuple(
      map(self.get_element_text, self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)))
    self.validate_field_errors(elements_with_error_messages, self.EMPTY_FIELD_ERRORS)

  def fill_out_preferred_delivery_options(self):
    self.preferred_delivery_options_select_date()
    self.preferred_delivery_options_select_timeframe()
    self.submit_delivery_preferences()

  def validate_delivery_options(self):
    time.sleep(4)
    self.submit_delivery_preferences()
    # time.sleep(5)
    # FIXME Adding a sleep here, some how the error messages are not getting captured here without sleep, this needs to be resolved
    self.validate_empty_field_errors()
    self.preferred_delivery_options_select_date()
    self.submit_delivery_preferences()
    self.test_case.assertEquals(self.get_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text,
                                self.EMPTY_DELIVERY_TIME_ERROR)
    self.preferred_delivery_options_select_timeframe()
    self.uncheck_deliver_to_my_home_address()
    self.submit_delivery_preferences()
    self.test_case.assertEquals(self.get_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text,
                                self.INVALID_DELIVERY_ADDRESS_ERROR)
    self.check_deliver_to_my_home_address()

  def check_deliver_to_my_home_address(self):
    ele = self.wait_for_element_clickable('deliver-to-home-address', By.ID)
    if not ele.is_selected():
      ele.click()

  def uncheck_deliver_to_my_home_address(self):
    ele = self.wait_for_element_clickable('deliver-to-home-address', By.ID)
    if ele.is_selected():
      ele.click()

  def set_delivery_address_fields(self, value):
    self.set_element_text('.places-autocomplete:nth-child(1) > .location-search-input', value)

  def preferred_delivery_options_select_timeframe(self):
    self.scroll_to(400)
    ele = self.wait_for_element_clickable('.time-frame:nth-child(1)')
    # Fix Me : find a way to avoid this sleep
    time.sleep(4)
    ele.click()

  def preferred_delivery_options_select_delivery_address_button(self):
    ele = self.wait_for_element_clickable('//input[@type=\'checkbox\'][@name=\'dayTime\']', By.XPATH)
    ele.click()

  def preferred_delivery_options_select_delivery_address(self, value):
    ele = self.wait_for_element('//*[@id=\'accordion__body-3\']/div/div[3]/div[1]/input', By.XPATH)
    ele.send_keys(value)

  def preferred_delivery_options_select_date(self):
    ele = self.wait_for_element_clickable('.day-slide:nth-child(1)')
    time.sleep(2)
    ele.click()

  def submit_delivery_preferences(self):
    self.scroll_to(1000)
    ele = self.wait_for_element_clickable('//button[text()=\'Submit Delivery Preferences\']', By.XPATH)
    ele.click()
#
# def validate_invalid_field_errors(self):
#   elements_with_error_messages = tuple(
#     map(self.get_element_text, self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)))
#   self.validate_field_errors(elements_with_error_messages, self.INVALID_FIELD_ERRORS)
