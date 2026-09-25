/**
 * DeveloperWorldScene — the single continuous 3D environment.
 *
 * Zones laid out in Z-depth:
 *   Hero desk      z=0      (camera at z≈9)
 *   Skills         z=-4
 *   Projects       z=-8 to -10
 *   Experience     z=-12 to -15
 *   Gallery        z=-16 to -18
 *   Contact        z=-19
 */

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ── Camera rig — reads shared target ref ──────────────────────────────────────
export function WorldCameraRig({ cameraTargetRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const t  = cameraTargetRef.current;
    const mx = t.mouse?.x ?? 0;
    const my = t.mouse?.y ?? 0;

    // Target with mouse parallax
    const px = t.position[0] + mx * 0.35;
    const py = t.position[1] + my * 0.2;
    const pz = t.position[2];

    // Smooth interpolation
    camera.position.x += (px - camera.position.x) * 0.04;
    camera.position.y += (py - camera.position.y) * 0.04;
    camera.position.z += (pz - camera.position.z) * 0.04;

    camera.lookAt(t.lookAt[0], t.lookAt[1], t.lookAt[2]);
  });

  return null;
}

// ── Ambient particles ─────────────────────────────────────────────────────────
function AmbientParticles({ count = 180, spread = [22, 12, 28], offsetZ = 0 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2] + offsetZ;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, spread, offsetZ]);

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.03} color="#7c3aed" transparent opacity={0.42} sizeAttenuation />
    </points>
  );
}

// ── Glow line helper ──────────────────────────────────────────────────────────
function GlowLine({ start, end, color = '#7c3aed', opacity = 0.5 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...start, ...end]), 3));
    return g;
  }, []); // eslint-disable-line
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO ZONE — Developer Desk
// ─────────────────────────────────────────────────────────────────────────────
const matDesk   = { color: '#1a1a2e', roughness: 0.3, metalness: 0.8 };
const matScreen = { color: '#050816', emissive: '#7c3aed', emissiveIntensity: 0.14, roughness: 0.1, metalness: 0.2 };

function MonitorScreen({ position = [0, 0, 0] }) {
  const screenRef = useRef();
  useFrame(({ clock }) => {
    if (screenRef.current) {
      screenRef.current.emissiveIntensity =
        0.12 + Math.sin(clock.getElapsedTime() * 0.9) * 0.04;
    }
  });

  return (
    <group position={position}>
      {/* Stand */}
      <mesh position={[0, -0.52, 0.05]}>
        <cylinderGeometry args={[0.06, 0.12, 0.55, 12]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.82, 0.05]}>
        <boxGeometry args={[0.9, 0.06, 0.5]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.4, 1.45, 0.09]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[2.2, 1.28, 0.01]} />
        <meshStandardMaterial ref={screenRef} {...matScreen} />
      </mesh>
      {/* Code lines on screen */}
      {[0.32, 0.17, 0.02, -0.13, -0.28].map((y, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -0.15 : 0.2, 0.1 + y, 0.062]}>
          <boxGeometry args={[i % 3 === 0 ? 1.1 : i % 3 === 1 ? 0.75 : 0.55, 0.028, 0.001]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#7c3aed' : '#38bdf8'}
            transparent opacity={0.85}
          />
        </mesh>
      ))}
      {/* Camera dot */}
      <mesh position={[0, 0.78, 0.05]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
    </group>
  );
}

function Keyboard({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.4, 0.06, 0.45]} />
        <meshStandardMaterial color="#16213e" roughness={0.6} metalness={0.4} />
      </mesh>
      {[-0.14, -0.04, 0.06, 0.16].map((row, ri) =>
        Array.from({ length: 12 }, (_, ki) => (
          <mesh key={`${ri}-${ki}`} position={[-0.6 + ki * 0.11, 0.04, row]}>
            <boxGeometry args={[0.085, 0.025, 0.075]} />
            <meshStandardMaterial color="#1e2a3a" roughness={0.8} metalness={0.3} />
          </mesh>
        ))
      )}
    </group>
  );
}

function DeskLamp({ position = [0, 0, 0] }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(clock.getElapsedTime() * 0.55) * 0.2;
    }
  });
  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[0.12, 0.15, 0.06, 12]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.02, 0.02, 0.7, 8]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0.15, 0.72, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.12, 0.2, 12, 1, true]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} /></mesh>
      <pointLight ref={lightRef} position={[0.15, 0.65, 0]} color="#ffe4b5" intensity={1.8} distance={3} />
    </group>
  );
}

function DeveloperDesk({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.25) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, 0.08, 0]}>
      {/* Desk surface */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4.8, 0.08, 2.0]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Desk legs */}
      {[[-2.1, -0.7, -0.8], [2.1, -0.7, -0.8], [-2.1, -0.7, 0.8], [2.1, -0.7, 0.8]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.08, 1.3, 0.08]} />
          <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <MonitorScreen position={[0, 0.75, -0.6]} />
      <Keyboard position={[0, -0.04, 0.35]} />
      {/* Mouse */}
      <mesh position={[0.9, -0.04, 0.3]}>
        <boxGeometry args={[0.16, 0.05, 0.26]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.7} />
      </mesh>
      <DeskLamp position={[-1.6, -0.06, -0.5]} />
      {/* Coffee mug */}
      <mesh position={[1.5, -0.01, -0.3]}>
        <cylinderGeometry args={[0.1, 0.09, 0.22, 12]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.4} metalness={0.3} emissive="#7c3aed" emissiveIntensity={0.08} />
      </mesh>
      {/* Plant pot */}
      <mesh position={[-1.6, -0.06, 0.5]}>
        <cylinderGeometry args={[0.08, 0.07, 0.14, 8]} />
        <meshStandardMaterial color="#2d1b00" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-1.6, 0.09, 0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.8} metalness={0} />
      </mesh>
      {/* Floating tech orbs above desk */}
      {[
        { pos: [-2.2, 1.1, 0.3], color: '#61DAFB', speed: 1.2 },
        { pos: [ 2.4, 1.3, 0.2], color: '#339933', speed: 0.9 },
        { pos: [-1.5, 1.8, -0.4], color: '#00e5ff', speed: 0.8 },
        { pos: [ 1.8, 1.5, -0.5], color: '#7c3aed', speed: 1.0 },
      ].map(({ pos, color, speed }, i) => (
        <TechOrb key={i} position={pos} color={color} speed={speed} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS ZONE
// ─────────────────────────────────────────────────────────────────────────────
function TechOrb({ position, color, speed = 1, size = 0.14 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.005 * speed;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5 * speed) * 0.12;
  });
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.15}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} roughness={0.1} metalness={0.8} />
      </mesh>
    </Float>
  );
}

const SKILL_ORBS = [
  { color: '#61DAFB', orbit: 1.8, speed: 0.30, phase: 0.00 },
  { color: '#339933', orbit: 2.2, speed: 0.22, phase: 1.05 },
  { color: '#47A248', orbit: 2.6, speed: 0.18, phase: 2.10 },
  { color: '#F7DF1E', orbit: 2.0, speed: 0.26, phase: 3.14 },
  { color: '#38BDF8', orbit: 2.4, speed: 0.20, phase: 0.70 },
  { color: '#3776AB', orbit: 3.0, speed: 0.15, phase: 1.80 },
  { color: '#F05032', orbit: 2.8, speed: 0.17, phase: 2.80 },
  { color: '#2496ED', orbit: 3.2, speed: 0.13, phase: 4.20 },
];

function OrbitingSkillOrb({ color, orbit, speed, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.x = Math.cos(t) * orbit;
    ref.current.position.y = Math.sin(t * 1.3) * 0.55;
    ref.current.position.z = Math.sin(t) * orbit * 0.28;
    ref.current.rotation.y += 0.006;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.1} metalness={0.8} />
    </mesh>
  );
}

function SkillsLab({ centerZ = -4 }) {
  return (
    <group position={[0, 0.5, centerZ]}>
      {/* Core */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.15}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial
            color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4}
            distort={0.25} speed={2} roughness={0.1} metalness={0.8}
          />
        </mesh>
      </Float>
      {/* Orbit rings */}
      {[1.8, 2.4, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.008, 8, 80]} />
          <meshBasicMaterial color={['#7c3aed', '#00e5ff', '#38bdf8'][i]} transparent opacity={0.22} />
        </mesh>
      ))}
      {/* Skill orbs */}
      {SKILL_ORBS.map((s, i) => (
        <OrbitingSkillOrb key={i} {...s} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT LAB ZONE
// ─────────────────────────────────────────────────────────────────────────────
const PROJECT_POSITIONS = [
  [-2.8, 0.5, -8.5],
  [ 2.8, 0.5, -8.5],
  [-2.0, 0.5, -9.8],
  [ 2.0, 0.5, -9.8],
  [ 0.0, 0.5, -9.0],
];
const PROJECT_COLORS = ['#7c3aed', '#00e5ff', '#38bdf8', '#f59e0b', '#47a248'];

function ProjectPanel({ index, color, position }) {
  const ref = useRef();
  const initY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = initY + Math.sin(clock.getElapsedTime() * 0.4 + index * 1.1) * 0.08;
  });

  return (
    <group ref={ref} position={position} rotation={[0, -0.12 + index * 0.06, 0]}>
      {/* Panel body */}
      <mesh>
        <boxGeometry args={[1.7, 1.1, 0.06]} />
        <meshStandardMaterial color="#0d1117" emissive={color} emissiveIntensity={0.07} roughness={0.2} metalness={0.7} transparent opacity={0.9} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.034]}>
        <boxGeometry args={[1.54, 0.96, 0.004]} />
        <meshStandardMaterial color="#050816" emissive={color} emissiveIntensity={0.11} roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Title bar */}
      <mesh position={[0, 0.4, 0.038]}>
        <boxGeometry args={[1.54, 0.15, 0.001]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Code lines */}
      {[0.2, 0.06, -0.08, -0.22, -0.35].map((y, i) => (
        <mesh key={i} position={[-0.08, y, 0.038]}>
          <boxGeometry args={[i % 2 === 0 ? 1.0 : 0.68, 0.024, 0.001]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Corner accent dots */}
      {[[-0.72, 0.47], [0.72, 0.47], [-0.72, -0.47], [0.72, -0.47]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.038]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      {/* Bottom frame line */}
      <GlowLine start={[-0.85, -0.58, 0.06]} end={[0.85, -0.58, 0.06]} color={color} opacity={0.4} />
    </group>
  );
}

function ProjectLab({ projects }) {
  return (
    <>
      {projects.slice(0, 5).map((p, i) => (
        <ProjectPanel
          key={p.id} index={i}
          color={PROJECT_COLORS[i % PROJECT_COLORS.length]}
          position={PROJECT_POSITIONS[i]}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CORRIDOR ZONE
// ─────────────────────────────────────────────────────────────────────────────
const EXP_TYPE_COLORS = { Internship: '#7c3aed', Professional: '#00e5ff', Education: '#f59e0b' };

function ExperienceMilestone({ type, index, z }) {
  const color = EXP_TYPE_COLORS[type] || '#7c3aed';
  const x = index % 2 === 0 ? -2.2 : 2.2;

  return (
    <Float speed={0.45} rotationIntensity={0.04} floatIntensity={0.07}>
      <group position={[x, 0.5, z]}>
        <mesh>
          <boxGeometry args={[2.4, 1.0, 0.05]} />
          <meshStandardMaterial color="#0d1117" emissive={color} emissiveIntensity={0.055} roughness={0.2} metalness={0.6} transparent opacity={0.9} />
        </mesh>
        {/* Top accent bar */}
        <mesh position={[0, 0.485, 0.026]}>
          <boxGeometry args={[2.4, 0.03, 0.001]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        {/* Type indicator dot */}
        <mesh position={[index % 2 === 0 ? 1.25 : -1.25, 0, 0.04]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Content bars */}
        {[0.22, 0.06, -0.1, -0.26].map((y, i) => (
          <mesh key={i} position={[-0.7 + (i % 2) * 0.3, y, 0.027]}>
            <boxGeometry args={[i === 0 ? 1.4 : i === 1 ? 1.2 : i === 2 ? 1.0 : 0.8, 0.025, 0.001]} />
            <meshBasicMaterial color={i === 0 ? '#ffffff' : color} transparent opacity={i === 0 ? 0.55 : 0.35} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function ExperienceCorridor({ experiences }) {
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([0, 0.5, -11.5, 0, 0.5, -15.5]), 3
    ));
    return g;
  }, []);

  return (
    <group>
      <line geometry={lineGeo}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </line>
      {experiences.map((exp, i) => (
        <ExperienceMilestone key={exp.id} type={exp.type} index={i} z={-12 - i * 1.1} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY ROOM ZONE
// ─────────────────────────────────────────────────────────────────────────────
function GalleryFrame({ index, z }) {
  const x = (index % 3 - 1) * 2.4;
  const y = Math.floor(index / 3) * -1.6 + 0.8;
  return (
    <Float speed={0.45} rotationIntensity={0.07} floatIntensity={0.09}>
      <group position={[x, y, z]}>
        <mesh>
          <boxGeometry args={[1.6, 1.05, 0.06]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.7} emissive="#7c3aed" emissiveIntensity={0.04} />
        </mesh>
        <mesh position={[0, 0, 0.034]}>
          <boxGeometry args={[1.38, 0.88, 0.004]} />
          <meshStandardMaterial color="#050816" emissive="#00e5ff" emissiveIntensity={0.07} roughness={0.1} />
        </mesh>
        {/* Corner accents */}
        {[[-0.72, 0.50], [0.72, 0.50], [-0.72, -0.50], [0.72, -0.50]].map(([cx, cy], i) => (
          <mesh key={i} position={[cx, cy, 0.036]}>
            <boxGeometry args={[0.1, 0.012, 0.001]} />
            <meshBasicMaterial color="#7c3aed" transparent opacity={0.75} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function GalleryRoom({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <GalleryFrame key={item.id} index={i} z={-16 - Math.floor(i / 3) * 1.2} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT ZONE — Floating network
// ─────────────────────────────────────────────────────────────────────────────
function ContactNetwork() {
  const nodes = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 3.5,
      z: -19 + (Math.random() - 0.5) * 2.5,
      color: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#00e5ff' : '#38bdf8',
      size: 0.05 + Math.random() * 0.06,
    }))
  , []);

  return (
    <>
      {nodes.map((n, i) => (
        <Float key={i} speed={0.35 + i * 0.04} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[n.x, n.y, n.z]}>
            <sphereGeometry args={[n.size, 8, 8]} />
            <meshBasicMaterial color={n.color} transparent opacity={0.65} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE LIGHTING
// ─────────────────────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      {/* Hero desk */}
      <pointLight position={[3, 5, 2]}   color="#7c3aed" intensity={2.0} />
      <pointLight position={[-4, 3, 1]}  color="#00e5ff" intensity={1.4} />
      <pointLight position={[0, -2, 3]}  color="#38bdf8" intensity={0.6} />
      {/* Skills */}
      <pointLight position={[-2, 4, -4]} color="#7c3aed" intensity={1.5} />
      <pointLight position={[2, 2, -5]}  color="#00e5ff" intensity={1.0} />
      {/* Projects */}
      <pointLight position={[0, 3, -9]}  color="#7c3aed" intensity={1.2} />
      {/* Experience */}
      <pointLight position={[0, 3, -13]} color="#00e5ff" intensity={1.0} />
      {/* Gallery / Contact */}
      <pointLight position={[0, 3, -17]} color="#38bdf8" intensity={0.8} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function DeveloperWorldScene({
  cameraTargetRef,
  projects = [],
  experiences = [],
  galleryItems = [],
}) {
  return (
    <>
      <SceneLighting />
      <WorldCameraRig cameraTargetRef={cameraTargetRef} />

      {/* Star field */}
      <Stars radius={80} depth={40} count={380} factor={2.5} saturation={0} fade speed={0.22} />

      {/* Ambient particles */}
      <AmbientParticles count={200} spread={[24, 14, 32]} offsetZ={-8} />

      {/* ZONE 1 — Hero desk */}
      <DeveloperDesk position={[0.4, -1.2, 0]} />

      {/* ZONE 2-3 — Skills Lab */}
      <SkillsLab centerZ={-4} />

      {/* ZONE 4 — Project Lab */}
      {projects.length > 0 && <ProjectLab projects={projects} />}

      {/* ZONE 5 — Experience Corridor */}
      {experiences.length > 0 && <ExperienceCorridor experiences={experiences} />}

      {/* ZONE 6 — Gallery Room */}
      {galleryItems.length > 0 && <GalleryRoom items={galleryItems} />}

      {/* ZONE 7 — Contact Network */}
      <ContactNetwork />

      {/* Ground plane (subtle) */}
      <mesh position={[0, -2.6, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#050816" transparent opacity={0.28} roughness={1} />
      </mesh>
    </>
  );
}
