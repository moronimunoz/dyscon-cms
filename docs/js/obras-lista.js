/* Arma las tarjetas de obras a partir de obras-data.js. Se usa en dos páginas:
   - obras.html (#lista-obras): todas las obras, más los botones de filtro por categoría.
   - index.html (#obras-destacadas): solo las obras que tienen "destacada" en OBRAS.
     destacada: true  -> aparece (en el orden en que está escrita en OBRAS)
     destacada: 1, 2… -> aparece y el número define el orden (1 va primera) */
(function () {
  if (typeof OBRAS === 'undefined') return;

  // Orden de las categorías en el desplegable (las que no figuren acá van al final, por orden alfabético).
  // No importa si se escriben con mayúsculas o tildes distintas: se compara sin esas diferencias.
  const ORDEN_CATEGORIAS = ['Educación', 'Salud', 'Patrimonio', 'Viviendas', 'Comunidad', 'Espacio público',
    'Infraestructura', 'Industrial', 'Comercial', 'Institucional'];

  // Texto del punto de color de la esquina, según el estado de la obra
  const ESTADOS = { inicio: 'Obra iniciando', obra: 'Obra en ejecución', terminado: 'Obra terminada' };

  // Evita que comillas o símbolos en un texto rompan el HTML de un atributo
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  // "Espacio público" -> "espacio-publico" (valor que usan los filtros y los vínculos ?categoria=...)
  const slug = t => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-');

  // "casa/01.jpg" -> "casa/01-sm.webp" (la crea optimizar-imagenes.js)
  const chica = ruta => ruta.replace(/\.(jpe?g|png|webp)$/i, '-sm.webp');

  // i = posición en la lista: las primeras se cargan enseguida, el resto a medida que se baja
  const tarjeta = (o, i) => {
    const carpeta = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '');
    const foto = carpeta + (o.miniatura || (o.fotos && o.fotos[0]) || '');
    const estado = ESTADOS[o.estado]
      ? `<span class="punto punto--${o.estado}" role="img" aria-label="${ESTADOS[o.estado]}" title="${ESTADOS[o.estado]}"></span>`
      : '';

    return `
      <article class="obra-card reveal" data-categoria="${slug(o.categoria)}" data-tipo="${o.tipo}" data-estado="${o.estado}">
        <a href="obra-${o.id}.html">
          <div class="obra-img">
            ${estado}
            <img src="${chica(foto)}" alt="${esc(o.nombre)}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.src='${esc(foto)}'">
            <div class="obra-etiquetas">
              <span class="tag">${o.categoria}</span>
              ${o.tipo === 'colaboracion' ? '<span class="tag-ut" title="Unión Transitoria" aria-label="Unión Transitoria">UT</span>' : ''}
            </div>
          </div>
          <div class="obra-cuerpo">
            <h3>${o.nombre}</h3>
            <p class="obra-lugar"><svg class="icon"><use href="#i-pin"/></svg> ${o.ubicacion || ''} <svg class="icon obra-flecha"><use href="#i-flecha"/></svg></p>
          </div>
        </a>
      </article>`;
  };

  // ---------- obras.html: listado completo + opciones del desplegable de categoría ----------
  const lista = document.getElementById('lista-obras');
  if (lista) {
    lista.innerHTML = OBRAS.map(tarjeta).join('');

    const selector = document.getElementById('filtro-categoria');
    if (selector) {
      const lugar = c => { const i = ORDEN_CATEGORIAS.findIndex(o => slug(o) === slug(c)); return i < 0 ? 999 : i; };
      // Una opción por categoría, aunque en los datos esté escrita con mayúsculas o tildes distintas
      const categorias = new Map();
      OBRAS.forEach(o => { if (!categorias.has(slug(o.categoria))) categorias.set(slug(o.categoria), o.categoria); });
      [...categorias.values()]
        .sort((a, b) => lugar(a) - lugar(b) || a.localeCompare(b, 'es'))
        .forEach(c => selector.insertAdjacentHTML('beforeend', `<option value="${slug(c)}">${c}</option>`));
    }
  }

  // ---------- index.html: obras destacadas ----------
  const destacadas = document.getElementById('obras-destacadas');
  if (destacadas) {
    const orden = d => (typeof d === 'number' ? d : 99);
    destacadas.innerHTML = OBRAS
      .filter(o => o.destacada)
      .sort((a, b) => orden(a.destacada) - orden(b.destacada))
      .map(tarjeta).join('');
  }
})();