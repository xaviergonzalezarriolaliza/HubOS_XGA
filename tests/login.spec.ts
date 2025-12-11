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

  test('should login with correct room and surname', async ({ page }) => {
    await page.fill('#guest_room', '0440');
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).not.toHaveURL(url);
  });

  test('should login with room number without leading zero', async ({ page }) => {
    await page.fill('#guest_room', '440');
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).not.toHaveURL(url);
  });

  test('should not login with incorrect room number', async ({ page }) => {
    await page.fill('#guest_room', '9999');
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should not login with incorrect surname', async ({ page }) => {
    await page.fill('#guest_room', '0440');
    await page.fill('#guest_name', 'Wrong Name');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for empty fields', async ({ page }) => {
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for special characters in room', async ({ page }) => {
    await page.fill('#guest_room', '@#!');
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for special characters in surname', async ({ page }) => {
    await page.fill('#guest_room', '0440');
    await page.fill('#guest_name', 'D@foe');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for very long room number', async ({ page }) => {
    await page.fill('#guest_room', '0'.repeat(50));
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for very long surname', async ({ page }) => {
    await page.fill('#guest_room', '0440');
    await page.fill('#guest_name', 'Willem Dafoe'.repeat(10));
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error for whitespace in room and surname', async ({ page }) => {
    await page.fill('#guest_room', ' 0440 ');
    await page.fill('#guest_name', ' Willem Dafoe ');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error when only room is filled', async ({ page }) => {
    await page.fill('#guest_room', '0440');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });

  test('should show error when only surname is filled', async ({ page }) => {
    await page.fill('#guest_name', 'Willem Dafoe');
    await page.click('#btn_login');
    await expect(page).toHaveURL(url);
  });
});
