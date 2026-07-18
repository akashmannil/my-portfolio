import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import JourneyPanel from '../components/JourneyPanel';
import { stageInputs } from '../components/three/stagePose';
import { expCards } from '../constants';

const Journey = ({ onSelect }) => {
  const sectionRef = useRef(null);
  const [step, setStep] = useState(0);
  const prevStep = useRef(0);

  useGSAP(
    () => {
      const dir = step >= prevStep.current ? 1 : -1;
      gsap.to(stageInputs, { journey: step, duration: 0.9, ease: 'power2.inOut' });
      gsap.utils.toArray('.journey-panel').forEach((panel, i) => {
        if (i === step) {
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 70 * dir },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', overwrite: true }
          );
        } else {
          gsap.to(panel, { autoAlpha: 0, y: -70 * dir, duration: 0.35, ease: 'power2.in', overwrite: true });
        }
      });
      gsap.to('.journey-progress', {
        scaleX: (step + 1) / expCards.length,
        duration: 0.7,
        ease: 'power2.out',
      });
      prevStep.current = step;
    },
    { scope: sectionRef, dependencies: [step] }
  );

  const advance = () =>
    step === expCards.length - 1 ? onSelect('skills') : setStep(step + 1);

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
      <div className="absolute bottom-20 md:bottom-24 right-5 md:right-16 z-10 flex items-center gap-2 md:gap-3">
        {expCards.map((card, i) => (
          <button
            key={card.title}
            onClick={() => setStep(i)}
            aria-label={`Role ${i + 1}: ${card.title}`}
            className={`w-9 h-9 rounded-full border font-mono text-[10px] tracking-[0.1em] transition-all duration-300 ${
              i === step
                ? 'border-ember text-ember'
                : 'border-line text-fog hover:text-paper hover:border-fog'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
        <span className="w-px h-6 bg-line mx-1 md:mx-2" />
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          aria-label="Previous role"
          className="w-9 h-9 rounded-full border border-line text-paper disabled:opacity-30 hover:border-fog transition-all duration-300"
        >
          ←
        </button>
        <button
          onClick={advance}
          aria-label={step === expCards.length - 1 ? 'Next chapter' : 'Next role'}
          className="w-9 h-9 rounded-full border border-line text-paper hover:border-fog transition-all duration-300"
        >
          →
        </button>
      </div>
      <div className="absolute bottom-10 left-5 md:left-16 right-5 md:right-16 h-px bg-line">
        <div className="journey-progress h-full origin-left scale-x-25 bg-ember" />
      </div>
    </section>
  );
};

export default Journey;
