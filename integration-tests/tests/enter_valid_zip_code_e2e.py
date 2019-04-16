#!/usr/bin/python

import time
import unittest

from pages.zip_modal import ZipModal


class EnterValidZipCode(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.zip_modal = ZipModal()
    cls.driver = cls.zip_modal.driver
    cls.driver.implicitly_wait(30)
    cls.driver.maximize_window()
  
  @classmethod
  def tearDownClass(cls):
    cls.zip_modal.tear_down_class()
  
  def setUp(self):
    self.zip_modal.set_up_secondary_auth()
    self.zip_modal.set_up_no_zip_code_for_path("/browse")
  
  def test_zip_code_modal_shows(self):
    zip_modal = self.zip_modal.zip_modal_content()
    self.assertEqual(1, len(zip_modal))
  
  def test_zip_modal_hides_after_enter(self):
    zip_input = self.zip_modal.modal_input()
    zip_button = self.zip_modal.modal_button()
    zip_input.send_keys("93202")
    zip_button.click()
    time.sleep(1)
    zip_modal = self.zip_modal.zip_model_content_exists()
    self.assertEqual(0, len(zip_modal))


if __name__ == '__main__':
  unittest.main()
