import { useState } from 'react';
import { motion } from 'framer-motion';

const orbitTechs = [
  { name: 'React.js',    color: '#61DAFB', category: 'Frontend',  desc: 'Hooks • Router • Context • R3F' },
  { name: 'Node.js',     color: '#339933', category: 'Backend',   desc: 'Express • REST APIs • JWT' },
  { name: 'MongoDB',     color: '#47A248', category: 'Database',  desc: 'Mongoose • Aggregation • Atlas' },
  { name: 'JavaScript',  color: '#F7DF1E', category: 'Language',  desc: 'ES6+ • Async • DOM • TypeScript' },
  { name: 'Tailwind',    color: '#38BDF8', category: 'Styling',   desc: 'Utility-first • Dark Mode • Forms' },
  { name: 'Git/GitHub',  color: '#F05032', category: 'Tools',     desc: 'CI/CD • Actions • Branching' },
  { name: 'Python',      color: '#3776AB', category: 'Language',  desc: 'ML • Scripting • Data Analysis' },
  { name: 'Docker',      color: '#2496ED', category: 'DevOps',    desc: 'Containers • Compose • Registry' },
];

function OrbitNode({ tech, angle, radiusX, radiusY, hovered, onHover, onLeave }) {
  const x = radiusX * Math.cos(angle);
  const y = radiusY * Math.sin(angle);

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      whileHover={{ scale: 1.15 }}
    >
      <button
        type="button"
        className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-center transition-all duration-200 ${
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
          className="text-xs font-semibold"
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
  const hoveredTech = orbitTechs.find((t) => t.name === hovered);

  const radiusX = 190;
  const radiusY = 110;
  const angleStep = (2 * Math.PI) / orbitTechs.length;

  return (
    <div className="mt-10 flex flex-col items-center gap-8 lg:hidden xl:flex">
      {/* Orbit diagram */}
      <div className="relative mx-auto h-64 w-full max-w-[480px]">
        {/* Orbit ring */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ width: radiusX * 2, height: radiusY * 2 }}
        />

        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="glass-card flex h-16 w-16 items-center justify-center rounded-full">
            <span className="text-gradient font-display text-sm font-bold">KRITI</span>
          </div>
        </div>

        {/* Tech nodes */}
        {orbitTechs.map((tech, i) => (
          <OrbitNode
            key={tech.name}
            tech={tech}
            angle={i * angleStep - Math.PI / 2}
            radiusX={radiusX}
            radiusY={radiusY}
            hovered={hovered}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* Tooltip panel */}
      <motion.div
        className="glass-card min-h-[80px] w-full max-w-sm p-5 text-center"
        animate={{ opacity: hoveredTech ? 1 : 0.5, y: hoveredTech ? 0 : 4 }}
        transition={{ duration: 0.2 }}
      >
        {hoveredTech ? (
          <>
            <p className="font-display text-lg font-semibold" style={{ color: hoveredTech.color }}>
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
