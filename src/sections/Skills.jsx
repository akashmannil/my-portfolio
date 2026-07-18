import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import NextChapter from '../components/NextChapter';
import { skillRows } from '../constants';

const ROW_STYLES = ['text-paper', 'text-outline', 'text-fog/60'];

const Skills = ({ onSelect }) => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.utils.toArray('.skill-row').forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 === 0 ? 0 : -50 },
          { xPercent: i % 2 === 0 ? -50 : 0, duration: 45 + i * 12, ease: 'none', repeat: -1 }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      <div className="px-5 md:px-16 mb-14 md:mb-20">
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
      <div className="px-5 md:px-16 mt-16 md:mt-24">
        <NextChapter current="skills" onSelect={onSelect} />
      </div>
    </section>
  );
};

export default Skills;
