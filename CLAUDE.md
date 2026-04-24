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

## Editor v9 (herramientas/editor.html)

**Archivo único de ~790 líneas, todo inline (HTML+CSS+JS).**

5 pestañas:
1. **📝 Escribir** — formulario con toolbar (H2, H3, cita, negrita, cursiva, foto, video, línea, 2 columnas)
2. **👁 Preview** — renderizado de la nota
3. **🚀 Publicar** — publica a GitHub vía API con token encriptado
4. **📱 Redes** — genera posts automáticos para Facebook, X, Instagram y Threads
5. **📋 Historial** — lista notas publicadas, permite editar y borrar

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
