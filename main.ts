import { chromium, Browser, Page } from 'playwright';

export type RunResult = {
  title: string | null;
  redirector_heading: string | null;
  codes: string[];
  text: string | null;
};

export async function run(timeout = 10000, headless = false): Promise<RunResult> {
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless });
    const context = await browser.newContext();
    const page: Page = await context.newPage();
    page.setDefaultTimeout(timeout);

    await page.goto('https://the-internet.herokuapp.com/');
    const title = await page.title();

    // 2. Click 'Redirect Link'
    await page.click('text=Redirect Link');

    // 3. Wait for the redirect target with id='redirect' and click it
    await page.waitForSelector('#redirect', { state: 'visible' });
    let redirector_heading: string | null = null;
    try {
      // best-effort read a heading if present
      redirector_heading = (await page.textContent('h3')) || null;
    } catch (e) {
      redirector_heading = null;
    }
    await page.click('#redirect');

    // 5. Get list of status codes
    await page.waitForSelector('div#content ul li a');
    const codes = await page.$$eval('div#content ul li a', els => els.map(e => (e.textContent || '').trim()));

    // 6. Click code 500 and read paragraph text
    await page.click('text=500');
    await page.waitForSelector('div#content p');
    const textParagraph = (await page.textContent('div#content p')) || null;

    // Full content text
    const contentText = (await page.textContent('#content')) || '';

    if (!contentText.includes('Status Codes')) {
      throw new Error(`expected 'Status Codes' in content text, got: ${JSON.stringify(contentText)}`);
    }

    return {
      title,
      redirector_heading,
      codes,
      text: contentText,
    };
  } finally {
    if (browser) await browser.close();
  }
}

// If executed directly, run and print results similar to the Python script
if (require.main === module) {
  run()
    .then(results => {
      console.log('title:', results.title);
      console.log('redirector_heading:', results.redirector_heading);
      console.log('codes:', results.codes);
      console.log('text:', results.text);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
