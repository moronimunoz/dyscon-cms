/* Dibuja la página de una obra a partir de obras-data.js
   Se usa así: obra.html?id=casa-m */
(function () {
  const main = document.getElementById('detalle');
  // En las páginas generadas por build.js el id viene en <body data-id>; en obra.html?id=... viene de la dirección
  const id = document.body.dataset.id || new URLSearchParams(location.search).get('id');
  const o = OBRAS.find(x => x.id === id);

  if (!o) {
    main.innerHTML = `<section class="contenedor ficha"><h1>Obra no encontrada</h1>
      <p><a href="obras.html" class="link-flecha">Volver a Obras <svg class="icon"><use href="#i-flecha"/></svg></a></p></section>`;
    return;
  }

  document.title = `${o.nombre} | DyScon S.A.`;

  // Las páginas generadas por build.js ya traen su canonical; solo se agrega si falta (obra.html?id=...)
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://dysconsa.com.ar/obra.html?id=' + o.id;
    document.head.appendChild(canonical);
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const limpiar = t => t.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const resumen = o.resumen
      ? limpiar(o.resumen)
      : (o.descripcion && o.descripcion[0])
        ? limpiar(o.descripcion[0])
        : `${o.categoria}${o.ubicacion ? ' en ' + o.ubicacion : ''}. Obra de DyScon S.A.`;
    metaDesc.setAttribute('content', `${o.nombre}: ${resumen}`.slice(0, 155));
  }

  // ---------- Utilidades de texto ----------
  const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const texto = t => String(t || '').replace(/<[^>]*>/g, '').trim();
  const sinPunto = t => texto(t).replace(/[\s.]+$/, '');
  // "Septiembre, 2023 - Finalizado." -> "Septiembre, 2023" (lo de "Finalizado" ya lo dice el estado)
  const limpiarPlazo = t => sinPunto(t).replace(/\s*[-–—]\s*finalizad[oa]$/i, '').replace(/\s*[-–—]\s*$/, '');

  // ---------- Estado: Inicio / En obra / Terminado ----------
  // El chip activo se pinta entero: Inicio naranja y En obra verde (los dos titilan); Terminado no cambia
  const pasos = [['inicio', 'Inicio'], ['obra', 'En obra'], ['terminado', 'Terminado']];
  const estados = `<div class="estados">${pasos.map(([k, t]) =>
    `<span class="${k === o.estado ? 'activo activo--' + k : ''}">${t}</span>`
  ).join('')}</div>`;

  // ---------- Modalidad ----------
  const [conNombre, ...conResto] = texto(o.con).split(/\s+[-–—]\s+/);
  const modalidad = o.tipo === 'colaboracion'
    ? { valor: 'Unión Transitoria' + (conNombre ? ' con ' + conNombre : ' (UT)'), sub: conResto.join(' - ') }
    : { valor: 'Obra propia', sub: '' };

  // ---------- Ubicación: "Ciudad · Provincia" -> dos líneas ----------
  const [ubiPrincipal, ...ubiResto] = texto(o.ubicacion).split(/\s*·\s*/);
  const ubicacion = { valor: ubiPrincipal, sub: ubiResto.join(' · ') };

  // ---------- Barra de datos clave ----------
  // Hasta 4 datos, en este orden: Comitente, Superficie, Plazo, Estado.
  // Si hay menos de 4 se completa con Modalidad y luego Ubicación. Cada dato aparece solo si existe.
  // El sitio entrega Superficie y Plazo dentro de la lista "datos" ("Superficie: 4.000 m².");
  // acá se sacan de la lista para mostrarlos en la barra y no repetirlos abajo.
  const buscar = nombre => {
    const re = new RegExp('^\\s*' + nombre + '\\s*:\\s*', 'i');
    const hallado = (o.datos || []).find(d => re.test(texto(d)));
    return hallado ? texto(hallado).replace(re, '') : '';
  };
  const restoDatos = (o.datos || []).filter(d => !/^\s*(superficie|plazo)\s*:/i.test(texto(d)));
  const comitente = sinPunto(o.comitente);
  const superficie = sinPunto(o.superficie || buscar('superficie'));
  const plazo = limpiarPlazo(o.plazo || buscar('plazo'));
  const mitad = !!(superficie && plazo);        // en el celular, Superficie y Plazo van lado a lado
  const datos = [];
  if (comitente) datos.push({ k: 'Comitente', v: esc(comitente), ancho: true, clase: comitente.length > 45 ? 'comitente obra-dato--largo' : 'comitente' });
  if (superficie) datos.push({ k: 'Superficie', v: esc(superficie), mitad });
  if (plazo) datos.push({ k: 'Plazo', v: esc(plazo), mitad });
  if (o.estado) datos.push({ k: 'Estado', html: estados, ancho: true, clase: 'estado' });
  let modalidadEnBarra = false;
  if (datos.length < 4 && datos.length >= 1) {
    datos.push({ k: 'Modalidad', v: esc(modalidad.valor), sub: esc(modalidad.sub), ancho: true });
    modalidadEnBarra = true;
  }
  if (datos.length < 4 && ubicacion.valor) datos.push({ k: 'Ubicación', v: esc(ubicacion.valor), sub: esc(ubicacion.sub), ancho: true });

  const barra = datos.length > 1
    ? `<dl class="obra-resumen">${datos.map(d =>
      `<div class="obra-dato${d.clase ? ' obra-dato--' + d.clase : ''}${d.mitad ? ' obra-dato--mitad' : ''}${d.ancho ? ' obra-dato--ancho' : ''}"><dt>${d.k}</dt><dd>${d.html || `<span class="valor">${d.v}</span>${d.sub ? `<span class="sub">${d.sub}</span>` : ''}`}</dd></div>`
    ).join('')}</dl>`
    : '';
  if (!barra) modalidadEnBarra = false;

  // ---------- Columna principal ----------
  // La descripción viene del panel como HTML; los saltos de línea (<br>) se vuelven párrafos separados
  const parrafos = (o.descripcion || [])
    .map(p => p.replace(/^\s*<p[^>]*>|<\/p>\s*$/gi, '').replace(/(?:<br\s*\/?>\s*)+/gi, '</p><p>'))
    .filter(p => texto(p))
    .map(p => `<p>${p}</p>`).join('');

  // Campo opcional "espacios" (lista de textos): se muestra como etiquetas. Si la obra no lo tiene, no aparece.
  const espacios = Array.isArray(o.espacios) && o.espacios.length
    ? `<h3>Espacios equipados</h3><ul class="obra-etiquetas">${o.espacios.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : '';

  const lista = restoDatos.length
    ? `<h3>Objetivos y datos</h3><ul class="ficha-datos">${restoDatos.map(d => `<li>${d}</li>`).join('')}</ul>` : '';

  const textoHtml = (parrafos ? `<h2>Sobre la obra</h2>${parrafos}` : '') + espacios + lista;

  // ---------- Columna lateral: modalidad (si no está en la barra), mapa y botón ----------
  const base = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '');
  const altBase = o.nombre + (ubicacion.valor ? ', ' + ubicacion.valor : '');   // "Casa M, Rosario" + ", foto 3 de 12"
  const fotos = crearGaleria(o.fotos, base, altBase);
  const totalFotos = new Set(Array.from(o.fotos || []).filter(Boolean)).size;

  // El número es el zoom: 14 muestra el barrio, 16 la cuadra y 18 casi el edificio
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(o.mapa || o.ubicacion)}&z=16&output=embed`;
  const esCodigoPlus = /^[A-Z0-9]{4,}\+[A-Z0-9]{2,}/.test(o.mapa || '');   // "X98V+JHG ..." no es una dirección legible
  const direccion = (o.mapa && !esCodigoPlus) ? o.mapa : o.ubicacion;

  const lateral = `<aside class="obra-lateral">
      ${modalidadEnBarra ? '' : `<div><p class="obra-rotulo">Modalidad</p><p class="valor">${esc(modalidad.valor)}</p>${modalidad.sub ? `<p class="sub">${esc(modalidad.sub)}</p>` : ''}</div>`}
      ${(o.mapa || o.ubicacion) ? `<div><p class="obra-rotulo">Ubicación</p><div class="mapa"><iframe src="${mapa}" title="Mapa: ${o.nombre}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>${direccion ? `<p class="sub">${esc(direccion)}</p>` : ''}</div>` : ''}
      <a href="contacto.html" class="btn btn--teal obra-cta" data-evento="Consulta por obra similar">Consultar por una obra similar</a>
    </aside>`;

  const videos = crearVideos(o.video, o.nombre, 'img/obras/');
  const tituloVideo = [].concat(o.video || []).length > 1 ? 'Videos' : 'Video';
  // ---------- Obras relacionadas (las calcula build.js) y navegación anterior / siguiente ----------
  const parecidas = (o.relacionadas || []).map(rid => OBRAS.find(x => x.id === rid)).filter(Boolean);
  const relacionadas = parecidas.length && window.tarjetaObra
    ? `<section class="obra-bloque obra-relacionadas"><h2>Otras obras que te pueden interesar</h2><div class="grid">${parecidas.map(r => window.tarjetaObra(r, 99)).join('')}</div></section>`
    : '';

  // El orden es el del listado de obras.html; después de la última se vuelve a la primera
  const lugar = OBRAS.findIndex(x => x.id === o.id);
  const vecina = paso => OBRAS[(lugar + paso + OBRAS.length) % OBRAS.length];
  const enlaceVecina = (r, rel, rotulo) => {
    const texto = `<span class="obra-nav-texto"><small>${rotulo}</small><b>${esc(r.nombre)}</b></span>`;
    const flecha = '<svg class="icon" aria-hidden="true"><use href="#i-flecha"/></svg>';
    return `<a class="obra-nav-${rel === 'prev' ? 'prev' : 'next'}" href="obra-${esc(r.id)}.html" rel="${rel}">${rel === 'prev' ? flecha + texto : texto + flecha}</a>`;
  };
  const navegacion = OBRAS.length > 2
    ? `<nav class="obra-nav" aria-label="Seguir viendo obras">${enlaceVecina(vecina(-1), 'prev', 'Obra anterior')}<a class="obra-nav-todas" href="obras.html">Todas las obras</a>${enlaceVecina(vecina(1), 'next', 'Obra siguiente')}</nav>`
    : `<p class="ficha-volver"><a href="obras.html" class="link-flecha">Volver a todas las obras <svg class="icon"><use href="#i-flecha"/></svg></a></p>`;

  const bloque = (titulo, html, extra) => html ? `<section class="obra-bloque"><h2>${titulo}${extra ? `<span>${extra}</span>` : ''}</h2>${html}</section>` : '';

  main.innerHTML = `
    <section class="page-hero page-hero--obra">
      <div class="contenedor">
        <p class="migas"><a href="index.html">Inicio</a> / <a href="obras.html">Obras</a> / ${o.nombre}</p>
        <div class="chips"><span class="chip">${o.categoria}</span>${o.tipo === 'colaboracion' ? '<span class="chip chip--ut" title="Unión Transitoria" aria-label="Unión Transitoria">UT</span>' : ''}</div>
        <h1>${o.nombre}</h1>
        ${o.ubicacion ? `<p>${o.ubicacion}</p>` : ''}
      </div>
    </section>
    <div class="contenedor obra-pagina">
      ${barra}
      <div class="obra-cuerpo${textoHtml ? '' : ' obra-cuerpo--solo'}${barra ? '' : ' obra-cuerpo--sin-barra'}">
        ${textoHtml ? `<div class="obra-texto">${textoHtml}</div>` : ''}
        ${lateral}
      </div>
      ${bloque('Galería de fotos', fotos, totalFotos > 1 ? `${totalFotos} fotos` : '')}
      ${bloque(tituloVideo, videos)}
      ${relacionadas}
      ${navegacion}
    </div>`;

  // El orden de las elementos se definen dentro de este section de arriba
  // Foto de fondo en la franja del título (portada, o si no la primera foto de la galería)
  const hero = main.querySelector('.page-hero');
  const primera = main.querySelector('.galeria button');
  const portada = o.portada ? `img/obras/${o.portada}` : (primera && primera.dataset.orig);
  if (hero && portada) {
    hero.classList.add('page-hero--img');
    hero.insertAdjacentHTML('afterbegin', '<div class="hero-fondo"></div>');
    ponerFondo(hero.querySelector('.hero-fondo'), portada);   // js/visor.js: versión grande, o la original si falta
  }

  //Visor de fotos ampliadas (con flechas y puntos: js/visor.js)
  iniciarVisor(main.querySelectorAll('.galeria button'));
})();