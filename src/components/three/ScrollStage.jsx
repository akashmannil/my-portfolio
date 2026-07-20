import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import MorphRig from './MorphRig';
import ParticleField from './ParticleField';
import { isCompact } from './responsive';

// time-of-day lighting so the 3D scenes brighten with the ambient palette
const AMBIENT_LIGHT = { dawn: 0.6, day: 0.9, dusk: 0.45, night: 0.35 };
const KEY_COLOR = { dawn: '#ffd9b0', day: '#ffffff', dusk: '#ffb27a', night: '#ffffff' };

// the scene materials/glows are tuned to pop against black; on the light
// daytime palettes they read as neon, so grade the whole stage down —
// applied to the canvas layer only, never the UI
const CANVAS_FILTER = {
  dawn: 'saturate(0.8) brightness(1.05)',
  day: 'saturate(0.62) brightness(1.1) contrast(0.95)',
  dusk: 'saturate(0.92)',
  night: 'none',
};

const ScrollStage = ({ activeTab, ambient, ambientOn }) => {
  const compact = isCompact();
  const wrap = useRef(null);
  const live = ambientOn && ambient?.status !== 'off';
  const ambIntensity = live ? AMBIENT_LIGHT[ambient.timeOfDay] : 0.35;
  const keyColor = live ? KEY_COLOR[ambient.timeOfDay] : '#ffffff';
  const filter = live ? CANVAS_FILTER[ambient.timeOfDay] : 'none';

  // the 3D scene is a top-of-page centrepiece; as the reader scrolls a tab's
  // content it recedes so it never fights the text below the fold. The Work
  // tab is exempt: its deck must stay lit while you scroll every project.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      if (!wrap.current) return;
      wrap.current.style.opacity =
        activeTab === 'work' ? '1' : String(Math.max(0.12, 1 - window.scrollY / 520));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [activeTab]);

  return (
    <div
      ref={wrap}
      style={{ filter }}
      className="fixed inset-0 z-[1] pointer-events-none transition-[opacity,filter] duration-500"
    >
      <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-glacier/5 blur-[120px]" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full bg-ember/5 blur-[120px]" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={compact ? [1, 1.25] : [1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={ambIntensity} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} color={keyColor} />
        <pointLight position={[-5, -2, -3]} intensity={9} color="#7ad7ff" />
        <pointLight position={[5, -3, 2]} intensity={7} color="#ff6a3d" />
        <Suspense fallback={null}>
          <MorphRig />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ScrollStage;
