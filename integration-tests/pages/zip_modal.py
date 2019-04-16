from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec

from .base_page import BasePage


class ZipModal(BasePage):
  def zip_modal_content(self):
    element = self.wait.until(ec.presence_of_all_elements_located((By.CLASS_NAME, "ReactModal__Content")))
    return element
  
  def zip_model_content_exists(self):
    elements = self.driver.find_elements_by_class_name("ReactModal__Content")
    return elements
  
  def modal_input(self):
    ele = self.wait.until(ec.presence_of_element_located((By.CSS_SELECTOR, ".zip-code-modal input")))
    return ele
  
  def modal_button(self):
    ele = self.wait.until(ec.presence_of_element_located((By.CSS_SELECTOR, ".zip-code-modal button")))
    return ele
