import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { X } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import Button from '@/components/common/Button/Button';
import { projects } from '@/data/projects';
import { useTilt } from '@/hooks/useTilt';
import { fadeUp, staggerContainer } from '@/animations/variants';

function ProjectCard({ project, onOpen }) {
  const tiltRef = useTilt({ max: 8 });

  return (
    <motion.article
      ref={tiltRef}
      variants={fadeUp}
      className="glass-card group cursor-pointer overflow-hidden"
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.name}`}
    >
      <div className="relative h-52 overflow-hidden bg-black/20">
        <img
          src={project.thumbnail}
          alt=""
          className="h-full w-full object-contain transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="space-y-3 p-6">
        <h3 className="font-display text-xl font-semibold group-hover:text-gradient">{project.name}</h3>
        <p className="line-clamp-2 text-sm text-muted">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-2 py-1 text-xs text-accent">
              {t}
            </span>
          ))}
        </div>
        <p className="text-sm font-medium text-secondary">View case study →</p>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;

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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close modal"
        />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl glass-card p-6 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 glass hover:text-secondary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={project.thumbnail}
            alt=""
            className="mb-6 h-48 w-full rounded-xl bg-black/20 object-contain sm:h-56"
          />
          <h3 id="project-modal-title" className="font-display text-2xl font-bold">
            {project.name}
          </h3>
          <p className="mt-2 text-muted">{project.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Problem', project.problem],
              ['My Contribution', project.contribution],
              ['Architecture', project.architecture],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/5 p-4">
                <h4 className="text-sm font-semibold text-secondary">{label}</h4>
                <p className="mt-2 text-sm text-muted">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Key Features</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Challenges</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                {project.challenges.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Future Scope</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                {project.futureScope.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={project.liveDemo} target="_blank" rel="noreferrer">
              <ExternalLink /> Live Demo
            </Button>
            <Button variant="secondary" href={project.github} target="_blank" rel="noreferrer">
              GitHub
            </Button>
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
        subtitle="Production-style apps spanning ed-tech, e-commerce, luxury service brands, and photography."
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
