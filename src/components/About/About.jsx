import { motion } from 'framer-motion';
import Section from '@/components/common/Section/Section';
import { aboutContent, timeline } from '@/data/about';

export default function About() {
  return (
      <Section id="about" className="bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-primary">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Full-Stack Developer</span>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-tight">
              About <span className="text-gradient">Me</span>
            </h2>

            <p className="text-muted leading-relaxed">
              I'm a Full-Stack Developer passionate about building complete, scalable products from frontend to backend.
              I specialize in React.js for responsive interfaces and Node.js/Express.js for robust backend APIs.
              My experience spans production projects across e-commerce, education, and enterprise domains.
              I believe in clean code, thoughtful design, and delivering real value through technology.
            </p>

            <div className="glass-card p-6 space-y-3">
              <h3 className="font-semibold text-text">Education</h3>
              <p className="text-sm font-medium text-text">{aboutContent.education.degree}</p>
              <p className="text-sm text-muted">
                {aboutContent.education.institution} · {aboutContent.education.period}
              </p>
              <p className="text-sm text-muted">{aboutContent.education.details}</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="mb-6 font-display text-xl font-semibold">Experience Timeline</h3>
            <div className="relative space-y-6 border-l border-white/10 pl-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <span className="absolute left-[-1.65rem] top-1 h-3 w-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {item.year}
                  </p>
                  <p className="font-medium text-text">{item.title}</p>
                  <p className="text-sm text-muted">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
