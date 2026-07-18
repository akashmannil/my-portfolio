import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Journey from '../sections/Journey';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

const PAGES = {
  home: Hero,
  about: About,
  experience: Journey,
  skills: Skills,
  work: Projects,
  contact: Contact,
};

const TabView = ({ tab, onSelect }) => {
  const wrap = useRef(null);
  const [current, setCurrent] = useState(tab);

  useGSAP(() => {
    if (tab === current) return;
    gsap.to(wrap.current, {
      autoAlpha: 0,
      y: -36,
      duration: 0.3,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        window.scrollTo(0, 0);
        setCurrent(tab);
      },
    });
  }, [tab]);

  useGSAP(() => {
    gsap.fromTo(
      wrap.current,
      { autoAlpha: 0, y: 42 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', overwrite: true }
    );
  }, [current]);

  const Page = PAGES[current];
  return (
    <div ref={wrap} className="will-change-transform">
      <Page onSelect={onSelect} />
    </div>
  );
};

export default TabView;
