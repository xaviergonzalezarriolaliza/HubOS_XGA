import { defineConfig, devices } from '@playwright/test';

const now = new Date();
const pad = (n: number) => n.toString().padStart(2, '0');
const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

export default defineConfig({
  reporter: [['html', { outputFolder: `playwright-report/report_${dateStr}`, open: 'never' }]],
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Edge',
      use: { channel: 'msedge' },
    },
    // Mobile devices
    {
      name: 'Pixel 5 (Android)',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Galaxy S9+ (Android)',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] },
    },
  ],
});