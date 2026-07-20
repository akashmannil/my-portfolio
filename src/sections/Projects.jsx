import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import RepoCard from '../components/RepoCard';
import useGithubRepos from '../hooks/useGithubRepos';
import { stageInputs } from '../components/three/stagePose';
import { projects, github } from '../constants';

const focusProject = (i) =>
  gsap.to(stageInputs, { project: i, duration: 0.7, ease: 'power2.out', overwrite: true });

const Projects = () => {
  const sectionRef = useRef(null);
  const { repos, status } = useGithubRepos();

  useGSAP(
    () => {
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
      );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (repos.length) {
        gsap.fromTo(
          '.repo-card',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }
        );
      }
    },
    { scope: sectionRef, dependencies: [repos] }
  );

  // keep the 3D deck showing whichever project sits in the reading band
  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll('.project-card');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) focusProject(Number(e.target.dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative px-5 md:px-16 pt-32 md:pt-40 pb-24">
      <p className="eyebrow mb-3">Selected work</p>
      <h2 className="display-section mb-16 md:mb-24 max-w-2xl">
        Built, shipped, <span className="serif-accent text-glacier">loved.</span>
      </h2>
      <div className="space-y-24 md:space-y-32 xl:max-w-4xl">
        {projects.map((project, i) => (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            data-index={i}
            data-scroll-stop
            data-scroll-label={project.title}
            onMouseEnter={() => focusProject(i)}
            className={`project-card group grid md:grid-cols-12 gap-8 items-center ${
              i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="project-media md:col-span-7 overflow-hidden rounded-2xl border border-line">
              <img
                src={project.imgPath}
                alt={project.title}
                className="w-full h-64 md:h-[50vh] object-cover group-hover:scale-105 transition-transform duration-700"
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

      <div className="mt-28 md:mt-36 xl:max-w-4xl" data-scroll-stop data-scroll-label="Latest commits">
        <p className="eyebrow mb-3">Fresh from GitHub</p>
        <h3 className="display-section mb-6">
          Latest <span className="serif-accent text-accent">commits.</span>
        </h3>
        <p className="text-fog font-light max-w-xl mb-12">
          Pulled live from my GitHub profile — whatever I pushed most recently shows up
          here on its own.
        </p>
        {status === 'loading' && (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-fog animate-pulse">
            Fetching repositories…
          </p>
        )}
        {status === 'error' && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fog">
            GitHub is rate-limiting right now —{' '}
            <a
              href={`https://github.com/${github.username}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-paper transition-colors duration-300"
            >
              browse everything on GitHub ↗
            </a>
          </p>
        )}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
        {status === 'ready' && (
          <a
            href={`https://github.com/${github.username}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-12 font-mono text-xs uppercase tracking-[0.3em] text-fog hover:text-accent transition-colors duration-300"
          >
            View all repositories ↗
          </a>
        )}
      </div>
    </section>
  );
};

export default Projects;
