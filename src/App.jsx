import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { stageInputs, sectionKeyframes } from './components/three/stagePose';
import NavBar from './components/NavBar';
import ScrollStage from './components/three/ScrollStage';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Journey from './sections/Journey';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Stats from './sections/Stats';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  // created here, after every section's own triggers/pins mount, so
  // ScrollTrigger factors the pin spacing into these scroll positions
  useGSAP(() => {
    sectionKeyframes.forEach(({ trigger, endAt }, i) => {
      const st = ScrollTrigger.create({
        trigger,
        start: 'top bottom',
        end: endAt || 'top top',
        onUpdate: (self) => (stageInputs.sections[i] = self.progress),
        onRefresh: (self) => (stageInputs.sections[i] = self.progress),
      });
      stageInputs.sections[i] = st.progress;
    });
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // pinned sections insert spacers after the stage's triggers measure the
    // page, so recompute positions once everything (incl. fonts) has settled
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="grain">
      <NavBar />
      <ScrollStage />
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Journey />
        <Skills />
        <Projects />
        <Stats />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default App;
