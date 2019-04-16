#!/usr/bin/python
import time
import unittest

from pages.home_page import HomePage


class HomePageTest(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.home_page = HomePage()

  def test_home_page_functionality(self):
    self.home_page.navigate("/")
    self.home_page.learn_more_click()
    time.sleep(3)
    self.home_page.see_cars_and_cost_click()
    self.home_page.logo_home_page_click()
    self.assertTrue(self.home_page.verify_presence_of_video_element())
