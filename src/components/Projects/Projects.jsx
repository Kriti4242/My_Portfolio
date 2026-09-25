import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/common/SocialIcons';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import Button from '@/components/common/Button/Button';
import { projects } from '@/data/projects';
import { useTilt } from '@/hooks/useTilt';
import { fadeUp, staggerContainer } from '@/animations/variants';

const categoryColors = {
  EdTech: '#7c3aed',
  'AI/ML': '#00e5ff',
  Logistics: '#38bdf8',
  Business: '#f59e0b',
  'E-Commerce': '#47a248',
};

function ProjectCard({ project, onOpen }) {
  const tiltRef = useTilt({ max: 6 });
  const color = categoryColors[project.category] || '#7c3aed';

  return (
    <motion.article
      ref={tiltRef}
      variants={fadeUp}
      className="glass-card group relative cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(124,58,237,0.2)]"
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.name}`}
    >
      {/* Category accent line */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-black/20">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Category badge */}
        <div className="absolute right-3 top-3">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
            style={{ backgroundColor: `${color}25`, color, border: `1px solid ${color}40` }}
          >
            {project.category}
          </span>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <ArrowUpRight className="h-3.5 w-3.5" />
            View Case Study
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-6">
        <h3 className="font-display text-xl font-semibold group-hover:text-gradient transition-all">
          {project.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{project.tagline}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="project-tech-badge rounded-full px-2.5 py-1 text-xs font-medium">
              {t}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-3 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repo for ${project.name}`}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${project.name}`}
              className="flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const color = categoryColors[project.category] || '#7c3aed';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close modal"
        />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl glass-card p-6 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 glass hover:text-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Category */}
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
          >
            {project.category}
          </span>

          <h3 id="project-modal-title" className="mt-3 font-display text-2xl font-bold">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-secondary">{project.tagline}</p>

          <img
            src={project.thumbnail}
            alt={project.name}
            className="my-5 h-48 w-full rounded-xl bg-black/20 object-contain sm:h-56"
          />

          <p className="text-sm leading-relaxed text-muted">{project.description}</p>

          {/* Tech stack */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span key={t} className="project-tech-badge rounded-full px-3 py-1 text-xs font-medium">
                {t}
              </span>
            ))}
          </div>

          {/* Details grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Problem', project.problem],
              ['My Contribution', project.contribution],
              ['Architecture', project.architecture],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="project-detail-panel rounded-xl p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">{label}</h4>
                <p className="mt-2 text-sm text-muted leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Lists */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.features?.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Key Features</h4>
                <ul className="space-y-1 text-sm text-muted">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.futureScope?.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Future Scope</h4>
                <ul className="space-y-1 text-sm text-muted">
                  {project.futureScope.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveDemo && (
              <Button href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </Button>
            )}
            {project.github && (
              <Button variant="secondary" href={project.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-4 w-4" /> GitHub
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="projects" className="bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <Heading
        eyebrow="Projects"
        title="Selected Work"
        subtitle="Production-style apps spanning EdTech, AI/ML, logistics, e-commerce, and luxury service brands."
        align="center"
        className="mb-14"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={setSelected} />
        ))}
      </motion.div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
