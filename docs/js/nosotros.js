/* Nosotros: contador de cifras y carrusel de marcas */
(function () {

  // ---------- 1. Las cifras "cuentan" al aparecer en pantalla ----------
  const cifras = document.querySelector('.cifras-lista');
  if (cifras) {
    const nums = cifras.querySelectorAll('.num');
    const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!sinAnimacion) {
      nums.forEach(n => { n.textContent = '0'; });

      const contar = () => nums.forEach(n => {
        const total = Number(n.dataset.valor);
        const duracion = 1400, inicio = performance.now();
        const paso = ahora => {
          const p = Math.min(1, (ahora - inicio) / duracion);
          n.textContent = Math.round(total * (1 - Math.pow(1 - p, 3))).toLocaleString('es-AR');
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      });

      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { contar(); obs.disconnect(); }
      }, { threshold: 0.4 });
      obs.observe(cifras);
    }
  }

  // ---------- 2. Carrusel de marcas: avanza de a un logo, con flechas, puntos y deslizando ----------
  const carrusel = document.querySelector('.carrusel');
  if (carrusel) {
    const pista = carrusel.querySelector('.carrusel-pista');
    const puntos = document.querySelector('.carrusel-dots');
    const logos = pista.querySelectorAll('.marca');
    if (!logos.length) return;

    let posiciones = 1;                                          // cuántos "pasos" tiene el carrusel

    const ancho = () => logos[0].getBoundingClientRect().width;  // ancho de un logo
    const visibles = () => Math.max(1, Math.round(pista.clientWidth / ancho()));
    const max = () => pista.scrollWidth - pista.clientWidth;
    const actual = () => Math.min(posiciones - 1, Math.round(pista.scrollLeft / ancho()));
    const ir = n => pista.scrollTo({ left: Math.min(n * ancho(), max()), behavior: 'smooth' });

    const marcar = () => {
      const a = actual();
      puntos.querySelectorAll('button').forEach((p, i) => p.classList.toggle('activo', i === a));
    };

    // Un punto por posición: con 16 logos y 4 visibles hay 13 puntos
    const armar = () => {
      posiciones = Math.max(1, logos.length - visibles() + 1);
      puntos.innerHTML = Array.from({ length: posiciones }, (_, i) =>
        `<button type="button" aria-label="Ir al logo ${i + 1}"></button>`).join('');
      puntos.querySelectorAll('button').forEach((p, i) => p.addEventListener('click', () => ir(i)));
      carrusel.classList.toggle('carrusel--una', posiciones < 2);   // si todo entra, no hay controles
      marcar();
    };

    carrusel.querySelector('.carrusel-prev').addEventListener('click', () =>
      ir(actual() === 0 ? posiciones - 1 : actual() - 1));
    carrusel.querySelector('.carrusel-next').addEventListener('click', () =>
      ir(actual() === posiciones - 1 ? 0 : actual() + 1));

    pista.addEventListener('scroll', () => requestAnimationFrame(marcar), { passive: true });
    window.addEventListener('resize', armar);
    window.addEventListener('load', armar);
    armar();
  }
})();