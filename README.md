# 100Fe Landing Page

Landing page de conversión para la venta del ebook **"100 Enseñanzas Bíblicas para Emprender con Éxito y Propósito"**.

Diseñada específicamente para emprendedores y empresarios de **45+ años** que buscan alinear su fe con sus negocios.

## 🚀 Inicio Rápido

### Requisitos
- Node.js (opcional, para cualquier build tool futuro)
- Git
- Editor de código (VS Code recomendado)
- Cuenta Vercel (gratuita)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/enrique-ship-it/100fe-landing.git
cd 100fe-landing

# Abrir en VS Code
code .

# Servir localmente (Python)
python3 -m http.server 8000
# O con Node
npx serve

# Abrir en navegador
# http://localhost:8000
```

### Deploy en Vercel

Ver [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📁 Estructura del Proyecto

```
100fe-landing/
├── index.html              # Página principal
├── terminos.html           # Términos de servicio
├── privacidad.html         # Política de privacidad
├── devolucion.html         # Política de devolución
├── styles/
│   └── styles.css          # Estilos (variables CSS, responsive)
├── scripts/
│   └── script.js           # Lógica, tracking, eventos
├── api/
│   └── hotmart-webhook.js  # Purchase server-side (Meta CAPI + GA4 MP)
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.jpg
│   │   └── testimonios/
│   │       ├── avatar-1.jpg
│   │       ├── avatar-2.jpg
│   │       └── avatar-3.jpg
│   ├── fonts/              # [A agregar: tipografías del ebook]
│   └── icons/
├── .gitignore
├── README.md               # Este archivo
├── DESIGN.md               # Especificaciones de diseño
├── TRACKING.md             # Setup de Meta Pixel y GA4
└── DEPLOYMENT.md           # Guía de deploy
```

---

## 🎨 Diseño

- **Mobile-First Responsive**: Optimizado para móvil primero
- **Accesible**: WCAG AA compliant
- **Sin Frameworks**: HTML5 + CSS3 + Vanilla JS puro
- **Rápido**: < 2 segundos load time

Ver [DESIGN.md](DESIGN.md) para detalles de colores, tipografía y especificaciones.

---

## 📊 Tracking & Analytics

El proyecto incluye:
- **Meta Pixel**: Track conversiones para retargeting en Facebook Ads
- **Google Analytics 4**: Seguimiento de comportamiento y conversiones
- **Webhook Hotmart (server-side)**: Evento `Purchase` real hacia Meta CAPI y GA4 Measurement Protocol

Ver [TRACKING.md](TRACKING.md) para instrucciones de setup.

---

## 🔑 Configuración Importante

### 1. Meta Pixel ID
Estado actual: ✅ configurado con `772552728691061` en `index.html`.

Si necesitas cambiarlo:

```html
fbq('init', 'TU_PIXEL_ID_AQUI');
```

### 2. Google Analytics ID
Estado actual: ✅ configurado con `G-ZPV2HS45X4` en `index.html`.

Si necesitas cambiarlo:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=TU_GA_ID"></script>
<script>
    gtag('config', 'TU_GA_ID');
</script>
```

### 3. Checkout de Hotmart
La landing usa CTA directos al checkout de Hotmart desde `scripts/script.js`.

```javascript
window.open('https://pay.hotmart.com/E101603962K?checkoutMode=2', '_blank');
```

También se preservan UTMs/fbclid/gclid para mejorar atribución.

### 4. Purchase server-side (Webhook)
Configurar estas variables en Vercel (`Project Settings > Environment Variables`):

```bash
HOTMART_WEBHOOK_TOKEN=...
META_PIXEL_ID=772552728691061
META_ACCESS_TOKEN=...
GA4_MEASUREMENT_ID=G-ZPV2HS45X4
GA4_API_SECRET=...
LANDING_URL=https://100fe-landing.vercel.app
```

Endpoint disponible en producción:

```text
POST /api/hotmart-webhook
```

### 5. Tipografías Del Ebook
Agregar archivos de fuentes a `assets/fonts/` y configurar en `styles/styles.css`:

```css
:root {
    --font-primary: 'Tu Fuente', sans-serif;
}
```

---

## 📈 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tasa de Conversión | 5%+ |
| Bounce Rate | < 40% |
| Time on Page | > 30s |
| Mobile Conversion | 60%+ |
| Page Load Speed | < 2s |

---

## 🔄 Workflow de Desarrollo

```bash
# 1. Crear rama para cambios
git checkout -b feature/tu-cambio

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commit
git add .
git commit -m "feat(section): agregar nueva sección"

# 4. Push
git push origin feature/tu-cambio

# 5. Abrir Pull Request en GitHub
```

---

## 🧪 Testing Local

### Checkpoints Antes de Deploy

- [ ] Se ve bien en móvil (375px, 768px, 1024px)
- [ ] Todos los colores son correctos (según `DESIGN.md`)
- [ ] Botones CTA funcionan y disparan eventos
- [ ] Meta Pixel dispara eventos (verificar en Pixel Helper)
- [ ] Google Analytics muestra tráfico
- [ ] Widget Hotmart está embebido correctamente
- [ ] No hay errores en console
- [ ] PageSpeed Score > 80 (móvil)
- [ ] Testimonios se cargan correctamente
- [ ] Footer muestra año actual

### Herramientas Recomendadas

- **Lighthouse**: Google Chrome DevTools
- **Meta Pixel Helper**: Extensión de Chrome
- **Google PageSpeed Insights**: https://pagespeed.web.dev

---

## 📝 Contenido a Personalizar

En `index.html`:
- [ ] Hero headline y subheadline
- [ ] Problema section - items personalizados
- [ ] Solución section - beneficios del ebook
- [ ] Testimonios - 3-6 testimonios reales/simulados
- [ ] CTA buttons - links al widget Hotmart

En `styles/styles.css`:
- [ ] Variables de color (colores del ebook)
- [ ] Tipografía primaria (familia font del ebook)
- [ ] Imágenes en assets

---

## 🚀 Deploy

Leer [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones paso a paso.

**TL;DR**: Conectar GitHub a Vercel, todo se deploya automático cuando hagas push.

---

## 🤝 Contribuir

Para hacer cambios:

1. Editar archivos localmente
2. Verificar que funciona (`npm test` o manual)
3. Commit con mensaje descriptivo
4. Push y crear Pull Request

---

## 📞 Soporte

Para issues:
1. Verificar [TRACKING.md](TRACKING.md) si es sobre analytics
2. Verificar [DESIGN.md](DESIGN.md) si es sobre estilos
3. Crear issue en GitHub con detalles

---

## 📄 Licencia

Todos los derechos reservados © 2026 100Fe

---

**Última actualización**: 24 de febrero de 2026
