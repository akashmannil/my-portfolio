import { drawText, drawTextCentered, textWidth } from './pixelFont';
import { isMuted } from './audio';

// The room the monitor sits in. Everything is drawn as flat pixel rects on the
// low-res buffer, so it stays a true pixel scene at any scale.
export const VIEW_W = 512;
// tall enough that the operator's shoulders clear the keyboard row, so the
// forearms stay visible rising past the head instead of being occluded by it
export const VIEW_H = 320;

// where the game is rendered inside the CRT
export const SCREEN = { x: 118, y: 30, w: 276, h: 152 };
const BEZEL = { x: 106, y: 18, w: 300, h: 176 };
const KEYS = { x: 168, y: 214, w: 176, h: 30 };
const MOUSE = { x: 362, y: 218, w: 22, h: 26 };

const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };
const frame = (ctx, x, y, w, h, c) => {
  rect(ctx, x, y, w, 1, c); rect(ctx, x, y + h - 1, w, 1, c);
  rect(ctx, x, y, 1, h, c); rect(ctx, x + w - 1, y, 1, h, c);
};

const speaker = (ctx, x, y, lvl, t) => {
  rect(ctx, x, y, 34, 66, '#241d17');
  frame(ctx, x, y, 34, 66, '#3b2f24');
  rect(ctx, x + 3, y + 3, 28, 30, '#151011');
  const r = 9 + lvl * 2.5;
  ctx.fillStyle = '#3a2c22';
  ctx.beginPath(); ctx.arc(x + 17, y + 18, r, 0, 7); ctx.fill();
  ctx.fillStyle = lvl > 0.05 ? '#c9f24b' : '#5c4a38';
  ctx.beginPath(); ctx.arc(x + 17, y + 18, 3 + lvl * 2, 0, 7); ctx.fill();
  rect(ctx, x + 5, y + 40, 24, 18, '#151011');
  for (let i = 0; i < 6; i++) rect(ctx, x + 7 + i * 4, y + 44, 2, 10, i / 6 < lvl ? '#c9f24b' : '#2b2119');
  // anime-style sound arcs
  if (lvl > 0.08 && !isMuted()) {
    for (let a = 0; a < 3; a++) {
      const p = ((t * 1.6 + a * 0.33) % 1);
      ctx.globalAlpha = (1 - p) * lvl;
      ctx.strokeStyle = '#c9f24b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x + 17, y + 18, 12 + p * 26, -0.9, 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 17, y + 18, 12 + p * 26, Math.PI - 0.9, Math.PI + 0.9);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
};

const keyboard = (ctx, litKey, press) => {
  const { x, y, w, h } = KEYS;
  rect(ctx, x - 2, y - 2, w + 4, h + 6, '#1b2436');
  rect(ctx, x, y, w, h, '#2b3a56');
  frame(ctx, x - 2, y - 2, w + 4, h + 6, '#0f1524');
  let i = 0;
  for (let r = 0; r < 4; r++) {
    const cols = r === 3 ? 5 : 14;
    for (let c = 0; c < cols; c++) {
      const kw = r === 3 && c === 2 ? 46 : 10;
      const kx = x + 4 + (r === 3 ? (c < 2 ? c * 12 : c === 2 ? 24 : 74 + (c - 3) * 12) : c * 12);
      const ky = y + 3 + r * 7;
      const on = litKey === i;
      rect(ctx, kx, ky + (on && press ? 1 : 0), kw, 5, on ? '#c9f24b' : '#42557a');
      i++;
    }
  }
};

const mouse = (ctx, press) => {
  const { x, y, w, h } = MOUSE;
  rect(ctx, x, y + 2, w, h - 2, '#2b3a56');
  frame(ctx, x, y + 2, w, h - 2, '#0f1524');
  rect(ctx, x + 2, y + 4, 8, 8, press ? '#c9f24b' : '#42557a');
  rect(ctx, x + 12, y + 4, 8, 8, '#42557a');
  rect(ctx, x + 10, y + 5, 2, 5, '#63789f');
};

// over-the-shoulder pixel operator: head + shoulders at the bottom edge, arms
// reaching up to whichever peripheral is being used
const operator = (ctx, handX, handY, mouseHandX, typing, press) => {
  const cx = VIEW_W / 2;
  const bob = typing ? Math.sin(performance.now() / 90) * 1 : 0;

  // arms first so they emerge from behind the body instead of crossing the head
  ctx.strokeStyle = '#f0c39a';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - 44, 306); ctx.lineTo(handX, handY + 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 44, 306); ctx.lineTo(mouseHandX, 230); ctx.stroke();
  ctx.lineWidth = 1;

  rect(ctx, cx - 9, 286 + bob, 18, 12, '#e0b48f');        // neck
  rect(ctx, cx - 52, 296 + bob, 104, 24, '#2a3550');      // shoulders
  rect(ctx, cx - 50, 294 + bob, 100, 3, '#35415f');
  rect(ctx, cx - 18, 264 + bob, 36, 26, '#3b2a1e');       // back of head
  rect(ctx, cx - 16, 262 + bob, 32, 4, '#4a3626');        // crown highlight
  rect(ctx, cx - 21, 274 + bob, 3, 9, '#f0c39a');         // ears
  rect(ctx, cx + 18, 274 + bob, 3, 9, '#f0c39a');

  // hands sit on top of the peripherals
  rect(ctx, handX - 5, handY + (press ? 3 : 2), 11, 6, '#f7cfa8');
  rect(ctx, handX - 4, handY + (press ? 6 : 5), 3, 3, '#e0b48f');
  rect(ctx, handX + 1, handY + (press ? 6 : 5), 3, 3, '#e0b48f');
  rect(ctx, mouseHandX - 6, 226, 13, 8, '#f7cfa8');
};

export const drawScene = (ctx, s, t) => {
  // room
  rect(ctx, 0, 0, VIEW_W, VIEW_H, '#141a2b');
  rect(ctx, 0, 0, VIEW_W, 200, '#1a2136');
  for (let x = 0; x < VIEW_W; x += 32) rect(ctx, x, 0, 1, 200, '#1e2740');
  rect(ctx, 0, 198, VIEW_W, 4, '#0f1524');
  rect(ctx, 0, 202, VIEW_W, VIEW_H - 202, '#3a2b20');   // desk
  rect(ctx, 0, 202, VIEW_W, 3, '#4d3a2a');
  rect(ctx, 0, 262, VIEW_W, VIEW_H - 262, '#2c2018');   // desk front edge / shadow
  rect(ctx, 0, 262, VIEW_W, 2, '#1d1510');
  // poster + plant for room dressing
  rect(ctx, 34, 40, 40, 52, '#22304f'); frame(ctx, 34, 40, 40, 52, '#31406a');
  drawTextCentered(ctx, 'DEV', 54, 60, { color: '#c9f24b' });
  drawTextCentered(ctx, 'MODE', 54, 72, { color: '#7ad7ff' });
  rect(ctx, 452, 150, 22, 14, '#2f5a35'); rect(ctx, 458, 164, 10, 38, '#5a4030');

  speaker(ctx, 58, 128, s.level, t);
  speaker(ctx, 420, 128, s.level, t);

  // monitor
  rect(ctx, BEZEL.x + 118, 190, 64, 12, '#1b2436');
  rect(ctx, BEZEL.x + 100, 200, 100, 4, '#232e46');
  rect(ctx, BEZEL.x, BEZEL.y, BEZEL.w, BEZEL.h, '#232e46');
  frame(ctx, BEZEL.x, BEZEL.y, BEZEL.w, BEZEL.h, '#0f1524');
  frame(ctx, BEZEL.x + 3, BEZEL.y + 3, BEZEL.w - 6, BEZEL.h - 6, '#38466a');
  rect(ctx, SCREEN.x - 4, SCREEN.y - 4, SCREEN.w + 8, SCREEN.h + 8, '#05070f');
  rect(ctx, BEZEL.x + 8, BEZEL.y + BEZEL.h - 9, 5, 5, s.power ? '#c9f24b' : '#4a3d2a');
  drawText(ctx, 'AKASH-OS', BEZEL.x + BEZEL.w - textWidth('AKASH-OS') - 8, BEZEL.y + BEZEL.h - 10, { color: '#4d5f8a' });

  keyboard(ctx, s.litKey, s.press);
  mouse(ctx, s.mousePress);
  operator(ctx, s.handX, s.handY, s.mouseHandX, s.typing, s.press);
};

export const KEY_AREA = KEYS;
export const MOUSE_AREA = MOUSE;
