/* Visor de fotos ampliadas, con flechas, contador ("3 / 10"), botón X y teclado.
   Lo usan obra.js y novedad.js:  iniciarVisor(main.querySelectorAll('.galeria button'))
   Cada botón de la galería tiene data-src con la ruta de la foto. */
/* "casa/01.jpg" -> "casa/01-sm.webp" (640 px), "-lg.webp" (1600 px). Las crea optimizar-imagenes.js */
function variante(ruta, tam) { return ruta.replace(/\.(jpe?g|png|webp)$/i, `-${tam}.webp`); }

/* Pone una foto de fondo en un elemento (encabezados). Usa la versión grande y, si todavía no existe, la original */
function ponerFondo(el, ruta) {
  if (!el) return;
  const grande = variante(ruta, 'lg');
  const probar = new Image();
  probar.onload = () => { el.style.backgroundImage = `url('${grande}')`; };
  probar.onerror = () => { el.style.backgroundImage = `url('${ruta}')`; };
  probar.src = grande;
}

function iniciarVisor(botones) {
  const visor = document.getElementById('visor');
  if (!visor || !botones.length) return;

  const img = visor.querySelector('img');
  const contador = visor.querySelector('.visor-contador');
  const fotos = [...botones].map(b => b.dataset.src);
  let actual = 0;

  const mostrar = n => {
    actual = (n + fotos.length) % fotos.length;       // da la vuelta al llegar al final
    img.onerror = () => { img.onerror = null; img.src = botones[actual].dataset.orig; };   // si falta la versión grande, la original
    img.src = fotos[actual];
    img.alt = `Foto ${actual + 1} de ${fotos.length}`;
    contador.textContent = `${actual + 1} / ${fotos.length}`;
  };

  // Abrir al tocar una miniatura
  botones.forEach((b, i) => b.addEventListener('click', () => { mostrar(i); visor.showModal(); }));

  visor.querySelector('.visor-prev').addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('.visor-next').addEventListener('click', () => mostrar(actual + 1));
  visor.querySelector('.visor-cerrar').addEventListener('click', () => visor.close());

  // Cerrar al tocar el fondo oscuro (no la foto); Escape también cierra; flechas del teclado para moverse
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });

  // Con una sola foto no hacen falta las flechas ni el contador (la X sí queda)
  visor.classList.toggle('visor--una', fotos.length < 2);
}

/* Arma la galería de fotos de una ficha (obra o novedad). El diseño depende de cuántas fotos hay:
     1 foto  -> ocupa todo el ancho
     2 fotos -> mitad y mitad
     3 fotos -> una grande (mitad izquierda) y dos apiladas a la derecha
     4 fotos -> dos grandes y dos apiladas en el último tercio
     5 fotos -> una grande a la izquierda y cuatro chicas (2 x 2)
     6 o más -> igual que 5, pero la quinta se oscurece y dice "+N" (las fotos que faltan)
   Todas las fotos se abren en el visor, también las que no se ven en la grilla.
   El diseño lo dibuja el CSS (clases galeria--1 a galeria--5 en obra.css). */
function crearGaleria(fotos, base, titulo) {
  // Se ignoran los lugares vacíos (por ejemplo una coma doble) y los nombres repetidos, para no contar de más
  const lista = [...new Set(Array.from(fotos || []).filter(Boolean))];
  if (!lista.length) return '';
  const total = lista.length;
  const resto = total - 5;
  const t = String(titulo).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  // La grilla usa la versión chica (o la grande si la pantalla la necesita); el visor, la grande.
  // Si falta alguna versión (foto nueva sin procesar), cae a la original.
  const tamanos = total === 1 ? '(max-width: 1100px) 100vw, 1100px' : '(max-width: 700px) 50vw, 550px';
  const botones = lista.map((f, i) => {
    const ultima = i === 4 && resto > 0;             // la quinta foto, cuando hay más de cinco
    const etiqueta = ultima ? `Ver las ${total} fotos` : `Ampliar foto ${i + 1}`;
    const original = base + f, chica = variante(original, 'sm'), grande = variante(original, 'lg');
    return `<button type="button" data-src="${grande}" data-orig="${original}" aria-label="${etiqueta}"><img src="${chica}" srcset="${chica} 640w, ${grande} 1600w" sizes="${tamanos}" alt="${t} - foto ${i + 1}" loading="lazy" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${original}'">${ultima ? `<span class="galeria-mas" aria-hidden="true">+${resto}</span>` : ''}</button>`;
  }).join('');

  return `<div class="galeria galeria--${Math.min(total, 5)}">${botones}</div>`;
}