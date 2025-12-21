**Xavier Gonzalez Arriola** ----- 2025-12-14

[GitHub Repository: xaviergonzalezarriolaliza/HubOS_XGA](https://github.com/xaviergonzalezarriolaliza/HubOS_XGA)

---


# HubOS QA Engineer Homework XGA

**Latest run summary (report: playwright-report/report_2025-12-21_17-08-56/index.html, CI run 20413844932)**

- **Total tests:** 336 — **Passed:** 336, **Failed:** 0 (no flaky failures recorded).
- **Browsers / devices:** Chromium, Firefox, WebKit across desktop and mobile emulation (roughly equal distribution; ~112 tests per browser). Mobile profiles exercised include Android (Pixel / Galaxy emulation) and iPhone (Mobile Safari emulation).
- **Wall time (approx):** ~18 minutes total; average test duration ~3–4s.
- **Artifacts:** full HTML report and raw traces available in `playwright-report/report_2025-12-21_17-08-56/` and `test-results/report_2025-12-21_17-08-56/`.

 

## Top 5 Significant Screenshots (for PDF)

These screenshots are representative images from recent runs. When the PDF is generated, the images below help reviewers quickly see the UI elements and selectors used in the tests.

- **Login inputs (room & name)** — `playwright-report/data/c5a63091c84b46ac0df67e5b9cd13bd081a278cf.png`
  - Test(s): should login with correct room and surname (A/B)
  - Key locators/roles: `#guest_room`, `#guest_name`, `#btn_login`
  
  ![Login inputs](playwright-report/data/c5a63091c84b46ac0df67e5b9cd13bd081a278cf.png)

- **F&B alternate form layout** — `playwright-report/data/f71ae65d482fdffd1dc770e298eb252e47724077.png`
  - Test(s): should login with correct room and surname (B)
  - Key locators: `.fandb-form-control-login`, `.btn-login`, role=`button`

  ![F&B alternate form layout](playwright-report/data/f71ae65d482fdffd1dc770e298eb252e47724077.png)

- **Validation / notification (empty fields)** — `playwright-report/data/d4083499a387fbf4e904d9103fbdfa3ab50f0893.png`
  - Test(s): should show error for empty fields (A/B)
  - Key locators/roles: `#notification`, `role=alert`

  ![Validation notification](playwright-report/data/d4083499a387fbf4e904d9103fbdfa3ab50f0893.png)

- **Chat opened confirmation (post-login)** — `playwright-report/data/5648a809cbe47e8152ff710b5d2be53526405761.png`
  - Test(s): should login and open chat (A/B)
  - Key locators: `Hablamos?` button/link; new tab title contains `Alex Hub OS`

  ![Chat opened confirmation](playwright-report/data/5648a809cbe47e8152ff710b5d2be53526405761.png)

- **Reservation error screenshot** — `playwright-report/data/cc5631e724eb8330d3fc69573f66b77a6040ff8c.png`
  - Test(s): should not login with incorrect room number (A/B)
  - Key locators: `#notification`, assertion uses `toContainText` for reservation-related text

  ![Reservation error screenshot](playwright-report/data/cc5631e724eb8330d3fc69573f66b77a6040ff8c.png)

Include these images in the PDF by referencing the `playwright-report/data/` paths for the run you choose to export.

## Most Recent 5 Reports (links)

- [Run 20413844932 — HTML report (artifact)](https://github.com/xaviergonzalezarriolaliza/HubOS_XGA/actions/runs/20413844932/artifacts/4937671520)
- [Run 20413492572 — HTML report (artifact)](https://github.com/xaviergonzalezarriolaliza/HubOS_XGA/actions/runs/20413492572/artifacts/4937578417)
- [2025-12-19: 304 tests passed](playwright-report/report_2025-12-19_17-05-37/index.html)
- [2025-12-15: 304 tests passed](playwright-report/report_2025-12-15_13-13-29/index.html)
- [2025-12-14: 304 tests passed](playwright-report/report_2025-12-14_16-53-08/index.html)

## Latest Test Report — grouped by title (selected scenarios)

- **Guest in Touch Login**
  - should login with correct room and surname (A)
  - should login with correct room and surname (B)
  - should login with room number without leading zero (A/B)
  - should not login with incorrect room number (A/B)
  - should show error for empty fields (A/B)

- **Chat / Post-login**
  - should login and open chat (A/B)

- **Edge & Security**
  - should (not) allow login with partial name (security proof)
  - should show error for very long room number (A/B)


## Latest Changes (2025-12-21)

- **CI (GitHub Actions):** Playwright workflow updated to generate and upload the HTML report folder (`playwright-report/`) and the raw `test-results` artifact for each run.
- **Tests:** Login tests in `tests/login.spec.ts` were migrated to use the `LoginPage` POM (`tests/pages/LoginPage.ts`) and brittle `page.locator('body')` assertions were replaced with `LoginPage.assertLoggedIn(...)` helpers to reduce flakiness on mobile/WebKit.
- **Commit:** `2295f8f` pushed to `main` (follow-up commit to replace remaining body-level assertions with POM assertions).
- **Verification:** Local smoke runs for the updated tests passed; CI runs now produce HTML reports and upload artifacts.

**Latest CI HTML Reports (artifacts)**

- Run 20413844932 — HTML report artifact: https://github.com/xaviergonzalezarriolaliza/HubOS_XGA/actions/runs/20413844932/artifacts/4937671520
- Run 20413492572 — HTML report artifact: https://github.com/xaviergonzalezarriolaliza/HubOS_XGA/actions/runs/20413492572/artifacts/4937578417


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

- [2025-12-14: 304 tests passed](playwright-report/report_2025-12-14_16-37-08/index.html)
- [2025-12-14: 256 tests passed](playwright-report/report_2025-12-14_15-37-35/index.html)
- [2025-12-13: 224 tests passed](playwright-report/report_2025-12-13_13-31-52/index.html)
- [2025-12-12: 216 tests passed](playwright-report/report_2025-12-12_21-40-52/index.html)

Open these HTML files locally for detailed results and screenshots.

---

## Conclusion

All requirements are fully satisfied, with additional edge, chat feature, and security tests provided. The test suite is robust, maintainable, and ready for review. All 304 tests, including chat A/B and new scenarios, passed on all browsers/devices (2025-12-14).

---

*Xavier Gonzalez Arriola*
