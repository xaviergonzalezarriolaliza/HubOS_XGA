# Guest In Touch QA Tests

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
