/* Fondo animado de la sección "Mis Favoritos" del inicio (index.html, #favoritos-inicio).

   CÓMO CAMBIAR EL FONDO (no hay que tocar este archivo ni el HTML):
     1. Conseguí el .js de la animación (el que exporta el generador).
     2. Guardalo como  docs/js/fondo/favoritos.js  (reemplaza al que está).
     3. Subilo a GitHub. Listo.

   Cómo funciona: la animación se carga SIN modificar dentro de un marco (iframe) invisible a la medida de la sección.
   Para ella ese marco es "la pantalla completa", así que sirven tanto las animaciones de pantalla completa
   (como milkyway.js) como las pensadas para una sección (como fuego.js). Como corre en su propio marco, no puede
   tocar el resto de la página ni terminar en otra sección.

   - Mientras no haya obras favoritas la sección está oculta y la animación NI SE DESCARGA.
   - Se pausa sola cuando la sección no se ve en pantalla (ahorra batería).
   - Se pide siempre la última versión del archivo: al reemplazarlo no hace falta cambiar números de versión.
   - Si el archivo no carga, la sección queda con el color de fondo liso (ver --favoritos-fondo en css/inicio.css). */
(function () {
  const seccion = document.getElementById('favoritos-inicio');
  if (!seccion) return;

  const ARCHIVO = 'js/fondo/favoritos.js';

  // Página mínima que ve la animación. #obras y #fondo-host son los contenedores que buscan las animaciones
  // pensadas para una sección (las de pantalla completa los ignoran).
  const PAGINA = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<style>html,body{margin:0;height:100%;overflow:hidden;background:transparent}</style></head>' +
    '<body><div id="obras" style="position:fixed;inset:0"><div id="fondo-host" style="position:absolute;inset:0"></div></div></body></html>';

  let marco = null;

  const crear = () => {
    if (marco) return;
    marco = document.createElement('iframe');
    marco.className = 'favoritos-fondo';
    marco.setAttribute('aria-hidden', 'true');
    marco.tabIndex = -1;
    marco.srcdoc = PAGINA;

    let codigo = null, puesto = false;
    // Se ejecuta cuando están listos los dos: el texto de la animación y la página del marco
    const poner = () => {
      if (puesto || codigo === null) return;
      let doc;
      try { doc = marco.contentDocument; } catch (_) { return; }
      if (!doc || !doc.getElementById('fondo-host')) return;
      puesto = true;
      const s = doc.createElement('script');
      s.dataset.selector = '#fondo-host';
      s.textContent = codigo;
      doc.body.appendChild(s);
    };
    marco.addEventListener('load', poner);
    seccion.prepend(marco);

    fetch(ARCHIVO, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(t => { codigo = t; poner(); })
      .catch(() => { /* sin animación: queda el color liso */ });

    // Fuera de pantalla se oculta el marco: el navegador deja de animarlo
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { marco.style.display = es[0].isIntersecting ? '' : 'none'; },
        { rootMargin: '200px' }).observe(seccion);
    }
  };

  // La sección aparece cuando se marca la primera obra favorita (js/favoritos-inicio.js le quita "hidden")
  const revisar = () => { if (!seccion.hidden) crear(); };
  new MutationObserver(revisar).observe(seccion, { attributes: true, attributeFilter: ['hidden'] });
  revisar();
})();
