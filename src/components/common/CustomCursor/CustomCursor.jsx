import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[90] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/50 md:block"
        animate={{ x: pos.x, y: pos.y, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.4 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[89] hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl md:block"
        animate={{ x: pos.x, y: pos.y, opacity: visible ? 0.6 : 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      />
    </>
  );
}
