import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import { heroContent } from '@/data/hero';
import { socialLinks } from '@/data/social';
import Button from '@/components/common/Button/Button';
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/common/SocialIcons';
import { useTypewriter } from '@/hooks/useTypewriter';

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

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------
const springBase = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};

const springBouncy = {
  type: 'spring',
  stiffness: 150,
  damping: 15,
};

/** Returns a spring-drop variant object with the given delay */
function dropVariant(delay, spring = springBase) {
  return {
    hidden: { opacity: 0, y: -40, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { ...spring, delay },
    },
  };
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export default function Hero({ animationReady = false }) {
  const controls = useAnimation();
  const { text: typedText } = useTypewriter(roles);

  useEffect(() => {
    if (animationReady) {
      controls.start('visible');
    }
  }, [animationReady, controls]);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center"
      aria-label="Hero — Kriti, Full-Stack Developer"
    >
      {/* ── Theme-aware Contrast Overlays (Crucial for Mobile & Desktop Readability) ── */}
      {/* Universal subtle veil ensuring text stays crisp above 3D world */}
      <div className="absolute inset-0 -z-10 bg-background/75 sm:bg-background/45 backdrop-blur-[1px] pointer-events-none" />

      {/* Mobile-specific vertical gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/80 to-background/95 sm:hidden pointer-events-none" />

      {/* Desktop horizontal & bottom gradients */}
      <div className="hidden sm:block absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/70 to-transparent pointer-events-none" />
      <div className="hidden sm:block absolute inset-0 -z-10 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

      {/* Ambient glow blobs — subdued on mobile to protect contrast */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-primary/10 blur-[100px] opacity-40 sm:opacity-100" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-secondary/10 blur-[100px] opacity-30 sm:opacity-100" />

      {/* Hero Content Container */}
      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-start justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8"
        style={{ perspective: '1000px' }}
      >
        <div className="flex w-full min-w-0 flex-col items-start justify-center gap-4 sm:gap-6 lg:max-w-[62%]">

          {/* ── Status badge — delay 0.2s ─────────────────────────────────── */}
          <motion.div
            variants={dropVariant(0.2)}
            initial="hidden"
            animate={controls}
            className="hero-badge"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs sm:text-sm font-medium">Available for opportunities</span>
          </motion.div>

          {/* ── "Hi, I'm" — delay 0.45s ───────────────────────────────────── */}
          <motion.p
            variants={dropVariant(0.45)}
            initial="hidden"
            animate={controls}
            className="text-base sm:text-lg font-medium text-muted -mb-2"
          >
            Hi, I'm
          </motion.p>

          {/* ── "Kriti" h1 — delay 0.7s (extra bounce) ───────────────────── */}
          <motion.h1
            variants={dropVariant(0.7, springBouncy)}
            initial="hidden"
            animate={controls}
            className="font-display tracking-tight -mt-1"
          >
            {/* "Kriti" — uses hero-name: white gradient (dark) / deep indigo gradient (light) */}
            <span className="hero-name text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
              Kriti
            </span>
          </motion.h1>

          {/* ── Typewriter role — delay 0.9s ──────────────────────────────── */}
          <motion.div
            variants={dropVariant(0.9)}
            initial="hidden"
            animate={controls}
            className="-mt-2"
          >
            {/* Typewriter roles — uses hero-role: purple→cyan (dark) / violet→blue (light) */}
            <span
              className="hero-role mt-1 block min-h-[1.25em] text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              aria-live="polite"
              aria-label={`Current role: ${typedText}`}
            >
              {typedText}
              {/* Cursor — animated, theme-aware via hero-cursor class */}
              <span className="hero-cursor" aria-hidden="true" />
            </span>
          </motion.div>

          {/* ── Description — delay 1.1s ──────────────────────────────────── */}
          <motion.div
            variants={dropVariant(1.1)}
            initial="hidden"
            animate={controls}
            className="max-w-xl space-y-1.5"
          >
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-text/90">
              I build modern, scalable web applications with React, Node.js and MongoDB.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              I enjoy turning ideas into responsive, user-focused digital products.
            </p>
          </motion.div>

          {/* ── Tech pills — delay 1.1s (alongside description) ──────────── */}
          <motion.div
            variants={dropVariant(1.1)}
            initial="hidden"
            animate={controls}
            className="flex flex-wrap gap-2 pt-1"
          >
            {techPills.map((t) => (
              <span key={t.name} className="tech-pill text-xs sm:text-sm">
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                {t.name}
              </span>
            ))}
          </motion.div>

          {/* ── CTAs — delay 1.35s ────────────────────────────────────────── */}
          <motion.div
            variants={dropVariant(1.35)}
            initial="hidden"
            animate={controls}
            className="hero-actions flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto"
          >
            <Button href="#projects" magnetic className="w-full sm:w-auto justify-center">
              View My Work
            </Button>
            <a
              href={heroContent.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-5 py-3 text-sm font-semibold text-secondary backdrop-blur-sm transition-all duration-300 hover:bg-secondary/20 hover:border-secondary/60 hover:shadow-[0_0_24px_rgba(0,229,255,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary w-full sm:w-auto text-center"
              aria-label="View Resume — opens Google Drive"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
            <Button variant="secondary" href="#contact" className="w-full sm:w-auto justify-center">
              Contact Me
            </Button>
          </motion.div>

          {/* ── Social icons — delay 1.55s ────────────────────────────────── */}
          <motion.div
            variants={dropVariant(1.55)}
            initial="hidden"
            animate={controls}
            className="hero-socials flex flex-wrap items-center gap-3 pt-2"
          >
            {socialLinks.map(({ id, href, label }) => {
              const iconMap = {
                github:   <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
                linkedin: <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
                email:    <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
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
                  {iconMap[id] ?? <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                </a>
              );
            })}
            <span className="hidden sm:inline-block ml-2 h-px w-8 bg-muted/20" />
            <span className="text-xs text-muted">Let's connect</span>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-4 sm:bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        aria-label="Scroll to about section"
      >
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted font-medium">Scroll</span>
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted" />
      </motion.a>
    </section>
  );
}