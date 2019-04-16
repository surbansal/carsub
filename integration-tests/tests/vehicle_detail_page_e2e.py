#!/usr/bin/python

import unittest

from pages.vehicle_browse_page import VehicleBrowsePage
from pages.vehicle_detail_page import VehicleDetailPage


class VehicleDetailPageTest(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.detail_page = VehicleDetailPage()
    cls.vehicle_browse_page = VehicleBrowsePage()
    cls.vehicle_browse_page.navigate("/browse")
    cls.vehicle_browse_page.set_up_secondary_auth()
    cls.vehicle_browse_page.set_up_valid_zip_code_for_path('/browse')
    cls.detail_page.select_first_vehicle()
  
  @classmethod
  def tearDownClass(cls):
    cls.detail_page.tear_down_class()
  
  def test_vehicle_model_exists(self):
    element = self.detail_page.select_vehicle_model()
    self.assertIsNotNone(element)
  
  def test_vehicle_base_price_exists(self):
    element = self.detail_page.select_vehicle_base_price()
    self.assertIsNotNone(element)
  
  def test_vehicle_image_exists(self):
    element = self.detail_page.select_vehicle_image_section()
    self.assertIsNotNone(element)
  
  def test_all_vehicle_highlights_displayed(self):
    highlights = self.detail_page.select_vehicle_highlights()
    self.assertEqual(4, len(highlights))
  
  def test_included_with_subscription_section_exists(self):
    element = self.detail_page.select_included_with_subscription()
    self.assertIsNotNone(element)
  
  def test_all_vehicle_features_displayed(self):
    features = self.detail_page.select_vehicle_features()
    self.assertEqual(4, len(features))
  
  def test_vehicle_subscribe_section_exists(self):
    element = self.detail_page.select_vehicle_subscribe_section()
    self.assertIsNotNone(element)
  
  def test_all_vehicle_subscription_steps_exist(self):
    steps = self.detail_page.select_vehicle_subscribe_steps()
    self.assertEqual(4, len(steps))
  
  def test_vehicle_subscription_options_exist(self):
    element = self.detail_page.select_vehicle_subscription_options()
    self.assertIsNotNone(element)
  
  def test_submit_subscription_options(self):
    self.detail_page.set_subscription_length()
    self.detail_page.set_mileage_package()
    mileage_price = self.detail_page.select_mileage_package_price()
    self.assertEqual("$50", mileage_price)
    self.detail_page.submit_subscription_options()
  
  def test_personal_information_section_exists(self):
    element = self.detail_page.select_personal_information_section()
    self.assertIsNotNone(element)
  
  def test_successful_submit_personal_options(self):
    self.detail_page.set_personal_info_first_name("Tom")
    self.detail_page.set_personal_info_last_name("Hanks")
    self.detail_page.set_home_address_fields("1300 21st St, Sacramento, CA 95811, USA")
    self.detail_page.select_state()
    self.detail_page.set_personal_info_driver_license("DL4567 ADT")
    self.detail_page.set_personal_info_date_of_birth("12051987")
    self.detail_page.set_personal_info_email("subscriber@mail.com")
    self.detail_page.set_personal_info_phone_number("3123195682")
    self.detail_page.check_agree_terms()
    self.detail_page.submit_personal_information_section()
    self.detail_page.set_verification_code(5, 5, 5, 5, 5)
    self.detail_page.submit_personal_information_section()
  
  def test_prefer_delivery_option_exists(self):
    element = self.detail_page.select_prefer_delivery_option()
    self.assertIsNotNone(element)
  
  def test_x_prefer_delivery_option(self):
    self.detail_page.preferred_delivery_options_select_date()
    self.detail_page.select_right_slick_arrow()
    self.detail_page.select_left_slick_arrow()
    self.detail_page.preferred_delivery_options_select_timeframe()
    # self.detail_page.preferred_delivery_address_button()
    # self.detail_page.preferred_delivery_address("1300 21st St, Sacramento, CA 95811, USA")
    self.detail_page.preferred_delivery_options_submit_button()
  
  def test_y_successful_submit_reserve_my_car(self):
    self.detail_page.payment_detail_set_credit_card_number("4242424242424242")
    self.detail_page.payment_detail_set_expiration("1120")
    self.detail_page.payment_detail_set_cvc("237")
    # self.detail_page.payment_detail_check_billing_address_same_as_home()
    # self.detail_page.payment_detail_give_billing_address("1300 21st St, Sacramento, CA 95811, USA")
    self.detail_page.payment_detail_check_agree_terms_condition()
    self.detail_page.payment_detail_submit_reserve_car()


if __name__ == '__main__':
  unittest.main()
