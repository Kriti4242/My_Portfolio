/**
 * useWorldCamera — scroll-driven + navbar-click camera system.
 *
 * Exports a ref `cameraTargetRef` that any component inside the Canvas can read
 * each frame to interpolate the camera position toward the active zone.
 *
 * Also exports `navigateToZone(id)` so Navbar can trigger camera jumps.
 */

import { useEffect, useRef, useCallback } from 'react';

// Ordered zone list matches section scroll order.
export const ZONES = [
  { id: 'home',         position: [0,  1.5, 9],   lookAt: [0, 0.2, 0]  },
  { id: 'about',        position: [0,  0.5, 7],   lookAt: [0, 0.2, 0]  },
  { id: 'skills',       position: [-2, 0.5, 7],   lookAt: [-1, 0.2, 0] },
  { id: 'experience',   position: [2,  0.5, 7],   lookAt: [1,  0.2, 0] },
  { id: 'achievements', position: [0,  0.5, 7.5], lookAt: [0,  0.5, 0] },
  { id: 'projects',     position: [1,  0.5, 6.5], lookAt: [0.5,0.2, 0] },
  { id: 'gallery',      position: [-1, 0.5, 7.5], lookAt: [-0.5,0.5,0] },
  { id: 'contact',      position: [0,  0.2, 7],   lookAt: [0,  0,   0] },
];

// Map section id → zone index for scroll tracking
const ZONE_ORDER = ZONES.map((z) => z.id);

export function useWorldCamera() {
  // Shared mutable target that the R3F camera rig reads every frame
  const cameraTargetRef = useRef({
    position: [...ZONES[0].position],
    lookAt:   [...ZONES[0].lookAt],
    // Mouse parallax delta
    mouse: { x: 0, y: 0 },
  });

  const activeZoneRef = useRef('home');

  // ── Navigate imperatively (navbar click, etc.) ──────────────────────────
  const navigateToZone = useCallback((zoneId) => {
    const zone = ZONES.find((z) => z.id === zoneId);
    if (!zone) return;
    cameraTargetRef.current.position = [...zone.position];
    cameraTargetRef.current.lookAt   = [...zone.lookAt];
    activeZoneRef.current = zoneId;
  }, []);

  // ── Scroll → zone mapping ───────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const scrollY    = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? scrollY / docHeight : 0;

      // Map progress to zone index
      const raw   = progress * (ZONE_ORDER.length - 1);
      const lower = Math.floor(raw);
      const upper = Math.min(lower + 1, ZONE_ORDER.length - 1);
      const t     = raw - lower;

      const from = ZONES[lower];
      const to   = ZONES[upper];

      // Lerp between zones
      const lerp = (a, b, t) => a + (b - a) * t;
      cameraTargetRef.current.position = [
        lerp(from.position[0], to.position[0], t),
        lerp(from.position[1], to.position[1], t),
        lerp(from.position[2], to.position[2], t),
      ];
      cameraTargetRef.current.lookAt = [
        lerp(from.lookAt[0], to.lookAt[0], t),
        lerp(from.lookAt[1], to.lookAt[1], t),
        lerp(from.lookAt[2], to.lookAt[2], t),
      ];

      // Determine the closest zone for active state
      const closestIdx = progress <= 0.5 / (ZONE_ORDER.length - 1)
        ? 0
        : Math.round(progress * (ZONE_ORDER.length - 1));
      activeZoneRef.current = ZONE_ORDER[Math.min(closestIdx, ZONE_ORDER.length - 1)];
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mouse parallax ──────────────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onMouse = (e) => {
      cameraTargetRef.current.mouse = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  return { cameraTargetRef, navigateToZone, activeZoneRef };
}
