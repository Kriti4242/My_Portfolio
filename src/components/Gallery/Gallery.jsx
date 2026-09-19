import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import { galleryFilters, galleryItems } from '@/data/gallery';
import { fadeUp, staggerContainer } from '@/animations/variants';

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
        subtitle="Masonry-style layout with filters, hover depth, and lightbox zoom."
        align="center"
        className="mb-10"
      />

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {galleryFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === f.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'glass text-muted hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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
            <motion.button
              key={item.id}
              type="button"
              layout
              variants={fadeUp}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setLightbox(item)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full object-contain transition duration-500 group-hover:scale-105 group-hover:blur-[1px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted">
                      <ZoomIn className="h-3 w-3" /> View
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[75] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox.src}
              alt={lightbox.title}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-[85vh] max-w-5xl rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="absolute right-6 top-6 rounded-full glass p-2"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
