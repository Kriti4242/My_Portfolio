/**
 * DeveloperWorld — top-level 3D experience canvas.
 *
 * This replaces DeveloperWorkspace as the primary 3D layer rendered in Hero.
 * It spans the full viewport and sits behind all page content.
 *
 * Exposes `navigateToZone` via a stable event so Navbar can trigger camera jumps.
 */

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import DeveloperWorldScene from './DeveloperWorldScene';
import { useWorldCamera } from '@/hooks/useWorldCamera';
import { projects }      from '@/data/projects';
import { experiences }   from '@/data/experience';
import { galleryItems }  from '@/data/gallery';

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10" />
  );
}

export default function DeveloperWorld() {
  const [webGLOk, setWebGLOk] = useState(true);
  const [mobile, setMobile] = useState(false);
  const { cameraTargetRef, navigateToZone } = useWorldCamera();

  // WebGL check
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!ctx) setWebGLOk(false);
    } catch {
      setWebGLOk(false);
    }
    setMobile(isMobile());
  }, []);

  // Expose navigateToZone via custom DOM event so Navbar can call it
  useEffect(() => {
    const handler = (e) => navigateToZone(e.detail?.zoneId);
    window.addEventListener('world:navigate', handler);
    return () => window.removeEventListener('world:navigate', handler);
  }, [navigateToZone]);

  if (!webGLOk) return <WebGLFallback />;

  const dpr = mobile ? [1, 1] : [1, Math.min(window.devicePixelRatio, 1.5)];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.5, 9], fov: 55 }}
        dpr={dpr}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <DeveloperWorldScene
            cameraTargetRef={cameraTargetRef}
            projects={projects}
            experiences={experiences}
            galleryItems={galleryItems}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
