import { useEffect, useRef, useState } from 'react';
import { AMBIENT_PHASES, AMBIENT_WEATHERS } from '../hooks/useAmbient';

const DISCLAIMER =
  'Live mode is experimental and still in development. It mirrors your local time of day and weather using your location, running continuous 3D and canvas effects — a high-performance device is recommended.';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const statusLabel = (ambient, manual) => {
  const auto = manual.time === 'auto' && manual.weather === 'auto';
  const suffix = !auto ? ' · manual' : ambient.status === 'timeonly' ? ' · time only' : ' · auto';
  return `${cap(ambient.timeOfDay)} · ${cap(ambient.weather)}${suffix}`;
};

const Switch = ({ on }) => (
  <span
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-300 ${
      on ? 'border-accent bg-accent/80' : 'border-line bg-transparent'
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full transition-transform duration-300 ${
        on ? 'translate-x-4 bg-ink' : 'translate-x-[3px] bg-fog'
      }`}
    />
  </span>
);

const Field = ({ label, value, options, onChange }) => (
  <label className="flex items-center justify-between gap-3">
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-ink-soft border border-line rounded-md px-2 py-1 font-mono text-[11px] text-paper focus:outline-none focus:border-accent"
    >
      <option value="auto">Auto</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {cap(o)}
        </option>
      ))}
    </select>
  </label>
);

const Controls = ({ enabled, onToggle, ambient, manual, onManualChange }) => (
  <div className="space-y-3">
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      className="flex w-full items-center justify-between"
    >
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-paper">
        Live theme {enabled ? '☀' : '☾'}
      </span>
      <Switch on={enabled} />
    </button>
    <p className="text-[11px] leading-relaxed text-fog/70">{DISCLAIMER}</p>
    {enabled && (
      <div className="space-y-2 pt-1">
        <Field label="Time" value={manual.time} options={AMBIENT_PHASES} onChange={(v) => onManualChange({ time: v })} />
        <Field label="Weather" value={manual.weather} options={AMBIENT_WEATHERS} onChange={(v) => onManualChange({ weather: v })} />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent pt-1">
          {statusLabel(ambient, manual)}
        </p>
      </div>
    )}
  </div>
);

const DesktopToggle = ({ enabled, onToggle, ambient, manual, onManualChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Live ambient settings"
        className="group flex items-center gap-2"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog group-hover:text-paper transition-colors duration-300">
          Live
        </span>
        <span
          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
            enabled ? 'bg-accent' : 'bg-line group-hover:bg-fog'
          }`}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-72 rounded-xl border border-line bg-ink/95 backdrop-blur-md p-4 z-50 shadow-xl shadow-black/20">
          <Controls
            enabled={enabled}
            onToggle={onToggle}
            ambient={ambient}
            manual={manual}
            onManualChange={onManualChange}
          />
        </div>
      )}
    </div>
  );
};

const AmbientToggle = ({ variant = 'desktop', ...props }) =>
  variant === 'mobile' ? (
    <div className="mt-4 pt-4 border-t border-line/50">
      <Controls {...props} />
    </div>
  ) : (
    <DesktopToggle {...props} />
  );

export default AmbientToggle;
