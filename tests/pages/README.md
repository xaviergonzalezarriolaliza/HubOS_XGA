POM Conventions (Playwright)
=============================

Purpose
-------
This file documents the Page Object Model (POM) conventions used for `tests/pages/*`.

Selectors
---------
- Prefer semantic attributes: `data-testid` or `data-test` for test-only selectors.
- If unavailable, prefer `role` and accessible text over brittle CSS/XPath.
- Keep selectors private to the page object; expose behavior via methods.

Method Naming & Returns
------------------------
- Use imperative verb phrases for methods: `clickLogin()`, `fillRoom(name)`, `openChat()`.
- Methods that navigate to another page should return the new page object instance.
  Example: `async login(...) : Promise<ChatPage>`.
- Chainable helpers may return `this` for convenience when appropriate.

Assertions & Side Effects
------------------------
- Page methods should NOT assert by default unless explicitly documented.
- Make assertions opt-in via a boolean parameter (e.g. `assertRoom = false`).
- Provide explicit `assert*` helper methods on page objects (e.g. `assertLoggedIn`).

Waits, Timeouts & Stability
---------------------------
- Avoid `page.waitForTimeout()`; prefer deterministic waits:
  - `locator.waitFor()`
  - `page.waitForResponse()` / `networkIdle` helper
- Centralize timeouts in `tests/libs/waits.ts` (single source of truth).
- Use `strict` or scoped locators where possible to avoid flakiness.

Types & Signatures
------------------
- Annotate method return types (e.g., `Promise<void>` or `Promise<ChatPage>`).
- Keep method signatures small; pass only necessary data objects.

File Structure & Helpers
------------------------
- Page objects: `tests/pages/*.ts` (one class per file, export default class).
- Shared helpers: `tests/libs/waits.ts`, `tests/libs/asserts.ts`.
- Tests must import page objects from `tests/pages` and avoid raw locator logic.

Migration Best Practices
-----------------------
- Migrate tests in small batches (recommended 6–10 tests per PR).
- Run tests locally and in CI for each batch and verify `test-results/**` contains traces/screenshots.

Notes
-----
- Keep the POM API focused on behavior, not implementation details.
- If a test requires a locator not yet exposed, add a small page method rather than using the locator in the test.
