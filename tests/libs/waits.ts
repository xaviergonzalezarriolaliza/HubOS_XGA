import type { Locator } from 'playwright';

export const DEFAULT_TIMEOUT = 10000;

/** Waits for the locator to become visible using a centralized timeout. */
export async function waitForLocatorVisible(locator: Locator, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'visible', timeout });
}

export default { waitForLocatorVisible, DEFAULT_TIMEOUT };
