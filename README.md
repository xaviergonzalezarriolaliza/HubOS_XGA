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

## Test Reports

HTML reports are saved automatically in the `playwright-report` folder with a date-hour subfolder for each run.

## Project Structure
- `tests/` — Contains all test cases
- `playwright.config.ts` — Playwright configuration

---
**Note:** Use `--headed` to observe browser actions during test execution.
