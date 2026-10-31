/* =========================================================
   DYSCON S.A. - JavaScript
   ========================================================= */

// ---------- 1. Menú hamburguesa en móviles ----------
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  // Abre o cierra el menú y deja el botón en sintonía (☰ cerrado, ✕ abierto)
  const estadoMenu = (abierto) => {
    nav.classList.toggle('abierto', abierto);
    toggle.setAttribute('aria-expanded', abierto);
    toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    toggle.textContent = abierto ? '✕' : '☰';
  };

  toggle.addEventListener('click', () => estadoMenu(!nav.classList.contains('abierto')));

  // Cerrar el menú al tocar un link
  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => estadoMenu(false))
  );

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) estadoMenu(false);
  });
}

// ---------- 2. Sombra del header al bajar ----------
const header = document.getElementById('header');
if (header) {
  const sombra = () => header.classList.toggle('con-sombra', window.scrollY > 10);
  window.addEventListener('scroll', sombra, { passive: true });
  sombra();
}

// ---------- 4. Animación de aparición al hacer scroll (la de antes) ----------
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  el.classList.add('oculto');
  observer.observe(el);
});

// ---------- 5. Resaltar en el menú la sección que se está viendo ----------
const linksMenu = document.querySelectorAll('.nav a[href^="#"]');
const secciones = [...linksMenu]
  .map(l => document.querySelector(l.getAttribute('href')))
  .filter(Boolean);

if (secciones.length) {
  const espia = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        linksMenu.forEach(l =>
          l.classList.toggle('activo', l.getAttribute('href') === '#' + e.target.id)
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  secciones.forEach(s => espia.observe(s));
}

// ---------- 7. Año automático en el footer ----------
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

// ---------- 8. Filtros de obras y novedades ----------
// Controles que filtran: botones .filtro (data-filtro="valor") y desplegables .filtro-select.
// Cada uno lleva data-grupo="categoria" (sin grupo se usa "estado") y cada tarjeta guarda su valor
// en data-<grupo> (ej. data-categoria="salud"). Los grupos se combinan entre sí.
// También se puede entrar con un filtro ya aplicado: obras.html?categoria=salud
const botonesFiltro = document.querySelectorAll('.filtro');
const selectsFiltro = document.querySelectorAll('.filtro-select');

if (botonesFiltro.length || selectsFiltro.length) {
  const tarjetas = document.querySelectorAll('.grid .obra-card');
  const vacio = document.getElementById('sin-resultados');
  const contador = document.getElementById('contador-obras');       // opcional: "17 obras"
  const etiquetas = document.getElementById('filtros-activos');     // opcional: filtros aplicados
  const borrar = document.getElementById('borrar-filtros');          // opcional: botón "Borrar filtros"
  const grupoDe = el => el.dataset.grupo || 'estado';
  const activos = {};                                                // grupo -> valor elegido

  // Texto (y punto de color, si lo tiene) del filtro elegido, para mostrarlo como etiqueta
  const datosDe = (g, v) => {
    const b = [...botonesFiltro].find(x => grupoDe(x) === g && x.dataset.filtro === v);
    if (b) return { texto: b.textContent.trim(), punto: b.querySelector('.punto') };
    const s = [...selectsFiltro].find(x => grupoDe(x) === g);
    const o = s && [...s.options].find(x => x.value === v);
    return { texto: o ? o.textContent.trim() : v, punto: null };
  };

  const aplicar = () => {
    botonesFiltro.forEach(b => {
      const activo = (activos[grupoDe(b)] || 'todos') === b.dataset.filtro;
      b.classList.toggle('activo', activo);
      b.setAttribute('aria-pressed', activo);
    });
    selectsFiltro.forEach(s => { s.value = activos[grupoDe(s)] || 'todos'; });

    let visibles = 0;
    tarjetas.forEach(t => {
      const oculta = Object.entries(activos).some(([g, v]) => v !== 'todos' && t.dataset[g] !== v);
      t.classList.toggle('filtrada', oculta);
      if (!oculta) visibles++;
    });
    if (vacio) vacio.hidden = visibles > 0;
    if (contador) contador.textContent = visibles === 1 ? '1 obra' : visibles + ' obras';

    const elegidos = Object.entries(activos).filter(([, v]) => v !== 'todos');
    if (borrar) borrar.hidden = !elegidos.length;
    if (etiquetas) {
      etiquetas.replaceChildren(...elegidos.map(([g, v]) => {
        const { texto, punto } = datosDe(g, v);
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'etiqueta-filtro';
        b.setAttribute('aria-label', 'Quitar filtro: ' + texto);
        if (punto) b.appendChild(punto.cloneNode());
        b.append(texto + ' ');
        const x = document.createElement('span');
        x.setAttribute('aria-hidden', 'true');
        x.textContent = '✕';
        b.appendChild(x);
        b.addEventListener('click', () => { activos[g] = 'todos'; aplicar(); });   // quita solo este filtro
        li.appendChild(b);
        return li;
      }));
    }
  };

  botonesFiltro.forEach(b => b.addEventListener('click', () => {
    activos[grupoDe(b)] = b.dataset.filtro;
    aplicar();
  }));
  selectsFiltro.forEach(s => s.addEventListener('change', () => {
    activos[grupoDe(s)] = s.value;
    aplicar();
  }));
  if (borrar) borrar.addEventListener('click', () => {
    Object.keys(activos).forEach(g => { activos[g] = 'todos'; });
    aplicar();
  });

  // Filtro que llega por la dirección (ej. obras.html?categoria=patrimonio)
  const params = new URLSearchParams(location.search);
  botonesFiltro.forEach(b => {
    if (params.get(grupoDe(b)) === b.dataset.filtro) activos[grupoDe(b)] = b.dataset.filtro;
  });
  selectsFiltro.forEach(s => {
    const v = params.get(grupoDe(s));
    if (v && [...s.options].some(o => o.value === v)) activos[grupoDe(s)] = v;
  });
  aplicar();
}

// ---------- 9. Portada: el texto se desvanece cuando la página lo va tapando ----------
// Sirve para la portada del inicio (.hero) y para las franjas con foto de las demás páginas (.page-hero--img)
const heroSec = document.querySelector('.hero, .page-hero--img');
const heroTxt = document.querySelector('.hero-contenido, .page-hero--img > .contenedor');

// Franjas con foto: la foto es fija; acá se le da la posición y el alto exactos de la franja
if (heroSec && heroSec.classList.contains('page-hero--img')) {
  const calzarFoto = () => {
    heroSec.style.setProperty('--arriba-hero', (heroSec.getBoundingClientRect().top + window.scrollY) + 'px');
    heroSec.style.setProperty('--alto-hero', heroSec.offsetHeight + 'px');
  };
  new ResizeObserver(calzarFoto).observe(heroSec);
  calzarFoto();
}

if (heroSec && heroTxt) {
  let esperando = false;

  const desvanecer = () => {
    // "tope" = donde queda frenado el texto (lo define el CSS: top de .hero-contenido)
    const tope = parseFloat(getComputedStyle(heroTxt).top) || 0;
    // "margen" = separación entre el botón y la franja (lo define el CSS: padding-bottom de .hero)
    const margen = parseFloat(getComputedStyle(heroSec).paddingBottom) || 0;
    const finPortada = heroSec.getBoundingClientRect().bottom;   // dónde termina la portada en pantalla
    const opacidad = (finPortada - margen - tope) / (heroTxt.offsetHeight || 1);
    heroTxt.style.opacity = Math.min(1, Math.max(0, opacidad));
    esperando = false;
  };

  window.addEventListener('scroll', () => {
    if (!esperando) { esperando = true; requestAnimationFrame(desvanecer); }
  }, { passive: true });
  window.addEventListener('resize', desvanecer);
  desvanecer();
}

// Video de portada: pausa el video cuando ya bajaste y no se ve la portada (ahorra batería y datos en celulares)
const videoPortada = document.querySelector('.slides video');
if (videoPortada) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videoPortada.pause();
  } else if (heroSec) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) videoPortada.play().catch(() => { });
      else videoPortada.pause();
    }).observe(heroSec);
  }
}

// ---------- Email de contacto protegido contra spam ----------
const enlaceEmail = document.getElementById('email-contacto');

if (enlaceEmail) {
  const usuario = 'dysconsa';
  const dominio = 'dysconsa.com.ar';
  enlaceEmail.href = 'mailto:' + usuario + '@' + dominio;
  enlaceEmail.textContent = usuario + '@' + dominio;
}