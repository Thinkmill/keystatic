import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/keystatic');
  await expect(page.getByText('Keystatic')).toBeVisible();
});
