/* Arma las tarjetas de novedades a partir de novedades-data.js. Se usa en dos páginas:
   - novedades.html (#lista-novedades): todas, ordenadas por fecha (la más nueva primero).
   - index.html (#novedades-destacadas): hasta 4 novedades.
     Si alguna tiene "Posición en la portada" (campo "destacada" en el panel), salen solo esas, en ese orden (1 va primera).
     Si ninguna la tiene, salen las 4 más nuevas. Si no hay novedades, la sección se oculta. */
(function () {
  if (typeof NOVEDADES === 'undefined') return;

  const fmt = f => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  // "Institucional" -> "institucional" (es el valor que usan los botones de filtro)
  const clave = c => c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // "2026_03_21_nodo/poster.jpg" -> "2026_03_21_nodo/poster-sm.webp" (la crea optimizar-imagenes.js)
  const chica = ruta => ruta.replace(/\.(jpe?g|png|webp)$/i, '-sm.webp');

  // primeras = cuántas tarjetas se cargan enseguida (el resto, a medida que se baja)
  const tarjeta = primeras => (n, i) => `
      <article class="obra-card reveal" data-estado="${clave(n.categoria)}">
        <a href="novedad-${n.id}.html">
          <div class="obra-img">
            <img src="img/novedades/${chica(n.portada)}" alt="${n.titulo}" width="640" height="427" loading="${i < primeras ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.src='img/novedades/${n.portada}'">
            <span class="tag">${n.categoria}</span>
          </div>
          <div class="obra-cuerpo">
            <h3>${n.titulo}</h3>
            <p class="obra-lugar"><svg class="icon"><use href="#i-calendario"/></svg> <time datetime="${n.fecha}">${fmt(n.fecha)}</time> <svg class="icon obra-flecha"><use href="#i-flecha"/></svg></p>
          </div>
        </a>
      </article>`;

  const porFecha = [...NOVEDADES].sort((a, b) => b.fecha.localeCompare(a.fecha));

  // ---------- novedades.html: listado completo ----------
  const grid = document.getElementById('lista-novedades');
  if (grid) grid.innerHTML = porFecha.map(tarjeta(4)).join('');

  // ---------- index.html: novedades destacadas ----------
  const destacadas = document.getElementById('novedades-destacadas');
  if (destacadas) {
    const orden = d => (typeof d === 'number' ? d : 99);
    const marcadas = porFecha.filter(n => n.destacada).sort((a, b) => orden(a.destacada) - orden(b.destacada));
    const elegidas = (marcadas.length ? marcadas : porFecha).slice(0, 4);
    if (elegidas.length) destacadas.innerHTML = elegidas.map(tarjeta(0)).join('');
    else { const seccion = destacadas.closest('section'); if (seccion) seccion.hidden = true; }
  }
})();
