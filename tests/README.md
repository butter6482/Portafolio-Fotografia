# E2E Test Suite - Portafolio de Juan

Minimal, focused E2E test suite targeting production deployment.

---

## 🎯 Overview

**Target**: `https://portafolio-fotografia.onrender.com`  
**Framework**: Playwright  
**Tests**: 3 files, ~9 tests  
**Browsers**: Chrome Desktop + Mobile Chrome (Pixel 7)  
**Approach**: Semantic selectors, tag-based filtering, no code modifications

---

## 🚀 Quick Start

### Installation

```bash
npm install
npx playwright install
```

### Run Tests

```bash
# All tests (desktop + mobile projects)
npm test

# Interactive UI mode
npm test:ui

# Critical tests only (P0)
npm test:p0

# View HTML report
npm test:report
```

---

## 📁 Test Files

| File | Tests | Tags | Runs On |
|------|-------|------|---------|
| `smoke_nav.spec.ts` | 3 | `@p0` | Desktop |
| `external_links.spec.ts` | 3 | - | Desktop |
| `responsive_sanity.spec.ts` | 3 | `@mobile` | Mobile only |

**Total**: ~9 tests (minimal smoke suite)

---

## 🏷️ Tag System

### `@p0` Tag - Critical Tests
Tests tagged with `@p0` are critical smoke/core functionality tests.

### `@mobile` Tag - Mobile-Only Tests
Tests tagged with `@mobile` run **only on mobile** project (Pixel 7).  
All other tests run **only on desktop** project (Chrome Desktop).

**Note**: This site does NOT have:
- Hamburger/toggle menu (navbar links always visible)
- Lightbox/modal for gallery (no image popup)

---

## 🔧 Configuration

**File**: `playwright.config.ts`

- **Base URL**: `https://portafolio-fotografia.onrender.com`
- **Timeout**: 30s per test
- **Retries**: 2 in CI, 0 locally
- **Artifacts**: Traces & videos only on failure
- **Projects**:
  - `chromium-desktop` - Runs all tests **except** `@mobile`
  - `mobile-chrome` - Runs **only** `@mobile` tests

---

## 🎯 What This Suite Tests

### ✅ Desktop Tests (chromium-desktop)

**Smoke & Navigation** (3 tests) - `@p0`
- Page loads without real errors (ignores harmless favicon/CSP/IG widget noise)
- Brand text "unseen.juan" is visible (in header link)
- Navigation to #galeria works
- Navigation to #sobre-mi works

**External Links** (3 tests)
- All external links have `target="_blank"`
- Instagram link has proper security attributes (soft check)
- Instagram link is reachable (HEAD request)

### ✅ Mobile Tests (mobile-chrome) - Tagged `@mobile`

**Responsive Sanity** (3 tests)
- Brand text and all navbar links visible (no toggle menu)
- No horizontal overflow
- Gallery renders properly

---

## 💻 Commands

```bash
# Run all tests (both projects)
npm test

# Interactive mode
npm test:ui

# Critical tests only (@p0)
npm test:p0

# View last test report
npm test:report

# Run only desktop tests
npx playwright test --project=chromium-desktop

# Run only mobile tests
npx playwright test --project=mobile-chrome

# Custom URL
BASE_URL=https://your-url.com npm test
```

---

## 🌐 Site Structure

### Brand
- **Text**: "unseen.juan" (not an image)
- **Location**: Link inside `<header>`
- Always visible in navbar

### Navigation
- **Links**: Inicio, Sobre mí, Galería, Instagram
- **Always visible** - no hamburger/toggle menu
- Works on desktop and mobile

### Sections
- `#inicio` - Hero section
- `#sobre-mi` - About section
- `#galeria` - Photo gallery (NO lightbox)
- `#instagram` - Instagram embed section

### External Links
- Instagram profile link
- Opens in new tab with security attributes

### What This Site Does NOT Have
- ❌ Lightbox/modal for gallery images
- ❌ Hamburger/toggle menu on mobile
- ❌ Logo image (brand is text)

---

## 📊 Test Execution Flow

When you run `npm test`:

```
Desktop (chromium-desktop)
├── ✅ smoke_nav.spec.ts (3 tests) [@p0]
└── ✅ external_links.spec.ts (3 tests)
Total: 6 tests

Mobile (mobile-chrome)
└── ✅ responsive_sanity.spec.ts (3 tests) [@mobile]
Total: 3 tests

Grand Total: 9 tests across 2 projects
```

---

## 🐛 Troubleshooting

### Tests Failing?

```bash
# Run with visible browser
npx playwright test --headed

# Debug step by step
npx playwright test --debug smoke_nav
```

### Common Issues

**"Brand not visible"**
- Brand is text "unseen.juan" in a header link
- Selector: `page.locator('header a', { hasText: /unseen\.juan/i })`

**"Console errors"**
- Harmless errors (favicon, CSP, IG widgets) are filtered
- Only real errors fail the test

---

## 📊 CI/CD Integration

Already configured in `.github/workflows/playwright.yml`

```yaml
- run: npm test
  env:
    BASE_URL: https://portafolio-fotografia.onrender.com
```

---

## 🎓 Key Differences from Typical Sites

### No Lightbox
This site **does not** have a lightbox/modal for gallery images. Clicking images does not open a popup. That's why there are no lightbox tests.

### No Hamburger Menu
This site **does not** have a mobile hamburger/toggle menu. Navbar links are always visible on all screen sizes. That's why there are no mobile menu tests.

### Brand is Text in Header Link
The brand "unseen.juan" is plain text inside a link in the header. Tests use:
```typescript
page.locator('header a', { hasText: /unseen\.juan/i })
```

### Filtered Console Errors
Common harmless errors (favicon 404, CSP warnings, Instagram widget noise) are filtered out. Only real errors fail the smoke test.

### Soft Security Check
Instagram `rel` attribute check is soft - it warns but doesn't fail the test.

---

## 🎯 When to Run

### Pre-Deploy
```bash
npm test:p0  # Quick critical checks (3 tests)
```

### Post-Deploy
```bash
npm test  # Full suite against production (9 tests)
```

### Development
```bash
npm test:ui  # Interactive mode
```

---

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Test Selectors](https://playwright.dev/docs/selectors)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Minimal suite ready to run against production! 🚀**

Run: `npm test`
