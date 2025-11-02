# Juan's Photography Portfolio

A minimalist photography portfolio website showcasing the work of Juan Acevedo (@unseen.juan).

**Live Site**: [https://portafolio-fotografia.onrender.com](https://portafolio-fotografia.onrender.com)

---

## Overview

This project is a modern, responsive portfolio website built with React and Tailwind CSS. The site features a clean, image-focused design with organized sections for photography display and social media integration.

---

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 5
- **Icons**: Lucide React
- **Deployment**: Render
- **Testing**: Playwright (E2E)
- **CI/CD**: GitHub Actions

---

## Features

- Responsive design optimized for all devices
- Photo gallery organized by categories (Portraits, Products, Architecture)
- Instagram integration with embedded posts
- Clean, minimal UI focused on visual content
- Smooth navigation between sections

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Testing

This project includes automated E2E tests with Playwright.

### Run Tests

```bash
npm test
```

### Interactive Test Mode

```bash
npm test:ui
```

### View Test Report

```bash
npm test:report
```

See the [tests/README.md](tests/README.md) for complete testing documentation.

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx           # About section
│   ├── Gallery.tsx         # Photo gallery
│   ├── InstagramSection.tsx # Instagram embeds
│   └── Footer.tsx          # Footer
├── App.tsx                 # Main app component
├── index.tsx               # Entry point
└── index.css               # Global styles

tests/e2e/
├── smoke_nav.spec.ts       # Smoke & navigation tests
├── external_links.spec.ts  # External links validation
└── responsive_sanity.spec.ts # Mobile responsiveness

.github/workflows/
└── playwright.yml          # CI/CD pipeline
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run E2E tests |
| `npm test:ui` | Run tests in UI mode |
| `npm test:p0` | Run critical tests only |
| `npm test:report` | View test report |

---

## CI/CD

Automated tests run on every push and pull request via GitHub Actions. Tests execute against the production deployment to ensure site reliability.

**Workflow**: `.github/workflows/playwright.yml`

---

## Deployment

The site is deployed on Render and automatically updates when changes are pushed to the main branch.

**Production URL**: [https://portafolio-fotografia.onrender.com](https://portafolio-fotografia.onrender.com)

---

## License

This portfolio was created as part of a university project. All photographs are taken by Juan Acevedo.

---

## Contact

**Photographer**: Juan Acevedo  
**Instagram**: [@unseen.juan](https://instagram.com/unseen.juan)  
**Location**: Puerto Rico
