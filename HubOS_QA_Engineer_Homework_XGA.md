


**Xavier Gonzalez Arriola** ----- 2025-12-14

---


# HubOS QA Engineer Homework XGA

## Test Execution Summary (2025-12-14)

- **Total tests:** 256
- **Passed:** 256
- **Failed:** 0
- **Playwright HTML report:** [playwright-report/report_2025-12-14_12-10-47/index.html](playwright-report/report_2025-12-14_12-10-47/index.html)

All tests passed successfully in the final run. See the HTML report for detailed results and screenshots.

## Overview
This document explains how the provided Playwright test suite fully satisfies the requirements for the HubOS QA Engineer Homework. It also describes the Page Object Model (POM) used, details additional edge and security tests, and provides links to selected test run reports.

---

## Requirements Coverage

| Requirement | Test(s) | Description |
|-------------|---------|-------------|
| Login with correct room and surname (with leading zero) | should login with correct room and surname (A), (B) | Validates standard login with '0440' and 'Willem Dafoe' |
| Login with room number without leading zero | should login with room number without leading zero (A), (B) | Validates new feature: login with '440' and 'Willem Dafoe' |
| Regression: incorrect room | should not login with incorrect room number (A), (B) | Ensures login fails for invalid room |
| Regression: incorrect surname | should not login with incorrect surname (A), (B) | Ensures login fails for invalid surname |
| Empty fields | should show error for empty fields (A), (B) | Ensures error is shown if fields are empty |
| Edge: special chars, long input, whitespace | Multiple tests (see below) | Validates robustness against edge cases |
| Security: partial name | should (not) allow login with partial name (security proof) | Demonstrates current vulnerability |

---

## Test Table Example

| Test Name | Input Room | Input Name | Expected Result |
|-----------|------------|------------|----------------|
| should login with correct room and surname (A) | 0440 | Willem Dafoe | Success, main menu shown |
| should login with correct room and surname (B) | 0440 | Willem Dafoe | Success, main menu shown |
| should login with room number without leading zero (A) | 440 | Willem Dafoe | Success, main menu shown |
| should login with room number without leading zero (B) | 440 | Willem Dafoe | Success, main menu shown |
| should not login with incorrect room number (A) | 9999 | Willem Dafoe | Error, stay on login |
| should not login with incorrect surname (A) | 0440 | Follet Verd | Error, stay on login |
| should show error for empty fields (A) |  |  | Error, stay on login |
| should login and open chat (A) | 0440 | Willem Dafoe | Success, chat opens in new tab, 'Alex Hub OS' visible |
| should login and open chat (B) | 0440 | Willem Dafoe | Success, chat opens in new tab, 'Alex Hub OS' visible |

---

## Additional Edge and Security Tests
- **Chat Feature (A/B):**
  - Login: '0440', Name: 'Willem Dafoe', click 'Hablamos?' → New tab opens, 'Alex Hub OS' visible (A and B variants)

- **Special Characters:**
  - Room: '@#!', Name: 'Willem Dafoe' → Error
  - Room: '0440', Name: 'D@foe' → Error
- **Long Inputs:**
  - Room: '0' * 50, Name: 'Willem Dafoe' → Error
  - Room: '0440', Name: 'Willem Dafoe' * 10 → Error
- **Whitespace:**
  - Room: ' 0440 ', Name: ' Willem Dafoe ' → Error
- **Partial Name (Security Proof):**
  - Room: '440', Name: 'Will' → Currently allows login (should not)
  - Room: '0440', Name: 'Daf' → Currently allows login (should not)

---

## Page Object Model (POM)

We use a POM for maintainability and clarity. The `LoginPage` class encapsulates all selectors and actions for the login page, such as filling fields and clicking the login button. This abstraction allows tests to be concise and robust against UI changes.

---

## Test Cases That Should (Not) Happen

- **Should happen:**
  - Login only succeeds with exact room and surname (with or without leading zero).
  - All invalid or malformed inputs are rejected with a clear error message.
- **Should NOT happen:**
  - Login with partial names (e.g., 'Will' for 'Willem Dafoe') should not succeed (currently, it does—security issue).
  - Login with extra/double zeros or special characters should not succeed.

---

## Selected Test Run Reports

- [Sample Test Run 1](playwright-report/report_2025-12-13_16-23-54/index.html)
- [Sample Test Run 2](playwright-report/report_2025-12-13_19-41-01/index.html)
- [Sample Test Run 3](playwright-report/report_2025-12-14_00-02-30/index.html)
- [Latest Full Suite with Chat Tests](playwright-report/index.html)

Open these HTML files locally for detailed results and screenshots.

---

## Conclusion

All requirements are fully satisfied, with additional edge, chat feature, and security tests provided. The test suite is robust, maintainable, and ready for review. All 256 tests, including chat A/B, passed on all browsers/devices (2025-12-14).

---

*Xavier Gonzalez Arriola*
