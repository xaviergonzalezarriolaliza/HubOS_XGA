import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const ROOM = process.env.ROOM || '0440';

test.describe('Breaker tests — try to break the app', () => {
  test.beforeEach(() => {
    if (!BASE_URL) test.skip(true, 'BASE_URL not set in environment — skipping breaker tests');
  });

  test.skip('XSS payload in name should not execute', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    await lp.fillRoom(ROOM);
    const payload = "<script>window.__xss_executed = true</script>";
    await lp.fillName(payload);
    await lp.submitLogin(ROOM, false);
    // If XSS executed this global would be true
    const executed = await page.evaluate(() => (window as any).__xss_executed);
    await expect(executed).not.toBe(true);
    await expect(page.locator('body')).toBeVisible();
  });

  test.skip('SQL injection-like payload should not bypass auth', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    await lp.fillRoom("' OR '1'='1");
    await lp.fillName("' OR '1'='1");
    await lp.submitLogin("' OR '1'='1", false);
    // Expect stay on login page (no navigation)
    await expect(page).toHaveURL(BASE_URL!);
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test.skip('very long inputs do not crash the app', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    const long = 'A'.repeat(20000);
    await lp.fillRoom(long);
    await lp.fillName(long);
    await lp.submitLogin(long, false);
    await expect(page.locator('body')).toBeVisible();
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test.skip('unicode & emoji input handled safely', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    const unicode = '𠜎 😀 漢字 — тест — prueba';
    await lp.fillRoom(ROOM);
    await lp.fillName(unicode);
    await lp.submitLogin(ROOM, false);
    await expect(page.locator('body')).toBeVisible();
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test.skip('null / control characters do not crash the app', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    const ctrl = 'abc\u0000\u0001\u0002';
    await lp.fillRoom(ctrl);
    await lp.fillName(ctrl);
    await lp.submitLogin(ctrl, false);
    await expect(page.locator('body')).toBeVisible();
    await expect(lp.notyfAnnouncer).toBeVisible();
  });

  test.skip('rapid repeated submits should not crash or hang', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto(BASE_URL!);
    await lp.fillRoom(ROOM);
    await lp.fillName('rapid-submit-test');
    // Click submit rapidly
    for (let i = 0; i < 10; i++) {
      await lp.loginButton.click();
    }
    await expect(page.locator('body')).toBeVisible();
  });
});
