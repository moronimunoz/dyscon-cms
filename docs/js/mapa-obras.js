/* Mapa de obras (solo obras.html): vista "Mapa" junto a la lista, con los mismos filtros.
   - Las coordenadas de cada obra las calcula build.js (campo coords de obras-data.js).
   - Leaflet y los mapas de OpenStreetMap se cargan recién cuando alguien toca "Mapa".
   - Las obras que comparten lugar (por ejemplo, varias en el centro de Rosario) se agrupan en un solo marcador con el número.
   - Una obra que está en varios lugares tiene un pin por cada uno (coords + puntos_extra). Todos abren la misma obra.
   - Se puede abrir directo con obras.html?vista=mapa */
(function () {
  if (typeof OBRAS === 'undefined') return;

  const selector = document.getElementById('vista-selector');
  const caja = document.getElementById('mapa-obras');
  const lienzo = document.getElementById('mapa-obras-lienzo');
  const lista = document.getElementById('lista-obras');
  const vacio = document.getElementById('mapa-obras-vacio');
  const error = document.getElementById('mapa-obras-error');
  if (!selector || !caja || !lienzo || !lista) return;

  const conCoords = OBRAS.filter(o => Array.isArray(o.coords) && o.coords.length === 2);
  if (!conCoords.length) return;                          // sin ubicaciones no se ofrece el mapa
  selector.hidden = false;

  const botones = selector.querySelectorAll('.vista-btn');
  const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ciudad = o => String(o.ubicacion || '').split(/\s*·\s*/)[0].trim();
  const chica = ruta => ruta.replace(/\.(jpe?g|png|webp)$/i, '-sm.webp');
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/></svg>';

  // Los puntos de una obra: su ubicación principal y, si las tiene, las "ubicaciones extra" (puntos_extra)
  const puntosDe = o => {
    const lista = [];
    if (Array.isArray(o.coords) && o.coords.length === 2) lista.push({ obra: o, coords: o.coords, aprox: !!o.aprox, lugar: '' });
    (o.puntos_extra || []).forEach(p => {
      if (Array.isArray(p.coords) && p.coords.length === 2) lista.push({ obra: o, coords: p.coords, aprox: !!p.aprox, lugar: p.nombre || '' });
    });
    return lista;
  };

  let L = null, mapa = null, capa = null, cargando = null, abierto = false;

  // Carga Leaflet una sola vez, desde el propio sitio
  const cargarLeaflet = () => cargando || (cargando = new Promise((ok, falla) => {
    if (window.L) return ok(window.L);
    const s = document.createElement('script');
    s.src = 'vendor/leaflet/leaflet.js';
    s.onload = () => ok(window.L);
    s.onerror = () => falla(new Error('No se pudo cargar el mapa'));
    document.head.appendChild(s);
  }));

  // Obras que dejan pasar los filtros de arriba (main.js marca con .filtrada las que no)
  const idsVisibles = () => new Set([...lista.querySelectorAll('.obra-card:not(.filtrada)')].map(c => c.dataset.id));

  const ventana = grupo => {
    const una = grupo.obras.length === 1;
    const filas = grupo.obras.map(o => {
      const foto = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '') + (o.miniatura || (o.fotos && o.fotos[0]) || '');
      // Si el pin es una ubicación extra con nombre (ej: "Plaza Sarmiento"), se muestra junto a la categoría
      const lugares = [...new Set(grupo.items.filter(i => i.obra === o && i.lugar).map(i => i.lugar))];
      const detalle = esc(o.categoria) + (lugares.length ? ' · ' + esc(lugares.join(', ')) : '');
      return `<li><a href="obra-${esc(o.id)}.html"><img src="${esc(chica(foto))}" alt="" width="52" height="36" loading="lazy" onerror="this.onerror=null;this.src='${esc(foto)}'"><span>${esc(o.nombre)}<small>${detalle}</small></span></a></li>`;
    }).join('');
    const lugar = ciudad(grupo.obras[0]);
    const aprox = grupo.items.every(i => i.aprox)
      ? `<p class="aviso-aprox">Ubicación aproximada${lugar ? ': centro de ' + esc(lugar) : ''}.</p>` : '';
    return `<div class="mapa-popup"><h3>${una ? 'Obra' : grupo.obras.length + ' obras en este lugar'}</h3><ul>${filas}</ul>${aprox}</div>`;
  };

  const dibujar = () => {
    if (!mapa) return;
    capa.clearLayers();
    const ids = idsVisibles();
    const grupos = new Map();
    conCoords.filter(o => ids.has(o.id)).forEach(o => puntosDe(o).forEach(p => {
      const clave = p.coords[0].toFixed(4) + ',' + p.coords[1].toFixed(4);
      if (!grupos.has(clave)) grupos.set(clave, { coords: p.coords, obras: [], items: [] });
      const g = grupos.get(clave);
      if (!g.obras.includes(o)) g.obras.push(o);       // una obra cuenta una sola vez por lugar, aunque tenga dos puntos juntos
      g.items.push(p);
    }));

    vacio.hidden = grupos.size > 0;
    if (!grupos.size) return;

    grupos.forEach(g => {
      const aprox = g.items.every(i => i.aprox);
      const icono = L.divIcon({
        className: 'pin-wrap',
        html: `<span class="pin-obra${aprox ? ' pin-obra--aprox' : ''}">${g.obras.length > 1 ? g.obras.length : PIN}</span>`,
        iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -18]
      });
      const titulo = g.obras.length === 1 ? g.obras[0].nombre : g.obras.length + ' obras: ' + g.obras.map(o => o.nombre).join(', ');
      L.marker(g.coords, { icon: icono, title: titulo, alt: titulo, keyboard: true, riseOnHover: true })
        .bindPopup(ventana(g), { maxWidth: 220, minWidth: 220 })
        .addTo(capa);
    });

    const puntos = [...grupos.values()].map(g => g.coords);
    mapa.fitBounds(L.latLngBounds(puntos), { padding: [48, 48], maxZoom: 15 });
  };

  const iniciar = async () => {
    try {
      L = await cargarLeaflet();
    } catch (e) { error.hidden = false; return; }
    if (mapa) return;

    const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapa = L.map(lienzo, { zoomControl: true, scrollWheelZoom: false, zoomAnimation: !sinAnimacion, fadeAnimation: !sinAnimacion, markerZoomAnimation: !sinAnimacion })
      .setView([-32.95, -60.65], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(mapa);
    capa = L.layerGroup().addTo(mapa);

    // La rueda del mouse hace zoom solo después de hacer clic en el mapa (si no, atrapa el scroll de la página)
    mapa.on('click', () => mapa.scrollWheelZoom.enable());
    lienzo.addEventListener('mouseleave', () => mapa.scrollWheelZoom.disable());

    dibujar();
  };

  const mostrar = vista => {
    const esMapa = vista === 'mapa';
    abierto = esMapa;
    document.body.classList.toggle('vista-mapa', esMapa);
    caja.hidden = !esMapa;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === vista)));

    // Deja la dirección compartible: obras.html?vista=mapa
    const url = new URL(location.href);
    if (esMapa) url.searchParams.set('vista', 'mapa'); else url.searchParams.delete('vista');
    history.replaceState(null, '', url);

    if (esMapa) {
      if (typeof window.dyEvento === 'function') window.dyEvento('Mapa de obras');
      iniciar().then(() => { if (mapa) { mapa.invalidateSize(); dibujar(); } });
    }
  };

  botones.forEach(b => b.addEventListener('click', () => mostrar(b.dataset.vista)));

  // Cuando se cambia un filtro, el mapa muestra solo las obras que quedaron
  document.addEventListener('filtros-aplicados', () => { if (abierto) dibujar(); });

  if (new URLSearchParams(location.search).get('vista') === 'mapa') mostrar('mapa');
})();
