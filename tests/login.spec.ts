import { test, expect, type Page } from "@playwright/test";

const loginUrl = "https://practicetestautomation.com/practice-test-login/";
const successUrlPattern = /logged-in-successfully/;
const usernameInput = "#username";
const passwordInput = "#password";
const submitButton = "#submit";
const errorMessage = "#error";

async function submitLogin(page: Page, username: string, password: string) {
  await page.fill(usernameInput, username);
  await page.fill(passwordInput, password);
  await page.click(submitButton);
}

test.describe("Practice Test Automation Login Page", () => {
  test.beforeEach(async ({ page }) => {
    // Open the login page
    await page.goto(loginUrl);
    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator(usernameInput)).toBeVisible();
    await expect(page.locator(passwordInput)).toBeVisible();
    await expect(page.locator(submitButton)).toBeVisible();
  });

  test("1. valid credentials redirect to success page", async ({ page }) => {
    // Enter valid username and password
    await submitLogin(page, "student", "Password123");
    // Verify redirect and success content
    await expect(page).toHaveURL(successUrlPattern);
    await expect(page.locator("text=Congratulations student. You successfully logged in!")).toBeVisible();
    await expect(page.locator("text=Log out")).toBeVisible();
  });

  test("2. invalid username shows username invalid error", async ({ page }) => {
    // Enter invalid username with valid password
    await submitLogin(page, "wronguser", "Password123");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your username is invalid!");
    await expect(page.locator(usernameInput)).toHaveValue("");
    await expect(page.locator(passwordInput)).toHaveValue("");
  });

  test("3. invalid password shows password invalid error", async ({ page }) => {
    // Enter valid username with invalid password
    await submitLogin(page, "student", "WrongPassword");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your password is invalid!");
    await expect(page.locator(usernameInput)).toHaveValue("");
    await expect(page.locator(passwordInput)).toHaveValue("");
  });

  test("4. empty username shows username invalid error", async ({ page }) => {
    // Leave username blank and enter valid password
    await submitLogin(page, "", "Password123");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your username is invalid!");
  });

  test("5. empty password shows password invalid error", async ({ page }) => {
    // Enter valid username and leave password blank
    await submitLogin(page, "student", "");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your password is invalid!");
  });

  test("6. both fields empty shows username invalid error", async ({ page }) => {
    // Leave both fields blank and submit
    await submitLogin(page, "", "");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your username is invalid!");
  });

  test("7. username with special characters shows username invalid error", async ({ page }) => {
    // Enter a username containing special characters
    await submitLogin(page, "stu!dent@", "Password123");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your username is invalid!");
  });

  test("8. whitespace password shows password invalid error", async ({ page }) => {
    // Enter password consisting only of whitespace
    await submitLogin(page, "student", "   ");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your password is invalid!");
  });

  test("9. username case sensitivity is enforced", async ({ page }) => {
    // Enter uppercase username with correct password
    await submitLogin(page, "STUDENT", "Password123");
    await expect(page.locator(errorMessage)).toBeVisible();
    await expect(page.locator(errorMessage)).toHaveText("Your username is invalid!");
  });

  test("10. login page displays form instructions and fields", async ({ page }) => {
    // Verify that the login page instructions and labels are visible
    await expect(page.locator("text=Use next credentials to execute Login")).toBeVisible();
    await expect(page.locator('label[for="username"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    await expect(page.locator(submitButton)).toBeVisible();
    await expect(page.locator(submitButton)).toHaveText("Submit");
  });
});
