// Tiny WebAudio chiptune blips — synthesised, so the arcade ships no audio
// files. The context is created lazily on the first gesture (browsers block
// autoplay). Every cue reports its loudness so the on-screen speaker can react.
let ctx = null;
let muted = false;
let level = 0;

const NOTES = {
  move: [420, 0.05, 'square', 0.05],
  select: [720, 0.09, 'square', 0.09],
  back: [280, 0.09, 'triangle', 0.07],
  open: [880, 0.16, 'square', 0.1],
  key: [180, 0.03, 'square', 0.035],
  boot: [140, 0.35, 'sawtooth', 0.07],
};

export const isMuted = () => muted;
export const setMuted = (v) => {
  muted = v;
  if (muted) level = 0;
};

// 0..1, decays every frame — drives the speaker cone + anime sound arcs
export const soundLevel = () => level;
export const decaySound = (dt) => {
  level = Math.max(0, level - dt * 3.2);
};

export const play = (name) => {
  const spec = NOTES[name];
  if (!spec || muted) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const [freq, dur, type, gain] = spec;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (name === 'open') osc.frequency.exponentialRampToValueAtTime(freq * 1.6, t + dur);
    if (name === 'boot') osc.frequency.exponentialRampToValueAtTime(freq * 3, t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
    level = Math.min(1, level + (name === 'key' ? 0.35 : 0.85));
  } catch {
    // audio is a nicety — never let it break the view
  }
};
