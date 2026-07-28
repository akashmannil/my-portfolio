import { drawText, drawTextCentered, textWidth } from './pixelFont';
import { isMuted } from './audio';

// The room the monitor sits in, drawn as flat pixel rects on a low-res buffer.
// The buffer's size and composition adapt to the viewport: a wide desk on
// landscape, a tall stacked layout with a thumb gamepad on portrait/touch.

// the game buffer is always this size; the CRT screen rect keeps its aspect
export const GAME_W = 276;
export const GAME_H = 152;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const computeLayout = (vw, vh, coarse) => {
  const portrait = vh > vw * 1.05;
  const W = portrait ? 360 : 512;
  // The CRT always shows the game buffer at 1:1, so its pixels stay crisp on
  // every device. The buffer height is then whatever the stacked bands need —
  // a taller viewport becomes extra wall (dressed below), never a squashed screen.
  const screenW = GAME_W;
  const screenH = GAME_H;
  const bezelH = screenH + 24;

  const topPad = portrait ? 58 : 14;   // clears the floating Sound / Exit chrome
  const opH = portrait ? 118 : 104;
  const padH = coarse ? (portrait ? 122 : 100) : 0;
  const kbH = portrait ? 56 : 50;

  // guarantee every band fits, whatever the viewport aspect is
  const needed = topPad + bezelH + 12 + kbH + padH + opH;
  const H = clamp(Math.round((W * vh) / vw), needed, Math.round(needed * 1.9));

  // stack from the bottom: operator, optional gamepad, peripherals, then desk
  const deskY = H - opH - padH - kbH;
  const bezel = {
    w: screenW + 24,
    h: bezelH,
    x: Math.round((W - (screenW + 24)) / 2),
    // centre it in the wall so a tall phone doesn't leave one huge dead gap
    y: clamp(Math.round((deskY - bezelH) / 2), topPad, deskY - bezelH - 8),
  };
  const screen = { x: bezel.x + 12, y: bezel.y + 12, w: screenW, h: screenH };

  const keys = {
    w: portrait ? Math.min(232, W - 128) : 176,
    h: portrait ? 32 : 30,
    x: 0,
    y: deskY + (portrait ? 14 : 12),
  };
  keys.x = Math.round((W - keys.w) / 2) - (portrait ? 14 : 20);
  const mouse = { x: keys.x + keys.w + 12, y: keys.y + 4, w: 22, h: 26 };

  const spk = { w: portrait ? 30 : 34, h: portrait ? 58 : 66 };
  const speakers = portrait
    ? [
        { x: 6, y: deskY + 10, ...spk },
        { x: W - spk.w - 6, y: deskY + 10, ...spk },
      ]
    : [
        { x: Math.max(8, bezel.x - spk.w - 10), y: bezel.y + Math.round(bezel.h / 2) - 20, ...spk },
        { x: Math.min(W - spk.w - 8, bezel.x + bezel.w + 10), y: bezel.y + Math.round(bezel.h / 2) - 20, ...spk },
      ];

  // thumb gamepad, drawn on the desk and mirrored by real buttons in the DOM
  let pad = null;
  if (coarse) {
    const padY = keys.y + keys.h + (portrait ? 16 : 12);
    // sized so each button lands >=44 CSS px once the buffer is scaled up
    const b = portrait ? 42 : 30;
    const dcx = portrait ? 78 : 96;
    const dcy = padY + b + 6;
    const acx = W - (portrait ? 84 : 106);
    pad = {
      y: padY,
      h: padH - 12,
      size: b,
      up: { x: dcx - b / 2, y: dcy - b - 2, w: b, h: b, key: 'up', label: 'Move up' },
      down: { x: dcx - b / 2, y: dcy + 2, w: b, h: b, key: 'down', label: 'Move down' },
      left: { x: dcx - b * 1.5 - 2, y: dcy - b / 2, w: b, h: b, key: 'left', label: 'Move left' },
      right: { x: dcx + b / 2 + 2, y: dcy - b / 2, w: b, h: b, key: 'right', label: 'Move right' },
      a: { x: acx, y: dcy - b / 2 - 4, w: b + 6, h: b + 6, key: 'enter', label: 'Select' },
      b: { x: acx - b - 12, y: dcy + 2, w: b, h: b, key: 'back', label: 'Back' },
    };
  }

  const operator = { cx: Math.round(W / 2), headY: H - opH + 16, shoulderY: H - opH + 46 };

  return { W, H, portrait, coarse, bezel, screen, keys, mouse, speakers, pad, operator, deskY };
};

const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const frame = (ctx, x, y, w, h, c) => {
  rect(ctx, x, y, w, 1, c); rect(ctx, x, y + h - 1, w, 1, c);
  rect(ctx, x, y, 1, h, c); rect(ctx, x + w - 1, y, 1, h, c);
};

const speaker = (ctx, r, lvl, t, reduced) => {
  const { x, y, w, h } = r;
  const cx = x + w / 2;
  const cy = y + h * 0.28;
  rect(ctx, x, y, w, h, '#241d17');
  frame(ctx, x, y, w, h, '#3b2f24');
  rect(ctx, x + 3, y + 3, w - 6, h * 0.45, '#151011');
  ctx.fillStyle = '#3a2c22';
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.28 + lvl * 2.5, 0, 7); ctx.fill();
  ctx.fillStyle = lvl > 0.05 ? '#c9f24b' : '#5c4a38';
  ctx.beginPath(); ctx.arc(cx, cy, 3 + lvl * 2, 0, 7); ctx.fill();
  const vy = y + h * 0.58;
  rect(ctx, x + 4, vy, w - 8, h * 0.3, '#151011');
  for (let i = 0; i < 6; i++) {
    rect(ctx, x + 6 + i * ((w - 12) / 6), vy + 4, 2, h * 0.3 - 8, i / 6 < lvl ? '#c9f24b' : '#2b2119');
  }
  if (lvl > 0.08 && !isMuted() && !reduced) {
    for (let a = 0; a < 3; a++) {
      const p = (t * 1.6 + a * 0.33) % 1;
      ctx.globalAlpha = (1 - p) * lvl;
      ctx.strokeStyle = '#c9f24b';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 12 + p * 26, -0.9, 0.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 12 + p * 26, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
};

const keyboard = (ctx, k, litKey, press) => {
  rect(ctx, k.x - 2, k.y - 2, k.w + 4, k.h + 6, '#1b2436');
  rect(ctx, k.x, k.y, k.w, k.h, '#2b3a56');
  frame(ctx, k.x - 2, k.y - 2, k.w + 4, k.h + 6, '#0f1524');
  const cols = 14;
  const kw = (k.w - 8) / cols;
  const rows = 4;
  const kh = (k.h - 6) / rows;
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 3 && c > 0 && c < 10) { if (c === 1) { rect(ctx, k.x + 4 + kw, k.y + 3 + r * kh, kw * 9 - 2, kh - 2, litKey === i ? '#c9f24b' : '#42557a'); i++; } continue; }
      rect(ctx, k.x + 4 + c * kw, k.y + 3 + r * kh + (litKey === i && press ? 1 : 0), kw - 2, kh - 2, litKey === i ? '#c9f24b' : '#42557a');
      i++;
    }
  }
};

const mouseDev = (ctx, m, press) => {
  rect(ctx, m.x, m.y + 2, m.w, m.h - 2, '#2b3a56');
  frame(ctx, m.x, m.y + 2, m.w, m.h - 2, '#0f1524');
  rect(ctx, m.x + 2, m.y + 4, 8, 8, press ? '#c9f24b' : '#42557a');
  rect(ctx, m.x + 12, m.y + 4, 8, 8, '#42557a');
  rect(ctx, m.x + 10, m.y + 5, 2, 5, '#63789f');
};

const gamepad = (ctx, pad, W, held) => {
  const lit = (k) => (held.has(k) ? '#c9f24b' : '#4a5f8c');
  rect(ctx, 8, pad.y - 8, W - 16, pad.h + 10, '#1b2436');
  frame(ctx, 8, pad.y - 8, W - 16, pad.h + 10, '#0f1524');
  for (const key of ['up', 'down', 'left', 'right']) {
    const b = pad[key];
    rect(ctx, b.x, b.y, b.w, b.h, lit(key));
    frame(ctx, b.x, b.y, b.w, b.h, '#0f1524');
  }
  const cx = pad.left.x + pad.left.w + (pad.right.x - pad.left.x - pad.left.w) / 2;
  const cy = pad.up.y + pad.up.h + (pad.down.y - pad.up.y - pad.up.h) / 2;
  rect(ctx, cx - 8, cy - 8, 16, 16, '#2b3a56');
  // arrow glyphs
  const tri = (b, dx, dy) => {
    ctx.fillStyle = '#101a2e';
    const mx = b.x + b.w / 2, my = b.y + b.h / 2;
    for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(mx + dx * i - (dy ? 4 - i : 0)), Math.round(my + dy * i - (dx ? 4 - i : 0)), dy ? (4 - i) * 2 + 1 : 1, dx ? (4 - i) * 2 + 1 : 1);
  };
  tri(pad.up, 0, -1); tri(pad.down, 0, 1); tri(pad.left, -1, 0); tri(pad.right, 1, 0);

  rect(ctx, pad.a.x, pad.a.y, pad.a.w, pad.a.h, held.has('enter') ? '#c9f24b' : '#7ad7ff');
  frame(ctx, pad.a.x, pad.a.y, pad.a.w, pad.a.h, '#0f1524');
  drawTextCentered(ctx, 'A', pad.a.x + pad.a.w / 2, pad.a.y + pad.a.h / 2 - 3, { color: '#0b1020' });
  rect(ctx, pad.b.x, pad.b.y, pad.b.w, pad.b.h, held.has('back') ? '#c9f24b' : '#ff6a3d');
  frame(ctx, pad.b.x, pad.b.y, pad.b.w, pad.b.h, '#0f1524');
  drawTextCentered(ctx, 'B', pad.b.x + pad.b.w / 2, pad.b.y + pad.b.h / 2 - 3, { color: '#0b1020' });
};

const operatorFig = (ctx, L, s, reduced) => {
  const { cx, headY, shoulderY } = L.operator;
  const bob = s.typing && !reduced ? Math.sin(performance.now() / 90) : 0;
  const sw = L.portrait ? 44 : 52;

  ctx.strokeStyle = '#f0c39a';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - sw + 8, shoulderY + 10); ctx.lineTo(s.handX, s.handY + 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + sw - 8, shoulderY + 10); ctx.lineTo(s.mouseHandX, L.mouse.y + 8); ctx.stroke();
  ctx.lineWidth = 1;

  rect(ctx, cx - 9, headY + 22 + bob, 18, 12, '#e0b48f');
  rect(ctx, cx - sw, shoulderY + bob, sw * 2, L.H - shoulderY, '#2a3550');
  rect(ctx, cx - sw + 2, shoulderY - 2 + bob, sw * 2 - 4, 3, '#35415f');
  rect(ctx, cx - 18, headY + bob, 36, 26, '#3b2a1e');
  rect(ctx, cx - 16, headY - 2 + bob, 32, 4, '#4a3626');
  rect(ctx, cx - 21, headY + 10 + bob, 3, 9, '#f0c39a');
  rect(ctx, cx + 18, headY + 10 + bob, 3, 9, '#f0c39a');

  rect(ctx, s.handX - 5, s.handY + (s.press ? 3 : 2), 11, 6, '#f7cfa8');
  rect(ctx, s.handX - 4, s.handY + (s.press ? 6 : 5), 3, 3, '#e0b48f');
  rect(ctx, s.handX + 1, s.handY + (s.press ? 6 : 5), 3, 3, '#e0b48f');
  rect(ctx, s.mouseHandX - 6, L.mouse.y + 4, 13, 8, '#f7cfa8');
};

export const drawScene = (ctx, L, s, t, held, reduced) => {
  const { W, H, bezel, screen, deskY } = L;
  rect(ctx, 0, 0, W, H, '#141a2b');
  rect(ctx, 0, 0, W, deskY, '#1a2136');
  for (let x = 0; x < W; x += 32) rect(ctx, x, 0, 1, deskY, '#1e2740');
  rect(ctx, 0, deskY - 4, W, 4, '#0f1524');
  rect(ctx, 0, deskY, W, H - deskY, '#3a2b20');
  rect(ctx, 0, deskY, W, 3, '#4d3a2a');
  const frontY = L.operator.shoulderY - 34;
  rect(ctx, 0, frontY, W, H - frontY, '#2c2018');
  rect(ctx, 0, frontY, W, 2, '#1d1510');

  // room dressing, placed against whichever wall space the layout leaves free
  if (!L.portrait) {
    rect(ctx, 14, 38, 38, 48, '#22304f'); frame(ctx, 14, 38, 38, 48, '#31406a');
    drawTextCentered(ctx, 'DEV', 33, 54, { color: '#c9f24b' });
    drawTextCentered(ctx, 'MODE', 33, 66, { color: '#7ad7ff' });
    rect(ctx, W - 40, deskY - 52, 22, 14, '#2f5a35');
    rect(ctx, W - 34, deskY - 38, 10, 38, '#5a4030');
  } else {
    // poster above the monitor
    const py = Math.max(6, bezel.y - 46);
    rect(ctx, 22, py, 44, 38, '#22304f'); frame(ctx, 22, py, 44, 38, '#31406a');
    drawTextCentered(ctx, 'DEV', 44, py + 10, { color: '#c9f24b' });
    drawTextCentered(ctx, 'MODE', 44, py + 22, { color: '#7ad7ff' });
    // wall shelf below the monitor fills the gap down to the desk
    const sy = Math.round((bezel.y + bezel.h + deskY) / 2) - 6;
    if (sy > bezel.y + bezel.h + 16 && sy < deskY - 26) {
      rect(ctx, 40, sy, W - 80, 4, '#4d3a2a');
      rect(ctx, 40, sy + 4, W - 80, 2, '#2c2018');
      rect(ctx, 54, sy - 18, 8, 18, '#7a3b2e');   // books
      rect(ctx, 64, sy - 22, 8, 22, '#2f5a35');
      rect(ctx, 74, sy - 15, 8, 15, '#c9a24b');
      rect(ctx, W - 96, sy - 14, 16, 14, '#2f5a35'); // plant
      rect(ctx, W - 92, sy - 22, 8, 9, '#3f7a4a');
      rect(ctx, W - 66, sy - 16, 14, 16, '#22304f'); // clock
      frame(ctx, W - 66, sy - 16, 14, 16, '#31406a');
      rect(ctx, W - 60, sy - 12, 2, 6, '#c9f24b');
    }
  }

  L.speakers.forEach((r) => speaker(ctx, r, s.level, t, reduced));

  rect(ctx, bezel.x + bezel.w / 2 - 32, bezel.y + bezel.h, 64, 10, '#1b2436');
  rect(ctx, bezel.x + bezel.w / 2 - 50, bezel.y + bezel.h + 8, 100, 4, '#232e46');
  rect(ctx, bezel.x, bezel.y, bezel.w, bezel.h, '#232e46');
  frame(ctx, bezel.x, bezel.y, bezel.w, bezel.h, '#0f1524');
  frame(ctx, bezel.x + 3, bezel.y + 3, bezel.w - 6, bezel.h - 6, '#38466a');
  rect(ctx, screen.x - 4, screen.y - 4, screen.w + 8, screen.h + 8, '#05070f');
  rect(ctx, bezel.x + 8, bezel.y + bezel.h - 9, 5, 5, '#c9f24b');
  if (bezel.w > 220) {
    drawText(ctx, 'AKASH-OS', bezel.x + bezel.w - textWidth('AKASH-OS') - 8, bezel.y + bezel.h - 10, { color: '#4d5f8a' });
  }

  keyboard(ctx, L.keys, s.litKey, s.press);
  mouseDev(ctx, L.mouse, s.mousePress);
  if (L.pad) gamepad(ctx, L.pad, W, held);
  operatorFig(ctx, L, s, reduced);
};
