import { motion } from 'framer-motion';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { experiences } from '@/data/experience';
import { fadeUp, staggerContainer } from '@/animations/variants';

export default function Experience() {
  return (
    <Section id="experience" className="bg-linear-to-b from-card/20 to-transparent">
      <Heading
        eyebrow="Experience"
        title="Professional Journey"
        subtitle="Internships, research, and client-focused work shaping my engineering mindset."
        align="center"
        className="mb-14"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative mx-auto max-w-3xl"
      >
        <div className="absolute left-4 top-0 hidden h-full w-px bg-linear-to-b from-primary via-secondary to-transparent md:left-1/2 md:block" />
        {experiences.map((exp, i) => (
          <motion.article
            key={exp.id}
            variants={fadeUp}
            className={`relative mb-10 flex flex-col gap-4 md:mb-16 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="hidden md:block md:w-1/2" />
            <div className="glass-card relative md:w-1/2 md:max-w-md">
              <span className="absolute left-[-1.35rem] top-6 hidden h-3 w-3 rounded-full bg-secondary md:block md:-translate-x-1/2 md:left-0" />
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{exp.type}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{exp.title}</h3>
              <p className="text-sm text-muted">
                {exp.organization} · {exp.period}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
