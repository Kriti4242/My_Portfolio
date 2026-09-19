import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroContent } from '@/data/hero';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setDone(true);
        onComplete();
      }, 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={heroContent.logoImage}
            alt=""
            className="mb-6 h-16 w-16 rounded-2xl object-cover glow-primary"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <p className="font-display text-xl font-semibold text-gradient">Kriti Portfolio</p>
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
