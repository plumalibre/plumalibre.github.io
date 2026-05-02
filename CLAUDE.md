# Pluma Libre — Contexto del Proyecto

> Este archivo le da contexto a Claude Code sobre el proyecto. Mantenerlo actualizado.

## Qué es Pluma Libre

Medio de comunicación digital independiente de Sonsonate, El Salvador. Equipo de 2 personas.
Cobertura local, nacional e internacional. Periodismo crítico sin ataduras políticas ni institucionales.

**Sitio:** https://plumalibre.github.io
**Repo:** https://github.com/plumalibre/plumalibre.github.io
**Hosting:** GitHub Pages (solo HTML/CSS/JS, sin backend, sin CMS)

## Stack técnico

- HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
- Tipografías: Newsreader (titulares) + Outfit (cuerpo)
- Deploy: cada `git push` a main actualiza el sitio automáticamente vía GitHub Pages
- SEO: JSON-LD Schema.org, Open Graph, sitemap.xml, robots.txt

## Paleta de colores

```css
--brand: #0B2545;   /* azul oscuro, marca */
--accent: #0071E3;  /* azul Apple, links/CTA */
--bg: #F5F5F7;      /* gris claro fondo */
--card: #FFFFFF;    /* blanco tarjetas */
```

## Estructura del repo

```
/
├── index.html                  # Homepage
├── sobre-nosotros.html         # Sobre + contacto (form Formspree, endpoint xdayypog)
├── style.css                   # Estilos globales v3
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── logo.jpg                # Logo (globo azul con pluma)
│   └── [imágenes de notas]
├── secciones/
│   ├── religioso.html
│   ├── politico.html
│   ├── cultural.html
│   ├── social.html
│   ├── economico.html
│   └── deportivo.html
├── articulos/
│   ├── plantilla.html          # NO BORRAR - base para notas
│   └── [notas].html
└── herramientas/
    ├── editor.html             # Editor v9 - publicación y generación de posts integrada
    └── generar-clave.html      # Utility local - encriptar token con contraseña
```

## Editor v10 (herramientas/editor.html)

**Archivo único de ~1400 líneas, todo inline (HTML+CSS+JS).**

3 pestañas principales:
1. **📝 Escribir** — formulario con toolbar (H2, H3, cita, negrita, cursiva, foto, video, línea, 2 columnas). Publicar y preview son botones dentro del flujo, no pestañas.
2. **📱 Redes** — genera posts automáticos para Facebook, X, Instagram y Threads.
3. **📋 Historial** — lista notas publicadas, permite editar y borrar.

Tres botones en la barra superior:
- 🌙 Modo oscuro
- 📢 **Publicidad** — abre modal fullscreen para administrar banners (Banner A home + Banner B nota) sin tocar código: checkbox activo, drag/drop de imagen con compresión adaptativa, link y alt. Cada guardado genera 1-2 commits (imagen si cambió + `banners.json`).
- ⚙️ Configuración GitHub (usuario, repo, token)

**Publicación:** usa GitHub API directamente desde el navegador con un token encriptado con XOR+base64 (SEGURIDAD DÉBIL - PENDIENTE DE MEJORAR).

**Markup especial:**
- `## texto` → H2
- `### texto` → H3
- `> texto` → cita
- `**texto**` → negrita
- `_texto_` → cursiva
- `[IMAGEN:nombre.jpg]` → imagen inline
- `[VIDEO_YOUTUBE:id]`, `[VIDEO_FACEBOOK:url]`, `[VIDEO_TIKTOK:url]`
- `[COL2]...[/COL]...[/COL2]` → 2 columnas
- `---` → separador

**Token actual encriptado en el archivo:**
- `data: 'FxoVMTVQRAlJcyImHz0CMgJYXwQxGVE0HBgCIEFAQAcnA0AZIRRJag=='`
- `check: 'hsme43b'`

## Línea editorial

- **Tono:** Profesional, directo, accesible
- **Secciones fijas:** #AcontecerReligioso #AcontecerPolítico #AcontecerCultural #AcontecerSocial #AcontecerEconómico #AcontecerDeportivo
- **Hashtags base:** #PlumaLibre #Sonsonate #ElSalvador
- **Relaciones comerciales:** Pauta con Alcaldía de Sonsonate Centro (Alcalde Roberto Aquino). NO con Sonsonate Este.

## Cuentas GitHub

- **plumalibre** (prensaplumalibre@gmail.com) — cuenta del medio, usar para todo
- **Procesion-Sonsonate-Semana-Santa** (njrmancia@gmail.com) — cuenta personal del dev, NO TOCAR

## Banners publicitarios (banners.json)

El sitio tiene tres slots de banner que se controlan desde `banners.json` en la raíz del repo:

- **Banner A** — aparece en el home (entre hero y grid de noticias). Se **achica al scrollear** (250→100px desktop, 150→70px mobile, vuelve a tamaño original al subir el scroll).
- **Banner B** — aparece dentro de las notas (entre el 3er y 4to párrafo).
- **Banner C** — intercalado entre cards del grid de Últimas Noticias en el home, cada N cards (configurable, default 5). Se renderiza como una card más del grid (mismo aspect, sombra, border-radius). Dimensiones recomendadas: 600×600 (1:1) o 800×600 (4:3) px, JPG/PNG, máx 150KB. Tiene campo extra `frecuencia` (3-10) en `banners.json`. **Pendiente futuro:** cuando las páginas de sección (`secciones/*.html`) tengan más cards, extender Banner C a esas páginas también (hoy solo aparece en home).

Banner A y B están en el HTML estático (ocultos con `hidden` hasta que el JS los active). Banner C vive en un `<template id="banner-c-tpl">` y se clona/inserta por JS solo si está activo. El script inline al final del `<body>` lee `banners.json` al cargar, valida link/imagen y aplica.

### Activar un anunciante — opción rápida (editor)

Desde el editor → botón **📢 Publicidad** en la barra superior → modal con formularios para Banner A, Banner B y Banner C:
- Checkbox "Activo"
- Subir imagen (se redimensiona y comprime automáticamente al tamaño del slot)
- Link y alt
- Botón "Guardar Banner X" → genera 1-2 commits automáticos (imagen + `banners.json`).

Este es el flujo recomendado día a día. Los nombres de imagen son fijos (`assets/banner-a.jpg`, `assets/banner-b.jpg`, `assets/banner-c.jpg`) y cada upload sobrescribe.

### Activar un anunciante — opción manual (GitHub web)

1. Subir la imagen del banner a `assets/` (ej. `assets/banner-alcaldia.jpg`).
2. Editar `banners.json` desde GitHub web (Edit this file ✏️). Poner:
   ```json
   {
     "banner_a_home": {
       "activo": true,
       "imagen": "assets/banner-alcaldia.jpg",
       "link": "https://sonsonatecentro.gob.sv",
       "alt": "Alcaldía de Sonsonate Centro"
     },
     "banner_b_nota": { "activo": false, "imagen": "", "link": "", "alt": "" }
   }
   ```
3. Commit en GitHub web. GitHub Pages redespliega en ~30s y el banner queda visible en todas las páginas con ese slot.

### Reglas de validación (anti-XSS)

- `link` debe empezar con `https://`, `mailto:`, `tel:` o `https://wa.me/`. Otros protocolos (incluido `javascript:`) se descartan silenciosamente.
- `imagen` debe ser una URL `https://` o una ruta relativa simple (solo `A-Za-z0-9._/-`). Si tiene `://` con otro protocolo o caracteres raros, se descarta.
- Si validación falla o el fetch de `banners.json` se cae, los banners simplemente no aparecen — la página sigue funcionando.

### Desactivar

Poner `"activo": false` y guardar. El banner desaparece en el próximo redeploy.

### Limitación actual

`banners.json` acepta una sola `imagen` por banner. El HTML tiene 3 slots responsive para Banner A (billboard 970×250, leaderboard 728×90, mobile 320×100) y 2 para Banner B (leaderboard + mobile). El script pone la misma imagen en todos los slots: queda legible pero puede verse deformada si el aspect-ratio no calza. Si en el futuro se quiere una imagen distinta por viewport, el JSON tiene que evolucionar a `{ billboard, leaderboard, mobile }` y el script cambiar en consecuencia.

## Historial reciente importante

- Migración completa de Netlify (suspendido) a GitHub Pages
- Editor pasó de v8 a v9: integración del generador de posts como 5ta pestaña
- Eliminación de `herramientas/redes.html` (redundante tras integración)
- 2026-04-23: limpieza de contenido de prueba (holalala.html + 2 cards rotas en home + imagen huérfana)
- 2026-04-23: Google Analytics 4 activo (`G-TZRTJLP5KT`)
- 2026-04-23: formulario de contacto migrado de Netlify Forms a Formspree (endpoint `xdayypog`)

## Pendientes críticos (Tier 1)

1. ~~**Google Analytics 4** — placeholder hardcoded en TODAS las páginas, pendiente de reemplazar.~~ ✅ **Resuelto 2026-04-23**: GA4 activo con ID `G-TZRTJLP5KT` (cuenta `prensaplumalibre@gmail.com`). Integrado en homepage, 5 secciones, sobre-nosotros, plantilla de artículos y en el template `genHTML()` del editor v9 (así cada nota nueva nace ya trackeada).
2. **Contenido placeholder** — sobre-nosotros genérico, notas de ejemplo con fotos azules
3. **Seguridad del token** — XOR+base64 no es encriptación real; cualquiera puede extraerlo del repo público
4. ~~**Formulario de contacto roto** — sobre-nosotros.html usa Netlify Forms (suspendido), hay que migrar a Formspree~~ ✅ **Resuelto 2026-04-23**: migrado a Formspree Ajax con endpoint `https://formspree.io/f/xdayypog` (formId `xdayypog`). Incluye honeypot `_gotcha` anti-spam y manejo declarativo con `data-fs-*`.

## Convenciones de código

- Español para comentarios, variables y funciones nuevas cuando sea natural
- HTML/CSS/JS inline en archivos únicos (no separar en archivos múltiples por ahora)
- Minificación conservadora: legible pero compacto
- No introducir frameworks (React, Vue, etc.) sin discutirlo primero
- No romper el deploy actual: siempre probar localmente antes de pushear

## Comandos útiles

```powershell
# Estado y deploy
git status
git add .
git commit -m "mensaje"
git push

# Sincronizar (por si el editor publicó desde otro dispositivo)
git pull

# Probar localmente
# Abrir index.html o editor.html directamente en el navegador
```
