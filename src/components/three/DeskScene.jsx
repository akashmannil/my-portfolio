import { Float } from '@react-three/drei';
import DataPanel from './DataPanel';
import Keyboard from './Keyboard';
import { sceneData } from '../../constants';

const DeskScene = () => {
  return (
    <group position={[0, 0.2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.08, 1.25]} />
        <meshStandardMaterial color="#2b2118" roughness={0.7} />
      </mesh>
      {[
        [-1.25, -0.5],
        [-1.25, 0.5],
        [1.25, -0.5],
        [1.25, 0.5],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.56, z]} castShadow>
          <boxGeometry args={[0.08, 1.05, 0.08]} />
          <meshStandardMaterial color="#181820" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.06, -0.35]}>
        <boxGeometry args={[0.55, 0.04, 0.3]} />
        <meshStandardMaterial color="#181820" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.28, -0.35]}>
        <boxGeometry args={[0.07, 0.42, 0.07]} />
        <meshStandardMaterial color="#181820" metalness={0.6} />
      </mesh>
      <group position={[0, 0.68, -0.32]} rotation={[-0.06, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.1, 0.68, 0.06]} />
          <meshStandardMaterial color="#101016" metalness={0.7} roughness={0.3} />
        </mesh>
        <group position={[0, 0, 0.035]}>
          <DataPanel
            width={1.98}
            height={0.58}
            lines={sceneData.deskScreen}
            color="#c9f24b"
            title="terminal - zsh"
          />
        </group>
      </group>
      <group position={[-0.1, 0.07, 0.32]} scale={0.82}>
        <Keyboard width={1.2} />
      </group>
      <mesh position={[0.75, 0.07, 0.32]} castShadow>
        <boxGeometry args={[0.13, 0.05, 0.2]} />
        <meshStandardMaterial color="#26262e" roughness={0.5} />
      </mesh>
      <group position={[-1.05, 0.16, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.18, 16]} />
          <meshStandardMaterial color="#7a1f2b" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.045, 0.012, 8, 16]} />
          <meshStandardMaterial color="#7a1f2b" roughness={0.6} />
        </mesh>
      </group>
      <group position={[1.05, -0.65, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.75, 0.6]} />
          <meshStandardMaterial color="#14141b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0.25, 0.305]}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshBasicMaterial color="#c9f24b" />
        </mesh>
      </group>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
        <group position={[-1.7, 1.1, 0.2]} rotation={[0, 0.55, 0]}>
          <DataPanel
            width={0.8}
            height={0.5}
            lines={[
              { text: 'focus: quality', tone: 'base' },
              { text: 'comms: reliable', tone: 'base' },
              { text: 'delivery: on time', tone: 'accent' },
            ]}
            color="#7ad7ff"
            title="values.json"
          />
        </group>
      </Float>
    </group>
  );
};

export default DeskScene;
