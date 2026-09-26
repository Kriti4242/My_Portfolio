import { motion } from 'framer-motion';
import {
  Code2, Server, Database, Wrench, Lightbulb, GraduationCap,
  MapPin, Calendar, Star
} from 'lucide-react';
import Section from '@/components/common/Section/Section';
import { aboutContent } from '@/data/about';
import { fadeUp, staggerContainer } from '@/animations/variants';

const bentoCards = [
  {
    id: 'fullstack',
    icon: Code2,
    title: 'Full-Stack Development',
    desc: 'End-to-end product development from pixel-perfect UI to robust backend architecture.',
    color: '#7c3aed',
    span: 'sm:col-span-2',
  },
  {
    id: 'frontend',
    icon: Star,
    title: 'React & Frontend',
    desc: 'React.js, Tailwind CSS, Framer Motion, Three.js, responsive design.',
    color: '#61dafb',
    span: '',
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Node.js & Backend',
    desc: 'Express.js REST APIs, JWT auth, middleware, and scalable server architecture.',
    color: '#339933',
    span: '',
  },
  {
    id: 'database',
    icon: Database,
    title: 'MongoDB & APIs',
    desc: 'NoSQL databases, Mongoose ODM, REST API design, and third-party integrations.',
    color: '#47a248',
    span: '',
  },
  {
    id: 'tools',
    icon: Wrench,
    title: 'Developer Tools',
    desc: 'Git, Docker, GitHub Actions, Postman, Figma, Vercel, Render.',
    color: '#38bdf8',
    span: '',
  },
  {
    id: 'learning',
    icon: Lightbulb,
    title: 'Currently Learning',
    desc: 'TypeScript, System Design, Advanced React patterns, and Cloud fundamentals.',
    color: '#f59e0b',
    span: '',
  },
];

function BentoCard({ card, delay }) {
  const Icon = card.icon;
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className={`glass-card group relative overflow-hidden p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_rgba(124,58,237,0.2)] ${card.span}`}
    >
      {/* Background glow */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: card.color }}
      />
      <div className="relative">
        <div
          className="mb-3 inline-flex rounded-xl p-2.5"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: card.color }} />
        </div>
        <h3 className="font-display text-base font-semibold text-text">{card.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{card.desc}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const { education } = aboutContent;

  return (
    <Section id="about" className="bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

        {/* Left: Profile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-7"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-medium">Full-Stack Developer</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
              About <span className="text-gradient">Me</span>
            </h2>
          </div>

          <p className="text-base leading-relaxed text-muted">
            I'm a Full-Stack Developer passionate about building complete, scalable products
            from frontend to backend. I specialize in <span className="text-text font-medium">React.js</span>{' '}
            for responsive interfaces and{' '}
            <span className="text-text font-medium">Node.js/Express.js</span> for robust backend APIs.
          </p>
          <p className="text-base leading-relaxed text-muted">
            My experience spans production projects across e-commerce, education, and enterprise domains.
            I believe in clean code, thoughtful design, and delivering real value through technology.
          </p>

          {/* Education card */}
          <div className="glass-card relative overflow-hidden p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/20 p-3">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-text">{education.degree}</p>
                <p className="mt-0.5 text-sm text-muted">{education.institution}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-secondary" />
                    {education.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-secondary" />
                    Delhi
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-accent">{education.details}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-4">
            {aboutContent.stats.map((stat) => (
              <div key={stat.id} className="glass-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-gradient">
                  {stat.value}{stat.suffix}
                </p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Bento grid */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-sm font-semibold uppercase tracking-wider text-secondary"
          >
            What I Do
          </motion.p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {bentoCards.map((card, i) => (
              <BentoCard key={card.id} card={card} delay={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
