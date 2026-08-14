# Diseño: Portafolio de Juan — CMS con Supabase

**Fecha:** 2026-08-13  
**Estado:** Aprobado por el usuario  
**Stack:** React 18 + TypeScript + Vite + Tailwind 3 + Supabase JS  
**Deploy:** Render (auto-deploy desde `main`)

---

## 1. Objetivo

Convertir el portafolio de fotografía estático en un sitio editable por el dueño (Juan) desde el celular, sin tocar código. Juan puede:

- Subir, eliminar y reordenar fotos por categoría
- Cambiar los colores del sitio (fondo, texto, acento)
- Editar textos del Hero y la sección About

---

## 2. Infraestructura Supabase

**Proyecto existente:** "Portafolio De Juan"  
- ID: `ygkixfucdkqypokupxvo`  
- Región: `ca-central-1`  
- Estado: `ACTIVE_HEALTHY`  
- No se crea un proyecto nuevo.

### 2.1 Tablas

**`photos`**
```sql
CREATE TABLE photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text NOT NULL,
  alt         text,
  category    text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

**`site_settings`**
```sql
CREATE TABLE site_settings (
  key   text PRIMARY KEY,
  value text
);
```

### 2.2 Seed inicial

**Fotos** — las 20 fotos actuales de `/public`, con sus categorías según `Gallery.tsx`:

| IDs | category |
|-----|----------|
| 1–7, 12 | retratos |
| 8–11, 13–14 | productos |
| 15–20 | arquitectura |

URLs como `/1.jpg` (rutas relativas al public del front, funcionan en Render).

**site_settings** — valores por defecto que replican el estilo actual:

| key | value |
|-----|-------|
| color_bg | #f3f4f6 |
| color_text | #111827 |
| color_accent | #15803d |
| hero_title | unseen.juan |
| hero_subtitle | Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo. Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista. A veces son momentos, a veces personas, a veces lugares. Todo depende. Esto es unseen.juan. |
| about_p1 | Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo. |
| about_p2 | Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista. |
| about_p3 | A veces son momentos, a veces personas, a veces lugares. Todo depende. |
| about_p4 | Esto es unseen.juan. |

### 2.3 Storage

- Bucket: `photos`
- Acceso público para lectura (anonymous GET)
- Las fotos nuevas subidas desde `/admin` se almacenan aquí; su URL pública se guarda en `photos.url`

### 2.4 RLS (Row Level Security)

```sql
-- photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_photos" ON photos FOR SELECT USING (true);
CREATE POLICY "auth_write_photos" ON photos FOR ALL USING (auth.role() = 'authenticated');

-- site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "auth_write_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
```

### 2.5 Auth

- **Email:** `butterchaparro316@gmail.com`
- **Contraseña:** `Juan1234`
- El formulario de login acepta **username** (`unseen.juan`) + contraseña
- El frontend mapea: si el valor del campo es `"unseen.juan"`, usa el email real para llamar a `supabase.auth.signInWithPassword()`
- Esta es lógica puramente de frontend (no hay tabla de usuarios custom)

---

## 3. Cambios en el frontend

### 3.1 Nuevos archivos

```
src/lib/supabaseClient.ts          ← instancia global de Supabase JS
src/hooks/useSiteSettings.ts       ← fetch site_settings + setea CSS vars
src/admin/AdminApp.tsx             ← layout tabs + guard de auth
src/admin/LoginForm.tsx            ← formulario username + password
src/admin/tabs/PhotosTab.tsx       ← gestión de fotos
src/admin/tabs/ColorsTab.tsx       ← color pickers
src/admin/tabs/TextsTab.tsx        ← edición de textos
```

### 3.2 Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `package.json` | +`@supabase/supabase-js`, +`react-router-dom` |
| `src/App.tsx` | Wrappear en `<BrowserRouter>`, agregar ruta `/admin`, llamar `useSiteSettings` al montar |
| `src/components/Gallery.tsx` | Fetch `photos` de Supabase; fallback al array hardcodeado si falla |
| `src/components/Hero.tsx` | Leer `hero_title` y `hero_subtitle` de `site_settings`; fallback al contenido actual |
| `src/components/About.tsx` | Leer `about_p1..p4` de `site_settings`; fallback a párrafos actuales |
| Componentes themables | Reemplazar clases fijas de color por `bg-[var(--color-bg)]`, `text-[var(--color-text)]`, `border-[var(--color-accent)]`, etc. |
| `.env.example` | `VITE_SUPABASE_URL=` y `VITE_SUPABASE_ANON_KEY=` |
| `README.md` | Instrucciones en español para Juan |

### 3.3 CSS Variables

`useSiteSettings` hace fetch de `site_settings` al montar y aplica:

```ts
document.documentElement.style.setProperty('--color-bg', value_of_color_bg)
document.documentElement.style.setProperty('--color-text', value_of_color_text)
document.documentElement.style.setProperty('--color-accent', value_of_color_accent)
```

Los componentes themables (Hero fondo, Navbar, botones de acento, links) usan clases Tailwind arbitrarias:
- `bg-[var(--color-bg)]`
- `text-[var(--color-text)]`
- `text-[var(--color-accent)]`
- `border-[var(--color-accent)]`

---

## 4. Admin UI (`/admin`)

**No hay link en el Navbar.** Juan accede directamente a `https://su-sitio.onrender.com/admin`.

### Login

- Campo: **Usuario** (placeholder "unseen.juan")
- Campo: **Contraseña**
- Botón grande: "Entrar"
- Si el usuario no coincide con el alias conocido → mensaje de error claro

### Layout post-login

- Header con nombre del sitio + botón "Cerrar sesión"
- Tabs fijas en la parte inferior (navegación con el pulgar): **Fotos | Colores | Textos**

### Tab Fotos

- Grid de 2 columnas por categoría (Retratos / Productos / Arquitectura)
- Cada foto: thumbnail + botón rojo "Eliminar" (con confirmación)
- Botones "↑" / "↓" para cambiar `sort_order` dentro de la categoría
- Botón "+ Agregar foto" al final de cada categoría → `<input type="file" accept="image/*" capture="environment">` (abre cámara o galería en móvil)
- Al seleccionar archivo: upload a Supabase Storage → insertar fila en `photos`

### Tab Colores

- 3 bloques: Fondo, Texto, Acento
- Cada bloque: label + `<input type="color">` nativo + preview del valor hex
- Preview en vivo del color seleccionado
- Botón grande "Guardar colores" → upsert en `site_settings`

### Tab Textos

- Campo "Título del Hero" (hero_title)
- Textarea "Subtítulo / Bio del Hero" (hero_subtitle)
- Textareas para "Párrafo 1..4" (about_p1..p4)
- Botón grande "Guardar textos" → upsert en `site_settings`

---

## 5. Routing

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<PublicSite />} />
    <Route path="/admin/*" element={<AdminApp />} />
  </Routes>
</BrowserRouter>
```

`<AdminApp>` maneja internamente el guard de autenticación: si no hay sesión activa, muestra `<LoginForm>`; si hay sesión, muestra el panel con tabs.

---

## 6. Fallback strategy

Si `supabase.from('photos').select()` falla (sin internet, servicio caído, etc.):
- `Gallery.tsx` renderiza el array hardcodeado (`allPhotos` / `photoCategories` actuales)
- `Hero.tsx` renderiza los textos hardcodeados actuales
- `About.tsx` renderiza los párrafos hardcodeados actuales
- Los CSS vars quedan con los valores por defecto ya seteados en `:root` en `index.css`

El sitio **nunca queda en blanco**.

---

## 7. Variables de entorno

```
VITE_SUPABASE_URL=https://ygkixfucdkqypokupxvo.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key del MCP>
```

Agregar en Render → Environment → las mismas dos variables para que el build de producción funcione.

---

## 8. Orden de commits

1. `supabase: create tables, RLS, storage bucket, seed data, auth user`
2. `deps: add supabase-js and react-router-dom`
3. `feat: add supabaseClient, useSiteSettings hook, CSS vars`
4. `feat: migrate Gallery to Supabase with hardcoded fallback`
5. `feat: migrate Hero and About to Supabase with fallback`
6. `feat: add /admin route with LoginForm`
7. `feat: admin PhotosTab — view, upload, delete, reorder`
8. `feat: admin ColorsTab and TextsTab`
9. `style: replace fixed Tailwind color classes with CSS vars`
10. `fix: update Playwright tests for dynamic content`
11. `docs: update README with Juan's instructions`

---

## 9. Checklist de verificación final

- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin warnings
- [ ] `get_advisors` del MCP no reporta problemas de RLS
- [ ] Login con `unseen.juan` / `Juan1234` funciona en `/admin`
- [ ] Subir una foto desde móvil aparece en la galería pública
- [ ] Cambiar un color en Admin se refleja en el sitio al recargar
- [ ] Editar un texto en Admin se refleja en Hero/About al recargar
- [ ] Si se desactiva Supabase, el sitio muestra el contenido fallback
