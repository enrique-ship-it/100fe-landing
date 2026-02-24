# Deploy en Vercel - 100Fe Landing

**Última actualización**: 24 de febrero de 2026

---

## 🚀 Inicio Rápido (5 minutos)

### Opción A: Deploy Automático (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "feat(initial): landing page inicial"
git push origin main

# 2. Ir a Vercel
# https://vercel.com/new

# 3. Importar proyecto de GitHub
# Seleccionar: enrique-ship-it/100fe-landing

# 4. Click "Deploy"
# ¡Listo! Vercel te da una URL pública

# 5. Cada vez que hagas push, se deploya automático
```

### Opción B: Deploy Manual vía CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Autenticarse
vercel login

# 3. Deploy
cd /Users/enrique/Documents/Proyectos/100Fe/100fe-landing
vercel

# 4. Seguir instrucciones en terminal
```

---

## 📋 Pre-Requisitos

- [ ] GitHub CLI autenticado (already done ✓ `enrique-ship-it`)
- [ ] Repositorio en GitHub creado
- [ ] Cuenta Vercel (free tier)

---

## 🔧 Configuración Vercel

### vercel.json (Opcional)

Si necesitas configuración especial, crear archivo `vercel.json`:

```json
{
  "buildCommand": "echo 'No build needed'",
  "installCommand": "echo 'No dependencies'",
  "framework": "static",
  "version": 2,
  "env": {},
  "env_production": {},
  "public": true,
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

**Nota**: Para un proyecto HTML/CSS/JS estático, Vercel no necesita este archivo.

---

## 🌐 Conectar Dominio Personalizado (Opcional)

### Si tienes dominio (ej: 100fe.com)

1. En Vercel dashboard, ir a **Settings**
2. Click **Domains**
3. Agregar tu dominio
4. Vercel te muestra DNS records a configurar
5. En tu proveedor de dominio (GoDaddy, Namecheap, etc):
   - Copiar records de Vercel
   - Actualizar DNS
   - Esperar 24h para propagación

### URL por defecto de Vercel

Mientras no tengas dominio:
```
https://100fe-landing.vercel.app
```

---

## 📝 Antes de Deployar

Checklist final:

- [ ] `.gitignore` está configurado
- [ ] No hay `node_modules/` en el commit
- [ ] No hay `.env` con secretos en el commit
- [ ] Meta Pixel ID está en `index.html` (IMPORTANTE)
- [ ] GA4 ID está en `index.html` (IMPORTANTE)
- [ ] Hotmart widget está embebido (IMPORTANTE)
- [ ] Imágenes están optimizadas en `assets/`
- [ ] No hay errores en console (verificar localmente)
- [ ] PageSpeed Score > 80 (móvil)
- [ ] Tests de responsive en 3 breakpoints

---

## 🔄 Flujo de Trabajo Post-Deploy

### Después de hacer cambios locales:

```bash
# 1. Hacer cambios en archivos
# ... editar index.html, styles.css, etc ...

# 2. Verificar localmente
# python3 -m http.server 8000
# Abrir en navegador, verificar que todo funciona

# 3. Commit
git add .
git commit -m "fix(hero): actualizar headline"

# 4. Push a GitHub
git push origin main

# 5. Vercel deploya automático (1-2 minutos)

# 6. Verificar en URL pública
# https://100fe-landing.vercel.app
```

---

## 🐛 Debugging Post-Deploy

### Landing no carga correctamente

1. Abrir DevTools (F12)
2. Ir a **Console** - ¿hay errores rojos?
3. Ir a **Network** - ¿hay archivos que no cargan?

**Causas comunes**:
- Rutas de archivos incorrectas (verificar case-sensitivity)
- Assets no están en `assets/` folder
- CSS no cargó (verificar ruta en `<link>`)

### Meta Pixel no funciona en producción

1. Abrir landing en Vercel URL
2. Usar Meta Pixel Helper
3. ¿Dice "Pixel found"?

**Si NO**:
- Verificar que Pixel ID en `index.html` es correcto
- Verificar que no tiene caracteres extra
- Refrescar página (Ctrl+F5 para limpiar cache)

### GA4 no muestra datos

1. Abrir https://analytics.google.com
2. Ir a **Reporte en tiempo real**
3. Abrir landing en Vercel
4. ¿Aparece tu sesión en GA4?

**Si NO**:
- Verificar que GA ID es correcto
- Esperar 24h para datos históricos
- Intentar en ventana incógnito

---

## 🔒 Variables de Entorno (Si es necesario)

Si necesitas guardar IDs sin exponerlos:

### Crear archivo `.env.local`

```bash
VITE_PIXEL_ID=YOUR_PIXEL_ID
VITE_GA_ID=YOUR_GA_ID
```

### En Vercel Dashboard

1. **Settings** → **Environment Variables**
2. Agregar variables
3. Aplicar a Production/Preview/Development según necesites

### En `index.html`

```html
<script>
    fbq('init', '%VITE_PIXEL_ID%');
    gtag('config', '%VITE_GA_ID%');
</script>
```

**Nota**: Para proyectos estáticos HTML puro, esto requiere build step con build tools. Por ahora, los IDs están en HTML (es aceptable si el repo es privado).

---

## 📊 Monitorear Deployments

### En Vercel Dashboard

1. Ir a https://vercel.com/dashboard
2. Select proyecto `100fe-landing`
3. Ver **Deployments**
4. Cada deployment muestra:
   - ✓ Success o ✗ Failed
   - Build time
   - Size
   - Tiempo de deploy

### Historial de Cambios

```bash
# Ver commits que triggerean deploys
git log --oneline

# Ver qué cambio en cada comit
git show COMMIT_HASH
```

---

## 🚨 Rollback (Si algo falla)

### Volver a versión anterior

```bash
# Si commitiste algo que rompió deployment:

# Opción 1: Revert último commit
git revert HEAD
git push origin main

# Opción 2: Volver a commit específico
git reset --hard COMMIT_HASH
git push -f origin main

# Vercel automáticamente deployará versión anterior
```

### En Dashboard Vercel

1. En **Deployments**
2. Buscar deployment anterior
3. Click en él
4. Click **Promote to Production**

---

## 🎯 Performance Post-Deploy

### Monitorear con Vercel Analytics

Vercel incluye Web Vitals:

1. Dashboard → "Analytics"
2. Ver:
   - FCP (First Contentful Paint)
   - LCP (Largest Contentful Paint)
   - CLS (Cumulative Layout Shift)

### Google PageSpeed Insights

```
https://pagespeed.web.dev/?url=https://100fe-landing.vercel.app
```

Monitor mensualmente para:
- Performance
- Accessibility
- Best Practices
- SEO

**Meta**: Score > 80 en móvil

---

## 🔄 CI/CD Automático (Opcional)

### GitHub Actions

Para agregar checks automáticos ante cada push:

**Crear archivo**: `.github/workflows/lint.yml`

```yaml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check HTML
        run: |
          echo "Running HTML validation..."
          # Aquí agregarías validación HTML si lo necesitas
```

**Nota**: Para HTML/CSS/JS estático, usualmente no es necesario.

---

## 📚 Recursos Vercel

- [Documentación Vercel](https://vercel.com/docs)
- [Vercel + GitHub Integration](https://vercel.com/docs/git/github)
- [Custom Domains](https://vercel.com/docs/custom-domains)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## 🎓 Tips de Deployment

1. **Siempre commitear antes de deployar**
   ```bash
   git status  # Verificar que no hay cambios sin guardar
   ```

2. **Usar descriptive commit messages**
   ```bash
   git commit -m "feat(cta): agregar testimonios testimonios"
   # Mejor que: git commit -m "cambios"
   ```

3. **Evitar force push a main**
   ```bash
   # MAL: git push -f origin main
   # BIEN: arreglar el error localmente y hacer nuevo push
   ```

4. **Test en staging primero** (si tienes rama `develop`)
   ```bash
   git checkout develop
   git push origin develop
   # Vercel puede deployar develop a diferente URL
   ```

5. **Mantener histórico limpio**
   ```bash
   git log --oneline | head -20  # Ver últimos 20 commits
   ```

---

## ✅ Checklist de Deploy

- [ ] Código está en GitHub
- [ ] Vercel conectado a GitHub
- [ ] Primer deploy exitoso
- [ ] URL pública funciona
- [ ] Meta Pixel funciona (verificar con Pixel Helper)
- [ ] GA4 funciona (verificar en tiempo real)
- [ ] Hotmart widget se ve correctamente
- [ ] Botones CTA funcionan
- [ ] Responsive se ve bien en móvil
- [ ] PageSpeed > 80
- [ ] Documentación actualizada

---

## 🆘 Soporte

Si algo falla:

1. Revisar **Vercel Deployment Logs** (Dashboard → Deployments)
2. Revisar **DevTools Console** en navegador
3. Revisar **Network tab** para requests fallidas
4. Crear issue en GitHub con error específico

---

**Último actualizado**: 24 de febrero de 2026
