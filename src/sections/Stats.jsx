import CountUp from 'react-countup';
import { counterItems } from '../constants';

const Stats = () => {
  return (
    <section id="stats" className="relative px-5 md:px-16 py-32 md:py-44">
      <p className="eyebrow mb-3">In numbers</p>
      <h2 className="display-section mb-16 md:mb-24">
        Proof in the <span className="serif-accent text-accent">numbers.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {counterItems.map((item) => (
          <div key={item.label} className="bg-ink p-10 md:p-12">
            <span className="font-display font-light text-6xl md:text-7xl text-paper block leading-none">
              <CountUp end={item.value} duration={2.5} enableScrollSpy scrollSpyOnce />
              <span className="text-accent text-3xl md:text-4xl align-top">{item.suffix}</span>
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog mt-6 leading-relaxed">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
