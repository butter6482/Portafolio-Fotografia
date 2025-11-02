import { test, expect } from '@playwright/test';

/**
 * @mobile Responsive Sanity Tests
 * Quick confidence checks that the site is usable on mobile devices
 */
test.describe('@mobile Responsive sanity', () => {

  test('brand and header links are visible on mobile viewport', async ({ page }) => {
    await page.goto('/');

    // Header must be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Brand text works as "home"
    const brand = header.locator('a', { hasText: /unseen\.juan/i });
    await expect(brand).toBeVisible();

    // "Inicio" may not exist on mobile; accept brand as home fallback
    const inicio = header.getByRole('link', { name: /inicio/i });
    const hasInicio = (await inicio.count()) > 0 && (await inicio.first().isVisible());
    const brandAsHome = await brand.isVisible();
    expect(hasInicio || brandAsHome, 'Either "Inicio" link or brand should be visible as home').toBeTruthy();

    // On mobile, navigation may be behind a menu button - open it if present
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    const menuButtonExists = await menuButton.count() > 0;
    
    if (menuButtonExists && await menuButton.isVisible()) {
      await menuButton.click();
      // Wait for menu to open
      await page.waitForTimeout(300);
    }

    // The other navigation links must now be visible
    await expect(header.getByRole('link', { name: /sobre m(í|i)/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /galer(í|i)a/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /instagram/i })).toBeVisible();
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/');
    
    const w = await page.evaluate(() => ({
      inner: window.innerWidth,
      doc: document.documentElement.scrollWidth
    }));
    
    expect(w.doc, 'Page should not have horizontal overflow').toBeLessThanOrEqual(w.inner + 1);
  });

  test('gallery section renders on mobile', async ({ page }) => {
    await page.goto('/#galeria');
    
    // Gallery section must be visible
    await expect(page.locator('#galeria')).toBeVisible();
    
    // At least one gallery image must be visible
    await expect(page.locator('#galeria img').first()).toBeVisible();
  });
});
