import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec

from .base_page import BasePage


class VehicleDetailPage(BasePage):

  def select_first_vehicle(self):
    ele = self.wait.until(ec.element_to_be_clickable((By.CSS_SELECTOR,
                                                      ".list-item:nth-child(1) .gradient-backdrop .vehicle-summary .price-and-action .action button")))
    ele.click()

  def select_vehicle_model(self):
    ele = self.wait_for_element('.vehicle-detail-content .model-and-price .vehicle-model')
    return ele

  def select_vehicle_base_price(self):
    ele = self.wait_for_element('.vehicle-detail-content .model-and-price .vehicle-price')
    return ele

  def select_vehicle_image_section(self):
    # ele = self.wait_for_element('.vehicle-detail-content .vehicle-image iframe')
    ele = self.wait_for_element('.vehicle-detail-content .vehicle-image .spin-car')
    return ele

  def select_vehicle_highlights(self):
    return self.wait_for_presence_of_all_elements(
      '.vehicle-detail-content .vehicle-highlights .vehicle-highlights-list .list-item')

  def select_included_with_subscription(self):
    ele = self.wait_for_element('.vehicle-detail-content .vehicle-includes')
    return ele

  def select_vehicle_features(self):
    return self.wait_for_presence_of_all_elements('.vehicle-detail-content .vehicle-features .feature-row')

  def select_vehicle_subscribe_section(self):
    ele = self.wait_for_element('.vehicle-detail .vehicle-detail-subscribe')
    return ele

  def select_vehicle_subscribe_steps(self):
    elements = self.wait_for_presence_of_all_elements(
      '.vehicle-detail .vehicle-detail-subscribe .subscribe-steps .accordion .accordion__item')
    return elements

  def select_vehicle_subscription_options(self):
    ele = self.wait_for_element(
      '.vehicle-detail .vehicle-detail-subscribe .subscribe-steps .accordion .accordion__item:nth-child(1)')
    return ele

  def set_subscription_length(self):
    ele = self.wait_for_element_clickable('#duration option[value=\'3\']')
    ele.click()

  def set_mileage_package(self):
    ele = self.wait_for_element_clickable('#mileage option[value=\'2\']')
    ele.click()

  def select_mileage_package_price(self):
    ele = self.wait_for_element('//*[@id=\"accordion__body-1\"]/div/div[3]/div[2]/div[2]/span', By.XPATH)
    return ele.text

  def select_personal_information_section(self):
    ele = self.wait_for_element('accordion__body-2', By.ID)
    return ele

  def select_prefer_delivery_option(self):
    ele = self.wait_for_element('accordion__body-3', By.ID)
    return ele

  def preferred_delivery_address_button(self):
    ele = self.wait_for_element('#deliver-to-home-address')
    ele.click()

  def preferred_delivery_address(self, values):
    ele = self.wait_for_element("#accordion__body-3 > div > div:nth-child(3) > div.places-autocomplete > input")
    ele.send_keys(values)

  def select_right_slick_arrow(self):
    ele = self.wait_for_element('div img.slick-arrow.slick-next')
    ele.click()

  def select_left_slick_arrow(self):
    ele = self.wait_for_element("div img.slick-arrow.slick-prev")
    ele.click()

  def Payments(self, value):
    ele = self.wait_for_element('//input[@type=\'tel\'][@autocomplete=\'cc-exp\']', By.XPATH)
    ele.send_keys(value)


  def faq_image_exists(self):
    ele = self.wait_for_element('.hero-container .crop img')
    return ele

  def user_sign_out(self):
    time.sleep(3)
    self.wait_for_element("#root > header > div > div.header-nav > a:nth-child(4)").click()
    time.sleep(3)

  def customer_login_option(self):
    ele = self.wait_for_element_clickable('.header-nav a:nth-child(3)')
    ele.click()

  def customer_login_user_name(self, values):
    ele = self.wait_for_element_clickable('#username')
    ele.send_keys(values)

  def customer_login_user_password(self, values):
    ele = self.wait_for_element_clickable('.password-input')
    ele.send_keys(values)

  def customer_login_user_show_password(self):
    ele = self.wait_for_element_clickable("//span[@class='password-show']", By.XPATH)
    ele.click()

  def customer_login_button(self):
    ele = self.wait_for_element_clickable("//*[@id='root']/div[2]/form/div[3]/button", By.XPATH)
    ele.click()

  def customer_view_all_add_ons(self):
    self.driver.implicitly_wait(3)
    self.wait_for_element_clickable(".link > a[href='/add-ons']", By.CSS_SELECTOR).click()
    self.driver.implicitly_wait(3)
    self.wait_for_element_clickable(".breadcrumb > a[href='/my-account']", By.CSS_SELECTOR).click()

  def roadside_assistance(self):
    time.sleep(3)
    self.wait_for_element_clickable(".account-link.h3> a[href='/roadside-assist']", By.CSS_SELECTOR).click()
    time.sleep(3)
    self.wait_for_element_clickable(".breadcrumb>a[href='/my-account']").click()

  def schedule_maintainence(self):
    time.sleep(3)
    self.wait_for_element_clickable(".account-link.h3> a[href='/schedule-maintenance']", By.CSS_SELECTOR).click()
    time.sleep(3)
    self.wait_for_element_clickable(".breadcrumb>a[href='/my-account']").click()

  def accident_instructions(self):
    time.sleep(3)
    self.wait_for_element_clickable(".account-link.h3> a[href='/accident-instructions']", By.CSS_SELECTOR).click()
    time.sleep(3)
    self.wait_for_element_clickable(".breadcrumb>a[href='/my-account']").click()

  def manage_payment_method(self):
    time.sleep(5)
    self.wait_for_element_clickable(".account-link.h3> a[href='/manage-payment']", By.CSS_SELECTOR).click()
    time.sleep(3)
    # self.wait_for_element_clickable(".breadcrumb>a[href='/my-account']").click()
    # self.wait_for_element_clickable(".account-link.h3> a[href='/manage-payment']",By.CSS_SELECTOR).click()

  def add_new_payment_method(self, cardnumber):
    self.wait_for_element(".card-heading a[href='/add-payment-method']", By.CSS_SELECTOR).click()
    textbox = self.wait_for_element("#addCreditCardNumber iframe", By.CSS_SELECTOR)
    cardnumber_splitted_characters = list(cardnumber)
    for char in cardnumber_splitted_characters:
      textbox.send_keys(char)

  def send_exp_date(self, expdate):
    ele = self.wait_for_element("#addExpiration iframe", By.CSS_SELECTOR)
    date = list(expdate)
    for char in date:
      ele.send_keys(char)

  def send_cvc_number(self, cvc):
    ele = self.wait_for_element("#addCvc iframe", By.CSS_SELECTOR)
    num = list(cvc)
    for char in num:
      ele.send_keys(char)
    self.wait_for_element(".action-field button").click()
    time.sleep(10)
    self.wait_for_element(".breadcrumb a[href='/my-account']").click()

  def check_agree_terms(self):
    ele = self.wait_for_element_clickable('.agree-to-terms-container #agree-to-terms')
    ele.click()

  def change_password(self, pwd1, pwd2):
    time.sleep(1)
    self.wait_for_element(".account-data div:nth-child(5) a[href='/change-password']", By.CSS_SELECTOR).click()
    time.sleep(2)
    ele = self.wait_for_element_clickable(
      'div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(2) span label input')
    ele.send_keys(pwd1)
    self.wait_for_element_clickable(
      "div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(2) span label span",
      By.CSS_SELECTOR).click()
    self.wait_for_element_clickable(
      "div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(2) span label span",
      By.CSS_SELECTOR).click()
    ele = self.wait_for_element_clickable(
      'div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(3) span label input')
    ele.send_keys(pwd2)
    self.wait_for_element_clickable(
      "div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(3) span label span",
      By.CSS_SELECTOR).click()
    self.wait_for_element_clickable(
      "div.content.content-body.reset-password-page div:nth-child(2) div:nth-child(3) span label span",
      By.CSS_SELECTOR).click()
    self.wait_for_element_clickable(".action-field.forgot-link button", By.CSS_SELECTOR).click()
