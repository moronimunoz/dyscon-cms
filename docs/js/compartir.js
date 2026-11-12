/* Botón "Compartir" de las fichas de obra.
   Se agrega solo, arriba a la derecha de la barra de datos (la dibuja js/obra.js).
   Comparte la dirección de la página que se está viendo. */
(function () {
  function iniciar() {
    const pagina = document.querySelector('.obra-pagina');
    if (!pagina || document.querySelector('.obra-compartir')) return;

    const nombre = ((document.querySelector('.page-hero h1') || {}).textContent || document.title).trim();
    const url = location.href.split('#')[0];
    const texto = nombre + ' | DyScon S.A.';
    const enc = encodeURIComponent;

    // Íconos de línea (mismo estilo que el resto del sitio)
    const svg = d => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
    const iconos = {
      compartir: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>'),
      whatsapp: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-.9.7a3.5 3.5 0 0 1-1.7-1.7l.7-.9-1-2z"/>'),
      facebook: svg('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
      linkedin: svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'),
      x: svg('<path d="M4 4l11.7 16H20L8.3 4z"/><path d="M4 20l6.8-6.8M13.2 10.8L20 4"/>'),
      correo: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a2 2 0 0 1-2.06 0L2 7"/>'),
      enlace: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
      ok: svg('<path d="M20 6L9 17l-5-5"/>'),
      mas: svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>')
    };

    const redes = [
      ['whatsapp', 'WhatsApp', 'https://wa.me/?text=' + enc(texto + '\n' + url)],
      ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url)],
      ['linkedin', 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url)],
      ['x', 'X', 'https://twitter.com/intent/tweet?text=' + enc(texto) + '&url=' + enc(url)],
      ['correo', 'Correo', 'mailto:?subject=' + enc(texto) + '&body=' + enc('Mirá esta obra de DyScon S.A.: ' + url)]
    ];

    const caja = document.createElement('div');
    caja.className = 'obra-compartir' + (pagina.querySelector('.obra-resumen') ? '' : ' obra-compartir--sin-barra');
    caja.innerHTML = `
      <button type="button" class="obra-compartir-boton" aria-label="Compartir esta obra" aria-expanded="false"
        aria-controls="menu-compartir" data-evento="Compartir obra: abrir">${iconos.compartir}</button>
      <ul class="obra-compartir-menu" id="menu-compartir" hidden>
        <li class="obra-compartir-titulo" aria-hidden="true">Compartir</li>
        ${redes.map(([k, t, href]) => `<li><a class="obra-compartir-opcion" data-red="${k}" href="${href}"
          ${k === 'correo' ? '' : 'target="_blank" rel="noopener noreferrer"'} data-evento="Compartir obra: ${t}">${iconos[k]}<span>${t}</span></a></li>`).join('')}
        <li><button type="button" class="obra-compartir-opcion" data-red="enlace" data-evento="Compartir obra: copiar enlace">${iconos.enlace}<span>Copiar enlace</span></button></li>
        ${navigator.share ? `<li><button type="button" class="obra-compartir-opcion" data-red="mas" data-evento="Compartir obra: más opciones">${iconos.mas}<span>Más opciones…</span></button></li>` : ''}
      </ul>`;
    pagina.insertAdjacentElement('afterbegin', caja);

    const boton = caja.querySelector('.obra-compartir-boton');
    const menu = caja.querySelector('.obra-compartir-menu');

    const cerrar = devolverFoco => {
      menu.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      if (devolverFoco) boton.focus();
    };
    const abrir = () => {
      menu.hidden = false;
      menu.classList.remove('obra-compartir-menu--abajo');
      // Si arriba no entra (pantalla baja o scroll), se abre hacia abajo
      const arriba = boton.getBoundingClientRect().top - 90;   // 90 = alto del menú de navegación
      if (arriba < menu.offsetHeight + 12) menu.classList.add('obra-compartir-menu--abajo');
      boton.setAttribute('aria-expanded', 'true');
    };

    boton.addEventListener('click', () => (menu.hidden ? abrir() : cerrar(false)));
    document.addEventListener('click', e => { if (!caja.contains(e.target)) cerrar(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) cerrar(true); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar(false)));

    // Copiar enlace
    const copiar = caja.querySelector('[data-red="enlace"]');
    copiar.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(url); ok = true; }
      catch (_) {
        const t = document.createElement('textarea');
        t.value = url; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { ok = document.execCommand('copy'); } catch (__) { }
        t.remove();
      }
      const span = copiar.querySelector('span');
      const icono = copiar.querySelector('svg');
      span.textContent = ok ? '¡Enlace copiado!' : 'No se pudo copiar';
      if (ok) icono.outerHTML = iconos.ok;
      setTimeout(() => { cerrar(false); span.textContent = 'Copiar enlace'; const i = copiar.querySelector('svg'); if (i) i.outerHTML = iconos.enlace; }, 1400);
    });

    // Celular: abre las opciones nativas del teléfono (Instagram, Telegram, etc.)
    const mas = caja.querySelector('[data-red="mas"]');
    if (mas) mas.addEventListener('click', () => {
      navigator.share({ title: texto, text: texto, url }).catch(() => { });
      cerrar(false);
    });
  }

  // js/obra.js dibuja la ficha de forma sincrónica; si por algún motivo todavía no está, espera a que aparezca
  if (document.querySelector('.obra-pagina')) iniciar();
  else {
    const main = document.getElementById('detalle');
    if (main) new MutationObserver((_, ob) => {
      if (document.querySelector('.obra-pagina')) { ob.disconnect(); iniciar(); }
    }).observe(main, { childList: true });
  }
})();
