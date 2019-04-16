import time
from enum import Enum

from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class SubscriptionOptionsPage(BasePage):
  # Error messages on subscription option page
  CUSTOM_SUBSCRIPTION_ERROR_MESSAGE = 'Value must be in between 3 and 12 for Custom Subscription length'
  UNEXPECTED_CUSTOM_SUBSCRIPTION_MESSAGE = 'Unexpected Custom Subscription Error Message'

  # Subscription Length enum for holding all the possible subscription lengths available
  class SubscriptionLengthEnum(Enum):
    THREE_MONTHS = '3 months'
    SIX_MONTHS = '6 months'
    NINE_MONTHS = '9 months'
    TWELVE_MONTHS = '12 months'
    OTHER = 'Other'

  # Subscription mileage package enum for holding available mileage packages
  class SubscriptionMileagePackageEnum(Enum):
    FIVE_HUNDRED_MILES_PER_MONTH = '500 miles / month  '
    THOUSAND_MILES_PER_MONTH = '1000 miles / month  (+ $50/mo)'
    FIFTEEN_HUNDRED_MILES_PER_MONTH = '1500 miles / month  (+ $100/mo)'
    UNLIMITED_MILES = 'Unlimited miles / month  (+ $200/mo)'

  def validate_custom_subscription_options(self):
    self.select_custom_subscription_length_by_visible_text(self.SubscriptionLengthEnum.OTHER.value)
    self.set_custom_subscription_length("13")
    self.submit_subscription_options()
    self.test_case.assertEquals(self.get_element(self.ERROR_MESSAGE_SELECTOR, By.CLASS_NAME).text,
                                self.CUSTOM_SUBSCRIPTION_ERROR_MESSAGE)
    self.set_custom_subscription_length("12")
    self.submit_subscription_options()

  def select_custom_subscription_length_by_visible_text(self, subscription_length):
    self.select_from_drop_down_by_visible_text('duration', subscription_length, By.ID)

  def set_custom_subscription_length(self, value):
    self.scroll_to(300)
    self.set_element_text('.subscribe-term-detail-1 > .other-subscription', value)

  def submit_subscription_options(self):
    self.scroll_to(400)
    ele = self.wait_for_element_clickable(
      '#accordion__body-1 .subscribe-step .subscribe-step-details .submit-options button')
    ele.click()
