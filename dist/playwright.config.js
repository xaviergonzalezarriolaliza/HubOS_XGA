"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
// Detect headed mode by checking CLI args passed to the Playwright runner.
// Playwright forwards CLI flags so `--headed` will appear in process.argv.
const isHeaded = process.argv.includes('--headed');
exports.default = (0, test_1.defineConfig)({
    reporter: [['html', { outputFolder: `playwright-report/report_${dateStr}`, open: 'never' }]],
    // Ensure Playwright writes traces/screenshots into a CI-uploadable folder
    outputDir: `test-results/report_${dateStr}`,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    use: {
        // Capture full traces and screenshots for every run so CI uploads
        // contain useful artifacts for debugging and reporting.
        trace: 'on',
        screenshot: 'on',
        navigationTimeout: isHeaded ? 60000 : 30000,
        launchOptions: isHeaded ? { slowMo: 50 } : {},
    },
    projects: [
        {
            name: 'Chromium',
            use: { ...test_1.devices['Desktop Chrome'] },
        },
        {
            name: 'Firefox',
            use: { ...test_1.devices['Desktop Firefox'] },
        },
        {
            name: 'WebKit',
            use: { ...test_1.devices['Desktop Safari'] },
        },
        {
            name: 'Edge',
            use: { channel: 'msedge' },
        },
        // Mobile devices
        {
            name: 'Pixel 5 (Android)',
            use: { ...test_1.devices['Pixel 5'] },
        },
        {
            name: 'Galaxy S9+ (Android)',
            use: { ...test_1.devices['Galaxy S9+'] },
        },
        {
            name: 'iPhone 12',
            use: { ...test_1.devices['iPhone 12'] },
        },
        {
            name: 'iPhone SE',
            use: { ...test_1.devices['iPhone SE'] },
        },
    ],
});
