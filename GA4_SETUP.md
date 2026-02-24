# Configuración de Google Analytics 4

## ✅ Estado Actual
- **Meta Pixel**: ✅ Configurado con ID `772552728691061`
- **Hotmart Widget**: ✅ Embebido en la landing page
- **GA4**: 🔄 Pendiente de configuración (código en standby)

---

## 📋 Instrucciones Step-by-Step

### Paso 1: Crear Propiedad en Google Analytics 4

1. Ve a https://analytics.google.com
2. Haz clic en **"Crear"** (parte superior izquierda)
3. Completa el formulario:
   - **Nombre de la cuenta**: `100Fe Landing`
   - **Configuración de datos predeterminados**: Selecciona tu país
   - **Nombre de la propiedad**: `100Fe Landing Page`
   - **Huso horario**: Tu zona horaria
   - **Moneda**: USD
4. Haz clic en **"Crear"**

---

### Paso 2: Obtener el Measurement ID

1. Después de crear la propiedad, verás una pantalla de configuración
2. En el panel izquierdo, ve a **Administración** (engranaje) → **Propiedad** → **Información de la propiedad**
3. Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)
4. Guarda este ID - lo necesitarás para el siguiente paso

![GA4 Measurement ID](/assets/images/ga4-measurement-id.png)

---

### Paso 3: Agregar el Código a la Landing Page

Una vez que tengas el Measurement ID, notifica al equipo de desarrollo con:
```
Measurement ID: G-XXXXXXXXXX
```

El código se descomentará automáticamente en `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

### Paso 4: Verificar Instalación (Opcional)

1. Descarga la extensión **Google Analytics Debugger** en Chrome
2. Ve a http://localhost:8000
3. Abre la consola (F12 → Consola)
4. Verás eventos de GA4 siendo registrados en tiempo real

**Eventos esperados**:
- ✅ page_view (al cargar la página)
- ✅ scroll (al hacer scroll)
- ✅ view_item (cuando testimonios son visibles)
- ✅ add_to_cart (al hacer clic en CTA)

---

## 📊 Eventos que GA4 Está Rastreando

| Evento | Trigger | Datos Enviados |
|--------|---------|---|
| **page_view** | Carga de página | Página URL, referrer |
| **scroll** | 25%, 50%, 75%, 100% scroll | Profundidad de scroll |
| **view_item** | Testimonios visibles | Nombre, descripción |
| **add_to_cart** | Clic en CTA | Producto, valor, moneda |
| **begin_checkout** | Clic en botón Hotmart | Datos del producto |

---

## 🔗 URL de la Landing (para GA4)

**Localhost (pruebas)**: `http://localhost:8000`

**Producción (Vercel)**: `https://100fe-landing.vercel.app` ← Usa esta para crear la propiedad GA4

---

## ✅ Checklist de Finalización

- [ ] Crear propiedad en GA4
- [ ] Copiar Measurement ID
- [ ] Compartir ID con equipo
- [ ] Verificar eventos en consola
- [ ] Confirmar datos en Dashboard de GA4
- [ ] Proceder a SPRINT 4 (Deploy a Vercel)

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que el Measurement ID esté en formato `G-XXXXXXXXXX`
2. Revisa la consola (F12) para errores JavaScript
3. Asegúrate de que la propiedad está en la misma cuenta de Google

---

**PRÓXIMO PASO**: SPRINT 4 - Deploy a Vercel
- Conectar GitHub a Vercel
- Configurar auto-deploy
- Verificar landing en producción
