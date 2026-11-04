#!/usr/bin/env node
/* geocodificar.js - busca en OpenStreetMap la ubicación exacta de las obras que tienen una dirección en el
   campo "mapa", y guarda el resultado en scripts/geocache.json (cada dirección se busca una sola vez).
   Uso:   node scripts/geocodificar.js
   Lo corre solo el flujo "Generar páginas" de GitHub antes de build.js. No hace falta correrlo a mano.
   Si no hay internet, no pasa nada: el mapa usa el centro de la ciudad de cada obra. */
const { cargarObras } = require('./contenido');
const { geocodificarPendientes } = require('./ubicaciones');

const avisos = [];
geocodificarPendientes(cargarObras(), { avisos, log: m => console.log(m) })
  .then(n => {
    console.log(n ? `Listo: ${n} búsquedas nuevas guardadas en scripts/geocache.json` : 'No había nada nuevo para buscar.');
    avisos.forEach(a => console.log(`::warning::${a}`));
  })
  .catch(e => console.log(`::warning::Falló la búsqueda de ubicaciones: ${e.message}`));   // nunca frena la publicación
