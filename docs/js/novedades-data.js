/* =========================================================
   DATOS DE LAS NOVEDADES - un bloque por noticia
   Para agregar una: copiá un bloque, cambiá el id (sin espacios ni tildes) y completá.
   La lista de novedades.html se ordena sola por fecha (la más nueva primero).
   - categoria: 'Obras' | 'Institucional' | 'Eventos' (tiene que coincidir con un botón de filtro)
   - id: lo que se vera en la URL. Ej. <a href="novedad.html?id=${n.id}"> (usar munisculas y _, espacios no)
   - fecha:     'AAAA-MM-DD'
   - portada:   foto principal, dentro de img/novedades/ (obligatoria: se ve en la tarjeta)
   - resumen:   opcional, una línea para buscadores
   - texto:     lista de párrafos
   - fotos:     opcional, fotos extra dentro de img/novedades/subcarpeta(si es necesario)
   - video disponible a usar:
      video: 'Hg_EGB0ZTkc',                                   // YouTube, como hoy
      video: 'novedades/nodo.mp4',                            // archivo propio, sin portada
      video: { src: 'novedades/nodo.mp4', poster: '2026_03_21_nodo/video.jpg' },   // archivo con portada
      video: ['Hg_EGB0ZTkc', { src: 'novedades/nodo.mp4', poster: '2026_03_21_nodo/video.jpg' }],  // varios
      Dónde van los archivos:
      El video: video/novedades/nodo.mp4. Se escribe sin el video/ inicial.
      La portada: dentro de img/novedades/, por ejemplo img/novedades/2026_03_21_nodo/video.jpg.
      En las obras, dentro de img/obras/.

      codigo en powershell para captura jpg de un video:
      ffmpeg -i nodo-web.mp4 -ss 00:00:05 -frames:v 1 -q:v 3 video.jpg

      codigo en powershell para hacer un video menos pesado:
      ffmpeg -i nodo.mov -c:v libx264 -crf 26 -preset slow -vf "scale=-2:720" -c:a aac -b:a 128k -movflags +faststart nodo-web.mp4
   ========================================================= */
const NOVEDADES = [
  {
    id: 'experiencia_tiic_2026',
    titulo: 'Participamos de Experiencia TIIC 2026',
    categoria: 'Eventos',
    fecha: '2026-10-20',
    portada: '2026_10_20_tiic/poster.jpg',
    resumen: '',
    texto: ['🚀 Innovación que transforma la construcción.<br><br>Desde <b>Dyscon S.A.</b> participamos de <b>Experiencia TIIC 2026</b>, un encuentro organizado por <b>la Cámara Argentina de la Construcción en Buenos Aires.</b><br><br>Una jornada para conocer nuevas tecnologías, descubrir tendencias y conectar con ideas que están transformando el futuro de nuestra industria.<br><br>Seguimos apostando a la innovación, el aprendizaje y la evolución constante. 🏗️'],
    video: [{ src: 'novedades/tiic.mp4', poster: '2026_10_20_tiic/v1.webp', vertical: true }, { src: 'novedades/tiic2.mp4', poster: '2026_10_20_tiic/v2.webp', vertical: true, titulo: 'Charla: segunda parte' }],
    fotos: ['2026_10_20_tiic/poster.jpg', '2026_10_20_tiic/01.jpg']
  },
  {
    id: 'inauguracion_de_tecnoteca',
    titulo: 'Inauguración de Tecnoteca',
    categoria: 'Eventos',
    fecha: '2025-11-12',
    portada: '2025_11_12_tecnoteca/03.jpg',
    resumen: '',
    texto: ['El intendente Pablo Javkin encabezó este miércoles 12 de noviembre la inauguración oficial de Tecnoteca Rosario, una nueva escuela de tecnología y oficios digitales que funcionará en el Galpón 13 (Estévez Boero 700), sobre la Rambla del Tricentenario. Este espacio educativo integra una de las obras del legado por los 300 años de la ciudad y se proyecta como polo de referencia para el crecimiento tecnológico y comunitario de las juventudes rosarinas.<br>Impulsada por la Municipalidad de Rosario, la Tecnoteca busca acercar a jóvenes al mundo de la tecnología, el trabajo y la creatividad digital. Su creación apunta a fortalecer el talento local y generar nuevas oportunidades para el desarrollo de conocimientos y habilidades tecnológicas. De esta manera, Rosario se consolida como una ciudad líder en innovación y creatividad, conectando talento local con oportunidades reales de formación y crecimiento.'
    ],
    video: 'c6oSxMGdOtA',
    fotos: ['2025_11_12_tecnoteca/01.jpg', '2025_11_12_tecnoteca/02.jpg', '2025_11_12_tecnoteca/00.jpg']
  },
  {
    id: 'nace_nodo',
    titulo: 'Nace Nodo, el parque industrial que apunta a captar empresas alimenticias',
    categoria: 'Eventos',
    fecha: '2026-03-21',
    portada: '2026_03_21_nodo/poster.jpg',
    resumen: 'Nace Nodo, el parque industrial que apunta a captar empresas alimenticias',
    texto: ['Con foco en la industria alimenticia y una apuesta fuerte a la infraestructura, un nuevo parque industrial busca abrirse camino en el cordón sur del Gran Rosario. Se trata de <strong>Nodo</strong>, un desarrollo privado impulsado por <strong>Grupo Nasini</strong> Inversiones junto a <strong>Mariano Schor</strong>, de la constructora <strong>Dyscon</strong>, que ya puso en marcha las obras y apunta a captar empresas que hoy operan “atrapadas” dentro del tejido urbano.<br>Según explicó <strong>Nasini</strong>, el foco en las alimenticias surgió tras detectar una demanda creciente de empresas que necesitan expandirse pero enfrentan limitaciones dentro de las ciudades.<br>“Hay muchas industrias alimenticias que quedaron atrapadas dentro del eje urbano, con problemas logísticos, de habilitaciones y de crecimiento”, señaló. “Muchas veces no se mudan porque los parques industriales no tienen los servicios específicos que necesitan”.<br>Por eso, Nodo incorporó infraestructura especialmente diseñada para ese segmento: planta potabilizadora de agua, red cloacal, acceso a gas y capacidad eléctrica industrial.<br><br>Enlace de Instagram (Presione aqui): <a href="https://www.instagram.com/econodoproductivo/" target="_blank" rel="noopener"><strong>Eco Nodo Productivo</strong></a>'],
    video: { src: 'novedades/nodo.mp4', poster: '2026_03_21_nodo/poster.jpg' },   // archivo con portada
    fotos: ['2026_03_21_nodo/00.jpeg', '2026_03_21_nodo/01.jpg', '2026_03_21_nodo/02.jpg', '2026_03_21_nodo/03.jpg']
  },
  {
    id: 'reinauguracion_monumento',
    titulo: 'Reinauguración del Monumento Nacional a la Bandera',
    categoria: 'Eventos',
    fecha: '2026-06-17',
    portada: '2026_06_17_monumento/02.jpeg',
    resumen: '',
    texto: ['El <strong>Monumento Nacional a la Bandera en Rosario</strong> fue reinaugurado oficialmente el miércoles 17 de junio de 2026, tras una restauración integral que concluyó más de una década de obras inconclusas.  La iniciativa, asumida por <strong>el gobierno de la provincia de Santa Fe</strong> bajo la conducción de Maximiliano Pullaro, permitió recuperar sectores históricos como la Fuente de las Proas, la Sala de las Banderas y el mirador de la torre principal, que ahora cuenta con un nuevo ascensor.<br>La celebración culminó el 20 de junio de 2026 con el acto central por el Día de la Bandera, que contó con la presencia del presidente <strong>Javier Milei</strong> y el gobernador <strong>Maximiliano Pullaro</strong>, seguido de una gran fiesta popular con el cierre musical de <strong>Abel Pintos</strong>.  Durante las jornadas de reinauguración, miles de estudiantes de todo el país participaron de la tradicional Promesa de Lealtad a la Bandera en el Patio Cívico. <br><br><strong>Aspectos clave de la restauración:</strong><br><strong>· Inversión y gestión:</strong> La provincia asumió una deuda millonaria y financió los trabajos pendientes que los gobiernos nacionales anteriores no completaron. <br><strong>· Recuperación patrimonial:</strong> Se restauraron esculturas, elementos de bronce, la llama votiva y se renovaron los sistemas eléctricos e iluminación con tecnología LED.<br><strong>· Accesibilidad:</strong> Se incorporaron mejoras en accesibilidad, incluyendo rampas y la habilitación definitiva del ascensor para el mirador a 70 metros de altura.'],
    video: 'Hg_EGB0ZTkc',
    fotos: ['2026_06_17_monumento/00.jpg', '2026_06_17_monumento/01.jpg', '2026_06_17_monumento/02.jpeg']
  }
];
