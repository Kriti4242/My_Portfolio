import { motion } from 'framer-motion';
import { Trophy, Users, Heart, Code2, Sparkles } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { achievements } from '@/data/achievements';
import { fadeUp, staggerContainer } from '@/animations/variants';
import { useTilt } from '@/hooks/useTilt';

const categoryConfig = {
  Leadership: { icon: Trophy, color: '#f59e0b' },
  Volunteering: { icon: Heart, color: '#ef4444' },
  Contributor: { icon: Users, color: '#7c3aed' },
  Projects: { icon: Code2, color: '#00e5ff' },
  Certification: { icon: Sparkles, color: '#47a248' },
};

function AchievementCard({ item, index }) {
  const tiltRef = useTilt({ max: 8 });
  const config = categoryConfig[item.category] || { icon: Sparkles, color: '#7c3aed' };
  const Icon = config.icon;

  return (
    <motion.div
      ref={tiltRef}
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6 }}
      className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]"
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(to right, transparent, ${config.color}, transparent)` }}
      />

      {/* Background glow */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: config.color }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="mb-4 inline-flex rounded-xl p-3"
          style={{ backgroundColor: `${config.color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: config.color }} />
        </div>

        {/* Category label */}
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: config.color }}
        >
          {item.category}
        </span>

        {/* Title */}
        <h3 className="mt-2 font-display text-lg font-semibold text-text group-hover:text-gradient transition-all">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>

        {/* Year */}
        <div className="mt-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-medium text-accent">{item.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  return (
    <Section id="achievements">
      <Heading
        eyebrow="Achievements"
        title="Milestones & Recognition"
        subtitle="Certificates, leadership roles, community contributions, and consistent engineering growth."
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
        {achievements.map((item, i) => (
          <AchievementCard key={item.id} item={item} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}
