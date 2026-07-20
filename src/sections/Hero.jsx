import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroCopy } from '../constants';

const Hero = () => {
  useGSAP(() => {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(
        '.hero-eyebrow',
        { opacity: 0, letterSpacing: '1.2em' },
        { opacity: 1, letterSpacing: '0.45em', duration: 1.6 }
      )
      .fromTo(
        '.hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.18 },
        '-=1.1'
      )
      .fromTo(
        '.hero-sub',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.5'
      );
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-5 md:px-16"
    >
      <p className="hero-eyebrow eyebrow mb-8">{heroCopy.eyebrow}</p>
      <h1 className="display-hero">
        {heroCopy.lines.map(({ text, style }) => (
          <span key={text} className="block overflow-hidden pb-[0.08em]">
            <span
              className={`hero-line block ${
                style === 'serif' ? 'serif-accent text-accent' : ''
              }`}
            >
              {text}
            </span>
          </span>
        ))}
      </h1>
      <p className="hero-sub max-w-xl mt-10 text-fog text-lg md:text-xl font-light leading-relaxed">
        {heroCopy.sub}
      </p>
    </section>
  );
};

export default Hero;
