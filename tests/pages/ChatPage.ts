import type { Page, Locator } from 'playwright';

export class ChatPage {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    // Chat header selector observed in tests
    this.header = page.locator('h3._9vd5._9scb._9scr').first();
  }

  async waitForChatLoaded(timeout = 15000) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.header.waitFor({ state: 'visible', timeout });
  }

  async assertAgentName(expected: string, timeout = 15000) {
    await this.waitForChatLoaded(timeout);
    const txt = await this.header.textContent();
    if (!txt || !txt.includes(expected)) throw new Error(`expected agent name ${expected}`);
  }
}
