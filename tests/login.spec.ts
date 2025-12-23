// HubOS QA Engineer Homework XGA

import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import * as dotenv from 'dotenv';
dotenv.config();

const CORRECT_LOGIN = process.env.CORRECT_LOGIN;
const CORRECT_LOGIN2 = process.env.CORRECT_LOGIN2;
const CORRECT_LOGIN3 = process.env.CORRECT_LOGIN3;
const CORRECT_LOGIN4 = process.env.CORRECT_LOGIN4;
const ROOM = process.env.ROOM;
const ROOM2 = process.env.ROOM2;
const WRONG_ROOM = process.env.WRONG_ROOM;
const INCORRECT_LOGIN = process.env.INCORRECT_LOGIN;
const INCORRECT_LOGIN2 = process.env.INCORRECT_LOGIN2;
const WRONG_ROOM2 = process.env.WRONG_ROOM2;
const DEMOHUB = process.env.DEMOHUB;
const BASE_URL = process.env.BASE_URL;
const PARTIAL_LOGIN = process.env.PARTIAL_LOGIN;
const PARTIAL_LOGIN2 = process.env.PARTIAL_LOGIN2;
const PARTIAL_LOGIN3 = process.env.PARTIAL_LOGIN3;

// Fail fast if required env vars are missing — avoids embedding hardcoded values in source
const missing: string[] = [];
if (!CORRECT_LOGIN) missing.push('CORRECT_LOGIN');
if (!CORRECT_LOGIN2) missing.push('CORRECT_LOGIN2');
if (!CORRECT_LOGIN3) missing.push('CORRECT_LOGIN3');
if (!CORRECT_LOGIN4) missing.push('CORRECT_LOGIN4');
if (!ROOM) missing.push('ROOM');
if (!ROOM2) missing.push('ROOM2');
if (!WRONG_ROOM) missing.push('WRONG_ROOM');
if (!INCORRECT_LOGIN) missing.push('INCORRECT_LOGIN');
if (!INCORRECT_LOGIN2) missing.push('INCORRECT_LOGIN2');
if (!WRONG_ROOM2) missing.push('WRONG_ROOM2');
if (!DEMOHUB) missing.push('DEMOHUB');
if (!BASE_URL) missing.push('BASE_URL');
if (!PARTIAL_LOGIN) missing.push('PARTIAL_LOGIN');
if (!PARTIAL_LOGIN2) missing.push('PARTIAL_LOGIN2');
if (!PARTIAL_LOGIN3) missing.push('PARTIAL_LOGIN3');

if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}. Add them to .env`);
}

const url = BASE_URL;

// Test: Login with correct room number and surname
// Test: Login with room number without leading zero
// Test: Login with incorrect room number
// Test: Login with incorrect surname
// Test: Login with empty fields

test.describe("Guest in Touch Login", () => {
  let loginPage: LoginPage;
  // Try several selectors for room and surname fields
  // Go to login page before each test
  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(url);
  });

  test("should login with correct room and surname (A)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN, mode: 'standard' });
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN, 15000);
  });

  test("should login with correct room and surname (B)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN, mode: 'fandb' });
    await expect(page).not.toHaveURL(url);
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN, 15000, 'fandb');
  });

  test("should login and open chat (A)", async ({ page, context }) => {
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN, mode: 'standard' });
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN, 15000);
    const chatPage = await loginPage.openChat(context);
    await chatPage.assertAgentName("Alex Hub OS");
  });

  test("should login and open chat (B)", async ({ page, context }) => {
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN, mode: 'fandb', assertRoom: true });
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN, 15000, 'fandb');
    const [chatPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("div.gradient h2.title", { hasText: "Hablamos?" }).click()
    ]);
    await chatPage.waitForLoadState("domcontentloaded");
    await expect(chatPage.locator("h3._9vd5._9scb._9scr")).toContainText("Alex Hub OS");
  });

  test("should login with room number without leading zero (A)", async ({ page }) => {
    await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN, mode: 'standard' });
    await expect(page).not.toHaveURL(url);
    await loginPage.assertLoggedIn(ROOM2, CORRECT_LOGIN, 15000);
  });

  test("should login with room number without leading zero (B)", async ({ page }) => {
    await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN, mode: 'fandb', assertRoom: true });
    await loginPage.assertLoggedIn(ROOM2, CORRECT_LOGIN, 15000, 'fandb');
  });

  test("should not login with incorrect room number (A)", async ({ page }) => {
    await loginPage.login({ room: WRONG_ROOM2, name: CORRECT_LOGIN, mode: 'standard' });
    await expect(page).toHaveURL(url);
  });

  test("should not login with incorrect room number (B)", async ({ page }) => {
    await loginPage.login({ room: WRONG_ROOM2, name: CORRECT_LOGIN, mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
    await expect(page).toHaveURL(url);
  });

  test("should not login with incorrect surname (A)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: INCORRECT_LOGIN2, mode: 'standard' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should not login with incorrect surname (B)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: INCORRECT_LOGIN, mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should show error for empty fields (A)", async ({ page }) => {
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged if fields are empty
    await loginPage.assertNotificationVisible();
    await loginPage.assertNotificationContains(/intro/i); // Assert error message: missing input
  });

  test("should show error for empty fields (B)", async ({ page }) => {
    await loginPage.loginButton.click();
    await loginPage.assertNotificationContains(/intro/i); // Assert error message: missing input
  });

  test("should show error for special characters in room (A)", async ({ page }) => {
    await loginPage.login({ room: "@#!", name: CORRECT_LOGIN4, mode: 'standard' });
    await loginPage.assertNotificationVisible();
  });

  test("should show error for special characters in room (B)", async ({ page }) => {
    await loginPage.login({ room: "@#!", name: CORRECT_LOGIN4, mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should show error for special characters in surname (A)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: "D@foe", mode: 'standard' });
    await loginPage.assertNotificationVisible();
  });

  test("should show error for special characters in surname (B)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: "D@foe", mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  

  // --- migrated to POM helpers ---
  test("should show error for very long room number (A)", async ({ page }) => {
    await loginPage.login({ room: "0".repeat(50), name: CORRECT_LOGIN4, mode: 'standard' });
    await expect(page).toHaveURL(url);
    await loginPage.assertNotificationVisible();
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should show error for very long room number (B)", async ({ page }) => {
    await loginPage.login({ room: "0".repeat(50), name: CORRECT_LOGIN4, mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should show error for very long surname (A)", async ({ page }) => {
    const longName = (CORRECT_LOGIN4).repeat(100);
    await loginPage.login({ room: ROOM, name: longName, mode: 'standard' });
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for very long surname
    await loginPage.assertNotificationVisible(); // Assert error message is visible for very long surname
    await loginPage.assertNotificationContains(/no.*res.*:/i); // Assert error message: no reservation for very long surname
  });

  test("should show error for very long surname (B)", async ({ page }) => {
    const veryLong = (CORRECT_LOGIN4).repeat(1000);
    await loginPage.login({ room: ROOM, name: veryLong, mode: 'fandb' });
    await expect(page).toHaveURL(url);
    await loginPage.assertNotificationVisible();
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });


  test("should show error for whitespace in room and surname (A)", async ({
    page,
  }) => {
    await loginPage.login({ room: ` ${ROOM} `, name: ` ${CORRECT_LOGIN4} `, mode: 'standard' });
    await loginPage.assertNotificationVisible(); // Assert error message: no reservation for room and surname with whitespace
  });

  test("should show error for whitespace in room and surname (B)", async ({
    page,
  }) => {
    await loginPage.login({ room: ` ${ROOM} `, name: ` ${CORRECT_LOGIN4} `, mode: 'fandb' });
    await loginPage.assertNotificationContains(/no.*res.*:/i);
  });

  test("should show error when only room is filled (A)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: "", mode: 'standard' });
    await loginPage.assertNotificationVisible(); // Assert error message: missing surname
  });

  test("should show error when only room is filled (B)", async ({ page }) => {
    await loginPage.login({ room: ROOM, name: "", mode: 'fandb' });
    await loginPage.assertNotificationContains(/intro/i); // Assert error message: missing surname
  });

  test("should show error when only surname is filled (A)", async ({
    page,
  }) => {
    await loginPage.login({ room: "", name: CORRECT_LOGIN4, mode: 'standard' });
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged if only surname is filled
  });

  test("should show error when only surname is filled (B)", async ({
    page,
  }) => {
    await loginPage.login({ room: "", name: CORRECT_LOGIN4, mode: 'fandb' });
    await loginPage.assertNotificationVisible(); // Assert error message: missing room number
    await loginPage.assertNotificationContains(/intro/i); // Assert error message: missing room number
  });

  test("should not login with extra trailing zero in room number (A)", async ({
    page,
  }) => {
    await loginPage.login({ room: ROOM + "0", name: CORRECT_LOGIN4, mode: 'standard' });
    await loginPage.assertNotificationContainsAll([/no.*res.*:/i, CORRECT_LOGIN4, ROOM + "0"]); // Assert error message: no reservation for room with extra trailing zero
  });

  test("should not login with extra trailing zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login({ room: ROOM + "0", name: CORRECT_LOGIN4, mode: 'fandb' });
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with extra trailing zero
    await loginPage.assertNotificationContainsAll([/no.*res.*:/i, CORRECT_LOGIN4, ROOM + "0"]); // Assert error message: no reservation for room with extra trailing zero
  });

  test("should not login with double leading zero in room number (A)", async ({
    page,
  }) => {
    await loginPage.login({ room: WRONG_ROOM, name: CORRECT_LOGIN4, mode: 'standard' });
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with double leading zero
    await loginPage.assertNotificationContainsAll([/no.*res.*:/i, CORRECT_LOGIN4, WRONG_ROOM]); // Assert error message: no reservation for room with double leading zero
  });

  test("should not login with double leading zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login({ room: WRONG_ROOM, name: CORRECT_LOGIN4, mode: 'fandb' });
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with double leading zero
    await loginPage.assertNotificationContainsAll([/no.*res.*:/i, CORRECT_LOGIN4, WRONG_ROOM]); // Assert error message: no reservation for room with double leading zero
  });

  // --- SECURITY PROOF TESTS
  test("should (not) allow login with partial name for room 440 (security proof)", async ({
    page,
  }) => {
    // Security proof: This test currently passes due to a vulnerability. If it fails in the future, the vulnerability has been fixed (expected behavior).
    await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN2, mode: 'standard' });
    await loginPage.assertLoggedIn(ROOM2, PARTIAL_LOGIN, 15000, 'fandb');
  });

  test("should (not) allow login with partial name for room 0440 (security proof)", async ({
    page,
  }) => {
    // Security proof: This test currently passes due to a vulnerability. If it fails in the future, the vulnerability has been fixed (expected behavior).
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN3, mode: 'standard' });
    await loginPage.assertLoggedIn(ROOM, PARTIAL_LOGIN3, 15000, 'fandb');
  });

    test('should login with full name Willem Dafoe (0440) (A)', async ({ page }) => {
      await loginPage.login({ room: ROOM, name: CORRECT_LOGIN4, mode: 'standard' });
      await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN4, 15000);
    });

    test('should login with full name Willem Dafoe (0440) (B)', async ({ page }) => {
      await loginPage.login({ room: ROOM, name: CORRECT_LOGIN4, mode: 'fandb' });
      await expect(page).not.toHaveURL(url);
      // Recheck that login is successful and the correct room, name, and hotel are displayed
      await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN4, 15000, 'fandb');
    });

    test('should login with full name Willem Dafoe (440) (A)', async ({ page }) => {
      await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN4, mode: 'standard' });
      await loginPage.assertLoggedIn(ROOM2, CORRECT_LOGIN4, 15000);
    });

    test('should login with full name Willem Dafoe (440) (B)', async ({ page }) => {
      await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN4, mode: 'fandb', assertRoom: true });
      await loginPage.assertLoggedIn(ROOM2, CORRECT_LOGIN4, 15000, 'fandb');
    });
  test('should login with full name Willem Dafoe (0440)', async ({ page }) => {
    await loginPage.login({ room: ROOM, name: CORRECT_LOGIN4, mode: 'fandb' });
    // Recheck that login is successful and the correct room, name, and hotel are displayed
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN4, 15000, 'fandb');
  });

  test('should login with full name Willem Dafoe (440)', async ({ page }) => {
    await loginPage.login({ room: ROOM2, name: CORRECT_LOGIN4, mode: 'standard' });
    await expect(page).not.toHaveURL(url);
    // Recheck that login is successful and the correct room, name, and hotel are displayed
    await loginPage.assertLoggedIn(ROOM2, CORRECT_LOGIN4, 15000);
  });

});
