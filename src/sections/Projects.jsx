import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray('.project-card').forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top bottom-=120' },
        }
      );
    });
    gsap.utils.toArray('.project-media img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.project-media'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative px-5 md:px-16 py-32 md:py-48">
      <p className="eyebrow mb-3">Selected work</p>
      <h2 className="display-section mb-20 md:mb-32">
        Built, shipped, <span className="serif-accent text-glacier">loved.</span>
      </h2>
      <div className="space-y-28 md:space-y-40">
        {projects.map((project, i) => (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className={`project-card group grid md:grid-cols-12 gap-8 items-center ${
              i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="project-media md:col-span-7 overflow-hidden rounded-2xl border border-line">
              <img
                src={project.imgPath}
                alt={project.title}
                className="w-full h-64 md:h-[55vh] object-cover transition-transform duration-700"
              />
            </div>
            <div className="md:col-span-5 md:px-8">
              <span className="font-display font-light text-5xl md:text-7xl text-outline block mb-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-2xl md:text-4xl font-medium tracking-tight mb-4 group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-fog font-light leading-relaxed mb-6">{project.desc}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.2em] border border-line rounded-full px-4 py-2 text-fog">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                Visit project ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
