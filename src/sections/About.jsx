import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CountUp from 'react-countup';
import NextChapter from '../components/NextChapter';
import { manifesto, counterItems } from '../constants';

const ACCENT_WORDS = ['effortless.', 'feel?', 'craft,', 'calm,', 'curiosity'];

const About = ({ onSelect }) => {
  useGSAP(() => {
    gsap.to('.m-word', {
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out',
      stagger: 0.03,
      delay: 0.25,
    });
    gsap.fromTo(
      '.stat-cell',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 1.1 }
    );
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center px-5 md:px-16 pt-28 md:pt-32 pb-24"
    >
      <p className="eyebrow mb-8 md:mb-10">The approach</p>
      <p className="max-w-5xl text-xl md:text-3xl xl:text-[2.4rem] leading-snug tracking-tight font-light">
        {manifesto.split(' ').map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={`m-word inline-block opacity-10 mr-[0.28em] ${
              ACCENT_WORDS.includes(word) ? 'serif-accent text-accent' : ''
            }`}
          >
            {word}
          </span>
        ))}
      </p>
      <div className="mt-16 md:mt-20 grid grid-cols-2 xl:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {counterItems.map((item) => (
          <div key={item.label} className="stat-cell bg-ink p-6 md:p-10">
            <span className="font-display font-light text-4xl md:text-6xl text-paper block leading-none">
              <CountUp end={item.value} duration={2.2} />
              <span className="text-accent text-xl md:text-3xl align-top">{item.suffix}</span>
            </span>
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-fog mt-4 md:mt-6 leading-relaxed">
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <NextChapter current="about" onSelect={onSelect} className="mt-14" />
    </section>
  );
};

export default About;
