/* Obras favoritas (corazón). Se guardan en este navegador (localStorage), no en el servidor.
   Se carga ANTES de js/obras-lista.js, que lo usa para dibujar cada corazón en su estado.

   - Favoritos.get()         -> lista de ids guardados
   - Favoritos.has(id)       -> true si la obra es favorita
   - Favoritos.toggle(id)    -> guarda o quita la obra y devuelve si quedó como favorita
   - Favoritos.boton(id, c)  -> HTML del botón corazón (c = clase extra opcional)

   Cualquier botón .fav-btn[data-id] funciona solo: acá hay un único evento de clic para toda la página,
   así que sirve también para las tarjetas que se dibujan después (filtros, obras relacionadas).
   Cuando algo cambia se avisa con el evento "favoritos-cambiaron" (lo escucha js/main.js). */
(function () {
  const CLAVE = 'dyscon-favoritos';

  const get = () => {
    try {
      const lista = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(lista) ? lista : [];
    } catch (_) { return []; }       // sin localStorage (modo privado) o dato dañado: sin favoritos
  };

  const guardar = lista => {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (_) { }
  };

  const has = id => get().includes(String(id));

  const toggle = id => {
    id = String(id);
    const lista = get();
    const i = lista.indexOf(id);
    if (i >= 0) lista.splice(i, 1); else lista.push(id);
    guardar(lista);
    return i < 0;                     // true = ahora es favorita
  };

  const CORAZON = '<svg class="icon fav-icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  const boton = (id, extra) => {
    const activo = has(id);
    return `<button type="button" class="fav-btn${extra ? ' ' + extra : ''}" data-id="${esc(id)}" aria-pressed="${activo}"
      aria-label="${activo ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${CORAZON}</button>`;
  };

  // Deja todos los corazones de la página (de esa obra, o de todas) como corresponde
  const pintar = id => {
    const favoritos = get();
    document.querySelectorAll('.fav-btn' + (id ? '[data-id="' + CSS.escape(id) + '"]' : '')).forEach(b => {
      const activo = favoritos.includes(b.dataset.id);
      b.setAttribute('aria-pressed', activo);
      b.setAttribute('aria-label', activo ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
  };

  // Un solo clic para todos los corazones, aunque se creen después
  document.addEventListener('click', e => {
    const b = e.target.closest('.fav-btn');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const activo = toggle(b.dataset.id);
    pintar(b.dataset.id);
    if (typeof window.dyEvento === 'function') window.dyEvento(activo ? 'Favorito: agregar' : 'Favorito: quitar');
    document.dispatchEvent(new CustomEvent('favoritos-cambiaron'));
  });

  // Si se cambian favoritos en otra pestaña, esta también se actualiza
  window.addEventListener('storage', e => {
    if (e.key !== CLAVE) return;
    pintar();
    document.dispatchEvent(new CustomEvent('favoritos-cambiaron'));
  });

  window.Favoritos = { get, has, toggle, boton };
})();
