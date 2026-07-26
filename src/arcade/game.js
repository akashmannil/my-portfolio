import { drawText, drawTextCentered, textWidth } from './pixelFont';
import { CABINETS, CHANNELS, ITEMS, QUESTS, STATIONS, STATS } from './gameData';
import { play } from './audio';

const INK = '#0b1020';
const GRID = '#16203a';
const DIM = '#4a5a80';
const LIT = '#c9f24b';
const PAPER = '#e8f0ff';

const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };
const frame = (ctx, x, y, w, h, c) => {
  rect(ctx, x, y, w, 1, c); rect(ctx, x, y + h - 1, w, 1, c);
  rect(ctx, x, y, 1, h, c); rect(ctx, x + w - 1, y, 1, h, c);
};

export const createGame = (W, H) => ({
  W, H,
  mode: 'boot',
  t: 0,
  px: W / 2, py: H - 34, pdir: 0, walk: 0,
  near: null,
  sel: 0,
  opened: null,
  toast: 0,
});

const icon = (ctx, kind, x, y, c) => {
  switch (kind) {
    case 'pc':
      rect(ctx, x, y, 14, 10, '#2b3a5e'); rect(ctx, x + 1, y + 1, 12, 8, c);
      rect(ctx, x + 5, y + 10, 4, 2, '#2b3a5e'); rect(ctx, x + 2, y + 12, 10, 1, '#2b3a5e');
      break;
    case 'rocket':
      rect(ctx, x + 5, y, 4, 3, c); rect(ctx, x + 4, y + 3, 6, 7, PAPER);
      rect(ctx, x + 2, y + 7, 2, 4, c); rect(ctx, x + 10, y + 7, 2, 4, c);
      rect(ctx, x + 5, y + 10, 4, 2, '#ff6a3d'); rect(ctx, x + 6, y + 12, 2, 2, '#ffd43b');
      break;
    case 'flask':
      rect(ctx, x + 4, y, 6, 2, PAPER); rect(ctx, x + 5, y + 2, 4, 4, PAPER);
      rect(ctx, x + 3, y + 6, 8, 6, c); rect(ctx, x + 4, y + 8, 2, 2, PAPER);
      break;
    case 'cabinet':
      rect(ctx, x + 1, y, 12, 15, '#2b3a5e'); rect(ctx, x + 3, y + 2, 8, 6, c);
      rect(ctx, x + 3, y + 10, 3, 2, '#ff6a3d'); rect(ctx, x + 8, y + 10, 3, 2, '#ffd43b');
      break;
    case 'radio':
      rect(ctx, x + 1, y + 4, 13, 10, '#2b3a5e'); rect(ctx, x + 3, y + 6, 5, 5, c);
      rect(ctx, x + 10, y + 7, 2, 2, '#ff6a3d'); rect(ctx, x + 7, y, 2, 5, PAPER);
      break;
    default:
      break;
  }
};

const player = (ctx, x, y, dir, walk) => {
  const b = Math.floor(walk) % 2;
  rect(ctx, x - 3, y - 11, 6, 5, '#f0c39a');           // head
  rect(ctx, x - 4, y - 12, 8, 2, '#3b2a1e');           // hair
  rect(ctx, x - 4, y - 6, 8, 7, dir === 2 ? '#7ad7ff' : '#c9f24b'); // torso
  rect(ctx, x - 3 - b, y + 1, 3, 4, '#2b3a5e');        // legs
  rect(ctx, x + b, y + 1, 3, 4, '#2b3a5e');
  rect(ctx, x - 6, y - 5, 2, 5, '#f0c39a');            // arms
  rect(ctx, x + 4, y - 5, 2, 5, '#f0c39a');
};

const header = (ctx, W, label) => {
  rect(ctx, 0, 0, W, 11, '#16203a');
  drawText(ctx, label, 4, 2, { color: LIT });
  drawText(ctx, '[ESC] BACK', W - textWidth('[ESC] BACK') - 4, 2, { color: DIM });
};

const bar = (ctx, x, y, w, pct, color) => {
  rect(ctx, x, y, w, 5, '#22304f');
  rect(ctx, x, y, Math.max(1, Math.round(w * pct)), 5, color);
  frame(ctx, x, y, w, 5, '#31406a');
};

/* ---------------- panels ---------------- */
const panels = {
  about(ctx, g) {
    header(ctx, g.W, 'PLAYER STATS');
    const cx = 14;
    rect(ctx, cx, 20, 22, 26, '#22304f');
    player(ctx, cx + 11, 40, 0, 0);
    drawText(ctx, 'AKASH', cx + 30, 20, { color: PAPER });
    drawText(ctx, 'FULL STACK DEV', cx + 30, 30, { color: DIM });
    drawText(ctx, 'LV 6', cx + 30, 40, { color: LIT });
    STATS.forEach((s, i) => {
      const y = 58 + i * 20;
      const val = `${s.value}${s.suffix.replace(/[^A-Za-z0-9%+]/g, '').slice(0, 5)}`;
      drawText(ctx, s.label, 14, y, { color: PAPER });
      bar(ctx, 14, y + 9, g.W - 34 - textWidth(val) - 8, s.pct, s.color);
      drawText(ctx, val, g.W - 14 - textWidth(val), y + 9, { color: s.color });
    });
  },

  experience(ctx, g) {
    header(ctx, g.W, 'QUEST LOG');
    QUESTS.forEach((q, i) => {
      const y = 18 + i * 30;
      const on = i === g.sel;
      rect(ctx, 8, y, g.W - 16, 27, on ? '#22304f' : '#131c33');
      if (on) frame(ctx, 8, y, g.W - 16, 27, LIT);
      rect(ctx, 12, y + 4, 19, 19, q.color);
      drawTextCentered(ctx, String(QUESTS.length - i), 21, y + 10, { color: INK });
      drawText(ctx, q.name.slice(0, 22), 36, y + 5, { color: on ? LIT : PAPER });
      drawText(ctx, `${q.from}-${q.to}`, 36, y + 15, { color: DIM });
      for (let s = 0; s < q.tasks; s++) rect(ctx, g.W - 22 - s * 6, y + 15, 4, 4, q.color);
      drawText(ctx, 'CLEAR', g.W - 46, y + 5, { color: '#8cc84b' });
    });
  },

  skills(ctx, g) {
    header(ctx, g.W, 'INVENTORY');
    const cols = 5, cw = 53, ch = 33;
    ITEMS.forEach((it, i) => {
      const cxp = 6 + (i % cols) * cw, cyp = 15 + Math.floor(i / cols) * ch;
      const on = i === g.sel;
      rect(ctx, cxp, cyp, cw - 5, ch - 5, on ? '#22304f' : '#131c33');
      if (on) frame(ctx, cxp, cyp, cw - 5, ch - 5, LIT);
      rect(ctx, cxp + 4, cyp + 4, 9, 9, it.color);
      for (let s = 0; s < it.tier; s++) rect(ctx, cxp + 16 + s * 5, cyp + 6, 3, 5, '#ffd43b');
      drawText(ctx, it.name.replace(/[^A-Z0-9.]/g, '').slice(0, 7), cxp + 4, cyp + 17, { color: on ? PAPER : DIM });
    });
    const cur = ITEMS[g.sel];
    if (cur) {
      rect(ctx, 0, g.H - 12, g.W, 12, '#16203a');
      drawText(ctx, cur.name, 4, g.H - 10, { color: cur.color });
      drawText(ctx, `TIER ${cur.tier}`, g.W - 40, g.H - 10, { color: '#ffd43b' });
    }
  },

  work(ctx, g) {
    header(ctx, g.W, 'ARCADE');
    const n = CABINETS.length;
    CABINETS.forEach((c, i) => {
      // shortest way round so the carousel wraps instead of running off-screen
      let off = i - g.sel;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      if (Math.abs(off) > 1) return;
      const w = off === 0 ? 66 : 46;
      const h = off === 0 ? 80 : 60;
      const x = g.W / 2 + off * 78 - w / 2;
      const y = 22 + (off === 0 ? 0 : 12);
      rect(ctx, x, y, w, h, '#22304f');
      frame(ctx, x, y, w, h, off === 0 ? LIT : '#31406a');
      rect(ctx, x + 4, y + 4, w - 8, h * 0.42, c.color);
      rect(ctx, x + 6, y + 6, w - 12, h * 0.42 - 4, '#0b1020');
      drawTextCentered(ctx, String(i + 1), x + w / 2, y + h * 0.18, { color: c.color });
      rect(ctx, x + 6, y + h * 0.5, 4, 4, '#ff6a3d');
      rect(ctx, x + 13, y + h * 0.5, 4, 4, '#ffd43b');
      if (off === 0) {
        drawTextCentered(ctx, c.name.slice(0, 12), x + w / 2, y + h - 16, { color: PAPER });
      }
    });
    const cur = CABINETS[g.sel % n];
    rect(ctx, 0, g.H - 22, g.W, 22, '#16203a');
    drawText(ctx, cur.tags.join(' '), 4, g.H - 19, { color: DIM });
    drawText(ctx, '[ENTER] PLAY', 4, g.H - 9, { color: LIT });
    drawText(ctx, `${(g.sel % n) + 1}/${n}`, g.W - 26, g.H - 9, { color: DIM });
  },

  contact(ctx, g) {
    header(ctx, g.W, 'COMMS');
    rect(ctx, 20, 20, g.W - 40, 40, '#131c33');
    frame(ctx, 20, 20, g.W - 40, 40, '#31406a');
    const wave = Math.sin(g.t * 4) * 3;
    for (let i = 0; i < 10; i++) {
      const h = 4 + Math.abs(Math.sin(g.t * 3 + i * 0.6)) * 12;
      rect(ctx, 30 + i * 8, 46 - h / 2 + wave, 4, h, i % 2 ? '#7ad7ff' : LIT);
    }
    drawTextCentered(ctx, 'SIGNAL OPEN', g.W / 2, 66, { color: '#8cc84b' });
    CHANNELS.forEach((c, i) => {
      const on = i === g.sel;
      const x = 14 + i * ((g.W - 28) / CHANNELS.length);
      const w = (g.W - 28) / CHANNELS.length - 6;
      rect(ctx, x, 82, w, 26, on ? '#22304f' : '#131c33');
      if (on) frame(ctx, x, 82, w, 26, LIT);
      rect(ctx, x + w / 2 - 4, 86, 8, 8, c.color);
      drawTextCentered(ctx, c.name.slice(0, 8), x + w / 2, 98, { color: on ? PAPER : DIM });
    });
    drawText(ctx, '[ENTER] SEND', 4, g.H - 10, { color: LIT });
  },
};

/* ---------------- hub ---------------- */
const drawHub = (ctx, g) => {
  for (let y = 16; y < g.H; y += 12) rect(ctx, 0, y, g.W, 1, GRID);
  for (let x = 0; x < g.W; x += 12) rect(ctx, x, 16, 1, g.H - 16, GRID);
  rect(ctx, 0, 0, g.W, 11, '#16203a');
  drawText(ctx, 'PORTFOLIO.EXE', 4, 2, { color: LIT });
  drawText(ctx, 'ARROWS+ENTER', g.W - textWidth('ARROWS+ENTER') - 4, 2, { color: DIM });

  STATIONS.forEach((s) => {
    const on = g.near === s.id;
    if (on) {
      const p = 2 + Math.sin(g.t * 6) * 1.5;
      frame(ctx, s.x - 5 - p, s.y - 5 - p, 25 + p * 2, 25 + p * 2, LIT);
    }
    rect(ctx, s.x - 3, s.y + 15, 21, 3, '#101a30');
    icon(ctx, s.icon, s.x, s.y, on ? LIT : '#5f7bb0');
    drawTextCentered(ctx, s.label, s.x + 7, s.y + 20, { color: on ? LIT : DIM });
  });

  player(ctx, g.px, g.py, g.pdir, g.walk);

  if (g.near) {
    const label = 'PRESS [ENTER]';
    const w = textWidth(label) + 8;
    rect(ctx, g.px - w / 2, g.py - 26, w, 11, '#0b1020');
    frame(ctx, g.px - w / 2, g.py - 26, w, 11, LIT);
    drawTextCentered(ctx, label, g.px, g.py - 23, { color: LIT });
  }
};

/* ---------------- update + draw ---------------- */
export const updateGame = (g, input, dt) => {
  g.t += dt;
  if (g.toast > 0) g.toast -= dt;

  if (g.mode === 'boot') {
    if (g.t > 1.6 || input.any) { g.mode = 'hub'; g.t = 0; }
    return;
  }

  if (g.mode === 'hub') {
    const sp = 46 * dt;
    let moved = false;
    if (input.left) { g.px -= sp; g.pdir = 1; moved = true; }
    if (input.right) { g.px += sp; g.pdir = 2; moved = true; }
    if (input.up) { g.py -= sp; moved = true; }
    if (input.down) { g.py += sp; moved = true; }
    g.px = Math.max(8, Math.min(g.W - 8, g.px));
    g.py = Math.max(30, Math.min(g.H - 6, g.py));
    g.walk = moved ? g.walk + dt * 8 : 0;

    const hit = STATIONS.find((s) => Math.abs(s.x + 7 - g.px) < 22 && Math.abs(s.y + 8 - g.py) < 26);
    const id = hit ? hit.id : null;
    if (id !== g.near) { g.near = id; if (id) play('move'); }
    if (input.enterEdge && g.near) { g.mode = g.near; g.sel = 0; play('select'); }
    return;
  }

  // panels
  const lists = { experience: QUESTS.length, skills: ITEMS.length, work: CABINETS.length, contact: CHANNELS.length };
  const n = lists[g.mode] || 0;
  if (n) {
    const cols = g.mode === 'skills' ? 5 : 1;
    let d = 0;
    if (input.leftEdge) d = g.mode === 'skills' || g.mode === 'work' || g.mode === 'contact' ? -1 : 0;
    if (input.rightEdge) d = g.mode === 'skills' || g.mode === 'work' || g.mode === 'contact' ? 1 : 0;
    if (input.upEdge) d = g.mode === 'skills' ? -cols : -1;
    if (input.downEdge) d = g.mode === 'skills' ? cols : 1;
    if (d) { g.sel = (g.sel + d + n) % n; play('move'); }
  }

  if (input.enterEdge) {
    if (g.mode === 'work') { window.open(CABINETS[g.sel].url, '_blank', 'noopener'); play('open'); g.toast = 1.4; }
    else if (g.mode === 'contact') { window.open(CHANNELS[g.sel].url, '_blank', 'noopener'); play('open'); g.toast = 1.4; }
    else play('select');
  }
  if (input.backEdge) { g.mode = 'hub'; g.near = null; play('back'); }
};

export const drawGame = (ctx, g) => {
  rect(ctx, 0, 0, g.W, g.H, INK);

  if (g.mode === 'boot') {
    const p = Math.min(1, g.t / 1.2);
    rect(ctx, 0, 0, g.W, g.H, '#04070f');
    drawTextCentered(ctx, 'AKASH MANNIL', g.W / 2, g.H / 2 - 22, { color: LIT, scale: 2 });
    drawTextCentered(ctx, 'PORTFOLIO SYSTEM', g.W / 2, g.H / 2 - 2, { color: PAPER });
    rect(ctx, 40, g.H / 2 + 14, g.W - 80, 6, '#16203a');
    rect(ctx, 40, g.H / 2 + 14, Math.round((g.W - 80) * p), 6, LIT);
    drawTextCentered(ctx, 'LOADING', g.W / 2, g.H / 2 + 26, { color: DIM });
    return;
  }

  if (g.mode === 'hub') drawHub(ctx, g);
  else if (panels[g.mode]) panels[g.mode](ctx, g);

  if (g.toast > 0) {
    const w = textWidth('OPENED IN NEW TAB') + 10;
    rect(ctx, g.W / 2 - w / 2, g.H / 2 - 8, w, 14, '#0b1020');
    frame(ctx, g.W / 2 - w / 2, g.H / 2 - 8, w, 14, LIT);
    drawTextCentered(ctx, 'OPENED IN NEW TAB', g.W / 2, g.H / 2 - 4, { color: LIT });
  }
};
