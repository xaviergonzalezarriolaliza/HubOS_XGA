const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function findLatestReportDir(reportRoot) {
  const entries = fs.readdirSync(reportRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('report_'))
    .map(d => d.name)
    .sort();
  return entries.length ? path.join(reportRoot, entries[entries.length - 1]) : null;
}

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const reportRoot = path.join(repoRoot, 'playwright-report');

    let inputHtml = process.argv[2];
    let outputPdf = process.argv[3];

    if (!inputHtml) {
      const latest = findLatestReportDir(reportRoot);
      if (!latest) throw new Error('No report_* directories found in ' + reportRoot);
      inputHtml = path.join(latest, 'index.html');
      outputPdf = path.join(latest, 'report.pdf');
    } else {
      inputHtml = path.resolve(repoRoot, inputHtml);
      if (!outputPdf) {
        const dir = path.dirname(inputHtml);
        outputPdf = path.join(dir, 'report.pdf');
      } else {
        outputPdf = path.resolve(repoRoot, outputPdf);
      }
    }

    if (!fs.existsSync(inputHtml)) throw new Error('HTML report not found: ' + inputHtml);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('file://' + inputHtml, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPdf, format: 'A4', printBackground: true, margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' } });
    await browser.close();

    console.log('PDF_CREATED', outputPdf);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
