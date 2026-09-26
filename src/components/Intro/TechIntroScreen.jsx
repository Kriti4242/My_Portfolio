import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'kriti_intro_v1';

const STACK_LINES = [
  { label: 'INITIALIZING STACK', isHeader: true },
  { label: 'REACT', dots: 15 },
  { label: 'NODE.JS', dots: 13 },
  { label: 'MONGODB', dots: 13 },
  { label: 'API LAYER', dots: 11 },
  { label: 'PROJECTS', dots: 12 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Scanning light bar that sweeps across the title once */
function ScanLine() {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: '100%',
        background:
          'linear-gradient(90deg, transparent 0%, rgba(99,179,237,0.18) 50%, transparent 100%)',
        pointerEvents: 'none',
      }}
      initial={{ x: '-100%' }}
      animate={{ x: '350%' }}
      transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
    />
  );
}

/** A single status line with optional check mark */
function StatusLine({ label, isHeader = false, dots = 0, visible, checked }) {
  if (!visible) return null;

  if (isHeader) {
    return (
      <motion.p
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          color: '#718096',
          marginBottom: '0.5rem',
          userSelect: 'none',
        }}
      >
        {'> '}{label}
      </motion.p>
    );
  }

  const dotStr = '.'.repeat(dots);

  return (
    <motion.p
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: 'monospace',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        color: '#a0aec0',
        lineHeight: '1.8',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      <span style={{ color: '#63b3ed', minWidth: '6.5rem', display: 'inline-block' }}>
        {label}
      </span>
      <span style={{ color: '#4a5568' }}>{dotStr}</span>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={checked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
        style={{ color: '#68d391', marginLeft: '0.25rem' }}
      >
        ✓
      </motion.span>
    </motion.p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * TechIntroScreen
 *
 * Full-screen intro overlay that sits above the fixed DeveloperWorld canvas.
 * New visitors see the full ~2.5 s sequence; returning visitors (localStorage
 * flag set) jump straight to "SYSTEM READY" for ~1.2 s total.
 *
 * @param {{ onComplete: () => void }} props
 */
export default function TechIntroScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  // Phase flags
  const [showTitle, setShowTitle] = useState(false);
  const [lineVisible, setLineVisible] = useState(
    // one entry per STACK_LINES item: [isVisible, isChecked]
    STACK_LINES.map(() => ({ shown: false, checked: false }))
  );
  const [showReady, setShowReady] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    // Give the fade-out animation time (400 ms) before unmounting via parent
    setTimeout(() => onComplete(), 420);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    finish();
  }, [finish]);

  // ── Sequence logic ────────────────────────────────────────────────────────
  useEffect(() => {
    const isReturning = localStorage.getItem(STORAGE_KEY) === '1';
    const timers = [];

    const t = (ms, fn) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
    };

    if (isReturning) {
      // ── Returning visitor: short path ──────────────────────────────────
      t(0, () => setShowTitle(true));
      t(200, () => setShowReady(true));
      t(900, () => finish());
    } else {
      // ── New visitor: full sequence ─────────────────────────────────────

      // Phase 1 – title
      t(0, () => setShowTitle(true));

      // Phase 2 – stack lines, each 220 ms apart
      STACK_LINES.forEach((_, i) => {
        const base = 500 + i * 220;

        // Show the line
        t(base, () =>
          setLineVisible((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], shown: true };
            return next;
          })
        );

        // Check it (non-header lines only), 120 ms after appearing
        if (!STACK_LINES[i].isHeader) {
          t(base + 120, () =>
            setLineVisible((prev) => {
              const next = [...prev];
              next[i] = { ...next[i], checked: true };
              return next;
            })
          );
        }
      });

      // Phase 3 – SYSTEM READY
      const readyAt = 500 + STACK_LINES.length * 220 + 100; // ~1 920 ms
      t(readyAt, () => setShowReady(true));

      // Done
      t(readyAt + 500, () => finish());
    }

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 8, 22, 0.85)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Portfolio intro sequence"
        >
          {/* ── Center content ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '2rem',
              minWidth: '18rem',
            }}
          >
            {/* Title block */}
            <AnimatePresence>
              {showTitle && (
                <motion.div
                  key="title-block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Scan line sweeps once */}
                  <ScanLine />

                  {/* Main heading */}
                  <motion.h1
                    animate={{
                      textShadow: [
                        '0 0 12px rgba(99,179,237,0.6), 0 0 24px rgba(99,179,237,0.3)',
                        '0 0 20px rgba(99,179,237,0.9), 0 0 40px rgba(99,179,237,0.5)',
                        '0 0 12px rgba(99,179,237,0.6), 0 0 24px rgba(99,179,237,0.3)',
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      fontSize: 'clamp(2.4rem, 8vw, 4rem)',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      background:
                        'linear-gradient(135deg, #63b3ed 0%, #9f7aea 50%, #68d391 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: "'Courier New', Courier, monospace",
                      margin: 0,
                      lineHeight: 1.1,
                      userSelect: 'none',
                    }}
                  >
                    KRITI.DEV
                  </motion.h1>

                  {/* Subtitle */}
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      letterSpacing: '0.22em',
                      color: '#718096',
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                      userSelect: 'none',
                    }}
                  >
                    Full-Stack Developer
                  </p>

                  {/* Thin accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                    style={{
                      marginTop: '0.75rem',
                      height: '1px',
                      background:
                        'linear-gradient(90deg, transparent, #63b3ed, #9f7aea, transparent)',
                      transformOrigin: 'center',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status lines */}
            <div
              style={{
                width: '100%',
                maxWidth: '22rem',
                padding: '1rem 1.2rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(99,179,237,0.12)',
              }}
            >
              {STACK_LINES.map((line, i) => (
                <StatusLine
                  key={line.label}
                  label={line.label}
                  isHeader={line.isHeader}
                  dots={line.dots ?? 0}
                  visible={lineVisible[i]?.shown}
                  checked={lineVisible[i]?.checked}
                />
              ))}

              {/* SYSTEM READY */}
              <AnimatePresence>
                {showReady && (
                  <motion.p
                    key="system-ready"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginTop: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      letterSpacing: '0.15em',
                      color: '#68d391',
                      userSelect: 'none',
                    }}
                  >
                    {'> '}SYSTEM READY
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ marginLeft: '2px' }}
                    >
                      _
                    </motion.span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Skip Intro button ── */}
          <motion.button
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '1.75rem',
              background: 'transparent',
              border: '1px solid rgba(99,179,237,0.35)',
              borderRadius: '0.375rem',
              color: '#a0aec0',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              padding: '0.35rem 0.8rem',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63b3ed';
              e.currentTarget.style.borderColor = 'rgba(99,179,237,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a0aec0';
              e.currentTarget.style.borderColor = 'rgba(99,179,237,0.35)';
            }}
            aria-label="Skip intro animation"
          >
            Skip Intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
