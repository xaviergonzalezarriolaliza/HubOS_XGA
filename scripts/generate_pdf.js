const fs = require('fs');
const path = require('path');
const marked = require('marked');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const mdPath = path.join(repoRoot, 'HubOS_QA_Engineer_Homework_XGA.md');
    const outDir = path.join(repoRoot, 'docs');
    const outPath = path.join(outDir, 'HubOS_QA_Engineer_Homework_XGA.pdf');

    if (!fs.existsSync(mdPath)) throw new Error('Markdown file not found: ' + mdPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const md = fs.readFileSync(mdPath, 'utf8');
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:28px; color:#111}
  h1,h2,h3{color:#222}
  pre{background:#f6f8fa;padding:12px;overflow:auto}
  img{max-width:100%;height:auto}
  table{border-collapse:collapse}
  table, th, td{border:1px solid #ddd;padding:6px}
</style>
</head>
<body>
${marked.parse(md)}
</body>
</html>`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();

    console.log('PDF_CREATED', outPath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
