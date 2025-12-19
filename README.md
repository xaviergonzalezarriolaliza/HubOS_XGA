# HubOS_XGA Playwright Test Suite

## Credentials & Environment Variables

Sensitive credentials (such as login details) should **never** be committed to git. Store them in a `.env` file in the project root. This file is already included in `.gitignore` and will not be tracked by git.

## Overview

This repository contains end-to-end Playwright tests for the HubOS Guest in Touch login functionality. The tests are designed to ensure robust coverage of all login scenarios, including A/B UI variants, edge cases, and error handling.

## Test Results and Reports

- **HTML Test Reports:**
	- After running tests with `npx playwright test`, an HTML report is generated in the `playwright-report/` directory.
	- To view the latest report, run:
		```
		npx playwright show-report
		```
		This will open the report in your browser, where you can review all test results and details.

All test results and reports are located in the `playwright-report/` directory.

## What and Why We Are Testing
- **Login with correct room number and surname**: Verifies successful login for valid credentials.
- **Login with room number without leading zero**: Ensures the system handles room numbers with or without leading zeros.
- **Login with incorrect room number or surname**: Confirms that invalid credentials are rejected and appropriate error messages are shown.
- **Login with empty fields**: Checks that required fields are enforced.
- **Special characters, long input, and whitespace**: Validates input sanitization and error handling for edge cases.
- **A/B Coverage**: Each scenario is tested using both the standard and F&B (Food & Beverage) login forms to ensure UI consistency and functional parity.



	npx playwright show-report playwright-report\report_2025-12-14_16-53-08
	```

## Last Test Run Summary


### December 15, 2025
- **Date**: December 15, 2025
- **Branch**: main
- **Command**: `npx playwright test`
- **Result**: **304/304 tests passed** on all browsers/devices (0 failed, 0 skipped)
- **Report**: [playwright-report/report_2025-12-15_13-13-29/index.html](playwright-report/report_2025-12-15_13-13-29/index.html)

### December 14, 2025
 - **Date**: December 14, 2025
 - **Branch**: main
 - **Command**: `npx playwright test`
 - **Result**: **304/304 tests passed** on all browsers/devices (0 failed, 0 skipped)
 - **Report**: [playwright-report/report_2025-12-14_16-53-08/index.html](playwright-report/report_2025-12-14_16-53-08/index.html)


#### Recent Reports
- [2025-12-15: 304 tests passed](playwright-report/report_2025-12-15_13-13-29/index.html)
- [2025-12-14: 304 tests passed](playwright-report/report_2025-12-14_16-53-08/index.html)
- [2025-12-14: 304 tests passed](playwright-report/report_2025-12-14_16-37-08/index.html)
- [2025-12-14: 256 tests passed](playwright-report/report_2025-12-14_15-37-35/index.html)
- [2025-12-13: 224 tests passed](playwright-report/report_2025-12-13_13-31-52/index.html)
- [2025-12-12: 216 tests passed](playwright-report/report_2025-12-12_21-40-52/index.html)
 - [2025-12-19: 304 tests passed (17:05:37)](playwright-report/report_2025-12-19_17-05-37/index.html)
 - [2025-12-19: 304 tests passed (17:02:46)](playwright-report/report_2025-12-19_17-02-46/index.html)
 - [2025-12-19: 304 tests passed (15:36:34)](playwright-report/report_2025-12-19_15-36-34/index.html)

> **Test count and results:**
> - Each suite run executes all scenarios across 8 browsers/devices.
> - The number above reflects the total test cases (e.g., 304 = 38 scenarios × 8 platforms).
> - All tests must pass for a green report. Failures or skips will be shown here.

To view any report, open the corresponding HTML file in the `playwright-report/` directory or use the command above.

## Repository Location
- **GitHub**: https://github.com/xaviergonzalezarriolaliza/HubOS_XGA

## Getting Started
1. **Clone the repository:**
	```
	git clone https://github.com/xaviergonzalezarriolaliza/HubOS_XGA.git
	cd HubOS_XGA
	```
2. **Install dependencies:**
	```
	npm install
	```
3. **Run the tests:**
	```
	npx playwright test
	```
4. **View the test report:**
	```
	npx playwright show-report
	```
	The HTML report will open in your browser. You can also find historical reports in the `playwright-report/` directory.


## Security Note

**Warning:** It is currently possible to log in with either room number `440` or `0440` by entering only part of the guest's name (e.g., just `Will` or `Daf` instead of the full name `Willem Dafoe`). This is not desired behavior and is a proof of a significant security risk and potential data breach, as unauthorized users could gain access with incomplete credentials. Please review and address this vulnerability as a priority.

## Notes
- The test suite uses the Page Object Model for maintainability and clarity.
- Assertion comments are included only on the first assertion in each test for readability.
- All tests are designed to be idempotent and cover both positive and negative login scenarios.

---
For any questions or contributions, please open an issue or pull request on the repository.
# Latest Test Suite Update (2025-12-13)

## Summary of Recent Changes
- Ensured every login scenario has both (A) and (B) test variants for full selector coverage.
- Differentiated the final assertion in each A/B pair: (A) tests use `toBeVisible`, (B) tests use `toContainText` or vice versa, for more robust UI validation.
- Added missing (B) test for special characters in surname.
- All tests now consistently use the Page Object Model (POM) for maintainability.

## Latest Test Results
- **256 tests passed** on all browsers/devices (2025-12-14)
- No failures or errors detected. Added A/B chat feature tests (see below).

To view the detailed HTML report for this run, open:

playwright-report/report_2025-12-13_13-31-52/index.html

# Selector Strategy Variants (A/B Tests)

For each login scenario, there are A and B test variants:
- **A variants** use id-based selectors (e.g., `#guest_room`, `#guest_name`, `#btn_login`).
- **B variants** use class-based selectors (e.g., `.fandb-form-control-login`, `.btn-login`).

This dual approach ensures that both selector strategies are robust and reliable across all supported browsers and devices. It helps catch UI or selector regressions early, and future-proofs the test suite in case the application changes its form layout or selector strategy. Keeping both variants is intentional for maximum coverage and confidence.

# Page Object Model (POM) Refactor (2025-12-12)

The test suite has been refactored to use the Page Object Model (POM) design pattern. All login actions and selectors are now encapsulated in a `LoginPage` class (`tests/pages/LoginPage.ts`), and test cases use this page object for interactions. This improves maintainability, readability, and scalability of the test code.

All Playwright login tests passed successfully after this refactor, confirming the new structure is robust and reliable.

**Latest POM-based test run:**

216 tests passed on all browsers/devices (2025-12-12, 21:40 UTC)

To view the detailed HTML report for this run, open:

playwright-report/report_2025-12-12_21-40-52/index.html

### Test Results Table (Compact)

| Test Name                                                        | Chromium | Firefox | WebKit | Edge | Pixel 5 | Galaxy S9+ | iPhone 12 | iPhone SE |
|------------------------------------------------------------------|----------|---------|--------|------|---------|------------|-----------|-----------|
| should login with correct room and surname (A)                   | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should login with correct room and surname (B)                   | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should login with room number without leading zero (A)           | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should login with room number without leading zero (B)           | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with incorrect room number (A)                  | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with incorrect room number (B)                  | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with incorrect surname (A)                      | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with incorrect surname (B)                      | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for empty fields (A)                           | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for empty fields (B)                           | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for special characters in room (A)             | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for special characters in room (B)             | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for special characters in surname (A)          | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for special characters in surname (B)          | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for very long room number (A)                  | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for very long room number (B)                  | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for very long surname (A)                      | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for very long surname (B)                      | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for whitespace in room and surname (A)         | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error for whitespace in room and surname (B)         | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should login and open chat (A)                                    | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should login and open chat (B)                                    | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error when only room is filled (A)                   | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error when only room is filled (B)                   | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error when only surname is filled (A)                | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should show error when only surname is filled (B)                | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with extra trailing zero in room number (A)     | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with extra trailing zero in room number (B)     | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with double leading zero in room number (A)     | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |
| should not login with double leading zero in room number (B)     | PASS     | PASS    | PASS   | PASS | PASS    | PASS       | PASS      | PASS      |

### Test Results Table (Detailed)

| Test # | Test Name                                                        | Browser/Device        | Status |
|--------|------------------------------------------------------------------|-----------------------|--------|
| 1      | should login with correct room and surname (A)                   | Chromium              | PASS   |
| 2      | should login with correct room and surname (B)                   | Chromium              | PASS   |
| 3      | should login with room number without leading zero (A)           | Chromium              | PASS   |
| 4      | should login with room number without leading zero (B)           | Chromium              | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 29     | should login with correct room and surname (A)                   | Firefox               | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 57     | should login with correct room and surname (A)                   | WebKit                | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 85     | should login with correct room and surname (A)                   | Edge                  | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 113    | should login with correct room and surname (A)                   | Pixel 5 (Android)     | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 141    | should login with correct room and surname (A)                   | Galaxy S9+ (Android)  | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 169    | should login with correct room and surname (A)                   | iPhone 12             | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 197    | should login with correct room and surname (A)                   | iPhone SE             | PASS   |
| ...    | ...                                                              | ...                   | ...    |
| 224    | should not login with double leading zero in room number (B)     | iPhone SE             | PASS   |

Each test is run on all 8 browsers/devices, so the test numbers increment by 28 for each browser/device.
The full list of test names is in your test file, and each is repeated for every browser/device.


## Test Design & Locator Strategy Compliance (2025-12-12)

- Correct login tests (A and B) use different locator strategies (A: id selectors, B: class selectors).
- Language-independent, robust selectors are used (no getByPlaceholder or language-dependent locators).
- After login, the tests assert the presence of the room number, guest name, and hotel name using specific, reliable selectors.
- The test file is clean, with no obsolete or duplicate locator code.
- All Playwright tests pass successfully.

See the [latest successful test run report](playwright-report/report_2025-12-12_18-32-25/index.html) for details.


### Regex Notification Assertion Update (2025-12-12)

To ensure robust, language-agnostic detection of reservation error notifications (including Spanish, English, and other European languages), the test assertions for notification messages now use the regex:

	/no.*res.*:/i

This pattern matches any notification containing "no" followed by any characters, then "res" (as in "reserva", "reservation", etc.), and then a colon, regardless of language or extra words. This makes the tests resilient to minor language or phrasing changes in the UI notification.

### Edge Case Note (2025-12-12)

Tests now also cover:
- One or more extra trailing zeros in the room number (e.g., '04400', '044000', etc.)
- Double leading zero in the room number (e.g., '00440')

The application correctly rejects these with a user-facing notification, and this is asserted in both A and B test variations. All tests, including these edge cases, passed successfully on 2025-12-12.



## Test Run Record

All Playwright tests passed successfully on 2025-12-12 after updating the notification assertion regex for language independence.

### Test Results Table

| Test #   | Browser/Device        | Status |
|----------|-----------------------|--------|
| 1-28     | Chromium              | PASS   |
| 29-56    | Firefox               | PASS   |
| 57-84    | WebKit                | PASS   |
| 85-112   | Edge                  | PASS   |
| 113-140  | Pixel 5 (Android)     | PASS   |
| 141-168  | Galaxy S9+ (Android)  | PASS   |
| 169-196  | iPhone 12             | PASS   |
| 197-224  | iPhone SE             | PASS   |

To view the detailed HTML report for this run, open:

playwright-report/report_2025-12-12_19-46-54/index.html

## Playwright Locator Note

**Important:** The `getByRole` locator can be unreliable on Apple devices (Safari/WebKit) if elements lack proper accessible roles or labels. For maximum cross-platform stability, prefer using `id`, `name`, or `class` selectors in your Playwright tests.

# Guest In Touch QA Tests

## Supported Browsers & Devices

Tests are automatically run on the following browsers and devices:

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Edge (Microsoft Edge)
- Pixel 5 (Android emulation)
- Galaxy S9+ (Android emulation)
- iPhone 12 (Apple iPhone emulation)
- iPhone SE (Apple iPhone emulation)

## Running Tests

To run all Playwright tests:

```
npx playwright test
```

To run tests in headed mode (browser UI visible):

```
npx playwright test --headed
```

To run tests with a concise console list reporter (compact output suitable for CI and terminals):

```
npx playwright test --reporter=list
```

## Test Reports

HTML reports are saved automatically in the `playwright-report` folder with a date-hour subfolder for each run.


# Continuous Integration (CI) with GitHub Actions

This repository uses [GitHub Actions](https://github.com/features/actions) to automatically run all Playwright tests on every push to any branch. The workflow is defined in [.github/workflows/playwright.yml](.github/workflows/playwright.yml).

**What the workflow does:**
- Checks out the repository code
- Sets up Node.js 20.x
- Installs dependencies and Playwright browsers
- Runs all Playwright tests
- Uploads the Playwright HTML report as a workflow artifact

You can view the status of recent test runs in the **Actions** tab of the GitHub repository.

## Project Structure
- `tests/` — Contains all test cases
- `playwright.config.ts` — Playwright configuration

---
**Note:** Use `--headed` to observe browser actions during test execution.
