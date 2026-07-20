import { useEffect, useState } from 'react';
import AmbientToggle from './AmbientToggle';
import { tabs, resumeFile } from '../constants';

const NavBar = ({ activeTab, onSelect, ambientOn, onToggleAmbient, ambient }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const select = (id) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-5 md:px-16 transition-all duration-500 ${
        scrolled || open
          ? 'py-4 bg-ink/80 backdrop-blur-md border-b border-line'
          : 'py-5 md:py-7 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <button onClick={() => select('home')} className="text-lg tracking-tight">
          Akash <span className="serif-accent text-accent">Mannil</span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => select(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`relative py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                activeTab === id ? 'text-paper' : 'text-fog hover:text-paper'
              }`}
            >
              {label}
              <span
                className={`absolute left-0 -bottom-0.5 h-px w-full bg-accent origin-left transition-transform duration-500 ${
                  activeTab === id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <AmbientToggle
            variant="desktop"
            enabled={ambientOn}
            onToggle={onToggleAmbient}
            ambient={ambient}
          />
          <a
            href={resumeFile}
            download
            className="hidden lg:inline-block font-mono text-[11px] uppercase tracking-[0.25em] border border-line rounded-full px-6 py-3 hover:bg-paper hover:text-ink transition-all duration-300"
          >
            Resume
          </a>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden flex flex-col justify-center items-end gap-1.5 w-10 h-10"
          >
            <span
              className={`block h-px bg-paper transition-all duration-300 ${
                open ? 'w-6 rotate-45 translate-y-[3.5px]' : 'w-6'
              }`}
            />
            <span
              className={`block h-px bg-paper transition-all duration-300 ${
                open ? 'w-6 -rotate-45 -translate-y-[3.5px]' : 'w-4'
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-full inset-x-0 bg-ink/95 backdrop-blur-md border-b border-line overflow-hidden transition-all duration-500 ${
          open ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-5 py-6 gap-1">
          {tabs.map(({ id, label }, i) => (
            <button
              key={id}
              onClick={() => select(id)}
              className={`flex items-baseline gap-4 py-3 border-b border-line/50 text-left transition-colors duration-300 ${
                activeTab === id ? 'text-accent' : 'text-paper'
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-fog">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-sm uppercase tracking-[0.25em]">{label}</span>
              {activeTab === id && <span className="ml-auto text-accent">✦</span>}
            </button>
          ))}
          <a
            href={resumeFile}
            download
            className="mt-5 w-fit font-mono text-[11px] uppercase tracking-[0.25em] border border-line rounded-full px-6 py-3"
          >
            Download Resume
          </a>
          <AmbientToggle
            variant="mobile"
            enabled={ambientOn}
            onToggle={onToggleAmbient}
            ambient={ambient}
          />
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
