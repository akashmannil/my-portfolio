import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import SkillPlanet from './SkillPlanet';
import { skillSystem } from '../../constants';

const FONT = '/fonts/jetbrains-mono.woff';

// orbit choreography by slot; which skill rides each slot lives in constants
const ORBITS = [
  { r: 1.05, incline: 0.35, speed: 0.55, phase: 0 },
  { r: 1.05, incline: 0.35, speed: 0.55, phase: Math.PI },
  { r: 1.35, incline: -0.7, speed: 0.4, phase: 1.2 },
  { r: 1.35, incline: -0.7, speed: 0.4, phase: 1.2 + Math.PI },
  { r: 1.65, incline: 1.15, speed: 0.28, phase: 2.4 },
  { r: 1.65, incline: 1.15, speed: 0.28, phase: 2.4 + Math.PI },
  { r: 1.2, incline: 0.85, speed: 0.48, phase: 4 },
  { r: 1.5, incline: -0.3, speed: 0.34, phase: 5.2 },
];

const TechSphere = () => {
  const spinners = useRef([]);
  const core = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    core.current.rotation.y = t * 0.2;
    core.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    spinners.current.forEach((spinner, i) => {
      if (spinner) {
        const { speed, phase } = ORBITS[i % ORBITS.length];
        spinner.rotation.y = t * speed + phase;
      }
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
      <Billboard position={[0, -0.78, 0]}>
        <Text
          font={FONT}
          fontSize={0.06}
          letterSpacing={0.14}
          color="#c9f24b"
          anchorX="center"
          anchorY="top"
        >
          {skillSystem.core}
        </Text>
      </Billboard>
      {skillSystem.planets.map((planet, i) => {
        const { r, incline } = ORBITS[i % ORBITS.length];
        return (
          <group key={planet.label} rotation={[incline, 0, incline * 0.4]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.004, 8, 64]} />
              <meshBasicMaterial color="#3d4654" transparent opacity={0.35} />
            </mesh>
            <group ref={(el) => (spinners.current[i] = el)}>
              <group position={[r, 0, 0]}>
                <SkillPlanet {...planet} />
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default TechSphere;
