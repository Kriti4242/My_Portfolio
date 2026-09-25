import { motion } from 'framer-motion';
import { Layout, Server, Code2, Wrench, Brain } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { skillCategories } from '@/data/skills';
import { useTilt } from '@/hooks/useTilt';
import { staggerContainer, fadeUp } from '@/animations/variants';
import TechOrbit from '@/components/ThreeD/TechOrbit';

const iconMap = { Layout, Server, Code2, Wrench, Brain };

function SkillBar({ skill }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-text/90 font-medium">{skill.name}</span>
        <span className="text-muted text-xs">{skill.level}%</span>
      </div>
      <div className="skill-bar-track h-1.5 overflow-hidden rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

const categoryColors = {
  frontend: '#61dafb',
  backend: '#339933',
  programming: '#7c3aed',
  'developer-tools': '#38bdf8',
  'cs-fundamentals': '#f59e0b',
};

function CategoryCard({ category }) {
  const tiltRef = useTilt({ max: 6 });
  const Icon = iconMap[category.icon] || Code2;
  const color = categoryColors[category.id] || '#7c3aed';

  return (
    <motion.div
      ref={tiltRef}
      variants={fadeUp}
      className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
    >
      {/* Hover glow */}
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="rounded-xl p-2.5"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <h3 className="font-display text-lg font-semibold">{category.title}</h3>
        </div>
        <div className="space-y-4">
          {category.skills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
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
        subtitle="Full-stack capabilities with a strong focus on modern React, Node.js, and polished engineering."
        align="center"
        className="mb-14"
      />

      {/* Interactive tech orbit (desktop) */}
      <TechOrbit />

      {/* Category skill cards */}
      <div className="mt-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-secondary"
        >
          Skill Breakdown
        </motion.p>
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
      </div>
    </Section>
  );
}
