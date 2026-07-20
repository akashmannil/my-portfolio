import { useCallback, useEffect, useRef, useState } from 'react';

// semantic theme tokens (mirrors the @theme block in index.css) that the
// ambient palettes override at runtime; clearing them reverts to the default
// dark theme
const TOKENS = ['ink', 'ink-soft', 'line', 'fog', 'paper', 'accent', 'ember', 'glacier'];

// one palette per time-of-day. Daylight palettes flip to dark-on-light and use
// deeper accent hues so lime/orange/blue stay legible on pale backgrounds.
const PALETTES = {
  dawn: {
    ink: '#f3e8e1', 'ink-soft': '#fffaf5', line: '#e7d4c9', fog: '#8b7367',
    paper: '#2b1d16', accent: '#5f8b0f', ember: '#d9541f', glacier: '#1f8ec8',
  },
  day: {
    ink: '#f4f1ea', 'ink-soft': '#ffffff', line: '#dbd6c9', fog: '#6c6c74',
    paper: '#17171b', accent: '#5f8b0f', ember: '#d9541f', glacier: '#1f8ec8',
  },
  dusk: {
    ink: '#17111e', 'ink-soft': '#211829', line: '#382a43', fog: '#b6a0ad',
    paper: '#f7ede6', accent: '#c9f24b', ember: '#ff7a4d', glacier: '#9a8cff',
  },
  night: {
    ink: '#050507', 'ink-soft': '#0d0d12', line: '#26262e', fog: '#9b9ba6',
    paper: '#f4f2ec', accent: '#c9f24b', ember: '#ff6a3d', glacier: '#7ad7ff',
  },
};

const timeOfDay = (h) =>
  h < 5 ? 'night' : h < 8 ? 'dawn' : h < 17 ? 'day' : h < 20 ? 'dusk' : 'night';

// Open-Meteo WMO weather codes → the effect categories AmbientSky draws
const weatherFromCode = (code) => {
  if (code == null) return 'clear';
  if (code <= 1) return 'clear';
  if (code <= 3) return 'clouds';
  if (code === 45 || code === 48) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain';
};

const applyPalette = (name) => {
  const p = PALETTES[name];
  const s = document.documentElement.style;
  for (const t of TOKENS) s.setProperty(`--color-${t}`, p[t]);
  s.colorScheme = name === 'day' || name === 'dawn' ? 'light' : 'dark';
};

const clearPalette = () => {
  const s = document.documentElement.style;
  for (const t of TOKENS) s.removeProperty(`--color-${t}`);
  s.removeProperty('color-scheme');
};

const OFF = { status: 'off', timeOfDay: 'night', weather: 'clear', isDay: false };

const useAmbient = () => {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('ambient') === 'on');
  const [ambient, setAmbient] = useState(OFF);
  const coords = useRef(null);
  const weather = useRef({ weather: 'clear', isDay: null, status: 'timeonly' });

  useEffect(() => {
    if (!enabled) {
      clearPalette();
      setAmbient(OFF);
      return;
    }
    let cancelled = false;

    const paint = () => {
      if (cancelled) return;
      const tod = timeOfDay(new Date().getHours());
      applyPalette(tod);
      const w = weather.current;
      setAmbient({
        status: w.status,
        timeOfDay: tod,
        weather: w.weather,
        isDay: w.isDay == null ? tod !== 'night' : w.isDay,
      });
    };

    const fetchWeather = async () => {
      if (!coords.current) return;
      try {
        const { lat, lon } = coords.current;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,is_day`
        );
        if (!res.ok) throw new Error(`weather ${res.status}`);
        const d = await res.json();
        weather.current = {
          weather: weatherFromCode(d.current?.weather_code),
          isDay: d.current?.is_day === 1,
          status: 'ready',
        };
      } catch {
        weather.current = { ...weather.current, status: 'timeonly' };
      }
      paint();
    };

    paint();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // round to ~1km — enough for weather, avoids storing precise coords
          coords.current = {
            lat: pos.coords.latitude.toFixed(2),
            lon: pos.coords.longitude.toFixed(2),
          };
          fetchWeather();
        },
        () => {},
        { timeout: 8000, maximumAge: 10 * 60 * 1000 }
      );
    }

    const clock = setInterval(paint, 60 * 1000);
    const wx = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(clock);
      clearInterval(wx);
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      localStorage.setItem('ambient', next ? 'on' : 'off');
      return next;
    });
  }, []);

  return { enabled, toggle, ambient };
};

export default useAmbient;
