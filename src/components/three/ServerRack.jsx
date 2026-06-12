import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { counterItems } from '../../constants';

const FONT = '/fonts/jetbrains-mono.woff';
const UNITS = 6;
const LED_COLORS = ['#8cc84b', '#ffd43b', '#7ad7ff'];

const ServerRack = () => {
  const leds = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    leds.current.forEach((led, i) => {
      if (led) led.visible = Math.sin(t * (1.5 + (i % 5) * 0.8) + i * 1.7) > -0.2;
    });
  });

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.15, 2.15, 0.9]} />
        <meshStandardMaterial color="#101016" metalness={0.6} roughness={0.4} />
      </mesh>
      {Array.from({ length: UNITS }).map((_, u) => (
        <group key={u} position={[0, 0.85 - u * 0.34, 0.46]}>
          <mesh>
            <boxGeometry args={[1.0, 0.28, 0.04]} />
            <meshStandardMaterial color="#1b1b24" metalness={0.5} roughness={0.45} />
          </mesh>
          {[0, 1, 2].map((l) => (
            <mesh
              key={l}
              position={[-0.38 + l * 0.09, 0.07, 0.025]}
              ref={(el) => (leds.current[u * 3 + l] = el)}
            >
              <planeGeometry args={[0.04, 0.04]} />
              <meshBasicMaterial color={LED_COLORS[(u + l) % LED_COLORS.length]} />
            </mesh>
          ))}
          {counterItems[u] ? (
            <group>
              <Text
                font={FONT}
                fontSize={0.075}
                color="#c9f24b"
                anchorX="right"
                anchorY="middle"
                position={[0.44, 0.05, 0.025]}
              >
                {`${counterItems[u].value}${counterItems[u].suffix}`}
              </Text>
              <Text
                font={FONT}
                fontSize={0.026}
                color="#5d6b80"
                anchorX="right"
                anchorY="middle"
                maxWidth={0.62}
                textAlign="right"
                position={[0.44, -0.075, 0.025]}
              >
                {counterItems[u].label}
              </Text>
            </group>
          ) : (
            [0, 1, 2, 3].map((v) => (
              <mesh key={`v${v}`} position={[0.18 + v * 0.08, -0.04, 0.025]}>
                <planeGeometry args={[0.04, 0.14]} />
                <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
              </mesh>
            ))
          )}
        </group>
      ))}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, -1.12, 0.3]}>
          <boxGeometry args={[0.12, 0.08, 0.12]} />
          <meshStandardMaterial color="#181820" metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export default ServerRack;
