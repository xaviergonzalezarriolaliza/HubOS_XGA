import { Page, Locator, expect } from '@playwright/test';

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

  async loginWithFandbInputs(room: string, name: string) {
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
  }
}

