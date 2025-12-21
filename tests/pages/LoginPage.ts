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
    await this.roomInput.fill(room);
    await this.nameInput.fill(name);
    await this.loginButton.click();
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
    await this.page.waitForLoadState('domcontentloaded');
    if (assertRoom && room) {
      await this.waitForRoom(room);
    }
  }

  async loginWithFandbInputs(room: string, name: string, assertRoom = false) {
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
    await this.page.waitForLoadState('domcontentloaded');
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
   * High-level assertion helper verifying that the F&B form shows the
   * provided room and optional guest name, and that the hotel name is visible.
   */
  async assertLoggedIn(room: string, name?: string, timeout = 15000) {
    await this.waitForRoom(room, timeout);
    await expect(this.hotelName).toBeVisible({ timeout });
    if (name) {
      await expect(this.fandbForm).toContainText(name, { timeout });
    }
    await expect(this.fandbForm).toContainText(room, { timeout });
  }
}

