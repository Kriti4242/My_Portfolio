import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { skillCategories } from '@/data/skills';
import { useTilt } from '@/hooks/useTilt';
import { staggerContainer, fadeUp } from '@/animations/variants';

function SkillBar({ skill }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{skill.name}</span>
        <span className="text-muted">{skill.level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function CategoryCard({ category }) {
  const tiltRef = useTilt();
  const Icon = Lucide[category.icon] || Lucide.Sparkles;

  return (
    <motion.div
      ref={tiltRef}
      variants={fadeUp}
      className="glass-card group p-6 transition hover:border-secondary/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.25)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/20 p-3 text-secondary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-semibold">{category.title}</h3>
      </div>
      <div className="space-y-4">
        {category.skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <Section id="skills">
      <Heading
        eyebrow="Skills"
        title="Me & My Tech Stack"
        subtitle="Full-stack capabilities with a strong focus on modern React, motion, and polished UI engineering."
        align="center"
        className="mb-14"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {skillCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>
    </Section>
  );
}
