import { counterItems, expCards, projects, skillRows, skillSystem, socialImgs } from '../constants';

// Portfolio content reshaped into game objects: stations to walk to, quest
// levels, inventory items, cabinets and comm channels. Content still comes
// from constants — only its presentation is gamified.
const PALETTE = ['#61dafb', '#c9f24b', '#ff6a3d', '#ffd43b', '#8cc84b', '#dd0031', '#7ad7ff', '#f4f2ec'];

export const STATIONS = [
  { id: 'about', label: 'STATS', x: 46, y: 46, icon: 'pc' },
  { id: 'experience', label: 'QUESTS', x: 137, y: 34, icon: 'rocket' },
  { id: 'skills', label: 'INVENTORY', x: 228, y: 46, icon: 'flask' },
  { id: 'work', label: 'ARCADE', x: 62, y: 108, icon: 'cabinet' },
  { id: 'contact', label: 'COMMS', x: 212, y: 108, icon: 'radio' },
];

// the longest word carries the meaning ("Years of Experience" -> EXPERIENCE)
const shortLabel = (s) =>
  s.split('/')[0].trim().split(/\s+/).sort((a, b) => b.length - a.length)[0].toUpperCase().slice(0, 13);

export const STATS = counterItems.map((c, i) => ({
  label: shortLabel(c.label),
  value: c.value,
  suffix: c.suffix.trim(),
  // normalise wildly different units onto one 0..1 bar
  pct: Math.max(0.12, Math.min(1, c.suffix.includes('%') ? c.value / 100 : c.value / 10)),
  color: PALETTE[i % PALETTE.length],
}));

const yearOf = (d) => (String(d).match(/(19|20)\d{2}/g) || []).slice(-1)[0] || '';
export const QUESTS = expCards
  .map((c, i) => ({
    id: i,
    name: (c.brand || c.title).toUpperCase(),
    title: c.title.toUpperCase(),
    from: yearOf(String(c.date).split('-')[0]),
    to: yearOf(String(c.date).split('-')[1] || c.date),
    tasks: c.responsibilities.length,
    color: PALETTE[i % PALETTE.length],
  }))
  .reverse();

const TIERS = { react: 5, javascript: 5, typescript: 4, angular: 5, 'node.js': 4, mongodb: 4, python: 3, wordpress: 4, 'three.js': 3 };
export const ITEMS = (() => {
  const seen = new Map();
  skillSystem.planets.forEach((p, i) =>
    seen.set(p.label.toUpperCase(), { name: p.label.toUpperCase(), color: p.color, tier: TIERS[p.label] || 3, i })
  );
  skillRows.flat().forEach((s) => {
    const k = s.toUpperCase();
    if (!seen.has(k)) seen.set(k, { name: k, color: PALETTE[seen.size % PALETTE.length], tier: TIERS[s.toLowerCase()] || 3, i: seen.size });
  });
  // 15 fills exactly 3 rows of 5 in the inventory grid
  return [...seen.values()].slice(0, 15);
})();

export const CABINETS = projects.map((p, i) => ({
  name: p.title.toUpperCase(),
  tags: p.tags.map((t) => t.toUpperCase()),
  url: p.url,
  color: PALETTE[i % PALETTE.length],
}));

export const CHANNELS = socialImgs.map((s, i) => ({
  name: s.name.toUpperCase(),
  url: s.url,
  color: PALETTE[(i + 2) % PALETTE.length],
}));
