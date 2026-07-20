const DISCLAIMER =
  'Live mode is experimental and still in development. It mirrors your local time of day and weather using your location, running continuous 3D and canvas effects — a high-performance device is recommended.';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const statusLabel = (ambient) => {
  if (ambient.status === 'off') return 'Off';
  const where = ambient.status === 'timeonly' ? ' · time only' : '';
  return `${cap(ambient.timeOfDay)} · ${cap(ambient.weather)}${where}`;
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

const AmbientToggle = ({ variant = 'desktop', enabled, onToggle, ambient }) => {
  if (variant === 'mobile') {
    return (
      <div className="mt-4 pt-4 border-t border-line/50">
        <button
          onClick={onToggle}
          aria-pressed={enabled}
          className="flex w-full items-center justify-between"
        >
          <span className="font-mono text-sm uppercase tracking-[0.25em] text-paper">
            Live theme {enabled ? '☀' : '☾'}
          </span>
          <Switch on={enabled} />
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-fog/70">{DISCLAIMER}</p>
        {enabled && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {statusLabel(ambient)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative group hidden lg:block">
      <button
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label="Toggle live ambient theme"
        className="flex items-center gap-2"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog group-hover:text-paper transition-colors duration-300">
          Live
        </span>
        <Switch on={enabled} />
      </button>
      <div className="pointer-events-none absolute right-0 top-full mt-3 w-64 rounded-xl border border-line bg-ink/95 backdrop-blur-md p-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
        <p className="text-[11px] leading-relaxed text-fog">{DISCLAIMER}</p>
        {enabled && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {statusLabel(ambient)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AmbientToggle;
