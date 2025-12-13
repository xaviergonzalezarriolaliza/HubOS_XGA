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
    await expect(page.locator('body')).toContainText('0440');
    await expect(page.locator('body')).toContainText('Willem Dafoe');
    await expect(page.locator('body')).toContainText('Hotel Demo Hub');
  });

  test('should login with correct room and surname (B)', async ({ page }) => {
    const inputs = page.locator('.fandb-form-control-login');
    await inputs.nth(0).fill('0440');
    await inputs.nth(1).fill('Willem Dafoe');
    await page.locator('.btn-login').click();
    await expect(page).not.toHaveURL(url);
    // Assert room number is present in the form
    await expect(page.locator('.fandb-form')).toContainText('0440');
    // Assert guest name is present in the form
    await expect(page.locator('.fandb-form')).toContainText('Willem Dafoe');
    // Assert hotel name is present in the first .hotel-name heading
    await expect(page.locator('.hotel-name').first()).toContainText('Hotel Demo Hub');
    // Do not check .notyf-announcer visibility; it is always visible even on success
  });

  test('should login with room number without leading zero (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('440');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).not.toHaveURL(url);
    await expect(page.locator('body')).toContainText('440');
    await expect(page.locator('body')).toContainText('Willem Dafoe');
    await expect(page.locator('body')).toContainText('Hotel Demo Hub');
  });

  test('should login with room number without leading zero (B)', async ({ page }) => {
    const inputs = page.locator('.fandb-form-control-login');
    await inputs.nth(0).fill('440');
    await inputs.nth(1).fill('Willem Dafoe');
    await page.locator('.btn-login').click();
    await expect(page).not.toHaveURL(url);
    await expect(page.locator('.fandb-form')).toContainText('440');
    await expect(page.locator('.fandb-form')).toContainText('Willem Dafoe');
    await expect(page.locator('.hotel-name').first()).toContainText('Hotel Demo Hub');
  });

  test('should not login with incorrect room number (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('9999');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
  });

  test('should not login with incorrect room number (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('9999');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should not login with incorrect surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Wrong Name');
    await page.locator('#btn_login').click();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);

  });

  test('should not login with incorrect surname (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Wrong Name');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for empty fields (A)', async ({ page }) => {
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
    // Expect error
    await expect(page.locator('body > div.notyf-announcer')).toBeVisible();
    await expect(page.locator('body > div.notyf-announcer')).toContainText(/intro/i);
  });

  test('should show error for empty fields (B)', async ({ page }) => {
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('body > div.notyf-announcer')).toBeVisible();
    await expect(page.locator('body > div.notyf-announcer')).toContainText(/intro/i);
  });

  test('should show error for special characters in room (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('@#!');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('body > div.notyf-announcer')).toBeVisible();
    await expect(page.locator('body > div.notyf-announcer')).toContainText(/no.*res.*:/i);  
  });

  test('should show error for special characters in room (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('@#!');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('body > div.notyf-announcer')).toBeVisible();
    await expect(page.locator('body > div.notyf-announcer')).toContainText(/no.*res.*:/i); 
  });

  test('should show error for special characters in surname', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('D@foe');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('body > div.notyf-announcer')).toBeVisible();
    await expect(page.locator('body > div.notyf-announcer')).toContainText(/no.*res.*:/i); 
  });

  test('should show error for very long room number (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0'.repeat(50));
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for very long room number (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('0'.repeat(50));
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for very long surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Willem Dafoe'.repeat(10));
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for very long surname (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#guest_name').fill('Willem Dafoe'.repeat(10));
    await page.locator('#btn_login').click();
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for whitespace in room and surname (A)', async ({ page }) => {
    await page.locator('#guest_room').fill(' 0440 ');
    await page.locator('#guest_name').fill(' Willem Dafoe ');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error for whitespace in room and surname (B)', async ({ page }) => {
    await page.locator('#guest_room').fill(' 0440 ');
    await page.locator('#guest_name').fill(' Willem Dafoe ');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
  });

  test('should show error when only room is filled (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/intro/i);
  });

  test('should show error when only room is filled (B)', async ({ page }) => {
    await page.locator('#guest_room').fill('0440');
    await page.locator('#btn_login').click();
    // Expect error
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/intro/i);
  });

  test('should show error when only surname is filled (A)', async ({ page }) => {
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
  });

  test('should show error when only surname is filled (B)', async ({ page }) => {
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page.locator('.notyf-announcer')).toBeVisible();
    await expect(page.locator('.notyf-announcer')).toContainText(/intro/i);
  });

  test('should not login with extra trailing zero in room number (A)', async ({ page }) => {
    await page.locator('#guest_room').fill('04400');
    await page.locator('#guest_name').fill('Willem Dafoe');
    await page.locator('#btn_login').click();
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
    await expect(page.locator('.notyf-announcer')).toContainText('Willem Dafoe');
    await expect(page.locator('.notyf-announcer')).toContainText('04400');
  });

  test('should not login with extra trailing zero in room number (B)', async ({ page }) => {
    const inputs = page.locator('.fandb-form-control-login');
    await inputs.nth(0).fill('04400');
    await inputs.nth(1).fill('Willem Dafoe');
    await page.locator('.btn-login').click();
    await expect(page).toHaveURL(url); // <-- indicates login fail
    await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
    await expect(page.locator('.notyf-announcer')).toContainText('Willem Dafoe');
    await expect(page.locator('.notyf-announcer')).toContainText('04400');
    });

    test('should not login with double leading zero in room number (A)', async ({ page }) => {
      await page.locator('#guest_room').fill('00440');
      await page.locator('#guest_name').fill('Willem Dafoe');
      await page.locator('#btn_login').click();
      await expect(page).toHaveURL(url);
      await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
      await expect(page.locator('.notyf-announcer')).toContainText('Willem Dafoe');
      await expect(page.locator('.notyf-announcer')).toContainText('00440');
    });

    test('should not login with double leading zero in room number (B)', async ({ page }) => {
      const inputs = page.locator('.fandb-form-control-login');
      await inputs.nth(0).fill('00440');
      await inputs.nth(1).fill('Willem Dafoe');
      await page.locator('.btn-login').click();
      await expect(page).toHaveURL(url);
      await expect(page.locator('.notyf-announcer')).toContainText(/no.*res.*:/i);
      await expect(page.locator('.notyf-announcer')).toContainText('Willem Dafoe');
      await expect(page.locator('.notyf-announcer')).toContainText('00440');
  });
});
