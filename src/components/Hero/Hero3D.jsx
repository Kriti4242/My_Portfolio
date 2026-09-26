import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';

function Scene() {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#7C3AED" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#00E5FF" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#7C3AED"
            transparent
            opacity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh position={[5, 2, -3]} rotation={[0.3, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#38BDF8" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.2}>
        <mesh position={[-4, -2, -2]} rotation={[-0.4, -0.6, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#7C3AED" wireframe transparent opacity={0.2} />
        </mesh>
      </Float>

      <Stars radius={50} depth={30} count={500} factor={3} saturation={0} fade speed={0.5} />

      <Environment preset="city" />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-80">
      <Canvas className="block h-full w-full" camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
