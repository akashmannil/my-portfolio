import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import JourneyPanel from '../components/JourneyPanel';
import { stageInputs } from '../components/three/stagePose';
import { expCards } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Journey = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.journey-panel');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => (stageInputs.journey = self.progress),
        onRefresh: (self) => (stageInputs.journey = self.progress),
      },
    });

    // in/hold/out durations here are mirrored by journeySwapWindows in
    // stagePose.js, which times the 3D model swap to each panel fade
    panels.forEach((panel, i) => {
      if (i > 0) {
        tl.fromTo(panel, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1 });
      }
      if (i < panels.length - 1) {
        tl.to(panel, { autoAlpha: 0, y: -80, duration: 1 }, '+=0.6');
      }
    });

    gsap.to('.journey-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${panels.length * 100}%`,
        scrub: true,
      },
    });
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative h-screen overflow-hidden">
      <header className="absolute top-24 left-5 md:left-16 z-10">
        <p className="eyebrow mb-3">The journey</p>
        <h2 className="display-section">
          Four roles, <span className="serif-accent text-ember">one craft.</span>
        </h2>
      </header>
      <div className="absolute inset-0 pt-24">
        {expCards.map((card, i) => (
          <JourneyPanel key={card.title} card={card} index={i} total={expCards.length} />
        ))}
      </div>
      <div className="absolute bottom-10 left-5 md:left-16 right-5 md:right-16 h-px bg-line">
        <div className="journey-progress h-full origin-left scale-x-0 bg-ember" />
      </div>
    </section>
  );
};

export default Journey;
