import { useEffect, useRef } from 'react';
import { projectHotspot } from './three/projectHotspot';
import { projects } from '../constants';

// invisible link kept aligned over the active 3D project card so clicking the
// "open project" deck opens that project (the Canvas is pointer-events:none)
const ProjectHotspot = ({ activeTab }) => {
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const a = ref.current;
      if (!a) return;
      const h = projectHotspot;
      const show = h.visible && activeTab === 'work' && window.innerWidth >= 1024;
      if (!show) {
        if (a.style.display !== 'none') a.style.display = 'none';
        return;
      }
      const project = projects[h.index];
      a.style.display = 'block';
      a.style.left = `${h.left}px`;
      a.style.top = `${h.top}px`;
      a.style.width = `${h.width}px`;
      a.style.height = `${h.height}px`;
      if (a.dataset.url !== project.url) {
        a.href = project.url;
        a.dataset.url = project.url;
        a.setAttribute('aria-label', `Open ${project.title} project`);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      projectHotspot.hover = false;
    };
  }, [activeTab]);

  return (
    <a
      ref={ref}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => (projectHotspot.hover = true)}
      onMouseLeave={() => (projectHotspot.hover = false)}
      className="fixed z-30 cursor-pointer rounded-lg ring-accent/0 hover:ring-2 hover:ring-accent/40 transition-[box-shadow] duration-300"
      style={{ display: 'none' }}
    />
  );
};

export default ProjectHotspot;
