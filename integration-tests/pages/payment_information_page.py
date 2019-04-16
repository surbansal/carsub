import time
from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class PaymentInformationPage(BasePage):
  # Error messages for payment information
  CARD_INFORMATION_ERROR_MESSAGE = "Please enter valid card information to continue"
  BILLING_ADDRESS_ERROR_MESSAGE = "Billing Address must be a valid street address"
  AGREE_TERM_ERROR_MESSAGE = "You must agree to the terms and conditions"

  def fill_out_payment_details(self):
    self.set_credit_card_number("4242424242424242")
    self.set_expiration("1120")
    self.set_cvc("237")
    self.check_agree_terms_condition()

  def validate_payment_information_error_message(self):
    time.sleep(5)
    # FIXME need to remove this time, currently agree terms condition is not getting checked without this sleep
    self.check_agree_terms_condition()
    self.submit_reserve_car()
    self.scroll_to(400)
    self.test_case.assertEquals(self._get_error_message(), self.CARD_INFORMATION_ERROR_MESSAGE)
    self.set_credit_card_number("4242424242424242")
    self.submit_reserve_car()
    self.scroll_to(400)
    self.test_case.assertEquals(self._get_error_message(), self.CARD_INFORMATION_ERROR_MESSAGE)
    self.set_expiration("1120")
    self.submit_reserve_car()
    self.test_case.assertEquals(self._get_error_message(), self.CARD_INFORMATION_ERROR_MESSAGE)
    self.uncheck_billing_address_same_as_home()
    self.submit_reserve_car()
    self.scroll_to(800)
    #FixMe find a way to avoid this sleep
    time.sleep(2)
    self.test_case.assertEquals(self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)[1].text,
                                self.BILLING_ADDRESS_ERROR_MESSAGE)
    self.check_billing_address_same_as_home()
    self.set_cvc("237")
    self.uncheck_agree_terms_conditions()
    self.submit_reserve_car()
    #FixMe find a way to avoid this sleep
    time.sleep(2)
    self.test_case.assertEquals(self.get_elements(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME)[2].text,
                                self.AGREE_TERM_ERROR_MESSAGE)
    self.check_agree_terms_condition()
    self.submit_reserve_car()
    self.check_successful_redirection_to_page('confirm-email?subscription')

  def _get_error_message(self):
    return self.wait_for_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text

  def set_credit_card_number(self, value):
    self.scroll_to(400)
    textbox = self.wait_for_element('#creditCardNumber > div > iframe')
    for char in list(value):
      textbox.send_keys(char)

  def set_expiration(self, expdate):
    self.scroll_to(400)
    ele = self.wait_for_element("#expiration > div > iframe")
    date = list(expdate)
    for char in date:
      ele.send_keys(char)

  def set_cvc(self, cvc):
    self.scroll_to(400)
    ele = self.wait_for_element("#cvc > div > iframe")
    date = list(cvc)
    for char in date:
      ele.send_keys(char)

  def check_billing_address_same_as_home(self):
    self.scroll_to(600)
    ele = self.wait_for_element_clickable('billing-same-as-home-address', By.ID)
    if not ele.is_selected():
      ele.click()
    return ele

  def uncheck_billing_address_same_as_home(self):
    self.scroll_to(600)
    ele = self.wait_for_element_clickable('billing-same-as-home-address', By.ID)
    if  ele.is_selected():
      # fix me: find a way to avoid this sleep
      time.sleep(2)
      ele.click()
    return ele

  def set_billing_address(self, value):
    ele = self.wait_for_element('#accordion__body-4 .places-autocomplete input', By.CSS_SELECTOR)
    ele.send_keys(value)

  def check_agree_terms_condition(self):
    self.scroll_to(1200)
    ele = self.get_agree_terms_conditions_element()
    if not ele.is_selected():
      ele.click()

  def uncheck_agree_terms_conditions(self):
    ele = self.get_agree_terms_conditions_element()
    if ele.is_selected():
      ele.click()

  def get_agree_terms_conditions_element(self):
    return self.wait_for_element_clickable(
      '//div[@class=\'agree-to-terms-container\']/input[@id=\'agree-to-terms\']', By.XPATH)

  def submit_reserve_car(self):
    self.scroll_to(1200)
    ele = self.wait_for_element_clickable('#accordion__body-4 > div > div:nth-child(8) > div > button')
    ele.click()
    return ele
