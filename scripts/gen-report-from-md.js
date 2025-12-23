const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const marked = require('marked');

async function main() {
  const mdPath = path.resolve(__dirname, '..', 'docs', 'HubOS_QA_Engineer_Homework_XGA.inlined.md');
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(2);
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const htmlBody = marked.parse(md);

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>HubOS QA — Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 40px; color: #111 }
        h1,h2,h3 { color: #0b5cff }
        pre { background: #f6f8fa; padding: 12px; overflow: auto }
        code { background: #f6f8fa; padding: 2px 4px }
        a { color: #0b5cff }
        table { border-collapse: collapse; width: 100% }
        table, th, td { border: 1px solid #ddd }
        th, td { padding: 6px 8px }
        /* Scale screenshots and images to 15% for compact PDF */
        img { max-width: 15% !important; height: auto !important; display: inline-block }
        /* Allow larger images that are explicitly flagged with .fullsize */
        img.fullsize { max-width: 100% !important }
      </style>
    </head>
    <body>
      ${htmlBody}
    </body>
  </html>`;

  const out = path.resolve(__dirname, '..', 'docs', 'HubOS_QA_Engineer_Homework_XGA.pdf');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({ path: out, format: 'A4' });
  await browser.close();
  console.log('PDF written to', out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
