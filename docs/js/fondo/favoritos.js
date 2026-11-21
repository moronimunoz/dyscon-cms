/* =====================================================================
   MILKY WAY ASCII  ·  milkyway.js  ·  exportado el 21/11/2026 con tus ajustes

   CÓMO USARLO EN TU HTML
   1. Guarda este archivo junto a tu página, por ejemplo en scripts/milkyway.js
   2. En tu HTML, justo antes de </body>, agrega esta línea (ajusta la ruta):

        <script src="scripts/milkyway.js"></script>

   3. Listo. No hace falta crear ningún <canvas>: el script crea el suyo, fijo y a
      pantalla completa, DETRÁS de tu contenido (z-index -1), así tus textos,
      imágenes y menús se ven encima y el fondo no se mueve al hacer scroll.

   PARA QUE SE VEA Y NADA LO TAPE
   - El script ya deja el <body> sin color de fondo. Pero si un contenedor tuyo
     (header, main, section, div...) tiene background con color sólido, ese
     contenedor tapa el fondo. Quítale el color o usa uno semitransparente,
     por ejemplo: background: rgba(0, 0, 0, 0.4);
   - No pongas dos scripts de universos en la misma página: se pisarían.
   - Si no aparece nada: abre la consola del navegador (F12). Un error 404
     significa que la ruta del <script src> está mal. En GitHub Pages las rutas
     deben ser relativas al repositorio y respetar mayúsculas y minúsculas.

   PARA CAMBIAR EL ASPECTO: edita los valores del bloque CFG de aquí abajo.
   ===================================================================== */
(function () {
  function arrancar() {
(() => {
  const FPS = 30;
  const RAMP = " .,:;-=+*#%@";
  const TAU = Math.PI * 2;
  const smooth = x => { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); };
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const mix = (a, b, k) => a + (b - a) * k;
  const mod = (a, n) => ((a % n) + n) % n;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const redondo = v => Math.round(v * 100) / 100;

  function seeded(seed) {            // aleatorio fijo, para que las estrellas no cambien al redimensionar
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const escenario = document.createElement("div");
  escenario.setAttribute("aria-hidden", "true");
  Object.assign(escenario.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", zIndex: "-1", pointerEvents: "none" });
  const nuevoCanvas = () => {
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "block" });
    escenario.appendChild(c); return c;
  };
  const cv = nuevoCanvas(), ctx = cv.getContext("2d");
  const gl = nuevoCanvas(), gctx = gl.getContext("2d");
  Object.assign(gl.style, { filter: "blur(9px)", mixBlendMode: "screen", opacity: ".85" });
  const velo = document.createElement("div");
  Object.assign(velo.style, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "rgba(0,0,0,.25)" });
  escenario.appendChild(velo);
  document.body.prepend(escenario);
  document.body.style.setProperty("background", "transparent", "important");   // si el <body> tuviera color, taparía la galaxia

  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let W, H, dpr, CW, CH, cols, rows;
  let desv = 0;                         // corrimiento hacia la izquierda cuando el panel está abierto
  const UNIVERSOS = {};
  const INICIAL = "milky";
  let U = null, clave = INICIAL, t = 0, alActivar = () => {};

  // <FUGACES>
  // estrellas fugaces al azar (líneas finas). Las usan Milky Way y Galaxy Webb.
  const FILAS_FUGACES = [
    ["FUGAZ_MIN", "Espera mínima", 1, 20, 1, 1, " s"],
    ["FUGAZ_MAX", "Espera máxima", 2, 30, 1, 1, " s"],
    ["FUGAZ_DOBLE", "Probabilidad de doble", 0, 1, 0.05, 100, "%"],
    ["FUGAZ_VEL", "Velocidad", 0.5, 4, 0.1, 1, ""],
    ["FUGAZ_COLA", "Largo", 0.05, 0.4, 0.01, 1, ""],
    ["FUGAZ_GROSOR", "Grosor", 0.5, 3, 0.1, 1, " px"],
  ];

  function crearFugaces(getCfg, getAngulo) {
    const FUGAZ_PRIMERA = 4;            // cuándo sale la primera (s)
    const FUGAZ_INVERSA = 0.15;         // probabilidad de que vaya de derecha a izquierda
    const FUGAZ_VARIACION = 8;          // grados al azar que se desvía del ángulo base
    const FUGAZ_DIST = 0.4;             // qué tan lejos del centro puede pasar (arriba o abajo, al azar)
    const lista = [];
    let proxima = FUGAZ_PRIMERA;
    const rr = (lo, hi) => lo + Math.random() * (hi - lo);

    function nueva(start) {
      const c = getCfg();
      lista.push({
        start,
        ang: getAngulo() + rr(-1, 1) * FUGAZ_VARIACION * Math.PI / 180,
        inv: Math.random() < FUGAZ_INVERSA,
        off: rr(-1, 1) * FUGAZ_DIST,
        vel: c.FUGAZ_VEL * rr(0.8, 1.25),
        cola: c.FUGAZ_COLA * rr(0.7, 1.3),
      });
    }

    return {
      reiniciar() { lista.length = 0; proxima = FUGAZ_PRIMERA; },
      dibujar(t) {
        if (still.matches) return;
        const c = getCfg();
        const mn = Math.min(c.FUGAZ_MIN, c.FUGAZ_MAX), mx = Math.max(c.FUGAZ_MIN, c.FUGAZ_MAX);
        if (proxima - t > mx) proxima = t + rr(mn, mx);   // si bajas la espera, se aplica enseguida
        if (t >= proxima) {
          nueva(t);
          if (Math.random() < c.FUGAZ_DOBLE) nueva(t + rr(0.3, 1.2));
          proxima = t + rr(mn, mx);
        }
        const aspect = W / H, [fr, fg, fb] = hex(c.FUGAZ_COLOR);
        ctx.lineWidth = c.FUGAZ_GROSOR; ctx.lineCap = "round";
        for (let n = lista.length - 1; n >= 0; n--) {
          const e = lista[n];
          if (t < e.start) continue;
          const ca = Math.cos(e.ang), sa = Math.sin(e.ang), nx = -sa, ny = ca;
          const sMax = (aspect / 2 + 0.2) / Math.abs(ca), dir = e.inv ? -1 : 1;
          const head = -dir * sMax + dir * e.vel * (t - e.start);
          const tail = head - dir * e.cola;
          if (dir * tail > sMax) { lista.splice(n, 1); continue; }   // ya salió de la pantalla
          const P = s => [((ca * s + nx * e.off) / aspect + 0.5) * W, ((sa * s + ny * e.off) + 0.5) * H];
          const [hx, hy] = P(head), [tx, ty] = P(tail);
          const g = ctx.createLinearGradient(tx, ty, hx, hy);
          g.addColorStop(0, `rgba(${fr},${fg},${fb},0)`);
          g.addColorStop(0.75, `rgba(${fr},${fg},${fb},0.5)`);
          g.addColorStop(1, "rgba(255,255,255,0.95)");
          ctx.strokeStyle = g;
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.9)";      // punto brillante en la cabeza
          ctx.beginPath(); ctx.arc(hx, hy, c.FUGAZ_GROSOR * 0.8, 0, Math.PI * 2); ctx.fill();
        }
      },
    };
  }
  // </FUGACES>

  // <UNI milky>
  UNIVERSOS.milky = (() => {
    // ---- AJUSTES: edita estos valores para cambiar el aspecto ----
    const CFG = {
      SPIN: 0.35,                           // velocidad de giro (rad/s)
      SENTIDO: 1,                           // 1 = antihorario, -1 = horario
      ZOOM: 1.7,                            // tamaño de la galaxia
      TILT_DEG: -22,                        // inclinación en pantalla (grados)
      FLAT: 0.42,                           // 1 = de frente, menor = más de canto
      BRILLO: 1,                            // intensidad de los colores
      COLORES: ["#fff0be","#ff7d19","#ff2878","#d71e96"],// núcleo, naranja, brazos, borde
      NEBULOSA: 0.9,                        // manchas de color de fondo (0 = apagadas)
      STAR_DENSITY: 0.03,                   // estrellas sueltas
      PUNTOS_DENSIDAD: 0.01,                // puntos de colores
      FUGAZ_MIN: 3,                         // espera mínima entre fugaces (s)
      FUGAZ_MAX: 12,                        // espera máxima (s)
      FUGAZ_DOBLE: 0.25,                    // probabilidad de doble (0 a 1)
      FUGAZ_VEL: 1.9,                       // velocidad
      FUGAZ_COLA: 0.11,                     // largo de la línea
      FUGAZ_GROSOR: 1.1,                    // grosor (px)
      FUGAZ_COLOR: "#d6ebff",               // color
    };
    const DEF = CFG;
    const COM = {"SPIN": "velocidad de giro (rad/s)", "SENTIDO": "1 = antihorario, -1 = horario", "ZOOM": "tamaño de la galaxia", "TILT_DEG": "inclinación en pantalla (grados)", "FLAT": "1 = de frente, menor = más de canto", "BRILLO": "intensidad de los colores", "COLORES": "núcleo, naranja, brazos, borde", "NEBULOSA": "manchas de color de fondo (0 = apagadas)", "STAR_DENSITY": "estrellas sueltas", "PUNTOS_DENSIDAD": "puntos de colores", "FUGAZ_MIN": "espera mínima entre fugaces (s)", "FUGAZ_MAX": "espera máxima (s)", "FUGAZ_DOBLE": "probabilidad de doble (0 a 1)", "FUGAZ_VEL": "velocidad", "FUGAZ_COLA": "largo de la línea", "FUGAZ_GROSOR": "grosor (px)", "FUGAZ_COLOR": "color"};

    const FONDO = "#02030a", ESTRELLAS = "#fff0e1";
    const NEBULOSA_COLORES = ["#6e3cab", "#ab5a50"];   // violeta -> marrón rojizo
    const PUNTOS_COLORES = ["#7fb2ff", "#a5ccff", "#ffb066", "#ff8fb0", "#ffe27a", "#b68cff"];
    const COLOR_POS = [0.07, 0.17, 0.30, 0.45];       // distancia al centro de cada color del degradado
    const STAR_RGB = hex(ESTRELLAS), PUNTOS_RGB = PUNTOS_COLORES.map(hex), NEB_RGB = NEBULOSA_COLORES.map(hex);
    let PAL, rnd, rnd2, fase = 0;
    const fuga = crearFugaces(() => CFG, () => CFG.TILT_DEG * Math.PI / 180);

    function recolor() { PAL = CFG.COLORES.map((h, i) => [COLOR_POS[i], hex(h)]); }
    recolor();

    function tone(rho, heat) {
      let c = PAL[PAL.length - 1][1];
      if (rho <= PAL[0][0]) c = PAL[0][1];
      else for (let k = 1; k < PAL.length; k++) {
        if (rho < PAL[k][0]) {
          const [r0, c0] = PAL[k - 1], [r1, c1] = PAL[k], f = (rho - r0) / (r1 - r0);
          c = [mix(c0[0], c1[0], f), mix(c0[1], c1[1], f), mix(c0[2], c1[2], f)];
          break;
        }
      }
      const l = clamp(0.5 + 0.9 * heat, 0, 1.25) * CFG.BRILLO;
      return `rgb(${Math.min(255, c[0] * l) | 0},${Math.min(255, c[1] * l) | 0},${Math.min(255, c[2] * l) | 0})`;
    }

    function resize() {
      CW = W < 700 ? 9 : 7; CH = Math.round(CW * 11 / 7);
      cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
      const R = seeded(11), R2 = seeded(23);
      rnd = new Float32Array(cols * rows); rnd2 = new Float32Array(cols * rows);
      for (let i = 0; i < rnd.length; i++) rnd[i] = R();
      for (let i = 0; i < rnd2.length; i++) rnd2[i] = R2();
      ctx.font = `${Math.round(CW * 12 / 7)}px Consolas, Menlo, "DejaVu Sans Mono", monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
    }

    function draw(t, dt) {
      fase += dt * CFG.SPIN * CFG.SENTIDO;
      ctx.fillStyle = FONDO;
      ctx.fillRect(0, 0, W, H);
      const aspect = W / H;
      const intro = smooth(t / 3);        // la galaxia se enciende al abrir
      const { ZOOM, FLAT, NEBULOSA, STAR_DENSITY, PUNTOS_DENSIDAD } = CFG;
      const rad = CFG.TILT_DEG * Math.PI / 180, COS = Math.cos(rad), SIN = Math.sin(rad);

      for (let row = 0; row < rows; row++) {
        for (let c = 0; c < cols; c++) {
          const i = row * cols + c;
          const X = ((c + 0.5) / cols - 0.5) * aspect + desv;
          const Y = (row + 0.5) / rows - 0.5;

          // plano de la galaxia: rotar, aplastar, pasar a radio/ángulo
          const u = (X * COS + Y * SIN) / ZOOM, v = (-X * SIN + Y * COS) / FLAT / ZOOM;
          const rho = Math.hypot(u, v), phi = Math.atan2(v, u);

          // giro rígido: la forma nunca cambia, solo rota
          const a = phi - Math.log(rho / 0.04 + 1) * 1.9 + fase;
          const arm = 0.5 + 0.5 * Math.cos(2 * a);
          const dustA = 0.5 + 0.5 * Math.cos(2 * a + 1.1);

          const core = Math.exp(-rho / 0.045) * 1.5;
          const bulge = Math.exp(-((rho / 0.13) ** 2)) * 0.8;
          const edge = smooth((0.45 - rho) / 0.15);
          const clump = 0.75 + 0.25 * Math.sin(37 * a + 21 * rho + 0.4 * t) * Math.sin(13 * phi - 9 * rho);
          let disk = Math.exp(-rho / 0.28) * (0.15 + 0.85 * arm ** 2.2) * edge * clump * 1.8;
          const dust = (dustA ** 3) * smooth((rho - 0.08) / 0.1) * smooth((0.4 - rho) / 0.2);
          disk *= 1 - 0.55 * dust;

          // nebulosa: manchas suaves de color, muy tenues
          const nf = Math.sin(2.3 * X + 1.4 * Math.sin(3.1 * Y + 1.0) + 0.03 * t) * Math.sin(1.9 * Y - 1.2 * X + 2.0);
          const neb = NEBULOSA * smooth((nf - 0.1) / 0.6);

          const heat = clamp((core + bulge + disk) * intro * 1.3, 0, 1.25);
          let ch = null, col = null;

          if (heat > 0.06) {
            const idx = clamp(Math.floor(heat * 9.5), 1, RAMP.length - 1);
            ch = RAMP[idx];
            col = tone(rho, heat);
          } else {
            const n = rnd[i];
            if (n < STAR_DENSITY) {
              const bright = n < 0.0015 ? 2 : n < 0.006 ? 1 : 0;
              ch = bright === 2 ? "*" : bright === 1 ? "+" : ".";
              const tw = 0.7 + 0.3 * Math.sin(0.9 * t + n * 9000);
              const l = (bright ? 1 : 0.7) * tw;
              col = `rgb(${(STAR_RGB[0] * l) | 0},${(STAR_RGB[1] * l) | 0},${(STAR_RGB[2] * l) | 0})`;
            } else if (rnd2[i] < PUNTOS_DENSIDAD) {
              // punto de color suelto (estrella azul, naranja, rosa...)
              const q = rnd2[i] / PUNTOS_DENSIDAD, rgb = PUNTOS_RGB[Math.floor(n * 7919) % PUNTOS_RGB.length];
              ch = q < 0.15 ? "*" : q < 0.45 ? "+" : ".";
              const l = 0.75 + 0.25 * Math.sin(0.7 * t + n * 5000);
              col = `rgb(${(rgb[0] * l) | 0},${(rgb[1] * l) | 0},${(rgb[2] * l) | 0})`;
            } else if (neb > 0 && rnd2[i] < neb * 0.5) {
              const m = 0.5 + 0.5 * Math.sin(1.7 * X - 2.1 * Y), l = 0.4 + 0.5 * neb;
              ch = rnd2[i] < neb * 0.12 ? ":" : ".";
              col = `rgb(${(mix(NEB_RGB[0][0], NEB_RGB[1][0], m) * l) | 0},${(mix(NEB_RGB[0][1], NEB_RGB[1][1], m) * l) | 0},${(mix(NEB_RGB[0][2], NEB_RGB[1][2], m) * l) | 0})`;
            }
          }
          if (ch === null || ch === " ") continue;
          ctx.fillStyle = col;
          ctx.fillText(ch, c * CW + CW / 2, row * CH + CH / 2);
        }
      }
      fuga.dibujar(t);
    }

    return {
      nombre: "Milky Way", archivo: "milkyway.js", fondo: FONDO, glow: false,
      DEF, CFG, COM, recolor,
      grupos: [
        ["Galaxia", [
          ["SPIN", "Giro", 0, 1.5, 0.01, 1, ""],
          ["ZOOM", "Zoom", 0.8, 3, 0.05, 1, ""],
          ["TILT_DEG", "Inclinación", -90, 90, 1, 1, "°"],
          ["FLAT", "Aplastamiento", 0.2, 1, 0.01, 1, ""],
        ], { sentido: [["Antihorario", 1], ["Horario", -1]] }],
        ["Colores", [
          ["BRILLO", "Brillo", 0.5, 1.5, 0.05, 1, ""],
        ], { colores: [["Núcleo", "COLORES", 0], ["Naranja", "COLORES", 1], ["Brazos", "COLORES", 2], ["Borde", "COLORES", 3], ["Fugaz", "FUGAZ_COLOR"]] }],
        ["Fondo", [
          ["NEBULOSA", "Nebulosa", 0, 2, 0.1, 1, ""],
          ["STAR_DENSITY", "Estrellas", 0, 0.08, 0.005, 100, "%"],
          ["PUNTOS_DENSIDAD", "Puntos de color", 0, 0.03, 0.001, 100, "%"],
        ]],
        ["Estrellas fugaces", FILAS_FUGACES],
      ],
      arrancar() { fase = 0; fuga.reiniciar(); },
      resize, draw,
      quieto() { fase = 6 * CFG.SPIN * CFG.SENTIDO; draw(6, 0); },
    };
  })();
  // </UNI milky>



  const panel = { classList: { contains: () => true }, offsetWidth: 0 };   // (en el script exportado no hay panel)

  // ---------- activar un universo y bucle ----------
  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    U.resize();
  }

  const desvObjetivo = () => panel.classList.contains("cerrado") ? 0 : (panel.offsetWidth / 2) / H;

  function activar(k) {
    clave = k; U = UNIVERSOS[k]; t = 0;          // la animación del universo empieza de cero; sus ajustes se conservan
    document.documentElement.style.background = U.fondo;
    gl.style.display = velo.style.display = U.glow ? "block" : "none";
    ctx.globalCompositeOperation = "source-over";
    U.arrancar();
    redimensionar();
    alActivar();
    if (still.matches) { desv = desvObjetivo(); U.quieto(); }
  }

  addEventListener("resize", () => { redimensionar(); if (still.matches) { desv = desvObjetivo(); U.quieto(); } });

  let last = 0;
  function loop(ms) {
    requestAnimationFrame(loop);
    if (still.matches || ms - last < 1000 / FPS) return;
    const dt = last ? Math.min((ms - last) / 1000, 0.1) : 0;   // si la pestaña estuvo oculta no se saltea la intro
    last = ms; t += dt;
    desv += (desvObjetivo() - desv) * 0.15;                    // se desliza suave al abrir o cerrar el panel
    U.draw(t, dt);
  }

  activar(INICIAL);
  requestAnimationFrame(loop);
})();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
