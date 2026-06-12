import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Resize, useGLTF } from '@react-three/drei';
import DataPanel from './DataPanel';
import { sceneData } from '../../constants';

// "Satellite Dish" by Kenney (CC0) via poly.pizza
const DISH = '/models/satellite-dish.glb';
useGLTF.preload(DISH);

const ContactDish = () => {
  const { scene } = useGLTF(DISH);
  const dish = useRef(null);
  const waves = useRef([]);
  const beacon = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dish.current.rotation.y = Math.sin(t * 0.35) * 0.7;
    waves.current.forEach((wave, i) => {
      if (!wave) return;
      const p = (t * 0.45 + i / 3) % 1;
      wave.scale.setScalar(0.35 + p * 1.5);
      wave.material.opacity = (1 - p) * 0.5;
      wave.position.y = 0.7 + p * 0.8;
    });
    beacon.current.material.opacity = 0.4 + Math.abs(Math.sin(t * 2.5)) * 0.6;
  });

  return (
    <group position={[0, -0.25, 0]}>
      <mesh position={[0, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.75, 0.22, 24]} />
        <meshStandardMaterial color="#14141b" metalness={0.7} roughness={0.3} />
      </mesh>
      <group ref={dish} position={[0, 0.05, 0]}>
        <group scale={1.55}>
          <Resize>
            <Center>
              <primitive object={scene} />
            </Center>
          </Resize>
        </group>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, 0.7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          ref={(el) => (waves.current[i] = el)}
        >
          <torusGeometry args={[0.5, 0.012, 8, 48]} />
          <meshBasicMaterial color="#7ad7ff" transparent opacity={0.4} />
        </mesh>
      ))}
      <group position={[1.0, -0.35, 0.25]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#181820" metalness={0.6} />
        </mesh>
        <group rotation={[-0.25, 0, 0]}>
          <DataPanel
            width={0.78}
            height={0.5}
            lines={sceneData.contactScreen}
            color="#c9f24b"
            title="uplink"
          />
        </group>
      </group>
      <group position={[-0.95, -0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.75, 8]} />
          <meshStandardMaterial color="#26262e" metalness={0.7} />
        </mesh>
        <mesh ref={beacon} position={[0, 0.43, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ff6a3d" transparent />
        </mesh>
      </group>
    </group>
  );
};

export default ContactDish;
