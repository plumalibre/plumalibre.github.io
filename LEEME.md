# 📰 Pluma Libre — Sitio Web

Medio informativo de interés nacional e internacional con sede en Sonsonate, El Salvador.
Sitio en producción: **https://plumalibre.github.io**

---

## 🧰 Stack actual

- **HTML + CSS + JavaScript vanilla** (sin frameworks)
- **Hosting**: GitHub Pages (repo `plumalibre/plumalibre.github.io`)
- **Analytics**: Google Analytics 4 (`G-TZRTJLP5KT`, cuenta `prensaplumalibre@gmail.com`)
- **Formulario de contacto**: Formspree (endpoint `xdayypog`, recibe al correo configurado en el dashboard)
- **Editor propio**: `herramientas/editor.html` v9 (publica directo a GitHub vía API)
- **Tipografías**: Newsreader (titulares) + Outfit (cuerpo)
- **Favicon multisize**: `assets/favicon.ico` + PNGs 32/192 + apple-touch-icon 180

## 📁 Estructura del sitio

```
pluma-libre/
├── index.html                  ← Página de inicio
├── sobre-nosotros.html         ← Sobre + formulario de contacto (Formspree)
├── style.css                   ← Estilos globales
├── robots.txt
├── sitemap.xml
├── .gitignore                  ← Ignora .netlify, .claude, logs, IDE, OS junk
├── assets/
│   ├── logo.jpg                ← Logo principal
│   ├── favicon.ico             ← Favicon 16/32/48
│   ├── favicon-32x32.png
│   ├── favicon-192x192.png
│   └── apple-touch-icon.png    ← 180x180 para iOS
├── secciones/
│   ├── religioso.html          ← #AcontecerReligioso
│   ├── politico.html           ← #AcontecerPolítico
│   ├── cultural.html           ← #AcontecerCultural
│   ├── social.html             ← #AcontecerSocial
│   ├── economico.html          ← #AcontecerEconómico
│   └── deportivo.html          ← #AcontecerDeportivo
├── articulos/
│   └── plantilla.html          ← Plantilla base (no borrar)
└── herramientas/
    ├── editor.html             ← Editor v9 (publicación y posts de redes)
    └── generar-clave.html      ← Utility local para encriptar el token
```

---

## ✏️ Cómo publicar una nota nueva

### Flujo recomendado — editor v9 (desde el celular o la compu)

1. Abrí **https://plumalibre.github.io/herramientas/editor.html**
2. Ingresá tu clave (desbloquea el token de GitHub encriptado).
3. Usá las pestañas:
   - **📝 Escribir** — título, subtítulo, sección, cuerpo (con toolbar: H2, H3, cita, negrita, cursiva, imagen, video, línea, 2 columnas).
   - **👁 Preview** — ves cómo queda la nota antes de publicar.
   - **🚀 Publicar** — el editor commitea el `.html` al repo vía API de GitHub. GitHub Pages redeploya solo en ~1 minuto.
   - **📱 Redes** — genera posts listos para Facebook, X, Instagram y Threads (con hashtags y conteo por plataforma).
   - **📋 Historial** — lista notas publicadas, permite editar y borrar.

### Markup especial del editor

- `## texto` → subtítulo H2
- `### texto` → subtítulo H3
- `> texto` → cita destacada
- `**texto**` → negrita · `_texto_` → cursiva
- `[IMAGEN:nombre.jpg]` → imagen inline (usa un archivo de `assets/`)
- `[VIDEO_YOUTUBE:id]`, `[VIDEO_FACEBOOK:url]`, `[VIDEO_TIKTOK:url]` → embed de videos
- `[COL2]...[/COL]...[/COL2]` → 2 columnas
- `---` → separador

### Flujo manual (alternativa, solo si el editor no funciona)

1. Copiá `articulos/plantilla.html` → renombralo `mi-nota.html`.
2. Editá el título, subtítulo, sección, imagen y cuerpo.
3. Commit/push al repo (`plumalibre/plumalibre.github.io`).
4. Agregá una card a `index.html` en la grilla "Últimas Noticias" con el link a la nota.

---

## 🚀 Deploy

**Automático**: cada `git push` a `master` actualiza el sitio en GitHub Pages en 1–2 minutos.
El editor v9 hace el push por vos; no hace falta tocar git para publicar.

## 🖼️ Imágenes

- Subilas a `assets/` con nombres descriptivos en minúsculas (ej: `semana-santa-2026.jpg`).
- Formato recomendado: `.jpg` (fotos) o `.png` (logos / gráficos).
- Tamaño objetivo: **800×450 px** (horizontal) para notas, **720×720** o mayor para logos.
- Peso objetivo: **< 500 KB** por imagen (usa https://squoosh.app si necesitás comprimir).

## 📬 Formulario de contacto

El form en `sobre-nosotros.html` envía a Formspree (endpoint `xdayypog`).
Los mensajes llegan al correo configurado en el dashboard de Formspree:
**https://formspree.io/forms/xdayypog**

- Tiene honeypot anti-spam (`_gotcha`), submit via AJAX, mensajes de error por campo y confirmación visual al enviarse.

## 📊 Google Analytics 4

- ID: `G-TZRTJLP5KT`
- Dashboard: **https://analytics.google.com** (iniciá sesión con `prensaplumalibre@gmail.com`).
- Para debug en tiempo real: abrí el sitio con `?debug_mode=1` y revisá GA4 → Admin → DebugView.

---

## ❓ Preguntas frecuentes

**¿Cuánto cuesta GitHub Pages?**
Nada. Es gratis y sin límite práctico de tráfico para sitios estáticos.

**¿Puedo publicar desde el celular?**
Sí. El editor v9 está pensado para eso — abrilo en el navegador móvil y publicás desde ahí.

**¿Qué pasa si me equivoco publicando?**
Todo queda en el historial de git (`https://github.com/plumalibre/plumalibre.github.io/commits`). Podés revertir desde el editor ("📋 Historial" → borrar o editar la nota) o desde GitHub.

**¿Puedo agregar más secciones?**
Sí: copiá cualquier `secciones/*.html`, cambiá el nombre y el contenido. Después agregá un `<li>` al `<nav>` de las páginas y un `<url>` al `sitemap.xml`.

**¿Puedo cambiar los colores?**
Sí. Editá `style.css`, sección `:root` al inicio — ahí están las variables `--brand`, `--accent`, `--bg`, `--card`.

**El formulario no me llega al correo.**
Revisá que el dashboard de Formspree (endpoint `xdayypog`) tenga tu correo verificado y que el mail no haya ido a spam. El plan gratuito de Formspree permite 50 envíos/mes.

**El editor me pide una clave que no me acuerdo.**
La clave desencripta el token de GitHub. Si la perdés, hay que generar un token nuevo en GitHub (Settings → Developer settings → Tokens) y re-encriptarlo con `herramientas/generar-clave.html`.
