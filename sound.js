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

/** Monedas ganadas (recompensa diaria, compra, anuncio). */
export function playCoin() {
  tone({ freq: 988, duration: 0.08, type: "square", gain: 0.1 });
  tone({ freq: 1318.5, duration: 0.16, type: "square", gain: 0.1, delay: 0.06 });
}
