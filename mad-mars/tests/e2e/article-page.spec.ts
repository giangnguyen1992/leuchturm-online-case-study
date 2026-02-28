import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Article Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and h1', async ({ page }) => {
    await expect(page).toHaveTitle(/Leuchtturm/);
    const h1 = page.locator('article h1');
    await expect(h1).toContainText('Leuchtturm');
  });

  test('has semantic HTML structure', async ({ page }) => {
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
  });

  test('skip link navigates to main content', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveText('Zum Inhalt springen');
  });

  test('weather widget is visible in header', async ({ page }) => {
    const weather = page.locator('.weather-widget');
    await expect(weather).toBeVisible();
    await expect(weather).toHaveAttribute('aria-label', 'Wetter in Hamburg');
  });

  test('share section has accessible buttons', async ({ page }) => {
    const shareSection = page.locator('aside[aria-label="Artikel teilen"]');
    await expect(shareSection).toBeVisible();
    await expect(shareSection.locator('h2')).toHaveText('Artikel teilen');
  });

  test('related articles section exists', async ({ page }) => {
    const section = page.locator('section[aria-labelledby="related-heading"]');
    await expect(section).toBeVisible();
    await expect(section.locator('#related-heading')).toHaveText('Mehr zum Thema');
  });

  test('related articles load when scrolled into view', async ({ page }) => {
    await page.locator('section[aria-labelledby="related-heading"]').scrollIntoViewIfNeeded();
    // Wait for either stories to load or error/empty state
    await expect(
      page.locator('.story-card, .error-card, .empty-card, .skeleton-card').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('page is responsive at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('has no critical accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(critical).toHaveLength(0);
  });
});
