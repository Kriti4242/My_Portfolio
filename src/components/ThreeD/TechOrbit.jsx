import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const orbitTechs = [
  { name: 'React.js',   color: '#61DAFB', category: 'Frontend',  desc: 'Hooks • Router • Context • R3F' },
  { name: 'Node.js',    color: '#339933', category: 'Backend',   desc: 'Express • REST APIs • JWT' },
  { name: 'MongoDB',    color: '#47A248', category: 'Database',  desc: 'Mongoose • Aggregation • Atlas' },
  { name: 'JavaScript', color: '#F7DF1E', category: 'Language',  desc: 'ES6+ • Async • DOM • TypeScript' },
  { name: 'Tailwind',   color: '#38BDF8', category: 'Styling',   desc: 'Utility-first • Dark Mode • Forms' },
  { name: 'Git/GitHub', color: '#F05032', category: 'Tools',     desc: 'CI/CD • Actions • Branching' },
  { name: 'Python',     color: '#3776AB', category: 'Language',  desc: 'ML • Scripting • Data Analysis' },
  { name: 'Docker',     color: '#2496ED', category: 'DevOps',    desc: 'Containers • Compose • Registry' },
];

/** Compute responsive orbit radii based on container width */
function getRadii(containerWidth) {
  if (containerWidth <= 0) return { rx: 84, ry: 48 };
  // Leave ~48px of node half-width clearance on each side
  const maxRx = Math.floor((containerWidth / 2) - 52);
  const rx = Math.min(maxRx, containerWidth < 420 ? 88 : 175);
  const ry = Math.round(rx * 0.58);
  return { rx, ry };
}

function OrbitNode({ tech, angle, rx, ry, hovered, onHover, onLeave }) {
  const x = rx * Math.cos(angle);
  const y = ry * Math.sin(angle);

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      whileHover={{ scale: 1.12 }}
    >
      <button
        type="button"
        className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-center transition-all duration-200 ${
          hovered === tech.name
            ? 'glass-card border-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.4)]'
            : 'glass hover:border-primary/30'
        }`}
        onMouseEnter={() => onHover(tech.name)}
        onMouseLeave={onLeave}
        onFocus={() => onHover(tech.name)}
        onBlur={onLeave}
        aria-label={tech.name}
      >
        <span
          className="text-[0.65rem] sm:text-xs font-semibold leading-tight whitespace-nowrap"
          style={{ color: tech.color }}
        >
          {tech.name}
        </span>
      </button>
    </motion.div>
  );
}

export default function TechOrbit() {
  const [hovered, setHovered] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const hoveredTech = orbitTechs.find((t) => t.name === hovered);

  // Measure container so radius never causes overflow
  useEffect(() => {
    let containerEl = null;

    function measure() {
      if (containerEl) {
        setContainerWidth(containerEl.offsetWidth);
      }
    }

    // Use a ResizeObserver for live updates
    const ro = new ResizeObserver(measure);

    // Give React one tick to render, then grab the element
    const raf = requestAnimationFrame(() => {
      containerEl = document.getElementById('tech-orbit-container');
      if (containerEl) {
        ro.observe(containerEl);
        measure();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const { rx, ry } = getRadii(containerWidth);
  const angleStep = (2 * Math.PI) / orbitTechs.length;

  return (
    <div
      className="mt-10 flex flex-col items-center gap-8 lg:hidden xl:flex"
      aria-label="Technology orbit diagram"
    >
      {/* Orbit container — measured so nodes never overflow */}
      <div
        id="tech-orbit-container"
        className="relative mx-auto w-full max-w-[480px] overflow-hidden"
        style={{ height: ry * 2 + 72 }} /* dynamic height = 2×ry + node padding */
      >
        {/* Orbit ring ellipse */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ width: rx * 2, height: ry * 2 }}
        />

        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="glass-card flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full">
            <span className="text-gradient font-display text-xs sm:text-sm font-bold">KRITI</span>
          </div>
        </div>

        {/* Tech nodes — only render after we have a measured width */}
        {containerWidth > 0 && orbitTechs.map((tech, i) => (
          <OrbitNode
            key={tech.name}
            tech={tech}
            angle={i * angleStep - Math.PI / 2}
            rx={rx}
            ry={ry}
            hovered={hovered}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* Tooltip panel */}
      <motion.div
        className="glass-card min-h-[80px] w-full max-w-sm p-4 sm:p-5 text-center"
        animate={{ opacity: hoveredTech ? 1 : 0.5, y: hoveredTech ? 0 : 4 }}
        transition={{ duration: 0.2 }}
      >
        {hoveredTech ? (
          <>
            <p className="font-display text-base sm:text-lg font-semibold" style={{ color: hoveredTech.color }}>
              {hoveredTech.name}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
              {hoveredTech.category}
            </p>
            <p className="mt-2 text-sm text-muted">{hoveredTech.desc}</p>
          </>
        ) : (
          <p className="text-sm text-muted">Hover a technology to learn more</p>
        )}
      </motion.div>
    </div>
  );
}
