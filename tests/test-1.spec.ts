import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  const page1 = page;
  await page1.goto("https://practicetestautomation.com/");
  await page.getByRole('link', { name: 'Practice', exact: true }).click();
  await page.getByRole('link', { name: 'Test Exceptions' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('#rows')).toContainText('Row 2');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('Burger');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#rows')).toMatchAriaSnapshot(`
    - text: Row 1
    - textbox [disabled]: Pizza
    - text: Row 2
    - textbox [disabled]: Burger
    - button "Edit"
    - button "Remove"
    - text: Row 2 was saved
    `);
});
