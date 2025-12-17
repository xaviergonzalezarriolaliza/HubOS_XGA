import { test, expect } from '@playwright/test';

test('sanity: create page and check title', async ({ page }) => {
  await page.setContent(`
    <html>
      <head><title>CI Test</title></head>
      <body>Playwright CI sanity check</body>
    </html>
  `);
  await expect(page).toHaveTitle('CI Test');
});
