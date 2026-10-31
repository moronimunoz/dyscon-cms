/* =========================================================
   DATOS DE LAS OBRAS - un bloque por obra (mismo orden que obras.html)
   Lo que dejes vacío ('' o []) no se muestra en la página.
   - estado: 'inicio' | 'obra' | 'terminado'
   - tipo:   'propia' | 'colaboracion'  (con: empresa con la que se colaboró)
   - fotos:  nombres dentro de img/obras/ (la primera es la principal)
   -  video disponible a usar: //La primera foto es lo que va a ser la portada en Obra.
      video: 'Hg_EGB0ZTkc',                                   // YouTube, como hoy
      video: 'novedades/nodo.mp4',                            // archivo propio, sin portada
      video: { src: 'novedades/nodo.mp4', poster: '2026_03_21_nodo/video.jpg' },   // archivo con portada
      video: ['Hg_EGB0ZTkc', { src: 'novedades/nodo.mp4', poster: '2026_03_21_nodo/video.jpg' }],  // varios
      Dónde van los archivos:
      El video: video/novedades/nodo.mp4. Se escribe sin el video/ inicial.
      La portada: dentro de img/novedades/, por ejemplo img/novedades/2026_03_21_nodo/video.jpg.
      En las obras, dentro de img/obras/.

   - ubicacion: 'Ciudad · Provincia'. Se ve en la tarjeta del listado y en la ficha.
   - miniatura: opcional. Foto de la tarjeta del listado (si no se pone, usa la primera de 'fotos').
   - La tarjeta del listado (obras.html) se arma sola con js/obras-lista.js: ya no hay que
     copiar bloques en obras.html. El punto verde aparece cuando estado es 'obra'.
   - Descripción: En general dentro de los "[]" es como un <p> en html permitiendo
       poner equitiquetas para decorar el texto.
   - Para agregar la fila "Objetivos y datos", sumá a la obra:
       datos: ['Superficie: ...', 'Plazo: ...']
   - Para ubicar mejor el mapa, sumá: mapa: 'Calle 123, Ciudad, Provincia's
       o coordenadas: mapa: '-32.9468, -60.6393',
   - portada: 'casa_m/panoramica.jpg', (le da fondo a la portada oscura en
       la pagina de una obra)
   - Resumen: Sirve para que, cuando alguien ve tu resultado en Google, 
      el texto de abajo sea claro y lo invite a entrar, en vez de uno genérico 
      o uno que Google arme solo. Es un cambio de presentación, no de posicionamiento.

    Para deco <mark>:
    <p>
    Nuestro compromiso es la
    <mark class="resaltado">calidad y la excelencia</mark>
    en cada proyecto.
    </p>

    .resaltado {
    background-color: #dce9ed;
    color: #123c4c;
    padding: 2px 5px;
    border-radius: 3px;
    } 
   ========================================================= */

const FOTO_PROVISORIA = 'prov-front.png';
const OBRAS = [
  // CASA M
  {
    id: 'casa-m', nombre: 'Casa M', categoria: 'Comunidad',
    tipo: 'propia', estado: 'inicio', comitente: '',
    ubicacion: 'Rosario · Santa Fe',
    miniatura: '01.jpg',
    mapa: 'Arturo Illia 1690, S2000 Rosario, Santa Fe',
    descripcion: [],
    carpeta: 'casa_m',
    fotos: ['00.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  // ESCUELA RICARDONE
  {
    id: 'escuela-ricardone', nombre: 'Escuela Secundaria EESO N.º 1548', categoria: 'Educación',
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de economía, Unidad Ejecutora Provincial (UE).',
    ubicacion: 'Ricardone · Santa Fe',
    datos: ['Plazo: Octubre 2024 - Finalizado.'],
    mapa: '66G2+6Q Ricardone, Santa Fe',
    descripcion: ['DYSCON S.A. llevó adelante la construcción del nuevo edificio de la Escuela de Educación Secundaria Orientada N.º 1548 de <b>Ricardone</b>, una obra destinada a fortalecer la infraestructura educativa de la localidad y responder a la creciente demanda de espacios para la educación secundaria.<br><br>El proyecto comprendió la ejecución de un establecimiento educativo con ocho aulas, laboratorio, taller multipropósito, Centro de Recursos Multimediales y Salón de Usos Múltiples, además de sectores administrativos, sanitarios, depósitos y galerías de circulación.<br><br>La propuesta integra espacios destinados a la enseñanza, las actividades prácticas y el encuentro comunitario, mediante una infraestructura concebida para acompañar el desarrollo educativo de las nuevas generaciones.<br><br>Impulsada por el Gobierno de la Provincia de Santa Fe en el marco del programa Santa Fe + Conectada, la obra representa una contribución al crecimiento de Ricardone y al fortalecimiento de sus instalaciones educativas.<br><br>Entre los principales sectores previstos se encuentran:<br>• Ocho aulas para el dictado de clases.<br>• Taller multipropósito y laboratorio, destinados a actividades prácticas y experimentales.<br>• Centro de Recursos Multimediales, para apoyar las actividades pedagógicas.<br>• Salón de Usos Múltiples (SUM), con sanitarios y espacios complementarios.<br>• Hall de ingreso, galerías y circulaciones, para organizar el acceso y la conexión entre sectores.<br>• Área administrativa, con dirección, vicedirección, secretaría, preceptoría y sala de docentes.<br>• Servicios generales, incluidos sanitarios, depósitos y sala de máquinas.'],
    portada: 'ricardone/001.jpg',
    carpeta: 'ricardone',
    fotos: ['000.jpg', '001.jpg', '002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', '008.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '013.jpg', '014.jpg', '015.jpg', '016.jpg', '017.jpg',]
  },
  // ESPAÑA 543
  {
    id: 'restauracion-espana-543', nombre: 'Restauración de Dto. España 543', categoria: 'Viviendas',
    tipo: 'propia', estado: 'terminado', comitente: '',
    ubicacion: 'Rosario · Santa Fe',
    mapa: 'España 543, Rosario, Santa Fe',
    descripcion: [],
    carpeta: 'espana',
    fotos: ['00.jpg', '01.jpeg', '02.jpeg', '03.jpeg',]
  },
  // PAMI
  {
    id: 'pami-ituzaingo', nombre: 'Hospital del Bicentenario PAMI Ituzaingó', categoria: 'Salud',
    tipo: 'propia', estado: 'terminado', comitente: 'PAMI.',
    ubicacion: 'Ituzaingó · Buenos Aires',
    mapa: 'Cnel. Brandsen 2898, B1714LAH Ituzaingó, Provincia de Buenos Aires',
    datos: ['Superficie: 21.770 m².', 'Plazo: Febrero, 2022 - Finalizado.'],
    descripcion: [],
    carpeta: 'pami',
    portada: 'pami/01.jpeg',
    fotos: ['00.jpg', '01.jpeg', '02.jpg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg', '09.jpeg', '10.jpeg', '11.jpeg', '12.jpeg']
  },
  // PARQUE INDUSTRIAL
  {
    id: 'parque-industrial', nombre: 'Parque Industrial - Nodo', categoria: 'Espacio Público',
    destacada: 1,
    tipo: 'colaboracion', con: '<b>Del Sol</b> - Empresa Constructora', estado: 'obra', comitente: '',
    ubicacion: 'Villa Gobernador Gálvez · Santa Fe',
    miniatura: '01.jpg',
    mapa: 'X98V+JHG Villa Gdor. Gálvez, Santa Fe',
    descripcion: ['Con foco en la industria alimenticia y una apuesta fuerte a la infraestructura, un nuevo parque industrial busca abrirse camino en el cordón sur del Gran Rosario. Se trata de <b>Nodo</b>, un desarrollo privado impulsado por <b>Grupo Nasini</b> Inversiones junto a <b>Mariano Schor</b>, de la constructora <b>Dyscon</b>, que ya puso en marcha las obras y apunta a captar empresas que hoy operan “atrapadas” dentro del tejido urbano.'],
    carpeta: 'parque_industrial',
    video: { src: 'obras/nodo.mp4', poster: 'parque_industrial/poster.jpg' },   // archivo con portada
    fotos: ['00.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpeg']
  },
  // TECNOTECA
  {
    id: 'tecnoteca', nombre: 'Tecnoteca', categoria: 'Comunidad',
    destacada: 4,
    tipo: 'colaboracion', con: '<b>Del Sol</b> - Empresa Constructora', estado: 'terminado', comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario · Santa Fe',
    datos: ['Superficie: 4.000 m².', 'Plazo: Septiembre, 2023 - Finalizado.'],
    mapa: 'Estévez Boero 740, S2000 Rosario, Santa Fe',
    descripcion: ['<b>Tecnoteca, Escuela de Tecnología y Oficios Digitales</b><br>El propósito de Tecnoteca es funcionar como una Escuela de Tecnología y Oficios Digitales, donde se impulsen proyectos de aprendizaje tecnológicos vinculados a la ciencia, la comunicación y el arte. Está pensada para jóvenes entre 18 a 30 años, priorizando sobre todo a aquellas/os que no puedan acceder a oportunidades educativas similares.<br>Emplazada en el Galpón 13, cuenta con <mark class="resaltado">4.000 mts2 distribuidos en dos plantas</mark> que disponen de los recursos tecnológicos, profesionales y un ambiente confortable para alojar a los y las participantes. Los espacios, equipados en función de las especiﬁcidades técnicas, son: Cápsula Audiovisual; Coworking; FabLab; Laboratorios; Salas de capacitación. También está proyectado un lactario, el comedor y un espacio de cuidados para niños y niñas.'],
    portada: 'tecnoteca/03.jpg',
    carpeta: 'tecnoteca',
    video: { src: 'obras/tecno.mp4', poster: 'tecnoteca/poster.jpg', vertical: true },
    fotos: ['00.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg']
  },
  // RDZ 1635
  {
    id: 'rdz-1635', nombre: 'Proyecto: RDZ 1635', categoria: 'Viviendas',
    tipo: 'propia', estado: 'obra', comitente: 'Fideicomiso.',
    ubicacion: 'Rosario · Santa Fe',
    datos: ['Superficie: 2.000 m².', 'Plazo: Julio, 2023 - Finalizado.'],
    mapa: 'Rodríguez 1635, Rosario, Santa Fe',
    portada: 'rdz/03.jpeg',
    carpeta: 'rdz',
    descripcion: [],
    fotos: ['00.jpg', '01.jpg', '02.jpg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpg']
  },
  // VIVIENDAS TABLADA
  {
    id: 'viviendas-tablada', nombre: '64 Viviendas en Tablada', categoria: 'Viviendas',
    tipo: 'propia', estado: 'obra', comitente: 'DPVyU.',
    ubicacion: 'Rosario · Santa Fe',
    datos: ['Plazo: Septiembre 2024 - En ejecución.'],
    mapa: '-32.9817997363948, -60.62924684936593',
    descripcion: [],
    fotos: ['tablada.jpg']
  },
  // UP15
  {
    id: 'unidad-penitenciaria-15', nombre: 'Unidad Penitenciaria N.º 15', categoria: 'Comunidad',
    destacada: 2,
    tipo: 'propia', estado: 'obra', comitente: '',
    ubicacion: 'Piñero · Santa Fe',
    mapa: 'W633+3G Piñero, Santa Fe',
    descripcion: ['La Unidad Penitenciaria N.º 15 forma parte del programa provincial de ampliación de la infraestructura penitenciaria, con un proyecto que contempla seis módulos de alojamiento y edificios complementarios destinados al funcionamiento del establecimiento.<br><br>El desarrollo prevé espacios de ingreso, pabellones, áreas educativas, talleres, cocinas y sectores de apoyo, junto con infraestructura de servicios y circulación interna.<br><br>La magnitud del proyecto requiere la coordinación de distintas especialidades constructivas y de instalaciones, en el marco de una intervención pública orientada a ampliar la capacidad del sistema penitenciario santafesino.'],
    portada: 'up15/02.jpeg',
    carpeta: 'up15',
    video: 'obras/up.mp4',
    fotos: ['02.jpeg', '00.jpg', '01.webp', '03.jpeg']
  },
  // UP8
  {
    id: 'unidad-penitenciaria-8', nombre: 'Unidad Penitenciaria N.º 8', categoria: 'Comunidad',
    tipo: 'propia', estado: 'obra', comitente: 'Unidad Ejecutora de Infraestructura.',
    ubicacion: 'Piñero · Santa Fe',
    datos: ['Plazo: Abril 2025 - Finalizado.'],
    mapa: 'W633+3G Piñero, Santa Fe',
    descripcion: ['<b>Infraestructura penitenciaria de alta seguridad</b><br><br>En el marco del programa de ampliación de la infraestructura penitenciaria de la provincia de Santa Fe, DYSCON S.A. participa en la construcción del Módulo D de la Unidad Penitenciaria N.º 8, integrada al complejo penitenciario de Piñero.<br><br>El proyecto forma parte de un establecimiento de alta seguridad que incorpora sistemas de alojamiento individual, estructuras de hormigón, circulaciones controladas y espacios complementarios destinados al funcionamiento penitenciario.<br><br>La intervención requiere una ejecución coordinada de los componentes arquitectónicos y constructivos, con especial atención a los requerimientos estructurales, funcionales y de seguridad propios de este tipo de infraestructura pública.<br><br>La obra se integra a un programa provincial orientado a ampliar la capacidad del sistema penitenciario y modernizar sus instalaciones.'],
    portada: 'up8/00.jpeg',
    carpeta: 'up8',
    video: 'obras/up.mp4',
    fotos: ['00.jpeg', '01.jpeg', '02.webp', '03.jpg', '04.jpeg', '05.jpg', '06.jpeg']
  },
  // PLAZA SAN CRISTOBAL
  {
    id: 'plaza-san-cristobal', nombre: 'Plaza San Cristóbal', categoria: 'Espacio Público',
    tipo: 'propia', estado: 'obra', comitente: '',
    ubicacion: 'CABA · Buenos Aires',
    mapa: 'Constitución 2498, C1254AAN C1254AAN, Cdad. Autónoma de Buenos Aires',
    descripcion: [],
    fotos: ['plaza-san-cristobal.webp']
  },
  //PARQUE REGIONAL SUR
  {
    id: 'parque-regional-sur', nombre: 'Parque Regional Sur', categoria: 'Espacio Público',
    tipo: 'propia', estado: 'obra', comitente: '',
    ubicacion: 'Rosario · Santa Fe',
    mapa: 'Láinez 1-48, S2000 Rosario, Santa Fe',
    descripcion: [],
    fotos: ['parque_regional_sur.jpg']
  },
  // 69 VIVIENDAS
  {
    id: '69-viviendas', nombre: 'Bloque de 69 viviendas — República de la Sexta', categoria: 'Viviendas',
    tipo: 'propia', estado: 'terminado', comitente: 'el Gobierno de Santa Fe, la Municipalidad de Rosario y la Universidad Nacional de Rosario (UNR)',
    ubicacion: 'Rosario · Santa Fe',
    mapa: 'Riobamba 242, S2000 Rosario, Santa Fe',
    descripcion: ['En el marco del proyecto de transformación urbana de la Ciudad Universitaria de Rosario, se desarrolló el conjunto habitacional de <b>69 viviendas</b> en el barrio República de la Sexta, en el sector de las calles Esmeralda, Riobamba y La Paz.<br><br>La intervención forma parte de un programa integral impulsado por el Gobierno de Santa Fe, la Municipalidad de Rosario y la Universidad Nacional de Rosario, orientado a mejorar las condiciones habitacionales y promover la integración urbana del sector.<br><br>El proyecto contempló viviendas de distintas tipologías, cocheras e infraestructura de servicios, incluyendo redes sanitarias, instalaciones eléctricas y obras de urbanización complementarias.<br><br>La obra constituye un aporte al desarrollo de vivienda pública y a la transformación de un sector estratégico de Rosario, fortaleciendo la integración entre el tejido residencial, los espacios públicos y el entorno universitario.'],
    portada: '69-viviendas/02.webp',
    carpeta: '69-viviendas',
    fotos: ['02.webp', '01.jpg', '00.jpg']
  },
  // MONUMENTO
  {
    id: 'monumento-bandera', nombre: 'Monumento Nacional a la Bandera', categoria: 'Patrimonio',
    destacada: 3,
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Obras Públicas.',
    ubicacion: 'Rosario · Santa Fe',
    datos: ['Superficie: 10.000 m².', 'Plazo: Marzo, 2023 - Finalizado.'],
    mapa: 'Sta Fe 581, S2000 Rosario, Santa Fe',
    descripcion: ['PUESTA EN VALOR DEL MONUMENTO NACIONAL A LA BANDERA - Etapa II'],
    portada: 'monumento/01.jpg',
    carpeta: 'monumento',
    fotos: ['00.jpg', '01.jpg', '02.jpeg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg', '31.jpg', '32.jpg']
  },
  // SAMCO PAVON ARRIBA
  {
    id: 'samco-pavon-arriba', nombre: 'Nuevo SAMco de Pavón Arriba', categoria: 'Salud',
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat - DIPAI.',
    ubicacion: 'Pavón Arriba · Santa Fe',
    datos: ['Superficie: 723 m².', 'Plazo: Agosto, 2022 - Abril, 2025.'],
    mapa: '-33.310985234429445, -60.827243803116566',
    descripcion: ['Ubicado en la intersección de las calles Buenos Aires y Valerio Carreras, el nuevo SAMCo de Pavón Arriba constituye una intervención destinada a fortalecer la infraestructura sanitaria de la localidad y mejorar las condiciones de atención para la comunidad.<br><br>Impulsado por el <b>Gobierno de la Provincia de Santa Fe</b>, el proyecto contempló la construcción de nuevos espacios asistenciales y la refuncionalización de sectores del edificio existente, integrando soluciones arquitectónicas y técnicas orientadas a optimizar el funcionamiento del establecimiento.<br><br>La propuesta incluyó consultorios, sala de observación, sector de atención de urgencias, espacios de enfermería y áreas de internación con capacidad para cuatro camas. También contempló accesos diferenciados para el público y las ambulancias, circulación accesible e instalaciones específicas para el funcionamiento de un centro sanitario.<br><br>La intervención incorporó, además, sistemas de climatización, gases medicinales, iluminación LED y soluciones de aprovechamiento de energía solar, de acuerdo con las especificaciones del proyecto.<br><br>Con una Superficie de intervención prevista de 723 m², la obra representa un aporte a la modernización de los servicios públicos de salud y al desarrollo de la infraestructura de la región.<br><br><b>DYSCON S.A. — Construcción de infraestructura para las necesidades de la comunidad.</b>'],
    portada: 'samco_pavon_arriba/02.jpg',
    video: { src: 'obras/samco-pavon.mp4', poster: 'samco_pavon_arriba/poster.jpg' },
    carpeta: 'samco_pavon_arriba',
    fotos: ['02.jpg', '00.jpg', '01.jpg', '03.jpg']
  },
  // SAMCO FUNES
  {
    id: 'samco-funes', nombre: 'Hospital SAMCo Eva Perón', categoria: 'Salud',
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat - DIPAI.',
    ubicacion: 'Funes · Santa Fe',
    datos: ['Superficie: 1.000 m².', 'Plazo: Noviembre, 2022 - En ejecución.'],
    mapa: 'Monteagudo 1582-1600, S2132 Funes, Santa Fe',
    descripcion: [],
    portada: 'samco/00.jpg',
    carpeta: 'samco',
    fotos: ['00.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg']
  },
  // EETP 485
  {
    id: 'eetp-485', nombre: 'Ampliación Secundaria E.E.T.P. N° 485', categoria: 'Educación',
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Educación.',
    ubicacion: 'Villa Gobernador Gálvez · Santa Fe',
    datos: ['Superficie: 2.588 m².', 'Plazo: Agosto, 2017 - Octubre, 2019.'],
    mapa: 'X9JQ+CP2 Villa Gdor. Gálvez, Santa Fe',
    descripcion: [],
    fotos: ['eetp485.jpg']
  },
  // ESCUELA 608
  {
    id: 'escuela-608', nombre: 'Escuela Secundaria N.° 608 - La Esperanza', categoria: 'Educación',
    tipo: 'propia', estado: 'terminado', comitente: '',
    ubicacion: 'Villa Gobernador Gálvez · Santa Fe',
    mapa: 'Pje. Uboldi 630, S2124 Villa Gdor. Gálvez, Santa Fe',
    descripcion: [],
    carpeta: 'jardin_608',
    fotos: ['01.jpg', '00.jpg']
  },
  // ESCUELA PRIMARIA 1408
  {
    id: 'escuela-primaria-1408', nombre: 'Escuela Primaria N.° 1408', categoria: 'Educación',
    tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Obras Públicas.',
    ubicacion: 'Rosario · Santa Fe',
    datos: ['Superficie: 1.700 m² aprox.', 'Capacidad: 200 alumnos/as por turno'],
    ubicacion: 'Rosario · Santa Fe',
    mapa: 'Av. Joaquín Suárez 2900 & Dr. José Julián Pérez, S2005 Rosario, Santa Fe',
    descripcion: ['La Escuela Primaria Nuevo Alberdi está ubicada en el barrio Nuevo Alberdi, zona norte de la ciudad de Rosario, Santa Fe. Se desarrolla en un solo nivel compuesto por 8 aulas agrupables, un salón de usos múltiples, una cantina y espacio para cocinar y un gran patio semicubierto.'],
    portada: 'nuevo_alberdi/00.jpg',
    carpeta: 'nuevo_alberdi',
    fotos: ['00.jpg', '01.jpeg', '02.jpeg']
  },
  // PLAZA SAN MARTIN
  {
    id: 'plaza-san-martin', nombre: 'Remodelación Plaza San Martín', categoria: 'Espacio Público',
    tipo: 'colaboracion', con: '<b>Del Sol</b> - Empresa Constructora', estado: 'terminado', comitente: '',
    ubicacion: 'Rosario · Santa Fe',
    mapa: '3942+G4 Rosario, Santa Fe',
    datos: ['Superficie: 14.000 m².', 'Plazo: Noviembre, 2014 - Mayo, 2015.'],
    descripcion: [],
    carpeta: 'plaza_san_martin',
    portada: 'plaza_san_martin/00.jpg',
    fotos: ['04.webp', '01.webp', '02.webp', '03.webp', '00.jpg', '05.jpg']
  },
  // BARRIO MORTELARI
  {
    id: 'barrio-mortelari-1', nombre: 'Mejoramiento integral del barrio Mortelari I', categoria: 'Comunidad',
    tipo: 'propia', estado: 'terminado', comitente: 'Secretaría de Estado del Hábitat.',
    ubicacion: 'Villa Gobernador Gálvez · Santa Fe',
    descripcion: [],
    datos: ['Plazo: Agosto, 2017 - Octubre, 2020.'],
    fotos: ['barrio_mortelari_1.jpg']
  },
  /*
  // Edifico Ricchieri
  {
  id: 'edificio-ricchieri', nombre: 'Edificio Ricchieri', categoria: 'Viviendas',
  tipo: 'propia', estado: 'inicio', comitente: '',
  ubicacion: 'Rosario · Santa Fe',
  descripcion: [],
  carpeta:'ricchieri',
  fotos: ['00.jpeg','01.jpeg','02.jpeg','03.jpeg']
  },
  // hospital Zona Norte
  {
  id: 'hospital-de-ninos-zona-norte', nombre: 'Hospital de Niños Zona Norte “Dr. Roberto M. Carra”', categoria: 'Salud',
  tipo: 'propia', estado: 'terminado', comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat - DIPAI.',
  ubicacion: 'Rosario · Santa Fe',
  datos: ['Plazo: Enero 2025 - Finalizado.'],
  mapa: 'Rosario, Santa Fe',
  descripcion: ['<b>Infraestructura sanitaria | Rosario, Santa Fe</b><br><br>La intervención en el Hospital de Niños Zona Norte contempló la refuncionalización y adecuación de espacios destinados a los servicios de tomografía, odontología y cardiología, con el objetivo de optimizar las instalaciones y mejorar las condiciones de atención del establecimiento.<br><br>El proyecto incluyó trabajos complementarios en áreas técnicas y de servicio, adecuaciones de instalaciones eléctricas, incorporación de un generador de energía, mejoras en sectores del subsuelo y acondicionamiento de accesos y circulaciones.<br><br>La obra formó parte de un programa de modernización de la infraestructura sanitaria pública de la provincia de Santa Fe, orientado a responder a las necesidades operativas del hospital y fortalecer sus servicios especializados de atención pediátrica.'],
  
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  }
  ,
  {
    id: 'plazas-de-la-cercania-2025',
    nombre: 'Plazas de la Cercanía 2025',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Agosto 2025 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  //Plaza Juramento
  {
    id: 'pasaje-juramento',
    nombre: 'Pasaje Juramento',
    categoria: 'Patrimonio',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Secretaría de Obras Públicas Municipal.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Junio, 2025 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  //ODA 2025
  {
    id: 'oda-2025',
    nombre: 'Obras de Arquitectura 2025',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril 2025 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'entubamiento-y-darsena-escuela-primaria-n1397',
    nombre: 'Entubamiento y Darsena Escuela Primaria N°1397',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat - DIPAI.',
    ubicacion: 'Funes.',
    datos: [
      'Plazo: Marzo, 2025 - Abril, 2025.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  }
  ,
  {
    id: 'puesta-en-valor-de-dos-plazas',
    nombre: 'Puesta en Valor de Dos Plazas',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'S.U.M.A.R. Municipalidad de Rosario',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Febrero 2025 - Julio 2025.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'plazas-de-la-cercania',
    nombre: 'Plazas de la Cercanía',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Diciembre 2024 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'oda-2023',
    nombre: 'ODA 2023',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Octubre, 2023 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'nuevo-edificio-consultorios-externos-hospital-general-de-agudos-p-pinero',
    nombre: 'Nuevo Edificio Consultorios Externos Hospital General de Agudos. P Piñero',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Gobierno de la ciudad de Buenos Aires.',
    ubicacion: 'C.A.B.A.',
    datos: [
      'Superficie: 3.000 m².',
      'Plazo: Julio, 2023 - Febrero, 2025.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'puesta-en-valor-de-paseos-comerciales-a-cielo-abierto-en-distritos-de-la-ciudad-de-rosario',
    nombre: 'Puesta en Valor de Paseos Comerciales a Cielo Abierto en Distritos de la Ciudad de Rosario',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario.',
    datos: [
      'Plazo: Mayo, 2023 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-escuela-primaria-barrio-nuevo-alberdi',
    nombre: 'Construcción Escuela Primaria Barrio Nuevo Alberdi',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2023 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'senderos-veredas-y-espacios-publicos-ut',
    nombre: 'Senderos, Veredas y Espacios Públicos - UT',
    categoria: 'Espacio Público',
    tipo: 'colaboracion',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Diciembre, 2022 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'plaza-grupo-a-plaza-de-la-infancia-y-plaza-lopez',
    nombre: 'Plaza Grupo “A” - Plaza de la Infancia y Plaza López',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ente Autarquico Munícipal de la Municipalidad de Rosario - SUMAR.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 8.000 m².',
      'Plazo: Septiembre, 2022 - Mayo, 2023.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'rehabilitacion-grupo-escultorico-cuadriga-sede-de-gobierno-rosario',
    nombre: 'Rehabilitación Grupo Escultórico Cuádriga Sede de Gobierno Rosario',
    categoria: 'Patrimonio',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas - DIPAI.',
    ubicacion: 'Rosario. Santa Fe.',
    datos: [
      'Plazo: Junio, 2022 - Mayo, 2023',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'local-kt-design',
    nombre: 'Local KT Design',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'KT Design.',
    ubicacion: 'Funes - Rosario, Santa Fe.',
    datos: [
      'Superficie: 1.000 m².',
      'Plazo: Abril, 2022 - Febrero, 2023.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-primaria-modelo-postpandemia-en-pueblo-esther',
    nombre: 'Escuela Primaria Modelo Postpandemia en Pueblo Esther',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat.',
    ubicacion: 'Pueblo Esther, Santa Fe.',
    datos: [
      'Superficie: 3.500 m².',
      'Plazo: Febrero, 2022 - Enero, 2025.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'sistema-de-provision-de-agua-potable-localidad-puerto-gaboto',
    nombre: 'Sistema de Provisión de Agua Potable Localidad Puerto Gaboto',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat.',
    ubicacion: 'Puerto Gaboto, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2021 - Finalizado.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-secundaria-modelo-postpandemia-en-roldan',
    nombre: 'Escuela Secundaria Modelo Postpandemia en Roldán',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat - DIPAI.',
    ubicacion: 'Roldán, Santa Fe.',
    datos: [
      'Superficie: 3.000 m².',
      'Plazo: Septiembre, 2021 - Septiembre, 2023.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'nuevo-samco-ibarlucea',
    nombre: 'Nuevo SAMCO Ibarlucea',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura, Servicios Públicos y Hábitat.',
    ubicacion: 'Ibarlucea, Santa Fe.',
    datos: [
      'Superficie: 600 m².',
      'Plazo: Agosto, 2021 - Mayo, 2023.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'frente-ingreso-al-campus-de-la-universidad-nacional-de-rafaela',
    nombre: 'Frente Ingreso al Campus de la Universidad Nacional de Rafaela',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Universidad Nacional de Rafaela.',
    ubicacion: 'Rafaela, Santa Fe.',
    datos: [
      'Plazo: Febrero, 2021 - Agosto, 2021.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'terminaciones-de-jardines-varios',
    nombre: 'Terminaciones de Jardines Varios',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Provincia de Santa Fe',
    datos: [
      'Superficie: 1.200 m².',
      'Plazo: Enero, 2020 - Septiembre, 2022.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-primaria-de-creacion-d-e-20-polo-piedrabuena',
    nombre: 'Escuela Primaria de Creación D.E. 20 “Polo Piedrabuena”',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación e Innovación.',
    ubicacion: 'C.A.B.A.',
    datos: [
      'Superficie: 2.800 m².',
      'Plazo: Abril, 2019 - Febrero, 2021.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'facultad-de-humanidades-y-arte-unr',
    nombre: 'Facultad de Humanidades y Arte UNR',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Fundación de la UNR.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Septiembre, 2019 - Junio, 2020.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'oda-2da-etapa',
    nombre: 'Obras de Arquitectura - 2da Etapa',
    categoria: 'Institucional',
    tipo: 'colaboracion',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Mayo, 2019 - Enero, 2022.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'climatizacion-central-ala-santa-fe-sede-de-gobierno-rosario',
    nombre: 'Climatización Central Ala Santa Fe - Sede de Gobierno Rosario',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2019 - Febrero, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'hospital-granaderos-a-caballos',
    nombre: 'Hospital Granaderos a Caballos',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas - DIPAI.',
    ubicacion: 'San Lorenzo, Santa Fe.',
    descripcion: [
      'REHABILITACIÓN DE FACHADAS Y CUBIERTAS Y OBRAS COMPLEMENTARIO',
    ],
    datos: [
      'Superficie: 700 m².',
      'Plazo: Septiembre, 2018 - Julio, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-de-locales-comerciales-en-estacion-facultad-de-derecho',
    nombre: 'Construcción de Locales Comerciales en Estación Facultad de Derecho',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'SUBTE - Buenos Aires Ciudad',
    ubicacion: 'CABA',
    datos: [
      'Plazo: Junio, 2018 - Agosto, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'linea-e-taller-lacarra-caba',
    nombre: 'Linea “E” Taller Lacarra',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'SUBTE - Buenos Aires Ciudad.',
    ubicacion: 'CABA',
    datos: [
      'Superficie: 1.100 m².',
      'Plazo: Junio, 2018 - Febrero 2022.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'puesta-en-valor-entorno-hospital-gutierrez',
    nombre: 'Puesta en Valor Entorno Hospital Gutierrez',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Ambiente y Espacio Público.',
    ubicacion: 'CABA',
    datos: [
      'Superficie: 2.800 m².',
      'Plazo: Diciembre, 2018 - Septiembre, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: '69-viviendas-habitacionales-en-ph-30-cocheras-centro-univers-rosario',
    nombre: '69 Viviendas Habitacionales en PH, 30 Cocheras - Centro Univers. Rosario',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección Provincial de Vivienda y Urbanismo, Santa Fe.',
    ubicacion: 'Centro Universitario, Rosario. Santa Fe.',
    datos: [
      'Superficie: 4.000 m².',
      'Plazo: Abril, 2018 - Febrero, 2022.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-de-educacion-secundaria-zona-cero',
    nombre: 'Escuela de Educación Secundaria - Zona Cero',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas - UEPA.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 2.200 m².',
      'Plazo: Noviembre, 2017 - Agosto, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'entorno-ribera-central-ut',
    nombre: 'Entorno Ribera Central - U.T.',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 9.000 m².',
      'Plazo: Enero, 2017 - Septiembre, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-de-infantes-n-290',
    nombre: 'Jardín de Infantes N° 290.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación.',
    ubicacion: 'Villa Gobernador Gálvez - Departamento Rosario, Santa Fe.',
    datos: [
      'Superficie: 700 m².',
      'Plazo: Febrero, 2018 - Mayo, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-presupuesto-participativo',
    nombre: 'Obras Presupuesto Participativo',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario. Santa Fe.',
    datos: [
      'Plazo: Octubre, 2017 - Diciembre, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'restauracion-fachada-sede-de-gobierno-rosario',
    nombre: 'Restauración Fachada Sede de Gobierno Rosario',
    categoria: 'Patrimonio',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas - DIPAI.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 12.000 m².',
      'Plazo: Julio, 2017 - Febrero, 2020.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'hospital-granaderos-a-caballo-ut-participacion',
    nombre: 'Hospital Granaderos a Caballo - UT - Participación',
    categoria: 'Salud',
    tipo: 'colaboracion',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas - DIPAI.',
    ubicacion: 'San Lorenzo, Santa Fe.',
    datos: [
      'Superficie: 1400 m².',
      'Plazo: Septiembre, 2017 - Agosto, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-de-arquitectura-ut',
    nombre: 'Obras de Arquitectura - UT',
    categoria: 'Institucional',
    tipo: 'colaboracion',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2017 - Diciembre, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'readecuacion-de-la-estacion-de-bomberos-n1',
    nombre: 'Readecuación de la Estación de Bomberos N°1.',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Infraestructura y Transporte.',
    ubicacion: 'Fray Luis Beltrán. Departamento de San Lorenzo, Santa Fe.',
    datos: [
      'Plazo: Febrero, 2017 - Octubre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'parque-de-las-colectividades-sector-norte-rosario',
    nombre: 'Parque de las Colectividades Sector Norte - Rosario.',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Fideicomiso Inmobiliario Mitre 132.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Agosto, 2017 - Noviembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'mansardas-en-casa-de-gobierno-santa-fe-ut-participacion',
    nombre: 'Mansardas en Casa de Gobierno - Santa Fe - UT Participación.',
    categoria: 'Institucional',
    tipo: 'colaboracion',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2016 - Noviembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'revitalizacion-de-la-zona-historica-de-la-ciudad-de-rosario-1-etapa',
    nombre: 'Revitalización de la Zona Histórica de la Ciudad de Rosario - 1° Etapa',
    categoria: 'Patrimonio',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rosario.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Junio, 2016 - Diciembre, 2019.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-maternal-comuna-de-ataliva',
    nombre: 'Jardín Maternal, Comuna de Ataliva',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Comuna de Ataliva.',
    ubicacion: 'Ataliva, Santa Fe.',
    datos: [
      'Superficie: 480 m².',
      'Plazo: Junio, 2016 - Agosto, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'poder-judicial-de-la-provincia-de-santa-fe-san-cristobal-2da-etapa',
    nombre: 'Poder Judicial de la Provincia de Santa Fe - San Cristobal - 2da Etapa',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Poder Judicial de la Provincia de Santa Fe.',
    ubicacion: 'San Cristobal, Santa Fe.',
    datos: [
      'Superficie: 1.300 m².',
      'Plazo: Noviembre, 2015 - Marzo, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'remodelacion-de-la-defensoria-del-pueblo-en-la-ciudad-de-rosario',
    nombre: 'Remodelación de la Defensoría del Pueblo en la Ciudad de Rosario',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 600 m².',
      'Plazo: Enero, 2016 - Julio, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'd-p-v-y-u-14-viviendas-carcarana',
    nombre: 'D.P.V. y U. - 14 Viviendas - Carcarañá',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección Provincial de Vivienda y Urbanismo - Santa Fe.',
    ubicacion: 'Carcarañá, Santa Fe.',
    datos: [
      'Plazo: Abril, 2016 - Diciembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-maternal-comuna-de-maximo-paz',
    nombre: 'Jardin Maternal. Comuna de Máximo Paz',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Comuna de Máximo Paz.',
    ubicacion: 'Máximo Paz, Constitución, Santa Fe.',
    datos: [
      'Superficie: 450 m².',
      'Plazo: Septiembre, 2015 - Octubre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-maternal-comuna-de-acebal',
    nombre: 'Jardin Maternal. Comuna de Acebal',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Comuna de Acebal.',
    ubicacion: 'Acebal, Constitución, Santa Fe.',
    datos: [
      'Superficie: 690 m².',
      'Plazo: Noviembre, 2015 - Marzo, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-maternal-comuna-de-angelica',
    nombre: 'Jardin Maternal. Comuna de Angélica',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Comuna de Angélica.',
    ubicacion: 'Angélica, Santa Fe.',
    datos: [
      'Superficie: 480 m².',
      'Plazo: Octubre, 2015 - Noviembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-eet-n-346',
    nombre: 'Escuela EET N° 346',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 400 m².',
      'Plazo: Octubre, 2015 - Noviembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'remodelacion-de-comisarias-11-25-29-de-rosario-y-vgg',
    nombre: 'Remodelación de Comisarías 11, 25, 29 de Rosario y VGG',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Rosario y Villa Gobernador Gálvez, Santa Fe.',
    datos: [
      'Plazo: Septiembre, 2015 - Marzo, 2016.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obra-civil-nuevo-centro-de-distribucion-catamarca',
    nombre: 'Obra Civil Nuevo Centro de Distribución Catamarca',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Empresa Provincial de la Energía S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2015 - Octubre, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: '30-loteos-e-infraestructura-en-arroyo-seco',
    nombre: '30 Loteos e Infraestructura en Arroyo Seco',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección Provincial de Vivienda y Urbanismo. Santa Fe',
    ubicacion: 'Arroyo Seco, Constitución, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2015 - Octubre, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-nro-a-crear-villa-gobernador-galvez',
    nombre: 'Escuela Nro a Crear Villa Gobernador Gálvez',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Planificación Federal, Inversión Pública y Servicios.',
    ubicacion: 'Villa Gobernador Gálvez, Santa Fe.',
    datos: [
      'Superficie: 2.000 m².',
      'Plazo: Noviembre, 2014 - Marzo, 2016.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-n-237-san-lorenzo',
    nombre: 'Jardín N° 237 - San Lorenzo',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'San Lorenzo, Santa Fe.',
    datos: [
      'Superficie: 305 m².',
      'Plazo: Enero, 2015 - Septiembre, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-pista-de-atletismo-las-rosas',
    nombre: 'Construcción Pista de Atletismo “Las Rosas”',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Las Rosas, Departamento Belgrano, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2015 - Marzo, 2016.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-pista-de-atletismo-villa-constitucion',
    nombre: 'Construcción Pista de Atletismo “Villa Constitución”',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda.',
    ubicacion: 'Villa Constitución, Departamento Constitución, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2015 - Diciembre, 2017.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-de-musica-rafaela',
    nombre: 'Escuela de Música - Rafaela',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Rafaela.',
    ubicacion: 'Rafaela, Departamento Castellanos, Santa Fe.',
    datos: [
      'Superficie: 2.110 m².',
      'Plazo: Mayo, 2014 - Octubre, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'estacion-sosa-10-viviendas-entre-rios',
    nombre: 'Estación Sosa 10 Viviendas - Entre Ríos',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'I.A.P.V.',
    ubicacion: 'Estación Sosa, Entre Ríos.',
    datos: [
      'Plazo: Junio, 2013 - Mayo, 2014.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'sauce-montrull-10-viviendas-entre-rios',
    nombre: 'Sauce Montrull 10 Viviendas - Entre Ríos',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'I.A.P.V.',
    ubicacion: 'Sauce Montrull, Entre Ríos.',
    datos: [
      'Plazo: Junio, 2013 - Mayo, 2014.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'guardia-hospital-dr-ferre-rafaela',
    nombre: 'Guardia Hospital Dr. Ferré - Rafaela',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Obras Públicas y Vivienda',
    ubicacion: 'Rafaela, Departamento Castellanos, Santa Fe.',
    datos: [
      'Superficie: 750 m².',
      'Plazo: Mayo, 2013 - Febrero, 2016.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'e-e-m-n-128-rosario',
    nombre: 'E.E.M. N° 128 - Rosario',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Marzo, 2013 - Febrero, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'e-e-t-n-292-san-vicente',
    nombre: 'E.E.T. N° 292 San Vicente',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'San Vicente, Departamento Castellanos, Santa Fe',
    datos: [
      'Superficie: 305 m².',
      'Plazo: Agosto, 2012 - Mayo, 2015.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'i-s-p-n-22-fray-luis-beltran',
    nombre: 'I.S.P. N° 22 Fray Luis Beltran',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Fray Luis Beltrán, Departamento San Lorenzo, Santa Fe.',
    datos: [
      'Superficie: 928 m².',
      'Plazo: Junio, 2012 - Mayo, 2014.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-complementarias-en-planta-de-osmosis-inversa-assa-zona-cero',
    nombre: 'Obras Complementarias en Planta de Osmosis Inversa - ASSA - Zona Cero',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Aguas Santafesinas S.A - D.P.V y U.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Julio, 2012 - Junio, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-complementarias-en-planta-de-osmosis-inversa-assa-canada-de-gomez',
    nombre: 'Obras Complementarias en Planta de Osmosis Inversa - ASSA - Cañada de Gómez',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Aguas Santafesinas S.A.',
    ubicacion: 'Cañada de Gómez, Departamento Iriondo, Santa Fe.',
    datos: [
      'Superficie: 375 m².',
      'Plazo: Noviembre, 2011 - Octubre, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-complementarias-en-planta-de-osmosis-inversa-assa-rafaela',
    nombre: 'Obras Complementarias en Planta de Osmosis Inversa - ASSA - Rafaela',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Aguas Santafesinas S.A.',
    ubicacion: 'Rafaela, Departamento Castellanos, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2011 - Agosto, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-ala-este-edificio-facultad-regional-rafaela',
    nombre: 'Construcción Ala Este Edificio Facultad Regional Rafaela',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Universidad Tecnológica Nacional',
    ubicacion: 'Rafaela, Departamento Castellanos, Santa Fe.',
    datos: [
      'Superficie: 890 m².',
      'Plazo: Septiembre, 2011 - Octubre, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'ministerio-de-planificacion-federal-lic-011-11-prov-de-santa-fe',
    nombre: 'Ministerio de Planificación Federal - Lic. 011/11. Prov. de Santa Fe.',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Planificación Federal, Inversión Pública y Servicios.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Septiembre, 2011 - Octubre, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obras-complementarias-en-planta-de-osmosis-inversa-assa-barrio-godoy-rosario',
    nombre: 'Obras Complementarias en Planta de Osmosis Inversa - ASSA - Barrio Godoy, Rosario',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Aguas Santafesinas S.A - D.P.V y U.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Septiembre, 2011 - Marzo, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obra-civil-nuevo-centro-de-distribucion',
    nombre: 'Obra Civil Nuevo Centro de Distribución',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Empresa Provincial de la Energía S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 386 m².',
      'Plazo: Agosto, 2011 - Abril, 2013 / Diciembre, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'edificio-de-propiedad-horizontal-tribeca-ii',
    nombre: 'Edificio de Propiedad Horizontal Tribeca II',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Fideicomiso TRIBECA II.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 1.356 m².',
      'Plazo: Febrero, 2011 - Diciembre, 2013.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-joan-miro',
    nombre: 'Escuela Joan Miró',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Asociación Educativo Joan Miró.',
    ubicacion: 'Funes, Santa Fe.',
    datos: [
      'Plazo: Diciembre, 2010 - Marzo, 2011.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'lic-134-09-construccion-jardin-n-267-lehmann-y-jardin-n-167-c-aldeo-depto-castellanos-provincia-de-santa-fe',
    nombre: 'Lic. 134/09 Construcción Jardín N° 267 - Lehmann y Jardin N° 167 - C. Aldeo - Depto Castellanos. Provincia de Santa Fe.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Planificación Federal, Inversión Pública y Servicios.',
    ubicacion: 'Lehmann y C. Aldeo - Departamento Castellanos, Santa Fe.',
    datos: [
      'Superficie: 410 m².',
      'Plazo: Agosto, 2010 - Julio, 2011 / Julio, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'lic-133-09-construccion-jardin-clucellas-y-ramona-provincia-santa-fe',
    nombre: 'Lic. 133/09 Construcción Jardín Clucellas y Ramona - Provincia Santa Fe.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Planificación Federal, Inversión Pública y Servicios.',
    ubicacion: 'Clucellas y Ramona. Departamento Castellanos, Santa Fe.',
    datos: [
      'Superficie: 410 m².',
      'Plazo: Agosto, 2010 - Julio, 2011 / Julio, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'lic-116-09-construccion-jardin-en-escuela-n06-florentino-ameghino-y-jardin-zona-sur-este-parana-entre-rios',
    nombre: 'Lic. 116/09 Construcción Jardín en Escuela N°06 “Florentino Ameghino” y Jardín Zona Sur Este. Paraná, Entre Ríos.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Planificación Federal, Inversión Pública y Servicios.',
    ubicacion: 'Victoria y Paraná, Entre Ríos.',
    datos: [
      'Superficie: 410 m².',
      'Plazo: Agosto, 2010 - Julio, 2011 / Julio, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-de-talleres-y-sanitarios-e-e-t-n-468',
    nombre: 'Construcción de Talleres y Sanitarios E.E.T. N° 468',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 650 m².',
      'Plazo: Enero, 2010 - Junio 2011 / Junio 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'ampliacion-y-mejora-de-capacidades-edilicias',
    nombre: 'Ampliación y Mejora de Capacidades Edilicias.',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Instituto de Agrobiotecnología Rosario S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 2.048 m².',
      'Plazo: Septiembre, 2009 - Junio, 2010 / Junio, 2012.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'galpon-empresa-provincial-de-la-energia',
    nombre: 'Galpon - Empresa Provincial de la Energía',
    categoria: 'Industrial',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Empresa Provincial de la Energía S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2008 - Enero, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'laboratorio-wiemer-s-a',
    nombre: 'Laboratorio Wiemer S.A',
    categoria: 'Salud',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Laboratorio Wiemer S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Junio, 2008 - Diciembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-del-cerco-perimetral-de-hormigon-armado',
    nombre: 'Construcción del Cerco Perimetral de Hormigón Armado',
    categoria: 'Infraestructura',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección Provincial de Arquitectura e Ingeniería - Gobierno de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Enero, 2009 - Julio, 2009 / Julio, 2011.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'construccion-de-aulas-y-galerias-en-e-e-m-n243',
    nombre: 'Construcción de Aulas y Galerías en E.E.M. N°243.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 480 m².',
      'Plazo: Enero, 2009 - Julio, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'promse-grupo-n16-e-e-m-n240',
    nombre: 'PROMSE Grupo N°16 E.E.M. N°240.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Diciembre, 2008 - Marzo, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'promse-grupo-n16-e-e-m-n243',
    nombre: 'PROMSE Grupo N°16 E.E.M. N°243.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 480 m².',
      'Plazo: Diciembre, 2008 - Abril, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'promse-grupo-n16-e-e-m-n347',
    nombre: 'PROMSE Grupo N°16 E.E.M. N°347.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Diciembre, 2008 - Abril, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'grupo-15-escuela-n-6086',
    nombre: 'Grupo 15 Escuela N° 6086',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Septiembre, 2008 - Junio, 2009 / Diciembre, 2010.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'jardin-de-infantes-n-200',
    nombre: 'Jardín de Infantes N° 200',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Mayo, 2008 - Julio, 2009 / Diciembre, 2010.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'grupo-9-escuela-n-1162-y-n-114',
    nombre: 'Grupo 9 Escuela N° 1162 y N° 114',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2008 - Abril, 2008 / Diciembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'grupo-10-escuela-n-1346-y-n299',
    nombre: 'Grupo 10 Escuela N° 1346 y N°299.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Enero, 2008 - Agosto, 2008 / Diciembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'grupo-14-escuela-n-518-y-n-1172',
    nombre: 'Grupo 14 Escuela N° 518 y N° 1172.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Enero, 2008 - Agosto, 2008 / Diciembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'grupo-8-promse-e-e-m-n-350-y-e-e-m-n360',
    nombre: 'Grupo 8 - PROMSE E.E.M N° 350 y E.E.M. N°360.',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 730 m².',
      'Plazo: Febrero, 2009 - Diciembre, 2009 / Junio, 2010.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'asociacion-cooperadora-escuela-media-n203',
    nombre: 'Asociación Cooperadora Escuela Media N°203',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección General de Cultura y Educación de la Provincia de BS.AS',
    ubicacion: 'B6435 Guaminí, Provincia de Buenos Aires',
    datos: [
      'Plazo: Octubre, 2007 - Enero, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'asociacion-cooperadora-escuela-media-n208',
    nombre: 'Asociación Cooperadora Escuela Media N°208',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Dirección General de Cultura y Educación de la Provincia de BS.AS',
    ubicacion: 'Provincia de Buenos Aires',
    datos: [
      'Plazo: Octubre, 2007 - Enero, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n-1188-j-b-bustos',
    nombre: 'Escuela N° 1188 J. B. Bustos',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 300 m².',
      'Plazo: Diciembre, 2007 - Diciembre, 2008 / Diciembre, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'edificio-de-propiedad-horizontal-mailen-iii',
    nombre: 'Edificio de Propiedad Horizontal Mailen III',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Corsanot S.R.L.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Agosto, 2007 - Enero, 2008 / Julio, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'remodelacion-autoservicio-mayorista',
    nombre: 'Remodelación Autoservicio Mayorista',
    categoria: 'Comercial',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Pedro Balestrino e hijos S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Febrero, 2007 - Abril, 2007 / Julio, 2007.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'edificio-corporativo-cafe-la-virginia-albanileria',
    nombre: 'Edificio Corporativo Café La Virginia - Albañilería',
    categoria: 'Comercial',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'RIVA S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2006 - Enero, 2007 / Abril, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'obrador-central-casino-rosario',
    nombre: 'Obrador Central Casino Rosario',
    categoria: 'Institucional',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'RIVA S.A.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Octubre, 2006 - Diciembre, 2006 / Marzo, 2007.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'e-e-t-n-465-estructura-de-hormigon-armado-visto',
    nombre: 'E.E.T. N° 465 - Estructura de Hormigón Armado Visto',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'ESPRECO S.R.L.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 2.500 m².',
      'Plazo: Octubre, 2006 - Septiembre, 2007 / Junio, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'parque-industrial-villa-constitucion',
    nombre: 'Parque Industrial Villa Constitución',
    categoria: 'Espacio Público',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Municipalidad de Villa Constitución.',
    ubicacion: 'Villa Conatitución, Santa Fe.',
    datos: [
      'Plazo: Agosto, 2006 - Febrero, 2007 / Agosto, 2007.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n-1102-sargento-cabral-camino-viejo-a-soldini-3023',
    nombre: 'Escuela N° 1102 “Sargento Cabral” - Camino Viejo a Soldini 3023',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2006 - Enero, 2007 / Enero, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n560-provincia-de-jujuy-bv-orono-5635',
    nombre: 'Escuela N°560 “Provincia de Jujuy” - Bv. Oroño 5635',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2006 - Junio, 2007 / Junio, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n1293-lisandro-paganini-las-heras-705',
    nombre: 'Escuela N°1293 “Lisandro Paganini” - Las Heras 705',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2007 - Septiembre, 2007 / Septiembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n9020-juan-domingo-peron-av-san-martin-2051-g-baigorria',
    nombre: 'Escuela N°9020 “Juan Domingo Perón” - Av. San Martin 2051, G. Baigorria',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Granadero Baigorria, Santa Fe.',
    datos: [
      'Plazo: Abril, 2007 - Julio, 2007 / Julio, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n1358-macacha-guemes-teniente-agneta-2100',
    nombre: 'Escuela N°1358 “Macacha Güemes” - Teniente Agneta 2100',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2007 - Julio, 2007 / Julio, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'escuela-n1331-vicente-lopez-y-planes-casacuberta-9650',
    nombre: 'Escuela N°1331 “Vicente Lopez y Planes” - Casacuberta 9650',
    categoria: 'Educación',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Ministerio de Educación de la Provincia de Santa Fe. P.I.E.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Plazo: Abril, 2007 - Septiembre, 2007 / Septiembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'edificio-tribeca-i',
    nombre: 'Edificio Tribeca I',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'Fideicomiso Tribeca I.',
    ubicacion: 'Rosario, Santa Fe.',
    datos: [
      'Superficie: 1540 m².',
      'Plazo: Mayo, 2007 - Mayo, 2009 / Noviembre, 2009.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'complejo-habitacional-francia-y-guruciaga',
    nombre: 'Complejo Habitacional Francia y Guruciaga',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'RUANA S.A.',
    ubicacion: 'San Nicolás, Provincia de Buenos Aires.',
    datos: [
      'Superficie: 600 m².',
      'Plazo: Julio, 2007 - Agosto, 2009 / Febrero, 2010.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  },
  {
    id: 'vivienda-unifamiliar-lote-279',
    nombre: 'Vivienda Unifamiliar - Lote 279',
    categoria: 'Viviendas',
    tipo: 'propia',
    estado: 'terminado',
    comitente: 'María Laura Rodriguez.',
    ubicacion: 'Funes, Santa Fe.',
    datos: [
      'Plazo: Noviembre, 2006 - Noviembre, 2007 /Noviembre, 2008.',
    ],
    
    carpeta: 'provisorio',
    fotos: [FOTO_PROVISORIA]
  }*/
];