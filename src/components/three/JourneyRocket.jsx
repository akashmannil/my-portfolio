import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Resize, Text, useGLTF } from '@react-three/drei';
import { Color, MathUtils } from 'three';
import { journeyFocus } from './stagePose';
import { expCards } from '../../constants';

const FONT = '/fonts/jetbrains-mono.woff';

// "Minimal Cartoon Rocketship" by Gambsmoore (CC-BY 3.0) via poly.pizza
const ROCKET = '/models/rocket-cartoon.glb';
useGLTF.preload(ROCKET);

const RING_YS = [-0.95, -0.35, 0.25, 0.85];
const IDLE = new Color('#55637a');
const HOT = new Color('#ff6a3d');

const JourneyRocket = () => {
  const { scene } = useGLTF(ROCKET);
  const rocket = useRef(null);
  const flame = useRef(null);
  const rings = useRef([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const focus = journeyFocus();
    const targetY = MathUtils.lerp(RING_YS[0], RING_YS[3], focus / 3);
    const r = rocket.current;
    r.position.y = MathUtils.damp(r.position.y, targetY, 3, delta);
    r.position.x = Math.sin(t * 1.6) * 0.05;
    r.rotation.z = Math.sin(t * 1.3) * 0.06;
    r.rotation.y += delta * 0.5;
    flame.current.scale.setScalar(0.8 + Math.abs(Math.sin(t * 21)) * 0.3);

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const lit = MathUtils.clamp(focus - i + 1, 0, 1);
      ring.material.color.copy(IDLE).lerp(HOT, lit);
      ring.material.opacity = 0.25 + lit * 0.6;
      ring.rotation.z = t * (0.25 + i * 0.12);
    });
  });

  return (
    <group>
      <group ref={rocket} position={[0, RING_YS[0], 0]}>
        <group scale={1.35}>
          <Resize>
            <Center>
              <primitive object={scene} />
            </Center>
          </Resize>
        </group>
        <mesh ref={flame} position={[0, -0.78, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.14, 0.5, 12]} />
          <meshBasicMaterial color="#ffb35c" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#ff6a3d" transparent opacity={0.4} />
        </mesh>
      </group>
      {RING_YS.map((y, i) => (
        <group key={y}>
          <mesh
            position={[0, y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            ref={(el) => (rings.current[i] = el)}
          >
            <torusGeometry args={[0.55, 0.016, 8, 48]} />
            <meshBasicMaterial color="#55637a" transparent opacity={0.25} />
          </mesh>
          <Text
            font={FONT}
            fontSize={0.055}
            color="#c8d4e4"
            anchorX="left"
            anchorY="bottom"
            maxWidth={1.15}
            position={[0.68, y + 0.02, 0]}
          >
            {expCards[i].title}
          </Text>
          <Text
            font={FONT}
            fontSize={0.038}
            color="#5d6b80"
            anchorX="left"
            anchorY="top"
            position={[0.68, y - 0.03, 0]}
          >
            {expCards[i].date}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default JourneyRocket;
