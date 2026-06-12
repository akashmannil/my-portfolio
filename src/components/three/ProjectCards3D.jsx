import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import DataPanel from './DataPanel';
import { projectFocus } from './stagePose';
import { projects } from '../../constants';

const CARDS = [
  { x: -1.05, color: '#7ad7ff' },
  { x: 0, color: '#c9f24b' },
  { x: 1.05, color: '#ff6a3d' },
];

const ProjectCards3D = () => {
  const cards = useRef([]);
  const glows = useRef([]);

  useFrame((state, delta) => {
    const focus = projectFocus();
    cards.current.forEach((card, i) => {
      if (!card) return;
      const near = Math.max(0, 1 - Math.abs(focus - i));
      card.position.z = MathUtils.damp(card.position.z, near * 0.45 - 0.2, 4, delta);
      card.rotation.y = MathUtils.damp(card.rotation.y, (i - focus) * -0.22, 4, delta);
      const s = MathUtils.damp(card.scale.x, 0.9 + near * 0.25, 4, delta);
      card.scale.setScalar(s);
      if (glows.current[i]) glows.current[i].material.opacity = 0.08 + near * 0.3;
    });
  });

  return (
    <group>
      {CARDS.map(({ x, color }, i) => (
        <group key={color} position={[x, 0, -0.2]} ref={(el) => (cards.current[i] = el)}>
          <mesh ref={(el) => (glows.current[i] = el)} position={[0, 0, -0.03]}>
            <planeGeometry args={[1.18, 0.86]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.78, 0.04]} />
            <meshStandardMaterial color="#14141c" metalness={0.6} roughness={0.35} />
          </mesh>
          <group position={[0, 0, 0.025]}>
            <DataPanel
              width={1.0}
              height={0.66}
              lines={[
                { text: projects[i].title, tone: 'base' },
                { text: projects[i].tags.join(' / '), tone: 'dim' },
                { text: 'open project ->', tone: 'accent' },
              ]}
              color={color}
              title={`project 0${i + 1}`}
            />
          </group>
        </group>
      ))}
    </group>
  );
};

export default ProjectCards3D;
