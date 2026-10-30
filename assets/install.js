// Instalación PWA — agrega un item "📱 Instalar app" al menú dropdown.
// El item queda oculto hasta que el navegador emite `beforeinstallprompt`
// (Chrome/Edge desktop+Android). En iOS Safari el evento no existe, así que
// igual mostramos el item con instrucciones.
(function(){
  var deferred = null;
  var li = null;

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function ensureItem(){
    if (li) return li;
    var ul = document.querySelector('.nav ul');
    if (!ul) return null;
    li = document.createElement('li');
    li.className = 'nav-install';
    li.hidden = true;
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = '📱 Instalar app';
    a.addEventListener('click', function(e){
      e.preventDefault();
      if (deferred){
        deferred.prompt();
        deferred.userChoice.then(function(choice){
          if (choice.outcome === 'accepted') li.hidden = true;
          deferred = null;
        });
      } else if (isIOS()){
        alert('Para instalar:\n\n1. Tocá el botón Compartir (□↑) abajo\n2. Bajá y elegí "Añadir a pantalla de inicio"');
      } else {
        alert('Si la app no aparece como sugerencia, instalala desde el menú del navegador (⋮ → "Instalar app").');
      }
    });
    li.appendChild(a);
    ul.appendChild(li);
    return li;
  }

  if (isStandalone()) return;

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferred = e;
    var item = ensureItem();
    if (item) item.hidden = false;
  });

  // Fallback iOS: el item aparece igual aunque no haya evento.
  if (isIOS()){
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){ var i = ensureItem(); if (i) i.hidden = false; });
    } else {
      var i = ensureItem(); if (i) i.hidden = false;
    }
  }

  window.addEventListener('appinstalled', function(){
    if (li) li.hidden = true;
    deferred = null;
  });
})();

// ============================================================
// Pop-up publicitario (Banner P) — se controla desde banners.json
// (clave banner_p_popup, la administra el editor en 📢 Publicidad).
// Vive acá porque install.js lo cargan TODAS las páginas del sitio,
// así el pop-up funciona en las 100+ notas sin tocar cada archivo.
// Reglas: se muestra a lo sumo una vez cada `frecuencia_horas` por
// visitante (localStorage), con retraso de 2 s, cierre con ✕, con
// Escape o tocando el fondo. Si cambia la campaña (campo `v` que el
// editor sella con cada imagen nueva — la ruta assets/banner-p.jpg
// siempre es la misma, por eso NO sirve comparar solo la imagen),
// vuelve a mostrarse aunque no haya vencido el plazo.
(function(){
  var LS_TS='pl_popup_ts', LS_IMG='pl_popup_img';
  function esPortada(){var p=location.pathname;return p==='/'||p==='/index.html';}
  function esNota(){return /\/articulos\//.test(location.pathname)||document.body.classList.contains('article-page');}
  function isUrl(u){return typeof u==='string'&&(/^https:\/\//i.test(u)||/^(mailto:|tel:)/i.test(u));}
  function isImg(u){return typeof u==='string'&&(/^https:\/\//i.test(u)||/^[A-Za-z0-9._\/-]+$/.test(u));}
  function abs(u){return /^https?:\/\//i.test(u)||(u&&u.charAt(0)==='/')?u:'/'+u;}
  function mostrar(b){
    var st=document.createElement('style');
    st.textContent='.pl-pop-ov{position:fixed;inset:0;z-index:9999;background:rgba(8,26,65,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s}'+
      '.pl-pop-ov.on{opacity:1}'+
      '.pl-pop{position:relative;max-width:min(430px,92vw);width:100%;background:#fff;border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,.35);overflow:hidden;transform:translateY(14px) scale(.97);transition:transform .3s}'+
      '.pl-pop-ov.on .pl-pop{transform:none}'+
      '.pl-pop-tag{position:absolute;top:8px;left:8px;z-index:1;background:rgba(8,26,65,.72);color:#fff;font:600 10px/1 Outfit,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;border-radius:4px}'+
      '.pl-pop-x{position:absolute;top:6px;right:6px;z-index:1;width:36px;height:36px;border:0;border-radius:50%;background:rgba(8,26,65,.72);color:#fff;font-size:20px;line-height:1;cursor:pointer;display:grid;place-items:center}'+
      '.pl-pop-x:hover{background:#081A41}'+
      '.pl-pop a{display:block}'+
      '.pl-pop img{display:block;width:100%;height:auto;max-height:76vh;object-fit:contain;background:#fff}';
    document.head.appendChild(st);
    var ov=document.createElement('div');ov.className='pl-pop-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Publicidad');
    var card=document.createElement('div');card.className='pl-pop';
    var tag=document.createElement('span');tag.className='pl-pop-tag';tag.textContent='Publicidad';
    var x=document.createElement('button');x.className='pl-pop-x';x.type='button';x.setAttribute('aria-label','Cerrar publicidad');x.innerHTML='×';
    var a=document.createElement('a');a.href=b.link;a.target='_blank';a.rel='noopener nofollow sponsored';
    var img=document.createElement('img');img.src=abs(b.imagen);img.alt=b.alt||'Publicidad';
    a.appendChild(img);card.appendChild(tag);card.appendChild(x);card.appendChild(a);ov.appendChild(card);
    function cerrar(){ov.classList.remove('on');setTimeout(function(){ov.remove();st.remove();},320);document.removeEventListener('keydown',esc);}
    function esc(e){if(e.key==='Escape')cerrar();}
    x.addEventListener('click',cerrar);
    ov.addEventListener('click',function(e){if(e.target===ov)cerrar();});
    document.addEventListener('keydown',esc);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){requestAnimationFrame(function(){ov.classList.add('on');});});
    try{localStorage.setItem(LS_TS,String(Date.now()));localStorage.setItem(LS_IMG,String(b.imagen)+'|'+String(b.v||''));}catch(e){}
  }
  // 29-oct-2026: la publicidad va dentro de la pagina, no encima. En una nota,
  // despues del tercer parrafo; en la portada, entre el carrusel y lo mas leido.
  function enLinea(b){
    if(document.querySelector('.pl-ad-linea')) return;
    var f=document.createElement('aside');f.className='pl-ad-linea';f.setAttribute('aria-label','Publicidad');
    f.innerHTML='<span class="pl-ad-linea-tag">Publicidad</span>';
    var a=document.createElement('a');a.href=b.link;a.target='_blank';a.rel='noopener nofollow sponsored';
    var img=document.createElement('img');img.src=abs(b.imagen);img.alt=b.alt||'Publicidad';img.loading='lazy';
    a.appendChild(img);f.appendChild(a);
    if(esNota()){
      var ps=document.querySelectorAll('.article-body > p');
      var tras=ps[Math.min(2,ps.length-1)];
      if(!tras)return;
      tras.parentNode.insertBefore(f,tras.nextSibling);
    } else {
      var top=document.querySelector('.pl-top')||document.querySelector('.news-grid');
      if(!top)return;
      var w=document.createElement('div');w.className='wrap';w.appendChild(f);
      top.parentNode.insertBefore(w,top);
    }
  }
  function init(){
    fetch('/banners.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(c){
      if(!c)return;var b=c.banner_p_popup;
      if(!b||b.activo!==true||!isUrl(b.link)||!b.imagen||!isImg(b.imagen))return;
      var donde=Array.isArray(b.ubicaciones)?b.ubicaciones:['nota_interno'];
      var aca=(esNota()&&donde.indexOf('nota_interno')>=0)||(esPortada()&&donde.indexOf('home_top')>=0);
      if(!aca)return;
      enLinea(b);  // 29-oct-2026: ya no tapa la pantalla (Google castiga los pop-ups); va dentro de la pagina
    }).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

// Secciones en la barra compacta — v25.
// Al bajar, el header se vuelve navy y el riel de secciones queda fuera de
// vista: estos enlaces lo reemplazan sin tocar la altura del header (cambiarla
// al cruzar el umbral reintroduce el bucle de scroll del hotfix de style.css).
// Se inyecta por JS y no en el HTML porque el header esta repetido en las 167
// paginas del sitio.
(function(){
  var SECCIONES = [
    ['Politica', '/secciones/politico.html'],
    ['Economia', '/secciones/economico.html'],
    ['Deportes', '/secciones/deportivo.html'],
    ['Social', '/secciones/social.html'],
    ['Religion', '/secciones/religioso.html'],
    ['Cultura', '/secciones/cultural.html'],
    ['Internacional', '/secciones/internacional.html'],
    ['Opinion', '/secciones/opinion.html'],
    ['Tecnologia', '/secciones/tecnologico.html'],
    ['Entrevistas', '/secciones/entrevistas.html']
  ];
  // Con acentos para mostrar; el array de arriba se mantiene sin ellos para no
  // depender del encoding del archivo.
  var ACENTOS = {
    'Politica': 'Política',
    'Economia': 'Economía',
    'Religion': 'Religión',
    'Opinion': 'Opinión',
    'Tecnologia': 'Tecnología'
  };

  // Mismo criterio que banners.json: una ruta relativa simple o un https.
  // Cualquier otra cosa (javascript:, data:, //otro-dominio) se descarta.
  function urlSegura(u){
    u = String(u || '');
    if(/^https:\/\//.test(u)) return u;
    if(/^\/[A-Za-z0-9._\/-]*$/.test(u)) return u;
    return '';
  }

  function pintar(items){
    var wrap = document.querySelector('.header .wrap');
    if(!wrap) return;
    var previo = wrap.querySelector('.header-rail');
    if(previo) previo.remove();
    if(!items.length) return;

    var boton = wrap.querySelector('.menu-btn');
    var nav = document.createElement('nav');
    nav.className = 'header-rail';
    nav.setAttribute('aria-label', 'Secciones');

    var track = document.createElement('div');
    track.className = 'header-rail__track';

    var actual = location.pathname.replace(/\/+$/, '');
    items.forEach(function(it){
      var url = urlSegura(it.url);
      if(!url) return;
      var a = document.createElement('a');
      a.href = url;
      a.textContent = ACENTOS[it.nombre] || it.nombre;
      if(actual && actual.indexOf(url) === 0) a.className = 'on';
      track.appendChild(a);
    });
    if(!track.children.length) return;

    nav.appendChild(track);
    if(boton) wrap.insertBefore(nav, boton); else wrap.appendChild(nav);
  }

  function montar(){
    // Se pintan las de siempre y, si menu.json trae otra lista, se repinta con
    // esa. Asi la barra aparece aunque el archivo tarde o no exista.
    pintar(SECCIONES.map(function(s){ return {nombre:s[0], url:s[1]}; }));

    fetch('/menu.json', {cache:'no-store'}).then(function(r){
      return r.ok ? r.json() : null;
    }).then(function(cfg){
      if(!cfg || !cfg.barra_secciones) return;
      var b = cfg.barra_secciones;
      if(b.activo === false){ pintar([]); return; }
      if(!Array.isArray(b.items)) return;
      var items = b.items.filter(function(it){ return it && it.nombre && it.url; });
      if(items.length) pintar(items);
    }).catch(function(){});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

// "Ver mas" en la portada — v26.
// La portada servia las 143 notas de golpe y medía casi 19.000 px de alto.
// Ahora arranca con unas pocas y el resto se pide con el boton. Cuantas se ven
// se configura en menu.json.
(function(){
  var POR_DEFECTO = { activo: true, iniciales: 12, por_tanda: 12, texto: 'Ver mas noticias' };

  function arrancar(cfg){
    var grid = document.querySelector('.news-grid');
    if(!grid || cfg.activo === false) return;

    var cards = function(){ return [].slice.call(grid.querySelectorAll(':scope > article.card')); };
    if(cards().length <= cfg.iniciales) return;

    var visibles = cfg.iniciales;

    // Se oculta por posicion dentro del grid, no solo las cards: los banners
    // intercalados son hijos del mismo contenedor y tienen que irse con ellas.
    function aplicar(){
      var corte = null, n = 0;
      [].slice.call(grid.children).forEach(function(el){
        if(el.classList.contains('card')){
          n++;
          if(n > visibles && corte === null) corte = el;
        }
        if(corte !== null) el.classList.add('is-oculta');
        else el.classList.remove('is-oculta');
      });
      return corte !== null;
    }

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'ver-mas';
    boton.textContent = cfg.texto || POR_DEFECTO.texto;

    function refrescar(){
      var quedan = aplicar();
      boton.hidden = !quedan;
    }

    boton.addEventListener('click', function(){
      var antes = grid.querySelectorAll(':scope > article.card:not(.is-oculta)').length;
      visibles += (cfg.por_tanda || POR_DEFECTO.por_tanda);
      refrescar();
      // El foco va a la primera nota nueva para no perder el lugar al volver.
      var nuevas = grid.querySelectorAll(':scope > article.card:not(.is-oculta)');
      var primera = nuevas[antes];
      var enlace = primera && primera.querySelector('a');
      if(enlace) enlace.focus({preventScroll:true});
    });

    grid.parentNode.insertBefore(boton, grid.nextSibling);
    refrescar();

    // Los banners se insertan despues de que esto corre: hay que reaplicar
    // cuando el grid cambie, o aparecen sueltos en la zona oculta.
    if(window.MutationObserver){
      var mo = new MutationObserver(function(){ refrescar(); });
      mo.observe(grid, {childList: true});
    }
  }

  function init(){
    fetch('/menu.json', {cache:'no-store'}).then(function(r){
      return r.ok ? r.json() : null;
    }).then(function(cfg){
      var v = (cfg && cfg.ver_mas) || {};
      arrancar({
        activo: v.activo !== false,
        iniciales: parseInt(v.iniciales, 10) > 0 ? parseInt(v.iniciales, 10) : POR_DEFECTO.iniciales,
        por_tanda: parseInt(v.por_tanda, 10) > 0 ? parseInt(v.por_tanda, 10) : POR_DEFECTO.por_tanda,
        texto: v.texto || POR_DEFECTO.texto
      });
    }).catch(function(){ arrancar(POR_DEFECTO); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


// ============================================================
// Compartir: Messenger + bandeja del sistema — se inyecta acá porque
// el bloque .share-btns esta repetido en las 167 notas del sitio.
// - "Messenger": en celular abre la app (esquema fb-messenger://). En
//   escritorio el dialogo de Meta EXIGE un App ID; si PL_FB_APP_ID queda
//   vacio, el boton no se muestra en escritorio (no hay forma sin App ID).
// - "Mas": navigator.share abre la bandeja del sistema — mensajes SMS,
//   Telegram, Messenger, correo, lo que el usuario tenga instalado.
//   Si el navegador no la soporta (escritorio), copia el enlace.
// ============================================================
(function(){
  var PL_FB_APP_ID = ''; // poner el App ID de Meta para habilitar Messenger en escritorio

  function esMovil(){
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function svg(d){
    var s = document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('width','14'); s.setAttribute('height','14');
    s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('fill','currentColor');
    s.setAttribute('aria-hidden','true');
    var p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  var D_MSG = 'M12 0C5.24 0 0 4.95 0 11.64c0 3.5 1.43 6.52 3.77 8.61.2.18.31.42.32.68l.07 2.14c.02.68.72 1.12 1.35.85l2.39-1.05c.2-.09.42-.1.63-.05 1.09.3 2.26.46 3.47.46 6.76 0 12-4.95 12-11.64C24 4.95 18.76 0 12 0zm7.2 8.94l-3.52 5.59c-.56.89-1.77 1.11-2.61.48l-2.8-2.1a.72.72 0 00-.87 0l-3.78 2.87c-.51.38-1.17-.22-.83-.76l3.52-5.59c.56-.89 1.77-1.11 2.61-.48l2.8 2.1c.26.19.61.19.87 0l3.78-2.87c.5-.39 1.17.22.83.76z';
  var D_MAS = 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z';
  var D_LINK = 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z';

  function boton(clase, etiqueta, icono){
    var a = document.createElement('a');
    a.className = clase;
    a.href = '#';
    a.appendChild(svg(icono));
    a.appendChild(document.createTextNode(' ' + etiqueta));
    return a;
  }

  function init(){
    // Los botones venian al final de todo (despues de relacionadas y contacto) y casi
    // nadie llegaba: se suben justo debajo del texto de la nota (29-oct-2026).
    var bloque = document.querySelector('.share');
    var cuerpo = document.querySelector('.article-body');
    if(bloque && cuerpo && cuerpo.nextElementSibling !== bloque){
      cuerpo.parentNode.insertBefore(bloque, cuerpo.nextSibling);
      bloque.classList.add('share-arriba');
    }

    var cont = document.querySelector('.share-btns');
    if(!cont || cont.querySelector('.msg, .mas')) return;

    var url = location.href;
    var titulo = (document.querySelector('.article-header h1') || {}).textContent || document.title;
    titulo = String(titulo).trim();

    if(esMovil() || PL_FB_APP_ID){
      var m = boton('msg', 'Messenger', D_MSG);
      if(PL_FB_APP_ID){
        m.href = 'https://www.facebook.com/dialog/send?app_id=' + encodeURIComponent(PL_FB_APP_ID) +
                 '&link=' + encodeURIComponent(url) + '&redirect_uri=' + encodeURIComponent(url);
        m.target = '_blank';
        m.rel = 'noopener';
      } else {
        m.href = 'fb-messenger://share/?link=' + encodeURIComponent(url);
      }
      cont.appendChild(m);
    }

    var nativo = typeof navigator.share === 'function';
    var b = boton('mas', nativo ? 'Más' : 'Copiar enlace', nativo ? D_MAS : D_LINK);
    b.addEventListener('click', function(e){
      e.preventDefault();
      if(nativo){
        navigator.share({title: titulo, text: titulo, url: url}).catch(function(){});
        return;
      }
      var listo = function(){
        var t = b.lastChild;
        t.textContent = ' Enlace copiado';
        setTimeout(function(){ t.textContent = ' Copiar enlace'; }, 2200);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(listo).catch(function(){});
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly','');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); listo(); }catch(err){}
        ta.remove();
      }
    });
    cont.appendChild(b);
  }

  // ----------------------------------------------------------
  // Barra fija de la nota (29-oct-2026, estilo "pildora azul" que eligio Javier):
  // WhatsApp, Compartir | pulgar n, comentarios n, Escuchar, y una linea dorada
  // que avanza con la lectura. Celular: abajo al centro. Escritorio ancho:
  // columna a la izquierda del texto. Aparece al pasar la foto y se esconde al
  // llegar a los botones grandes de abajo.
  // ----------------------------------------------------------
  var D_WA = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
  var D_UP = 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z';
  var D_COM = 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z';
  var D_OIR = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
  var D_PARAR = 'M6 6h12v12H6z';

  function panel(){
    var cuerpo = document.querySelector('.article-body');
    var wa = document.getElementById('shareWa');
    if(!cuerpo || !wa || document.querySelector('.pl-panel')) return;
    var url = location.href;
    var titulo = String((document.querySelector('.article-header h1') || {}).textContent || document.title).trim();

    var p = document.createElement('nav');
    p.className = 'pl-panel';
    p.setAttribute('aria-label', 'Acciones de la nota');
    var barra = document.createElement('span');
    barra.className = 'pl-panel-avance';
    p.appendChild(barra);

    function icono(a, d){
      var i = svg(d); i.setAttribute('width', '19'); i.setAttribute('height', '19');
      if(a.firstChild) a.replaceChild(i, a.firstChild); else a.appendChild(i);
    }
    function item(clase, etiqueta, d, href){
      var a = document.createElement(href ? 'a' : 'button');
      a.className = 'pl-panel-b ' + clase;
      if(href){ a.href = href; } else { a.type = 'button'; }
      a.setAttribute('aria-label', etiqueta);
      a.title = etiqueta;
      icono(a, d);
      p.appendChild(a);
      return a;
    }
    function num(a){
      var n = document.createElement('span'); n.className = 'pl-panel-n'; a.appendChild(n); return n;
    }

    var bw = item('wa', 'Compartir por WhatsApp', D_WA, wa.href); bw.target = '_blank'; bw.rel = 'noopener';
    var nativo = typeof navigator.share === 'function';
    var bm = item('mas', nativo ? 'Compartir' : 'Copiar enlace', nativo ? D_MAS : D_LINK);
    bm.addEventListener('click', function(){
      if(nativo){ navigator.share({title: titulo, text: titulo, url: url}).catch(function(){}); return; }
      if(navigator.clipboard) navigator.clipboard.writeText(url).then(function(){
        bm.classList.add('ok'); setTimeout(function(){ bm.classList.remove('ok'); }, 1800);
      }).catch(function(){});
    });
    var sep = document.createElement('span'); sep.className = 'pl-panel-sep'; p.appendChild(sep);

    var bl = item('like', 'Me gusta', D_UP); var nl = num(bl); bl.hidden = true;
    var bc = item('com', 'Comentar', D_COM); var nc = num(bc); bc.hidden = true;

    // Escuchar: el telefono lee la nota en voz alta (gratis, sin servidor).
    var voz = window.speechSynthesis;
    if(voz && window.SpeechSynthesisUtterance){
      var bo = item('oir', 'Escuchar la nota', D_OIR);
      var leyendo = false;
      var vozEs = function(){
        var vs = voz.getVoices() || [];
        return vs.filter(function(v){ return /^es[-_](SV|MX|US|419)/i.test(v.lang); })[0] ||
               vs.filter(function(v){ return /^es/i.test(v.lang); })[0] || null;
      };
      var parar = function(){
        voz.cancel(); leyendo = false; bo.classList.remove('on'); icono(bo, D_OIR);
        bo.setAttribute('aria-label', 'Escuchar la nota'); bo.title = 'Escuchar la nota';
      };
      bo.addEventListener('click', function(){
        if(leyendo){ parar(); return; }
        var trozos = [titulo];
        cuerpo.querySelectorAll('p, h2, h3, li').forEach(function(e){
          var t = e.textContent.replace(/\s+/g, ' ').trim();
          if(t && !/^Fuentes?:/i.test(t)) trozos.push(t);
        });
        var v = vozEs();
        voz.cancel();
        trozos.forEach(function(t, i){
          var u = new SpeechSynthesisUtterance(t);
          u.lang = v ? v.lang : 'es-MX'; if(v) u.voice = v; u.rate = 1;
          if(i === trozos.length - 1) u.onend = parar;
          voz.speak(u);
        });
        leyendo = true; bo.classList.add('on'); icono(bo, D_PARAR);
        bo.setAttribute('aria-label', 'Dejar de escuchar'); bo.title = 'Dejar de escuchar';
      });
      addEventListener('pagehide', function(){ voz.cancel(); });
    }

    document.body.appendChild(p);

    // Pulgar y comentarios: espejo del bloque de reacciones (solo si ese bloque existe).
    function conectar(){
      var soc = document.querySelector('.pl-social'), si = soc && soc.querySelector('.pl-rx-si');
      if(!si) return false;
      bl.hidden = false; bc.hidden = false;
      var lista = soc.querySelector('.pl-com-lista');
      var copiar = function(){
        var n = (si.querySelector('.pl-rx-n') || {}).textContent || '0';
        nl.textContent = n === '0' ? '' : n;
        bl.classList.toggle('on', si.classList.contains('on'));
        var c = lista ? lista.querySelectorAll('.pl-com-item').length : 0;
        nc.textContent = c ? String(c) : '';
      };
      copiar();
      var mo2 = new MutationObserver(copiar);
      mo2.observe(si, {subtree: true, childList: true, characterData: true, attributes: true});
      if(lista) mo2.observe(lista, {childList: true});
      bl.addEventListener('click', function(){ si.click(); });
      bc.addEventListener('click', function(){
        (soc.querySelector('.pl-com-form') || soc).scrollIntoView({behavior: 'smooth', block: 'center'});
        var n = soc.querySelector('.pl-com-form input[name=nombre]');
        if(n) setTimeout(function(){ n.focus({preventScroll: true}); }, 600);
      });
      return true;
    }
    if(!conectar()){
      var mo = new MutationObserver(function(){ if(conectar()) mo.disconnect(); });
      mo.observe(document.body, {childList: true, subtree: true});
      setTimeout(function(){ mo.disconnect(); }, 15000);
    }

    // Se ve entre el final de la foto y los botones grandes de abajo; la linea
    // dorada marca cuanto del texto ya se leyo.
    function mirar(){
      var vh = innerHeight;
      var desde = true; // 29-oct: Javier la quiere visible desde arriba de la nota
      var tope = document.querySelector('.share-arriba') || document.querySelector('.pl-social') || document.querySelector('.footer');
      var hasta = tope && tope.getBoundingClientRect().top < vh - 40;
      var ver = desde && !hasta;
      p.classList.toggle('show', ver);
      document.body.classList.toggle('pl-panel-on', ver);
      var r = cuerpo.getBoundingClientRect();
      var hecho = Math.min(1, Math.max(0, (vh - r.top) / (r.height || 1)));
      p.style.setProperty('--avance', hecho.toFixed(3));
    }
    addEventListener('scroll', mirar, {passive: true});
    addEventListener('resize', mirar);
    mirar();
  }

  function arrancar(){ init(); panel(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();


// ============================================================
// Reacciones (pulgar arriba / abajo) y comentarios de las notas.
// El sitio es estatico, asi que los datos viven en el Worker
// (/social/*, base D1). Se inyecta desde aca porque el bloque tendria
// que repetirse en las 167 notas.
//
// Los comentarios NO salen solos: entran en espera y aparecen cuando se
// aprueban desde /social/panel?key=... — asi lo pidio la casa.
// ============================================================
(function(){
  var API = 'https://plumalibre-analytics.prensaplumalibre.workers.dev';

  function esNota(){
    return /\/articulos\//.test(location.pathname) || document.body.classList.contains('article-page');
  }

  // El slug es el nombre del archivo de la nota; es la clave en la base.
  function slug(){
    var f = location.pathname.split('/').pop() || '';
    return f.replace(/\.html?$/, '').toLowerCase();
  }

  // Identificador anonimo del visitante: solo sirve para no contarle dos veces
  // el pulgar y para el limite de comentarios. No es una cuenta.
  function yo(){
    var v = '';
    try { v = localStorage.getItem('pl_yo') || ''; } catch(e){}
    if(!/^[a-zA-Z0-9-]{8,64}$/.test(v)){
      v = (crypto && crypto.randomUUID) ? crypto.randomUUID()
        : String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10);
      try { localStorage.setItem('pl_yo', v); } catch(e){}
    }
    return v;
  }

  function el(tag, clase, texto){
    var e = document.createElement(tag);
    if(clase) e.className = clase;
    if(texto != null) e.textContent = texto;
    return e;
  }

  function fecha(ms){
    try {
      return new Date(ms).toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch(e){ return ''; }
  }

  function armar(){
    var s = document.createElement('section');
    s.className = 'pl-social';

    // --- reacciones ---
    var rx = el('div', 'pl-rx');
    var titRx = el('p', 'pl-social-t', '¿Qué te pareció esta nota?');
    var fila = el('div', 'pl-rx-fila');
    var arriba = el('button', 'pl-rx-b pl-rx-si');
    arriba.type = 'button';
    arriba.setAttribute('aria-label', 'Me gusta');
    arriba.innerHTML = '<span class="pl-rx-i">👍</span><span class="pl-rx-n">0</span>';
    var abajo = el('button', 'pl-rx-b pl-rx-no');
    abajo.type = 'button';
    abajo.setAttribute('aria-label', 'No me gusta');
    abajo.innerHTML = '<span class="pl-rx-i">👎</span><span class="pl-rx-n">0</span>';
    fila.appendChild(arriba); fila.appendChild(abajo);
    rx.appendChild(titRx); rx.appendChild(fila);

    // --- comentarios ---
    var com = el('div', 'pl-com');
    com.appendChild(el('h2', 'pl-com-t', 'Comentarios'));
    var lista = el('ul', 'pl-com-lista');
    var vacio = el('p', 'pl-com-vacio', 'Todavía nadie comenta esta nota. Estrenala vos.');

    var form = document.createElement('form');
    form.className = 'pl-com-form';
    form.noValidate = true;
    var nombre = document.createElement('input');
    nombre.type = 'text'; nombre.name = 'nombre'; nombre.maxLength = 40;
    nombre.placeholder = 'Tu nombre'; nombre.autocomplete = 'name';
    var texto = document.createElement('textarea');
    texto.name = 'texto'; texto.maxLength = 800; texto.rows = 3;
    texto.placeholder = 'Escribí tu comentario';
    // Campo trampa para robots: invisible y fuera del recorrido del teclado.
    var trampa = document.createElement('input');
    trampa.type = 'text'; trampa.name = 'web'; trampa.tabIndex = -1;
    trampa.autocomplete = 'off'; trampa.className = 'pl-com-trampa';
    trampa.setAttribute('aria-hidden', 'true');
    var enviar = document.createElement('button');
    enviar.type = 'submit'; enviar.className = 'pl-com-enviar'; enviar.textContent = 'Enviar comentario';
    var aviso = el('p', 'pl-com-aviso', 'Los comentarios se revisan antes de publicarse.');
    form.appendChild(nombre); form.appendChild(texto); form.appendChild(trampa);
    form.appendChild(enviar); form.appendChild(aviso);

    com.appendChild(form);
    com.appendChild(vacio);
    com.appendChild(lista);

    s.appendChild(rx); s.appendChild(com);
    return { raiz: s, arriba: arriba, abajo: abajo, lista: lista, vacio: vacio,
             form: form, nombre: nombre, texto: texto, trampa: trampa, enviar: enviar, aviso: aviso };
  }

  function pintarConteos(ui, d){
    ui.arriba.querySelector('.pl-rx-n').textContent = d.arriba || 0;
    ui.abajo.querySelector('.pl-rx-n').textContent = d.abajo || 0;
    ui.arriba.classList.toggle('on', d.mio === 1);
    ui.abajo.classList.toggle('on', d.mio === -1);
  }

  function pintarComentarios(ui, cs){
    ui.lista.innerHTML = '';
    if(!cs || !cs.length){ ui.vacio.hidden = false; return; }
    ui.vacio.hidden = true;
    cs.forEach(function(c){
      var li = el('li', 'pl-com-item');
      li.appendChild(el('b', null, c.nombre));
      li.appendChild(el('span', 'pl-com-fecha', fecha(c.creado)));
      li.appendChild(el('p', null, c.texto));
      ui.lista.appendChild(li);
    });
  }

  function init(){
    if(!esNota()) return;
    var sl = slug();
    if(!sl) return;
    var quien = yo();

    var ancla = document.querySelector('.pl-rel') || document.querySelector('.contact-cta');
    var share = document.querySelector('.share');
    if(!ancla && !share) return;

    // El bloque se pinta SOLO si el Worker contesta. Mientras la base no exista
    // —o si un dia se cae— la nota queda como estaba, sin un cajon muerto.
    var ui = null;
    fetch(API + '/social/estado?slug=' + encodeURIComponent(sl) + '&yo=' + encodeURIComponent(quien))
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(!d || d.error || !d.ok) return;
        ui = armar();
        if(ancla) ancla.parentNode.insertBefore(ui.raiz, ancla);
        else share.parentNode.insertBefore(ui.raiz, share.nextSibling);
        pintarConteos(ui, d);
        pintarComentarios(ui, d.comentarios);
        enchufar();
      })
      .catch(function(){});

    function enchufar(){
    function reaccionar(valor){
      return function(){
        ui.arriba.disabled = ui.abajo.disabled = true;
        fetch(API + '/social/reaccion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: sl, valor: valor, yo: quien })
        }).then(function(r){ return r.json(); })
          .then(function(d){ if(d && !d.error) pintarConteos(ui, d); })
          .catch(function(){})
          .then(function(){ ui.arriba.disabled = ui.abajo.disabled = false; });
      };
    }
    ui.arriba.addEventListener('click', reaccionar(1));
    ui.abajo.addEventListener('click', reaccionar(-1));

    ui.form.addEventListener('submit', function(e){
      e.preventDefault();
      var nom = ui.nombre.value.trim(), txt = ui.texto.value.trim();
      if(nom.length < 2 || txt.length < 2){
        ui.aviso.textContent = 'Poné tu nombre y tu comentario.';
        ui.aviso.className = 'pl-com-aviso pl-com-error';
        return;
      }
      ui.enviar.disabled = true;
      ui.aviso.className = 'pl-com-aviso';
      ui.aviso.textContent = 'Enviando...';
      fetch(API + '/social/comentario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: sl, nombre: nom, texto: txt, yo: quien, web: ui.trampa.value })
      }).then(function(r){ return r.json(); })
        .then(function(d){
          if(d && d.ok){
            ui.nombre.value = ''; ui.texto.value = '';
            ui.aviso.className = 'pl-com-aviso pl-com-listo';
            ui.aviso.textContent = 'Gracias. Tu comentario queda en espera: lo publicamos apenas lo revisemos.';
          } else {
            ui.aviso.className = 'pl-com-aviso pl-com-error';
            ui.aviso.textContent = (d && d.error === 'muy_seguido') ? 'Esperá un momento antes de mandar otro.'
              : (d && d.error === 'demasiados') ? 'Ya mandaste varios hoy. Seguimos mañana.'
              : 'No se pudo enviar. Probá de nuevo.';
          }
        })
        .catch(function(){
          ui.aviso.className = 'pl-com-aviso pl-com-error';
          ui.aviso.textContent = 'No se pudo enviar. Probá de nuevo.';
        })
        .then(function(){ ui.enviar.disabled = false; });
    });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ============================================================
// 29-oct-2026 — Notas relacionadas DE VERDAD + hora relativa.
// Las notas se arman copiando una nota «molde» y con ella venian sus
// relacionadas viejas (en Haiti salian el equinoccio y un rayo en Izalco).
// Aca se reemplazan por las 3 notas de la portada que mas palabras comparten
// con esta (titulo + bajada), con un empujon a la misma seccion; si ninguna
// se parece, van las 3 mas nuevas de la misma seccion.
// ============================================================
(function(){
  var VACIAS = ('para como pero esta este estos estas sobre entre desde hasta tras ante bajo segun durante mientras ' +
    'tambien porque cuando donde quien quienes cual cuales todo toda todos todas otro otra otros otras sus del los las ' +
    'una unos unas que con por sin han hay fue son ser era mas muy ya les nos solo cada dos tres anos dias hoy ayer ' +
    'tiene tienen dijo dice tras luego despues antes nuevo nueva salvador salvadorenos salvadorena salvadoreno').split(' ');
  function palabras(t){
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)
      .filter(function(w){ return w.length > 3 && VACIAS.indexOf(w) < 0; });
  }
  var MES = {enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,setiembre:8,octubre:9,noviembre:10,diciembre:11};
  function fechaDe(t){
    var x = String(t || '').toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóú]+),?\s+(\d{4})/);
    return (x && MES[x[2]] !== undefined) ? Date.UTC(+x[3], MES[x[2]], +x[1]) : 0;
  }
  function seccion(t){ return String(t || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/o$/, 'a'); }
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  function relacionadas(){
    var rel = document.querySelector('.pl-rel'), grid = rel && rel.querySelector('.pl-rel-grid');
    if(!grid || !/\/articulos\//.test(location.pathname)) return;
    var yo = location.pathname.split('/').pop();
    var h1 = document.querySelector('.article-header h1'), sub = document.querySelector('.article-header .subtitle');
    var badge = document.querySelector('.article-header .badge');
    var mias = palabras((h1 ? h1.textContent : '') + ' ' + (h1 ? h1.textContent : '') + ' ' + (sub ? sub.textContent : ''));
    if(!mias.length) return;
    var miSec = seccion(badge ? badge.textContent : '');
    fetch('/index.html', {cache: 'no-cache'}).then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
      if(!html) return;
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var notas = [];
      doc.querySelectorAll('.news-grid article.card, .home-hero-grid article').forEach(function(c){
        var a = c.querySelector('h2 a, h3 a'), img = c.querySelector('img');
        if(!a || !img) return;
        var href = (a.getAttribute('href') || '').split(/[?#]/)[0];
        var archivo = href.split('/').pop();
        if(!archivo || archivo === yo || notas.some(function(n){ return n.archivo === archivo; })) return;
        var k = c.querySelector('.badge-sm, .kicker'), m = c.querySelector('.meta');
        notas.push({archivo: archivo, titulo: a.textContent.trim(), img: img.getAttribute('src'),
          sec: k ? k.textContent.trim() : '', meta: m ? m.textContent.trim() : '', fecha: fechaDe(m ? m.textContent : '')});
      });
      var cuenta = {};
      mias.forEach(function(w){ cuenta[w] = 1; });
      notas.forEach(function(n){
        var vistas = {}, s = 0;
        palabras(n.titulo).forEach(function(w){ if(cuenta[w] && !vistas[w]){ vistas[w] = 1; s += 1; } });
        n.puntos = s + (s && seccion(n.sec) === miSec ? 0.5 : 0);
      });
      var buenas = notas.filter(function(n){ return n.puntos >= 1; })
        .sort(function(a, b){ return (b.puntos - a.puntos) || (b.fecha - a.fecha); });
      if(buenas.length < 3){
        var ya = {}; buenas.forEach(function(n){ ya[n.archivo] = 1; });
        notas.filter(function(n){ return !ya[n.archivo] && seccion(n.sec) === miSec; })
          .sort(function(a, b){ return b.fecha - a.fecha; })
          .forEach(function(n){ if(buenas.length < 3) buenas.push(n); });
      }
      buenas = buenas.slice(0, 3);
      if(buenas.length < 2) return;
      grid.innerHTML = buenas.map(function(n){
        var src = /^https?:|^\//.test(n.img) ? n.img : '../' + n.img;
        return '<a class="pl-rel-card" href="' + esc(n.archivo) + '"><img src="' + esc(src) + '" alt="" loading="lazy">' +
          '<span class="pl-rel-txt"><span class="pl-rel-tit">' + esc(n.titulo) + '</span>' +
          '<span class="pl-rel-meta">' + esc([n.sec, n.meta].filter(Boolean).join(' · ')) + '</span></span></a>';
      }).join('');
    }).catch(function(){});
  }

  // «Hace 2 horas» cuando la fecha trae hora («29 de octubre, 2026 · 9:40 p. m.») y es de hoy.
  function horaRelativa(){
    var ahora = new Date();
    document.querySelectorAll('.article-meta, .card .meta, .pl-rel-meta, .hh-slide .meta').forEach(function(el){
      if(el.dataset.plHora) return;
      var t = el.textContent;
      var x = t.match(/(\d{1,2})\s+de\s+([a-záéíóú]+),?\s+(\d{4})\s*·\s*(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/i);
      if(!x || MES[x[2].toLowerCase()] === undefined) return;
      var h = (+x[4]) % 12 + (/p/i.test(x[6]) ? 12 : 0);
      // la hora es de El Salvador (UTC-6, sin horario de verano)
      var cuando = Date.UTC(+x[3], MES[x[2].toLowerCase()], +x[1], h + 6, +x[5]);
      var min = Math.round((ahora.getTime() - cuando) / 60000);
      if(min < 0 || min >= 24 * 60) return;
      var rel = min < 60 ? 'Hace ' + Math.max(1, min) + ' min' : 'Hace ' + Math.round(min / 60) + (Math.round(min / 60) === 1 ? ' hora' : ' horas');
      el.dataset.plHora = '1';
      // se cambia solo el texto de la fecha, sin tocar negritas ni enlaces
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while((n = w.nextNode())){
        if(x[0] && n.nodeValue.indexOf(x[0]) >= 0){ n.nodeValue = n.nodeValue.replace(x[0], rel); break; }
      }
      el.title = x[0];
    });
  }

  function arrancar(){
    relacionadas();
    horaRelativa();
    setTimeout(horaRelativa, 2500);   // el carrusel de la portada se arma despues
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
