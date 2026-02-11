# Guía de Contenido - Lienzo Gallery

## Fotografía de obras

### Requisitos de imagen
- **Formato:** JPG progresivo
- **Tamaño máximo:** 500KB
- **Resolución:** Max 1920px en el lado mayor
- **Calidad:** 80-85% (ajustar si supera 500KB)
- **Espacio de color:** sRGB
- **Nombrado:** `artwork-XX.jpg` (secuencial, dos dígitos)

### Conversión desde PDF
```bash
magick 'archivo.pdf[0]' -resize 1920x1920 -quality 85 -interlace Plane -colorspace sRGB images/artworks/artwork-XX.jpg
```

Si el archivo resultante supera 500KB, reducir calidad a 80:
```bash
magick 'archivo.pdf[0]' -resize 1920x1920 -quality 80 -interlace Plane -colorspace sRGB images/artworks/artwork-XX.jpg
```

## Escribir descripciones de obras

### Estructura recomendada
1. **Primer párrafo:** Qué representa la obra, emoción principal
2. **Segundo párrafo:** Técnica, proceso, intención artística
3. **Firma:** `— Dora Rodríguez, Monterrey`

### Tono
- Primera persona cuando la artista habla
- Evocador pero no pretencioso
- Conectar con experiencias universales
- Mencionar elementos del norte de México cuando sea relevante

### Ejemplo
> "Las Chismosas" captura un momento íntimo y cotidiano: dos mujeres compartiendo historias y secretos. A través de pinceladas expresivas y una paleta cálida, esta obra celebra la conexión femenina y el poder de la conversación.

## Precios

### Originales
- Rango típico: $35,000 - $80,000 MXN
- Factores: tamaño, complejidad, técnica, serie

### Prints (fórmula base)
| Tamaño | Precio base |
|--------|-------------|
| A4 (21 × 30 cm) | $850 MXN |
| A3 (30 × 42 cm) | $1,500 MXN |
| A2 (42 × 59 cm) | $2,800 MXN |

**Multiplicadores por tipo:**
- Giclée edición abierta: ×1
- Giclée firmada /25: ×2.5

## Marcar una obra como vendida

1. En el producto (`product-XX.html`):
   - Cambiar `data-original-status="disponible"` a `"vendido"`
   - Cambiar `product__status--available` a `product__status--sold`
   - Cambiar texto "Disponible" a "Vendido"
   - Reemplazar botón WhatsApp por texto "Esta obra encontró hogar"

2. En la galería (`gallery.html`):
   - Cambiar `data-status="disponible"` a `"vendido"` en el `<article>`
   - Cambiar `artwork-card__status--available` a `artwork-card__status--sold`

3. En el homepage (`index.html`):
   - Actualizar el card correspondiente si aparece en destacados

## Prints vs. Original-only

Para obras que solo ofrecen original (sin prints):
- Eliminar el tab "PRINTS" y el botón del tab
- Remover los `data-print-*` attributes
- Mantener solo el panel de original

## Status de obras

- `disponible` → Punto verde, visible en filtro "Disponibles"
- `vendido` → Punto rojo, visible en filtro "Vendidos"
- `proximamente` → Punto amarillo, visible en filtro "Próximamente", muestra botón "Avísame"
