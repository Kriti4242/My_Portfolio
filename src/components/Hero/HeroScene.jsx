import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Sphere, Stars } from '@react-three/drei';

function HeroObjects() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#7C3AED" />
      <pointLight position={[-8, -4, 6]} intensity={0.8} color="#00E5FF" />
      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.5} />
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#7C3AED"
            attach="material"
            distort={0.35}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh position={[2.2, 1, -1]} rotation={[0.4, 0.6, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#38BDF8" wireframe />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <HeroObjects />
        </Suspense>
      </Canvas>
    </div>
  );
}
