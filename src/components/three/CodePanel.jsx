const LINE_SEED = [0.9, 0.5, 0.72, 0.38, 0.84, 0.6, 0.3, 0.66];

const CodePanel = ({ width = 0.9, height = 0.6, color = '#7ad7ff', lines = 6 }) => {
  const pad = width * 0.07;
  const rowH = (height - pad * 2) / lines;

  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#0a0e15" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, height / 2 - 0.02, 0.002]}>
        <planeGeometry args={[width, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      {Array.from({ length: lines }).map((_, i) => {
        const indent = i % 3 === 1 ? pad * 1.6 : 0;
        const w = LINE_SEED[i % LINE_SEED.length] * (width - pad * 2) - indent;
        return (
          <mesh
            key={i}
            position={[
              -width / 2 + pad + indent + w / 2,
              height / 2 - pad - rowH * (i + 0.5),
              0.003,
            ]}
          >
            <planeGeometry args={[w, rowH * 0.35]} />
            <meshBasicMaterial
              color={i % 4 === 0 ? color : '#3d4654'}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default CodePanel;
