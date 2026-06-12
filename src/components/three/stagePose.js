const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return { cr: ((n >> 16) & 255) / 255, cg: ((n >> 8) & 255) / 255, cb: (n & 255) / 255 };
};

// one scene per story beat (components mapped in MorphRig)
const stageSequence = ['laptop', 'desk', 'rocket', 'sphere', 'cards', 'rack', 'dish'];

const basePose = { actor: 0, x: 1.8, y: 0.05, scale: 1.05, rx: 0.2, ry: -0.35, ...rgb('#7ad7ff') };

const sectionKeyframes = [
  { trigger: '#manifesto', pose: { actor: 1, x: 2.1, y: -0.05, scale: 0.85, rx: 0.24, ry: -0.55, ...rgb('#c9f24b') } },
  { trigger: '#experience', pose: { actor: 2, x: -2.4, y: -0.35, scale: 0.95, rx: 0.05, ry: 0.2, ...rgb('#ff6a3d') } },
  { trigger: '#skills', endAt: 'top center', pose: { actor: 3, x: 0, y: -1.5, scale: 0.85, rx: 0.2, ry: 0, ...rgb('#f4f2ec') } },
  { trigger: '#work .project-card:nth-of-type(1)', endAt: 'top center', pose: { actor: 4, x: 2.8, y: -1.0, scale: 0.75, rx: 0.05, ry: -0.35, ...rgb('#7ad7ff') } },
  { trigger: '#work .project-card:nth-of-type(2)', endAt: 'top center', pose: { actor: 4, x: -2.8, y: -1.0, scale: 0.75, rx: 0.05, ry: 0.35, ...rgb('#c9f24b') } },
  { trigger: '#work .project-card:nth-of-type(3)', endAt: 'top center', pose: { actor: 4, x: 2.8, y: -1.0, scale: 0.75, rx: 0.05, ry: -0.35, ...rgb('#ff6a3d') } },
  { trigger: '#stats', pose: { actor: 5, x: 2.4, y: 0.5, scale: 0.75, rx: 0.05, ry: -0.45, ...rgb('#c9f24b') } },
  { trigger: '#contact', pose: { actor: 6, x: 0, y: -0.45, scale: 0.72, rx: 0.12, ry: 0, ...rgb('#7ad7ff') } },
];

// scroll progress published by ScrollTriggers (App seeds sections,
// Journey's pin publishes journey); the pose is *computed* from these
// every frame, so trigger update order can never corrupt it
const stageInputs = {
  sections: new Array(sectionKeyframes.length).fill(0),
  journey: 0,
};

// fractions of the journey pin at which each panel fades in — must mirror
// the timeline built in Journey.jsx (in: 1, hold: 0.6, out: 1 per panel)
const journeyWindows = [
  [1.6, 2.6],
  [4.2, 5.2],
  [6.8, 7.8],
].map(([a, b]) => [a / 7.8, b / 7.8]);

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const window01 = (v, [a, b]) => Math.min(Math.max((v - a) / (b - a), 0), 1);

const computeStagePose = (out) => {
  Object.assign(out, basePose);
  sectionKeyframes.forEach(({ pose }, i) => {
    const t = stageInputs.sections[i];
    if (t <= 0) return;
    const k = smooth(Math.min(t, 1));
    for (const key in pose) out[key] = lerp(out[key], pose[key], k);
  });
  return out;
};

// 0..3: which experience panel is on screen (drives CommitGraph highlight)
const journeyFocus = () =>
  journeyWindows.reduce((f, w) => f + smooth(window01(stageInputs.journey, w)), 0);

// 0..2: which project card is on screen (drives ProjectCards3D focus)
const projectFocus = () =>
  smooth(Math.min(stageInputs.sections[4], 1)) + smooth(Math.min(stageInputs.sections[5], 1));

export {
  computeStagePose,
  journeyFocus,
  projectFocus,
  stageInputs,
  sectionKeyframes,
  stageSequence,
};
