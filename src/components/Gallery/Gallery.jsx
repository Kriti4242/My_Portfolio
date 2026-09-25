import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Layers } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { galleryFilters, galleryItems } from '@/data/gallery';
import { fadeUp, staggerContainer } from '@/animations/variants';
import { useTilt } from '@/hooks/useTilt';

// ── Gallery Card ──────────────────────────────────────────────────────────────
function GalleryCard({ item, onOpen }) {
  const tiltRef = useTilt({ max: 5 });

  return (
    <motion.button
      ref={tiltRef}
      type="button"
      layout
      variants={fadeUp}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onOpen(item)}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary relative"
      aria-label={`View ${item.title}`}
    >
      <div className="relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:shadow-[0_24px_60px_rgba(124,58,237,0.3)]">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={item.src}
            alt={item.title}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] group-hover:brightness-75"
            loading="lazy"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <p className="font-display font-semibold text-white">{item.title}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>View photo</span>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Layers className="h-3 w-3" />
          {item.category}
        </div>
      </div>
    </motion.button>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
// NOTE: For personal photos, `item.src` already points to the pre-cropped
// derivative image (kriti-gallery-crop.jpg). The full original is never used.
function Lightbox({ item, onClose }) {
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title}
          className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-white/70">{item.title}</span>
        </div>
      </motion.div>

      <button
        type="button"
        className="absolute right-6 top-6 rounded-full glass p-2.5 text-white transition hover:text-secondary"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

// ── Main Gallery component ─────────────────────────────────────────────────────
export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = useMemo(
    () =>
      filter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === filter),
    [filter],
  );

  return (
    <Section id="gallery">
      <Heading
        eyebrow="Gallery"
        title="Visual Showcase"
        subtitle="A curated collection of project screenshots and personal highlights."
        align="center"
        className="mb-10"
      />

      {/* Filter buttons */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {galleryFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === f.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                : 'gallery-filter-inactive'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <motion.div
        layout
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="columns-1 gap-4 sm:columns-2 lg:columns-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <GalleryCard key={item.id} item={item} onOpen={setLightbox} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </Section>
  );
}
