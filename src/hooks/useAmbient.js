import { useCallback, useEffect, useRef, useState } from 'react';

// semantic theme tokens (mirrors the @theme block in index.css) that the
// ambient palettes override at runtime; clearing them reverts to the default
// dark theme
const TOKENS = ['ink', 'ink-soft', 'line', 'fog', 'paper', 'accent', 'ember', 'glacier'];

// selectable options for the manual override (order = clock order)
export const AMBIENT_PHASES = ['dawn', 'day', 'afternoon', 'dusk', 'night'];
export const AMBIENT_WEATHERS = ['clear', 'clouds', 'fog', 'rain', 'snow', 'storm'];

const LIGHT_PHASES = ['dawn', 'day', 'afternoon'];

// one palette per phase. Daylight palettes flip to dark-on-light and use
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
  afternoon: {
    ink: '#f7efdb', 'ink-soft': '#fffdf3', line: '#e6dabd', fog: '#7c7157',
    paper: '#1d1710', accent: '#5f8b0f', ember: '#d9541f', glacier: '#1f8ec8',
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

const phaseFromHour = (h) =>
  h < 5 ? 'night' : h < 8 ? 'dawn' : h < 12 ? 'day' : h < 17 ? 'afternoon' : h < 20 ? 'dusk' : 'night';

const isDayPhase = (p) => p !== 'night';

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
  s.colorScheme = LIGHT_PHASES.includes(name) ? 'light' : 'dark';
};

const clearPalette = () => {
  const s = document.documentElement.style;
  for (const t of TOKENS) s.removeProperty(`--color-${t}`);
  s.removeProperty('color-scheme');
};

const readManual = () => {
  try {
    const m = JSON.parse(localStorage.getItem('ambient-manual') || '{}');
    return {
      time: AMBIENT_PHASES.includes(m.time) ? m.time : 'auto',
      weather: AMBIENT_WEATHERS.includes(m.weather) ? m.weather : 'auto',
    };
  } catch {
    return { time: 'auto', weather: 'auto' };
  }
};

const OFF = { status: 'off', timeOfDay: 'night', weather: 'clear', isDay: false };

const useAmbient = () => {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('ambient') === 'on');
  const [manual, setManualState] = useState(readManual);
  const [ambient, setAmbient] = useState(OFF);
  const coords = useRef(null);
  const weather = useRef({ weather: 'clear', isDay: null, status: 'timeonly' });

  const { time: manualTime, weather: manualWeather } = manual;

  useEffect(() => {
    if (!enabled) {
      clearPalette();
      setAmbient(OFF);
      return;
    }
    let cancelled = false;
    const autoWeather = manualWeather === 'auto';

    const paint = () => {
      if (cancelled) return;
      const phase = manualTime !== 'auto' ? manualTime : phaseFromHour(new Date().getHours());
      applyPalette(phase);
      const w = weather.current;
      const eff = autoWeather ? w.weather : manualWeather;
      const isDay =
        manualTime !== 'auto'
          ? isDayPhase(phase)
          : w.isDay == null
            ? isDayPhase(phase)
            : w.isDay;
      setAmbient({ status: autoWeather ? w.status : 'ready', timeOfDay: phase, weather: eff, isDay });
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
    // only touch geolocation/network when weather is on Auto
    if (autoWeather && navigator.geolocation) {
      if (coords.current) {
        fetchWeather();
      } else {
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
    }

    const clock = setInterval(paint, 60 * 1000);
    const wx = autoWeather ? setInterval(fetchWeather, 10 * 60 * 1000) : null;
    return () => {
      cancelled = true;
      clearInterval(clock);
      if (wx) clearInterval(wx);
    };
  }, [enabled, manualTime, manualWeather]);

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      localStorage.setItem('ambient', next ? 'on' : 'off');
      return next;
    });
  }, []);

  const setManual = useCallback((partial) => {
    setManualState((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('ambient-manual', JSON.stringify(next));
      return next;
    });
  }, []);

  return { enabled, toggle, ambient, manual, setManual };
};

export default useAmbient;
