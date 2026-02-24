# Tracking & Analytics - 100Fe Landing

**Última actualización**: 24 de febrero de 2026

---

## 📊 Overview

La landing incluye tracking en:
1. **Meta Pixel** - Para retargeting en Facebook Ads
2. **Google Analytics 4** - Para análisis de comportamiento

Ambos están configurados en `index.html` pero requieren IDs reales.

---

## 🔴 Meta Pixel Setup

### Paso 1: Obtener tu Pixel ID

1. Ir a Meta Ads Manager: https://business.facebook.com
2. Navegar a **Eventos** → **Administrador de Pixels**
3. Copiar tu **ID de píxel**

### Paso 2: Configurar en `index.html`

En el `<head>`, reemplazar `PIXEL_ID_AQUI`:

```html
<script>
    // ... código meta pixel ...
    fbq('init', 'TU_PIXEL_ID_AQUI');  // ← Reemplazar aquí
</script>
```

También reemplazar en el noscript:
```html
<noscript>
    <img height="1" width="1" style="display:none" 
         src="https://www.facebook.com/tr?id=TU_PIXEL_ID_AQUI&ev=ViewContent&noscript=1" />
</noscript>
```

### Paso 3: Verificar con Pixel Helper

1. Instalar extensión: [Meta Pixel Helper](https://chrome.google.com/webstore)
2. Abrir landing page
3. En la extensión debe aparecer un "✓" verde indicando que el pixel está activo
4. Ver eventos disparados

---

## 🟢 Google Analytics 4 Setup

### Paso 1: Crear Propiedad GA4

1. Ir a https://analytics.google.com
2. Click **Admin** (engranaje abajo)
3. Click **Crear propiedad**
4. Nombre: "100Fe Landing"
5. Copiar **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Paso 2: Configurar en `index.html`

Reemplazar `GA_ID_AQUI` en dos lugares:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    gtag('config', 'G-XXXXXXXXXX');  // ← Aquí
</script>
```

### Paso 3: Verificar Datos en Tiempo Real

1. Abrir landing en navegador
2. Ir a Google Analytics → **Reporte en tiempo real**
3. Debe mostrar tu sesión actual

---

## 📡 Eventos Rastreados

### Meta Pixel Events

| Evento | Cuándo | Datos |
|--------|--------|-------|
| **ViewContent** | Al cargar la página | Automático |
| **AddToCart** | Click en botón CTA | product name, value, currency |
| **Purchase** | Hotmart + webhook (opcional) | - |

### Google Analytics 4 Events

| Evento | Cuándo | Datos |
|--------|--------|-------|
| **page_view** | Al cargar | title, location |
| **scroll** | Scroll 25%, 50%, 75%, 100% | percent_scrolled |
| **begin_checkout** | Click CTA | value, currency, items |
| **view_item** | Testimonial visible | item_name, category |
| **page_view** | Performance metrics | LCP, CLS |

---

## 🔗 Eventos en Detalle

### ViewContent (Meta Pixel)

**Dispara**: Al cargar la página (automático)

```javascript
fbq('track', 'ViewContent');
```

**Para qué**: Crear audiencia de "Personas que vieron la landing"

---

### AddToCart (Meta Pixel)

**Dispara**: Usuario hace click en "Obtén el Ebook Ahora"

```javascript
fbq('track', 'AddToCart', {
    content_name: '100 Ensenanzas Biblicas para Emprender',
    value: 1,
    currency: 'USD'
});
```

**Para qué**: 
- Crear audiencia de "Personas interesadas"
- Usarlo para retargeting (carrusel con testimonios, descuento, etc)

---

### Purchase (Hotmart + Meta Pixel)

**Dispara**: Usuario completa compra en Hotmart

**Método 1: Webhook de Hotmart** (Recomendado)

Hotmart puede enviar webhook a tu servidor cuando se completa venta:

```javascript
fbq('track', 'Purchase', {
    value: PRECIO_EBOOK,
    currency: 'BRL',  // O la moneda que uses
    content_name: '100 Ensenanzas Biblicas'
});
```

**Método 2: Click en Widget**

Si detectas click en el botón de Hotmart dentro del iframe:

```javascript
// En script.js
const hotmartButton = document.querySelector('[data-hotmart]');
if (hotmartButton) {
    hotmartButton.addEventListener('click', () => {
        fbq('track', 'Purchase', {...});
    });
}
```

**Para qué**: Cerrar el loop de conversión y optimizar Facebook Ads

---

## 📊 Cómo Leer los Datos

### Meta Ads Manager

1. Ir a **Campañas**
2. Ver **Resultados** de tu campaña
3. Abrir **Analytics** en la página de campaña
4. Revisar **Conversiones** (AddToCart, Purchase)

### Google Analytics

1. Ir a **Analytics** → **Tu propiedad**
2. **Eventos** para ver todos los eventos rastreados
3. **Conversiones** (si configuras objetivos)
4. **Reportes personalizados** para analizar

### Dashboard Recomendado en GA4

```
Dimensiones: Source/Medium, Device, Country
Métricas: Sessions, Users, Conversion Rate
Filtro: Event name = "begin_checkout"
```

---

## 🎯 Conversiones (Goals) en GA4

### Crear Conversión "Purchase"

1. En GA4: **Admin** → **Conversiones**
2. Click **Crear conversión**
3. Nombre: "Ebook Purchase"
4. Evento: `purchase`
5. Save

### Crear Conversión "AddToCart"

1. Similar al anterior
2. Evento: `begin_checkout`

Ahora en reportes verás "Conversion Rate"

---

## 🔄 Flujo Completo de Conversión

```
1. Usuario hace click en Meta Ad
   ↓
2. Landing carga → fbq('track', 'ViewContent')
   ↓
3. Usuario scrollea → GA4 track scroll depth
   ↓
4. Usuario lee testimonios → GA4 track view_item
   ↓
5. Usuario hace click "Obtén Ebook" → fbq('track', 'AddToCart')
   ↓
6. Scroll a widget Hotmart
   ↓
7. Usuario compra en Hotmart → fbq('track', 'Purchase') [webhook]
   ↓
8. En Meta Ads ve: Conversion ✓
9. En GA4 ve: Goal completado
```

---

## 🧪 Testing de Eventos

### Verificar Meta Pixel

1. Instalar [Meta Pixel Helper](https://chrome.google.com/webstore)
2. Abrir landing
3. Verificar que muestre "✓ Pixel is installed"
4. Hacer click en CTA → Debe mostrar evento "AddToCart"

### Verificar Google Analytics

1. Abrir landing
2. Ir a Google Analytics → **Reporte en tiempo real**
3. Debe verse tu sesión
4. Hacer click en CTA → Debe verse evento "begin_checkout"

### Verificar en Console

Abrir DevTools (F12) → Console, deberías ver logs:

```javascript
[100Fe] Landing page loaded
[100Fe] Event listeners initialized
[100Fe] Pixel event tracked: AddToCart {…}
[100Fe] GA4 event tracked: begin_checkout {…}
```

---

## 🐛 Debugging

### Pixel no aparece en Meta Helper

**Causas**:
- Pixel ID incorrecto
- Bloqueador de anuncios activo
- Conexión lenta

**Solución**:
1. Verificar ID en código
2. Abrir en incógnito (sin extensiones)
3. Limpiar cache del navegador

### GA4 no muestra eventos

**Causas**:
- GA ID incorrecto
- Adblocker está bloqueando Google Analytics
- Retraso de 24-48h para nuevas conversiones

**Solución**:
1. Verificar ID en código
2. Abrir en incógnito
3. Esperar 24h para datos históricos

### AddToCart no se dispara

**Causas**:
- Botón CTA tiene click handler incorrecto
- JavaScript error en console

**Solución**:
1. F12 → Console → ¿hay errores rojos?
2. Verificar que `handleCtaClick()` en script.js esté correcto
3. Revisar que botones tengan `id="cta-hero"` y `id="cta-main"`

---

## 📈 Métricas Clave Para Monitorear

| Métrica | Meta Ads | Google Analytics |
|---------|----------|-----------------|
| Conversiones | ✓ | Conversiones (Goals) |
| Cost/Conversion | ✓ | Custom report |
| ROAS | ✓ | - |
| Bounce Rate | - | ✓ |
| Time on Page | - | ✓ |
| Source Quality | - | ✓ |

---

## 🎯 Estrategia de Retargeting Post-Landing

Una vez tengas datos:

1. **Audiencia de "ViewContent"**: Todos que vieron landing
   → CTA: "¿Dudas? Lee testimonios" + descuento

2. **Audiencia de "AddToCart sin Purchase"**: Hizo click pero no compró
   → CTA: "Ofertas limitadas" + prueba social

3. **Audiencia de "Purchase"**: Compraron
   → CTA: "Comparte tu testimonio" o "Próximo ebook"

---

## 📝 Checklist Post-Deploy

- [ ] Meta Pixel ID configurado e instalado
- [ ] GA4 ID configurado
- [ ] Pixel Helper muestra ✓ verde
- [ ] GA4 muestra datos en tiempo real
- [ ] Click en CTA dispara eventos
- [ ] Scroll tracking funciona
- [ ] No hay errores en console
- [ ] Hotmart webhook configurado (opcional pero recomendado)

---

**Documento vivo - Actualizar según nuevos eventos o cambios**
