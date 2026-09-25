import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import { heroContent } from '@/data/hero';
import { socialLinks } from '@/data/social';
import Button from '@/components/common/Button/Button';
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/common/SocialIcons';
import { useTypewriter } from '@/hooks/useTypewriter';

const DeveloperWorld = lazy(() => import('@/components/ThreeD/DeveloperWorld'));

const roles = [
  'Full-Stack Developer',
  'React Engineer',
  'Node.js Developer',
  'Web Developer',
];

const techPills = [
  { name: 'React.js',   color: '#61DAFB' },
  { name: 'Node.js',    color: '#339933' },
  { name: 'MongoDB',    color: '#47A248' },
  { name: 'Express.js', color: '#7c3aed' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { text: typedText } = useTypewriter(roles);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      aria-label="Hero — Kriti, Full-Stack Developer"
    >
      {/* 3D Developer World — fixed layer shared across all sections */}
      <Suspense fallback={
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      }>
        <DeveloperWorld />
      </Suspense>

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/80 via-background/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

      {/* Ambient glow blobs — subdued so they don't blow out light mode */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-secondary/10 blur-[110px]" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-start justify-center gap-7 lg:max-w-[58%]">

          {/* ── Status badge ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-badge"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>Available for opportunities</span>
          </motion.div>

          {/* ── Name + Typewriter ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <p className="text-lg font-medium text-muted">Hi, I'm</p>
            <h1 className="font-display tracking-tight">
              {/* "Kriti" — uses hero-name: white gradient (dark) / deep indigo gradient (light) */}
              <span className="hero-name text-6xl font-bold sm:text-7xl lg:text-8xl">
                Kriti
              </span>
              {/* Typewriter roles — uses hero-role: purple→cyan (dark) / violet→blue (light) */}
              <span
                className="hero-role mt-1 block min-h-[1.25em] text-4xl font-bold sm:text-5xl lg:text-6xl"
                aria-live="polite"
                aria-label={`Current role: ${typedText}`}
              >
                {typedText}
                {/* Cursor — animated, theme-aware via hero-cursor class */}
                <span className="hero-cursor" aria-hidden="true" />
              </span>
            </h1>
          </motion.div>

          {/* ── Description ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-lg space-y-1.5"
          >
            <p className="text-base leading-relaxed text-text/85 sm:text-lg">
              I build modern, scalable web applications with React, Node.js and MongoDB.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              I enjoy turning ideas into responsive, user-focused digital products.
            </p>
          </motion.div>

          {/* ── Tech pills ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {techPills.map((t) => (
              <span key={t.name} className="tech-pill">
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                {t.name}
              </span>
            ))}
          </motion.div>

          {/* ── CTAs ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-3"
          >
            <Button href="#projects" magnetic>
              View My Work
            </Button>
            <a
              href={heroContent.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-6 py-3 text-sm font-semibold text-secondary backdrop-blur-sm transition-all duration-300 hover:bg-secondary/20 hover:border-secondary/60 hover:shadow-[0_0_24px_rgba(0,229,255,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              aria-label="View Resume — opens Google Drive"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
            <Button variant="secondary" href="#contact">
              Contact Me
            </Button>
          </motion.div>

          {/* ── Social links ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex items-center gap-3"
          >
            {socialLinks.map(({ id, href, label }) => {
              const iconMap = {
                github:   <GithubIcon className="h-5 w-5" />,
                linkedin: <LinkedinIcon className="h-5 w-5" />,
                email:    <MailIcon className="h-5 w-5" />,
              };
              return (
                <a
                  key={id}
                  href={href}
                  target={id !== 'email' ? '_blank' : undefined}
                  rel={id !== 'email' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="social-btn"
                  title={label}
                >
                  {iconMap[id] ?? <MailIcon className="h-5 w-5" />}
                </a>
              );
            })}
            <span className="ml-2 h-px w-8 bg-muted/20" />
            <span className="text-xs text-muted">Let's connect</span>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        aria-label="Scroll to about section"
      >
        <span className="text-xs uppercase tracking-widest text-muted">Scroll</span>
        <ChevronDown className="h-5 w-5 text-muted" />
      </motion.a>
    </section>
  );
}