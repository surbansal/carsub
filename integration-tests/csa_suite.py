import unittest

from tests.browse_car_page_e2e import  BrowseCarTest
from tests.contact_us_e2e import  ContactUsTest
from tests.home_page_e2e import  HomePageTest
from tests.faq_page_e2e import  FaqPageTest
from tests.subscription.subscription_flow_e2e import SubscriptionFlowTest


def load(tests):
  return unittest.TestLoader().loadTestsFromTestCase(tests)


test_suite = unittest.TestSuite([
  load(HomePageTest),
  load(ContactUsTest),
  load(FaqPageTest),
  load(BrowseCarTest),
  load(SubscriptionFlowTest)

])

# run the suite
unittest.TextTestRunner(verbosity=2).run(test_suite)
