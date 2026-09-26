/**
 * DeveloperWorld — top-level 3D experience canvas.
 *
 * Fixed behind all page content (-z-10). Exposes `navigateToZone`
 * via custom DOM event so Navbar can trigger camera zone jumps.
 *
 * v2: passes `isMobile` and `isLight` to the scene for adaptive rendering.
 */

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import DeveloperWorldScene from './DeveloperWorldScene';
import { useWorldCamera } from '@/hooks/useWorldCamera';
import { projects }     from '@/data/projects';
import { experiences }  from '@/data/experience';
import { galleryItems } from '@/data/gallery';

const isMobileCheck = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

const isLightCheck = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('light');

function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10" />
  );
}

export default function DeveloperWorld() {
  const [webGLOk, setWebGLOk] = useState(true);
  const [mobile,  setMobile]  = useState(false);
  const [light,   setLight]   = useState(false);
  const { cameraTargetRef, navigateToZone } = useWorldCamera();

  // WebGL capability check
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!ctx) setWebGLOk(false);
    } catch { setWebGLOk(false); }

    setMobile(isMobileCheck());
    setLight(isLightCheck());
  }, []);

  // Listen for theme changes (class toggle on <html>)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLight(isLightCheck());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Expose navigateToZone via custom DOM event
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
            isMobile={mobile}
            isLight={light}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
