# Especificaciones de Diseño - 100Fe Landing

**Última actualización**: 24 de febrero de 2026

---

## 🎨 Paleta de Colores

```css
--color-primary: #2C5F2D;      /* Verde cristiano */
--color-secondary: #8B6914;    /* Dorado/Tierra */
--color-accent: #E6DCB2;       /* Crema */
--color-text: #1A1A1A;         /* Casi negro */
--color-text-light: #666;      /* Gris oscuro */
--color-border: #DDD;          /* Gris claro */
--color-background: #F8F7F4;   /* Fondo crema muy claro */
--color-white: #FFFFFF;
```

### Notas sobre Colores

- **Primary (Verde)**: Confianza, crecimiento, naturaleza
- **Secondary (Dorado)**: Riqueza, valor, espiritualidad
- **Accent (Crema)**: Calidez, accesibilidad para 45+

**IMPORTANTE**: Estos colores son placeholders. Actualizar con los colores reales del ebook.

---

## 🔤 Tipografía

### Font Stack Actual (Placeholder)

```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Tamaños

| Elemento | Tamaño | Mobile |
|----------|--------|--------|
| H1 | 2.5rem (40px) | 1.8rem (28px) |
| H2 | 2rem (32px) | 1.5rem (24px) |
| H3 | 1.5rem (24px) | 1.2rem (19px) |
| Body | 1rem (16px) | 0.9375rem (15px) |
| Small | 0.875rem (14px) | 0.875rem (14px) |

### Lineheight

- Headings: 1.2
- Body: 1.6
- Small text: 1.8

### Recomendaciones para 45+

- ✅ Mínimum 16px en móvil
- ✅ Espacio generoso entre líneas
- ✅ Alto contraste (AAA WCAG)
- ✅ No usar tipografía serif pequeña (<14px)

---

## 📐 Espaciado (Spacing Scale)

```css
--spacing-xs: 0.5rem (8px)
--spacing-sm: 1rem (16px)
--spacing-md: 1.5rem (24px)
--spacing-lg: 2rem (32px)
--spacing-xl: 3rem (48px)
--spacing-2xl: 4rem (64px)
```

**Uso**:
- Entre secciones: `--spacing-2xl`
- Entre elementos: `--spacing-lg` o `--spacing-md`
- Padding interno: `--spacing-md` o `--spacing-lg`

---

## 🔘 Componentes

### Botones CTA

**Primario (Comprar)**:
- Fondo: `--color-secondary` (#8B6914)
- Texto: Blanco
- Padding: `var(--spacing-md) var(--spacing-lg)` (16px 32px)
- Fuente: 16px, Bold, Uppercase
- Border-radius: 8px
- Hover: Más oscuro, elevación

**Grande** (viewport principal):
- Padding: `var(--spacing-lg) var(--spacing-2xl)` (32px 64px)
- Fuente: 18px

### Testimonios

**Avatar**:
- Tamaño: 50px en card, 80px si fullscreen
- Border-radius: 50% (círculo)
- Border-left en la card: 4px solid secondary color

**Rating**: ★★★★★ (5 estrellas siempre)

### Cards (Beneficios, Testimonios)

- Fondo: `--color-white` o `--color-background`
- Padding: `--spacing-lg` (32px)
- Border-radius: 8px
- Shadow: `var(--shadow-md)`
- Hover: Elevación +5px, shadow más fuerte

---

## 📱 Responsive Breakpoints

| Nombre | Ancho | Detalles |
|--------|-------|----------|
| Mobile | < 480px | Font menor, padding reducido |
| Tablet | 480px - 768px | Grid de 2 columnas |
| Desktop | > 768px | Grid de 3-4 columnas |

### Mobile-First Strategy

1. CSS base es para móvil (16px, spacing pequeño)
2. Media queries para tablet y desktop aumentan tamaños
3. Ejemplo:
   ```css
   /* Mobile (base) */
   font-size: 16px;
   
   @media (min-width: 768px) {
       /* Tablet+ */
       font-size: 18px;
   }
   ```

---

## 🎯 Layout por Sección

### Header
- Height: Flexible (auto)
- Padding: `--spacing-lg` vertical
- Centered text
- Background: Primary color
- Box-shadow: Sutil

### Hero
- Min-height: 60vh (viewport)
- Padding: `--spacing-2xl`
- Gradient background: Primary to darker
- Centered, max-width 700px
- CTA button centered abajo

### Problema
- Background: Light background color
- Max-width content: 600px center
- Bullets con emojis (❌)
- Spacing: 2x los normal (emocional)

### Solución
- 4 cards en grid
- Cada card: beneficio con icon + title + description
- Hover animation: translateY(-5px)

### Testimonios
- 3 cards en fila (responsive: 2 tablet, 1 mobile)
- Card con border-left colored
- Avatar + Name + Age + Texto + Rating

### CTA Section
- Gradient background (como hero)
- Centered
- Large button
- Trust signals debajo

### Hotmart Widget
- Min-height: 600px (espacio para widget)
- Centered, responsive

### Footer
- Background: Primary
- Small font
- Links en accent color
- Year dinámico (JavaScript)

---

## 🌈 Paleta Completa

```html
<!-- Para copiar en un documento -->
Verde Primario:      #2C5F2D
Dorado Secundario:   #8B6914
Crema Accent:        #E6DCB2
Texto Oscuro:        #1A1A1A
Texto Luz:           #666
Borde:               #DDD
Fondo Light:         #F8F7F4
Blanco:              #FFFFFF
```

---

## 🎬 Animaciones

### Transiciones Globales
```css
--transition: all 0.3s ease;
```

### Efectos Específicos

**Buttons**:
- Hover: opacity 0.9, transform translateY(-2px)
- Active: translateY(0)

**Cards**:
- Hover: shadow intenso, translateY(-5px)

**Links**:
- Hover: text-decoration underline, opacity 0.8

### Scroll Behaviors
- Smooth scroll (CSS)
- CTA click → smooth scroll a widget

---

## ♿ Accesibilidad

- Contraste mínimo AA (4.5:1)
- Todos los inputs tienen labels
- Buttons tienen aria-labels si necesario
- Imágenes tienen alt text
- Semantic HTML5
- Focus visible en botones

---

## 🖼️ Assets Necesarios

### Imágenes

| Archivo | Tamaño Recomendado | Formato |
|---------|-------------------|---------|
| hero.jpg | 1200x600px | JPG, <100KB |
| logo.svg | 200x50px | SVG |
| avatar-1.jpg | 200x200px | JPG, <30KB c/u |
| avatar-2.jpg | 200x200px | JPG, <30KB c/u |
| avatar-3.jpg | 200x200px | JPG, <30KB c/u |
| og-image.jpg | 1200x630px | JPG, <100KB |

### Optimization
- Usar TinyJPG/TinyPNG para comprimir
- Considerar WebP para navegadores modernos
- Lazy loading en imágenes offline críticas

---

## 📐 Estructura HTML Semántica

```html
<header> - Logo + tagline
<main>
    <section class="hero"> - Headline + CTA
    <section class="problem"> - Puntos de dolor
    <section class="solution"> - Beneficios
    <section class="testimonials"> - Prueba social
    <section class="cta-section"> - CTA final
    <section class="hotmart-section"> - Widget
</main>
<footer> - Copyright + links
```

---

## 🔍 SEO Meta

```html
<title>100 Enseñanzas Bíblicas para Emprender con Éxito y Propósito</title>
<meta name="description" content="...">
<meta property="og:image" content="assets/images/og-image.jpg">
<meta property="og:title" content="...">
```

---

## 📋 Checklist antes de Deploy

- [ ] Colores verificados contra ebook (no placeholders)
- [ ] Tipografías cargadas correctamente
- [ ] Imágenes optimizadas y en tamaño correcto
- [ ] Contrast ratio ≥ 4.5:1 para todo texto
- [ ] Botones ≥ 48px de alto
- [ ] Responsive test en 3 tamaños (mobile/tablet/desktop)
- [ ] PageSpeed > 80 (mobile)
- [ ] Padding/spacing coherente en todas las secciones

---

**Documento vivo - Actualizar según feedback de audiencia**
