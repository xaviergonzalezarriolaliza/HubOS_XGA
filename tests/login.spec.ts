// Xavier Gonzalez Arriola                                                                                  2025-12-14
// Playwright test run: 256 tests passed (2025-12-14)
// =========================================================================================================
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
  // Try several selectors for room and surname fields
  // Go to login page before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(url);
  });

  test("should login with correct room and surname (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(loginPage.hotelName).toContainText(DEMOHUB);
  });

  test("should login with correct room and surname (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM, CORRECT_LOGIN);
    await expect(page).not.toHaveURL(url); // assertions
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(loginPage.hotelName).toContainText(DEMOHUB);
  });

  test("should login and open chat (A)", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN);
    // Wait for main menu
    await expect(loginPage.fandbForm).toContainText(ROOM);
    // Click the 'Hablamos?' chat element (h2 inside .gradient) and wait for new tab
    const [chatPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("div.gradient h2.title", { hasText: "Hablamos?" }).click(),
    ]);
    await chatPage.waitForLoadState("domcontentloaded");
    // Check for <h3> element with class '_9vd5 _9scb _9scr' containing "Alex Hub OS" in the new tab
    await expect(chatPage.locator("h3._9vd5._9scb._9scr")).toContainText("Alex Hub OS");
  });

  test("should login and open chat (B)", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM, CORRECT_LOGIN);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    const [chatPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("div.gradient h2.title", { hasText: "Hablamos?" }).click(),
    ]);
    await chatPage.waitForLoadState("domcontentloaded");
    await expect(chatPage.locator("h3._9vd5._9scb._9scr")).toContainText(
      "Alex Hub OS",
    );
  });

  test("should login with room number without leading zero (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN);
    await expect(page).not.toHaveURL(url); // assertions
    await expect(page.locator("body")).toContainText(ROOM2);
    await expect(page.locator("body")).toContainText(CORRECT_LOGIN);
    await expect(page.locator("body")).toContainText(DEMOHUB);
  });

  test("should login with room number without leading zero (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM2, CORRECT_LOGIN);
    await expect(page).not.toHaveURL(url); // assertions
    await expect(loginPage.fandbForm).toContainText(ROOM2);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(loginPage.hotelName).toContainText(DEMOHUB);
  });

  test("should not login with incorrect room number (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(WRONG_ROOM2, CORRECT_LOGIN);
    await expect(page).toHaveURL(url); // error, page url not reloaded, same address
  });

  test("should not login with incorrect room number (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(WRONG_ROOM2, CORRECT_LOGIN);
    // Expect error
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error msg
    await expect(page).toHaveURL(url); // url remains, noes not refresh, error!
  });

  test("should not login with incorrect surname (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, INCORRECT_LOGIN2);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // confirm error msg
  });

  test("should not login with incorrect surname (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM, INCORRECT_LOGIN);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // confirm error msg
  });

  test("should show error for empty fields (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // confirm error msg
  });

  test("should show error for empty fields (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // confirm error msg
  });
  // await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN4); // Removed stray await statement causing syntax error
  test("should show error for special characters in room (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("@#!", CORRECT_LOGIN4);
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // confirm error msg, not really because special character, just no reservation
  });

  test("should show error for special characters in room (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("@#!", CORRECT_LOGIN4);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // eerror, no reservsation
  });

  test("should show error for special characters in surname (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, "D@foe");
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
  });

  test("should show error for special characters in surname (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM, "D@foe");
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error for very long room number (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("0".repeat(50), CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error for very long room number (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("0".repeat(50), CORRECT_LOGIN4);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error for very long surname (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, (CORRECT_LOGIN4).repeat(10));
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error for very long surname (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, (CORRECT_LOGIN4).repeat(10));
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error for whitespace in room and surname (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(` ${ROOM} `, ` ${CORRECT_LOGIN4} `);
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // error, no reservation
  });

  test("should show error for whitespace in room and surname (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(` ${ROOM} `, ` ${CORRECT_LOGIN4} `);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
  });

  test("should show error when only room is filled (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill(ROOM);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // error
  });

  test("should show error when only room is filled (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill(ROOM);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // error
  });

  test("should show error when only surname is filled (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill(CORRECT_LOGIN4);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // assertion
  });

  test("should show error when only surname is filled (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill(CORRECT_LOGIN4);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // error
  });

  test("should not login with extra trailing zero in room number (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM + "0", CORRECT_LOGIN4);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // error, no reservation
    await expect(loginPage.notyfAnnouncer).toContainText(ROOM + "0"); // error
  });

  test("should not login with extra trailing zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM + "0", CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(ROOM + "0"); // assertion
  });

  test("should not login with double leading zero in room number (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(WRONG_ROOM, CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(WRONG_ROOM); // assertion
  });

  test("should not login with double leading zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(WRONG_ROOM, CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // error, no reservation
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // assertion
    await expect(loginPage.notyfAnnouncer).toContainText(WRONG_ROOM); // assertion
  });

  // --- SECURITY PROOF TESTS
  test("should (not) allow login with partial name for room 440 (security proof)", async ({
    page,
  }) => {
    // SECURITY PROOF: This test demonstrates that partial name login is currently possible, but it should NOT be allowed.
    // If this test fails in the future, it means the vulnerability has been fixed (which is correct).
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN2);
    await expect(loginPage.fandbForm).toContainText(ROOM2);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
  });

  test("should (not) allow login with partial name for room 0440 (security proof)", async ({
    page,
  }) => {
    // SECURITY PROOF: This test demonstrates that partial name login is currently possible, but it should NOT be allowed.
    // If this test fails in the future, it means the vulnerability has been fixed (which is correct).
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN3);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
  });

    test('should login with full name Willem Dafoe (0440) (A)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN4);
      await expect(loginPage.fandbForm).toContainText(ROOM);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (0440) (B)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithFandbInputs(ROOM, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      await expect(loginPage.fandbForm).toContainText(ROOM);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (440) (A)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      await expect(page.locator('body')).toContainText(ROOM2);
      await expect(page.locator('body')).toContainText(CORRECT_LOGIN4);
      await expect(page.locator('body')).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (440) (B)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithFandbInputs(ROOM2, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      await expect(loginPage.fandbForm).toContainText(ROOM2);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });
  test('should login with full name Willem Dafoe (0440)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN4);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
    await expect(loginPage.hotelName).toContainText(DEMOHUB);
  });

  test('should login with full name Willem Dafoe (440)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN4);
    await expect(page).not.toHaveURL(url);
    await expect(page.locator('body')).toContainText(ROOM2);
    await expect(page.locator('body')).toContainText(CORRECT_LOGIN4);
    await expect(page.locator('body')).toContainText(DEMOHUB);
  });
});
