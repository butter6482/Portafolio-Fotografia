Juan's Photography Portfolio

Minimalist photography portfolio showcasing work by Juan Acevedo (@unseen.juan).
Live Site: https://portafolio-fotografia.onrender.com

## Para Juan — Cómo editar tu sitio desde el celular

### Entrar al panel de administración
1. Abrí tu navegador en el celular
2. Andá a: `https://portafolio-fotografia.onrender.com/admin`
3. Escribí tu usuario: **unseen.juan**
4. Escribí tu contraseña
5. Tocá **Entrar**

### Subir o cambiar fotos
1. En el panel, tocá la pestaña **Fotos** (abajo)
2. Bajá hasta la categoría donde querés agregar una foto
3. Tocá **+ Agregar foto** — te pregunta si querés usar la cámara o la galería
4. Para eliminar una foto, tocá **✕** en la foto que querés borrar
5. Para cambiar el orden, usá las flechas **↑** y **↓**

### Cambiar los colores del sitio
1. Tocá la pestaña **Colores**
2. Tocá el cuadro de color que querés cambiar
3. Elegí el color nuevo
4. Tocá **Guardar colores**

### Editar textos (título, bio, sobre mí)
1. Tocá la pestaña **Textos**
2. Cambiá lo que necesites
3. Tocá **Guardar textos**

---

## Variables de entorno — Render

En Render → tu servicio → Environment, agregá estas dos variables para que el build de producción funcione:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Los valores los encontrás en el dashboard de Supabase → Project Settings → API.

Render hace auto-deploy desde `main` — una vez que agregues las variables, el próximo deploy ya incluye el CMS.

---

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
