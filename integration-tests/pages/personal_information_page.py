import time

from selenium.webdriver.common.by import By

from .base_page import BasePage


class PersonalInformationPage(BasePage):
  VALID_HOME_ADDRESS = "Carmichael Park Rd, Carmichael, CA 95608, USA"
  EMAIL = BasePage.get_random_string(3) + "@gmail.com"
  INVALID_HOME_ADDRESS = "123 Street Rd, Phoenix, AZ 12345, USA"
  INVALID_DRIVER_LICENSE = "DL!234"
  INVALID_FORMATTED_DOB = "31011993"
  INVALID_AGE_LIMIT_DOB = "01312015"
  INVALID_EMAIL = "tomAtaaa.com"
  INVALID_DATE_OF_BIRTH = "Must be 23 years or older to subscribe";

  PHONE_ERROR_MESSAGE = "Please enter a valid phone number"
  VERIFICATION_CODE_ERROR_MESSAGE = "Verification Code does not match"
  EMPTY_FIRST_NAME_ERROR_MESSAGE = "First Name length must be more than 1 character"
  EMPTY_LAST_NAME_ERROR_MESSAGE = "Last Name length must be more than 1 character"
  EMPTY_ADDRESS_ERROR_MESSAGE = "Home Address must be a valid street address"
  EMPTY_DRIVING_LICENSE_ERROR_MESSAGE = "Driver License Number must not be empty"
  EMPTY_DRIVING_LICENSE_STATE_ERROR_MESSAGE = "Driver's License State must be a valid US state."
  INVALID_DOB_MESSAGE = "Date of birth is not valid"
  EMPTY_EMAIL_ERROR_MESSAGE = "Email address must not be empty"

  EMPTY_FIELD_ERRORS = (
    "First Name length must be more than 1 character",
    "Last Name length must be more than 1 character",
    "Home Address must be a valid street address",
    "Driver License Number must not be empty",
    "Driver's License State must be a valid US state.",
    "Date of birth is not valid", "Email address must not be empty")

  INVALID_FIELD_ERRORS = ("First Name should not contain numbers or special characters",
                          "Last Name should not contain numbers or special characters",
                          "This address is not currently eligible for Car Subscription",
                          "Driver's License Number must be valid",
                          "Driver's License State must be a valid US state.",
                          "Date of birth is not valid", "Email address is invalid")

  def fill_out_personal_information(self):
    self.set_first_name(self.get_random_string(5))
    self.set_last_name(self.get_random_string(5))
    self.set_home_address_fields(self.VALID_HOME_ADDRESS)
    self.set_driver_license("DL12345")
    self.select_state("CA")
    self.set_date_of_birth("12051987")
    self.set_email(self.EMAIL)
    self.set_phone_number("9786754678")
    self.check_agree_terms()
    self.submit_personal_information_section()
    self.set_verification_code(5, 5, 5, 5, 5)

  def set_verification_code(self, digit1, digit2, digit3, digit4, digit5):
    self.set_element_text('verify-code-1', digit1, By.ID)
    self.set_element_text('verify-code-2', digit2, By.ID)
    self.set_element_text('verify-code-3', digit3, By.ID)
    self.set_element_text('verify-code-4', digit4, By.ID)
    self.set_element_text('verify-code-5', digit5, By.ID)

  def set_first_name(self, value):
    self.set_element_text('personFirstName', value, By.ID)

  def set_last_name(self, value):
    self.set_element_text('personLastName', value, By.ID)

  def set_driver_license(self, value):
    self.set_element_text('driversLicense', value, By.ID)

  def select_state(self, visible_text):
    self.select_from_drop_down_by_visible_text('.subscribe-step-detail-2 #duration', visible_text)

  def set_date_of_birth(self, value):
    self.set_element_text('dob', value, By.ID)

  def set_email(self, value):
    self.set_element_text('email', value, By.ID)

  def set_phone_number(self, value):
    self.set_element_text('phone', value, By.ID)

  def submit_personal_information_section(self):
    self.scroll_to(1200)
    ele = self.wait_for_element_clickable('#accordion__body-2 .subscribe-step-details .submit-options button')
    ele.click()
    # Buffering sometime for Twilio number verification

  def check_agree_terms(self):
    self.scroll_to(1200)
    ele = self.wait_for_element_clickable('agree-to-terms', By.ID)
    if not ele.is_selected():
      ele.click()

  def un_check_agree_terms(self):
    self.scroll_to(1200)
    ele = self.wait_for_element_clickable('agree-to-terms', By.ID)
    if ele.is_selected():
      ele.click()

  def set_home_address_fields(self, value):
    self.set_element_text('#accordion__body-2 .places-autocomplete input', value)

  def validate_empty_field_errors(self):
    elements = self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)
    elements_with_error_messages = self.map_to_error_messages(elements)
    self.validate_field_errors(elements_with_error_messages, self.EMPTY_FIELD_ERRORS)

  def validate_invalid_field_errors(self):
    self.scroll_to(700)
    # FIXME Adding a sleep here, some how the error messages are not getting captured here without sleep, this needs to be resolved
    time.sleep(7)
    elements = self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)
    elements_with_error_messages = self.map_to_error_messages(elements)
    self.validate_field_errors(elements_with_error_messages, self.INVALID_FIELD_ERRORS)

  def map_to_error_messages(self, elements):
    elements_with_error_messages = tuple(map(self.get_element_text, elements))
    return elements_with_error_messages

  def fill_invalid_data(self):
    self.set_first_name(self.get_random_alphanumeric_string(10))
    self.set_last_name(self.get_random_alphanumeric_string(10))
    self.set_home_address_fields(self.INVALID_HOME_ADDRESS)
    self.set_driver_license(self.INVALID_DRIVER_LICENSE)
    self.set_date_of_birth(self.INVALID_FORMATTED_DOB)
    self.set_email(self.INVALID_EMAIL)
    self.submit_personal_information_section()

  def validate_personal_information(self):
    self.check_agree_terms()
    self.submit_personal_information_section()
    self.test_case.assertEquals(self.get_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text,
                                self.PHONE_ERROR_MESSAGE)
    self.set_phone_number("3123195682")
    self.submit_personal_information_section()
    self.set_verification_code(5, 5, 5, 5, 5)
    self.submit_personal_information_section()
    self.validate_empty_field_errors()
    self.fill_invalid_data()
    self.validate_invalid_field_errors()

  def validate_date_of_birth(self):
    self.fill_out_personal_information()
    self.set_date_of_birth(self.INVALID_AGE_LIMIT_DOB)
    self.submit_personal_information_section()
    self.scroll_to(900)
    self.test_case.assertEquals(self.get_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text,
                                self.INVALID_DATE_OF_BIRTH)
    self.set_date_of_birth("11111990")
    self.submit_personal_information_section()
