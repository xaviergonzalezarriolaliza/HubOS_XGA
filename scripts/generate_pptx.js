const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const WORKSPACE = process.cwd();
const TEST_FILE = path.join(WORKSPACE, 'tests', 'login.spec.ts');
const IMG_DIRS = [
  path.join(WORKSPACE, 'playwright-report', 'data'),
  path.join(WORKSPACE, 'tmp_artifact', 'data'),
  path.join(WORKSPACE, 'playwright-report')
];
const OUT_PPTX = path.join(WORKSPACE, 'docs', 'test-cases-presentation.pptx');

function findImages() {
  for (const d of IMG_DIRS) {
    try {
      const files = fs.readdirSync(d).filter(f => f.toLowerCase().endsWith('.png'))
        .map(f => path.join(d, f))
        .sort();
      if (files.length) return files;
    } catch (e) {
      // ignore
    }
  }
  return [];
}

function parseTests(source) {
  const tests = [];
  const re = /test\s*\(\s*(["'`])([\s\S]*?)\1\s*,\s*async\s*\([^)]*\)\s*=>\s*\{/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const title = m[2];
    const startIdx = m.index + m[0].length - 1; // position of '{'
    // find matching closing brace
    let depth = 1;
    let i = startIdx;
    while (i < source.length && depth > 0) {
      i++;
      const ch = source[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    const block = source.slice(startIdx + 1, i);
    const code = block.trim();
    const expects = Array.from(block.matchAll(/expect\s*\(([^)]+)\)\.?([a-zA-Z0-9_]+)?\s*\(/g)).map(x => x[0])
      .concat(Array.from(block.matchAll(/expect\s*\([^)]*\)\.[a-zA-Z0-9_]+/g)).map(x => x[0]));
    // also capture simple expect lines
    const expectLines = (block.match(/(^|\n)\s*await\s+expect\([\s\S]*?;?/g) || []).map(s => s.trim());
    // locator usages
    const locators = [];
    const locatorPatterns = ['fillRoom', 'fillName', 'submitLogin', 'loginWithFandbInputs', 'loginWithRoomAndName', 'assertLoggedIn', 'openChat', 'loginButton', 'fandbInputs', 'fandbForm', 'notyfAnnouncer', 'hotelName', 'page.locator'];
    for (const p of locatorPatterns) {
      if (block.includes(p)) locators.push(p);
    }
    tests.push({ title, expects: expectLines, locators, code });
  }
  return tests;
}

function makePresentation(tests, images) {
  const pptx = new PptxGenJS();
  pptx.author = 'HubOS QA Assistant';
  pptx.company = 'HubOS';
  pptx.title = 'Test Cases Summary';

  const SLIDE_WIDTH = 10; // inches (pptxgenjs default)
  const GAP = 0.2;
  // Use intrinsic image sizes (100%) for screenshots. Reserve a column
  // width for layout calculations so the code column has a stable size.
  // Reserve a column for layout, then force screenshots to be 200% of that
  const RESERVED_IMG_W = SLIDE_WIDTH * 0.25 * 0.8; // reserve 25% * 80% as layout column
  const IMG_W = RESERVED_IMG_W * 2.0; // display screenshots at 200% of reserved width
  // Code column takes remaining horizontal space (leave small margin)
  const CODE_COL_W = SLIDE_WIDTH - RESERVED_IMG_W - GAP - 0.9;
  // compute heights later based on available vertical space
  const SLIDE_HEIGHT = 7.5;

  function findLogo() {
    const candidates = [
      path.join(WORKSPACE, 'docs', 'hubos-logo.png'),
      path.join(WORKSPACE, 'docs', 'hub-os-logo.png'),
      path.join(WORKSPACE, 'assets', 'hubos-logo.png'),
      path.join(WORKSPACE, 'assets', 'logo.png'),
      path.join(WORKSPACE, 'logo.png')
    ];
    for (const c of candidates) if (fs.existsSync(c)) return c;
    // fallback: try to find any small png in img dirs that might be a logo
    for (const d of IMG_DIRS) {
      try {
        const files = fs.readdirSync(d).filter(f => /logo|hub|brand/i.test(f));
        if (files && files.length) return path.join(d, files[0]);
      } catch (e) {}
    }
    return null;
  }
  const LOGO_PATH = findLogo();

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const slide = pptx.addSlide();
    // Place the main header near the top and render the short date to the right on the same line
    const marginTop = 0.2;
    const headerX = 0; // occupy left/code column
    const headerW = CODE_COL_W;
    // place title near the top area (left-aligned)
    const titleY = marginTop + 0.05;
    slide.addText('HubOS QA Engineer Homework XGA', { x: headerX, y: titleY, w: headerW * 0.68, h: 0.4, align: 'left', fontSize: 14, bold: true });
    const now = new Date();
    const shortDate = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    // place short date on the same horizontal line as the main header, slightly to the right
    const dateX = headerX + headerW * 0.68 + 0.12;
    const dateW = headerW - headerW * 0.68 - 0.12;
    slide.addText(shortDate, { x: dateX, y: titleY + 0.06, w: dateW, h: 0.3, align: 'right', fontSize: 10 });
    // Place test title directly below the main header line
    const testTitleY = titleY + 0.5;
    slide.addText(t.title, { x: headerX, y: testTitleY, w: headerW, h: 0.45, fontSize: 14, bold: true });
    // Start content (code and first screenshot) just below the test title
    const contentTop = testTitleY + 0.45 + 0.05; // small gap after test title
    const codeY = contentTop;
    const codeH = 1.2; // allocate smaller fixed height for code block
    const footerReserve = 1.0;
    const availableH = SLIDE_HEIGHT - contentTop - footerReserve;
    const imgGap = 0.15;
    // place screenshots starting at the same vertical position as the code (parallel)
    const imgYStart = contentTop;
    const availableHForImgs = SLIDE_HEIGHT - imgYStart - footerReserve;
    const imgH = Math.max(0.8, Math.min((availableHForImgs - imgGap) / 2, 3.0));
    const imgX = CODE_COL_W + GAP; // right column X position
    const img1 = images[i * 2] || images[images.length - 1] || null;
    const img2 = images[i * 2 + 1] || images[images.length - 1] || null;
    // Primary screenshot stays in the right column aligned with the start of the code
    // Preserve original aspect ratio by specifying only width for screenshots
    if (img1) {
      if (IMG_W) slide.addImage({ path: img1, x: imgX, y: imgYStart, w: IMG_W });
      else slide.addImage({ path: img1, x: imgX, y: imgYStart });
    }
    // NOTE: second screenshot placement moved below after code rendering so we can
    // estimate the actual code height before positioning it.

    // Left column: full test code (monospace)
    const codeX = 0.45;
    const codeW = CODE_COL_W - 0.5; // small inner margin
    const rawCode = t.code || '';
    const maxLines = 12; // shorten code blocks to first 12 lines
    const codeLines = rawCode.split(/\r?\n/);
    let renderedCode = rawCode;
    if (codeLines.length > maxLines) {
      renderedCode = codeLines.slice(0, maxLines).join('\n') + '\n... (truncated)';
    }
    // Use smaller font for code and enable wrapping to avoid overflow
    slide.addText(renderedCode, { x: codeX, y: codeY, w: codeW, h: codeH, fontSize: 7, fontFace: 'Courier New', color: '333333', wrap: true });
    // Now that code has been rendered (estimated), place second screenshot under the code in the left column
    if (img2) {
      const renderedLinesCount = Math.min(codeLines.length, maxLines);
      const lineH = codeH / maxLines; // approximate single-line height (in inches)
      const renderedCodeH = Math.max(codeH, renderedLinesCount * lineH);
      const img2X = codeX; // left column
      const img2Y = codeY + renderedCodeH + imgGap;
      const availableHForImg2 = SLIDE_HEIGHT - img2Y - footerReserve;
      // Use intrinsic image size when IMG_W is null; otherwise force width
      if (IMG_W) slide.addImage({ path: img2, x: img2X, y: img2Y, w: IMG_W });
      else slide.addImage({ path: img2, x: img2X, y: img2Y });
    }
    // (test title already placed above; no further title here)
    // Footer: logo at bottom-center (if available) or text fallback
    const footerY = SLIDE_HEIGHT - 0.6;
    if (LOGO_PATH) {
      // small logo centered
      const logoW = 1.5;
      const logoH = 0.5;
      slide.addImage({ path: LOGO_PATH, x: (SLIDE_WIDTH - logoW) / 2, y: footerY, w: logoW, h: logoH });
    } else {
      slide.addText('HubOS', { x: 0, y: footerY, w: SLIDE_WIDTH, h: 0.4, align: 'center', fontSize: 10 });
    }
    // Page number bottom-right
    slide.addText(`Page ${i + 1}`, { x: SLIDE_WIDTH - 1.2, y: SLIDE_HEIGHT - 0.5, w: 1.0, h: 0.3, align: 'right', fontSize: 9 });
  }

  return new Promise((resolve, reject) => {
    try {
      // ensure docs dir
      const docsDir = path.dirname(OUT_PPTX);
      if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
      pptx.writeFile({ fileName: OUT_PPTX }).then(() => resolve(OUT_PPTX)).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

async function main() {
  if (!fs.existsSync(TEST_FILE)) {
    console.error('Test file not found:', TEST_FILE);
    process.exit(1);
  }
  const src = fs.readFileSync(TEST_FILE, 'utf8');
  const tests = parseTests(src);
  if (!tests.length) {
    console.error('No tests parsed from', TEST_FILE);
    process.exit(1);
  }
  const images = findImages();
  console.log('Found tests:', tests.length, 'Found images:', images.length);
  const out = await makePresentation(tests, images);
  console.log('PPTX_CREATED', out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
