import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');

  await page.getByRole('link', { name: 'Form Authentication' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
  await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
  await page.getByRole('button', { name: ' Login' }).click();
  await expect(page.locator('h4')).toContainText('Welcome to the Secure Area. When you are done click logout below.');
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - text:  You logged into a secure area!
    - link "×":
      - /url: "#"
    - link "Fork me on GitHub":
      - /url: https://github.com/tourdedave/the-internet
      - img "Fork me on GitHub"
    - heading "Secure Area" [level=2]
    - heading "Welcome to the Secure Area. When you are done click logout below." [level=4]
    - link "Logout":
      - /url: /logout
    - separator
    - text: Powered by
    - link "Elemental Selenium":
      - /url: http://elementalselenium.com/
    `);
});