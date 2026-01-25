from playwright.sync_api import Page


class ChatPage:
    def __init__(self, page: Page):
        self.page = page
        # Chat header selector observed in tests
        self.header = page.locator('h3._9vd5._9scb._9scr').first

    def wait_for_chat_loaded(self, timeout: int = 15000):
        self.page.wait_for_load_state('domcontentloaded')
        self.header.wait_for(state='visible', timeout=timeout)

    def assert_agent_name(self, expected: str, timeout: int = 15000):
        self.wait_for_chat_loaded(timeout)
        txt = self.header.text_content()
        if not txt or expected not in txt:
            raise AssertionError(f"expected agent name {expected}")
