import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './three/responsive';

// canvas backdrop (behind page content, over the 3D stage) that paints a
// sun/moon plus live precipitation, driven by the ambient weather state
const AmbientSky = ({ enabled, ambient }) => {
  const ref = useRef(null);
  const { weather, isDay, status, timeOfDay } = ambient;

  useEffect(() => {
    if (!enabled || status === 'off') return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // precipitation needs opposite contrast on the light daytime palettes
    const lightBg = timeOfDay === 'day' || timeOfDay === 'dawn';
    const rainColor = lightBg ? 'rgba(58,92,132,0.5)' : 'rgba(168,198,228,0.42)';
    const snowColor = lightBg ? 'rgba(92,112,148,0.8)' : 'rgba(242,246,255,0.82)';
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const scaled = (density) => Math.round(((w * h) / 24000) * density);
    const rain = [];
    const snow = [];
    if (!reduced && (weather === 'rain' || weather === 'storm')) {
      for (let i = 0, n = scaled(weather === 'storm' ? 1.5 : 1); i < n; i++) {
        rain.push({ x: Math.random() * w, y: Math.random() * h, l: 9 + Math.random() * 13, v: 7 + Math.random() * 6 });
      }
    }
    if (!reduced && weather === 'snow') {
      for (let i = 0, n = scaled(0.8); i < n; i++) {
        snow.push({ x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 2.2, v: 0.5 + Math.random() * 1.1, p: Math.random() * Math.PI * 2 });
      }
    }

    const paintOrb = () => {
      const cx = w * 0.8;
      const cy = h * 0.2;
      const R = Math.min(w, h) * 0.1;
      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.6);
      if (isDay) {
        halo.addColorStop(0, 'rgba(255,244,205,0.85)');
        halo.addColorStop(0.28, 'rgba(255,212,120,0.4)');
        halo.addColorStop(1, 'rgba(255,212,120,0)');
      } else {
        halo.addColorStop(0, 'rgba(214,228,255,0.55)');
        halo.addColorStop(0.32, 'rgba(150,180,230,0.22)');
        halo.addColorStop(1, 'rgba(150,180,230,0)');
      }
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isDay ? 'rgba(255,238,178,0.95)' : 'rgba(228,234,247,0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
    };

    const paintVeil = () => {
      if (weather === 'clouds' || weather === 'storm') ctx.fillStyle = 'rgba(120,126,140,0.12)';
      else if (weather === 'fog') ctx.fillStyle = 'rgba(184,188,198,0.14)';
      else return;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      paintVeil();
      paintOrb();
      if (rain.length) {
        ctx.strokeStyle = rainColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const d of rain) {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 1.6, d.y + d.l);
          d.y += d.v;
          d.x -= 0.5;
          if (d.y > h) {
            d.y = -d.l;
            d.x = Math.random() * w;
          }
        }
        ctx.stroke();
      }
      if (snow.length) {
        ctx.fillStyle = snowColor;
        for (const f of snow) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
          f.y += f.v;
          f.p += 0.02;
          f.x += Math.sin(f.p) * 0.6;
          if (f.y > h) {
            f.y = -f.r;
            f.x = Math.random() * w;
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      ctx.clearRect(0, 0, w, h);
      paintVeil();
      paintOrb();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, weather, isDay, status, timeOfDay]);

  if (!enabled || status === 'off') return null;
  // sits behind the 3D stage (z-[1]) so the models read in the foreground
  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />;
};

export default AmbientSky;
