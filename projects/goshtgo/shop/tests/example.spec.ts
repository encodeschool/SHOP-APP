import { test, expect } from '@playwright/test';

test('home page has title and nav', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Popular Meat Products');
  await expect(page.getByRole('link', { name: /Cart/i })).toBeVisible();
});