import { Page, Locator, expect, BrowserContext } from '@playwright/test';
import { ChatPage } from './ChatPage';
import { waitForLocatorVisible } from '../libs/waits';

export class LoginPage {
  readonly page: Page;
  readonly roomInput: Locator;
  readonly nameInput: Locator;
  readonly loginButton: Locator;
  readonly fandbInputs: Locator;
  readonly fandbForm: Locator;
  readonly hotelName: Locator;
  readonly notyfAnnouncer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomInput = page.locator('#guest_room');
    this.nameInput = page.locator('#guest_name');
    this.loginButton = page.locator('#btn_login');
    this.fandbInputs = page.locator('.fandb-form-control-login');
    this.fandbForm = page.locator('.fandb-form');
    this.hotelName = page.locator('.hotel-name').first();
    this.notyfAnnouncer = page.locator('.notyf-announcer');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async loginWithRoomAndName(room: string, name: string) {
    // Delegate to the unified `login` helper for the standard flow so
    // all login entry points funnel through a single method.
    await this.login({ room, name, mode: 'standard' });
  }

  /**
   * General-purpose login helper that unifies the different login flows.
   * - `useFandb`: whether to use the F&B inputs variant (keeps existing assertions).
   * - `assertRoom`: when true, waits for the room heading after login.
   * This is a non-breaking convenience wrapper so tests and other helpers
   * can call a single method for most login cases.
   */
  async login(
    options: { room?: string; name?: string; mode?: 'fandb' | 'standard'; assertRoom?: boolean } = {}
  ) {
    const { room = '', name = '', mode = 'standard', assertRoom = false } = options;
    if (mode === 'fandb') {
      await this.loginWithFandbInputs(room, name, assertRoom);
      return;
    }
    await this.fillRoom(room);
    await this.fillName(name);
    await this.submitLogin(room || undefined, assertRoom);
  }

  // Minimal POM helpers: fill inputs and submit. Backward-compatible with existing helpers.
  async fillRoom(room: string) {
    await this.roomInput.fill(room);
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  /**
   * Submit the login form. Optionally assert the room heading appears when `assertRoom` is true
   * and `room` is provided.
   */
  async submitLogin(room?: string, assertRoom = false) {
    await waitForLocatorVisible(this.loginButton);
    await this.loginButton.click();
    // If the caller requested `assertRoom`, the subsequent `waitForRoom`
    // will cover waiting for the UI. Only perform the explicit load
    // wait when the caller does not request that assertion to avoid
    // redundant waiting.
    if (!assertRoom) {
      await this.page.waitForLoadState('domcontentloaded');
    }
    if (assertRoom && room) {
      await this.waitForRoom(room);
    }
  }

  async loginWithFandbInputs(room: string, name: string, assertRoom = false) {
    // Backwards-compatible wrapper — delegate to the centralized F&B
    // implementation to keep behavior consistent.
    return this._doFandbLogin(room, name, assertRoom);
  }

  // Centralized F&B login implementation used by both `login` (mode='fandb')
  // and the backward-compatible `loginWithFandbInputs` wrapper.
  private async _doFandbLogin(room: string, name: string, assertRoom = false) {
    await expect(this.fandbInputs.first()).toBeVisible();
    await expect(this.fandbInputs.last()).toBeVisible();
    await expect(this.fandbInputs).toHaveCount(2);
    await this.fandbInputs.first().fill(room);                                         // nth(0)
    await expect(this.fandbInputs.first()).toHaveId('guest_room')                      // id
    await expect(this.fandbInputs.first()).toHaveValue(room);                          // verify value room
    await expect(this.page.locator('#guest_room')).toHaveValue(room);                  // with direct locator
    await this.fandbInputs.last().fill(name);                                          // nth(1)
    await expect(this.fandbInputs.last()).toHaveId('guest_name');                      // id
    await expect(this.fandbInputs.last()).toHaveValue(name);                           // verify value name 
    await expect(this.page.locator('#guest_name')).toHaveValue(name);                  // with direct locator
    await this.loginButton.click();
    // When `assertRoom` is true the following `waitForRoom` covers
    // waiting for the F&B form to appear; skip the explicit load
    // state wait in that case to reduce redundant waiting.
    if (!assertRoom) {
      await this.page.waitForLoadState('domcontentloaded');
    }
    // Only assert the room heading when caller requests it. Some tests
    // intentionally trigger failed logins and should not expect the room
    // heading to appear.
    if (assertRoom) {
      await this.waitForRoom(room);
    }
  }

  /**
   * Waits for the room heading inside the F&B form to be visible and returns its locator.
   * This centralizes the scoped lookup and timeout used by tests to avoid strict-mode
   * multiple-match errors when the same room appears in multiple page regions.
   */
  async waitForRoom(room: string, timeout = 15000) {
    const roomHeading = this.fandbForm.locator('h4.client-room', { hasText: room }).first();
    await expect(roomHeading).toBeVisible({ timeout });
    return roomHeading;
  }

  /**
   * Backwards-compatible alias used by tests: wait for the F&B form to display the
   * provided room. This centralizes any future selector changes in one place.
   */
  async waitForFandbToShow(room: string, timeout = 15000) {
    return this.waitForRoom(room, timeout);
  }

  /**
   * Clicks the chat entry point on the page and returns a `ChatPage` for the
   * newly opened chat window/tab. Centralizes the click selector and the
   * context.waitForEvent pairing to avoid duplicating the locator in tests.
   */
  async openChat(context: BrowserContext) {
    const [chatPage] = await Promise.all([
      context.waitForEvent('page'),
      this.page.locator('div.gradient h2.title', { hasText: 'Hablamos?' }).click(),
    ]);
    await chatPage.waitForLoadState('domcontentloaded');
    return new ChatPage(chatPage);
  }

  /**
   * High-level assertion helper verifying that the UI shows the provided
   * room and optional guest name. By default it asserts the F&B (fandb)
   * view, but callers can pass `mode: 'standard'` to check the global
   * post-login UI selectors instead.
   *
   * Backwards compatible: previous calls with (room, name, timeout)
   * continue to work because `mode` is the optional fourth parameter.
   */
  async assertLoggedIn(
    room: string,
    name?: string,
    timeout = 15000,
    mode: 'fandb' | 'standard' = 'fandb'
  ) {
    if (mode === 'fandb') {
      await this.waitForRoom(room, timeout);
      await expect(this.hotelName).toBeVisible({ timeout });
      if (name) {
        await expect(this.fandbForm).toContainText(name, { timeout });
      }
      await expect(this.fandbForm).toContainText(room, { timeout });
      return;
    }

    // Standard view: use global locators instead of the F&B scoped form.
    const roomLocator = this.page.locator('h4.client-room', { hasText: room }).first();
    const nameLocator = this.page.locator('h4.client-name', { hasText: name || '' }).first();
    await expect(roomLocator).toBeVisible({ timeout });
    await expect(this.hotelName).toBeVisible({ timeout });
    if (name) {
      await expect(nameLocator).toBeVisible({ timeout });
    }
  }

  // --- Notification helpers (notyf) ---
  /**
   * Wait for the global notyf announcer to become visible and return its locator.
   */
  async waitForNotification(timeout = 5000) {
    await expect(this.notyfAnnouncer).toBeVisible({ timeout });
    return this.notyfAnnouncer;
  }

  /**
   * Assert that the notyf announcer contains the provided text or regex.
   */
  async assertNotificationContains(expected: string | RegExp, timeout = 5000) {
    await this.waitForNotification(timeout);
    await expect(this.notyfAnnouncer).toContainText(expected, { timeout });
  }

  /**
   * Assert the notyf announcer is visible.
   */
  async assertNotificationVisible(timeout = 5000) {
    await expect(this.notyfAnnouncer).toBeVisible({ timeout });
  }

  /**
   * Assert that the notyf announcer contains all provided strings/regexes.
   * Waits once for visibility, then checks each expected value.
   */
  async assertNotificationContainsAll(expected: Array<string | RegExp>, timeout = 5000) {
    await this.waitForNotification(timeout);
    for (const e of expected) {
      await expect(this.notyfAnnouncer).toContainText(e, { timeout });
    }
  }
}

