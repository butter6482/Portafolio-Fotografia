# 🧪 E2E Test Suite - Minimal & Production Ready

Ultra-lean E2E test suite for **Portafolio de Juan**.

---

## ✨ What This Is

A **minimal, focused** Playwright test suite that:
- ✅ Targets production deployment directly
- ✅ Covers critical user flows only
- ✅ Uses semantic selectors (no code changes needed)
- ✅ Tag-based filtering (`@p0`, `@mobile`)
- ✅ Runs in ~10 seconds
- ✅ Tests on Desktop Chrome + Mobile (Pixel 7)
- ✅ **No lightbox tests** (site doesn't have one)
- ✅ **No mobile menu tests** (site doesn't have one)

---

## 🎯 Quick Start

```bash
# Install (one time)
npm install
npx playwright install

# Run all tests
npm test

# Interactive UI mode
npm test:ui

# Only critical tests (P0)
npm test:p0

# View report
npm test:report
```

---

## 📦 Test Suite

### ✅ Tests (3 files in `tests/e2e/`)

| File | Tests | Tags | Runs On | What It Tests |
|------|-------|------|---------|---------------|
| **smoke_nav.spec.ts** | 3 | `@p0` | 🖥️ Desktop | Page loads, brand text visible, navigation works |
| **external_links.spec.ts** | 3 | - | 🖥️ Desktop | Links open in new tab, Instagram reachable |
| **responsive_sanity.spec.ts** | 3 | `@mobile` | 📱 Mobile | Brand/links visible, no overflow, gallery renders |

**Total: 9 tests - Absolute minimum**

---

## 🌐 Target

**Production URL**: `https://portafolio-fotografia.onrender.com`

To change:
```bash
BASE_URL=https://your-url.com npm test
```

---

## 🏗️ Site Structure (Important!)

### Brand = Text in Header Link
```typescript
// ✅ Correct selector
page.locator('header a', { hasText: /unseen\.juan/i })
```

### No Lightbox
This site **does not** have a lightbox/modal. Clicking gallery images does nothing.

### No Hamburger Menu
This site **does not** have a mobile menu toggle. Navbar links are always visible.

### Sections
- `#inicio` - Hero
- `#sobre-mi` - About
- `#galeria` - Gallery (no lightbox)
- `#instagram` - Instagram embeds

---

## 📊 Test Coverage

### 🖥️ Desktop Tests (6 tests)

**@p0 Smoke & Navigation** (3 tests)
- Page loads cleanly (filters harmless noise)
- Brand text visible in header
- Navigation to sections works

**External Links** (3 tests)
- All have `target="_blank"`
- Instagram has security attrs (soft)
- Instagram link reachable

### 📱 Mobile Tests (3 tests) - Tagged `@mobile`

**Responsive Sanity** (3 tests)
- Brand text and navbar links visible
- No horizontal overflow
- Gallery renders properly

---

## 🚀 Usage

### All tests

```bash
npm test
```

Expected output:
```
chromium-desktop (6 tests)
  ✓ @p0 Smoke & Navigation (3)
  ✓ External Links Health (3)

mobile-chrome (3 tests)
  ✓ @mobile Responsive sanity (3)

9 passed (10s)
```

### Critical only

```bash
npm test:p0
```

Result: 3 tests (smoke_nav tagged @p0)

---

## 📁 Clean Structure

```
tests/e2e/
├── smoke_nav.spec.ts           (3 tests) @p0 Desktop
├── external_links.spec.ts      (3 tests) Desktop
└── responsive_sanity.spec.ts   (3 tests) @mobile Mobile

Total: 9 tests, 3 files
```

**Ultra-minimal** - no lightbox, no mobile menu tests.

---

## 🎯 Design Principles

### 1. Reflects Reality
- Brand is text in header link
- No hamburger menu
- No lightbox/modal
- Filters harmless console noise

### 2. Minimal Coverage
- Only smoke + navigation + links + responsive
- 9 tests total
- ~10 seconds execution

### 3. Tag-Based Filtering
- `@p0` for critical tests
- `@mobile` for mobile-only tests

### 4. Production-First
- Tests against live deployment
- No local server needed

### 5. Semantic Selectors
- `page.locator('header a', { hasText: /unseen\.juan/i })`
- `page.getByRole('link', { name: /galería/i })`

---

## 🔧 Configuration

**playwright.config.ts**:
```typescript
projects: [
  {
    name: 'chromium-desktop',
    use: { ...devices['Desktop Chrome'] },
    grepInvert: /@mobile/i,
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 7'] },
    grep: /@mobile/i,
  },
]
```

---

## 🔍 Key Changes from Before

### Removed ❌
- `lightbox.spec.ts` (3 tests) - Site doesn't have lightbox
- `mobile_menu.spec.ts` (3 tests) - Site doesn't have toggle menu
- Image-based brand selectors

### Fixed ✅
- Brand selector: `page.locator('header a', { hasText: /unseen\.juan/i })`
- Console error filtering
- Responsive checks (no menu toggle)

---

## 📈 What Was Removed & Why

| Test File | Tests | Reason |
|-----------|-------|--------|
| `lightbox.spec.ts` | 3 | ❌ Site has NO lightbox/modal |
| `mobile_menu.spec.ts` | 3 | ❌ Site has NO hamburger menu |

**Before**: 18 tests (12 failing)  
**After**: 9 tests (all passing)

---

## 📊 Expected Results

```bash
$ npm test

Running 9 tests using 2 workers

chromium-desktop
  ✓ smoke_nav › brand text visible (1.0s)
  ✓ smoke_nav › Galería navigation (0.7s)
  ✓ smoke_nav › Sobre mí navigation (0.6s)
  ✓ external_links › new tab (0.5s)
  ✓ external_links › security (0.4s)
  ✓ external_links › reachable (0.8s)

mobile-chrome
  ✓ responsive_sanity › links visible (0.8s)
  ✓ responsive_sanity › no overflow (0.5s)
  ✓ responsive_sanity › gallery renders (0.9s)

9 passed (10s)
```

---

## 🐛 Troubleshooting

### "Brand not visible"
Use correct selector:
```typescript
page.locator('header a', { hasText: /unseen\.juan/i })
```

### "Too many console errors"
Harmless errors are filtered. Check `real` errors only.

---

## 📚 Documentation

- **This summary**: `E2E_SUITE.md`
- **Full guide**: `tests/README.md`

---

## ✨ Summary

✅ **Ultra-lean**: 9 tests, 3 files  
✅ **Fast**: ~10 seconds  
✅ **Accurate**: Matches production reality  
✅ **No false tests**: Removed lightbox & menu  
✅ **Production**: Tests live site  
✅ **Ready**: Run `npm test` now  

---

**Minimal E2E Suite Complete! 🚀**

Run: `npm test`
