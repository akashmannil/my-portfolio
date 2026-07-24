import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './three/responsive';

// how "wet"/frosted the glass reads per weather:
//  drip  = sliding rain-streak density   frost = edge condensation
//  beads = static condensation density   tint  = overall glass wash
const GLASS = {
  clear: { drip: 0, frost: 0.1, beads: 0.15, tint: 'rgba(200,220,240,0.03)' },
  clouds: { drip: 0, frost: 0.18, beads: 0.32, tint: 'rgba(190,205,225,0.05)' },
  fog: { drip: 0, frost: 0.44, beads: 0.6, tint: 'rgba(210,220,235,0.10)' },
  rain: { drip: 1, frost: 0.2, beads: 0.4, tint: 'rgba(180,205,235,0.06)' },
  storm: { drip: 1.4, frost: 0.26, beads: 0.45, tint: 'rgba(150,175,210,0.08)' },
  snow: { drip: 0.2, frost: 0.4, beads: 0.55, tint: 'rgba(215,225,240,0.09)' },
};

// a pane of glass between the viewer and the page: edge frost, a drifting
// reflection, and refractive water droplets — only in Live mode
const GlassView = ({ enabled, ambient }) => {
  const ref = useRef(null);
  const { weather, status } = ambient;

  useEffect(() => {
    if (!enabled || status === 'off') return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const cfg = GLASS[weather] || GLASS.clear;
    let w = 0;
    let h = 0;
    let raf = 0;
    let frost = null;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frost = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.22, w / 2, h * 0.5, Math.max(w, h) * 0.72);
      frost.addColorStop(0, 'rgba(233,240,250,0)');
      frost.addColorStop(1, `rgba(233,240,250,${cfg.frost * 0.5})`);
    };
    resize();
    window.addEventListener('resize', resize);

    // static condensation beads, biased toward the edges so the reading area stays clear
    const beads = [];
    for (let i = 0, n = Math.round(((w * h) / 26000) * cfg.beads); i < n; i++) {
      let x = Math.random() * w;
      let y = Math.random() * h;
      if (Math.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2)) < 0.5 && Math.random() < 0.72) {
        x = Math.random() * w;
        y = Math.random() * h;
      }
      beads.push({ x, y, r: 1.2 + Math.random() * 3.2 });
    }

    const drips = [];
    for (let i = 0, n = Math.round(((w * h) / 40000) * cfg.drip); i < n; i++) {
      drips.push({ x: Math.random() * w, y: Math.random() * h, r: 2.5 + Math.random() * 4.5, v: 0.6 + Math.random() * 1.6, trail: 24 + Math.random() * 64 });
    }

    const drawBead = (x, y, r) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(226,236,248,0.10)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(120,140,170,0.20)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - r * 0.32, y - r * 0.32, Math.max(0.6, r * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    };

    const frame = () => {
      const now = reduced ? 0 : performance.now();
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = cfg.tint;
      ctx.fillRect(0, 0, w, h);

      if (cfg.frost > 0) {
        ctx.fillStyle = frost;
        ctx.fillRect(0, 0, w, h);
      }

      if (!reduced) {
        const drift = (now * 0.018) % (w + 400);
        for (const [off, a] of [[0, 0.05], [w * 0.5, 0.03]]) {
          const gx = ((drift + off) % (w + 400)) - 200;
          const lg = ctx.createLinearGradient(gx - 150, 0, gx + 150, h);
          lg.addColorStop(0, 'rgba(255,255,255,0)');
          lg.addColorStop(0.5, `rgba(255,255,255,${a})`);
          lg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = lg;
          ctx.fillRect(0, 0, w, h);
        }
      }

      for (const b of beads) drawBead(b.x, b.y, b.r);

      for (const d of drips) {
        const tg = ctx.createLinearGradient(d.x, d.y - d.trail, d.x, d.y);
        tg.addColorStop(0, 'rgba(205,218,238,0)');
        tg.addColorStop(1, 'rgba(205,218,238,0.11)');
        ctx.fillStyle = tg;
        ctx.fillRect(d.x - d.r * 0.5, d.y - d.trail, d.r, d.trail);
        drawBead(d.x, d.y, d.r);
        if (!reduced) {
          d.v += 0.02;
          d.y += d.v;
          if (d.y - d.trail > h) {
            d.y = -Math.random() * 80;
            d.x = Math.random() * w;
            d.v = 0.6 + Math.random() * 1.5;
          }
        }
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, weather, status]);

  if (!enabled || status === 'off') return null;
  // over the page content, under the interactive UI (nav / progress / hotspot)
  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 z-20 pointer-events-none" />;
};

export default GlassView;
