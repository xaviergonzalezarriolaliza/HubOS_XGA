import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const url = 'https://dev.hub-buildings.com/guest/index/login/eyJpZF9idWlsZGluZyI6IjgiLCJndWVzdF9uYW1lIjoiIiwiZ3Vlc3Rfcm9vbSI6IiIsImlkX2xhbmciOiIxIiwibGFuZ3VhZ2UiOiJFUyIsImdpdF9oZWFkZXJfaW1hZ2UiOiJodHRwczovL2Rldi5odWItYnVpbGRpbmdzLmNvbS9maWxlcy9ocHMvYnVpbGRpbmc4L2ltYWdlcy84XzIwMjIxMjAxMTAxMTAzXzYzODg3ZGI3ZWIwODMuanBlZyJ9';

// Test: Login with correct room number and surname
// Test: Login with room number without leading zero
// Test: Login with incorrect room number
// Test: Login with incorrect surname
// Test: Login with empty fields

test.describe('Guest in Touch Login', () => {
  // Try several selectors for room and surname fields
  // Go to login page before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(url);
  });

  test('should login with correct room and surname (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0440', 'Willem Dafoe');
    await expect(page.locator('body')).toContainText('0440');                                 // assertions
    await expect(page.locator('body')).toContainText('Willem Dafoe');
    await expect(page.locator('body')).toContainText('Hotel Demo Hub');
  });

  test('should login with correct room and surname (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('0440', 'Willem Dafoe');
    await expect(page).not.toHaveURL(url);                                                    // assertions
    await expect(loginPage.fandbForm).toContainText('0440');
    await expect(loginPage.fandbForm).toContainText('Willem Dafoe');
    await expect(loginPage.hotelName).toContainText('Hotel Demo Hub');
  });

  test('should login with room number without leading zero (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('440', 'Willem Dafoe');
    await expect(page).not.toHaveURL(url);                                                    // assertions
    await expect(page.locator('body')).toContainText('440');
    await expect(page.locator('body')).toContainText('Willem Dafoe');
    await expect(page.locator('body')).toContainText('Hotel Demo Hub');
  });

  test('should login with room number without leading zero (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('440', 'Willem Dafoe');
    await expect(page).not.toHaveURL(url);                                                    // assertions
    await expect(page.locator('.fandb-form')).toContainText('440');
    await expect(page.locator('.fandb-form')).toContainText('Willem Dafoe');
    await expect(page.locator('.hotel-name').first()).toContainText('Hotel Demo Hub');
  });

  test('should not login with incorrect room number (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('9999', 'Willem Dafoe');
    await expect(page).toHaveURL(url);                                                                                                         // assertion
  });

  test('should not login with incorrect room number (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('9999', 'Willem Dafoe');
    // Expect error
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i);                    // error msg
    await expect(page).toHaveURL(url);                                                      // url remains, noes not refresh, error!
  });

  test('should not login with incorrect surname (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0440', 'Follet Verd');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i);                  // confirm error msg 

  });

  test('should not login with incorrect surname (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('0440', 'Green Dwarf');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i);                // confirm error msg
  });

  test('should show error for empty fields (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // assertion
  });

  test('should show error for empty fields (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // assertion
  });

  test('should show error for special characters in room (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('@#!', 'Willem Dafoe');
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
  });

  test('should show error for special characters in room (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('@#!', 'Willem Dafoe');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });


  test('should show error for special characters in surname (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0440', 'D@foe');
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
  });

  test('should show error for special characters in surname (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('0440', 'D@foe');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error for very long room number (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0'.repeat(50), 'Willem Dafoe');
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error for very long room number (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0'.repeat(50), 'Willem Dafoe');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error for very long surname (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0440', 'Willem Dafoe'.repeat(10));
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error for very long surname (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('0440', 'Willem Dafoe'.repeat(10));
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error for whitespace in room and surname (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(' 0440 ', ' Willem Dafoe ');
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
  });

  test('should show error for whitespace in room and surname (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(' 0440 ', ' Willem Dafoe ');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
  });

  test('should show error when only room is filled (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill('0440');
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
  });

  test('should show error when only room is filled (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill('0440');
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // assertion
  });

  test('should show error when only surname is filled (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill('Willem Dafoe');
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // assertion
  });

  test('should show error when only surname is filled (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill('Willem Dafoe');
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // assertion
  });

  test('should not login with extra trailing zero in room number (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('04400', 'Willem Dafoe');
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('Willem Dafoe'); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('04400'); // assertion
  });

  test('should not login with extra trailing zero in room number (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('04400', 'Willem Dafoe');
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('Willem Dafoe'); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('04400'); // assertion
    });

  test('should not login with double leading zero in room number (A)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName('00440', 'Willem Dafoe');
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('Willem Dafoe'); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('00440'); // assertion
  });

  test('should not login with double leading zero in room number (B)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs('00440', 'Willem Dafoe');
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('Willem Dafoe'); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText('00440'); // assertion
  });
});
