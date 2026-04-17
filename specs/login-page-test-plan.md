# Login Page Test Plan

## Application Overview

Test plan for the Practice Test Automation login page at https://practicetestautomation.com/practice-test-login/. Covers positive login, negative credential handling, field validation, and UI verification across 10 distinct cases.

## Test Scenarios

### 1. Practice Test Automation Login Page

**Seed:** `seed.spec.ts`

#### 1.1. Valid login with correct credentials

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page at https://practicetestautomation.com/practice-test-login/.
  2. -
    - expect: Verify Username and Password fields are visible.
  3. -
    - expect: Enter username student and password Password123.
  4. -
    - expect: Click the Submit button.
  5. -
    - expect: Verify the page redirects to a URL containing logged-in-successfully.
  6. -
    - expect: Verify the success message contains Congratulations student. You successfully logged in!.
  7. -
    - expect: Verify the Log out button or link is visible.

#### 1.2. Invalid username shows username invalid error

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Enter username wronguser and password Password123.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the message text is Your username is invalid!.
  6. -
    - expect: Verify both Username and Password fields are cleared after the failed attempt.

#### 1.3. Invalid password shows password invalid error

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Enter username student and password WrongPassword.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the message text is Your password is invalid!.
  6. -
    - expect: Verify both Username and Password fields are cleared after the failed attempt.

#### 1.4. Empty username shows username invalid error

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Leave Username blank and enter Password123 in Password.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the error text is Your username is invalid!.

#### 1.5. Empty password shows password invalid error

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Enter student in Username and leave Password blank.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the error text is Your password is invalid!.

#### 1.6. Both username and password empty shows username invalid error

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Leave both Username and Password blank.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the error text is Your username is invalid!.

#### 1.7. Username case sensitivity is enforced

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Enter username STUDENT and password Password123.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the error text is Your username is invalid!.

#### 1.8. Whitespace password is rejected

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Enter username student and password consisting only of spaces.
  3. -
    - expect: Click Submit.
  4. -
    - expect: Verify the error message is visible.
  5. -
    - expect: Verify the error text is Your password is invalid!.

#### 1.9. Error message is cleared or updated when retrying after failure

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Submit an invalid username or password.
  3. -
    - expect: Verify the error message is visible.
  4. -
    - expect: Enter valid credentials student and Password123.
  5. -
    - expect: Click Submit again.
  6. -
    - expect: Verify the page redirects to the success page.

#### 1.10. Login page UI elements and instructions display correctly

**File:** `specs/login-page-test-plan.md`

**Steps:**
  1. -
    - expect: Open the login page.
  2. -
    - expect: Verify the page title or header indicates Test login.
  3. -
    - expect: Verify the instruction text about valid credentials is visible.
  4. -
    - expect: Verify Username and Password labels are visible.
  5. -
    - expect: Verify the Submit button is visible and labeled Submit.
