import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { isCompact, prefersReducedMotion } from './responsive';

const COUNT = isCompact() ? 150 : 350;

const ParticleField = () => {
  const points = useRef(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (reduced) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.015;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#9b9ba6"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
