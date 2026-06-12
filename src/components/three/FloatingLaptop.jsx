import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import DataPanel from './DataPanel';
import Keyboard from './Keyboard';
import { counterItems, sceneData } from '../../constants';

const FONT = '/fonts/jetbrains-mono.woff';
const CHIPS = [
  { pos: [-1.5, 0.75, 0.3], rot: [0, 0.5, 0], color: '#c9f24b' },
  { pos: [1.3, 1.0, -0.1], rot: [0, -0.45, 0], color: '#7ad7ff' },
  { pos: [1.15, -0.4, 0.55], rot: [0, -0.35, 0], color: '#ff6a3d' },
];

const FloatingLaptop = () => {
  const group = useRef(null);
  const lid = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.3;
    group.current.position.y = Math.sin(t * 1.1) * 0.06;
    lid.current.rotation.x = -0.32 + Math.sin(t * 0.6) * 0.05;
  });

  return (
    <group>
      <group ref={group}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.08, 1.1]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.7} roughness={0.3} />
        </mesh>
        <group position={[0, 0.05, 0.06]} scale={0.78}>
          <Keyboard width={1.6} />
        </group>
        <mesh position={[0, 0.045, 0.42]}>
          <boxGeometry args={[0.5, 0.01, 0.3]} />
          <meshStandardMaterial color="#23232c" roughness={0.4} />
        </mesh>
        <group ref={lid} position={[0, 0.04, -0.55]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.7, 1.1, 0.05]} />
            <meshStandardMaterial color="#1a1a22" metalness={0.7} roughness={0.3} />
          </mesh>
          <group position={[0, 0.55, 0.03]}>
            <DataPanel
              width={1.55}
              height={0.95}
              lines={sceneData.laptopScreen}
              color="#7ad7ff"
              title="akash@portfolio:~"
            />
          </group>
        </group>
      </group>
      {CHIPS.map(({ pos, rot, color }, i) => (
        <Float key={color} speed={2} rotationIntensity={0.15} floatIntensity={0.7}>
          <group position={pos} rotation={rot}>
            <mesh>
              <planeGeometry args={[0.85, 0.5]} />
              <meshStandardMaterial color="#0d1626" transparent opacity={0.92} />
            </mesh>
            <Text font={FONT} fontSize={0.12} color={color} anchorX="center" position={[0, 0.09, 0.004]}>
              {`${counterItems[i].value}${counterItems[i].suffix}`}
            </Text>
            <Text
              font={FONT}
              fontSize={0.042}
              color="#5d6b80"
              anchorX="center"
              maxWidth={0.7}
              textAlign="center"
              position={[0, -0.1, 0.004]}
            >
              {counterItems[i].label}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
};

export default FloatingLaptop;
