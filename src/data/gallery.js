const img = (file) => new URL(`../assets/images/${file}`, import.meta.url).href;

export const galleryFilters = [
  { id: 'all', label: 'All' },
  { id: 'projects', label: 'Projects' },
  { id: 'personal', label: 'Personal' },
];

export const galleryItems = [
  {
    id: 'g1',
    title: 'Kriti',
    category: 'personal',
    // PRIVACY: uses pre-cropped derivative (head + shoulders only).
    // The original k-img.jpg is NEVER referenced here.
    src: img('kriti-gallery-crop.jpg'),
    aspect: 'portrait',
  },
  {
    id: 'g2',
    title: 'StuddyLove',
    category: 'projects',
    src: img('studdylove.png'),
    aspect: 'wide',
  },
  {
    id: 'g3',
    title: 'Fake Job Posting Detector',
    category: 'projects',
    src: img('fakejobdetector.png'),
    aspect: 'wide',
  },
  {
    id: 'g4',
    title: 'SupplyMove',
    category: 'projects',
    src: img('supplyMove.png'),
    aspect: 'wide',
  },
  {
    id: 'g5',
    title: 'Salon Website',
    category: 'projects',
    src: img('salon.png'),
    aspect: 'wide',
  },
  {
    id: 'g6',
    title: 'Dreamy Products',
    category: 'projects',
    src: img('dreamyproducts.png'),
    aspect: 'wide',
  },
];
