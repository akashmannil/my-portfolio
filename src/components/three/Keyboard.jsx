const ACCENT_KEYS = [3, 14, 27, 38, 41];

const Keyboard = ({ width = 1.1, accent = '#c9f24b' }) => {
  const rows = 4;
  const cols = 12;
  const depth = width * 0.34;
  const cell = (width * 0.92) / cols;

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#15151b" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[width * 1.04, 0.012, depth * 1.08]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <mesh
            key={i}
            position={[
              -width * 0.46 + cell * (c + 0.5),
              0.04,
              -depth * 0.42 + (depth * 0.84 * (r + 0.5)) / rows,
            ]}
            castShadow
          >
            <boxGeometry args={[cell * 0.78, 0.035, cell * 0.72]} />
            <meshStandardMaterial
              color={ACCENT_KEYS.includes(i) ? accent : '#26262e'}
              roughness={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Keyboard;
