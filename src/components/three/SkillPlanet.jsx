import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';

const FONT = '/fonts/jetbrains-mono.woff';

const SkillPlanet = ({ label, color, size, ring, moon, wireframe }) => {
  const moonPivot = useRef(null);

  useFrame((state) => {
    if (moonPivot.current) moonPivot.current.rotation.y = state.clock.elapsedTime * 1.7;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[size, 20, 20]} />
        <meshBasicMaterial color={color} wireframe={wireframe} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.45, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={wireframe ? 0.08 : 0.16} />
      </mesh>
      {ring && (
        <mesh rotation={[1.25, 0, 0.35]}>
          <torusGeometry args={[size * 1.8, 0.008, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
      )}
      {moon && (
        <group ref={moonPivot}>
          <group position={[size * 2.6, 0, 0]}>
            <mesh>
              <sphereGeometry args={[size * 0.32, 12, 12]} />
              <meshBasicMaterial color="#c8d4e4" />
            </mesh>
            <Billboard position={[0, -size * 0.8, 0]}>
              <Text font={FONT} fontSize={0.034} color="#5d6b80" anchorX="center" anchorY="top">
                {moon}
              </Text>
            </Billboard>
          </group>
        </group>
      )}
      <Billboard position={[0, -(size * 1.45 + 0.05), 0]}>
        <Text
          font={FONT}
          fontSize={0.056}
          letterSpacing={0.08}
          color={color}
          anchorX="center"
          anchorY="top"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
};

export default SkillPlanet;
