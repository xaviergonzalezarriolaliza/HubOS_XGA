"""
HubOS QA Engineer Homework XGA - Python Port
Login tests using Playwright with Page Object Model
"""
import os
import re
import pytest
from playwright.sync_api import Page, BrowserContext, expect
from dotenv import load_dotenv
from pages_py.login_page import LoginPage

# Load environment variables
load_dotenv()

# Environment variables
CORRECT_LOGIN = os.getenv('CORRECT_LOGIN')
CORRECT_LOGIN2 = os.getenv('CORRECT_LOGIN2')
CORRECT_LOGIN3 = os.getenv('CORRECT_LOGIN3')
CORRECT_LOGIN4 = os.getenv('CORRECT_LOGIN4')
ROOM = os.getenv('ROOM')
ROOM2 = os.getenv('ROOM2')
WRONG_ROOM = os.getenv('WRONG_ROOM')
INCORRECT_LOGIN = os.getenv('INCORRECT_LOGIN')
INCORRECT_LOGIN2 = os.getenv('INCORRECT_LOGIN2')
WRONG_ROOM2 = os.getenv('WRONG_ROOM2')
DEMOHUB = os.getenv('DEMOHUB')
BASE_URL = os.getenv('BASE_URL')
PARTIAL_LOGIN = os.getenv('PARTIAL_LOGIN')
PARTIAL_LOGIN2 = os.getenv('PARTIAL_LOGIN2')
PARTIAL_LOGIN3 = os.getenv('PARTIAL_LOGIN3')

# Fail fast if required env vars are missing
missing = []
env_vars = {
    'CORRECT_LOGIN': CORRECT_LOGIN,
    'CORRECT_LOGIN2': CORRECT_LOGIN2,
    'CORRECT_LOGIN3': CORRECT_LOGIN3,
    'CORRECT_LOGIN4': CORRECT_LOGIN4,
    'ROOM': ROOM,
    'ROOM2': ROOM2,
    'WRONG_ROOM': WRONG_ROOM,
    'INCORRECT_LOGIN': INCORRECT_LOGIN,
    'INCORRECT_LOGIN2': INCORRECT_LOGIN2,
    'WRONG_ROOM2': WRONG_ROOM2,
    'DEMOHUB': DEMOHUB,
    'BASE_URL': BASE_URL,
    'PARTIAL_LOGIN': PARTIAL_LOGIN,
    'PARTIAL_LOGIN2': PARTIAL_LOGIN2,
    'PARTIAL_LOGIN3': PARTIAL_LOGIN3,
}

for key, value in env_vars.items():
    if not value:
        missing.append(key)

if missing:
    raise RuntimeError(f"Missing required env vars: {', '.join(missing)}. Add them to .env")


class TestGuestInTouchLogin:
    """Guest in Touch Login test suite"""

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        """Go to login page before each test"""
        self.login_page = LoginPage(page)
        self.login_page.goto(BASE_URL)
        self.page = page

    def test_should_login_with_correct_room_and_surname_a(self, page: Page):
        """Test login with correct room and surname (A)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN, mode='standard')
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN, 15000)

    def test_should_login_with_correct_room_and_surname_b(self, page: Page):
        """Test login with correct room and surname (B)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN, mode='fandb')
        expect(page).not_to_have_url(BASE_URL)
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN, 15000, 'fandb')

    def test_should_login_and_open_chat_a(self, page: Page, context: BrowserContext):
        """Test login and open chat (A)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN, mode='standard')
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN, 15000)
        chat_page = self.login_page.open_chat(context)
        chat_page.assert_agent_name("Alex Hub OS")

    def test_should_login_and_open_chat_b(self, page: Page, context: BrowserContext):
        """Test login and open chat (B)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN, mode='fandb', assert_room=True)
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN, 15000, 'fandb')
        
        with context.expect_page() as new_page_info:
            page.locator("div.gradient h2.title", has_text="Hablamos?").click()
        
        chat_page = new_page_info.value
        chat_page.wait_for_load_state("domcontentloaded")
        expect(chat_page.locator("h3._9vd5._9scb._9scr")).to_contain_text("Alex Hub OS")

    def test_should_login_with_room_number_without_leading_zero_a(self, page: Page):
        """Test login with room number without leading zero (A)"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN, mode='standard')
        expect(page).not_to_have_url(BASE_URL)
        self.login_page.assert_logged_in(ROOM2, CORRECT_LOGIN, 15000)

    def test_should_login_with_room_number_without_leading_zero_b(self, page: Page):
        """Test login with room number without leading zero (B)"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN, mode='fandb', assert_room=True)
        self.login_page.assert_logged_in(ROOM2, CORRECT_LOGIN, 15000, 'fandb')

    def test_should_not_login_with_incorrect_room_number_a(self, page: Page):
        """Test should not login with incorrect room number (A)"""
        self.login_page.login(room=WRONG_ROOM2, name=CORRECT_LOGIN, mode='standard')
        expect(page).to_have_url(BASE_URL)

    def test_should_not_login_with_incorrect_room_number_b(self, page: Page):
        """Test should not login with incorrect room number (B)"""
        self.login_page.login(room=WRONG_ROOM2, name=CORRECT_LOGIN, mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))
        expect(page).to_have_url(BASE_URL)

    def test_should_not_login_with_incorrect_surname_a(self, page: Page):
        """Test should not login with incorrect surname (A)"""
        self.login_page.login(room=ROOM, name=INCORRECT_LOGIN2, mode='standard')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_not_login_with_incorrect_surname_b(self, page: Page):
        """Test should not login with incorrect surname (B)"""
        self.login_page.login(room=ROOM, name=INCORRECT_LOGIN, mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_empty_fields_a(self, page: Page):
        """Test should show error for empty fields (A)"""
        self.login_page.login_button.click()
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_visible()
        self.login_page.assert_notification_contains(re.compile(r'intro', re.I))

    def test_should_show_error_for_empty_fields_b(self, page: Page):
        """Test should show error for empty fields (B)"""
        self.login_page.login_button.click()
        self.login_page.assert_notification_contains(re.compile(r'intro', re.I))

    def test_should_show_error_for_special_characters_in_room_a(self, page: Page):
        """Test should show error for special characters in room (A)"""
        self.login_page.login(room="@#!", name=CORRECT_LOGIN4, mode='standard')
        self.login_page.assert_notification_visible()

    def test_should_show_error_for_special_characters_in_room_b(self, page: Page):
        """Test should show error for special characters in room (B)"""
        self.login_page.login(room="@#!", name=CORRECT_LOGIN4, mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_special_characters_in_surname_a(self, page: Page):
        """Test should show error for special characters in surname (A)"""
        self.login_page.login(room=ROOM, name="D@foe", mode='standard')
        self.login_page.assert_notification_visible()

    def test_should_show_error_for_special_characters_in_surname_b(self, page: Page):
        """Test should show error for special characters in surname (B)"""
        self.login_page.login(room=ROOM, name="D@foe", mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_very_long_room_number_a(self, page: Page):
        """Test should show error for very long room number (A)"""
        self.login_page.login(room="0" * 50, name=CORRECT_LOGIN4, mode='standard')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_visible()
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_very_long_room_number_b(self, page: Page):
        """Test should show error for very long room number (B)"""
        self.login_page.login(room="0" * 50, name=CORRECT_LOGIN4, mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_very_long_surname_a(self, page: Page):
        """Test should show error for very long surname (A)"""
        long_name = CORRECT_LOGIN4 * 100
        self.login_page.login(room=ROOM, name=long_name, mode='standard')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_visible()
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_very_long_surname_b(self, page: Page):
        """Test should show error for very long surname (B)"""
        very_long = CORRECT_LOGIN4 * 1000
        self.login_page.login(room=ROOM, name=very_long, mode='fandb')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_visible()
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_for_whitespace_in_room_and_surname_a(self, page: Page):
        """Test should show error for whitespace in room and surname (A)"""
        self.login_page.login(room=f" {ROOM} ", name=f" {CORRECT_LOGIN4} ", mode='standard')
        self.login_page.assert_notification_visible()

    def test_should_show_error_for_whitespace_in_room_and_surname_b(self, page: Page):
        """Test should show error for whitespace in room and surname (B)"""
        self.login_page.login(room=f" {ROOM} ", name=f" {CORRECT_LOGIN4} ", mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'no.*res.*:', re.I))

    def test_should_show_error_when_only_room_is_filled_a(self, page: Page):
        """Test should show error when only room is filled (A)"""
        self.login_page.login(room=ROOM, name="", mode='standard')
        self.login_page.assert_notification_visible()

    def test_should_show_error_when_only_room_is_filled_b(self, page: Page):
        """Test should show error when only room is filled (B)"""
        self.login_page.login(room=ROOM, name="", mode='fandb')
        self.login_page.assert_notification_contains(re.compile(r'intro', re.I))

    def test_should_show_error_when_only_surname_is_filled_a(self, page: Page):
        """Test should show error when only surname is filled (A)"""
        self.login_page.login(room="", name=CORRECT_LOGIN4, mode='standard')
        expect(page).to_have_url(BASE_URL)

    def test_should_show_error_when_only_surname_is_filled_b(self, page: Page):
        """Test should show error when only surname is filled (B)"""
        self.login_page.login(room="", name=CORRECT_LOGIN4, mode='fandb')
        self.login_page.assert_notification_visible()
        self.login_page.assert_notification_contains(re.compile(r'intro', re.I))

    def test_should_not_login_with_extra_trailing_zero_in_room_number_a(self, page: Page):
        """Test should not login with extra trailing zero in room number (A)"""
        self.login_page.login(room=ROOM + "0", name=CORRECT_LOGIN4, mode='standard')
        self.login_page.assert_notification_contains_all([
            re.compile(r'no.*res.*:', re.I),
            CORRECT_LOGIN4,
            ROOM + "0"
        ])

    def test_should_not_login_with_extra_trailing_zero_in_room_number_b(self, page: Page):
        """Test should not login with extra trailing zero in room number (B)"""
        self.login_page.login(room=ROOM + "0", name=CORRECT_LOGIN4, mode='fandb')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_contains_all([
            re.compile(r'no.*res.*:', re.I),
            CORRECT_LOGIN4,
            ROOM + "0"
        ])

    def test_should_not_login_with_double_leading_zero_in_room_number_a(self, page: Page):
        """Test should not login with double leading zero in room number (A)"""
        self.login_page.login(room=WRONG_ROOM, name=CORRECT_LOGIN4, mode='standard')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_contains_all([
            re.compile(r'no.*res.*:', re.I),
            CORRECT_LOGIN4,
            WRONG_ROOM
        ])

    def test_should_not_login_with_double_leading_zero_in_room_number_b(self, page: Page):
        """Test should not login with double leading zero in room number (B)"""
        self.login_page.login(room=WRONG_ROOM, name=CORRECT_LOGIN4, mode='fandb')
        expect(page).to_have_url(BASE_URL)
        self.login_page.assert_notification_contains_all([
            re.compile(r'no.*res.*:', re.I),
            CORRECT_LOGIN4,
            WRONG_ROOM
        ])

    def test_should_not_allow_login_with_partial_name_for_room_440_security_proof(self, page: Page):
        """Security proof: This test currently passes due to a vulnerability"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN2, mode='standard')
        self.login_page.assert_logged_in(ROOM2, PARTIAL_LOGIN, 15000, 'fandb')

    def test_should_not_allow_login_with_partial_name_for_room_0440_security_proof(self, page: Page):
        """Security proof: This test currently passes due to a vulnerability"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN3, mode='standard')
        self.login_page.assert_logged_in(ROOM, PARTIAL_LOGIN3, 15000, 'fandb')

    def test_should_login_with_full_name_willem_dafoe_0440_a(self, page: Page):
        """Test login with full name Willem Dafoe (0440) (A)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN4, mode='standard')
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN4, 15000)

    def test_should_login_with_full_name_willem_dafoe_0440_b(self, page: Page):
        """Test login with full name Willem Dafoe (0440) (B)"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN4, mode='fandb')
        expect(page).not_to_have_url(BASE_URL)
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN4, 15000, 'fandb')

    def test_should_login_with_full_name_willem_dafoe_440_a(self, page: Page):
        """Test login with full name Willem Dafoe (440) (A)"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN4, mode='standard')
        self.login_page.assert_logged_in(ROOM2, CORRECT_LOGIN4, 15000)

    def test_should_login_with_full_name_willem_dafoe_440_b(self, page: Page):
        """Test login with full name Willem Dafoe (440) (B)"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN4, mode='fandb', assert_room=True)
        self.login_page.assert_logged_in(ROOM2, CORRECT_LOGIN, 15000, 'fandb')

    def test_should_login_with_full_name_willem_dafoe_0440_fandb(self, page: Page):
        """Test login with full name Willem Dafoe (0440) fandb mode"""
        self.login_page.login(room=ROOM, name=CORRECT_LOGIN4, mode='fandb')
        self.login_page.assert_logged_in(ROOM, CORRECT_LOGIN4, 15000, 'fandb')

    def test_should_login_with_full_name_willem_dafoe_440_standard(self, page: Page):
        """Test login with full name Willem Dafoe (440) standard mode"""
        self.login_page.login(room=ROOM2, name=CORRECT_LOGIN4, mode='standard')
        expect(page).not_to_have_url(BASE_URL)
        self.login_page.assert_logged_in(ROOM2, CORRECT_LOGIN4, 15000)
