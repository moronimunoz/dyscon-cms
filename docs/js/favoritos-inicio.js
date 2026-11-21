/* Sección "Mis Favoritos" del inicio (index.html, #favoritos-inicio).
   - Muestra las obras marcadas con el corazón (se guardan en este navegador, ver js/favoritos.js).
   - Máximo 4 tarjetas: las últimas 4 que se marcaron (la más reciente primero).
   - Si no hay ninguna obra favorita, la sección queda oculta (atributo hidden) y aparece sola cuando se marca la primera.
   - Se actualiza en vivo al tocar un corazón (acá o en "Obras destacadas") o al cambiar favoritos en otra pestaña.
   Se carga DESPUÉS de obras-lista.js (usa su tarjeta) y ANTES de main.js (para la animación de aparición). */
(function () {
  const seccion = document.getElementById('favoritos-inicio');
  const grilla = document.getElementById('favoritos-destacados');
  if (!seccion || !grilla || typeof OBRAS === 'undefined' || !window.Favoritos || typeof window.tarjetaObra !== 'function') return;

  const LIMITE = 4;
  const enlace = document.getElementById('favoritos-ver-todos');
  let primeraVez = true;

  // Obras favoritas que todavía existen en el sitio (si una se borró o pasó a borrador, se ignora), la más reciente primero
  const favoritas = () => {
    const ids = window.Favoritos.get().map(String).reverse();
    return ids.map(id => OBRAS.find(o => String(o.id) === id)).filter(Boolean);
  };

  const dibujar = () => {
    const todas = favoritas();
    const lista = todas.slice(0, LIMITE);

    // Para que la página no "salte" si la sección aparece o desaparece más arriba de lo que se está mirando
    const referencia = seccion.nextElementSibling;
    const antes = referencia ? referencia.getBoundingClientRect().top : 0;
    const estabaArriba = antes <= 0;   // ya se había scrolleado más abajo de donde está la sección

    grilla.innerHTML = lista.map((o, i) => {
      const html = window.tarjetaObra(o, i);
      // La animación de aparición (main.js) solo en la carga; después, las tarjetas se ven directo
      return primeraVez ? html : html.replace('obra-card reveal', 'obra-card');
    }).join('');
    seccion.hidden = lista.length === 0;

    if (enlace) {
      // Si hay más de 4, el enlace lleva al listado completo de favoritas
      enlace.hidden = todas.length <= LIMITE;
      enlace.querySelector('.favoritos-cantidad').textContent = todas.length;
    }

    if (!primeraVez && referencia && estabaArriba) {
      const ajuste = referencia.getBoundingClientRect().top - antes;   // 0 si el navegador ya lo corrigió solo
      if (ajuste) window.scrollBy(0, ajuste);
    }
    primeraVez = false;
  };

  document.addEventListener('favoritos-cambiaron', dibujar);
  dibujar();
})();
