import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Journey from '../sections/Journey';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import { tabs } from '../constants';

const PAGES = {
  home: Hero,
  about: About,
  experience: Journey,
  skills: Skills,
  work: Projects,
  contact: Contact,
};

const order = (id) => tabs.findIndex((t) => t.id === id);

const TabView = ({ tab, onSelect }) => {
  const wrap = useRef(null);
  const [current, setCurrent] = useState(tab);
  const dir = useRef(1);

  useGSAP(() => {
    if (tab === current) return;
    dir.current = order(tab) >= order(current) ? 1 : -1;
    gsap.to(wrap.current, {
      autoAlpha: 0,
      y: -36 * dir.current,
      duration: 0.3,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => setCurrent(tab),
    });
  }, [tab]);

  useGSAP(() => {
    // going back lands at the bottom of the previous page so an upward
    // scroll journey stays continuous
    window.scrollTo(0, dir.current < 0 ? document.documentElement.scrollHeight : 0);
    gsap.fromTo(
      wrap.current,
      { autoAlpha: 0, y: 42 * dir.current },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', overwrite: true }
    );
  }, [current]);

  const Page = PAGES[current];
  return (
    <div ref={wrap} className="will-change-transform">
      <Page onSelect={onSelect} entryDir={dir.current} />
    </div>
  );
};

export default TabView;
