import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Small floating tech orb ─── */
function TechOrb({ position, color, speed = 1, floatIntensity = 0.4 }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3 * speed;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2 * speed) * 0.2;
    }
  });
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

/* ─── Floating code block (thin flat box with glow) ─── */
function CodePanel({ position, rotation = [0, 0, 0], width = 1.4, height = 0.9 }) {
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive="#7c3aed"
          emissiveIntensity={0.08}
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* screen glow lines */}
      {[0.25, 0.05, -0.15].map((y, i) => (
        <mesh key={i} position={[position[0] - 0.1, position[1] + y, position[2] + 0.025]} rotation={rotation}>
          <boxGeometry args={[width * 0.6 - i * 0.1, 0.025, 0.001]} />
          <meshBasicMaterial color={i === 0 ? '#00e5ff' : i === 1 ? '#7c3aed' : '#38bdf8'} transparent opacity={0.7} />
        </mesh>
      ))}
    </Float>
  );
}

/* ─── Laptop body (screen + base) ─── */
function Laptop({ position = [0, 0, 0] }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.6) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, -0.3, 0]}>
      {/* Base */}
      <mesh position={[0, -0.06, 0.1]}>
        <boxGeometry args={[2.2, 0.07, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Keyboard area (slightly recessed) */}
      <mesh position={[0, -0.015, 0.08]}>
        <boxGeometry args={[2.0, 0.01, 1.3]} />
        <meshStandardMaterial color="#16213e" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Screen hinge area */}
      <mesh position={[0, 0.02, -0.67]}>
        <boxGeometry args={[2.2, 0.07, 0.08]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen (tilted back ~110 degrees) */}
      <group position={[0, 0.02, -0.67]} rotation={[-Math.PI * 0.35, 0, 0]}>
        {/* Screen outer bezel */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2.2, 1.45, 0.07]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Screen inner (display) */}
        <mesh position={[0, 0.8, 0.04]}>
          <boxGeometry args={[2.0, 1.25, 0.01]} />
          <meshStandardMaterial
            color="#050816"
            emissive="#7c3aed"
            emissiveIntensity={0.12}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        {/* Screen glow lines (code simulation) */}
        {[0.4, 0.2, 0.0, -0.2, -0.35].map((y, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.1 : 0.15, 0.8 + y, 0.052]}>
            <boxGeometry args={[i % 3 === 0 ? 1.1 : i % 3 === 1 ? 0.8 : 0.6, 0.03, 0.001]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#7c3aed' : '#38bdf8'}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
        {/* Screen status dot */}
        <mesh position={[0, 1.38, 0.04]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
      </group>

      {/* Touchpad */}
      <mesh position={[0, -0.02, 0.4]}>
        <boxGeometry args={[0.65, 0.008, 0.42]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Floating geometric accent shapes ─── */
function AccentShape({ position, shape = 'torus', color = '#7c3aed', speed = 0.5 }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.y = t * 0.6;
  });
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        {shape === 'torus' ? (
          <torusGeometry args={[0.25, 0.08, 12, 32]} />
        ) : shape === 'oct' ? (
          <octahedronGeometry args={[0.22]} />
        ) : (
          <tetrahedronGeometry args={[0.2]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          wireframe={shape === 'oct'}
          transparent
          opacity={shape === 'oct' ? 0.7 : 1}
        />
      </mesh>
    </Float>
  );
}

/* ─── Ambient particles (small dots in 3D space) ─── */
function AmbientParticles({ count = 120 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.035} color="#7c3aed" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Main camera rig responding to mouse ─── */
function CameraRig({ mouse }) {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 0.5, 6));

  useFrame(() => {
    const targetX = basePos.current.x + mouse.current.x * 0.6;
    const targetY = basePos.current.y + mouse.current.y * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

/* ─── Full Scene ─── */
export default function DeveloperWorkspaceScene({ mouse }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 5, 3]} intensity={2.5} color="#7c3aed" />
      <pointLight position={[-5, 3, 2]} intensity={1.5} color="#00e5ff" />
      <pointLight position={[0, -3, 2]} intensity={0.8} color="#38bdf8" />
      <spotLight
        position={[0, 5, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#ffffff"
        castShadow={false}
      />

      {/* Camera rig */}
      <CameraRig mouse={mouse} />

      {/* Stars background */}
      <Stars radius={60} depth={30} count={350} factor={2.5} saturation={0} fade speed={0.3} />

      {/* Ambient particles */}
      <AmbientParticles count={100} />

      {/* Main laptop */}
      <Laptop position={[0, -0.3, 0]} />

      {/* Floating code panels */}
      <CodePanel position={[-3.2, 0.6, -1.5]} rotation={[0, 0.4, 0]} width={1.3} height={0.85} />
      <CodePanel position={[3.0, 0.8, -1.8]} rotation={[0, -0.5, 0]} width={1.1} height={0.75} />

      {/* Tech orbs floating around workspace */}
      <TechOrb position={[-2.5, 1.2, 0.5]} color="#61dafb" speed={1.2} floatIntensity={0.5} />
      <TechOrb position={[2.6, 1.4, 0.3]} color="#339933" speed={0.9} floatIntensity={0.4} />
      <TechOrb position={[-1.8, -1.2, 0.8]} color="#00758f" speed={1.4} floatIntensity={0.6} />
      <TechOrb position={[2.0, -1.0, 0.5]} color="#7c3aed" speed={1.0} floatIntensity={0.45} />
      <TechOrb position={[0.0, 1.8, -0.5]} color="#00e5ff" speed={0.8} floatIntensity={0.35} />
      <TechOrb position={[-0.8, -1.8, 0.2]} color="#f59e0b" speed={1.1} floatIntensity={0.5} />

      {/* Accent geometric shapes */}
      <AccentShape position={[-3.8, 0.0, -0.5]} shape="torus" color="#7c3aed" speed={0.6} />
      <AccentShape position={[3.5, -0.5, -0.8]} shape="oct" color="#00e5ff" speed={0.5} />
      <AccentShape position={[1.5, 2.2, -1.2]} shape="tet" color="#38bdf8" speed={0.7} />

      {/* Distorted sphere accent (subtle, background) */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[-4, -2, -3]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <MeshDistortMaterial
            color="#7c3aed"
            distort={0.3}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>
      <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh position={[4.5, 2, -4]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial
            color="#00e5ff"
            distort={0.25}
            speed={1.2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>
    </>
  );
}
