import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Float } from '@react-three/drei';
import FloatingLaptop from './FloatingLaptop';
import DeskScene from './DeskScene';
import JourneyRocket from './JourneyRocket';
import TechSphere from './TechSphere';
import ProjectCards3D from './ProjectCards3D';
import ServerRack from './ServerRack';
import ContactDish from './ContactDish';
import { computeStagePose, stageSequence } from './stagePose';
import { COMPACT_MAX_WIDTH, prefersReducedMotion } from './responsive';

// world-unit gap kept between an actor and the frustum edge so its body
// never clips off-screen; larger than the widest scene's half-width
const EDGE_PAD = 0.9;

const SCENES = {
  laptop: FloatingLaptop,
  desk: DeskScene,
  rocket: JourneyRocket,
  sphere: TechSphere,
  cards: ProjectCards3D,
  rack: ServerRack,
  dish: ContactDish,
};

const MorphRig = () => {
  const stage = useRef(null);
  const glow = useRef(null);
  const actors = useRef([]);
  const pose = useMemo(() => ({}), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state, delta) => {
    computeStagePose(pose);

    // Responsive framing: the poses use world-space X offsets tuned for a wide
    // landscape frustum. On narrower screens the visible horizontal span
    // (tan(fov/2) * z * aspect) shrinks, so clamp X to keep every actor on
    // screen, and shrink it to an ambient backdrop on tablet/phone. Desktop
    // aspects leave the widest offsets untouched, so their look is unchanged.
    const { camera, size } = state;
    const aspect = size.width / size.height;
    const halfWidth = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * aspect;
    const safeX = Math.max(halfWidth - EDGE_PAD, 0.1);
    if (Math.abs(pose.x) > safeX) pose.x *= safeX / Math.abs(pose.x);
    if (size.width < COMPACT_MAX_WIDTH) pose.scale *= 0.82;

    const g = stage.current;
    g.position.x = MathUtils.damp(g.position.x, pose.x, 2.5, delta);
    g.position.y = MathUtils.damp(g.position.y, pose.y, 2.5, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, pose.rx, 2.5, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, pose.ry, 2, delta);

    actors.current.forEach((actor, i) => {
      if (!actor) return;
      const d = Math.min(Math.abs(pose.actor - i), 1);
      const presence = 1 - d * d * (3 - 2 * d);
      const target = Math.max(presence * pose.scale, 0.001);
      actor.scale.setScalar(MathUtils.damp(actor.scale.x, target, 2.5, delta));
      actor.position.y = MathUtils.damp(actor.position.y, (1 - presence) * -1.4, 2.5, delta);
      actor.rotation.y = MathUtils.damp(actor.rotation.y, (1 - presence) * 1.3, 2.5, delta);
      actor.visible = actor.scale.x > 0.012;
    });

    const c = glow.current.color;
    c.r = MathUtils.damp(c.r, pose.cr, 3, delta);
    c.g = MathUtils.damp(c.g, pose.cg, 3, delta);
    c.b = MathUtils.damp(c.b, pose.cb, 3, delta);
    glow.current.intensity = size.width < COMPACT_MAX_WIDTH ? 8 : 12;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.2}
      rotationIntensity={reduced ? 0 : 0.08}
      floatIntensity={reduced ? 0 : 0.35}
    >
      <group ref={stage}>
        {stageSequence.map((key, i) => {
          const Scene = SCENES[key];
          return (
            <group key={key} ref={(el) => (actors.current[i] = el)} scale={i === 0 ? 1 : 0.001}>
              <Scene />
            </group>
          );
        })}
        <pointLight ref={glow} intensity={12} distance={9} position={[0, 0.5, 1.5]} />
      </group>
    </Float>
  );
};

export default MorphRig;
