import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import MorphRig from './MorphRig';
import ParticleField from './ParticleField';
import { isCompact } from './responsive';

const ScrollStage = ({ activeTab }) => {
  const compact = isCompact();
  const wrap = useRef(null);

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
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
    >
      <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-glacier/5 blur-[120px]" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full bg-ember/5 blur-[120px]" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={compact ? [1, 1.25] : [1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} />
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
