const fs = require('fs');
const marked = require('marked');
const puppeteer = require('puppeteer');

(async () => {
  const mdPath = 'docs/HubOS_QA_Engineer_Homework_XGA.inlined.md';
  const outPath = 'docs/HubOS_QA_Engineer_Homework_XGA.pdf';
  const altPath = 'docs/HubOS_QA_Engineer_Homework_XGA.updated.pdf';

  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(2);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>HubOS QA Engineer Homework</title>
<style>
  body{font-family: Arial, Helvetica, sans-serif; max-width:850px; margin:0 auto; padding:28px; color:#222}
  img{max-width:100%;height:auto}
  pre, code{background:#f6f8fa;padding:6px;border-radius:4px}
  table{border-collapse:collapse}
  table, th, td{border:1px solid #ddd;padding:6px}
</style>
</head>
<body>
  ${(typeof marked === 'function' ? marked(md) : (marked.parse ? marked.parse(md) : ''))}
</body>
</html>`;

  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 0 });
    try {
      await page.pdf({ path: outPath, format: 'A4', printBackground: true });
      console.log('PDF_CREATED', outPath);
    } catch (e) {
      console.warn('Failed to write', outPath, e.message);
      await page.pdf({ path: altPath, format: 'A4', printBackground: true });
      console.log('PDF_CREATED', altPath);
    }
  } finally {
    await browser.close();
  }
})();
