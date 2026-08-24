/* ------------------------------------------------------------------ */
/* MOTOR DE SONIDO — efectos sintetizados con Web Audio API            */
/* No requiere archivos de audio externos: todo se genera en el       */
/* navegador del usuario, así que funciona igual en local y en Vercel. */
/* ------------------------------------------------------------------ */

const MUTE_KEY = "db_sound_muted_v1";

let ctx = null;
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function loadMutePref() {
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
  return muted;
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* localStorage no disponible, se ignora */
  }
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

/**
 * Reproduce un tono simple con envolvente (ataque rápido, caída exponencial).
 */
function tone({ freq = 440, duration = 0.15, type = "sine", gain = 0.18, delay = 0, glideTo = null }) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const t0 = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const amp = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo !== null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(glideTo, 1), t0 + duration);
  }

  amp.gain.setValueAtTime(0, t0);
  amp.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(amp);
  amp.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

/** Clic suave para navegación y botones. */
export function playClick() {
  tone({ freq: 700, duration: 0.055, type: "square", gain: 0.05 });
}

/** Respuesta correcta: arpegio ascendente y brillante. */
export function playCorrect() {
  tone({ freq: 523.25, duration: 0.12, type: "sine", gain: 0.16 });
  tone({ freq: 659.25, duration: 0.14, type: "sine", gain: 0.16, delay: 0.09 });
  tone({ freq: 783.99, duration: 0.2, type: "sine", gain: 0.16, delay: 0.18 });
}

/** Respuesta incorrecta: tono descendente grave. */
export function playWrong() {
  tone({ freq: 200, duration: 0.24, type: "sawtooth", gain: 0.13, glideTo: 110 });
}

/** Nivel completado: fanfarria corta ascendente. */
export function playLevelComplete() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    tone({ freq: f, duration: 0.3, type: "triangle", gain: 0.15, delay: i * 0.12 })
  );
}

/** Fin de partida sin completar el nivel: descenso apagado. */
export function playGameOver() {
  [392, 349.23, 293.66, 220].forEach((f, i) =>
    tone({ freq: f, duration: 0.32, type: "sine", gain: 0.14, delay: i * 0.15 })
  );
}

/* ------------------------------------------------------------------ */
/* MÚSICA DE FONDO — pad ambiental generado en loop con Web Audio      */
/* ------------------------------------------------------------------ */

const MUSIC_KEY = "db_music_enabled_v1";

let musicEnabled = true;
let musicPlaying = false;
let musicTimeoutId = null;
let musicGainNode = null;

// Progresión Am - F - C - G en registro grave y cálido, pensada para
// sostenerse en loop sin cansar durante partidas largas.
const PROGRESSION = [
  [110.0, 130.81, 164.81], // A2  C3  E3  (Am)
  [87.31, 110.0, 130.81], // F2  A2  C3  (F)
  [130.81, 164.81, 196.0], // C3  E3  G3  (C)
  [98.0, 123.47, 146.83], // G2  B2  D3  (G)
];
const CHORD_DURATION = 4.5; // segundos que suena cada acorde
const LOOP_DURATION = PROGRESSION.length * CHORD_DURATION; // duración total del loop

export function loadMusicPref() {
  try {
    const raw = window.localStorage.getItem(MUSIC_KEY);
    musicEnabled = raw === null ? true : raw === "1";
  } catch {
    musicEnabled = true;
  }
  return musicEnabled;
}

export function isMusicEnabled() {
  return musicEnabled;
}

function persistMusicPref(value) {
  try {
    window.localStorage.setItem(MUSIC_KEY, value ? "1" : "0");
  } catch {
    /* localStorage no disponible, se ignora */
  }
}

function ensureMusicGain(audio) {
  if (!musicGainNode) {
    musicGainNode = audio.createGain();
    musicGainNode.gain.value = 1;
    musicGainNode.connect(audio.destination);
  }
  return musicGainNode;
}

function padChord(audio, freqs, t0, duration) {
  const bus = ensureMusicGain(audio);
  freqs.forEach((f, i) => {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = i === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(f, t0);
    // leve deriva para que el pad "respire" en vez de sonar estático
    osc.frequency.linearRampToValueAtTime(f * 1.003, t0 + duration);
    const peak = 0.045;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + duration * 0.4);
    g.gain.linearRampToValueAtTime(peak, t0 + duration * 0.55);
    g.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(g);
    g.connect(bus);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  });
}

function scheduleMusicLoop() {
  if (!musicPlaying) return;
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + 0.05;
  PROGRESSION.forEach((chord, i) => padChord(audio, chord, t0 + i * CHORD_DURATION, CHORD_DURATION + 0.9));
  musicTimeoutId = setTimeout(scheduleMusicLoop, LOOP_DURATION * 1000);
}

/** Inicia la música ambiental (requiere un gesto previo del usuario por las políticas de autoplay). */
export function startMusic() {
  if (musicPlaying || !musicEnabled) return;
  const audio = getCtx();
  if (!audio) return;
  musicPlaying = true;
  const bus = ensureMusicGain(audio);
  bus.gain.cancelScheduledValues(audio.currentTime);
  bus.gain.setValueAtTime(bus.gain.value, audio.currentTime);
  bus.gain.linearRampToValueAtTime(1, audio.currentTime + 1.2);
  scheduleMusicLoop();
}

/** Detiene la música con un fundido corto; las notas ya sonando terminan su envolvente natural. */
export function stopMusic() {
  musicPlaying = false;
  if (musicTimeoutId) {
    clearTimeout(musicTimeoutId);
    musicTimeoutId = null;
  }
  if (musicGainNode && ctx) {
    musicGainNode.gain.cancelScheduledValues(ctx.currentTime);
    musicGainNode.gain.setValueAtTime(musicGainNode.gain.value, ctx.currentTime);
    musicGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  }
}

export function setMusicEnabled(value) {
  musicEnabled = value;
  persistMusicPref(value);
  if (value) startMusic();
  else stopMusic();
}

export function toggleMusicEnabled() {
  setMusicEnabled(!musicEnabled);
  return musicEnabled;
}

/** Monedas ganadas (recompensa diaria, compra, anuncio). */
export function playCoin() {
  tone({ freq: 988, duration: 0.08, type: "square", gain: 0.1 });
  tone({ freq: 1318.5, duration: 0.16, type: "square", gain: 0.1, delay: 0.06 });
}

