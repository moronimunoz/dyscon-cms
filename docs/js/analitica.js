/* =========================================================
   ANALÍTICA - mide visitas sin cookies de seguimiento (si se usa Plausible o Umami).
   Se carga en todas las páginas con:  <script src="js/analitica.js" defer></script>

   CÓMO ACTIVARLA (una sola vez):
   1. Crear la cuenta en el servicio elegido (Plausible o Umami; GA4 es la tercera opción).
   2. Completar abajo "proveedor" y los datos de ese servicio.
   3. Subir el cambio. Mientras "proveedor" esté vacío, este archivo no hace nada.

   Qué NO hace: no mide en localhost ni al abrir el archivo suelto, y respeta el aviso
   "No rastrear" (Do Not Track) del navegador.

   Eventos que registra solos: llamadas (tel:), mails (mailto:), WhatsApp, descargas de PDF,
   clic en redes sociales, formulario enviado y cualquier elemento con data-evento="Nombre".
   En Plausible hay que crear cada evento como "Goal" en el panel para verlo en los resultados.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN: lo único que hay que tocar ---------- */
  var CONFIG = {
    proveedor: '',                       // 'plausible' | 'umami' | 'ga4'   (vacío = apagada)

    plausible: {
      dominio: 'dysconsa.com.ar',        // el dominio tal como lo cargaste en Plausible
      // Si en tu panel Plausible te muestra otro código (por ejemplo .../js/pa-XXXX.js), pegá esa dirección acá:
      script: 'https://plausible.io/js/script.js'
    },
    umami: {
      id: '',                            // "Website ID" que muestra Umami
      script: 'https://cloud.umami.is/script.js'   // si usás Umami propio, la dirección de tu servidor
    },
    ga4: {
      id: ''                             // ID de medición, tipo G-XXXXXXXXXX
    }
  };

  /* ---------- No medir en pruebas ni con "No rastrear" ---------- */
  var local = /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname) || location.protocol === 'file:';
  var noRastrear = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;

  // Función global para registrar eventos desde cualquier página: dyEvento('Nombre', { dato: 'valor' })
  window.dyEvento = function () { };

  if (!CONFIG.proveedor || local || noRastrear) return;

  /* ---------- Carga del servicio elegido ---------- */
  var cargar = function (src, atributos) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = src;
    Object.keys(atributos || {}).forEach(function (k) { s.setAttribute(k, atributos[k]); });
    document.head.appendChild(s);
  };

  switch (CONFIG.proveedor) {
    case 'plausible': {
      var p = CONFIG.plausible;
      if (!p.script) return;
      // Cola de eventos: sirve aunque el script de Plausible todavía no haya terminado de cargar
      window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
      cargar(p.script, p.dominio ? { 'data-domain': p.dominio } : {});
      window.dyEvento = function (nombre, datos) { window.plausible(nombre, datos ? { props: datos } : undefined); };
      break;
    }
    case 'umami': {
      var u = CONFIG.umami;
      if (!u.id || !u.script) return;
      cargar(u.script, { 'data-website-id': u.id });
      window.dyEvento = function (nombre, datos) {
        if (window.umami && window.umami.track) window.umami.track(nombre, datos);
      };
      break;
    }
    case 'ga4': {
      var g = CONFIG.ga4;
      if (!g.id) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      // Sin permiso de almacenamiento: GA4 no guarda cookies hasta que exista un aviso de cookies que lo autorice
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', g.id, { allow_google_signals: false, allow_ad_personalization_signals: false });
      cargar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(g.id));
      window.dyEvento = function (nombre, datos) { window.gtag('event', nombre.replace(/\s+/g, '_').toLowerCase(), datos || {}); };
      break;
    }
    default:
      return;
  }

  // Página 404: se anota qué dirección buscaba la persona (sirve para encontrar vínculos rotos)
  if (document.documentElement.hasAttribute('data-404')) window.dyEvento('404', { ruta: location.pathname });

  /* ---------- Eventos automáticos (un solo oyente para toda la página) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a, [data-evento]');
    if (!a) return;

    var manual = a.getAttribute('data-evento');
    if (manual) { window.dyEvento(manual, { pagina: location.pathname.split('/').pop() || 'index.html' }); return; }

    var href = a.getAttribute('href') || '';
    if (/^tel:/i.test(href)) window.dyEvento('Llamada');
    else if (/^mailto:/i.test(href)) window.dyEvento('Email');
    else if (/(wa\.me|api\.whatsapp\.com|whatsapp:)/i.test(href)) window.dyEvento('WhatsApp');
    else if (/\.pdf($|\?)/i.test(href)) window.dyEvento('Descarga PDF', { archivo: href.split('/').pop() });
    else if (/(linkedin|instagram|facebook)\.com/i.test(href)) window.dyEvento('Red social', { red: (href.match(/(linkedin|instagram|facebook)/i) || [''])[0].toLowerCase() });
  }, true);
})();
