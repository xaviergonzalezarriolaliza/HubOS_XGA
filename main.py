from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
from typing import cast
from selenium.webdriver.remote.webelement import WebElement


def run(timeout: int = 10, headless: bool = False):
    chrome_opts = Options()
    if headless:
        chrome_opts.add_argument("--headless=new")
        chrome_opts.add_argument("--disable-gpu")
        chrome_opts.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_opts)
    wait = WebDriverWait(driver, timeout)

    try:
        driver.get("https://the-internet.herokuapp.com/")
        title = driver.title


        # 2. Wait for 'Redirect Link' to be clickable and click it
        wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Redirect Link"))).click()

        # 3. Wait for the redirect target element with id='redirect' and click it
        # Use By.ID (getById) as requested. Capture heading if present but don't depend on it.
        redirect_elem = wait.until(EC.element_to_be_clickable((By.ID, "redirect")))
        # Try to read a heading if available (best-effort)
        try:
            redirector_heading = driver.find_element(By.TAG_NAME, "h3").text
        except Exception:
            redirector_heading = None
        redirect_elem.click()

        # 5. Wait for the list of status codes to be present and store them in 'codes'
        codes_elements = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#content ul li a")))
        codes = [el.text.strip() for el in codes_elements]

        # 6. Click on code 500 and wait for the paragraph text
        wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "500"))).click()
        text = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div#content p"))).text
        # cast the result so the editor (Pylance) knows this is a WebElement and shows methods
        content_el = cast(WebElement, wait.until(EC.presence_of_element_located((By.ID, "content"))))
        text = content_el.text

        # Verify the content contains the expected heading text
        assert "Status Codes" in text, f"expected 'Status Codes' in content text, got: {text!r}"

        return {
            "title": title,
            "redirector_heading": redirector_heading,
            "codes": codes,
            "text": text,
        }
    finally:
        driver.quit()


if __name__ == "__main__":
    results = run()
    print("title:", results["title"])
    print("redirector_heading:", results["redirector_heading"])
    print("codes:", results["codes"])
    print("text:", results["text"])

# ci-trigger: touch file to retrigger GitHub Actions (no-op comment)
