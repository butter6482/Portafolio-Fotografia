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

    // Permite más redirecciones y trata el login de IG como "reachable" en CI
    const resp = await context.request.get(igHref!, { timeout: 8000, maxRedirects: 5 });
    const finalUrl = resp.url();
    const status = resp.status();
    const isLoginGate = /instagram\.com\/accounts\/login/i.test(finalUrl);
    const okish = (status >= 200 && status < 400) || isLoginGate;

    expect(okish, `Instagram link not reachable (status=${status}, url=${finalUrl})`).toBeTruthy();
  });
});
