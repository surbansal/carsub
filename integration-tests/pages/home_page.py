import time

from selenium.webdriver.common.by import By

from .base_page import BasePage


class HomePage(BasePage):

  def contact_us_click(self):
    ele = self.wait_for_element_clickable('div:nth-child(1) > ul > li:nth-child(2) > .link')
    ele.click()


  def learn_more_click(self):
    ele = self.wait_for_element_clickable('div.subscribe-and-drive > button')
    ele.click()

  def see_cars_and_cost_click(self):
    ele = self.wait_for_element_clickable('.how-it-works-button')
    ele.click()
    self.check_successful_redirection_to_page('/browse')

  def logo_home_page_click(self):
    ele = self.get_element('.desktop-logo')
    ele.click()

  def verify_presence_of_video_element(self):
    self.scroll_to(2200)
    return self.is_element_present('video-react-big-play-button', By.CLASS_NAME)

  def get_by_link_text(self, link_text):
    ele = self.get_element(link_text, By.LINK_TEXT)
    return ele
