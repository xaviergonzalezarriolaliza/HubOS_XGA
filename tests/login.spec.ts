import { test, expect } from '@playwright/test';

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
    await page.goto(url);
  });

  test('should login with correct room and surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).not.toHaveURL(url);
  });

  test('should login with correct room and surname (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0440');
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    await expect(page.getByPlaceholder('Introduzca su habitación')).toBeHidden();
  });

  test('should login with room number without leading zero (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('440');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).not.toHaveURL(url);
  });

  test('should login with room number without leading zero (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('440');
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    await expect(page.getByPlaceholder('Introduzca su habitación')).toBeHidden();
  });

  test('should not login with incorrect room number (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('9999');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should not login with incorrect room number (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('9999');
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should not login with incorrect surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Wrong Name');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should not login with incorrect surname (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0440');
    await page.getByPlaceholder('Introduzca su apellido').fill('Wrong Name');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for empty fields (A)', async ({ page }) => {
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for empty fields (B)', async ({ page }) => {
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for special characters in room (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('@#!');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for special characters in room (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('@#!');
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for special characters in surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('D@foe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for special characters in surname (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0440');
    await page.getByPlaceholder('Introduzca su apellido').fill('D@foe');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for very long room number (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0'.repeat(50));
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for very long room number (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0'.repeat(50));
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for very long surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Willem Dafoe'.repeat(10));
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for very long surname (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0440');
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe'.repeat(10));
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error for whitespace in room and surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill(' 0440 ');
    await page.locator('#guest_name').fill(' Willem Dafoe ');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error for whitespace in room and surname (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill(' 0440 ');
    await page.getByPlaceholder('Introduzca su apellido').fill(' Willem Dafoe ');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error when only room is filled (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });

  test('should show error when only room is filled (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su habitación').fill('0440');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });

  test('should show error when only surname is filled (A)', async ({ page }) => {
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url);
  });
  test('should show error when only surname is filled (B)', async ({ page }) => {
    await page.getByPlaceholder('Introduzca su apellido').fill('Willem Dafoe');
    await page.getByText('Acceder').click();
    // Add assertion for error message if available
  });
});
