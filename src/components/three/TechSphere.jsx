import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const ORBS = [
  { color: '#61dafb', r: 1.1, incline: 0.35, speed: 0.55, phase: 0 },
  { color: '#8cc84b', r: 1.1, incline: 0.35, speed: 0.55, phase: Math.PI },
  { color: '#ffd43b', r: 1.4, incline: -0.7, speed: 0.4, phase: 1.2 },
  { color: '#3178c6', r: 1.4, incline: -0.7, speed: 0.4, phase: 1.2 + Math.PI },
  { color: '#f05033', r: 1.7, incline: 1.15, speed: 0.28, phase: 2.4 },
  { color: '#e34f26', r: 1.7, incline: 1.15, speed: 0.28, phase: 2.4 + Math.PI },
  { color: '#47a248', r: 1.25, incline: 0.85, speed: 0.48, phase: 4 },
  { color: '#dd0031', r: 1.55, incline: -0.3, speed: 0.34, phase: 5.2 },
];

const TechSphere = () => {
  const spinners = useRef([]);
  const core = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    core.current.rotation.y = t * 0.2;
    core.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    spinners.current.forEach((spinner, i) => {
      if (spinner) spinner.rotation.y = t * ORBS[i].speed + ORBS[i].phase;
    });
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#c9f24b" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#101016" metalness={0.8} roughness={0.2} />
      </mesh>
      {ORBS.map(({ color, r, incline }, i) => (
        <group key={color} rotation={[incline, 0, incline * 0.4]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.004, 8, 64]} />
            <meshBasicMaterial color="#3d4654" transparent opacity={0.35} />
          </mesh>
          <group ref={(el) => (spinners.current[i] = el)}>
            <mesh position={[r, 0, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[r, 0, 0]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export default TechSphere;
