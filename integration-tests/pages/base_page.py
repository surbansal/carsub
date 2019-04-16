#!/usr/bin/python

import argparse
import random
import string
import time
from unittest import TestCase

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait


class BasePage:
  ERROR_MESSAGE_SELECTOR = "error-message"

  @classmethod
  def set_up(cls):
    cls.driver = webdriver.Chrome()
    cls.driver.maximize_window()
    cls.driver.implicitly_wait(5)
    cls.wait = WebDriverWait(cls.driver, 15)
    cls.test_case = TestCase()
    parser = argparse.ArgumentParser()
    parser.add_argument("--app_url", default='http://localhost:9000')
    args = parser.parse_args()
    cls.app_url = args.app_url

  def set_up_valid_zip_code(self):
    valid_zip = 95828
    self.driver.add_cookie({'name': 'zipcode', 'value': str(valid_zip) + '|AAA|'})
    modal_text = self.get_element('.zip-code-modal .modal-content .action-field input')
    modal_text.send_keys(valid_zip)
    modal_button = self.get_element('.zip-code-modal .modal-content .action-field button')
    modal_button.click()

  def set_up_secondary_auth(self):
    secondary_auth_password = 'cars95828!'
    modal_text = self.get_element('#root > div > div > input')
    modal_text.send_keys(secondary_auth_password)
    modal_button = self.get_element('#root > div > div > button')
    modal_button.click()

  def set_up_no_zip_code_for_path(self, path):
    self.driver.get("http://localhost:9000" + path)
    self.driver.delete_all_cookies()

  def tear_down_class(self):
    # close the browser window
    self.driver.quit()

  def wait_for_element(self, selector, locator=By.CSS_SELECTOR):
    ele = self.wait.until(
      ec.presence_of_element_located((locator, selector)))
    if ele is not None:
      self.move_to_element(selector, locator)
      return ele
    else:
        raise NoSuchElementException

  def wait_until_staleness_of_element(self, element):
    self.wait.until(ec.staleness_of(element))

  def wait_for_presence_of_all_elements(self, selector, locator=By.CSS_SELECTOR):
    return self.wait.until(ec.presence_of_all_elements_located((locator, selector)))

  def wait_for_element_clickable(self, selector, locator=By.CSS_SELECTOR):
    element = self.wait.until(ec.element_to_be_clickable((locator, selector)))
    if element is not None:
      self.move_to_element(selector, locator)
    else:
        raise NoSuchElementException
    return element

  def wait_for_element_invisible(self, selector, locator=By.CSS_SELECTOR):
    return self.wait.until(ec.invisibility_of_element_located((locator, selector)))

  def wait_for_element_visible(self, element):
    return self.wait.until(ec.visibility_of(element))

  def wait_for_text_in_element(self, text, selector, locator=By.CSS_SELECTOR):
    return self.wait.until(ec.text_to_be_present_in_element((locator, selector), text))

  def set_element_text(self, selector, text, locator=By.CSS_SELECTOR):
    ele = self.wait_for_element_clickable(selector, locator)
    ele.clear()
    time.sleep(1)
    ele.send_keys(text)

  def is_element_present(self, what, how=By.CSS_SELECTOR):
    return self.driver.find_element(by=how, value=what) is not None

  def move_to_element(self, selector, locator=By.CSS_SELECTOR):
    ele = self.get_element(selector, locator)
    self.move_to_existing_element(ele)

  def get_element(self, selector, by=By.CSS_SELECTOR):
    return self.driver.find_element(by=by, value=selector)

  def get_elements(self, selector, by=By.CSS_SELECTOR):
    return self.driver.find_elements(by=by, value=selector)

  def move_to_existing_element(self, ele):
    actions = ActionChains(self.driver)
    actions.move_to_element(ele).perform()

  def go_to_previous_window(self):
    self.driver.execute_script("window.history.go(-1)")

  def go_to_next_window(self):
    self.driver.execute_script("window.history.go(+1)")

  def navigate(self, path):
    try:
      self.driver.get(self.app_url + path)
    except:
      self.driver.get(self.app_url)

  def validate_field_errors(self, actual_errors, expected_errors):
    for error_message in expected_errors:
      self.test_case.assertTrue(actual_errors.__contains__(error_message))

  @staticmethod
  def get_element_text(element):
    return element.text

  def select_from_drop_down_by_visible_text(self, selector, text, by=By.CSS_SELECTOR):
    select_element = self.get_select_element(selector, by)
    select_element.select_by_visible_text(text)

  def select_from_drop_down_by_value(self, selector, value, by=By.CSS_SELECTOR):
    select_element = self.get_select_element(selector, by)
    select_element.select_by_value(value)

  def select_from_drop_down_by_index(self, selector, index, by=By.CSS_SELECTOR):
    select_element = self.get_select_element(selector, by)
    select_element.select_by_index(index)

  def get_select_element(self, selector, by=By.CSS_SELECTOR):
    return Select(self.wait_for_element(selector, by))


  @staticmethod
  def get_random_string(length=6):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


  @staticmethod
  def get_random_alphanumeric_string(length=6):
    return ''.join(
      random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits + string.punctuation) for _ in
      range(length))


  @staticmethod
  def get_random_number(length):
    return range(length)

  def check_successful_redirection_to_page(self, page):
    self.wait.until(ec.url_contains(page))

  def scroll_to(self, extent=400):
    self.driver.execute_script("window.scrollTo(0, {0});".format(extent))


base_page = BasePage()
base_page.set_up()
base_page.navigate("/browse")
base_page.set_up_secondary_auth()
time.sleep(2)
base_page.set_up_valid_zip_code()
