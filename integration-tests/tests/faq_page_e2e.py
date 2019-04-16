#!/usr/bin/python

import unittest

from pages.faq_page import FaqPage


class FaqPageTest(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.faq_page = FaqPage()
  
  def test_availability_of_questions(self):
    self.faq_page.faq_page_click()
    self.faq_page.scroll_to(500)
    self.faq_page.verify_presence_of_general_questions()
    self.faq_page.verify_presence_of_signing_up_questions()
    self.faq_page.verify_presence_of_everyday_usage_questions()
    self.faq_page.verify_presence_of_pricing_and_payment_questions()
    self.faq_page.verify_presence_of_terms_of_use_questions()
