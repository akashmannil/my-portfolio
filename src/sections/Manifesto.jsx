import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { manifesto } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const ACCENT_WORDS = ['effortless.', 'feel?', 'craft,', 'calm,', 'curiosity'];

const Manifesto = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.to('.m-word', {
      opacity: 1,
      ease: 'none',
      stagger: 0.6,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-5 md:px-16"
    >
      <div className="max-w-5xl">
        <p className="eyebrow mb-10">The approach</p>
        <p className="text-2xl md:text-4xl xl:text-[2.9rem] leading-snug tracking-tight font-light">
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
      </div>
    </section>
  );
};

export default Manifesto;
