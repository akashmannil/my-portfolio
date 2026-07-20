import { useCallback, useEffect, useState } from 'react';
import { tabs } from '../constants';

const NAV_OFFSET = 90;

// the next section to scroll to on this page, or null when the reader has
// reached the end and the control should cross to the next tab instead
const findNextStop = () => {
  const doc = document.documentElement;
  const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
  if (atBottom) return null;
  const stops = [...document.querySelectorAll('[data-scroll-stop]')];
  return stops.find((el) => el.getBoundingClientRect().top > window.innerHeight * 0.55) || null;
};

const TabProgress = ({ activeTab, onSelect }) => {
  const index = tabs.findIndex((t) => t.id === activeTab);
  const isLast = index === tabs.length - 1;
  const next = tabs[(index + 1) % tabs.length];
  const showNext = activeTab !== 'experience';

  const [stopLabel, setStopLabel] = useState(null);

  const recompute = useCallback(() => {
    const stop = findNextStop();
    setStopLabel(stop ? stop.dataset.scrollLabel || 'Continue' : null);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        recompute();
      });
    };
    // the incoming page fades in over ~0.6s; sample a few times so the first
    // label is right before any scroll
    const t1 = setTimeout(recompute, 50);
    const t2 = setTimeout(recompute, 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [recompute, activeTab]);

  const handleAdvance = () => {
    const stop = findNextStop();
    if (stop) {
      const top = window.scrollY + stop.getBoundingClientRect().top - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else {
      onSelect(isLast ? tabs[0].id : next.id);
    }
  };

  const scrolling = stopLabel != null;
  const label = scrolling ? stopLabel : isLast ? 'Back to start' : next.label;
  const chevron = scrolling ? '↓' : isLast ? '↑' : '↓';

  return (
    <>
      <nav
        aria-label="Section progress"
        className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end gap-3"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            aria-label={t.label}
            aria-current={i === index ? 'true' : undefined}
            className="group relative flex items-center py-1"
          >
            <span className="absolute right-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-fog opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === index
                  ? 'h-7 w-[3px] bg-accent'
                  : 'h-[6px] w-[6px] bg-white/25 group-hover:bg-fog'
              }`}
            />
          </button>
        ))}
      </nav>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex sm:hidden items-center gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            aria-label={t.label}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-6 bg-accent' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>

      {showNext && (
        <button
          onClick={handleAdvance}
          aria-label={scrolling ? `Scroll to ${label}` : isLast ? 'Back to start' : `Go to ${label}`}
          className="group fixed bottom-6 right-5 md:right-8 z-40 flex items-center gap-3 rounded-full border border-line bg-ink/70 backdrop-blur-md pl-5 pr-2 py-2 hover:border-accent transition-all duration-300"
        >
          <span className="flex flex-col items-end leading-none">
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-fog/60">
              {scrolling ? 'Next' : isLast ? '' : 'Next tab'}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog group-hover:text-paper transition-colors duration-300 mt-0.5">
              {label}
            </span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-fog group-hover:border-accent group-hover:text-accent transition-all duration-300">
            <span className="animate-bounce text-sm leading-none">{chevron}</span>
          </span>
        </button>
      )}
    </>
  );
};

export default TabProgress;
