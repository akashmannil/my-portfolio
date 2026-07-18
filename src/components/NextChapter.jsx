import { tabs } from '../constants';

const NextChapter = ({ current, onSelect, className = '' }) => {
  const next = tabs[(tabs.findIndex((t) => t.id === current) + 1) % tabs.length];
  return (
    <button
      onClick={() => onSelect(next.id)}
      className={`group flex items-center gap-4 ${className}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-fog group-hover:text-paper transition-colors duration-300">
        Next — {next.label}
      </span>
      <span className="block w-16 h-px bg-line relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1/3 bg-accent animate-pulse" />
      </span>
    </button>
  );
};

export default NextChapter;
