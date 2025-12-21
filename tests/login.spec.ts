// Playwright test run: 304/304 tests passed (2025-12-16)
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
    // Use POM helpers: fill inputs and submit
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(ROOM, true);
    await expect(lp.fandbForm).toContainText(ROOM);
    await expect(lp.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(lp.hotelName).toContainText(DEMOHUB);
  });

  test("should login with correct room and surname (B)", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(ROOM, true);
    await expect(page).not.toHaveURL(url); // Assert that URL changes after successful login
    await expect(lp.fandbForm).toContainText(ROOM);
    await expect(lp.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(lp.hotelName).toContainText(DEMOHUB);
  });

  test("should login and open chat (A)", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN);
    // Wait for login to take effect and assert logged-in state via POM helper
    await loginPage.assertLoggedIn(ROOM, CORRECT_LOGIN, 15000);
    // Open chat using page-object helper that returns a ChatPage
    const chatPage = await loginPage.openChat(context);
    await chatPage.assertAgentName("Alex Hub OS");
  });

  test("should login and open chat (B)", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM, CORRECT_LOGIN);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    const [chatPage] = await Promise.all([
      context.waitForEvent("page"),
            // For simplicity, we are testing with Spanish for now...
      page.locator("div.gradient h2.title", { hasText: "Hablamos?" }).click()
    ]);
    await chatPage.waitForLoadState("domcontentloaded");
    await expect(chatPage.locator("h3._9vd5._9scb._9scr")).toContainText("Alex Hub OS");
  });

  test("should login with room number without leading zero (A)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM2);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(ROOM2, true);
    await expect(page).not.toHaveURL(url);
    await expect(page.locator("body")).toContainText(ROOM2);
    await expect(page.locator("body")).toContainText(CORRECT_LOGIN);
    await expect(page.locator("body")).toContainText(DEMOHUB);
  });

  test("should login with room number without leading zero (B)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM2);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(ROOM2, true);
    await expect(page).not.toHaveURL(url);
    await expect(lp.fandbForm).toContainText(ROOM2);
    await expect(lp.fandbForm).toContainText(CORRECT_LOGIN);
    await expect(lp.hotelName).toContainText(DEMOHUB);
  });

  test("should not login with incorrect room number (A)", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(WRONG_ROOM2);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(WRONG_ROOM2, false);
    await expect(page).toHaveURL(url);
  });

  test("should not login with incorrect room number (B)", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(WRONG_ROOM2);
    await lp.fillName(CORRECT_LOGIN);
    await lp.submitLogin(WRONG_ROOM2, false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
    await expect(page).toHaveURL(url);
  });

  test("should not login with incorrect surname (A)", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName(INCORRECT_LOGIN2);
    await lp.submitLogin(ROOM, false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should not login with incorrect surname (B)", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName(INCORRECT_LOGIN);
    await lp.submitLogin(ROOM, false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for empty fields (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
      await expect(page).toHaveURL(url); // Assert that URL remains unchanged if fields are empty
    await expect(loginPage.notyfAnnouncer).toBeVisible(); 
      await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // Assert error message: missing input
  });

  test("should show error for empty fields (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
      await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // Assert error message: missing input
  });

  test("should show error for special characters in room (A)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom("@#!");
    await lp.fillName(CORRECT_LOGIN4);
    await lp.submitLogin("@#!", false);
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test("should show error for special characters in room (B)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom("@#!");
    await lp.fillName(CORRECT_LOGIN4);
    await lp.submitLogin("@#!", false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for special characters in surname (A)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName("D@foe");
    await lp.submitLogin(ROOM, false);
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test("should show error for special characters in surname (B)", async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom(ROOM);
    await lp.fillName("D@foe");
    await lp.submitLogin(ROOM, false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for very long room number (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("0".repeat(50), CORRECT_LOGIN4);
      await expect(page).toHaveURL(url); // Assert that URL remains unchanged for very long room number
      await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message is visible for very long room number
      await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for very long room number
  });

  test("should show error for very long room number (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName("0".repeat(50), CORRECT_LOGIN4);
      await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for very long room number
  });

  // --- migrated to POM helpers ---
  test("should show error for very long room number (A) [POM]", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom("0".repeat(50));
    await lp.fillName(CORRECT_LOGIN4);
    await lp.submitLogin("0".repeat(50), false);
    await expect(page).toHaveURL(url);
    await expect(lp.notyfAnnouncer).toBeVisible();
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for very long room number (B) [POM]", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.fillRoom("0".repeat(50));
    await lp.fillName(CORRECT_LOGIN4);
    await lp.submitLogin("0".repeat(50), false);
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for very long surname (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, (CORRECT_LOGIN4).repeat(100));
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for very long surname
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message is visible for very long surname
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for very long surname
  });

  test("should show error for very long surname (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, (CORRECT_LOGIN4).repeat(1000)); // pushing to the max *1000, if we go up to 1000000 it is already failing, but we do not expect it
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for very long surname
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message is visible for very long surname
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for very long surname
  });

  test("should show error for very long surname (A) [POM]", async ({ page }) => {
    const lp = new LoginPage(page);
    const longName = (CORRECT_LOGIN4).repeat(100);
    await lp.fillRoom(ROOM);
    await lp.fillName(longName);
    await lp.submitLogin(ROOM, false);
    await expect(page).toHaveURL(url);
    await expect(lp.notyfAnnouncer).toBeVisible();
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for very long surname (B) [POM]", async ({ page }) => {
    const lp = new LoginPage(page);
    const longName = (CORRECT_LOGIN4).repeat(1000);
    await lp.fillRoom(ROOM);
    await lp.fillName(longName);
    await lp.submitLogin(ROOM, false);
    await expect(page).toHaveURL(url);
    await expect(lp.notyfAnnouncer).toBeVisible();
    await expect(lp.notyfAnnouncer).toContainText(/no.*res.*:/i);
  });

  test("should show error for whitespace in room and surname (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(` ${ROOM} `, ` ${CORRECT_LOGIN4} `);
      await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message: no reservation for room and surname with whitespace
  });

  test("should show error for whitespace in room and surname (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(` ${ROOM} `, ` ${CORRECT_LOGIN4} `);
      await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for room and surname with whitespace
  });

  test("should show error when only room is filled (A)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill(ROOM);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message: missing surname
  });

  test("should show error when only room is filled (B)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.roomInput.fill(ROOM);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // Assert error message: missing surname
  });

  test("should show error when only surname is filled (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill(CORRECT_LOGIN4);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged if only surname is filled
  });

  test("should show error when only surname is filled (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.nameInput.fill(CORRECT_LOGIN4);
    await loginPage.loginButton.click();
    await expect(loginPage.notyfAnnouncer).toBeVisible(); // Assert error message: missing room number
    await expect(loginPage.notyfAnnouncer).toContainText(/intro/i); // Assert error message: missing room number
  });

  test("should not login with extra trailing zero in room number (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM + "0", CORRECT_LOGIN4);
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for room with extra trailing zero
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // Assert error message: no reservation for room with extra trailing zero
    await expect(loginPage.notyfAnnouncer).toContainText(ROOM + "0"); // Assert error message: no reservation for room with extra trailing zero
  });

  test("should not login with extra trailing zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(ROOM + "0", CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with extra trailing zero
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for room with extra trailing zero
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // Assert error message: no reservation for room with extra trailing zero
    await expect(loginPage.notyfAnnouncer).toContainText(ROOM + "0"); // Assert error message: no reservation for room with extra trailing zero
  });

  test("should not login with double leading zero in room number (A)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(WRONG_ROOM, CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // Assert error message: no reservation for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(WRONG_ROOM); // Assert error message: no reservation for room with double leading zero
  });

  test("should not login with double leading zero in room number (B)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithFandbInputs(WRONG_ROOM, CORRECT_LOGIN4);
    await expect(page).toHaveURL(url); // Assert that URL remains unchanged for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(/no.*res.*:/i); // Assert error message: no reservation for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(CORRECT_LOGIN4); // Assert error message: no reservation for room with double leading zero
    await expect(loginPage.notyfAnnouncer).toContainText(WRONG_ROOM); // Assert error message: no reservation for room with double leading zero
  });

  // --- SECURITY PROOF TESTS
  test("should (not) allow login with partial name for room 440 (security proof)", async ({
    page,
  }) => {
    // Security proof: This test currently passes due to a vulnerability. If it fails in the future, the vulnerability has been fixed (expected behavior).
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN2);
    await expect(loginPage.fandbForm).toContainText(ROOM2);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
  });

  test("should (not) allow login with partial name for room 0440 (security proof)", async ({
    page,
  }) => {
    // Security proof: This test currently passes due to a vulnerability. If it fails in the future, the vulnerability has been fixed (expected behavior).
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN3);
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
  });

    test('should login with full name Willem Dafoe (0440) (A)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN4);
      // Recheck that login is successful and the correct room, name, and hotel are displayed
      await expect(loginPage.fandbForm).toContainText(ROOM);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (0440) (B)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithFandbInputs(ROOM, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      // Recheck that login is successful and the correct room, name, and hotel are displayed
      await expect(loginPage.fandbForm).toContainText(ROOM);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (440) (A)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      // Recheck that login is successful and the correct room, name, and hotel are displayed
      await expect(page.locator('body')).toContainText(ROOM2);
      await expect(page.locator('body')).toContainText(CORRECT_LOGIN4);
      await expect(page.locator('body')).toContainText(DEMOHUB);
    });

    test('should login with full name Willem Dafoe (440) (B)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginWithFandbInputs(ROOM2, CORRECT_LOGIN4);
      await expect(page).not.toHaveURL(url);
      // Recheck that login is successful and the correct room, name, and hotel are displayed
      await expect(loginPage.fandbForm).toContainText(ROOM2);
      await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
      await expect(loginPage.hotelName).toContainText(DEMOHUB);
    });
  test('should login with full name Willem Dafoe (0440)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM, CORRECT_LOGIN4);
    // Recheck that login is successful and the correct room, name, and hotel are displayed
    await expect(loginPage.fandbForm).toContainText(ROOM);
    await expect(loginPage.fandbForm).toContainText(CORRECT_LOGIN4);
    await expect(loginPage.hotelName).toContainText(DEMOHUB);
  });

  test('should login with full name Willem Dafoe (440)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithRoomAndName(ROOM2, CORRECT_LOGIN4);
    await expect(page).not.toHaveURL(url);
    // Recheck that login is successful and the correct room, name, and hotel are displayed
    await expect(page.locator('body')).toContainText(ROOM2);
    await expect(page.locator('body')).toContainText(CORRECT_LOGIN4);
    await expect(page.locator('body')).toContainText(DEMOHUB);
  });
});
