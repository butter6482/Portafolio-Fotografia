# 🚀 Comandos Git - Listos para Ejecutar

Comandos específicos para tu repositorio: **Portafolio-Fotografia**

---

## ⚡ Opción 1: Si es la Primera Vez (Repositorio Nuevo)

Ejecuta estos comandos **en orden** en PowerShell/Terminal:

```bash
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Configurar branch principal como 'main'
git branch -M main

# 3. Conectar con tu repositorio de GitHub
git remote add origin git@github.com:butter6482/Portafolio-Fotografia.git

# 4. Verificar que se conectó correctamente
git remote -v

# 5. Agregar todos los archivos
git add .

# 6. Hacer commit
git commit -m "✅ Add Playwright E2E tests + optimized CI/CD workflow"

# 7. Push a GitHub
git push -u origin main
```

---

## ⚡ Opción 2: Si Ya Tienes Git Inicializado

```bash
# 1. Verificar estado
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "✅ Add Playwright E2E tests + optimized CI/CD workflow"

# 4. Push (si ya tienes origin configurado)
git push

# 4b. Si no tienes origin, configurarlo:
git remote add origin git@github.com:butter6482/Portafolio-Fotografia.git
git push -u origin main
```

---

## 🔐 Si Usas SSH (Recomendado)

Tu URL usa SSH: `git@github.com:butter6482/Portafolio-Fotografia.git`

### Verificar que tienes SSH configurado:

```bash
# Probar conexión SSH
ssh -T git@github.com

# Deberías ver:
# Hi butter6482! You've successfully authenticated...
```

### Si no tienes SSH configurado:

**Opción A: Usar HTTPS en su lugar**
```bash
git remote set-url origin https://github.com/butter6482/Portafolio-Fotografia.git
git push -u origin main
```

**Opción B: Configurar SSH**
```bash
# 1. Generar SSH key
ssh-keygen -t ed25519 -C "tu@email.com"

# 2. Copiar la clave pública
cat ~/.ssh/id_ed25519.pub

# 3. Agregar a GitHub:
# GitHub.com > Settings > SSH and GPG keys > New SSH key
# Pega la clave pública

# 4. Probar
ssh -T git@github.com

# 5. Push
git push -u origin main
```

---

## ✅ Verificación Post-Push

### 1. En Terminal
Deberías ver:
```
Enumerating objects: 30, done.
Counting objects: 100% (30/30), done.
Writing objects: 100% (30/30), 25.41 KiB | 2.54 MiB/s, done.
Total 30 (delta 5), reused 0 (delta 0)
To github.com:butter6482/Portafolio-Fotografia.git
 * [new branch]      main -> main
```

### 2. En GitHub.com
1. Ve a: `https://github.com/butter6482/Portafolio-Fotografia`
2. Deberías ver todos tus archivos
3. Ve a pestaña **Actions**
4. Verás workflow ejecutándose automáticamente

### 3. En Actions Tab
```
✅ E2E Tests (Playwright)
   Running... (~30-45s)
   
   Luego:
   ✅ 9 passed
```

---

## 🎯 Después del Push

### Automáticamente Sucede

1. ⚡ GitHub detecta el push
2. 🚀 Ejecuta `.github/workflows/playwright.yml`
3. 🧪 Corre tests contra `https://portafolio-fotografia.onrender.com`
4. 📊 Guarda artifacts (report + screenshots)
5. ✅/❌ Muestra resultado

### Descargar Reporte

1. Ve a Actions > Click en el run
2. Scroll down a "Artifacts"
3. Download **playwright-report**
4. Descomprime y abre `index.html`

---

## 📋 Comandos Rápidos

### Ver status
```bash
git status
```

### Ver remote configurado
```bash
git remote -v
```

### Ver último commit
```bash
git log -1
```

### Ver archivos que se van a subir
```bash
git diff --cached --name-only
```

---

## 🐛 Solución de Problemas

### "Permission denied (publickey)"

**Solución**: Usar HTTPS en lugar de SSH
```bash
git remote set-url origin https://github.com/butter6482/Portafolio-Fotografia.git
git push -u origin main
```

### "remote origin already exists"

**Solución**: Actualizar URL
```bash
git remote set-url origin git@github.com:butter6482/Portafolio-Fotografia.git
```

### "Updates were rejected"

**Solución**: Pull primero
```bash
git pull origin main --rebase
git push -u origin main
```

---

## 🎨 Agregar Badge a README (Opcional)

Después del primer push exitoso, actualiza tu `README.md`:

```markdown
# Portafolio de Juan

[![E2E Tests](https://github.com/butter6482/Portafolio-Fotografia/actions/workflows/playwright.yml/badge.svg)](https://github.com/butter6482/Portafolio-Fotografia/actions/workflows/playwright.yml)

Este proyecto es un portafolio moderno hecho en React + Tailwind CSS.

## 🧪 Tests Automatizados

- 9 tests E2E con Playwright
- CI/CD con GitHub Actions
- Tests contra producción en Render
- ~10 segundos de ejecución

## 🚀 Comandos

\`\`\`bash
npm test           # Ejecutar tests
npm test:ui        # Modo interactivo
npm test:report    # Ver reporte
\`\`\`
```

---

## ✅ Tu Repositorio

**URL SSH**: `git@github.com:butter6482/Portafolio-Fotografia.git`  
**URL HTTPS**: `https://github.com/butter6482/Portafolio-Fotografia.git`  
**Owner**: butter6482  
**Repo**: Portafolio-Fotografia

---

## 🚀 Ejecuta AHORA

**Copia y pega estos comandos**:

```bash
# Si es primera vez
git init
git branch -M main
git remote add origin git@github.com:butter6482/Portafolio-Fotografia.git
git add .
git commit -m "✅ Add Playwright E2E tests + optimized CI/CD workflow"
git push -u origin main
```

**O si prefieres HTTPS**:

```bash
git init
git branch -M main
git remote add origin https://github.com/butter6482/Portafolio-Fotografia.git
git add .
git commit -m "✅ Add Playwright E2E tests + optimized CI/CD workflow"
git push -u origin main
```

---

**¡Listo para push! 🎉**

Después del push, ve a: `https://github.com/butter6482/Portafolio-Fotografia/actions`

