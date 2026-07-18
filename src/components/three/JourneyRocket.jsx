import { useRef, useState } from 'react';
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
  const print = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const focus = journeyFocus();
    const targetY = MathUtils.lerp(RING_YS[0], RING_YS[3], focus / 3);
    const r = rocket.current;
    r.position.y = MathUtils.damp(r.position.y, targetY, 3, delta);
    r.position.x = Math.sin(t * 1.6) * 0.05;
    r.rotation.z = Math.sin(t * 1.3) * 0.06;
    // sway instead of a full spin so the hull livery stays readable
    r.rotation.y = Math.sin(t * 0.55) * 0.32;
    flame.current.scale.setScalar(0.8 + Math.abs(Math.sin(t * 21)) * 0.3);

    // restamp the livery when the focused role changes
    const idx = Math.round(MathUtils.clamp(focus, 0, expCards.length - 1));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      print.current.scale.setScalar(0.4);
      setActive(idx);
    }
    print.current.scale.setScalar(MathUtils.damp(print.current.scale.x, 1, 5, delta));

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const lit = MathUtils.clamp(focus - i + 1, 0, 1);
      ring.material.color.copy(IDLE).lerp(HOT, lit);
      ring.material.opacity = 0.25 + lit * 0.6;
      ring.rotation.z = t * (0.25 + i * 0.12);
    });
  });

  const brand = (expCards[active].brand || expCards[active].title).toUpperCase();

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
        <group ref={print}>
          <mesh position={[0, 0.36, 0.3]}>
            <planeGeometry args={[0.14, 0.03]} />
            <meshBasicMaterial color="#c9f24b" />
          </mesh>
          <mesh position={[0, 0.318, 0.3]}>
            <planeGeometry args={[0.14, 0.03]} />
            <meshBasicMaterial color="#ff6a3d" />
          </mesh>
          <Text
            font={FONT}
            fontSize={0.06}
            letterSpacing={0.12}
            color="#1c2333"
            anchorX="left"
            anchorY="middle"
            rotation={[0, 0, -Math.PI / 2]}
            position={[-0.11, 0.18, 0.33]}
          >
            {brand}
          </Text>
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
        <mesh
          key={y}
          position={[0, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          ref={(el) => (rings.current[i] = el)}
        >
          <torusGeometry args={[0.55, 0.016, 8, 48]} />
          <meshBasicMaterial color="#55637a" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
};

export default JourneyRocket;
