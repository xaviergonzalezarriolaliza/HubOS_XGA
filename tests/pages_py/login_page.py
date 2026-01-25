import re
from typing import Optional, Literal
from playwright.sync_api import Page, BrowserContext
from .chat_page import ChatPage


class LoginPage:
    def __init__(self, page: Page):
        self.page = page
        self.room_input = page.locator('#guest_room')
        self.name_input = page.locator('#guest_name')
        self.login_button = page.locator('#btn_login')
        self.fandb_inputs = page.locator('.fandb-form-control-login')
        self.fandb_form = page.locator('.fandb-form')
        self.hotel_name = page.locator('.hotel-name').first
        # notyf may render notifications using several container/class names
        self.notyf_announcer = page.locator('.notyf__toast, .notyf__toast-message, .notyf-announcer, .notyf').first

    def goto(self, url: str):
        self.page.goto(url)

    def login(
        self,
        room: str = '',
        name: str = '',
        mode: Literal['fandb', 'standard'] = 'standard',
        assert_room: bool = False
    ):
        """General-purpose login helper that unifies different login flows."""
        if mode == 'fandb':
            self._login_with_fandb_inputs(room, name, assert_room)
            return
        
        self.fill_room(room)
        self.fill_name(name)
        self.submit_login(room if room else None, assert_room)

    def fill_room(self, room: str):
        self.room_input.fill(room)

    def fill_name(self, name: str):
        self.name_input.fill(name)

    def submit_login(self, room: Optional[str] = None, assert_room: bool = False):
        """Submit the login form."""
        self.login_button.wait_for(state='visible')
        self.login_button.click()
        
        if not assert_room:
            self.page.wait_for_load_state('domcontentloaded')
        
        if assert_room and room:
            self.wait_for_room(room)

    def _login_with_fandb_inputs(self, room: str, name: str, assert_room: bool = False):
        """Centralized F&B login implementation."""
        self.fandb_inputs.first.wait_for(state='visible')
        self.fandb_inputs.last.wait_for(state='visible')
        
        if self.fandb_inputs.count() != 2:
            raise ValueError('expected 2 F&B inputs')
        
        # Fill room (first input)
        self.fandb_inputs.first.fill(room)
        if self.fandb_inputs.first.get_attribute('id') != 'guest_room':
            raise ValueError('expected first F&B input to have id guest_room')
        if self.fandb_inputs.first.input_value() != room:
            raise ValueError('expected room value to match')
        
        # Fill name (last input)
        self.fandb_inputs.last.fill(name)
        if self.fandb_inputs.last.get_attribute('id') != 'guest_name':
            raise ValueError('expected last F&B input to have id guest_name')
        if self.fandb_inputs.last.input_value() != name:
            raise ValueError('expected guest_name value to match')
        
        self.login_button.click()
        
        if not assert_room:
            self.page.wait_for_load_state('domcontentloaded')
        
        if assert_room:
            self.wait_for_room(room)

    def wait_for_room(self, room: str, timeout: int = 15000):
        """Waits for the room heading inside the F&B form to be visible."""
        room_heading = self.fandb_form.locator('h4.client-room', has_text=room).first
        room_heading.wait_for(state='visible', timeout=timeout)
        return room_heading

    def open_chat(self, context: BrowserContext) -> ChatPage:
        """Clicks the chat entry point and returns a ChatPage for the newly opened window."""
        with context.expect_page() as new_page_info:
            self.page.locator('div.gradient h2.title', has_text='Hablamos?').click()
        
        chat_page = new_page_info.value
        chat_page.wait_for_load_state('domcontentloaded')
        return ChatPage(chat_page)

    def assert_logged_in(
        self,
        room: str,
        name: Optional[str] = None,
        timeout: int = 15000,
        mode: Literal['fandb', 'standard'] = 'fandb'
    ):
        """High-level assertion verifying the UI shows the provided room and guest name."""
        if mode == 'fandb':
            self.wait_for_room(room, timeout)
            self.hotel_name.wait_for(state='visible', timeout=timeout)
            
            if name:
                text = self.fandb_form.text_content()
                if not text or name not in text:
                    raise AssertionError(f"expected F&B form to contain {name}")
            
            text = self.fandb_form.text_content()
            if not text or room not in text:
                raise AssertionError(f"expected F&B form to contain {room}")
            return

        # Standard view: use global locators
        room_locator = self.page.locator('h4.client-room', has_text=room).first
        room_locator.wait_for(state='visible', timeout=timeout)
        self.hotel_name.wait_for(state='visible', timeout=timeout)
        
        if name:
            name_locator = self.page.locator('h4.client-name', has_text=name).first
            name_locator.wait_for(state='visible', timeout=timeout)

    def wait_for_notification(self, timeout: int = 5000):
        """Wait for the global notyf announcer to become visible."""
        preferred = [
            '.notyf__toast:visible',
            '.notyf__toast-message:visible',
            '.notyf-announcer:visible',
            '.notyf:visible'
        ]
        
        for sel in preferred:
            if self.page.locator(sel).count() > 0:
                return self.page.locator(sel).first
        
        # Fallback
        self.page.wait_for_selector(
            '.notyf__toast, .notyf-announcer, .notyf, .notyf__toast-message',
            state='visible',
            timeout=timeout
        )
        return self.page.locator('.notyf__toast:visible, .notyf-announcer:visible, .notyf:visible, .notyf__toast-message:visible').first

    def assert_notification_contains(self, expected: str | re.Pattern, timeout: int = 5000):
        """Assert that the notyf announcer contains the provided text or regex."""
        sel = '.notyf__toast, .notyf-announcer, .notyf, .notyf__toast-message'
        
        try:
            by_text = self.page.locator(sel, has_text=expected)
            by_text.first.wait_for(state='visible', timeout=timeout)
            txt = by_text.first.inner_text()
            
            if not txt:
                raise ValueError('notification empty')
            
            if isinstance(expected, str):
                if expected not in txt:
                    raise AssertionError(f"expected notification to contain {expected}")
            else:
                if not expected.search(txt):
                    raise AssertionError(f"expected notification to match {expected}")
            return
        except Exception:
            # Fallback: aggregate text from all matching elements
            locator = self.wait_for_notification(timeout)
            try:
                txt = locator.inner_text()
            except Exception:
                txt = ''
            
            if not txt:
                txt = self.page.evaluate(f'''(s) => {{
                    const nodes = Array.from(document.querySelectorAll(s));
                    return nodes.map(n => (n.textContent || '').trim()).filter(Boolean).join(' ').trim();
                }}''', sel)
            
            if not txt:
                raise ValueError('notification empty (fallback)')
            
            if isinstance(expected, str):
                if expected not in txt:
                    raise AssertionError(f"expected notification to contain {expected}; actual: {txt}")
            else:
                if not expected.search(txt):
                    raise AssertionError(f"expected notification to match {expected}; actual: {txt}")

    def assert_notification_visible(self, timeout: int = 5000):
        """Assert the notyf announcer is visible."""
        self.page.wait_for_selector(
            '.notyf__toast, .notyf-announcer, .notyf',
            state='visible',
            timeout=timeout
        )

    def assert_notification_contains_all(self, expected: list[str | re.Pattern], timeout: int = 5000):
        """Assert that the notyf announcer contains all provided strings/regexes."""
        locator = self.wait_for_notification(timeout)
        
        try:
            txt = locator.inner_text()
        except Exception:
            txt = ''
        
        if not txt:
            sel = '.notyf__toast, .notyf-announcer, .notyf__toast-message, .notyf'
            txt = self.page.evaluate(f'''(s) => {{
                const nodes = Array.from(document.querySelectorAll(s));
                return nodes.map(n => (n.textContent || '').trim()).filter(Boolean).join(' ').trim();
            }}''', sel)
        
        if not txt:
            txt = self.page.locator('body').inner_text()
        
        if not txt:
            raise ValueError('notification empty')
        
        # Normalize whitespace
        normalized = re.sub(r'\s+', ' ', txt).strip()
        
        for e in expected:
            try:
                locator = self.page.locator('body', has_text=e)
                locator.first.wait_for(state='visible', timeout=timeout)
                continue
            except Exception:
                pass
            
            if isinstance(e, str):
                if e not in normalized:
                    raise AssertionError(f"expected notification to contain {e}; actual: {normalized}")
            else:
                if not e.search(normalized):
                    raise AssertionError(f"expected notification to match {e}; actual: {normalized}")
