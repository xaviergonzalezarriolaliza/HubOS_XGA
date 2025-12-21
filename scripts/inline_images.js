const fs = require('fs');
const path = require('path');

const mdSrc = process.argv[2] || 'HubOS_QA_Engineer_Homework_XGA.md';
const outMd = process.argv[3] || 'docs/HubOS_QA_Engineer_Homework_XGA.inlined.md';

const workspaceRoot = path.resolve(__dirname, '..');

if (!fs.existsSync(mdSrc)) {
  console.error('Source markdown not found:', mdSrc);
  process.exit(2);
}

let md = fs.readFileSync(mdSrc, 'utf8');

const imgRegex = /!\[([^\]]*)\]\((playwright-report\/data\/[^)]+)\)/g;
let match;
const replaced = [];

while ((match = imgRegex.exec(md)) !== null) {
  const alt = match[1];
  const relPath = match[2];
  let imgPath = path.resolve(workspaceRoot, relPath);
  if (!fs.existsSync(imgPath)) {
    // Try to locate the file by basename under any report folder
    const basename = path.basename(relPath);
    function findFile(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isFile() && e.name === basename) return p;
        if (e.isDirectory()) {
          const found = findFile(p);
          if (found) return found;
        }
      }
      return null;
    }
    const reportDir = path.join(workspaceRoot, 'playwright-report');
    if (fs.existsSync(reportDir)) {
      const found = findFile(reportDir);
      if (found) imgPath = found;
    }
  }
  if (!fs.existsSync(imgPath)) {
    console.warn('Image not found, skipping:', imgPath);
    continue;
  }
  const buf = fs.readFileSync(imgPath);
  const ext = path.extname(imgPath).toLowerCase().replace('.', '') || 'png';
  const b64 = buf.toString('base64');
  const dataUri = `data:image/${ext};base64,${b64}`;
  const orig = match[0];
  const replacement = `![${alt}](${dataUri})`;
  md = md.replace(orig, replacement);
  replaced.push(relPath);
}

fs.mkdirSync(path.dirname(outMd), { recursive: true });
fs.writeFileSync(outMd, md, 'utf8');
console.log('WROTE', outMd, 'inlined images:', replaced.length);
replaced.forEach(r => console.log(' -', r));
