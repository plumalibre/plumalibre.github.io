# Pluma Libre — Contexto del Proyecto

> Este archivo le da contexto a Claude Code sobre el proyecto. Mantenerlo actualizado.

## Qué es Pluma Libre

Medio de comunicación digital independiente de Sonsonate, El Salvador. Equipo de 2 personas.
Cobertura local, nacional e internacional. Periodismo crítico sin ataduras políticas ni institucionales.

**Sitio:** https://plumalibre.press
**Repo:** https://github.com/plumalibre/plumalibre.github.io
**Hosting:** GitHub Pages (solo HTML/CSS/JS, sin backend, sin CMS)

## Stack técnico

- HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
- Tipografías: Newsreader (titulares) + Outfit (cuerpo)
- Deploy: cada `git push` a main actualiza el sitio automáticamente vía GitHub Pages
- SEO: JSON-LD Schema.org, Open Graph, sitemap.xml, robots.txt

## Paleta de colores

```css
--brand: #081A41;   /* azul oscuro, exactamente el fondo del logo PWA */
--accent: #0071E3;  /* azul Apple, links/CTA */
--bg: #F5F5F7;      /* gris claro fondo */
--card: #FFFFFF;    /* blanco tarjetas */
```

## Estructura del repo

```
/
├── index.html                  # Homepage
├── sobre-nosotros.html         # Sobre + contacto (form FormSubmit → redaccion@plumalibre.press)
├── style.css                   # Estilos globales v3
├── robots.txt
├── sitemap.xml
├── rss.xml                     # Feed RSS (30 notas) — lo actualiza el editor al publicar
├── llms.txt                    # Descripción del medio para modelos de lenguaje
├── herramientas-generar-feed.py # Regenera rss.xml y llms.txt desde articulos/
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

## Editor (repo propio: plumalibre/editor)

**Ya NO vive en `herramientas/` de este repo.** Es un repo aparte desplegado en Cloudflare Pages: https://editor-5gq.pages.dev — archivo único `editor.html` (~2700 líneas, todo inline), PWA instalable con service worker (`sw.js`, bumpear `CACHE_VERSION` en cada cambio del editor) y login con contraseña.

4 pestañas:
1. **📝 Escribir** — editor rico con toolbar (H2, H3, cita, negrita, cursiva, foto, video, línea). Publicar/preview son botones del flujo. Al publicar también actualiza la página de sección (`secciones/*.html`) y `sitemap.xml` (desde 2026-07-02).
2. **📱 Redes** — genera posts automáticos para Facebook, X, Instagram y Threads.
3. **📋 Historial** — lista notas publicadas (online y borradores en `articulos-borrador/`), permite editar y borrar (borrar también limpia sección y sitemap).
4. **📊 Stats** — dashboard GA4. Requiere el Worker de Cloudflare de `worker/` (ver `worker/GUIA-STATS.md` en el repo del editor).

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

## Regla permanente: cada vez que se pide copy o arte (9-ago-2026)

Siempre que el director pida **copy o arte**, entregar el paquete completo en el mismo mensaje,
sin que lo tenga que pedir por partes:

1. **Copy para el post**, en negrita Unicode (`scratchpad/bold.py`), listo para pegar.
2. **Los textos para las herramientas del editor**, porque son campos distintos y no se repiten:
   - **Etiqueta** (2-4 palabras, mayúsculas) para la placa.
   - **Titular de placa** (máx. ~60 car., se lee en miniatura).
   - **Bajada de placa** (1 línea, opcional).
   - **Pie/crédito** exacto.
   - **Formato** recomendado: 4:5 feed · 9:16 historias y Reels · 16:9 portada del sitio.
3. **Enlace directo** a la imagen si ya está en el repo.

**Lo que el director hace en el editor y NO cuesta tokens:** el mosaico (🧩, botón junto al campo
de imagen, 2-4 fotos con Canvas en el navegador) y las placas (🎨 Placas → `editorial-templates.html`).
Corren en su teléfono. Que Claude arme el arte con Pillow cuesta 30-50 mil tokens por pieza; que
lo haga él, cero. **Regla: el arte lo hace él en el editor, salvo que pida lo contrario.** Corregir
algo concreto que ya existe es mucho más barato que armarlo de cero.

**Avisar el costo estimado antes de cualquier trabajo pesado** (auditorías, artes, tandas de
agentes) y esperar su ok.

## Línea editorial

- **Tono:** Profesional, directo, accesible
- **Secciones fijas (10 desde el 31-jul-2026):** Política, Economía, Deportes, Social, Religión, Cultura, Internacional, **Opinión**, **Tecnología** y **Entrevistas**. (Antes se mostraban como `#AcontecerX`; el branding cambió en mayo 2026: ahora son sustantivos sin `#` ni "Acontecer". El editor genera los hashtags de redes con el sustantivo limpio: `#Política`, `#Economía`, etc.)
- **Hashtags base:** #PlumaLibre #Sonsonate #ElSalvador
- **Relaciones comerciales:** Pauta con Alcaldía de Sonsonate Centro (Alcalde Roberto Aquino). NO con Sonsonate Este.

## Cuentas GitHub

- **plumalibre** (prensaplumalibre@gmail.com) — cuenta del medio, usar para todo
- **Procesion-Sonsonate-Semana-Santa** (njrmancia@gmail.com) — cuenta personal del dev, NO TOCAR

## Banners publicitarios (banners.json)

El sitio tiene tres slots de banner que se controlan desde `banners.json` en la raíz del repo:

- **Banner A** — aparece arriba de todo en el home, antes de la barra de fecha. Usa un lienzo panorámico **4:1 de 1200×300 px** y se reduce proporcionalmente en tablet y celular, sin deformarse. Se oculta al bajar la página y reaparece al volver al inicio.
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

`banners.json` acepta una sola `imagen` por banner. Para Banner A se recomienda **1200×300 px (4:1), JPG/PNG y hasta 250 KB**: el sitio usa el aspect ratio real y la escala proporcionalmente en los 3 viewports, sin deformarla ni recortarla. Banner B mantiene 728×90 y su variante móvil. Si en el futuro se quiere una creatividad distinta por viewport, el JSON tiene que evolucionar a `{ billboard, leaderboard, mobile }` y el script cambiar en consecuencia.

## Historial reciente importante

- 2026-11-18: **revisión del sitio (337 páginas) y tanda de arreglos.** Las páginas de sección ahora
  muestran 12 notas y un botón «Ver más noticias» (Política medía 53 pantallas en celular; el código
  está al final de `assets/install.js`). Se quitó de Deportes y del sitemap la card de FAS, cuya nota
  ya no existe; se agregaron 3 notas que faltaban en el sitemap; JSON-LD en 23 notas que no lo tenían;
  placa oscura en la etiqueta del carrusel y el pie ya no queda bajo el botón de subir.
  **Quedó pendiente de decisión del director:** la nota «Renuncia el presidente de Uruguay» (5-nov)
  parece ser la de Paraguay con el país equivocado; hay dos notas iguales de Wil Morán (`wil-` y
  `will-`, solo la segunda tiene card); y los banners A y C enlazan al Facebook del medio aunque el
  arte es de IMELTEX. **Ojo:** `sw.js?v=` en `index.html` estaba en 42 con `CACHE_VERSION` en 46 —
  la prueba `tests/layout-modernization.test.cjs` fallaba; ahora ambos van en 47.
- 2026-08-06/07: **la nota de las órdenes de Trump, y dos reglas que salieron de ella.** Herbert
  publicó desde el editor un texto que le llegó ya redactado con una placa de «Última hora». Traía
  dos errores graves: que las órdenes «contemplan retirar la ciudadanía automática en territorios
  como Puerto Rico» —**falso**, la categoría real son los territorios donde la ciudadanía no la
  confiere ley federal, o sea **Samoa Americana**; los puertorriqueños son ciudadanos por ley desde
  1917— y la portada, que era **la placa de otro medio** con su banner rojo y su titular quemados.
  Se corrigió, y después se **reescribió entera** porque la corrección quedó en «no pasa nada».
  El ángulo que la salvó: el TPS vence el **9 de septiembre** y **dos de las organizaciones que la
  orden llama «enemigos extranjeros» son salvadoreñas** —MS-13 (designada 20-feb-2025) y Barrio 18
  (24-sep-2025)—, con el caso de **Kilmar Abrego García** como respuesta a quién decide la
  pertenencia. Ese cruce no lo hizo nadie más.
- 2026-08-05: **ya se puede medir redes.** El Worker tiene el endpoint `/fb/insights` y el editor
  una tarjeta «Rendimiento en Facebook» en Stats. **Lo que dicen los primeros datos confirma la
  tesis del director: lo que jala es Bukele.** En TikTok, tres videos sobre Bukele/pandillas hacen
  **36.5 K, 23.5 K y 7.4 K** vistas mientras todo lo demás se queda entre 200 y 900. En Facebook,
  el video del CECOT tuvo **8,552 de alcance y 28.3 segundos de reproducción promedio** — el triple
  que el resto de los videos, que rondan 7 a 10 segundos. La nota de Bertha Deleón (formato foto)
  hizo **1,500 reacciones y 5,909 clics**, el post más fuerte del mes. **Ojo con la conclusión
  fácil:** el alcance grande no se traduce en visitas al sitio, y las notas internacionales de
  relleno (volcán, camiseta de España) rinden 99-921 de alcance. Ver el CLAUDE.md del editor para
  el detalle técnico.
- 2026-08-05: **nota de Kumamoto publicada** (Internacional), la que estaba pendiente desde el
  30-jul. Se escribió con el ángulo acordado —«una nota de El Salvador contada desde Japón»—:
  el sismo del 28-jul dejó 38 muertos y tumbó un Aeon Mall con 3,000 personas adentro en el país
  con el código de construcción más estricto del mundo, mientras **la Norma Técnica para Diseño
  por Sismo salvadoreña es de 1994 y el propio MARN admite que "presenta deficiencias en la
  estimación de la amenaza sísmica del país"**. El cierre es el detalle de las dos empleadas a las
  que su patrón mandó de vuelta al edificio dañado a guardar el efectivo. **El arte se hizo con
  Pillow, no con Gemini** (que sigue sin crédito): gráfico de datos comparando las dos normas.

- 2026-08-04: **tres notas nuevas y una tanda de herramientas**. Se publicó la **encuesta de la UES
  sobre los 11 alcaldes de occidente** (Política) — reescrita dos veces: la primera versón lideraba
  con el promedio regional 5.48 y el director la bajó por no tener pegue, así que el titular pasó a
  «Sonsonate Centro reelegiría a Aquino» con el dato local al frente. Sale del estudio del
  **Laboratorio de Opinión Pública de la Facultad Multidisciplinaria de Occidente** (junio 2026, no
  del CIMU como se creía al inicio) y compara contra la edición de 2025 del mismo instrumento:
  Sonsonate Centro subió de 5.47 a 6.31. Es cobertura de un dato público que la alcaldía —que pauta—
  pidió ventilar; **no se publicó el texto que ellos pasaron**.
  También salió la **nota de servicio sobre la estafa del código de verificación de WhatsApp**
  (Social), a partir del aviso de una lectora — sin su nombre, sin capturas y sin el número, porque
  esas líneas suelen estar suplantadas. Y la **erupción del volcán de Fuego** (Internacional), con
  659 evacuados y alerta anaranjada, foto de archivo de 2017 marcada como tal en la propia imagen.
- 2026-08-04 (noche): **cuarta nota del día** — casi 400,000 evacuados en China por las lluvias
  torrenciales (Internacional), a partir de un video que circulaba en X. La nota corrige y amplía el
  post original: da las cifras del Ministerio de Recursos Hídricos (270,000 en Sichuan desde el 29-jul
  y 115,756 en Shaanxi), y **aclara que buena parte del material que circula es de Harbin y del 4 de
  julio**, a 2,000 km de las evacuaciones. Portada: gráfico propio, porque no había foto del episodio
  con licencia usable.
- 2026-08-04: **qué se lee de verdad (GA4, 90 días).** Top del sitio: proveedores de uniformes **290**
  —casi 3× el segundo—, Bertha Deleón 79 en un día, Manuel Gil en HABLEMOS 70, el corte de energía de
  AES CLESA en Nahuizalco 44. **Ninguna nota internacional en el top 10**, de once publicadas. La nota
  más leída del sitio es uno de los tres temas priorizados: ahí está el trabajo de mayor valor.
  **Ojo:** esto mide el sitio, NO redes — un video puede hacer miles de vistas en Facebook sin mandar
  una visita. Falta construir la medición de redes (ver el CLAUDE.md del editor).
- 2026-08-07: **regla del qué está en juego.** Una nota que concluye que **no pasa nada no es una
  nota**. Si al terminarla el resumen honesto es «todo sigue igual», falta el conflicto: hay que
  buscar qué está en juego, para quién y con qué fecha. Pasó dos veces en la misma semana — la de
  la UES lideraba con el promedio regional en vez del dato local, y la de Trump quedó titulada «no
  le quita la ciudadanía a los hijos del TPS», factualmente impecable y editorialmente muerta.
- 2026-08-07: **regla de los textos que llegan armados.** Un texto que llega ya redactado —de un
  contacto, de un grupo, de una placa que circula— es un **borrador, no una nota**. Tres preguntas
  antes de subirlo: **¿lo dice la fuente primaria o solo el que me lo mandó? ¿tenemos derecho a
  usar esta imagen? ¿dónde está el puente con El Salvador?** Si alguna falla, no sube. En el caso
  de las órdenes de Trump los dos errores graves venían dentro del paquete, no de la redacción.
- 2026-08-04: **regla para notas internacionales.** Rinden cuando tienen puente con El Salvador: se
  sintió acá, hay salvadoreños adentro, toca el bolsillo, sirve de vara para medir, o hay un personaje
  conocido. Sin puente no se leen. Ejemplo de vara: los 385,756 evacuados de China contra los 470,455
  habitantes del departamento de Sonsonate (censo 2024).
- 2026-08-04: **el arte ilustrado se hace con Gemini, las caras no.** Se probó recortar con Gemini una
  foto real del alcalde Aquino y **le inventó los ojos, las cejas y el pelo**: quedó descartado. La
  regla que sirvió: Gemini para ilustración conceptual (la de la estafa salió perfecta a la primera,
  etiquetada como generada con IA en el pie de foto), y para fotos de personas reales solo revelado
  normal — contraste, brillo, enfoque— sin generar píxeles.

- 2026-08-02/03: **más secciones y notas nuevas**. Se publicaron: el editorial del Día del Periodista (Opinión), el imán de fusión de China y el Proyecto Panamá de Anthropic (Tecnología), la pólvora en las fiestas de Chinameca —25 a 30 quemados, corregido a tiempo porque la primera fuente decía cinco— y el memorándum 10-2026 que dejó sin efecto las reglas de los desfiles cívicos. Desde la PC se publicó además **«Las dos caras de Bukele»**, el documental de Univision y El Faro (Política, con arte ilustrado propio).
- 2026-08-03: **auditoría editorial de las 99 notas**. Hallazgos: 89 titulares pasan de 70 caracteres (promedio 87, Google los corta); 71 notas no tienen ningún subtítulo H2; 91 no tienen cita textual destacada; 21 sin bajada y 10 sin pie de foto; promedio de 311 palabras. Se quitó del sitemap la URL `internas-de-nuevas-ideas-colapsan-el-centro-de-sonsonate.html`, que es un stub de redirección por cambio de slug y no una nota.
- 2026-08-03: **decisión editorial** — no dar cobertura al retroceso de los desfiles cívicos por considerarlo cortina de humo. Se priorizan tres temas pendientes: los despidos de docentes e instructores, la exclusión de proveedores del paquete escolar y los préstamos aprobados. Ver la sección de temas pendientes.
- 2026-07-31 (Día del Periodista): se crearon **3 secciones nuevas**, todas con contenido desde el día uno: **Opinión** (abre con el editorial del Día del Periodista, sin firma — badge propio, byline "Editorial · Pluma Libre", JSON-LD `OpinionNewsArticle`), **Tecnología** (imán de fusión de China + Proyecto Panamá de Anthropic) y **Entrevistas** (sembrada con las 2 entrevistas reales de HABLEMOS: Ever Castillo y Manuel Gil; los anuncios de "estará en HABLEMOS" quedaron fuera por ser avisos, no entrevistas). El sitio pasó de 7 a 10 secciones.
- 2026-07-31: **la portada del home llevaba 5 días congelada** en la nota del FMLN del 26-jul, porque nada sube solo al hero. Se promovió el editorial a principal y se refrescaron las secundarias. **Recordar marcar el estado (portada/secundaria/grid) al publicar desde el editor**, o el home se envejece solo.
- 2026-07-28/30: sesión larga de publicación. **6 notas nuevas**: Krisma Mancía (Cultura, obituario con el ángulo del despido del Ministerio de Cultura), Claudia Ortiz vs. fotógrafos de la Asamblea (Política, primicia — ningún medio lo levantó), Seminario de Vida en el Espíritu Santo de la Parroquia La Resurrección (Religión), Ángel Madrid candidato de ARENA casilla 2 (Política, seguimiento de la del 25-jul donde pedía casilla 3), 51 años de la masacre del 30 de julio de 1975 en la UES (Social) e incendios en Europa/Gironda (Internacional).
- 2026-07-30: **SEO e indexación**. Auditoría del sitio: 7 notas no estaban en `sitemap.xml` (ya agregadas) y solo 11 de 96 URLs tenían `<lastmod>` (ahora 91). Se creó **`rss.xml`** (30 notas, validado), **`llms.txt`** (para que Gemini/ChatGPT citen con crédito) y `herramientas-generar-feed.py` que regenera ambos desde `articulos/`. `<link rel="alternate">` en las 102 páginas y `robots.txt` declara sitemap + RSS. **Confirmado que Google indexa el sitio** (aparece en resultados). **Pendiente crítico: dar de alta Google Search Console** — sin eso no se puede medir posicionamiento.
- 2026-07-30: ojo con la marca. Compiten en buscadores `plumalibrenews.com` (Westchester, NY), `plumalibre.com` y "Pluma Libre Newspaper". Además existe una página `facebook.com/plumalibre.net` asociada a Sonsonate que conviene cerrar o redirigir para no dividir la señal con `plumalibre.press`.
- 2026-07-30: **conflicto de merge** con notas publicadas desde el editor (VAMOS diáspora, Madrid en HABLEMOS, parque Rafael Campo). Se resolvió conservando todas las cards. **Hacer `git pull` antes de tocar `index.html`** si alguien más está publicando.
- 2026-07-18 (tarde): publicadas 4 notas nacionales: deuda pública $34,630M (Economía, foto BCR Wikimedia CC BY-SA 4.0), sequía en el oriente (Social, foto USDA Wikimedia CC BY-SA 2.0), Asamblea aprueba $1.35M para estadios con contraste Colonia Izalco (Política, foto aérea de estadio de la nota oficial de la Asamblea — la primera versión usó una foto del Salón Azul de 2015 con Sánchez Cerén y se reemplazó el mismo día) y Claudia Ortiz vs. Vamos (Política, foto LPG/Wikimedia CC BY 3.0). Cards en home + sección + sitemap. Fuentes: BCR/elsalvador.com, MARN/Infobae, EDH/Asamblea, Diario El Mundo.
- 2026-07-18: publicadas 2 notas de Social: condena de 26 años por abuso de menor en Sonsonate Centro (portada/hero, imagen = arte oficial FGR recortado, `assets/nota-condena-fgr-sonsonate.jpg`) y desarticulación de red de narcotráfico en Sonsonate (2 fotos oficiales de la FGR: `assets/nota-narco-operativo-sonsonate.jpg` principal + `nota-narco-droga-incautada.jpg` inline). Cards en home + Social + sitemap. Fuentes: FGR (Facebook oficial), La Noticia SV, Infobae. El sismo de Chiapas salió del hero pero sigue en grid y sección.
- Migración completa de Netlify (suspendido) a GitHub Pages
- Editor pasó de v8 a v9: integración del generador de posts como 5ta pestaña
- Eliminación de `herramientas/redes.html` (redundante tras integración)
- 2026-04-23: limpieza de contenido de prueba (holalala.html + 2 cards rotas en home + imagen huérfana)
- 2026-04-23: Google Analytics 4 activo (`G-TZRTJLP5KT`)
- 2026-04-23: formulario de contacto migrado de Netlify Forms a Formspree (endpoint `xdayypog`)
- 2026-07-03: publicada nota de Deportes "Cabo Verde cae 3-2 ante Argentina en la prórroga" (Mundial 2026) con 2 fotos propias (`assets/nota-caboverde-argentina.jpg` y `nota-caboverde-celebracion.jpg`); card agregada a home + sección Deportes + sitemap. **Ojo:** el crédito de foto quedó como "Selección de Cabo Verde (FCF)" — verificar/ajustar la fuente real de las imágenes.
- 2026-07-03: agregadas 6 notas para nivelar secciones (mezcla local/nacional/internacional), todas con fotos de Wikimedia Commons con crédito CC/CC0: Política (reforma reelección indefinida), Economía (FMI ~4% + Bitcoin 7,600 BTC), Internacional (ofensiva rusa sobre Kiev; Keiko Fujimori presidenta de Perú), Religión (excomunión Sociedad San Pío X, seguimiento de la nota lefebvrista), Cultura (Fiestas Julias 2026). Cards en home + su sección + sitemap. Quitado el "Próximamente" de `internacional.html`. Generadas con script que reutiliza la estructura de la nota de Cabo Verde. Todas las secciones quedaron en 2-3 notas.

## Pendiente de trabajar: estrategia de contenido para redes (pedido 4-ago-2026)

El director pidió una sesión dedicada a **ideas de contenido y formatos que usan los medios grandes**
para publicar notas —propias, recicladas o a partir de videos que circulan— con el objetivo de
rendir en el algoritmo. Puntos a cubrir cuando se haga:

- Formatos recurrentes baratos (el dato del día, el antes y después, «nos escribieron preguntando»).
- Cómo se recicla archivo propio sin que se lea como repetido (efeméride, cuando el tema vuelve al
  noticiero, seguimiento de una nota vieja).
- Qué hacer con **videos ajenos que circulan**: el límite legal y el que conviene — pedir permiso por
  mensaje, usar fragmento corto con crédito visible, y siempre agregar valor (verificar, contextualizar)
  en vez de re-subir el video pelado, que es lo que hace que bajen la cuenta.
- Qué medir para saber si un formato sirve, con lo que ya hay: GA4 en el sitio y el rendimiento de
  cada pieza en Facebook y TikTok.

Contexto: TikTok arrancó — 67 seguidores con un clip de Bukele. Se probó el formato placa con
narración de IA (nota de Bertha Deleón); falta medir cómo rinde contra el clip de video real.

## Temas priorizados (decisión del 3-ago-2026)

1. **Despidos** — Bases Magisteriales denunció que entre el 27 y 28 de julio se despidió a **más de 24 instructores de cachiporristas en Sonsonate** por pertenecer a la comunidad LGBTIQ+, con instrucción a los directores. Solo en Sonsonate. El MINED no se ha pronunciado y el memorándum 10-2026 no los menciona. Vocero: David Rodríguez. Aparte, el caso de las maestras del Centro Escolar Rafael Campo, ya tocado en HABLEMOS con Ángel Madrid. **Nadie ha buscado a los despedidos.**
2. **Proveedores del paquete escolar** — la Coordinadora Nacional de Proveedores de Útiles Escolares denuncia que **600 a 700 pequeños comerciantes** quedaron fuera del programa 2026, con $12 millones destinados a útiles. Gato Encerrado documentó la adjudicación a **cinco empresas**. La ministra desmiente exclusión de productores nacionales. Pluma Libre ya publicó la convocatoria a la concentración del 29 de julio: hay hilo abierto.
3. **Préstamos** — el 28 de julio la Comisión de Hacienda avaló operaciones por **$733.8 millones** con dictamen favorable unánime (BCIE $155M movilidad urbana, $185M agua de Guluchapa, ratificación de $340M, CAF $75M para DoctorSV) más una redistribución de $226M de excedente tributario, de los cuales **$69 millones van a Educación para los paquetes escolares de 2027**.

**El cruce que nadie ha hecho:** el Estado destina $69 millones a los paquetes escolares de 2027 mientras 600-700 proveedores pequeños denuncian que los excluyeron de los de 2026.

## Nota pendiente: entrevista a Ángel Madrid en HABLEMOS (31-jul-2026)

La entrevista se grabó el viernes 31. Falta escribir la **nota derivada** (nota de declaraciones)
a partir de la transcripción. Decisiones ya tomadas en la sesión:

- **Formato:** nota de declaraciones, no transcripción. Titular entrecomillado con una frase
  **textual** — si se cambia una palabra, se van las comillas.
- **NO usar el conteo de seguidores** (53 mil en su página verificada de Facebook). Decisión del
  director: contar seguidores ajenos desde un medio que también los tiene se lee como comparación
  y no le aporta nada al lector.
- **Sí sirve como contexto**, y sale de su propia biografía pública: es abogado de la República,
  **periodista y columnista de El Diario de Hoy**, y tiene el podcast *#PupusasPolíticayCafé*.
  Ojo: siendo colega, la nota debe sostenerse sola por lo que diga, sin apoyarse en su condición
  de periodista.
- **No repetir** lo ya publicado: pidió la casilla 3 en las internas y quedó ratificado en la
  casilla 2; anunció gira territorial; dijo que "Sonsonate merece diputados que no solo lleguen a
  presionar un botón".
- **Balance electoral:** sería la tercera nota de Madrid en una semana contra una de Kompagil
  (FMLN). El director explicó que a Manuel Gil se le dio el mismo trato en su momento, así que el
  criterio es parejo. Aun así, conviene que la próxima sea de otro candidato.

Flujo acordado: la transcripción se hace en la PC (subtítulos automáticos de YouTube o Whisper
local) y se pega en crudo — sin limpiar — para que Claude ordene, identifique hablantes y saque
el titular.

## Pendientes abiertos de la sesión del 30-jul-2026

1. ~~**Google Search Console** — sin dar de alta.~~ ✅ **Resuelto 2026-08-01**: propiedad de dominio `plumalibre.press` verificada por TXT en Cloudflare DNS, en la cuenta `prensaplumalibre@gmail.com` (la misma del GA4). Sitemap y `rss.xml` enviados. El «1 error» del sitemap era una URL con el dominio viejo `plumalibre.github.io` (nota de Ever Castillo), corregida en commit `55633a2`. Los datos de posicionamiento empiezan a aparecer en 2-3 días.
2. **Nota de Krisma Mancía** — el titular todavía empieza con "Muere", que en un obituario de días atrás sugiere que pasó hoy. Se propuso cambiarlo a formato `Krisma Mancía (1980-2026)` y quedó sin decidir.
3. **Nota de la UES (30 de julio)** — la portada compone 3 fotos de marchas conmemorativas aportadas por la redacción. **Faltan dos datos**: si son de la jornada de 2026 o de archivo (la gente lleva mascarilla, lo que sugiere 2021-2022) y **de quién son, para acreditarlas**. El pie de foto actual no atribuye fecha a propósito.
4. **Nota del Seminario del Espíritu Santo** — el video decía "FALTA 1 DÍA" cuando faltaban dos. Verificar con el hno. Adelso Torres (7852-7509) si hubo actividad el jueves 30.
5. ~~**Nota de Japón/Kumamoto** — nunca se hizo.~~ ✅ **Resuelto 2026-08-05** desde la PC: `articulos/terremoto-kumamoto-japon-norma-sismica-el-salvador.html`, con el ángulo acordado el 4-ago — no como noticia de Japón sino como «nota de El Salvador contada desde Japón»: un 7.1 tumbó un centro comercial en el país con el código de construcción más estricto del mundo, y El Salvador es de los más sísmicos del continente. Ese fue el puente.
6. ~~**Editor** — falta mergear la rama del RSS automático a `main`.~~ ✅ **Resuelto 2026-08-04**: la rama `claude/kumamoto-earthquake-july-cd59ip` quedó fusionada en `main` (editor) y en `master` (sitio y pluma-video). No hay nada pendiente de mergear.
7. **Equilibrio electoral** — ya van 2 notas de Ángel Madrid (ARENA) y 1 de Kompagil (FMLN) rumbo a 2027. Conviene balancear la cobertura de candidaturas de Sonsonate.
8. **Fiestas Agostinas — clips de la transmisión de Catedral** (quedó a medias el 5-ago). Video de origen: `https://www.facebook.com/share/v/18udCrncNy/`, unas 3 horas. Marcas ubicadas por muestreo: **La Bajada ≈ 2:18:20** y **La Transfiguración ≈ 4:14:20** — el clip que salió de esa segunda marca **no dio lo esperado**, así que hay que reconfirmarla antes de volver a bajar. Falta además el timestamp de la llegada nocturna a Catedral. Crédito obligatorio en el clip: **«Catedral Metropolitana de San Salvador»**. ✅ **Ya no está bloqueado** (7-ago): la sesión de PC levantó la VM y migró el servicio al túnel con nombre `video.plumalibre.press`, así que `pluma-video` responde. Ojo con el recorte por tiempo: en transmisiones de Facebook es impreciso, conviene bajar un tramo generoso y recortar después.

## Imágenes: cómo llegan a Claude

### Fotos DESCARGABLES y gratis (para Facebook y para portadas)

**El embed de Getty NO sirve para esto:** no entrega archivo, solo se muestra desde su iframe.
Cuando se necesita una foto que se pueda bajar y subir a redes, el orden es este:

1. **Fotos oficiales de la institución que protagoniza la nota.** PNC, FGR, Comandos de
   Salvamento, Bomberos, Protección Civil, Asamblea, alcaldías. Se bajan de su propia
   publicación, son descargables y se usan **con crédito** («Foto: Policía Nacional Civil»).
   Es la mejor fuente para lo local y la que más se ha usado.
2. **Wikimedia Commons** — para personas conocidas, lugares y temas internacionales. Licencias
   CC (hay que copiar autor y licencia al pie) o dominio público. Buscar con la API:
   `commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=<tema>&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&format=json`
3. **Obras del gobierno federal de EE. UU.** — dominio público, sin restricción (ver abajo).
4. **Openverse** (`api.openverse.org/v1/images/?q=<tema>&license_type=all-cc`) — busca CC en
   Flickr, Wikimedia y otros a la vez. Útil cuando Commons no tiene nada.
5. **Unsplash, Pexels, Pixabay** — gratis y sin atribución obligatoria, pero son fotos de banco:
   sirven para ilustrar un concepto, **nunca para representar un hecho concreto**.
6. **Arte propio** (Pillow o el editor) cuando ninguna de las anteriores da algo honesto.

**Lo que nunca:** la placa de otro medio, la foto de agencia sin licencia, ni una imagen de IA
fotorrealista presentada como si documentara el hecho.

**Fotos de agencia GRATIS para las notas del sitio: el embed de Getty (verificado 8-ago-2026).**
Getty Images tiene un programa de embed activo con más de 70 millones de fotos editoriales que se
pueden incrustar legalmente en páginas web: en gettyimages.com se filtra por «embeddable», se copia
el código del botón Embed y se pega dentro del cuerpo de la nota. Tres límites: **solo funciona en
el sitio** (Facebook no acepta embeds), **no sirve de portada ni de og:image** (la portada sigue
siendo arte propio), y es solo para uso editorial. Ideal para internacionales: la foto de agencia
que todos tienen, legal y gratis, dentro de la nota.

**PENDIENTE para poder usarlo desde el editor:** el markup del editor solo entiende
`[IMAGEN:]`, `[VIDEO_YOUTUBE:]`, `[VIDEO_FACEBOOK:]`, `[VIDEO_TIKTOK:]`, `[COL2]` y `---`.
**No hay forma de pegar el `<iframe>` de Getty desde la pestaña Escribir.** Hace falta agregar
un token `[GETTY:<id>]` que `genHTML()` traduzca al embed oficial. Mientras no exista, el embed
solo se puede poner editando el HTML de la nota directamente en el repo.

**Fotos de funcionarios de Estados Unidos: hay salida legal y gratis.** Las fotos oficiales de la
Casa Blanca y de las agencias del gobierno federal estadounidense son **de dominio público** y se
pueden usar acreditando al autor. Se bajan de Wikimedia Commons. Sirve cada vez que se necesite una
foto de un funcionario gringo, en lugar de tomar la de una agencia o —peor— la placa de otro medio.
La que se usó el 7-ago: retrato presidencial oficial de 2025, **Daniel Torok / Casa Blanca**.

Pegar una imagen con Ctrl+V **no genera archivo** — Claude la ve pero no puede guardarla en el repo. Hay que mandarla **con el clip de adjuntar** (desde el celular funciona bien) o subirla a Google Drive, que Claude sí puede leer. También sirve subirla directo a `assets/` desde GitHub web con el nombre exacto que espera la nota.

## Pendientes críticos (Tier 1)

1. ~~**Google Analytics 4** — placeholder hardcoded en TODAS las páginas, pendiente de reemplazar.~~ ✅ **Resuelto 2026-04-23**: GA4 activo con ID `G-TZRTJLP5KT` (cuenta `prensaplumalibre@gmail.com`). Integrado en homepage, 5 secciones, sobre-nosotros, plantilla de artículos y en el template `genHTML()` del editor v9 (así cada nota nueva nace ya trackeada).
2. **Contenido placeholder** — ~~sobre-nosotros genérico~~ ✅ sobre-nosotros ya tiene contenido real (historia, equipo, redes; revisado 2026-07-02: se agregó Internacional a la lista de secciones, JSON-LD AboutPage, "cofundador"→"codirector" y se unificó Facebook a `facebook.com/plumalibre.press` en todo el sitio y en el editor). ~~Cards de ejemplo con fotos azules en secciones~~ ✅ **Resuelto 2026-07-02**: se publicó 1 nota real por sección (7 notas, fotos de Wikimedia Commons con crédito CC en el pie de foto) y las cards placeholder de `secciones/*.html` se reemplazaron por cards reales. Restante: `articulos/brigada-medica-atiende-200-personas-zona-rural.html` aún usa foto placeholder naranja (nota real, falta foto), y la card "Contribuyentes... declarar la renta" tiene badge **Religión** aunque es tema económico (revisar si se reclasifica).
3. **Seguridad del token** — ✅ **Mayormente resuelto 2026-07-05**: el proxy `/gh/` del Worker `plumalibre-analytics` quedó activo con un token fine-grained de la cuenta `plumalibre` (solo repo del sitio, Contents R/W) cargado como secreto de Cloudflare (`GITHUB_TOKEN`). El editor enruta automáticamente todas las llamadas a GitHub por el proxy cuando la config del Worker (URL + API Key en 📊 Stats) está completa; el token ya no necesita vivir en el navegador. **Restante:** quitar el token XOR+base64 embebido en `editor.html` (campos `data`/`check`) y revocar ese token viejo en GitHub; borrar el token del campo ⚙️ Configuración GitHub del editor en los dispositivos donde esté guardado. Ojo: el token del proxy quedó sin fecha de expiración — rotarlo a futuro por uno con vencimiento.
4. ~~**Formulario de contacto roto** — sobre-nosotros.html usa Netlify Forms (suspendido), hay que migrar a Formspree~~ ✅ **Migrado 2×**: primero a Formspree (2026-04-23), y el 2026-07-08 a **FormSubmit** (`https://formsubmit.co/ajax/redaccion@plumalibre.press`, activado y probado) porque Formspree free no permitía cambiar el destinatario del Gmail al correo profesional. Honeypot `_honey` anti-spam, `_captcha=false`, `_template=table`.

## Correo profesional (Zoho Mail free, desde 2026-07-08)

- **redaccion@plumalibre.press** = buzón real y superadmin (webmail: mail.zoho.com; admin: mailadmin.zoho.com).
- **contacto@** y **publicidad@** = **alias** de redaccion@ (todo cae en la misma bandeja; se puede enviar "como" cualquiera). `direccion@` = usuario aparte sin usar.
- DNS en Namecheap: MX (Custom MX) + SPF + DKIM, todos verificados ✅. Opción "Quiero anunciarme / Publicidad" agregada al form; correos visibles en la web: contacto@ y publicidad@.

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
