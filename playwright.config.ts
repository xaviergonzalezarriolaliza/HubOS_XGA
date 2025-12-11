import { defineConfig } from '@playwright/test';

const now = new Date();
const pad = (n: number) => n.toString().padStart(2, '0');
const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

export default defineConfig({
  reporter: [['html', { outputFolder: `playwright-report/report_${dateStr}`, open: 'never' }]],
});