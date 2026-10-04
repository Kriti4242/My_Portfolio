/**
 * DeveloperWorldScene — adaptive 3D environment for desktop & mobile.
 *
 * Desktop:
 *  - Full 3D tech universe with slow rotations, particle trails, parallax, and depth.
 *
 * Mobile / Reduced Motion:
 *  - Completely static or extremely subtle composition.
 *  - No continuous rotation or distracting movement behind Hero text.
 *  - Greatly reduced particle count and lighting complexity.
 *  - Objects positioned to never collide with mobile text or buttons.
 */

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ── Utility: lerp ─────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ── Camera rig — reads shared target ref ──────────────────────────────────────
export function WorldCameraRig({ cameraTargetRef, isMobile = false }) {
  const { camera } = useThree();

  useFrame(() => {
    const t  = cameraTargetRef.current;
    const mx = isMobile ? 0 : (t.mouse?.x ?? 0);
    const my = isMobile ? 0 : (t.mouse?.y ?? 0);

    const px = t.position[0] + mx * 0.35;
    const py = t.position[1] + my * 0.2;
    const pz = t.position[2];

    camera.position.x += (px - camera.position.x) * 0.04;
    camera.position.y += (py - camera.position.y) * 0.04;
    camera.position.z += (pz - camera.position.z) * 0.04;
    camera.lookAt(t.lookAt[0], t.lookAt[1], t.lookAt[2]);
  });

  return null;
}

// ── Scene lighting ─────────────────────────────────────────────────────────────
function SceneLighting({ isLight = false, isMobile = false }) {
  const purpleRef = useRef();
  const cyanRef   = useRef();

  useFrame(({ clock }) => {
    if (isMobile) return; // Static lighting on mobile
    const t = clock.getElapsedTime();
    if (purpleRef.current) {
      purpleRef.current.intensity = isLight ? 1.2 : (1.8 + Math.sin(t * 0.7) * 0.3);
    }
    if (cyanRef.current) {
      cyanRef.current.intensity = isLight ? 1.0 : (1.2 + Math.sin(t * 0.5 + 1) * 0.25);
    }
  });

  return (
    <>
      <ambientLight intensity={isLight ? 0.75 : 0.25} />
      <pointLight ref={purpleRef} position={[3, 5, 4]}   color="#7c3aed" intensity={isLight ? 1.2 : 1.8} distance={22} />
      <pointLight ref={cyanRef}   position={[-4, 3, 2]}  color={isLight ? '#38bdf8' : '#00e5ff'} intensity={isLight ? 1.0 : 1.2} distance={20} />
      <pointLight                 position={[0, -2, 3]}  color="#38bdf8" intensity={isLight ? 0.3 : 0.55} distance={12} />
      {!isMobile && (
        <>
          <pointLight position={[-2, 4, -4]} color="#7c3aed" intensity={isLight ? 0.8 : 1.4} distance={14} />
          <pointLight position={[2, 2, -5]}  color="#00e5ff" intensity={isLight ? 0.6 : 1.0} distance={12} />
          <pointLight position={[0, 3, -9]}  color="#7c3aed" intensity={0.9} distance={12} />
          <pointLight position={[0, 3, -13]} color="#00e5ff" intensity={0.8} distance={12} />
          <pointLight position={[0, 3, -17]} color="#38bdf8" intensity={0.6} distance={12} />
        </>
      )}
    </>
  );
}

// ── Ambient particles ──────────────────────────────────────────────────────────
function AmbientParticles({ count = 160, spread = [22, 12, 28], offsetZ = 0, opacity = 0.35 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.486, 0.227, 0.929], // #7c3aed
      [0.000, 0.898, 1.000], // #00e5ff
      [0.220, 0.741, 0.984], // #38bdf8
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2] + offsetZ;
      const c = palette[i % 3];
      cols[i * 3]     = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    return g;
  }, [count, spread, offsetZ]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </points>
  );
}

// ── Connection line with traveling bead (Desktop only) ─────────────────────────
function TechConnection({ start, end, color = '#7c3aed', speed = 0.4, opacity = 0.35 }) {
  const beadRef = useRef();
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...start, ...end]), 3));
    return g;
  }, []); // eslint-disable-line

  useFrame(({ clock }) => {
    if (!beadRef.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    beadRef.current.position.set(
      lerp(start[0], end[0], t),
      lerp(start[1], end[1], t),
      lerp(start[2], end[2], t),
    );
    beadRef.current.material.opacity = 0.55 + Math.sin(t * Math.PI) * 0.45;
  });

  return (
    <>
      <line geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </line>
      <mesh ref={beadRef}>
        <sphereGeometry args={[0.028, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </>
  );
}

function GlowLine({ start, end, color = '#7c3aed', opacity = 0.3 }) {
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

// ── TechOrb (orbiting/floating) ────────────────────────────────────────────────
function TechOrb({ position, color, speed = 1, size = 0.14, isMobile = false }) {
  const ref = useRef();
  const initY = position[1];

  useFrame(({ clock }) => {
    if (isMobile || !ref.current) return;
    ref.current.rotation.y += 0.005 * speed;
    ref.current.position.y = initY + Math.sin(clock.getElapsedTime() * 0.5 * speed) * 0.12;
  });

  return (
    <Float speed={isMobile ? 0 : speed} rotationIntensity={isMobile ? 0 : 0.2} floatIntensity={isMobile ? 0 : 0.15}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={isMobile ? 0.45 : 0.7}
          roughness={0.1} metalness={0.85}
        />
      </mesh>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL CORE — KRITI.DEV holographic core (Hero zone)
// ─────────────────────────────────────────────────────────────────────────────
function HolographicCore({ position = [0, 0, 0], isMobile = false }) {
  const coreRef   = useRef();
  const ring1Ref  = useRef();
  const ring2Ref  = useRef();
  const ring3Ref  = useRef();
  const glowRef   = useRef();

  useFrame(({ clock }) => {
    if (isMobile) return; // Completely static on mobile to avoid distraction
    const t = clock.getElapsedTime();
    if (coreRef.current)  coreRef.current.rotation.y = t * 0.18;
    if (ring1Ref.current) { ring1Ref.current.rotation.z = t * 0.22; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x = t * 0.15; }
    if (ring3Ref.current) { ring3Ref.current.rotation.y = t * -0.12; }
    if (glowRef.current)  glowRef.current.material.emissiveIntensity = 0.3 + Math.sin(t * 0.8) * 0.15;
  });

  const satellites = useMemo(() => {
    if (isMobile) {
      return [
        { angle: 0,              r: 0.95, color: '#61DAFB', y: 0.1  }, // React
        { angle: Math.PI * 0.8,  r: 0.95, color: '#339933', y: -0.1 }, // Node
        { angle: Math.PI * 1.5,  r: 0.95, color: '#38BDF8', y: 0.15 }, // Tailwind
      ];
    }
    return [
      { angle: 0,                 r: 1.15, color: '#61DAFB', y: 0.1  }, // React
      { angle: Math.PI * 2/3,    r: 1.15, color: '#339933', y: -0.1 }, // Node
      { angle: Math.PI * 4/3,    r: 1.15, color: '#47A248', y: 0.05 }, // Mongo
      { angle: Math.PI / 3,       r: 1.45, color: '#F7DF1E', y: 0.2  }, // JS
      { angle: Math.PI,           r: 1.45, color: '#38BDF8', y: -0.2 }, // Tailwind
      { angle: Math.PI * 5/3,    r: 1.45, color: '#F05032', y: 0.15 }, // Git
    ];
  }, [isMobile]);

  return (
    <group position={position} scale={isMobile ? 0.75 : 1}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={isMobile ? 0.2 : 0.35}
          transparent
          opacity={isMobile ? 0.06 : 0.10}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>

      {/* Inner core — distorted sphere */}
      <Float speed={isMobile ? 0 : 0.6} rotationIntensity={isMobile ? 0 : 0.08} floatIntensity={isMobile ? 0 : 0.06}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.38, 2]} />
          <MeshDistortMaterial
            color="#1e0a3c"
            emissive="#7c3aed"
            emissiveIntensity={isMobile ? 0.4 : 0.55}
            distort={isMobile ? 0.08 : 0.18}
            speed={isMobile ? 0 : 1.5}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* Ring 1 — equatorial */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.60, 0.01, 8, 64]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={isMobile ? 0.5 : 0.75} />
      </mesh>

      {/* Ring 2 — tilted */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.78, 0.008, 8, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={isMobile ? 0.4 : 0.55} />
      </mesh>

      {!isMobile && (
        <mesh ref={ring3Ref} rotation={[0, Math.PI / 6, Math.PI / 4]}>
          <torusGeometry args={[1.0, 0.007, 8, 80]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Core point light */}
      <pointLight color="#7c3aed" intensity={isMobile ? 1.2 : 2.5} distance={5} />
      <pointLight color="#00e5ff" intensity={isMobile ? 0.6 : 1.0} distance={3} />

      {/* Satellite tech nodes */}
      {satellites.map(({ angle, r, color, y }, i) => (
        <CoreSatellite key={i} angle={angle} radius={r} color={color} baseY={y} idx={i} isMobile={isMobile} />
      ))}
    </group>
  );
}

function CoreSatellite({ angle: initAngle, radius, color, baseY, idx, isMobile = false }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (isMobile || !ref.current) return;
    const t = clock.getElapsedTime() * 0.20 + initAngle;
    ref.current.position.set(
      Math.cos(t) * radius,
      baseY + Math.sin(clock.getElapsedTime() * 0.4 + idx) * 0.06,
      Math.sin(t) * radius * 0.35,
    );
    ref.current.rotation.y += 0.012;
  });

  // Default initial position on mobile
  const initX = Math.cos(initAngle) * radius;
  const initZ = Math.sin(initAngle) * radius * 0.35;

  return (
    <mesh ref={ref} position={[initX, baseY, initZ]}>
      <octahedronGeometry args={[isMobile ? 0.065 : 0.085, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isMobile ? 0.6 : 0.85}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO ZONE — Developer Desk
// ─────────────────────────────────────────────────────────────────────────────
const matDesk   = { color: '#1a1a2e', roughness: 0.3, metalness: 0.8 };
const matScreen = { color: '#050816', emissive: '#7c3aed', emissiveIntensity: 0.14, roughness: 0.1, metalness: 0.2 };

function MonitorScreen({ position = [0, 0, 0], isMobile = false }) {
  const screenRef = useRef();

  useFrame(({ clock }) => {
    if (isMobile || !screenRef.current) return;
    screenRef.current.emissiveIntensity = 0.12 + Math.sin(clock.getElapsedTime() * 0.9) * 0.04;
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.52, 0.05]}>
        <cylinderGeometry args={[0.06, 0.12, 0.55, 12]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      <mesh position={[0, -0.82, 0.05]}>
        <boxGeometry args={[0.9, 0.06, 0.5]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.4, 1.45, 0.09]} />
        <meshStandardMaterial {...matDesk} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[2.2, 1.28, 0.01]} />
        <meshStandardMaterial ref={screenRef} {...matScreen} />
      </mesh>
      {[0.32, 0.17, 0.02, -0.13, -0.28].map((y, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -0.15 : 0.2, 0.1 + y, 0.062]}>
          <boxGeometry args={[i % 3 === 0 ? 1.1 : i % 3 === 1 ? 0.75 : 0.55, 0.028, 0.001]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#7c3aed' : '#38bdf8'}
            transparent opacity={0.85}
          />
        </mesh>
      ))}
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

function DeskLamp({ position = [0, 0, 0], isMobile = false }) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (isMobile || !lightRef.current) return;
    lightRef.current.intensity = 1.8 + Math.sin(clock.getElapsedTime() * 0.55) * 0.2;
  });

  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[0.12, 0.15, 0.06, 12]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.02, 0.02, 0.7, 8]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0.15, 0.72, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.12, 0.2, 12, 1, true]} /><meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} /></mesh>
      <pointLight ref={lightRef} position={[0.15, 0.65, 0]} color="#ffe4b5" intensity={isMobile ? 1.2 : 1.8} distance={3} />
    </group>
  );
}

function FloatingTerminal({ position = [0, 0, 0] }) {
  const ref = useRef();
  const initY = position[1];
  const scanRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.position.y = initY + Math.sin(t * 0.3) * 0.08;
    if (scanRef.current) {
      scanRef.current.position.y = -0.32 + ((t * 0.5) % 0.65);
      scanRef.current.material.opacity = 0.15 + Math.abs(Math.sin(t * 0.8)) * 0.2;
    }
  });

  const lines = [0.22, 0.11, 0, -0.11, -0.22, -0.33];
  const lineWidths = [0.7, 0.52, 0.8, 0.35, 0.65, 0.45];
  const lineColors = ['#00e5ff', '#7c3aed', '#38bdf8', '#7c3aed', '#00e5ff', '#38bdf8'];

  return (
    <group ref={ref} position={position} rotation={[0, -0.28, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 0.9, 0.045]} />
        <meshStandardMaterial color="#0d1117" emissive="#00e5ff" emissiveIntensity={0.04} roughness={0.2} metalness={0.7} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, 0.024]}>
        <boxGeometry args={[1.34, 0.76, 0.003]} />
        <meshStandardMaterial color="#050816" emissive="#00e5ff" emissiveIntensity={0.08} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.405, 0.027]}>
        <boxGeometry args={[1.34, 0.09, 0.001]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.9} />
      </mesh>
      {[[-0.55, 0.405], [-0.47, 0.405], [-0.39, 0.405]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.028]}>
          <circleGeometry args={[0.025, 8]} />
          <meshBasicMaterial color={['#ff5f57', '#febc2e', '#28c840'][i]} />
        </mesh>
      ))}
      {lines.map((y, i) => (
        <mesh key={i} position={[-0.62 + lineWidths[i] / 2 - 0.67, y, 0.027]}>
          <boxGeometry args={[lineWidths[i], 0.022, 0.001]} />
          <meshBasicMaterial color={lineColors[i]} transparent opacity={0.60} />
        </mesh>
      ))}
      <mesh ref={scanRef} position={[0, 0, 0.028]}>
        <boxGeometry args={[1.34, 0.012, 0.001]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.20} />
      </mesh>
    </group>
  );
}

function DeveloperDesk({ position = [0, 0, 0], isMobile = false }) {
  const groupRef = useRef();
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (isMobile || !groupRef.current) return;
    groupRef.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.25) * 0.015;
  });

  const techOrbs = isMobile
    ? [
        { pos: [-1.8, 1.0, 0.2],  color: '#61DAFB', speed: 0 },
        { pos: [ 1.8, 1.0, 0.2],  color: '#339933', speed: 0 },
      ]
    : [
        { pos: [-2.2, 1.1, 0.3],  color: '#61DAFB', speed: 1.2 },
        { pos: [ 2.4, 1.3, 0.2],  color: '#339933', speed: 0.9 },
        { pos: [-1.5, 1.8, -0.4], color: '#00e5ff', speed: 0.8 },
        { pos: [ 1.8, 1.5, -0.5], color: '#7c3aed', speed: 1.0 },
      ];

  return (
    <group ref={groupRef} position={position} scale={isMobile ? 0.75 : 1} rotation={[0, 0.08, 0]}>
      {/* Desk surface */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4.8, 0.08, 2.0]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Legs */}
      {[[-2.1, -0.7, -0.8], [2.1, -0.7, -0.8], [-2.1, -0.7, 0.8], [2.1, -0.7, 0.8]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.08, 1.3, 0.08]} />
          <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <MonitorScreen position={[0, 0.75, -0.6]} isMobile={isMobile} />
      <Keyboard position={[0, -0.04, 0.35]} />
      {/* Mouse */}
      <mesh position={[0.9, -0.04, 0.3]}>
        <boxGeometry args={[0.16, 0.05, 0.26]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.7} />
      </mesh>
      <DeskLamp position={[-1.6, -0.06, -0.5]} isMobile={isMobile} />
      {/* Coffee mug */}
      <mesh position={[1.5, -0.01, -0.3]}>
        <cylinderGeometry args={[0.1, 0.09, 0.22, 12]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.4} metalness={0.3} emissive="#7c3aed" emissiveIntensity={0.1} />
      </mesh>
      {/* Floating tech orbs */}
      {techOrbs.map(({ pos, color, speed }, i) => (
        <TechOrb key={i} position={pos} color={color} speed={speed} isMobile={isMobile} />
      ))}
      {/* Floating terminal on desktop */}
      {!isMobile && (
        <FloatingTerminal position={[3.4, 0.6, -0.2]} />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH CONNECTION NETWORK (between Hero zone nodes — Desktop only)
// ─────────────────────────────────────────────────────────────────────────────
function HeroTechNetwork({ isMobile = false }) {
  if (isMobile) return null;

  const connections = [
    { start: [-2.2, 0.9, 0.3], end: [1.8, 1.0, -0.3],  color: '#7c3aed', speed: 0.35 },
    { start: [ 2.4, 1.0, 0.2], end: [-1.5, 1.4, -0.4], color: '#00e5ff', speed: 0.28 },
    { start: [-2.2, 0.9, 0.3], end: [-1.5, 1.4, -0.4], color: '#61DAFB', speed: 0.42 },
    { start: [ 1.8, 1.0, -0.3],end: [ 2.4, 1.0,  0.2], color: '#339933', speed: 0.38 },
  ];

  return (
    <>
      {connections.map((c, i) => (
        <TechConnection key={i} {...c} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS ZONE — Orbiting tech ecosystem
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_ORBS = [
  { color: '#61DAFB', orbit: 1.8, speed: 0.30, phase: 0.00, size: 0.16 }, // React
  { color: '#339933', orbit: 2.2, speed: 0.22, phase: 1.05, size: 0.14 }, // Node
  { color: '#47A248', orbit: 2.6, speed: 0.18, phase: 2.10, size: 0.14 }, // Mongo
  { color: '#F7DF1E', orbit: 2.0, speed: 0.26, phase: 3.14, size: 0.13 }, // JS
  { color: '#38BDF8', orbit: 2.4, speed: 0.20, phase: 0.70, size: 0.13 }, // Tailwind
  { color: '#3776AB', orbit: 3.0, speed: 0.15, phase: 1.80, size: 0.12 }, // Python
  { color: '#F05032', orbit: 2.8, speed: 0.17, phase: 2.80, size: 0.12 }, // Git
  { color: '#2496ED', orbit: 3.2, speed: 0.13, phase: 4.20, size: 0.11 }, // Docker
];

function OrbitingSkillOrb({ color, orbit, speed, phase, size = 0.14, isMobile = false }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (isMobile || !ref.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.x = Math.cos(t) * orbit;
    ref.current.position.y = Math.sin(t * 1.3) * 0.55;
    ref.current.position.z = Math.sin(t) * orbit * 0.30;
    ref.current.rotation.y += 0.008;
  });

  const initX = Math.cos(phase) * orbit;
  const initY = Math.sin(phase * 1.3) * 0.55;
  const initZ = Math.sin(phase) * orbit * 0.30;

  return (
    <mesh ref={ref} position={[initX, initY, initZ]}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isMobile ? 0.5 : 0.75} roughness={0.1} metalness={0.85} />
    </mesh>
  );
}

function SkillsLab({ centerZ = -4, isMobile = false }) {
  const coreRef = useRef();

  useFrame(({ clock }) => {
    if (isMobile || !coreRef.current) return;
    coreRef.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  const rings = isMobile ? [1.4, 2.0] : [1.8, 2.4, 3.0];
  const orbs  = isMobile ? SKILL_ORBS.slice(0, 4) : SKILL_ORBS;

  return (
    <group position={[0, 0.5, centerZ]} scale={isMobile ? 0.75 : 1}>
      <Float speed={isMobile ? 0 : 1} rotationIntensity={isMobile ? 0 : 0.3} floatIntensity={isMobile ? 0 : 0.15}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.42, 2]} />
          <MeshDistortMaterial
            color="#7c3aed" emissive="#7c3aed" emissiveIntensity={isMobile ? 0.35 : 0.45}
            distort={isMobile ? 0.1 : 0.22} speed={isMobile ? 0 : 2} roughness={0.05} metalness={0.9}
          />
        </mesh>
      </Float>

      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.008, 8, 64]} />
          <meshBasicMaterial color={['#7c3aed', '#00e5ff', '#38bdf8'][i]} transparent opacity={0.22} />
        </mesh>
      ))}

      {orbs.map((s, i) => (
        <OrbitingSkillOrb key={i} {...s} isMobile={isMobile} />
      ))}

      <pointLight color="#7c3aed" intensity={isMobile ? 1.0 : 1.8} distance={6} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT LAB ZONE
// ─────────────────────────────────────────────────────────────────────────────
const PROJECT_POSITIONS = [
  [-2.8, 0.5, -8.5], [ 2.8, 0.5, -8.5],
  [-2.0, 0.5, -9.8], [ 2.0, 0.5, -9.8],
  [ 0.0, 0.5, -9.1],
];
const PROJECT_COLORS = ['#7c3aed', '#00e5ff', '#38bdf8', '#f59e0b', '#47a248'];

function ProjectPanel({ index, color, position, isMobile = false }) {
  const ref = useRef();
  const initY = position[1];

  useFrame(({ clock }) => {
    if (isMobile || !ref.current) return;
    ref.current.position.y = initY + Math.sin(clock.getElapsedTime() * 0.4 + index * 1.1) * 0.08;
  });

  return (
    <group ref={ref} position={position} rotation={[0, -0.12 + index * 0.06, 0]}>
      <mesh>
        <boxGeometry args={[1.7, 1.1, 0.06]} />
        <meshStandardMaterial color="#0d1117" emissive={color} emissiveIntensity={0.07} roughness={0.2} metalness={0.7} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.034]}>
        <boxGeometry args={[1.54, 0.96, 0.004]} />
        <meshStandardMaterial color="#050816" emissive={color} emissiveIntensity={0.12} roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, 0.038]}>
        <boxGeometry args={[1.54, 0.15, 0.001]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      {[0.2, 0.06, -0.08, -0.22, -0.35].map((y, i) => (
        <mesh key={i} position={[-0.08, y, 0.038]}>
          <boxGeometry args={[i % 2 === 0 ? 1.0 : 0.68, 0.024, 0.001]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function ProjectLab({ projects, isMobile = false }) {
  const list = isMobile ? projects.slice(0, 3) : projects.slice(0, 5);
  return (
    <>
      {list.map((p, i) => (
        <ProjectPanel key={p.id} index={i} color={PROJECT_COLORS[i % PROJECT_COLORS.length]} position={PROJECT_POSITIONS[i]} isMobile={isMobile} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CORRIDOR ZONE
// ─────────────────────────────────────────────────────────────────────────────
const EXP_COLORS = { Internship: '#7c3aed', Professional: '#00e5ff', Education: '#f59e0b' };

function ExperienceMilestone({ type, index, z, isMobile = false }) {
  const color = EXP_COLORS[type] || '#7c3aed';
  const x = index % 2 === 0 ? -2.2 : 2.2;

  return (
    <Float speed={isMobile ? 0 : 0.45} rotationIntensity={isMobile ? 0 : 0.04} floatIntensity={isMobile ? 0 : 0.07}>
      <group position={[x, 0.5, z]}>
        <mesh>
          <boxGeometry args={[2.4, 1.0, 0.05]} />
          <meshStandardMaterial color="#0d1117" emissive={color} emissiveIntensity={0.055} roughness={0.2} metalness={0.6} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.485, 0.026]}>
          <boxGeometry args={[2.4, 0.03, 0.001]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function ExperienceCorridor({ experiences, isMobile = false }) {
  return (
    <group>
      {experiences.map((exp, i) => (
        <ExperienceMilestone key={exp.id} type={exp.type} index={i} z={-12 - i * 1.1} isMobile={isMobile} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY ROOM ZONE
// ─────────────────────────────────────────────────────────────────────────────
function GalleryFrame({ index, z, isMobile = false }) {
  const x = (index % 3 - 1) * 2.4;
  const y = Math.floor(index / 3) * -1.6 + 0.8;
  return (
    <Float speed={isMobile ? 0 : 0.45} rotationIntensity={isMobile ? 0 : 0.07} floatIntensity={isMobile ? 0 : 0.09}>
      <group position={[x, y, z]}>
        <mesh>
          <boxGeometry args={[1.6, 1.05, 0.06]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.7} emissive="#7c3aed" emissiveIntensity={0.04} />
        </mesh>
        <mesh position={[0, 0, 0.034]}>
          <boxGeometry args={[1.38, 0.88, 0.004]} />
          <meshStandardMaterial color="#050816" emissive="#00e5ff" emissiveIntensity={0.07} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function GalleryRoom({ items, isMobile = false }) {
  const count = isMobile ? Math.min(items.length, 3) : items.length;
  return (
    <>
      {items.slice(0, count).map((item, i) => (
        <GalleryFrame key={item.id} index={i} z={-16 - Math.floor(i / 3) * 1.2} isMobile={isMobile} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT ZONE — Neural network visualization
// ─────────────────────────────────────────────────────────────────────────────
function ContactNetwork({ isMobile = false }) {
  const nodes = useMemo(() => {
    const len = isMobile ? 6 : 14;
    return Array.from({ length: len }, (_, i) => ({
      x: (Math.random() - 0.5) * (isMobile ? 4 : 6),
      y: (Math.random() - 0.5) * (isMobile ? 2.5 : 3.5),
      z: -19 + (Math.random() - 0.5) * 2,
      color: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#00e5ff' : '#38bdf8',
      size: 0.05 + Math.random() * 0.05,
    }));
  }, [isMobile]);

  return (
    <>
      {nodes.map((n, i) => (
        <Float key={i} speed={isMobile ? 0 : 0.35 + i * 0.04} rotationIntensity={isMobile ? 0 : 0.1} floatIntensity={isMobile ? 0 : 0.2}>
          <mesh position={[n.x, n.y, n.z]}>
            <sphereGeometry args={[n.size, 8, 8]} />
            <meshBasicMaterial color={n.color} transparent opacity={isMobile ? 0.45 : 0.65} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE
// ─────────────────────────────────────────────────────────────────────────────
export default function DeveloperWorldScene({
  cameraTargetRef,
  projects = [],
  experiences = [],
  galleryItems = [],
  isMobile = false,
  reducedMotion = false,
  isLight = false,
}) {
  const isStatic = isMobile || reducedMotion;

  return (
    <>
      <SceneLighting isLight={isLight} isMobile={isStatic} />
      <WorldCameraRig cameraTargetRef={cameraTargetRef} isMobile={isStatic} />

      {/* Star field — completely static on mobile / reduced-motion */}
      <Stars
        radius={80}
        depth={40}
        count={isStatic ? 60 : 300}
        factor={isStatic ? 1.5 : 2.2}
        saturation={0}
        fade
        speed={isStatic ? 0 : 0.16}
      />

      {/* Ambient colored particles — low count on mobile */}
      <AmbientParticles
        count={isStatic ? 35 : 180}
        spread={isStatic ? [14, 8, 20] : [24, 14, 32]}
        offsetZ={-8}
        opacity={isStatic ? 0.18 : 0.38}
      />

      {/* ─── HERO ZONE ─── */}
      {/* Central holographic core — positioned to never obstruct mobile text */}
      <HolographicCore
        position={isStatic ? [1.2, 2.2, -2.5] : [-3.5, 1.2, 1.5]}
        isMobile={isStatic}
      />

      {/* Developer desk — lower and non-obtrusive on mobile */}
      <DeveloperDesk
        position={isStatic ? [0, -1.8, -1.5] : [0.4, -1.2, 0]}
        isMobile={isStatic}
      />

      {/* Tech connection network — desktop only */}
      <HeroTechNetwork isMobile={isStatic} />

      {/* ─── SKILLS ZONE ─── */}
      <SkillsLab centerZ={-4} isMobile={isStatic} />

      {/* ─── PROJECT LAB ─── */}
      {projects.length > 0 && <ProjectLab projects={projects} isMobile={isStatic} />}

      {/* ─── EXPERIENCE CORRIDOR ─── */}
      {experiences.length > 0 && <ExperienceCorridor experiences={experiences} isMobile={isStatic} />}

      {/* ─── GALLERY ROOM ─── */}
      {galleryItems.length > 0 && <GalleryRoom items={galleryItems} isMobile={isStatic} />}

      {/* ─── CONTACT NETWORK ─── */}
      <ContactNetwork isMobile={isStatic} />

      {/* Ground plane */}
      <mesh position={[0, -2.6, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial
          color={isLight ? '#d4d8e0' : '#050816'}
          transparent
          opacity={isLight ? 0.18 : 0.25}
          roughness={1}
        />
      </mesh>
    </>
  );
}
