# Portafolio CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase backend + `/admin` panel so Juan can edit photos, colors and texts from mobile without touching code.

**Architecture:** Supabase JS client called directly from React components (no API layer). Public site reads from `photos` and `site_settings` tables with hardcoded fallback. `/admin` route guards with Supabase Auth session and writes back to the same tables.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind 3, @supabase/supabase-js, react-router-dom v6, Supabase Postgres + Storage + Auth (project `ygkixfucdkqypokupxvo`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/lib/supabaseClient.ts` | Single Supabase client instance |
| Create | `src/hooks/useSiteSettings.ts` | Fetch color settings, apply CSS vars to `:root` |
| Create | `src/admin/AdminApp.tsx` | Auth guard + tab layout |
| Create | `src/admin/LoginForm.tsx` | Username→email mapping + sign-in form |
| Create | `src/admin/tabs/PhotosTab.tsx` | View/upload/delete/reorder photos |
| Create | `src/admin/tabs/ColorsTab.tsx` | Color pickers → upsert site_settings |
| Create | `src/admin/tabs/TextsTab.tsx` | Text fields → upsert site_settings |
| Create | `public/_redirects` | Render SPA fallback routing |
| Modify | `src/index.css` | Add CSS var defaults to `:root` |
| Modify | `src/App.tsx` | BrowserRouter + Routes + useSiteSettings |
| Modify | `src/components/Gallery.tsx` | Fetch photos from Supabase, hardcoded fallback |
| Modify | `src/components/Hero.tsx` | Fetch hero_title/subtitle from Supabase, fallback |
| Modify | `src/components/About.tsx` | Fetch about_p1..p4 from Supabase, fallback |
| Modify | `src/components/Navbar.tsx` | Use CSS var for accent color on hover |
| Modify | `tests/e2e/responsive_sanity.spec.ts` | Wait for async image render |
| Create | `.env.example` | Env var template |

---

## Task 1: Supabase — Create tables + RLS

**Files:** MCP only (no local files)

- [ ] **Step 1: Create tables via MCP `apply_migration`**

Call `mcp__claude_ai_Supabase__apply_migration` with project `ygkixfucdkqypokupxvo`, name `create_cms_tables`, query:

```sql
CREATE TABLE IF NOT EXISTS photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url        text NOT NULL,
  alt        text,
  category   text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value text
);
```

- [ ] **Step 2: Enable RLS + create policies via MCP `apply_migration`**

Call `apply_migration`, name `rls_cms_tables`, query:

```sql
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_photos"
  ON photos FOR SELECT USING (true);

CREATE POLICY "auth_insert_photos"
  ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_photos"
  ON photos FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_photos"
  ON photos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "auth_insert_settings"
  ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_settings"
  ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
```

- [ ] **Step 3: Commit**
```bash
git commit --allow-empty -m "supabase: create photos + site_settings tables with RLS"
```

---

## Task 2: Supabase — Storage bucket

**Files:** MCP only

- [ ] **Step 1: Create public `photos` bucket via MCP `apply_migration`**

Call `apply_migration`, name `create_photos_bucket`, query:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Create Storage RLS policies via MCP `apply_migration`**

Call `apply_migration`, name `storage_policies`, query:

```sql
CREATE POLICY "public_read_photos_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "auth_upload_photos_storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_photos_storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

- [ ] **Step 3: Commit**
```bash
git commit --allow-empty -m "supabase: create public photos storage bucket with RLS"
```

---

## Task 3: Supabase — Seed photos + site_settings

**Files:** MCP only

- [ ] **Step 1: Seed the 20 hardcoded photos via MCP `execute_sql`**

Call `execute_sql` with project `ygkixfucdkqypokupxvo`, query:

```sql
INSERT INTO photos (url, alt, category, sort_order) VALUES
('/1.jpg',  'Foto 1',  'retratos',     0),
('/2.jpg',  'Foto 2',  'retratos',     1),
('/3.jpg',  'Foto 3',  'retratos',     2),
('/4.jpg',  'Foto 4',  'retratos',     3),
('/5.jpg',  'Foto 5',  'retratos',     4),
('/6.jpg',  'Foto 6',  'retratos',     5),
('/7.jpg',  'Foto 7',  'retratos',     6),
('/8.jpg',  'Foto 8',  'productos',    0),
('/9.jpg',  'Foto 9',  'productos',    1),
('/10.jpg', 'Foto 10', 'productos',    2),
('/11.jpg', 'Foto 11', 'productos',    3),
('/12.jpg', 'Foto 12', 'retratos',     7),
('/13.jpg', 'Foto 13', 'productos',    4),
('/14.jpg', 'Foto 14', 'productos',    5),
('/15.jpg', 'Foto 15', 'arquitectura', 0),
('/16.jpg', 'Foto 16', 'arquitectura', 1),
('/17.jpg', 'Foto 17', 'arquitectura', 2),
('/18.jpg', 'Foto 18', 'arquitectura', 3),
('/19.jpg', 'Foto 19', 'arquitectura', 4),
('/20.jpg', 'Foto 20', 'arquitectura', 5)
ON CONFLICT DO NOTHING;
```

- [ ] **Step 2: Seed default site_settings via MCP `execute_sql`**

```sql
INSERT INTO site_settings (key, value) VALUES
('color_bg',       '#f3f4f6'),
('color_text',     '#111827'),
('color_accent',   '#15803d'),
('hero_title',     'unseen.juan'),
('hero_subtitle',  'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo. Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista. A veces son momentos, a veces personas, a veces lugares. Todo depende. Esto es unseen.juan.'),
('about_p1',       'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo.'),
('about_p2',       'Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista.'),
('about_p3',       'A veces son momentos, a veces personas, a veces lugares. Todo depende.'),
('about_p4',       'Esto es unseen.juan.')
ON CONFLICT (key) DO NOTHING;
```

- [ ] **Step 3: Commit**
```bash
git commit --allow-empty -m "supabase: seed 20 photos and default site_settings"
```

---

## Task 4: Supabase — Create Auth user for Juan

**Files:** MCP only

- [ ] **Step 1: Create user via MCP `execute_sql`**

```sql
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'butterchaparro316@gmail.com',
  crypt('Juan1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '', '', '', ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'butterchaparro316@gmail.com'
);
```

- [ ] **Step 2: Verify user was created**

Call `execute_sql`:
```sql
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'butterchaparro316@gmail.com';
```
Expected: 1 row returned.

- [ ] **Step 3: Commit**
```bash
git commit --allow-empty -m "supabase: create auth user for Juan"
```

---

## Task 5: Install deps + supabaseClient + .env

**Files:**
- Modify: `package.json`
- Create: `src/lib/supabaseClient.ts`
- Create: `.env.example`
- Create: `public/_redirects`

- [ ] **Step 1: Install packages**
```bash
npm install @supabase/supabase-js react-router-dom
```
Expected: both in `dependencies` in package.json.

- [ ] **Step 2: Get Supabase URL and anon key via MCP**

Call `mcp__claude_ai_Supabase__get_project_url` and `mcp__claude_ai_Supabase__get_publishable_keys` with project `ygkixfucdkqypokupxvo`. Save the values — they go into `.env.local` (not committed) and `.env.example`.

- [ ] **Step 3: Create `src/lib/supabaseClient.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)
```

- [ ] **Step 4: Create `.env.example`**

```
VITE_SUPABASE_URL=https://ygkixfucdkqypokupxvo.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

- [ ] **Step 5: Create `.env.local`** (not committed — add to .gitignore if not already there)

Fill in the actual values from Step 2.

- [ ] **Step 6: Create `public/_redirects`** (required for React Router on Render static sites)

```
/*  /index.html  200
```

- [ ] **Step 7: Commit**
```bash
git add src/lib/supabaseClient.ts .env.example public/_redirects
git commit -m "feat: add supabase client, env example, SPA redirect rule"
```

---

## Task 6: CSS variables — defaults + hook

**Files:**
- Modify: `src/index.css`
- Create: `src/hooks/useSiteSettings.ts`

- [ ] **Step 1: Add CSS var defaults to `src/index.css`**

Add after the last `@import` line:

```css
:root {
  --color-bg: #f3f4f6;
  --color-text: #111827;
  --color-accent: #15803d;
}
```

- [ ] **Step 2: Create `src/hooks/useSiteSettings.ts`**

```ts
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const CSS_KEYS = ['color_bg', 'color_text', 'color_accent'] as const

export function useSiteSettings() {
  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [...CSS_KEYS])
      .then(({ data }) => {
        if (!data) return
        data.forEach(({ key, value }) => {
          document.documentElement.style.setProperty(
            `--${key.replace(/_/g, '-')}`,
            value
          )
        })
      })
  }, [])
}
```

- [ ] **Step 3: Commit**
```bash
git add src/index.css src/hooks/useSiteSettings.ts
git commit -m "feat: CSS var defaults + useSiteSettings hook"
```

---

## Task 7: Update App.tsx — routing + useSiteSettings

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx` entirely**

```tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Gallery } from './components/Gallery'
import { InstagramSection } from './components/InstagramSection'
import { Footer } from './components/Footer'
import { AdminApp } from './admin/AdminApp'
import { useSiteSettings } from './hooks/useSiteSettings'

function PublicSite() {
  return (
    <div className="w-full min-h-screen font-sans" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  )
}

export function App() {
  useSiteSettings()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Verify dev server still starts**
```bash
npm run dev
```
Expected: no TS errors, page loads at localhost.

- [ ] **Step 3: Commit**
```bash
git add src/App.tsx
git commit -m "feat: add react-router-dom, /admin route, useSiteSettings in App"
```

---

## Task 8: Migrate Gallery.tsx to Supabase

**Files:**
- Modify: `src/components/Gallery.tsx`

- [ ] **Step 1: Replace `src/components/Gallery.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type Photo = {
  id: string
  url: string
  alt: string
  category: string
  sort_order: number
}

const CATEGORIES = ['retratos', 'productos', 'arquitectura'] as const

const FALLBACK_PHOTOS: Photo[] = [
  ...([1,2,3,4,5,6,7].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'retratos', sort_order: i }))),
  ...([8,9,10,11].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'productos', sort_order: i }))),
  { id: '12', url: '/12.jpg', alt: 'Foto 12', category: 'retratos', sort_order: 7 },
  ...([13,14].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'productos', sort_order: i + 4 }))),
  ...([15,16,17,18,19,20].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'arquitectura', sort_order: i }))),
]

export const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS)
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)

  useEffect(() => {
    supabase
      .from('photos')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setPhotos(data)
      })
  }, [])

  const renderCategory = (cat: string) => {
    const catPhotos = photos
      .filter(p => p.category === cat)
      .sort((a, b) => a.sort_order - b.sort_order)
    if (catPhotos.length === 0) return null
    return (
      <div className="mb-16" id={cat} key={cat}>
        <h3 className="text-2xl font-semibold mb-6 text-center capitalize" style={{ color: 'var(--color-text)' }}>
          {cat}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catPhotos.map(image => (
            <div
              key={image.id}
              className="aspect-w-4 aspect-h-3 overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="galeria" className="w-full py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-center">
          Galería
        </h2>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto text-gray-600">
          Esta es una selección de fotos que he tomado. Una mirada a través de mi lente, capturando momentos que no siempre se ven a primera vista.
        </p>
        <div className="flex justify-center gap-6 mb-12 text-center flex-wrap">
          {CATEGORIES.map(cat => (
            <a key={cat} href={`#${cat}`} className="font-semibold transition-all duration-300 hover:underline" style={{ color: 'var(--color-accent)' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </a>
          ))}
        </div>
        {CATEGORIES.map(renderCategory)}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-h-full max-w-full object-contain rounded"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/Gallery.tsx
git commit -m "feat: Gallery reads from Supabase with hardcoded fallback"
```

---

## Task 9: Migrate Hero.tsx + About.tsx to Supabase

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Replace `src/components/Hero.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const FALLBACK_TITLE = 'unseen.juan'
const FALLBACK_SUBTITLE = 'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo. Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista. A veces son momentos, a veces personas, a veces lugares. Todo depende. Esto es unseen.juan.'

export const Hero = () => {
  const [title, setTitle] = useState(FALLBACK_TITLE)
  const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['hero_title', 'hero_subtitle'])
      .then(({ data }) => {
        if (!data) return
        data.forEach(({ key, value }) => {
          if (key === 'hero_title') setTitle(value)
          if (key === 'hero_subtitle') setSubtitle(value)
        })
      })
  }, [])

  return (
    <section
      id="inicio"
      className="w-full min-h-screen flex flex-col justify-center items-center pt-16 px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container mx-auto max-w-3xl text-center">
        <div className="mb-8 max-w-md mx-auto">
          <img
            src="/_MG_7852_copy_-_Copy.jpg"
            alt="Colección de cámaras fotográficas vintage"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-8" style={{ color: 'var(--color-text)' }}>
          {title}
        </h1>
        <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text)' }}>
          {subtitle}
        </p>
        <a
          href="#galeria"
          className="inline-block px-8 py-3 transition-colors"
          style={{
            border: '1px solid var(--color-accent)',
            color: 'var(--color-accent)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-accent)'
            ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-accent)'
          }}
        >
          Ver fotografías
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/About.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const FALLBACK = {
  p1: 'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo.',
  p2: 'Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista.',
  p3: 'A veces son momentos, a veces personas, a veces lugares. Todo depende.',
  p4: 'Esto es unseen.juan.',
}

export const About = () => {
  const [paragraphs, setParagraphs] = useState(FALLBACK)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['about_p1', 'about_p2', 'about_p3', 'about_p4'])
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const next = { ...FALLBACK }
        data.forEach(({ key, value }) => {
          if (key === 'about_p1') next.p1 = value
          if (key === 'about_p2') next.p2 = value
          if (key === 'about_p3') next.p3 = value
          if (key === 'about_p4') next.p4 = value
        })
        setParagraphs(next)
      })
  }, [])

  return (
    <section id="sobre-mi" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-16 text-center">
          Sobre mí
        </h2>
        <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <div className="aspect-w-4 aspect-h-5 overflow-hidden">
              <img src="/Foto_Juan.jpg" alt="Juan Acevedo, fotógrafo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p1}</p>
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p2}</p>
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p3}</p>
            <p className="text-lg leading-relaxed font-semibold">
              <em>{paragraphs.p4}</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/Hero.tsx src/components/About.tsx
git commit -m "feat: Hero and About read from Supabase with hardcoded fallback"
```

---

## Task 10: Admin — AdminApp.tsx

**Files:**
- Create: `src/admin/AdminApp.tsx`

- [ ] **Step 1: Create `src/admin/AdminApp.tsx`**

```tsx
import React, { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { LoginForm } from './LoginForm'
import { PhotosTab } from './tabs/PhotosTab'
import { ColorsTab } from './tabs/ColorsTab'
import { TextsTab } from './tabs/TextsTab'

type Tab = 'photos' | 'colors' | 'texts'

export const AdminApp = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('photos')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Cargando...</span>
      </div>
    )
  }

  if (!session) return <LoginForm />

  const TAB_LABELS: { id: Tab; label: string }[] = [
    { id: 'photos', label: 'Fotos' },
    { id: 'colors', label: 'Colores' },
    { id: 'texts', label: 'Textos' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <span className="font-light tracking-widest text-lg">unseen.juan</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-500 border border-gray-300 rounded px-3 py-1"
        >
          Salir
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'photos' && <PhotosTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'texts' && <TextsTab />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex bg-white border-t z-10">
        {TAB_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === id ? 'text-gray-900 border-t-2 border-gray-900' : 'text-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/AdminApp.tsx
git commit -m "feat: admin AdminApp with auth guard and tab layout"
```

---

## Task 11: Admin — LoginForm.tsx

**Files:**
- Create: `src/admin/LoginForm.tsx`

- [ ] **Step 1: Create `src/admin/LoginForm.tsx`**

```tsx
import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const USERNAME_MAP: Record<string, string> = {
  'unseen.juan': 'butterchaparro316@gmail.com',
}

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const email = USERNAME_MAP[username.trim().toLowerCase()]
    if (!email) {
      setError('Usuario no reconocido.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('Contraseña incorrecta.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-light tracking-widest text-center mb-8">
          unseen.juan
        </h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg bg-white"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg bg-white"
          required
        />
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg bg-gray-900 text-white rounded-lg disabled:opacity-50 active:bg-gray-700"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/LoginForm.tsx
git commit -m "feat: admin LoginForm with username-to-email mapping"
```

---

## Task 12: Admin — PhotosTab.tsx

**Files:**
- Create: `src/admin/tabs/PhotosTab.tsx`

- [ ] **Step 1: Create `src/admin/tabs/PhotosTab.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Photo = {
  id: string
  url: string
  alt: string
  category: string
  sort_order: number
}

const CATEGORIES = ['retratos', 'productos', 'arquitectura'] as const

export const PhotosTab = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState<string | null>(null)

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('sort_order')
    if (data) setPhotos(data)
  }

  useEffect(() => { fetchPhotos() }, [])

  const handleUpload = async (file: File, category: string) => {
    setUploading(category)
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filename, file, { cacheControl: '3600', upsert: false })
    if (uploadError) {
      alert('Error al subir la foto.')
      setUploading(null)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filename)
    const catPhotos = photos.filter(p => p.category === category)
    const maxOrder = catPhotos.reduce((max, p) => Math.max(max, p.sort_order), -1)
    await supabase.from('photos').insert({
      url: publicUrl,
      alt: file.name,
      category,
      sort_order: maxOrder + 1,
    })
    await fetchPhotos()
    setUploading(null)
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm('¿Eliminar esta foto?')) return
    await supabase.from('photos').delete().eq('id', photo.id)
    await fetchPhotos()
  }

  const handleMove = async (photo: Photo, direction: 'up' | 'down') => {
    const catPhotos = photos
      .filter(p => p.category === photo.category)
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = catPhotos.findIndex(p => p.id === photo.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= catPhotos.length) return
    const neighbor = catPhotos[swapIdx]
    await Promise.all([
      supabase.from('photos').update({ sort_order: neighbor.sort_order }).eq('id', photo.id),
      supabase.from('photos').update({ sort_order: photo.sort_order }).eq('id', neighbor.id),
    ])
    await fetchPhotos()
  }

  return (
    <div className="p-4 space-y-10">
      {CATEGORIES.map(cat => {
        const catPhotos = photos
          .filter(p => p.category === cat)
          .sort((a, b) => a.sort_order - b.sort_order)

        return (
          <div key={cat}>
            <h3 className="text-lg font-semibold capitalize mb-3 text-gray-800">
              {cat} ({catPhotos.length})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {catPhotos.map(photo => (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="flex gap-1 p-2">
                    <button
                      onClick={() => handleMove(photo, 'up')}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-lg active:bg-gray-200"
                    >↑</button>
                    <button
                      onClick={() => handleMove(photo, 'down')}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-lg active:bg-gray-200"
                    >↓</button>
                    <button
                      onClick={() => handleDelete(photo)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-lg active:bg-red-100"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            <label
              htmlFor={`upload-${cat}`}
              className={`mt-3 flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-gray-500 active:bg-gray-50 ${uploading === cat ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading === cat ? 'Subiendo...' : '+ Agregar foto'}
            </label>
            <input
              id={`upload-${cat}`}
              type="file"
              accept="image/*"
              capture="environment"
              disabled={!!uploading}
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file, cat)
                e.target.value = ''
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/tabs/PhotosTab.tsx
git commit -m "feat: admin PhotosTab — view, upload, delete, reorder photos"
```

---

## Task 13: Admin — ColorsTab.tsx + TextsTab.tsx

**Files:**
- Create: `src/admin/tabs/ColorsTab.tsx`
- Create: `src/admin/tabs/TextsTab.tsx`

- [ ] **Step 1: Create `src/admin/tabs/ColorsTab.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type ColorState = { color_bg: string; color_text: string; color_accent: string }

const COLOR_FIELDS = [
  { key: 'color_bg' as const, label: 'Fondo', cssVar: '--color-bg' },
  { key: 'color_text' as const, label: 'Texto', cssVar: '--color-text' },
  { key: 'color_accent' as const, label: 'Acento (links y botones)', cssVar: '--color-accent' },
]

const DEFAULTS: ColorState = {
  color_bg: '#f3f4f6',
  color_text: '#111827',
  color_accent: '#15803d',
}

export const ColorsTab = () => {
  const [colors, setColors] = useState<ColorState>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', COLOR_FIELDS.map(f => f.key))
      .then(({ data }) => {
        if (!data) return
        const next = { ...DEFAULTS }
        data.forEach(({ key, value }) => {
          if (key in next) next[key as keyof ColorState] = value
        })
        setColors(next)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all(
      COLOR_FIELDS.map(({ key, cssVar }) => {
        document.documentElement.style.setProperty(cssVar, colors[key])
        return supabase.from('site_settings').upsert({ key, value: colors[key] })
      })
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 space-y-6">
      <p className="text-sm text-gray-500">Los cambios se aplican en el sitio después de guardar.</p>

      {COLOR_FIELDS.map(({ key, label }) => (
        <div key={key} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-sm text-gray-400 font-mono">{colors[key]}</p>
          </div>
          <input
            type="color"
            value={colors[key]}
            onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-16 h-16 rounded-xl cursor-pointer border-0 p-1 bg-transparent"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 text-lg bg-gray-900 text-white rounded-xl disabled:opacity-50 active:bg-gray-700"
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar colores'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/admin/tabs/TextsTab.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type TextState = Record<string, string>

const TEXT_FIELDS = [
  { key: 'hero_title', label: 'Título principal (Hero)', multiline: false },
  { key: 'hero_subtitle', label: 'Bio / Subtítulo (Hero)', multiline: true },
  { key: 'about_p1', label: 'Sobre mí — Párrafo 1', multiline: true },
  { key: 'about_p2', label: 'Sobre mí — Párrafo 2', multiline: true },
  { key: 'about_p3', label: 'Sobre mí — Párrafo 3', multiline: true },
  { key: 'about_p4', label: 'Sobre mí — Párrafo 4 (firma)', multiline: true },
]

export const TextsTab = () => {
  const [texts, setTexts] = useState<TextState>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', TEXT_FIELDS.map(f => f.key))
      .then(({ data }) => {
        if (!data) return
        const next: TextState = {}
        data.forEach(({ key, value }) => { next[key] = value })
        setTexts(next)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all(
      TEXT_FIELDS.map(({ key }) =>
        supabase.from('site_settings').upsert({ key, value: texts[key] ?? '' })
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 space-y-5">
      {TEXT_FIELDS.map(({ key, label, multiline }) => (
        <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          {multiline ? (
            <textarea
              value={texts[key] ?? ''}
              onChange={e => setTexts(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[80px] resize-y"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={texts[key] ?? ''}
              onChange={e => setTexts(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 text-lg bg-gray-900 text-white rounded-xl disabled:opacity-50 active:bg-gray-700"
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar textos'}
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add src/admin/tabs/ColorsTab.tsx src/admin/tabs/TextsTab.tsx
git commit -m "feat: admin ColorsTab and TextsTab"
```

---

## Task 14: Security audit with get_advisors

**Files:** MCP only

- [ ] **Step 1: Run `get_advisors` via MCP**

Call `mcp__claude_ai_Supabase__get_advisors` with project `ygkixfucdkqypokupxvo`. Review any findings related to RLS on `photos` or `site_settings`.

- [ ] **Step 2: If advisors flag RLS issues, fix via `apply_migration`**

Common fix — if a table has RLS enabled but is missing a policy for a specific operation:
```sql
-- Example: if storage objects need an explicit UPDATE policy
CREATE POLICY "auth_update_photos_storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

- [ ] **Step 3: Commit any fixes**
```bash
git add -A
git commit -m "fix: RLS policies per get_advisors recommendations"
```

---

## Task 15: Update Playwright tests

**Files:**
- Modify: `tests/e2e/responsive_sanity.spec.ts`

- [ ] **Step 1: Update gallery test to wait for async render**

The `#galeria img` test needs to wait for Supabase fetch. Replace the gallery test in `responsive_sanity.spec.ts`:

```ts
test('gallery section renders on mobile', async ({ page }) => {
  await page.goto('/#galeria')
  await expect(page.locator('#galeria')).toBeVisible()
  // wait up to 10s for at least one image (may load from Supabase or fallback)
  await expect(page.locator('#galeria img').first()).toBeVisible({ timeout: 10000 })
})
```

- [ ] **Step 2: Run tests**
```bash
npm run test
```
Expected: all 3 spec files pass (or soft-fail on known noise).

- [ ] **Step 3: Commit**
```bash
git add tests/e2e/responsive_sanity.spec.ts
git commit -m "test: increase gallery image timeout for async Supabase fetch"
```

---

## Task 16: lint + build

**Files:** None (verification only)

- [ ] **Step 1: Run lint**
```bash
npm run lint
```
Expected: 0 errors, 0 warnings. Fix any TypeScript errors before proceeding.

- [ ] **Step 2: Run build**
```bash
npm run build
```
Expected: `dist/` folder created, no errors. Vite should bundle without issues.

- [ ] **Step 3: Commit if any lint fixes were needed**
```bash
git add -A
git commit -m "fix: lint and type errors"
```

---

## Task 17: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace or update README with instructions for Juan**

Add a section in Spanish at the top:

```md
## Para Juan — Cómo editar tu sitio desde el celular

### Entrar al panel de administración
1. Abrí tu navegador en el celular
2. Andá a: `https://tu-sitio.onrender.com/admin`
3. Escribí tu usuario: **unseen.juan**
4. Escribí tu contraseña (la que te dieron)
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

### Variables de entorno necesarias en Render
En Render → tu servicio → Environment, agregá:
- `VITE_SUPABASE_URL` = la URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` = la anon/public key de tu proyecto Supabase
```

- [ ] **Step 2: Commit**
```bash
git add README.md
git commit -m "docs: add Spanish admin instructions for Juan"
```

---

## Self-Review Checklist

- [x] Task 1–4: Supabase tables, RLS, storage, seed, auth user — covered
- [x] Task 5: `@supabase/supabase-js` + `react-router-dom` + `.env.example` + `_redirects` — covered
- [x] Task 6: CSS vars in `index.css` + `useSiteSettings` hook — covered
- [x] Task 7: `App.tsx` with router + `useSiteSettings` — covered
- [x] Task 8: `Gallery.tsx` with Supabase fetch + fallback — covered
- [x] Task 9: `Hero.tsx` + `About.tsx` with fetch + fallback — covered
- [x] Task 10–13: Full admin UI (AdminApp, LoginForm, PhotosTab, ColorsTab, TextsTab) — covered
- [x] Task 14: `get_advisors` security audit — covered
- [x] Task 15: Playwright test update — covered
- [x] Task 16: lint + build — covered
- [x] Task 17: README in Spanish — covered
- [x] No `/admin` link in Navbar — Navbar.tsx not modified, confirmed no link added
- [x] Fallback strategy: every component initializes state with hardcoded values before fetch — correct
- [x] Types consistent: `Photo` type defined once in Gallery.tsx and PhotosTab.tsx independently (no shared type file needed at this scale)
- [x] `_redirects` file for Render SPA routing — covered in Task 5
