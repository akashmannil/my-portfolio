import { Text } from '@react-three/drei';

const FONT = '/fonts/jetbrains-mono.woff';
const TONES = { base: '#c8d4e4', dim: '#5d6b80' };

const DataPanel = ({ width = 1, height = 0.6, lines = [], color = '#7ad7ff', title }) => {
  const pad = width * 0.07;
  const bar = height * 0.11;
  const rowH = (height - bar - pad * 1.2) / Math.max(lines.length, 1);
  const fontSize = Math.min(rowH * 0.58, width * 0.052);

  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#0d1626" transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, height / 2 - bar / 2, 0.002]}>
        <planeGeometry args={[width, bar]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      {title && (
        <Text
          font={FONT}
          fontSize={bar * 0.42}
          color="#0d1626"
          anchorX="left"
          anchorY="middle"
          position={[-width / 2 + pad * 0.5, height / 2 - bar / 2, 0.004]}
        >
          {title}
        </Text>
      )}
      {lines.map((line, i) => (
        <Text
          key={`${line.text}-${i}`}
          font={FONT}
          fontSize={fontSize}
          color={line.tone === 'accent' ? color : TONES[line.tone] || TONES.base}
          anchorX="left"
          anchorY="middle"
          maxWidth={width - pad * 2}
          position={[-width / 2 + pad, height / 2 - bar - pad * 0.6 - rowH * (i + 0.5), 0.004]}
        >
          {line.text}
        </Text>
      ))}
    </group>
  );
};

export default DataPanel;
