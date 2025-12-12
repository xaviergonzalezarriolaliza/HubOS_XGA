import { Page, Locator } from '@playwright/test';

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
    await this.fandbInputs.nth(0).fill(room);
    await this.fandbInputs.nth(1).fill(name);
    await this.page.locator('.btn-login').click();
  }
}
