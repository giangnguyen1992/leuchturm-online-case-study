import { test, expect } from '@playwright/test';

test.describe('Progressive Enhancement (JS disabled)', () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(async ({ page }) => {
    await page.goto('/artikel/hafencity-leuchtturm');
  });

  test('article content is fully readable', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Leuchtturm');
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('.article-body')).toBeVisible();
  });

  test('weather widget shows build-time data', async ({ page }) => {
    const weather = page.locator('.weather-widget');
    await expect(weather).toBeVisible();
    // Should show the SSR-rendered weather data with "Stand:" timestamp
    await expect(weather.locator('[data-weather-time]')).toContainText('Stand:');
  });

  test('share section shows fallback links', async ({ page }) => {
    const fallback = page.locator('.share-fallback');
    await expect(fallback).toBeVisible();

    const emailLink = fallback.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toContainText('E-Mail');

    const twitterLink = fallback.locator('a[href*="twitter.com"]');
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toContainText('X teilen');
  });

  test('related articles shows noscript fallback', async ({ page }) => {
    const fallback = page.locator('.related-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback.locator('a')).toHaveAttribute('href', 'https://news.ycombinator.com');
  });
});
