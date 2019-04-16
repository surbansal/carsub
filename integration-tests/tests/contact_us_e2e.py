#!/usr/bin/python
import time
import unittest

from pages.home_page import HomePage


class ContactUsTest(unittest.TestCase):
  CONTACT_US_EMAIL = "carsubscription@norcal.aaa.com"

  @classmethod
  def setUpClass(cls):
    cls.home_page = HomePage()

  def test_contact_us(self):
    self.home_page.navigate("/")
    self.home_page.scroll_to(5000)
    self.home_page.contact_us_click()
    self.home_page.check_successful_redirection_to_page("/contact-us")
    self.home_page.get_by_link_text(self.CONTACT_US_EMAIL)

  # @classmethod
  # def tearDownClass(cls):
  # cls.home_page.tear_down_class()
