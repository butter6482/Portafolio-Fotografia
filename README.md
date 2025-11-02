Juan's Photography Portfolio

Minimalist photography portfolio showcasing work by Juan Acevedo (@unseen.juan).
Live Site: https://portafolio-fotografia.onrender.com

Overview

Responsive and modern portfolio built with React and Tailwind CSS.
Focused on clean UI, fast performance, and visual impact.

Tech Stack

React + TypeScript + Vite

Tailwind CSS

Render (Deployment)

Playwright (E2E Testing)

GitHub Actions (CI/CD)

Features

Mobile-first responsive design

Gallery by categories (Portraits, Products, Architecture)

Instagram embeds

Automated E2E tests and CI on every push

Setup
npm install
npm run dev        # Local development
npm run build      # Production build
npm run preview    # Preview build

Testing

Playwright E2E tests included.

npm test           # Run all tests
npm test:ui        # Interactive mode
npm test:report    # View test results

Structure
src/
  components/...
  App.tsx
tests/e2e/
  smoke_nav.spec.ts
  external_links.spec.ts
.github/workflows/
  playwright.yml

Deployment

Hosted on Render

Auto-deploys from main branch

CI/CD pipeline validates build and tests before deploy

Contact

Photographer: Juan Acevedo
Instagram: @unseen.juan
Location: Puerto Rico
