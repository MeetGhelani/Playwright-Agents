---
name: debug-playwright-test
description: "Debug a failed Playwright test by running it with tracing, then analyzing the trace using the CLI trace tool (npx playwright trace). Use this skill whenever the user asks to debug, fix, or investigate a failing or flaky Playwright test, or when a test execution produces an error. Also triggers when the user says things like 'this test is broken', 'why is this test failing', 'fix this test', or 'investigate test failure'. Includes best practices for test failure handling, trace collection, and robust debugging strategies."
---

# Playwright Test Debugging Guide

## Overview

This guide provides comprehensive instructions for debugging failed Playwright tests using the Playwright Trace feature. It covers test failure handling, trace collection, analysis, and best practices for creating robust and maintainable tests.

---

## When to Use This Skill
     
Use this skill when:
- A Playwright test fails during execution
- Test flakiness or intermittent failures occur
- You need to investigate test behavior without live debugging
- A test passes locally but fails in CI/CD
- You need to understand what happened at each step of a test
- Visual regression or UI interaction issues are suspected
- Network timing or async operation issues are occurring

## Quick Start: Running a Test with Trace

### 1. Enable Tracing

Add tracing configuration to your test:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run start',
    port: 3000,
  },
  use: {
    // Basic tracing for all tests
    trace: 'on-first-retry',
  },
  // Or configure per project
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### 2. Run Test with Tracing

```bash
# Run a single test with tracing enabled
npx playwright test --trace on test.spec.ts

# Run all tests with tracing
npx playwright test --trace on

# Enable tracing only on failure (most efficient)
npx playwright test --trace on-first-retry

# Enable verbose logging alongside tracing
npx playwright test --trace on --debug
```

### 3. View the Trace

```bash
# Open the Playwright Trace Viewer with the generated trace
npx playwright show-trace trace.zip

# Or specify the exact trace file path
npx playwright show-trace test-results/test-name/trace.zip
```

---

## Understanding Trace Collection Options

### Trace Modes

| Mode | When to Use | Storage |
|------|------------|---------|
| `off` | Never needed for debugging | No trace stored |
| `on` | Always collect traces (development/debugging) | Always creates trace files |
| `on-first-retry` | CI/CD environments (efficient) | Only when test retries |
| `retain-on-failure` | Legacy mode; use `on-first-retry` instead | Only on failure |

**Recommendation for CI/CD:**
```typescript
trace: process.env.CI ? 'on-first-retry' : 'on',
```

---

## Test Failure Handling Workflow

### Step 1: Initial Failure Investigation

When a test fails, follow this diagnostic sequence:

```bash
# 1. Run the failing test in verbose mode to see error message
npx playwright test --trace on tests/failing-test.spec.ts --verbose

# 2. Check the output directory for generated trace
ls -la test-results/

# 3. Open the trace viewer
npx playwright show-trace test-results/failing-test/trace.zip
```

### Step 2: Analyze Error Message

The error output provides:
- **Assertion error**: What was expected vs. what was found
- **Locator error**: Element not found, timing issue, or selector problem
- **Navigation error**: Page failed to load or timeout
- **Network error**: API call failed or timeout occurred

```bash
# Example error output interpretation:
# Error: locator.click: Target page, context or browser has been closed
#   This suggests the page/browser closed unexpectedly (e.g., popup, redirect)

# Error: locator.click: Timeout 30000ms exceeded
#   Element exists but couldn't be interacted with in time (visibility, scrolling, etc.)

# Error: Unexpected value
#   Assertion failed on content, visibility, or computed property
```

### Step 3: Review the Trace

Use the Playwright Trace Viewer to:
1. **Timeline view**: See all actions and their duration
2. **Screenshot layer**: View page state at each step
3. **Network panel**: Inspect all network requests and responses
4. **Console logs**: Check for JavaScript errors or warnings
5. **DOM snapshot**: Inspect HTML structure at specific points

---

## The Playwright Trace Viewer: Complete Feature Guide

### Launching the Trace Viewer

```bash
# Standard launch
npx playwright show-trace path/to/trace.zip

# Programmatically (for CI/CD scripts)
import { showTrace } from '@playwright/test/cli';
showTrace('test-results/trace.zip');
```

### Key Panels and Their Uses

#### 1. **Timeline/Actions Panel** (Left sidebar)

Shows every action in chronological order:
- `goto` — page navigation
- `click` — element interaction
- `fill` — text input
- `waitForNavigation` — waiting for page load
- `expect` — assertions
- `screenshot` — snapshots taken

**What to look for:**
- Actions taking unexpectedly long (slow network, slow rendering)
- Actions triggering unexpected side effects
- Assertions failing on unexpected values
- Missing expected actions (e.g., navigation didn't happen)

#### 2. **Screenshot Panel** (Main center area)

Visual representation of the page at each step.

**What to look for:**
- Missing elements (selector may be broken)
- Elements in unexpected positions (layout shifted)
- Popup or modal appearing (blocking interaction)
- Page not fully loaded (images missing, partial content)
- Wrong page loaded (navigation to unexpected URL)

**How to navigate:**
- Click on any action in the timeline to see the page state at that moment
- Use arrow keys to step through actions frame-by-frame
- Hover over elements to highlight them in the screenshot

#### 3. **DOM Inspector** (Right panel)

Shows the HTML structure at the current step. Includes:
- Element hierarchy
- Computed styles (CSS)
- Attributes (id, class, data-*)
- Event listeners (if present)

**What to look for:**
- Element missing from DOM (navigated away, removed by script)
- Element hidden (display: none, visibility: hidden, opacity: 0)
- Element outside viewport (requires scroll)
- Incorrect CSS classes applied
- Missing or incorrect data attributes

**How to use:**
- Click the element picker icon (crosshair) to select elements in the screenshot
- Right-click elements in the DOM tree to copy selectors
- Expand/collapse sections to understand page structure

#### 4. **Console Panel** (Bottom)

JavaScript console output, including:
- `console.log`, `console.error`, `console.warn` messages
- JavaScript exceptions and stack traces
- Warning messages from the browser

**What to look for:**
- Unhandled JavaScript errors
- API call failures (404, 500, timeout errors)
- Deprecation warnings
- Custom application logging (helps trace business logic)

**Example problematic output:**
```
Error: Cannot read property 'click' of null
  at app.js:42:15
```
This suggests the element selection logic failed.

#### 5. **Network Panel** (Bottom)

HTTP requests and responses made during the test.

**Columns:**
- **Request**: URL and method (GET, POST, etc.)
- **Status**: HTTP status code (200, 404, 500, etc.)
- **Type**: Resource type (document, xhr, fetch, etc.)
- **Size**: Response body size
- **Duration**: Time taken for request/response cycle

**What to look for:**
- Failed requests (status 4xx, 5xx)
- Requests timing out (very long duration)
- Unexpected redirects (302, 301 status codes)
- Missing requests (API call never made)
- Slow requests (> 1000ms for typical endpoints)

**Analyzing a network issue:**
1. Click on the request to expand details
2. View **Headers** tab (Authorization, User-Agent, cookies)
3. View **Response** tab (actual response body)
4. Check if response differs from what the test expects
5. Verify request was sent with correct parameters

#### 6. **Source/Locator Information**

Shows the Playwright code that generated each action.

**What to look for:**
- Which line in your test file triggered the action
- Whether the action was explicit or implicit (auto-waiting)
- Any custom test annotations or metadata

---

## Common Test Failures and How to Fix Them

### Failure Type 1: Element Not Found

**Error message:**
```
Error: locator.click: Target page, context or browser has been closed
```

**In the trace, you'll see:**
- Screenshot shows page is blank or different than expected
- DOM inspector shows element is not in the HTML
- Console shows JavaScript error about missing DOM

**Solutions:**
```typescript
// ❌ Problem: Selector doesn't match any elements
await page.locator('#nonexistent-button').click();

// ✅ Solution 1: Use wait-for to ensure element appears
await page.locator('#button').waitFor({ state: 'visible' });
await page.locator('#button').click();

// ✅ Solution 2: Wait for page state before interaction
await page.waitForLoadState('networkidle');
await page.locator('#button').click();

// ✅ Solution 3: Use more specific or flexible selectors
// Instead of: '#button' (may not exist on all page states)
// Use: 'button:has-text("Click me")' (more resilient)
```

### Failure Type 2: Timeout During Wait

**Error message:**
```
Timeout 30000ms exceeded while waiting for locator
```

**Trace analysis:**
- Check screenshot — is the element visible on the page?
- Check network panel — are requests pending?
- Check console — are there JavaScript errors?
- Check timeline — when did the action start? Are other requests blocking?

**Solutions:**
```typescript
// ❌ Problem: Element may not appear in 30s due to slow load
await page.locator('#delayed-content').waitFor({ timeout: 30000 });

// ✅ Solution 1: Wait for parent container to appear first
await page.locator('.content-loader').waitFor({ state: 'hidden' });
await page.locator('#delayed-content').click();

// ✅ Solution 2: Wait for specific network condition
await page.waitForLoadState('networkidle');

// ✅ Solution 3: Increase timeout for slow environments
await page.locator('#element').click({ timeout: 60000 });

// ✅ Solution 4: Use explicit wait with polling
await page.waitForFunction(() => {
  return document.querySelector('#element') !== null;
});
```

### Failure Type 3: Assertion Failed

**Error message:**
```
Assertion failed: expected 'Buy Now' to equal 'Purchase'
```

**Trace analysis:**
- Screenshot shows the element exists but content differs
- Timeline shows the action completed but assertion failed
- Check if page content is dynamic (loaded after initial render)

**Solutions:**
```typescript
// ❌ Problem: Button text changed by JavaScript after load
expect(await page.locator('button').textContent()).toBe('Buy Now');

// ✅ Solution 1: Wait for specific text
await expect(page.locator('button')).toContainText('Buy Now');

// ✅ Solution 2: Wait for dynamic updates
await page.waitForLoadState('networkidle');
await expect(page.locator('button')).toHaveText('Buy Now');

// ✅ Solution 3: Use polling with retry
expect(await page.locator('button').textContent()).toBe('Buy Now');
// Playwright auto-retries this expectation
```

### Failure Type 4: Navigation Failed

**Error message:**
```
Net::ERR_NAME_NOT_RESOLVED
```

**Trace analysis:**
- Network panel shows failed request with red status
- Console shows error about DNS resolution or network connection
- Timeline shows goto action completed but with error

**Solutions:**
```typescript
// ❌ Problem: Unreliable network conditions
await page.goto('https://api.example.com');

// ✅ Solution 1: Add retry logic for network-dependent tests
await page.goto('https://api.example.com', {
  waitUntil: 'domcontentloaded',
  referer: 'https://example.com'
});

// ✅ Solution 2: Mock unreliable API calls
await page.route('**/api/data', route => {
  route.abort('failed');
});

// ✅ Solution 3: Test in isolation with mocked responses
await page.route('**/api/**', async route => {
  await route.continue();
});
```

### Failure Type 5: Flaky Test (Intermittent Failures)

**Symptoms:**
- Test passes sometimes, fails other times
- No clear error pattern
- Fails more often in CI than locally

**Solutions:**

```typescript
// ❌ Problem: Race condition between actions
await page.click('button');
await page.click('submit'); // Submit button may not be ready

// ✅ Solution 1: Add explicit waits
await page.click('button');
await page.waitForSelector('[name="submit"]', { state: 'visible' });
await page.click('submit');

// ✅ Solution 2: Use auto-waiting with proper locators
await page.locator('button:has-text("Next")').click();
await page.locator('[role="button"]:has-text("Submit")').click();

// ✅ Solution 3: Wait for navigation or network
await page.click('link');
await page.waitForNavigation();

// ✅ Solution 4: Increase timeout in CI environments
const timeout = process.env.CI ? 60000 : 30000;
await page.locator('#element').click({ timeout });

// ✅ Solution 5: Retry flaky tests
test.describe('Flaky Test Suite', () => {
  test.describe.configure({ retries: 2 });
  
  test('should be retried on failure', async ({ page }) => {
    // test code
  });
});
```

---

## Advanced Trace Analysis Techniques

### Analyzing Network Waterfall

Network requests in the trace panel show timing. Use this to identify:

**Slow page loads:**
```
1. Initial HTML document: 500ms
2. JavaScript bundle: 2000ms (slow!)
3. API call: 1500ms
```

**Solution:** Split large bundles, lazy-load, or mock slow APIs in tests.

**Missing requests:**
```
Expected: GET /api/user
Actual: (no request made)
```

**Solution:** Verify the trigger for the API call (button click, page load) happened.

### Using Performance Data

The trace viewer shows timing for each action. Identify bottlenecks:

```typescript
// ❌ Slow test (10+ seconds)
test('slow test', async ({ page }) => {
  await page.goto('http://example.com');          // 3s
  await page.click('button');                      // 5s wait for response
  await page.fill('input', 'text');                // 2s rendering
});

// ✅ Optimized test
test('fast test', async ({ page }) => {
  await page.goto('http://example.com', {
    waitUntil: 'domcontentloaded'  // Don't wait for all resources
  });
  await page.click('button');
  await page.waitForLoadState('networkidle'); // Explicit network wait
  await page.fill('input', 'text');
});
```

### Comparing Traces

When a test fails in CI but passes locally:

1. Generate traces in both environments
2. Open both traces side-by-side
3. Look for differences:
   - **Page state** — Is content different?
   - **Network** — Are requests timing out?
   - **Console errors** — Are there JavaScript errors?

---

## Best Practices for Robust Tests

### 1. Use Resilient Selectors

```typescript
// ❌ Brittle selectors
await page.locator('div > div > button').click();
await page.locator('.btn.primary.enabled').click();

// ✅ Resilient selectors
await page.locator('button[name="submit"]').click();
await page.locator('button:has-text("Submit")').click();
await page.locator('[data-testid="submit-btn"]').click();
await page.locator('role=button[name="Submit"]').click();
```

### 2. Use Role-Based Locators

```typescript
// ✅ Semantic and stable
await page.locator('role=button[name="Click me"]').click();
await page.locator('role=textbox[name="Email"]').fill('user@example.com');
await page.locator('role=combobox').selectOption('Option 1');

// This survives HTML refactoring
```

### 3. Leverage Data Test Attributes

```html
<!-- In your application code -->
<button data-testid="login-button">Sign In</button>
```

```typescript
// ✅ In your tests (very stable)
await page.locator('[data-testid="login-button"]').click();
```

### 4. Always Wait for Network Idle

```typescript
// ✅ Good practice
await page.goto('http://example.com');
await page.waitForLoadState('networkidle');
// Now safe to interact with page
```

### 5. Handle Modal Dialogs and Popups

```typescript
// ❌ Problem: Popup blocks interaction
await page.locator('button').click();
// Modal appears and blocks next action

// ✅ Solution 1: Accept dialog
page.once('dialog', dialog => dialog.accept());
await page.locator('button').click();

// ✅ Solution 2: Wait for modal visibility
await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
await page.locator('[role="button"]:has-text("OK")').click();
await page.locator('[role="dialog"]').waitFor({ state: 'hidden' });
```

### 6. Configure Smart Retries

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: 15000,
  },
});
```

### 7. Use Custom Fixtures for Common Setup

```typescript
// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('http://example.com/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

// test.spec.ts
test('should show user dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('h1')).toContainText('Dashboard');
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Accessing Traces in CI

```bash
# After test run, traces are in:
# test-results/[test-name]/trace.zip

# Download artifact from CI, then:
npx playwright show-trace test-results/test-name/trace.zip
```

---

## Performance Optimization Tips

### Reduce Test Execution Time

```typescript
// ❌ Slow: Full page load
await page.goto('http://example.com');

// ✅ Fast: Stop waiting for images, stylesheets
await page.goto('http://example.com', {
  waitUntil: 'domcontentloaded'
});

// ✅ Fast: Mock external resources
await page.route('**/*.jpg', route => route.abort());
await page.route('**/*.css', route => route.abort());
```

### Parallelize Tests

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : undefined, // 4 workers in CI
});
```

### Use Fixtures to Avoid Repetition

```typescript
// ❌ Slow: Setup repeated in every test
test('test 1', async ({ page }) => {
  await page.goto('http://example.com');
  await page.waitForLoadState('networkidle');
  // test code
});

test('test 2', async ({ page }) => {
  await page.goto('http://example.com');
  await page.waitForLoadState('networkidle');
  // test code
});

// ✅ Fast: Shared setup
const test = base.extend({
  loadedPage: async ({ page }, use) => {
    await page.goto('http://example.com');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

test('test 1', async ({ loadedPage }) => {
  // test code
});

test('test 2', async ({ loadedPage }) => {
  // test code
});
```

---

## Troubleshooting the Trace Viewer

### "Cannot open trace" or "Invalid trace file"

```bash
# Verify the trace file exists and is valid
ls -lh test-results/*/trace.zip

# Regenerate the trace
npx playwright test --trace on [test-file]

# Try with updated Playwright
npm install -D @playwright/test@latest
npx playwright show-trace test-results/[test]/trace.zip
```

### Trace file is too large

```typescript
// Reduce trace size by excluding screenshots
// playwright.config.ts
use: {
  trace: 'on-first-retry',
  traceViewerSnapshotSize: 50, // Reduce snapshot resolution
},
```

### Cannot reproduce locally but fails in CI

1. Capture the trace in CI (already happening with `on-first-retry`)
2. Download the artifact from CI
3. Open locally: `npx playwright show-trace [downloaded-trace.zip]`
4. Compare page state, network requests, and timing

---

## Summary Workflow

When debugging a failed Playwright test:

1. **Run with tracing**: `npx playwright test --trace on [test-file]`
2. **Open the trace**: `npx playwright show-trace test-results/[test]/trace.zip`
3. **Analyze the failure**:
   - Check the screenshot (Is content visible?)
   - Review the timeline (Which action failed?)
   - Inspect the DOM (Is the element in the HTML?)
   - Check the network panel (Did requests succeed?)
   - Review the console (Are there JavaScript errors?)
4. **Fix the root cause**:
   - Add explicit waits for elements/network
   - Use more resilient selectors
   - Handle async operations properly
   - Mock unreliable external services
5. **Re-run the test** to verify the fix
6. **Commit the fix** with updated test code

---

## Quick Reference

| Task | Command |
|------|---------|
| Run tests with tracing | `npx playwright test --trace on` |
| View a trace | `npx playwright show-trace path/to/trace.zip` |
| Enable only on failure | `trace: 'on-first-retry'` in config |
| Clear old traces | `rm -rf test-results/` |
| Run single test | `npx playwright test tests/auth.spec.ts` |
| Run in debug mode | `npx playwright test --debug` |
| Show browser during test | `npx playwright test --headed` |
| Update snapshots | `npx playwright test --update-snapshots` |

---

## Additional Resources

- [Playwright Official Documentation](https://playwright.dev/)
- [Playwright Trace Viewer Guide](https://playwright.dev/docs/trace-viewer)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
