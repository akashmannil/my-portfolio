const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return { cr: ((n >> 16) & 255) / 255, cg: ((n >> 8) & 255) / 255, cb: (n & 255) / 255 };
};

// one scene per story beat (components mapped in MorphRig)
const stageSequence = ['laptop', 'desk', 'rocket', 'sphere', 'cards', 'rack', 'dish'];

// one pose per tab; MorphRig damps toward the active pose every frame,
// so switching tabs morphs the stage instead of cutting
const tabPoses = {
  home: { actor: 0, x: 1.8, y: 0.05, scale: 1.05, rx: 0.2, ry: -0.35, ...rgb('#7ad7ff') },
  about: { actor: 1, x: 2.1, y: -0.05, scale: 0.85, rx: 0.24, ry: -0.55, ...rgb('#c9f24b') },
  experience: { actor: 2, x: -2.4, y: -0.35, scale: 0.95, rx: 0.05, ry: 0.2, ...rgb('#ff6a3d') },
  skills: { actor: 3, x: 0, y: -0.9, scale: 0.8, rx: 0.2, ry: 0, ...rgb('#f4f2ec') },
  work: { actor: 4, x: 2.8, y: -0.4, scale: 0.75, rx: 0.05, ry: -0.35, ...rgb('#7ad7ff') },
  contact: { actor: 6, x: -2.0, y: -0.85, scale: 0.62, rx: 0.12, ry: 0.3, ...rgb('#7ad7ff') },
};

// inputs written by the UI (active tab, experience step, hovered project);
// the frame loop only ever reads them
const stageInputs = {
  tab: 'home',
  journey: 0,
  project: 0,
};

const setStageTab = (id) => {
  if (tabPoses[id]) stageInputs.tab = id;
};

const computeStagePose = (out) => Object.assign(out, tabPoses[stageInputs.tab]);

// 0..3: active experience step (drives JourneyRocket altitude + ring heat)
const journeyFocus = () => stageInputs.journey;

// 0..2: highlighted project card (drives ProjectCards3D focus)
const projectFocus = () => stageInputs.project;

export {
  computeStagePose,
  journeyFocus,
  projectFocus,
  setStageTab,
  stageInputs,
  stageSequence,
};
