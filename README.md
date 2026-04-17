# 🎯 Playwright Agents — Example Test Workflow

This repository demonstrates how a Playwright agent workflow works using a login page example.

- ✅ Example under test: `https://practicetestautomation.com/practice-test-login/`
- 📁 Example test file: `tests/login.spec.ts`
- 📝 Example plan file: `specs/login-page-test-plan.md`

> The login test is provided as a sample scenario. The same workflow can be applied to any other page or app by updating the test plan and test file.

This project is built so a beginner can install dependencies, run the test suite, generate an HTML report, and understand how a Playwright-based test workflow is structured.

## 🧭 Project Structure

```
.
├── .github/
├── .vscode/
├── package.json
├── tsconfig.json
├── README.md
├── specs/
│   └── login-page-test-plan.md
├── tests/
│   └── login.spec.ts
└── node_modules/
```

## Prerequisites

Make sure the following are installed:

- Node.js (version 18 or later recommended)
- npm (comes with Node.js)
- Git

## Setup Instructions

1. Open a terminal in the project folder:

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## 🧩 Install Playwright Agents in VS Code

To use Playwright Agents in Visual Studio Code:

1. Open VS Code in the project folder.
2. Open the Extensions view (`Ctrl+Shift+X`).
3. Search for `Playwright` or `Playwright Test`.
4. Install the `Playwright for VS Code` extension.
5. Reload VS Code if prompted.
6. In the VS Code terminal, run the agents init command:

```bash
npx playwright init-agents --loop=vscode
```

7. Open the `tests/` folder and run tests from the Playwright sidebar or terminal.

## ▶️ Run All Tests

To run the full Playwright test suite in `tests/login.spec.ts`:

```bash
npx playwright test tests/login.spec.ts
```

Or using npm script:

```bash
npm test -- tests/login.spec.ts
```

## 🤖 How Playwright Agents Work

Playwright agents follow a simple workflow:

1. 📝 Plan the test scenario and expected outcomes.
2. 🧩 Generate or update the Playwright test file using the plan.
3. ▶️ Run the test file against the target application.
4. 🔧 Review failures and heal tests by updating selectors, assertions, or steps.

> This repository uses the login test as an example. You can apply the same approach to any web page by changing the plan and the test file.

## ▶️ Run a Single Test Case

Use the `-g` option with the test title if you want to run one specific case. For example, test case 3:

```bash
npx playwright test tests/login.spec.ts -g "3. invalid password shows password invalid error"
```

## Generate an HTML Report

Run the suite and save the results to an HTML report:

```bash
npx playwright test tests/login.spec.ts --reporter=html
```

After the run completes, open the report with:

```bash
npx playwright show-report
```

The report folder will be created at:

- `playwright-report/`

## 🧠 Planning Tests

A good test workflow starts with a plan. Use `specs/login-page-test-plan.md` as an example.

1. Identify the page and the user flow to test.
2. List the main scenarios: positive login, invalid username, invalid password, empty fields, UI checks, and retry behavior.
3. Write expected outcomes for each scenario.
4. Keep the plan in a simple markdown file so it is easy to update.

Example planning steps:

- ✅ Determine the page URL and valid credentials.
- 🧷 Define the elements to verify (`Username`, `Password`, `Submit`, error text).
- 🧪 Decide what success looks like for each case.
- ✍️ Keep the plan readable so anyone can follow it later.

- Add cases for valid login, invalid inputs, and UI visibility.
- Track the expected result for each case.

## 🧱 Generating Tests

Once the plan is ready, create test files under `tests/`.

1. Copy the existing pattern from `tests/login.spec.ts`.
2. Use descriptive test names and group related cases with `test.describe()`.
3. Use stable selectors such as `#username`, `#password`, `#submit`, and `#error`.
4. Keep each test focused on one behavior.

Example test file structure:

```ts
import { test, expect } from "@playwright/test";

test.describe("My new feature", () => {
  test("1. should do something", async ({ page }) => {
    await page.goto("https://example.com");
    await page.fill("#username", "user");
    await page.fill("#password", "pass");
    await page.click("#submit");
    await expect(page.locator("text=Success")).toBeVisible();
  });
});
```

After creating a new file, run it with:

```bash
npx playwright test tests/my-new-tests.spec.ts
```

## 🩹 Healing Tests

When a test fails, follow these steps to heal it:

1. 🧐 Read the Playwright failure message carefully.
2. 🔎 Open the HTML report with `npx playwright show-report` to see the failing step.
3. 🧩 Check whether the selector changed or the page content was updated.
4. 🛠 Update the selector, assertion text, or test flow accordingly.
5. ▶️ Re-run the affected test only.

Common healing actions:

- 🔄 Replace a broken selector with a more stable one.
- 📝 Change `expect(page.locator(...)).toHaveText(...)` to match the new text.
- ➕ Add a check for a new element if the UI structure changed.
- ✂️ Split a long test into smaller steps if it becomes brittle.

## What is included

- `tests/login.spec.ts` — example Playwright test file for the login page
- `specs/login-page-test-plan.md` — example test plan describing the cases and expected behavior

## Valid Test Credentials

The login page is designed for practice automation with the following credentials:

- Username: `student`
- Password: `Password123`

## Adding New Tests

1. Create a new file under `tests/`, for example `tests/new-login-cases.spec.ts`.
2. Import Playwright helpers from `@playwright/test`.
3. Use `test.describe`, `test`, `expect`, and reliable selectors.
4. Run the new file:

```bash
npx playwright test tests/new-login-cases.spec.ts
```

## Helpful Tips for Beginners

- Use the `tests/` folder for any Playwright test files.
- Keep selectors stable by using IDs such as `#username`, `#password`, and `#submit`.
- Use `page.locator()` and `expect()` assertions for reliable test checks.
- If the browser installation fails, rerun `npx playwright install`.

## Notes

- This project is based on the Playwright Test Runner.
- The HTML report helps review test results visually after each run.
- Keep the test plan in `specs/login-page-test-plan.md` up to date as you add or change tests.
