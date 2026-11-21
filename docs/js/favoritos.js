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

  // Un solo dibujo para los dos estados: sin relleno con contorno negro (no favorita) y relleno rosa (favorita).
  // Los colores están en css/styles.css (.fav-btn)
  const CORAZON = '<svg class="icon fav-icono" viewBox="0 0 24 21.7" aria-hidden="true"><path d="M12 20.5C12 20.5 1.2 13.8 1.2 6.8C1.2 3.5 3.7 1.2 6.8 1.2C9.1 1.2 11 2.4 12 4.2C13 2.4 14.9 1.2 17.2 1.2C20.3 1.2 22.8 3.5 22.8 6.8C22.8 13.8 12 20.5 12 20.5Z"/></svg>';

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
