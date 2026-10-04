/**
 * DeveloperWorld — top-level 3D experience canvas.
 *
 * Fixed behind all page content (-z-10). Exposes `navigateToZone`
 * via custom DOM event so Navbar can trigger camera zone jumps.
 *
 * v3: responsive mobile & reduced-motion configuration.
 */

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import DeveloperWorldScene from './DeveloperWorldScene';
import { useWorldCamera } from '@/hooks/useWorldCamera';
import { projects }     from '@/data/projects';
import { experiences }  from '@/data/experience';
import { galleryItems } from '@/data/gallery';

const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
  const isNarrow = window.innerWidth < 768;
  return isTouch || isNarrow;
};

const checkIsReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const checkIsLight = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('light');

function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
  );
}

export default function DeveloperWorld() {
  const [webGLOk,        setWebGLOk]        = useState(true);
  const [mobile,         setMobile]         = useState(false);
  const [reducedMotion,  setReducedMotion]  = useState(false);
  const [light,          setLight]          = useState(false);
  const { cameraTargetRef, navigateToZone } = useWorldCamera({ isMobile: mobile, reducedMotion });

  // WebGL capability + initial responsive checks
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!ctx) setWebGLOk(false);
    } catch {
      setWebGLOk(false);
    }

    setMobile(checkIsMobile());
    setReducedMotion(checkIsReducedMotion());
    setLight(checkIsLight());
  }, []);

  // Listen for resize and media query changes
  useEffect(() => {
    const handleResize = () => {
      setMobile(checkIsMobile());
      setReducedMotion(checkIsReducedMotion());
    };

    window.addEventListener('resize', handleResize);
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e) => setReducedMotion(e.matches);
    if (motionMql.addEventListener) {
      motionMql.addEventListener('change', motionHandler);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (motionMql.removeEventListener) {
        motionMql.removeEventListener('change', motionHandler);
      }
    };
  }, []);

  // Listen for theme changes (class toggle on <html>)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLight(checkIsLight());
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

  const dpr = mobile ? [1, 1] : [1, Math.min(window.devicePixelRatio || 1, 1.5)];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <Canvas
        className="block h-full w-full"
        camera={{ position: [0, 1.5, 9], fov: mobile ? 50 : 55 }}
        dpr={dpr}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: mobile ? 'default' : 'high-performance',
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
            reducedMotion={reducedMotion}
            isLight={light}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
