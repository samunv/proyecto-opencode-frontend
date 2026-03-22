---
name: guia-estilos
description: Guía de estilos visual del proyecto: colores, tipografía, espaciado y convenciones CSS
---

## Paleta de colores
--color-bg: #0f0f0f
--color-surface: #1a1a1a
--color-surface-hover: #242424
--color-border: #2e2e2e
--color-primary: #e8c97e
--color-primary-hover: #f0d898
--color-text: #f0f0f0
--color-text-muted: #888888
--color-error: #e05c5c

## Tipografía
- Font-family: 'Inter', sans-serif (cargar desde Google Fonts)
- Tamaño base: 16px
- Headings: font-weight 900
- Body: font-weight 600
- Texto secundario: font-weight 300

## Espaciado
- Espaciado base: 8px
- Usar múltiplos: 8, 16, 24, 32, 48

## Bordes y sombras
- Border-radius tarjetas: 12px
- Border-radius botones: 8px
- Sombra tarjeta: 0 4px 20px rgba(0,0,0,0.4)

## Convenciones CSS
- Variables CSS con prefijo --color- para colores
- Clases en kebab-case
- Mobile-first: estilos base para móvil, media queries para desktop
- Breakpoint principal: 768px

## Componentes base
- Fondo general: --color-bg
- Tarjetas: --color-surface con borde --color-border
- Botones y acentos: --color-primary (dorado cálido)
- Textos principales: --color-text
- Textos secundarios: --color-text-muted

## Iconos
- Librería: Lucide
- CDN: <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
- Añadir el script antes del cierre de </body> en index.html
- Inicializar siempre con: lucide.createIcons();
- Usar siempre <i data-lucide="nombre-icono"></i>
- Nunca usar otras librerías de iconos