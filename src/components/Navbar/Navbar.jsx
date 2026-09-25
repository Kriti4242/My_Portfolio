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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleNavClick = useCallback((id) => {
    navigateWorld(id);
    setOpen(false);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#home"
          className="flex flex-col"
          aria-label="Go to top"
          onClick={() => navigateWorld('home')}
        >
          <span className="font-display text-lg font-bold tracking-wide bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            KRITI
          </span>
          <span className="text-xs text-muted">Full-Stack Developer</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => handleNavClick(link.id)}
              className={`relative text-sm font-medium transition-colors ${
                active === link.id ? 'text-text' : 'text-muted hover:text-text'
              }`}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-secondary"
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
            <Download className="h-3 w-3" />
            Resume
          </a>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full p-2 glass text-text transition hover:border-primary/50"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full p-2 glass text-text"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 glass"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 glass lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active === link.id
                      ? 'bg-primary/10 text-text'
                      : 'text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {/* Resume in mobile menu */}
              <a
                href={heroContent.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-xl border border-secondary/40 bg-secondary/10 px-3 py-2.5 text-sm font-semibold text-secondary"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
