import type { Page, Locator, BrowserContext } from 'playwright';
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
    // notyf may render notifications using several container/class names
    // depending on version or app markup. Match common variants and take
    // the first visible toast/container.
    this.notyfAnnouncer = page.locator('.notyf__toast, .notyf-announcer, .notyf');
    
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async loginWithRoomAndName(room: string, name: string) {
    // Delegate to the unified `login` helper for the standard flow so
    // all login entry points funnel through a single method.
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
    await this.fandbInputs.first().waitFor({ state: 'visible' });
    await this.fandbInputs.last().waitFor({ state: 'visible' });
    if (await this.fandbInputs.count() !== 2) throw new Error('expected 2 F&B inputs');
    await this.fandbInputs.first().fill(room);                                         // nth(0)
    if ((await this.fandbInputs.first().getAttribute('id')) !== 'guest_room') throw new Error('expected first F&B input to have id guest_room');
    if ((await this.fandbInputs.first().inputValue()) !== room) throw new Error('expected room value to match');
    if ((await this.page.locator('#guest_room').inputValue()) !== room) throw new Error('expected #guest_room value to match');
    await this.fandbInputs.last().fill(name);                                          // nth(1)
    if ((await this.fandbInputs.last().getAttribute('id')) !== 'guest_name') throw new Error('expected last F&B input to have id guest_name');
    if ((await this.fandbInputs.last().inputValue()) !== name) throw new Error('expected guest_name value to match');
    if ((await this.page.locator('#guest_name').inputValue()) !== name) throw new Error('expected #guest_name value to match');
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
    await roomHeading.waitFor({ state: 'visible', timeout });
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
      await this.hotelName.waitFor({ state: 'visible', timeout });
      if (name) {
        const text = await this.fandbForm.textContent();
        if (!text || !text.includes(name)) throw new Error(`expected F&B form to contain ${name}`);
      }
      {
        const text = await this.fandbForm.textContent();
        if (!text || !text.includes(room)) throw new Error(`expected F&B form to contain ${room}`);
      }
      return;
    }

    // Standard view: use global locators instead of the F&B scoped form.
    const roomLocator = this.page.locator('h4.client-room', { hasText: room }).first();
    const nameLocator = this.page.locator('h4.client-name', { hasText: name || '' }).first();
    await roomLocator.waitFor({ state: 'visible', timeout });
    await this.hotelName.waitFor({ state: 'visible', timeout });
    if (name) {
      await nameLocator.waitFor({ state: 'visible', timeout });
    }
  }

  // --- Notification helpers (notyf) ---
  /**
   * Wait for the global notyf announcer to become visible and return its locator.
   */
  async waitForNotification(timeout = 5000) {
    // Wait for any common notyf selector to become visible in the DOM.
    await this.page.waitForSelector('.notyf__toast, .notyf-announcer, .notyf, .notyf__toast-message', { state: 'visible', timeout });
    // Return a locator that resolves to the first visible toast/message container.
    const visible = this.page.locator('.notyf__toast:visible, .notyf-announcer:visible, .notyf:visible, .notyf__toast-message:visible');
    return visible.first();
  }

  /**
   * Assert that the notyf announcer contains the provided text or regex.
   */
  async assertNotificationContains(expected: string | RegExp, timeout = 5000) {
    // If we have a concrete expected value, wait for a toast that contains it.
    const sel = '.notyf__toast, .notyf-announcer, .notyf, .notyf__toast-message';
    try {
      const byText = this.page.locator(sel, { hasText: expected });
      await byText.first().waitFor({ state: 'visible', timeout });
      const txt = await byText.first().innerText();
      if (!txt) throw new Error('notification empty');
      if (typeof expected === 'string') {
        if (!txt.includes(expected)) throw new Error(`expected notification to contain ${expected}`);
      } else {
        if (!expected.test(txt)) throw new Error(`expected notification to match ${expected}`);
      }
      return;
    } catch (err) {
      // Fallback: wait for any visible toast and read its text for diagnostic failure message.
      const locator = await this.waitForNotification(timeout);
      const txt = await locator.innerText().catch(() => null);
      if (!txt) throw new Error('notification empty (fallback)');
      if (typeof expected === 'string') {
        if (!txt.includes(expected)) throw new Error(`expected notification to contain ${expected}; actual: ${txt}`);
      } else {
        if (!expected.test(txt)) throw new Error(`expected notification to match ${expected}; actual: ${txt}`);
      }
    }
  }

  /**
   * Assert the notyf announcer is visible.
   */
  async assertNotificationVisible(timeout = 5000) {
    await this.page.waitForSelector('.notyf__toast, .notyf-announcer, .notyf', { state: 'visible', timeout });
  }

  /**
   * Assert that the notyf announcer contains all provided strings/regexes.
   * Waits once for visibility, then checks each expected value.
   */
  async assertNotificationContainsAll(expected: Array<string | RegExp>, timeout = 5000) {
    const locator = await this.waitForNotification(timeout);
    const txt = await locator.innerText().catch(() => null);
    if (!txt) throw new Error('notification empty');
    for (const e of expected) {
      if (typeof e === 'string') {
        if (!txt.includes(e)) throw new Error(`expected notification to contain ${e}`);
      } else {
        if (!e.test(txt)) throw new Error(`expected notification to match ${e}`);
      }
    }
  }
}

