import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Database, Box, ChevronDown } from 'lucide-react';
import { heroContent } from '@/data/hero';
import { socialLinks } from '@/data/social';
import Button from '@/components/common/Button/Button';
import Hero3D from '@/components/Hero/Hero3D';
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/common/SocialIcons';
import { useTypewriter } from '@/hooks/useTypewriter';

const roles = [
  'Kriti',
  'React Developer',
  'Frontend Developer',
  'Backend Developer',
  'Web Developer',
  'Data Analyst'
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  const { text: typedText } = useTypewriter(roles);

  const techCards = [
    {
      name: 'React.js',
      icon: Globe,
      color: '#61DAFB',
    },
    {
      name: 'Node.js',
      icon: Code,
      color: '#339933',
    },
    {
      name: 'SQL',
      icon: Database,
      color: '#00758F',
    },
    {
      name: 'Docker',
      icon: Box,
      color: '#2496ED',
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      <Hero3D />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -50 }}
            transition={{ duration: 0.8 }}
            className="order-2 w-full lg:w-1/2 lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-text">Full-Stack Developer</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block min-w-[300px] sm:min-w-[400px]">
                {typedText}
                <span className="inline-block w-0.5 h-6 ml-1 animate-pulse" style={{
                  background: 'linear-gradient(to bottom, #7c3aed, #06b6d4)'
                }} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-xl text-lg"
            >
              I build complete, scalable web applications from frontend to backend.
              Specializing in React, Node.js, and modern development workflows.
              I turn complex problems into elegant, performant solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button href="#projects" magnetic>
                View My Work
              </Button>
              <Button variant="secondary" href="#contact" magnetic>
                Contact Me
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex items-center gap-3"
            >
              {socialLinks.map(({ id, href, label }) => {
                const iconMap = {
                  github: <GithubIcon className="h-5 w-5" />,
                  linkedin: <LinkedinIcon className="h-5 w-5" />,
                  email: <MailIcon className="h-5 w-5" />
                };
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text transition hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-primary/20"
                    title={label}
                  >
                    {iconMap[id] || <MailIcon className="h-5 w-5" />}
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 relative flex w-full lg:w-1/2 items-center justify-center"
          >
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-secondary/20 blur-2xl" />
            <div className="absolute -inset-12 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 blur-3xl" />

            <div className="relative w-full max-w-md">
              <div className="relative">
                <img
                  src={heroContent.profileImage}
                  alt="Kriti portrait"
                  className="h-[360px] w-full object-cover object-top rounded-2xl shadow-2xl sm:h-[400px]"
                  loading="eager"
                />

                <div className="absolute -left-4 top-8 hidden md:block">
                  {techCards.slice(0, 2).map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="glass-card mb-2 flex items-center gap-2 rounded-full px-3 py-2"
                    >
                      <tech.icon className="h-4 w-4" style={{ color: tech.color }} />
                      <span className="text-xs text-text">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute -right-4 bottom-12 hidden md:block">
                  {techCards.slice(2).map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.1 }}
                      className="glass-card mb-2 flex items-center gap-2 rounded-full px-3 py-2"
                    >
                      <tech.icon className="h-4 w-4" style={{ color: tech.color }} />
                      <span className="text-xs text-text">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Scroll to about"
      >
        <span className="text-xs uppercase tracking-widest text-muted">Scroll</span>
        <ChevronDown className="h-5 w-5 text-muted" />
      </motion.a>
    </section>
  );
}