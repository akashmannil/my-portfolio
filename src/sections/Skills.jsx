import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { skillRows } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const ROW_STYLES = ['text-paper', 'text-outline', 'text-fog/60'];

const Skills = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray('.skill-row').forEach((row, i) => {
      gsap.fromTo(
        row,
        { xPercent: i % 2 === 0 ? 0 : -22 },
        {
          xPercent: i % 2 === 0 ? -22 : 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      <div className="px-5 md:px-16 mb-16 md:mb-24">
        <p className="eyebrow mb-3">The toolkit</p>
        <h2 className="display-section">
          Fluent in <span className="serif-accent text-glacier">many tongues.</span>
        </h2>
      </div>
      <div className="space-y-6 md:space-y-10">
        {skillRows.map((row, i) => (
          <div
            key={row[0]}
            className={`skill-row flex items-baseline gap-6 md:gap-12 text-4xl md:text-7xl font-medium tracking-tight ${ROW_STYLES[i % ROW_STYLES.length]}`}
          >
            {[...row, ...row].map((skill, j) => (
              <span
                key={`${skill}-${j}`}
                className={j % 2 === 1 ? 'serif-accent text-3xl md:text-6xl' : ''}
              >
                {skill}
                <span className="text-accent mx-4 md:mx-8 text-2xl md:text-4xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
