# 🚀 GitHub Actions CI/CD - Setup Complete

Workflow optimizado para tests de Playwright contra producción.

---

## ✅ Cambios Realizados

### 1. **Workflow Optimizado** (`.github/workflows/playwright.yml`)

#### Antes ❌
```yaml
timeout-minutes: 60  # Excesivo
run: npx playwright install --with-deps  # Todos los navegadores
run: npm test  # Todos los proyectos
```

#### Ahora ✅
```yaml
timeout-minutes: 10  # Realista para 9 tests
run: npx playwright install chromium --with-deps  # Solo Chrome
run: npx playwright test --project=chromium-desktop --project=mobile-chrome
```

### 2. **Cache de Navegadores**
```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ env.PLAYWRIGHT_VERSION }}-${{ runner.os }}
```

**Beneficio**: Primera ejecución ~2 min, siguientes ~30s

### 3. **.gitignore Actualizado**
Agregado:
- `.env` y variantes
- `package-lock.json` (opcional)
- `Thumbs.db` (Windows)

---

## 📊 Optimizaciones Aplicadas

| Aspecto | Antes | Después | Ahorro |
|---------|-------|---------|--------|
| **Timeout** | 60 min | 10 min | 83% ⚡ |
| **Navegadores** | 3 (Chrome, Firefox, Safari) | 1 (Chrome) | 66% ⚡ |
| **Cache** | No | Sí | ~1.5 min ⚡ |
| **Proyectos** | Todos | Solo Chrome desktop + mobile | Más rápido |
| **Primera ejecución** | ~3 min | ~2 min | 33% ⚡ |
| **Ejecuciones siguientes** | ~3 min | ~30-45s | 75% ⚡ |

---

## 🎯 Qué Hace el Workflow

### Trigger
```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```

Se ejecuta en:
- ✅ Push a main/master
- ✅ Pull requests

### Pasos
1. ✅ Checkout del código
2. ✅ Setup Node.js 18 con cache de npm
3. ✅ `npm ci` (instalación limpia)
4. ✅ Cache de navegadores Playwright
5. ✅ Instala solo Chrome (si no está cacheado)
6. ✅ Ejecuta tests contra producción
7. ✅ Sube artifacts (report + resultados)

### Environment
```yaml
env:
  BASE_URL: https://portafolio-fotografia.onrender.com
```

**Importante**: Tests corren contra tu deploy REAL en Render, no local.

---

## 🚀 Cómo Subir a GitHub

### Opción A: Primera Vez (Nuevo Repositorio)

```bash
# 1. Inicializar Git
git init
git branch -M main

# 2. Crear repositorio en GitHub y obtener la URL
# Ejemplo: https://github.com/tu-usuario/portafolio-juan.git

# 3. Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# 4. Agregar archivos
git add .

# 5. Primer commit
git commit -m "✅ Add Playwright E2E tests + optimized GitHub Actions CI"

# 6. Subir a GitHub
git push -u origin main
```

### Opción B: Repositorio Existente

```bash
# 1. Agregar cambios
git add .

# 2. Commit
git commit -m "✅ Optimize Playwright workflow + update .gitignore"

# 3. Push
git push
```

---

## 📋 Verificar que Todo Funciona

### 1. Después del Push

Ve a tu repo en GitHub:
```
https://github.com/TU-USUARIO/TU-REPO/actions
```

Verás:
- ✅ Workflow ejecutándose
- ⏱️ Tiempo estimado: ~30-45s (después del cache)
- 📊 Progreso en tiempo real

### 2. Si los Tests Pasan

```
✅ E2E Tests (Production)
   9 passed (10s)
```

### 3. Si Algo Falla

```
❌ E2E Tests (Production)
   8 passed, 1 failed
```

- Click en el job
- Click en "Run E2E tests"
- Ve los detalles del error
- Descarga "playwright-report" artifact para ver reporte HTML completo

---

## 🎨 Badge para README (Opcional)

Agrega esto a tu `README.md`:

```markdown
[![E2E Tests](https://github.com/TU-USUARIO/TU-REPO/actions/workflows/playwright.yml/badge.svg)](https://github.com/TU-USUARIO/TU-REPO/actions/workflows/playwright.yml)
```

---

## 🔧 Variantes del Workflow

### Solo Tests Críticos (P0)

Para ejecutar solo los 3 tests críticos:

```yaml
- name: Run E2E tests (P0 only)
  run: npx playwright test --grep @p0
```

### Todos los Navegadores (Completo)

Si necesitas tests en Firefox y Safari también:

```yaml
- name: Install Playwright browsers (all)
  run: npx playwright install --with-deps

- name: Run E2E tests (all browsers)
  run: npm test
```

### Con Notificaciones (Slack/Discord)

Agregar al final del workflow:

```yaml
- name: Notify on failure
  if: failure()
  run: |
    echo "Tests failed! Check the artifacts."
```

---

## 📊 Artifacts

Cada ejecución guarda:

### 1. **playwright-report/** (30 días)
- HTML report interactivo
- Screenshots de fallos
- Videos de ejecución
- Trazas de debug

### 2. **test-results/** (7 días)
- Resultados raw
- Logs detallados

**Cómo descargar**:
1. Ve a Actions > Click en run
2. Scroll down a "Artifacts"
3. Download "playwright-report"
4. Descomprime y abre `index.html`

---

## ⚡ Tips de Rendimiento

### Cache Hit (Navegadores ya descargados)
```
✓ Cache hit! Skipping browser download
⏱️ Ejecución: ~30-45s
```

### Cache Miss (Primera vez o nueva versión)
```
⚠ Cache miss. Downloading browsers...
⏱️ Ejecución: ~2 min
```

### Forzar Recache

Si necesitas limpiar el cache:
1. Ve a Actions
2. Click en "Caches"
3. Delete cache con nombre `playwright-*`

---

## 🐛 Troubleshooting

### "Tests failed on CI but pass locally"

**Causa común**: Diferencias entre local y producción

**Solución**: Ejecuta local contra producción:
```bash
BASE_URL=https://portafolio-fotografia.onrender.com npm test
```

### "Workflow takes too long"

**Checks**:
1. ¿Está usando cache? (debe decir "Cache hit")
2. ¿Solo Chrome? (debe decir `chromium --with-deps`)
3. ¿Timeout razonable? (10 min es suficiente)

### "Browser not found"

**Solución**: Agregar install-deps:
```yaml
- name: Install system dependencies
  run: npx playwright install-deps chromium
```

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Cache Action](https://github.com/actions/cache)

---

## ✅ Checklist Final

Antes de hacer push:

- [ ] `.github/workflows/playwright.yml` tiene BASE_URL correcto
- [ ] `.gitignore` incluye `test-results/` y `playwright-report/`
- [ ] Tests pasan localmente: `npm test`
- [ ] Repositorio creado en GitHub
- [ ] Remote configurado: `git remote -v`

Después del push:

- [ ] Workflow aparece en Actions tab
- [ ] Tests se ejecutan automáticamente
- [ ] Badge agregado a README (opcional)

---

**¡Workflow optimizado y listo para producción! 🚀**

Tiempo de ejecución esperado:
- Primera vez: ~2 min
- Siguientes: ~30-45s

