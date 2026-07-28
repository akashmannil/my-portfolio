import { useCallback, useEffect, useRef, useState } from 'react';
import { createGame, describeGame, drawGame, updateGame } from './game';
import { GAME_H, GAME_W, computeLayout, drawScene } from './scene';
import { decaySound, isMuted, play, setMuted, soundLevel } from './audio';
import { setViewMode } from '../hooks/useViewMode';

const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  Enter: 'enter', Space: 'enter', Escape: 'back', Backspace: 'back',
};

const ArcadeView = () => {
  const canvas = useRef(null);
  const api = useRef(null);
  const [muted, setMutedState] = useState(isMuted());
  const [pad, setPad] = useState(null);
  const [rect, setRect] = useState({ w: 0, h: 0, sx: 1, ox: 0, oy: 0 });
  const [say, setSay] = useState('');

  useEffect(() => {
    const view = canvas.current;
    const ctx = view.getContext('2d');
    const buf = document.createElement('canvas');
    buf.width = GAME_W;
    buf.height = GAME_H;
    const bctx = buf.getContext('2d');
    bctx.imageSmoothingEnabled = false;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 900;

    const g = createGame(GAME_W, GAME_H);
    g.touch = coarse;
    const held = new Set();
    const edges = new Set();
    let L = computeLayout(innerWidth, innerHeight, coarse);
    const st = { litKey: -1, press: false, typing: 0, mousePress: false, level: 0, handX: 0, handY: 0, mouseHandX: 0 };
    const hand = { x: 0, y: 0, mouseX: 0 };

    const applyLayout = () => {
      L = computeLayout(innerWidth, innerHeight, coarse);
      view.width = L.W;
      view.height = L.H;
      ctx.imageSmoothingEnabled = false;
      hand.x = L.keys.x + L.keys.w / 2;
      hand.y = L.keys.y;
      hand.mouseX = L.mouse.x + L.mouse.w / 2;
      // CSS box the canvas actually occupies, so DOM buttons can align to it
      const s = Math.min(innerWidth / L.W, innerHeight / L.H);
      setRect({ w: L.W * s, h: L.H * s, sx: s, ox: (innerWidth - L.W * s) / 2, oy: (innerHeight - L.H * s) / 2 });
      setPad(L.pad);
    };
    applyLayout();
    st.handX = hand.x; st.handY = hand.y; st.mouseHandX = hand.mouseX;

    const pressAction = (a, on) => {
      if (on) {
        if (!held.has(a)) edges.add(a);
        held.add(a);
        st.press = true;
        st.typing = 0.25;
        const idx = { left: 30, right: 33, up: 18, down: 32, enter: 45, back: 0 }[a] ?? 20;
        st.litKey = idx;
        const cols = 14;
        hand.x = L.keys.x + 4 + (idx % cols) * ((L.keys.w - 8) / cols);
        hand.y = L.keys.y + 3 + Math.floor(idx / cols) * ((L.keys.h - 6) / 4);
        play('key');
      } else {
        held.delete(a);
        st.press = false;
        st.litKey = -1;
      }
    };
    api.current = { pressAction };

    const onDown = (e) => {
      const a = KEYMAP[e.code];
      if (!a) return;
      e.preventDefault();
      pressAction(a, true);
    };
    const onUp = (e) => {
      const a = KEYMAP[e.code];
      if (a) pressAction(a, false);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('resize', applyLayout);

    const toView = (e) => {
      const r = view.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * L.W, y: ((e.clientY - r.top) / r.height) * L.H };
    };
    const onMove = (e) => {
      const p = toView(e);
      hand.mouseX = Math.max(L.mouse.x - 6, Math.min(L.mouse.x + L.mouse.w + 6, L.mouse.x + (p.x / L.W) * L.mouse.w));
    };
    const onPointer = (e) => {
      const p = toView(e);
      st.mousePress = true;
      setTimeout(() => (st.mousePress = false), 130);
      if (p.x > L.screen.x && p.x < L.screen.x + L.screen.w && p.y > L.screen.y && p.y < L.screen.y + L.screen.h) {
        edges.add('enter');
        play('select');
      }
    };
    view.addEventListener('pointermove', onMove);
    view.addEventListener('pointerdown', onPointer);

    let raf = 0;
    let prev = performance.now();
    let lastSaid = '';
    const loop = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      st.typing = Math.max(0, st.typing - dt);
      decaySound(dt);
      st.level = soundLevel();
      const k = Math.min(1, dt * 14);
      st.handX += (hand.x - st.handX) * k;
      st.handY += (hand.y - st.handY) * k;
      st.mouseHandX += (hand.mouseX - st.mouseHandX) * Math.min(1, dt * 10);

      updateGame(g, {
        left: held.has('left'), right: held.has('right'), up: held.has('up'), down: held.has('down'),
        leftEdge: edges.has('left'), rightEdge: edges.has('right'), upEdge: edges.has('up'), downEdge: edges.has('down'),
        enterEdge: edges.has('enter'), backEdge: edges.has('back'), any: edges.size > 0,
      }, dt);
      edges.clear();

      drawGame(bctx, g);
      if (!reduced) {
        bctx.globalAlpha = 0.16;
        bctx.fillStyle = '#000';
        for (let y = 0; y < GAME_H; y += 2) bctx.fillRect(0, y, GAME_W, 1);
        bctx.globalAlpha = 1;
      }
      drawScene(ctx, L, st, now / 1000, held, reduced);
      ctx.drawImage(buf, L.screen.x, L.screen.y, L.screen.w, L.screen.h);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#7ad7ff';
      ctx.fillRect(L.screen.x - 6, L.screen.y - 6, L.screen.w + 12, L.screen.h + 12);
      ctx.globalAlpha = 1;

      const text = describeGame(g);
      if (text !== lastSaid) { lastSaid = text; setSay(text); }

      raf = requestAnimationFrame(loop);
    };
    play('boot');
    raf = requestAnimationFrame(loop);

    if (import.meta.env.DEV) window.__arcadeGoto = (m) => { g.mode = m; g.sel = 0; g.t = 0; };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('resize', applyLayout);
      view.removeEventListener('pointermove', onMove);
      view.removeEventListener('pointerdown', onPointer);
      if (import.meta.env.DEV) delete window.__arcadeGoto;
    };
  }, []);

  const hold = useCallback((key, on) => (e) => {
    e.preventDefault();
    api.current?.pressAction(key, on);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) play('select');
  };

  const btnStyle = (b) => ({
    left: rect.ox + b.x * rect.sx,
    top: rect.oy + b.y * rect.sx,
    width: b.w * rect.sx,
    height: b.h * rect.sx,
  });

  return (
    <div className="fixed inset-0 bg-[#0b0e17] overflow-hidden touch-none select-none">
      <canvas
        ref={canvas}
        role="img"
        aria-label="Pixel workstation showing the portfolio as a game on a CRT monitor"
        className="w-full h-full object-contain [image-rendering:pixelated]"
      />

      {/* real controls sitting exactly over the drawn gamepad: touch targets,
          keyboard focus and screen-reader labels for a canvas-only scene */}
      {pad &&
        ['up', 'down', 'left', 'right', 'a', 'b'].map((id) => {
          const b = pad[id];
          return (
            <button
              key={id}
              aria-label={b.label}
              onPointerDown={hold(b.key, true)}
              onPointerUp={hold(b.key, false)}
              onPointerLeave={hold(b.key, false)}
              onPointerCancel={hold(b.key, false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') api.current?.pressAction(b.key, true); }}
              onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') api.current?.pressAction(b.key, false); }}
              className="absolute rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9f24b]"
              style={btnStyle(b)}
            />
          );
        })}

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={toggleMute}
          aria-pressed={!muted}
          className="font-mono text-[10px] uppercase tracking-[0.2em] border-2 border-[#42557a] bg-[#1b2436] text-[#c9f24b] px-3 py-2 min-h-11 hover:bg-[#22304f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9f24b]"
        >
          {muted ? 'Sound Off' : 'Sound On'}
        </button>
        <button
          onClick={() => setViewMode('standard')}
          className="font-mono text-[10px] uppercase tracking-[0.2em] border-2 border-[#42557a] bg-[#1b2436] text-[#e8f0ff] px-3 py-2 min-h-11 hover:bg-[#22304f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9f24b]"
        >
          Exit Arcade
        </button>
      </div>

      <p className="absolute top-3 left-3 max-w-[46%] font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d5f8a]">
        {pad ? 'Tap the pad · A select · B back' : 'Arrows / WASD · Enter select · Esc back'}
      </p>

      <p aria-live="polite" className="sr-only">{say}</p>
    </div>
  );
};

export default ArcadeView;
