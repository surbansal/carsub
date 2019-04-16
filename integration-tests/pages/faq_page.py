import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec

from pages.base_page import BasePage


class FaqPage(BasePage):
  # Questions available on the FAQ page
  GENERAL_QUESTIONS = ("What is AAA Car Subscription?", "How does AAA Car Subscription work?",
                       "What’s included with my subscription in addition to the car?",
                       "My monthly car payment seems lower than this. How do you work out the cost?",
                       "How are you different from long-term car rentals or leases?", "Can I test drive the car?",
                       "How does insurance work?", "How long is a subscription term?",
                       "What make/model are the vehicles?", "What happens if I want to change mileage packages?",
                       "How should I think about my monthly mile usage?",
                       "Can I buy the car after my subscription ends?", "How is AAA Car Subscription related to AAA?")

  SIGNING_UP_QUESTION = ("How do I join AAA Car Subscription?", "Is AAA Car Subscription available in my area?",
                         "Will you deliver the car to me?",
                         "I’m just outside your service area. Can I still sign up?",
                         "Who is eligible for AAA Car Subscription?", "Can I see the vehicles on a lot?")

  EVERYDAY_USAGE_QUESTIONS = (
    "Are pets allowed in the vehicle?", "What happens if I get a ticket?",
    "What happens if I get into an accident?", "Where can I find the insurance card?",
    "What happens at the end of the term?", "Can I modify the car?",
    "What happens if my vehicle needs repair?")

  PRICING_AND_PAYMENT_QUESTIONS = (
    "What about fuel?", "How do you process payment?", "What is the minimum commitment to AAA Car Subscription?")

  TERMS_OF_USE_QUESTIONS = (
    "What is the condition of AAA Car Subscription vehicles?", "Can I drive for ride-hailing companies?",
    "Can other people drive my AAA Car Subscription vehicle?")

  def faq_page_click(self):
    ele = self.get_element('.header-nav > a:nth-child(2)')
    ele.click()

  def verify_presence_of_general_questions(self):
    self.wait_for_element_clickable('div.category > div > ul > li:nth-child(1) > span').click()
    questions = self.get_all_questions()
    self.test_case.assertEqual(13, len(questions))
    self.check_questions_availability(questions, self.GENERAL_QUESTIONS)

  def verify_presence_of_signing_up_questions(self):
    self.wait_for_element_clickable('div.category > div > ul > li:nth-child(2) > span').click()
    questions = self.get_all_questions()
    self.test_case.assertEqual(6, len(questions))
    self.check_questions_availability(questions, self.SIGNING_UP_QUESTION)

  def verify_presence_of_everyday_usage_questions(self):
    self.wait_for_element_clickable('div.category > div > ul > li:nth-child(3) > span').click()
    questions = self.get_all_questions()
    self.test_case.assertEqual(7, len(questions))
    self.check_questions_availability(questions, self.EVERYDAY_USAGE_QUESTIONS)

  def verify_presence_of_pricing_and_payment_questions(self):
    self.wait_for_element_clickable('div.category > div > ul > li:nth-child(4) > span').click()
    questions = self.get_all_questions()
    self.test_case.assertEqual(3, len(questions))
    self.check_questions_availability(questions, self.PRICING_AND_PAYMENT_QUESTIONS)

  def verify_presence_of_terms_of_use_questions(self):
    self.wait_for_element_clickable('div.category > div > ul > li:nth-child(5) > span').click()
    questions = self.get_all_questions()
    self.test_case.assertEqual(3, len(questions))
    self.check_questions_availability(questions, self.TERMS_OF_USE_QUESTIONS)

  def check_questions_availability(self, questions, expected_questions):
    for question in questions:
      self.scroll_to(1500)
      self.test_case.assertTrue(expected_questions.__contains__(question.text))

  def get_all_questions(self):
    return self.wait_for_presence_of_all_elements("question-list-item", By.CLASS_NAME)
