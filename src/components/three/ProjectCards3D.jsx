import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import DataPanel from './DataPanel';
import { projectFocus } from './stagePose';
import { projects } from '../../constants';

const COLORS = ['#7ad7ff', '#c9f24b', '#ff6a3d'];

// a fanned deck: the active project sits front-and-centre facing the camera,
// the rest recede behind it, angled and dimmed
const ProjectCards3D = () => {
  const cards = useRef([]);
  const glows = useRef([]);

  useFrame((state, delta) => {
    const focus = projectFocus();
    const t = state.clock.elapsedTime;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const d = i - focus;
      const ad = Math.abs(d);
      const near = Math.max(0, 1 - ad);
      const side = MathUtils.clamp(d, -2.2, 2.2);

      const targetX = side * 0.4;
      const targetZ = near * 0.5 - Math.min(ad, 3) * 0.28;
      const targetScale = 0.6 + near * 0.5;
      const targetRotY = -side * 0.34 + (near > 0.98 ? Math.sin(t * 0.6) * 0.05 : 0);

      card.position.x = MathUtils.damp(card.position.x, targetX, 6, delta);
      card.position.z = MathUtils.damp(card.position.z, targetZ, 6, delta);
      card.position.y = MathUtils.damp(card.position.y, (1 - near) * -0.05, 6, delta);
      card.rotation.y = MathUtils.damp(card.rotation.y, targetRotY, 6, delta);
      card.scale.setScalar(MathUtils.damp(card.scale.x, targetScale, 6, delta));
      card.visible = ad < 2.4;
      if (glows.current[i]) glows.current[i].material.opacity = 0.05 + near * 0.45;
    });
  });

  return (
    <group>
      {projects.map((project, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <group key={project.title} ref={(el) => (cards.current[i] = el)}>
            <mesh ref={(el) => (glows.current[i] = el)} position={[0, 0, -0.03]}>
              <planeGeometry args={[1.22, 0.9]} />
              <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>
            <mesh castShadow>
              <boxGeometry args={[1.12, 0.8, 0.04]} />
              <meshStandardMaterial color="#14141c" metalness={0.6} roughness={0.35} />
            </mesh>
            <group position={[0, 0, 0.025]}>
              <DataPanel
                width={1.0}
                height={0.66}
                lines={[
                  { text: project.title, tone: 'base' },
                  { text: project.tags.join(' / '), tone: 'dim' },
                  { text: 'open project ->', tone: 'accent' },
                ]}
                color={color}
                title={`project 0${i + 1}`}
              />
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default ProjectCards3D;
