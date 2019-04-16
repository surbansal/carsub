import unittest

from pages.vehicle_detail_page import VehicleDetailPage


class VehicleDetailPageTest(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.detail_page = VehicleDetailPage()
    cls.detail_page.set_up_valid_zip_code()
    cls.detail_page.select_first_vehicle()

  @classmethod
  def tearDownClass(cls):
    cls.detail_page.tear_down_class()

  def test_customer_login_page(self):
    self.detail_page.customer_login_option()
    # please give correct user_mailid
    self.detail_page.customer_login_user_name("user_mailid")
    # please give correct user_Password
    self.detail_page.customer_login_user_password("user_pwd1")
    self.detail_page.customer_login_user_show_password()
    self.detail_page.customer_login_user_show_password()
    self.detail_page.customer_login_button()
    self.detail_page.customer_view_all_add_ons()
    self.detail_page.roadside_assistance()
    self.detail_page.schedule_maintainence()
    self.detail_page.accident_instructions()
    self.detail_page.manage_payment_method()
    self.detail_page.add_new_payment_method("4242424242424242")
    self.detail_page.send_exp_date("1129")
    self.detail_page.send_cvc_number("556")
    self.detail_page.change_password("user_pwd1", "user_pwd2")
    self.detail_page.user_sign_out()
    self.detail_page.customer_login_option()
    self.detail_page.customer_login_user_name("user_mailid")
    self.detail_page.customer_login_user_password("user_pwd2")
    self.detail_page.customer_login_button()
    self.detail_page.change_password("user_pwd2", "user_pwd1")
