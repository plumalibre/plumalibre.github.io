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
  function init(){
    fetch('/banners.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(c){
      if(!c)return;var b=c.banner_p_popup;
      if(!b||b.activo!==true||!isUrl(b.link)||!b.imagen||!isImg(b.imagen))return;
      var donde=Array.isArray(b.ubicaciones)?b.ubicaciones:['nota_interno'];
      var aca=(esNota()&&donde.indexOf('nota_interno')>=0)||(esPortada()&&donde.indexOf('home_top')>=0);
      if(!aca)return;
      var horas=parseFloat(b.frecuencia_horas);if(isNaN(horas)||horas<1)horas=24;if(horas>168)horas=168;
      try{
        var ts=parseInt(localStorage.getItem(LS_TS)||'0',10);
        var vista=localStorage.getItem(LS_IMG)||'';
        if(vista===String(b.imagen)+'|'+String(b.v||'')&&Date.now()-ts<horas*3600000)return;
      }catch(e){}
      setTimeout(function(){mostrar(b);},2000);
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

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
