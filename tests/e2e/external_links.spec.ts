import { test, expect } from '@playwright/test';

/**
 * External Links Health Tests
 * Ensures external links are properly configured and not broken
 */
test.describe('External Links Health', () => {

  test('all external links open in a new tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href^="http"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
    }
  });

  test('Instagram link has proper security attributes (soft)', async ({ page }) => {
    await page.goto('/');
    const ig = page.locator('a[href*="instagram.com"]').first();
    if (await ig.count() === 0) test.skip('No Instagram link found');

    await expect(ig).toHaveAttribute('target', '_blank');

    const rel = (await ig.getAttribute('rel'))?.toLowerCase() || '';
    const safe = rel.includes('noopener') || rel.includes('noreferrer');
    expect.soft(safe, 'Consider adding rel="noopener noreferrer" to external links.').toBeTruthy();
  });

  test('key external link is reachable (Instagram)', async ({ context, page }) => {
    await page.goto('/');
    const igHref = await page.locator('a[href*="instagram.com"]').first().getAttribute('href');
    if (!igHref) test.skip('No Instagram link found');

    const resp = await context.request.head(igHref!, { timeout: 5000, maxRedirects: 2 });
    expect(resp.ok(), `Broken Instagram link: ${igHref}`).toBeTruthy();
  });
});
