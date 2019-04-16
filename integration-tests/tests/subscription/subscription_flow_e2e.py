import unittest
from pages.delivery_options_page import DeliveryOptionsPage
from pages.payment_information_page import PaymentInformationPage
from pages.personal_information_page import PersonalInformationPage
from pages.subscription_options_page import SubscriptionOptionsPage
from pages.vehicle_browse_page import VehicleBrowsePage
from pages.vehicle_detail_page import VehicleDetailPage


class SubscriptionFlowTest(unittest.TestCase):

  @classmethod
  def setUpClass(cls):
    cls.vehicleDetailPage = VehicleDetailPage()
    cls.vehicle_browse_page = VehicleBrowsePage()
    cls.subscription_option_page = SubscriptionOptionsPage()
    cls.payment_information_page = PaymentInformationPage()
    cls.personal_information_page = PersonalInformationPage()
    cls.delivery_options_page = DeliveryOptionsPage()

  def test_00_subscription_negative_scenarios(self):
    self.vehicleDetailPage.navigate("/browse")
    self.vehicle_browse_page.select_vehicle(1)
    self.subscription_option_page.validate_custom_subscription_options()
    self.personal_information_page.validate_personal_information()
    self.vehicle_browse_page.navigate("/browse")
    self.vehicle_browse_page.select_vehicle(1)
    self.subscription_option_page.submit_subscription_options()
    self.personal_information_page.validate_date_of_birth()
    self.delivery_options_page.validate_delivery_options()
    self.delivery_options_page.submit_delivery_preferences()
    self.payment_information_page.validate_payment_information_error_message()

  def test_01_successful_subscription_creation(self):
    self.vehicleDetailPage.navigate("/browse")
    self.vehicle_browse_page.select_vehicle(1)
    self.subscription_option_page.submit_subscription_options()
    self.personal_information_page.fill_out_personal_information()
    self.personal_information_page.submit_personal_information_section()
    self.delivery_options_page.fill_out_preferred_delivery_options()
    self.payment_information_page.fill_out_payment_details()
    self.payment_information_page.submit_reserve_car()
    self.vehicleDetailPage.check_successful_redirection_to_page('confirm-email?subscription')

  if __name__ == "__main__":
    unittest.main()
