import { useEffect, useRef, useState } from 'react';
import { createGame, drawGame, updateGame } from './game';
import { KEY_AREA, SCREEN, VIEW_H, VIEW_W, drawScene } from './scene';
import { decaySound, isMuted, play, setMuted, soundLevel } from './audio';
import { setViewMode } from '../hooks/useViewMode';

const CRT = (ctx, w, h) => {
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#000';
  for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 1);
  ctx.globalAlpha = 1;
};

const ArcadeView = () => {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const screen = useRef(null);
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => {
    const view = canvas.current;
    const ctx = view.getContext('2d');
    const sc = document.createElement('canvas');
    sc.width = SCREEN.w;
    sc.height = SCREEN.h;
    const sctx = sc.getContext('2d');
    screen.current = sc;
    view.width = VIEW_W;
    view.height = VIEW_H;
    ctx.imageSmoothingEnabled = false;
    sctx.imageSmoothingEnabled = false;

    const g = createGame(SCREEN.w, SCREEN.h);
    const held = new Set();
    const edges = new Set();
    const hand = { x: KEY_AREA.x + KEY_AREA.w / 2, y: KEY_AREA.y, mouseX: 374 };
    const st = { litKey: -1, press: false, typing: 0, mousePress: false, power: true, level: 0, handX: hand.x, handY: hand.y, mouseHandX: hand.mouseX };

    const KEYMAP = {
      ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
      ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
      Enter: 'enter', Space: 'enter', Escape: 'back', Backspace: 'back',
    };

    const onDown = (e) => {
      const a = KEYMAP[e.code];
      if (!a) return;
      e.preventDefault();
      if (!held.has(a)) edges.add(a);
      held.add(a);
      st.litKey = Math.abs(e.code.charCodeAt(e.code.length - 1) * 7) % 44;
      st.press = true;
      st.typing = 0.25;
      hand.x = KEY_AREA.x + 8 + (st.litKey % 14) * 12;
      hand.y = KEY_AREA.y + 3 + Math.floor(st.litKey / 14) * 7;
      play('key');
    };
    const onUp = (e) => {
      const a = KEYMAP[e.code];
      if (a) held.delete(a);
      st.press = false;
      st.litKey = -1;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    // pointer over the CRT maps into game coords and nudges the mouse hand
    const toView = (e) => {
      const r = view.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * VIEW_W, y: ((e.clientY - r.top) / r.height) * VIEW_H };
    };
    const onMove = (e) => {
      const p = toView(e);
      st.mouseHandX = Math.max(352, Math.min(400, 362 + (p.x / VIEW_W) * 26));
      hand.mouseX = st.mouseHandX;
    };
    const onClick = (e) => {
      const p = toView(e);
      st.mousePress = true;
      setTimeout(() => (st.mousePress = false), 130);
      play('select');
      // clicking the screen acts as ENTER so the view is usable without a keyboard
      if (p.x > SCREEN.x && p.x < SCREEN.x + SCREEN.w && p.y > SCREEN.y && p.y < SCREEN.y + SCREEN.h) {
        edges.add('enter');
      }
    };
    view.addEventListener('pointermove', onMove);
    view.addEventListener('pointerdown', onClick);

    let raf = 0;
    let prev = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      st.typing = Math.max(0, st.typing - dt);
      decaySound(dt);
      st.level = soundLevel();
      st.handX += (hand.x - st.handX) * Math.min(1, dt * 14);
      st.handY += (hand.y - st.handY) * Math.min(1, dt * 14);
      st.mouseHandX += (hand.mouseX - st.mouseHandX) * Math.min(1, dt * 10);

      const input = {
        left: held.has('left'), right: held.has('right'), up: held.has('up'), down: held.has('down'),
        leftEdge: edges.has('left'), rightEdge: edges.has('right'), upEdge: edges.has('up'), downEdge: edges.has('down'),
        enterEdge: edges.has('enter'), backEdge: edges.has('back'), any: edges.size > 0,
      };
      updateGame(g, input, dt);
      edges.clear();

      drawGame(sctx, g);
      CRT(sctx, SCREEN.w, SCREEN.h);
      drawScene(ctx, st, now / 1000);
      ctx.drawImage(sc, SCREEN.x, SCREEN.y);
      // screen glow spill onto the bezel
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#7ad7ff';
      ctx.fillRect(SCREEN.x - 6, SCREEN.y - 6, SCREEN.w + 12, SCREEN.h + 12);
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(loop);
    };
    play('boot');
    raf = requestAnimationFrame(loop);

    // dev-only handle so the panels can be driven deterministically in tests
    if (import.meta.env.DEV) {
      window.__arcadeGoto = (mode) => { g.mode = mode; g.sel = 0; g.t = 0; };
    }

    return () => {
      cancelAnimationFrame(raf);
      if (import.meta.env.DEV) delete window.__arcadeGoto;
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      view.removeEventListener('pointermove', onMove);
      view.removeEventListener('pointerdown', onClick);
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) play('select');
  };

  return (
    <div ref={wrap} className="fixed inset-0 bg-[#0b0e17] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvas}
        className="w-full h-full object-contain [image-rendering:pixelated]"
        aria-label="Pixel arcade portfolio: walk to a station and press Enter"
      />
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={toggleMute}
          className="font-mono text-[10px] uppercase tracking-[0.2em] border-2 border-[#42557a] bg-[#1b2436] text-[#c9f24b] px-3 py-2 hover:bg-[#22304f]"
        >
          {muted ? 'Sound Off' : 'Sound On'}
        </button>
        <button
          onClick={() => setViewMode('standard')}
          className="font-mono text-[10px] uppercase tracking-[0.2em] border-2 border-[#42557a] bg-[#1b2436] text-[#e8f0ff] px-3 py-2 hover:bg-[#22304f]"
        >
          Exit Arcade
        </button>
      </div>
      <p className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d5f8a]">
        Arrows / WASD move · Enter select · Esc back
      </p>
    </div>
  );
};

export default ArcadeView;
