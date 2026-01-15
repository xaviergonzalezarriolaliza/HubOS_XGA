import { test, expect } from '@playwright/test';

test('navigate redirect and check status codes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  const title = await page.title();
  test.info().console.log(`title: ${title}`);

  await page.click('text=Redirect Link');
  await page.waitForSelector('#redirect', { state: 'visible' });
  let redirectorHeading: string | null = null;
  try {
    redirectorHeading = (await page.textContent('h3')) || null;
  } catch (e) {
    redirectorHeading = null;
  }
  test.info().console.log(`redirector_heading: ${redirectorHeading}`);

  await page.click('#redirect');
  await page.waitForSelector('div#content ul li a');
  const codes = await page.$$eval('div#content ul li a', els => els.map(e => (e.textContent || '').trim()));
  test.info().console.log(`codes: ${codes.join(',')}`);

  await page.click('text=500');
  await page.waitForSelector('div#content p');
  const contentText = (await page.textContent('#content')) || '';
  test.info().console.log(`content length: ${contentText.length}`);

  expect(contentText).toContain('Status Codes');
});
