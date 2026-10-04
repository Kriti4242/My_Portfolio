import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { navLinks } from '@/data/navigation';
import { heroContent } from '@/data/hero';
import { useActiveSection } from '@/hooks/useActiveSection';

/** Dispatch a custom event so DeveloperWorld can move the camera to the target zone */
function navigateWorld(zoneId) {
  window.dispatchEvent(new CustomEvent('world:navigate', { detail: { zoneId } }));
}

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(navLinks.map((l) => l.id));

  // Scroll detection for sticky header styling
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on desktop resize (>= 768px)
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavClick = useCallback((id) => {
    navigateWorld(id);
    setOpen(false);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open
          ? 'h-screen max-h-screen bg-background/98 backdrop-blur-3xl flex flex-col md:h-auto md:max-h-none md:bg-transparent md:backdrop-blur-none'
          : scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-white/10 shadow-lg py-3 sm:py-3.5'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      {/* Top Navbar Row */}
      <nav
        className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 ${
          open ? 'py-4 border-b border-white/10 md:border-b-0 md:py-0' : ''
        }`}
        aria-label="Main navigation"
      >
        {/* Logo and developer title */}
        <a
          href="#home"
          className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Go to home"
          onClick={() => handleNavClick('home')}
        >
          <span className="font-display text-lg sm:text-xl font-bold tracking-wide bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            KRITI
          </span>
          <span className="text-[11px] sm:text-xs text-muted font-medium">
            Full-Stack Developer
          </span>
        </a>

        {/* Desktop navigation — visible at >= 768px (md) */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => handleNavClick(link.id)}
              className={`relative text-sm font-medium transition-colors py-1 ${
                active === link.id ? 'text-text font-semibold' : 'text-muted hover:text-text'
              }`}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              )}
            </a>
          ))}

          {/* Resume button */}
          <a
            href={heroContent.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Resume"
            className="flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary transition-all duration-200 hover:bg-secondary/20 hover:border-secondary/60 hover:shadow-[0_0_16px_rgba(0,229,255,0.25)]"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full p-2.5 glass text-text transition hover:border-primary/50"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
        </div>

        {/* Mobile controls (Theme Toggle + Hamburger) — visible at < 768px */}
        <div className="flex items-center gap-2.5 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-xl p-2.5 glass text-text transition-colors active:scale-95"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          <button
            type="button"
            className={`rounded-xl p-2.5 transition-all active:scale-95 ${
              open
                ? 'bg-primary/25 border border-primary/50 text-primary'
                : 'glass text-text hover:border-primary/40'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel — rendered below the top bar when open (< 768px) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 overflow-y-auto px-6 py-5 flex flex-col justify-between max-w-lg mx-auto w-full md:hidden"
          >
            {/* Navigation links list */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted/70 px-3 pb-1">
                Navigation
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    active === link.id
                      ? 'bg-primary/15 text-primary border border-primary/30 font-semibold shadow-sm'
                      : 'text-muted hover:text-text hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {active === link.id && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </a>
              ))}
            </div>

            {/* Resume button and footer inside menu */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3.5">
              <a
                href={heroContent.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-secondary/40 bg-secondary/15 px-4 py-3.5 text-sm font-semibold text-secondary hover:bg-secondary/25 transition-all shadow-[0_0_20px_rgba(0,229,255,0.15)] active:scale-[0.99]"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
              <p className="text-center text-xs text-muted/60">
                © {new Date().getFullYear()} Kriti — Full-Stack Developer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
