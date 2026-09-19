import { motion } from 'framer-motion';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { achievements } from '@/data/achievements';
import { fadeUp, staggerContainer } from '@/animations/variants';

export default function Achievements() {
  return (
    <Section id="achievements">
      <Heading
        eyebrow="Achievements"
        title="Milestones & Recognition"
        subtitle="Certificates, hackathons, research, and consistent engineering growth."
        align="center"
        className="mb-14"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="glass-card group p-6 transition hover:border-primary/40"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {item.category}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold group-hover:text-gradient">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            <p className="mt-4 text-xs text-accent">{item.year}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
