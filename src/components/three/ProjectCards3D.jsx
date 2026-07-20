import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import DataPanel from './DataPanel';
import { projectFocus, stageInputs } from './stagePose';
import { projectHotspot } from './projectHotspot';
import { projects } from '../../constants';

const COLORS = ['#7ad7ff', '#c9f24b', '#ff6a3d'];

// card front-face half extents (boxGeometry 1.12 x 0.8)
const HW = 0.56;
const HH = 0.4;
const FRONT_Z = 0.05;
const corner = new Vector3();

// a fanned deck: the active project sits front-and-centre facing the camera,
// the rest recede behind it, angled and dimmed
const ProjectCards3D = () => {
  const cards = useRef([]);
  const glows = useRef([]);

  useFrame((state, delta) => {
    const focus = projectFocus();
    const t = state.clock.elapsedTime;
    const active = Math.round(MathUtils.clamp(focus, 0, projects.length - 1));

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
      if (glows.current[i]) {
        const boost = projectHotspot.hover && i === active ? 0.35 : 0;
        glows.current[i].material.opacity = 0.05 + near * 0.45 + boost;
      }
    });

    // project the active card's screen rect for the clickable HTML overlay
    const card = cards.current[active];
    if (stageInputs.tab === 'work' && card && card.scale.x > 0.6) {
      card.updateWorldMatrix(true, false);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          corner.set(sx * HW, sy * HH, FRONT_Z);
          card.localToWorld(corner).project(state.camera);
          const px = (corner.x * 0.5 + 0.5) * state.size.width;
          const py = (-corner.y * 0.5 + 0.5) * state.size.height;
          minX = Math.min(minX, px);
          maxX = Math.max(maxX, px);
          minY = Math.min(minY, py);
          maxY = Math.max(maxY, py);
        }
      }
      projectHotspot.left = minX;
      projectHotspot.top = minY;
      projectHotspot.width = maxX - minX;
      projectHotspot.height = maxY - minY;
      projectHotspot.index = active;
      projectHotspot.visible = true;
    } else {
      projectHotspot.visible = false;
    }
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
