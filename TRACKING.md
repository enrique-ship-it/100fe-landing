# Tracking & Analytics - 100Fe Landing

**Última actualización**: 24 de febrero de 2026

---

## 📊 Overview

La landing incluye tracking en:
1. **Meta Pixel** - Para retargeting en Facebook Ads
2. **Google Analytics 4** - Para análisis de comportamiento
3. **Webhook de Hotmart** - Para registrar `Purchase` real server-side

Meta Pixel y GA4 ya están configurados en `index.html` con IDs reales.

---

## 🔴 Meta Pixel Setup

### Paso 1: Obtener tu Pixel ID

1. Ir a Meta Ads Manager: https://business.facebook.com
2. Navegar a **Eventos** → **Administrador de Pixels**
3. Copiar tu **ID de píxel**

### Paso 2: Configurar en `index.html`

Estado actual: `fbq('init', '772552728691061')`.

Si deseas cambiar el pixel, reemplazar en el `<head>`:

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

Estado actual: `G-ZPV2HS45X4`.

Si deseas cambiar GA4, reemplazar en dos lugares:

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
| **Purchase** | Confirmación de compra por webhook Hotmart | value, currency, transaction_id |

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

**Método implementado: Webhook de Hotmart** (Recomendado)

Hotmart envía webhook al endpoint serverless:

```text
POST /api/hotmart-webhook
```

El endpoint:
- Valida token (`HOTMART_WEBHOOK_TOKEN`)
- Filtra compras aprobadas (`approved`)
- Envía `Purchase` a Meta Conversions API
- Envía `purchase` a GA4 Measurement Protocol

Variables necesarias (Vercel env vars):

```bash
HOTMART_WEBHOOK_TOKEN=...
META_PIXEL_ID=772552728691061
META_ACCESS_TOKEN=...
GA4_MEASUREMENT_ID=G-ZPV2HS45X4
GA4_API_SECRET=...
LANDING_URL=https://100fe-landing.vercel.app
```

Ejemplo de evento server-side para Meta:

```javascript
{
   event_name: 'Purchase',
   custom_data: {
      value: 149.64,
      currency: 'MXN'
   }
}
```

Ejemplo de evento server-side para GA4:

```javascript
{
   name: 'purchase',
   params: {
      transaction_id: 'tx_123',
      value: 149.64,
      currency: 'MXN'
   }
});
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
6. Apertura de checkout Hotmart (nueva pestaña)
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
- [ ] Hotmart webhook configurado

---

## ✅ Checklist Operativo (Vercel + Hotmart + Purchase server-side)

### Opción rápida (semi-automatizada por CLI)

Se agregaron scripts en `scripts/` para reducir pasos manuales:

```bash
chmod +x scripts/setup-vercel-env.sh scripts/test-hotmart-webhook.sh
```

1) Crear `.env.local` en raíz (puedes copiar `.env.example`).

Recomendado para deploy: crear `.env.deploy` (para no mezclar con `.env.local` de desarrollo):

```bash
cp .env.example .env.deploy
```

2) Cargar variables en Vercel (preview + production):

```bash
./scripts/setup-vercel-env.sh .env.deploy
```

3) Probar webhook en producción:

```bash
export HOTMART_WEBHOOK_TOKEN='tu_token_webhook_hotmart'
./scripts/test-hotmart-webhook.sh
```

Nota: en Hotmart el webhook del producto sigue siendo configuración manual única (panel web).

### 1) Variables en Vercel (Project Settings → Environment Variables)

Configurar exactamente:

```bash
HOTMART_WEBHOOK_TOKEN=tu_token_webhook_hotmart
META_PIXEL_ID=772552728691061
META_ACCESS_TOKEN=tu_meta_access_token
GA4_MEASUREMENT_ID=G-ZPV2HS45X4
GA4_API_SECRET=tu_ga4_api_secret
LANDING_URL=https://100fe-landing.vercel.app
```

Luego hacer redeploy para que las variables tomen efecto.

### 2) Endpoint de webhook en producción

URL final del webhook:

```text
https://100fe-landing.vercel.app/api/hotmart-webhook
```

### 3) Configuración en Hotmart

En Hotmart (configuración de Webhooks del producto):

1. Crear webhook nuevo.
2. URL: `https://100fe-landing.vercel.app/api/hotmart-webhook`
3. Evento a enviar: compra aprobada (`approved`).
4. Método: `POST`.
5. Incluir token compartido en payload/campo `hottok` igual a `HOTMART_WEBHOOK_TOKEN`.

### 4) Prueba técnica rápida (antes de tráfico real)

Puedes simular una compra aprobada con:

```bash
curl -X POST https://100fe-landing.vercel.app/api/hotmart-webhook \
   -H "Content-Type: application/json" \
   -d '{
      "hottok": "tu_token_webhook_hotmart",
      "status": "approved",
      "purchase": {
         "transaction": "tx_test_100fe_001",
         "currency": "MXN",
         "price": { "value": 149.64 }
      },
      "buyer": {
         "email": "comprador@example.com",
         "checkout_phone": "5215512345678"
      }
   }'
```

Respuesta esperada: `ok: true` y `tracked: purchase`.

### 5) Validación end-to-end (producción)

1. Abrir landing con UTMs.
2. Hacer click en CTA (ver `AddToCart` + `begin_checkout`).
3. Completar compra de prueba en Hotmart.
4. Verificar recepción en webhook (`ok: true`).
5. Verificar evento `Purchase` en Meta Events Manager.
6. Verificar evento `purchase` en GA4 Realtime/DebugView.

### 6) Criterio de cierre técnico

- Meta Pixel: `ViewContent`, `AddToCart`, `Purchase` (server-side) visibles.
- GA4: `begin_checkout` y `purchase` visibles.
- Sin errores 4xx/5xx en `/api/hotmart-webhook`.

---

**Documento vivo - Actualizar según nuevos eventos o cambios**
