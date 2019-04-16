from selenium.webdriver.common.by import By

from .base_page import BasePage


class LoginPage(BasePage):
  
  def login(self, username, password):
    self.set_element_text('username', username, By.ID)
    self.set_element_text('password', password, By.ID)
    ele = self.wait_for_element_clickable(
      '#root > div.content.content-body.login-page > form > div:nth-child(4) > button')
    ele.click()
