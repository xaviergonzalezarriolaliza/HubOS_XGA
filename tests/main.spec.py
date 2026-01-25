from playwright.sync_api import sync_playwright


def test_navigate_redirect_and_check_status_codes():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("https://the-internet.herokuapp.com/")
        # Click the Redirect Link
        page.click("text=Redirect Link")

        # Wait for the redirect element with id 'redirect' and click it
        page.wait_for_selector("#redirect", timeout=10000)
        try:
            heading = page.query_selector("h3")
            redirector_heading = heading.inner_text() if heading else None
        except Exception:
            redirector_heading = None
        page.click("#redirect")

        # Collect status codes
        page.wait_for_selector("div#content ul li a", timeout=10000)
        codes = [el.inner_text().strip() for el in page.query_selector_all("div#content ul li a")]

        # Click 500 and verify content
        page.click("text=500")
        page.wait_for_selector("div#content p", timeout=10000)
        content_text = page.query_selector("div#content").inner_text()

        assert "Status Codes" in content_text, f"expected 'Status Codes' in content, got: {content_text!r}"

