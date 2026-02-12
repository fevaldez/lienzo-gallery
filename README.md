# Lienzo Gallery

Sitio web de galería de arte para Dora Rodríguez. Obras originales y ediciones limitadas desde Monterrey, México.

**Live:** [https://fevaldez.github.io/lienzo-gallery/](https://fevaldez.github.io/lienzo-gallery/)

## Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/fevaldez/lienzo-gallery.git
cd lienzo-gallery

# Abrir en el navegador
open index.html
```

No requiere build system, bundler ni dependencias npm. Es HTML/CSS/JS puro.

## Estructura

```
lienzo-gallery/
├── index.html              # Homepage con hero, obras destacadas, trust badges
├── gallery.html             # Colección con filtros y ordenamiento
├── about.html               # Biografía de la artista
├── contact.html             # Formulario de contacto y WhatsApp
├── product-01.html          # Las Chismosas ($48,500 MXN)
├── product-02.html          # El Cerro de la Silla en 1800 ($35,000 MXN)
├── product-03.html          # Cargando Flores Hacia el Mercado ($55,000 MXN)
├── product-04.html          # En el Patio de Mi Abuela ($42,000 MXN)
├── css/styles.css           # Estilos completos (CSS custom properties)
├── js/main.js               # JavaScript (tabs, filtros, modales, zoom)
├── images/artworks/         # JPGs optimizados + SVG placeholders
├── deploy.sh                # Script de despliegue a GitHub Pages
├── CONTENT-GUIDE.md         # Guía para agregar/editar contenido
└── README.md                # Este archivo
```

## Agregar una nueva obra

1. **Imagen:** Convertir a JPG, max 1920px lado mayor, <500KB, calidad 80-85%, progressive, sRGB
   ```bash
   magick 'input.pdf[0]' -resize 1920x1920 -quality 85 -interlace Plane -colorspace sRGB images/artworks/artwork-XX.jpg
   ```

2. **Product page:** Duplicar cualquier `product-XX.html` y actualizar:
   - `<title>`, `<meta description>`, breadcrumb
   - `data-title`, `data-original-price`, `data-technique`, `data-dimensions`, `data-year`
   - Imagen `src` y `alt`
   - Precio, especificaciones, descripción de la obra
   - WhatsApp link con nombre de obra URL-encoded
   - Obras relacionadas

3. **Gallery:** Agregar `<article class="artwork-card">` en `gallery.html`

4. **Homepage:** Actualizar obras destacadas en `index.html` si es necesario

## Configuración WhatsApp

Reemplazar `521XXXXXXXXXX` en todos los archivos HTML con el número real:
```bash
grep -rl "521XXXXXXXXXX" *.html | xargs sed -i '' 's/521XXXXXXXXXX/521NUMERODORA/g'
```

## Modelo de negocio dual

Cada producto tiene dos tabs:
- **ORIGINAL:** Obra única con certificado de autenticidad (WhatsApp CTA)
- **PRINTS:** Ediciones limitadas giclée con selector de tamaño/tipo (lista de interés)

### Precios prints
| Tamaño | Base | Firmada /25 (×2.5) |
|--------|------|---------------------|
| A4     | $850 | $2,125              |
| A3     | $1,500 | $3,750            |
| A2     | $2,800 | $7,000            |

## Despliegue

```bash
bash deploy.sh
```

Despliega a la rama `gh-pages` del repositorio.

## Tech Stack

- HTML5 semántico (es-MX)
- CSS3 con Custom Properties
- JavaScript vanilla (ES6+)
- Google Fonts: Cormorant Garamond + Inter
- GitHub Pages

## Roadmap

- [ ] Integrar número WhatsApp real
- [ ] Fotografías de la artista (reemplazar placeholders)
- [ ] Pasarela de pago para prints (Stripe/MercadoPago)
- [ ] Google Analytics / Meta Pixel
- [ ] Blog con proceso creativo
- [ ] Optimización SEO (sitemap.xml, robots.txt, Open Graph)
