/* =========================================================
   FORMULARIO DE CONTACTO (se usa solo en contacto.html)
   - Motivo del mensaje: consulta, proveedor, trabajo u otro.
   - Según el motivo se muestran campos extra (empresa, rubro, CUIT, puesto, CV...).
   - Envío: con Formspree (data-endpoint del <form>) o, si está vacío,
     abriendo el programa de correo del visitante.
   ========================================================= */
(function () {
  const form = document.getElementById('form-contacto');
  const msg = document.getElementById('form-msg');
  if (!form || !msg) return;

  /* ---------- CONFIGURACIÓN: lo único que hay que tocar ---------- */

  // A qué correo llega cada tipo de mensaje cuando NO se usa Formspree.
  // Cuando tengan los mails de la empresa, cambiá solo estas direcciones.
  const CORREOS = {
    consulta: 'moronimunoz123@gmail.com',   // después: 'info@dysconsa.com.ar'
    proveedor: 'moronimunoz123@gmail.com',   // después: 'proveedores@dysconsa.com.ar'
    trabajo: 'moronimunoz123@gmail.com',   // después: 'rrhh@dysconsa.com.ar'
    otro: 'moronimunoz123@gmail.com'
  };

  // Textos de cada motivo: prefijo del asunto, pregunta y ayuda del campo de mensaje.
  const MOTIVOS = {
    consulta: { prefijo: 'Consulta', pregunta: '¿En qué podemos ayudarte?', ayuda: 'Escribí tu consulta' },
    proveedor: { prefijo: 'Proveedor', pregunta: 'Contanos qué ofrecés', ayuda: 'Describí tus productos o servicios y tu experiencia en obra' },
    trabajo: { prefijo: 'Postulación', pregunta: 'Contanos sobre vos', ayuda: 'Tu experiencia, estudios y disponibilidad' },
    otro: { prefijo: 'Contacto', pregunta: '¿En qué podemos ayudarte?', ayuda: 'Escribí tu mensaje' }
  };

  // Campos que se agregan al cuerpo del mail (en este orden), con su nombre legible.
  const ETIQUETAS = {
    nombre: 'Nombre', email: 'Email', empresa: 'Empresa', rubro: 'Rubro', cuit: 'CUIT',
    telefono: 'Teléfono', area: 'Puesto o área de interés', cv: 'Link al CV'
  };

  /* ---------- Motivo: muestra u oculta los campos extra ---------- */

  const selector = form.elements.motivo;
  const etiquetaMensaje = form.querySelector('label[for="mensaje"]');
  const campoMensaje = form.elements.mensaje;
  const grupos = form.querySelectorAll('.campos-extra');

  const aplicarMotivo = () => {
    const m = MOTIVOS[selector.value] ? selector.value : 'consulta';
    etiquetaMensaje.textContent = MOTIVOS[m].pregunta;
    campoMensaje.placeholder = MOTIVOS[m].ayuda;
    grupos.forEach(g => {
      const ver = g.dataset.motivos.split(' ').includes(m);
      g.hidden = !ver;
      // Un campo deshabilitado no se valida ni se envía: así los ocultos no molestan
      g.querySelectorAll('input').forEach(i => { i.disabled = !ver; });
    });
  };

  selector.addEventListener('change', aplicarMotivo);

  // Vínculos que eligen el motivo (botones de las tarjetas o ?motivo=trabajo en la dirección)
  const pedido = new URLSearchParams(location.search).get('motivo');
  if (pedido && MOTIVOS[pedido]) selector.value = pedido;

  document.querySelectorAll('[data-motivo]').forEach(a =>
    a.addEventListener('click', () => {
      if (MOTIVOS[a.dataset.motivo]) { selector.value = a.dataset.motivo; aplicarMotivo(); }
    })
  );

  aplicarMotivo();

  /* ---------- Envío ---------- */

  const aviso = (texto, color) => { msg.textContent = texto; msg.style.color = color; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));      // los campos ocultos no entran

    if (datos._gotcha) return;                                  // campo trampa: solo lo completa un robot
    if (datos.mensaje.trim().length < 10) { aviso('El mensaje es muy corto.', 'crimson'); return; }
    if (datos.cuit && datos.cuit.replace(/\D/g, '').length !== 11) {
      aviso('El CUIT tiene que tener 11 números.', 'crimson'); return;
    }

    const motivo = MOTIVOS[datos.motivo] ? datos.motivo : 'consulta';
    const asunto = `[${MOTIVOS[motivo].prefijo}] ${datos.nombre} - desde la web`;
    const detalle = Object.keys(ETIQUETAS)
      .filter(k => datos[k] && datos[k].trim())
      .map(k => `${ETIQUETAS[k]}: ${datos[k].trim()}`)
      .join('\n');
    const cuerpo = `${datos.mensaje.trim()}\n\n${detalle}`;

    const endpoint = form.dataset.endpoint;

    // Sin Formspree: se abre el programa de correo del visitante con el mensaje armado
    if (!endpoint) {
      location.href = `mailto:${CORREOS[motivo]}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
      aviso('Se abrió tu programa de correo para enviar el mensaje.', 'green');
      return;
    }

    // Turnstile (solo si el formulario tiene el widget): hace falta que haya terminado la verificación
    const widget = form.querySelector('.cf-turnstile');
    if (widget && !datos['cf-turnstile-response']) {
      aviso('Esperá un segundo a que termine la verificación y probá de nuevo.', 'crimson');
      return;
    }

    // Con Formspree: el asunto del mail que reciben lleva el motivo entre corchetes
    const boton = form.querySelector('button[type="submit"]');
    const envio = new FormData(form);
    envio.append('_subject', asunto);

    boton.disabled = true;
    aviso('Enviando…', 'inherit');
    try {
      const r = await fetch(endpoint, { method: 'POST', body: envio, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error('envio');
      aviso('¡Gracias! Recibimos tu mensaje y te responderemos pronto.', 'green');
      form.reset();
      aplicarMotivo();                                          // vuelve al motivo inicial y oculta los extras
    } catch (err) {
      aviso('No pudimos enviar el mensaje. Probá de nuevo o escribinos a ' + CORREOS.consulta + '.', 'crimson');
    } finally {
      boton.disabled = false;
      // El token de Turnstile sirve una sola vez: se pide uno nuevo para el próximo envío
      if (widget && window.turnstile) window.turnstile.reset(widget);
    }
  });
})();