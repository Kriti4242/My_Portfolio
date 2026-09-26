import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { experiences } from '@/data/experience';

const typeConfig = {
  Internship: { icon: Briefcase, color: '#7c3aed', label: 'Internship' },
  Professional: { icon: Briefcase, color: '#00e5ff', label: 'Professional' },
  Education: { icon: GraduationCap, color: '#f59e0b', label: 'Education' },
};

function ExperienceItem({ exp, index }) {
  const config = typeConfig[exp.type] || typeConfig.Professional;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex gap-6 md:gap-8 ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Timeline connector (hidden mobile, visible desktop) */}
      <div className="hidden md:flex md:w-[calc(50%-2rem)] md:shrink-0" />

      {/* Content card */}
      <div className="flex-1">
        <div className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(124,58,237,0.18)]">
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${config.color}, transparent)` }}
          />

          {/* Corner glow */}
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: config.color }}
          />

          <div className="relative">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 shrink-0 rounded-lg p-2"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon className="h-4 w-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: config.color }}
                >
                  {exp.type}
                </span>
                <h3 className="mt-0.5 font-display text-lg font-semibold text-text">{exp.title}</h3>
                <p className="font-medium text-text/80">{exp.organization}</p>
              </div>
            </div>

            {/* Meta info */}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-secondary" />
                {exp.period}
              </span>
              {exp.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-secondary" />
                  {exp.location}
                </span>
              )}
            </div>

            {/* Highlights */}
            <ul className="mt-4 space-y-2">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-muted">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <Section id="experience" className="bg-gradient-to-b from-card/20 to-transparent">
      <Heading
        eyebrow="Experience"
        title="Professional Journey"
        subtitle="Internships, research, and client-focused work shaping my engineering mindset."
        align="center"
        className="mb-16"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Central timeline line (desktop only) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block">
          <div className="h-full w-px bg-gradient-to-b from-primary via-secondary to-transparent opacity-40" />
        </div>

        {/* Mobile left timeline line */}
        <div className="absolute left-5 top-0 block h-full w-px md:hidden">
          <div className="h-full w-px bg-gradient-to-b from-primary via-secondary to-transparent opacity-30" />
        </div>

        <div className="relative space-y-10 md:space-y-16 pl-14 md:pl-0">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="relative">
              {/* Timeline dot (mobile, left side) */}
              <div
                className="absolute -left-[2.85rem] top-7 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background md:hidden"
                style={{ backgroundColor: typeConfig[exp.type]?.color || '#7c3aed' }}
              >
                <span className="h-2 w-2 rounded-full bg-background" />
              </div>

              {/* Timeline dot (desktop, center) */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="absolute left-1/2 top-7 hidden -translate-x-1/2 md:flex h-5 w-5 items-center justify-center rounded-full border-2 border-background z-10"
                style={{ backgroundColor: typeConfig[exp.type]?.color || '#7c3aed' }}
              >
                <span className="h-2 w-2 rounded-full bg-background" />
              </motion.div>

              <ExperienceItem exp={exp} index={i} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
