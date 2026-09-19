const img = (file) => new URL(`../assets/images/${file}`, import.meta.url).href;

export const projects = [
  {
    id: 'studdy-love',
    name: 'StuddyLove',
    tagline: 'Full-stack EdTech platform for coding education.',
    description:
      'StuddyLove is a comprehensive full-stack education platform designed to help learners master programming. Built with React.js for the frontend and Node.js/Express.js for the backend with MongoDB for data persistence. The platform includes student and instructor roles, course creation with sections and subsections, video uploads, progress tracking, and integration with Razorpay for payments.',
    image: img('studdylove.png'),
    thumbnail: img('studdylove.png'),
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    features: [
      'Student and Instructor role-based authentication',
      'Course creation with organized sections and subsections',
      'Video upload functionality for course content',
      'Progress tracking for enrolled courses',
      'Razorpay integration for payments',
      'Responsive design for all devices',
    ],
    problem:
      'Existing learning platforms often lack the flexibility needed for diverse teaching styles and student needs. StuddyLove provides a structured yet customizable approach to online education.',
    challenges: [
      'Building a secure authentication system with role-based access',
      'Implementing efficient course content organization',
      'Creating smooth progress tracking mechanisms',
    ],
    contribution:
      'Built complete full-stack architecture including authentication system, course management, payment integration, and responsive UI. Implemented data validation and API security.',
    architecture:
      'MERN stack application with JWT authentication, MongoDB for document storage, RESTful APIs, and responsive frontend with smooth animations.',
    futureScope: [
      'Live class scheduling with Zoom integration',
      'Discussion forums for each course',
      'Advanced analytics for learning insights',
    ],
    github: 'https://github.com/Kriti4242/StuddyLove',
    liveDemo: 'https://studdylove.vercel.app/',
    category: 'EdTech',
  },

  {
    id: 'fake-job-detector',
    name: 'Fake Job Posting Detector',
    tagline: 'AI-powered job posting verification using ML classification.',
    description:
      'A machine learning-based web application that detects fake job postings using XGBoost and Random Forest classifiers. The system processes job descriptions and classifies them as legitimate or fraudulent with 95% ROC-AUC accuracy. Features include bulk CSV verification, LinkedIn URL scraping, and SHAP explainability for each prediction.',
    image: img('fakejobdetector.png'),
    thumbnail: img('fakejobdetector.png'),
    techStack: ['Python', 'Streamlit', 'XGBoost', 'Random Forest', 'TF-IDF', 'SHAP'],
    features: [
      'Bulk CSV verification of job postings',
      'Single posting verification with detailed analysis',
      'LinkedIn URL scraping for automated job collection',
      'SHAP values for explainability and feature importance',
      'Visualization of classification results',
    ],
    problem:
      'Job seekers are increasingly targeted by fraudulent job postings, scams, and deceptive practices. Current methods for detecting fake jobs rely on manual review or basic keyword matching, which is inefficient and prone to errors.',
    challenges: [
      'Handling unstructured job description text',
      'Balancing model complexity with interpretability',
      'Creating user-friendly interface for non-technical users',
    ],
    contribution:
      'End-to-end ML application development including feature engineering, model training, SHAP analysis, and Streamlit UI development. Achieved 95% ROC-AUC accuracy on test data.',
    architecture:
      'Streamlit web app with Python backend, TF-IDF feature extraction, XGBoost and Random Forest classifiers, and SHAP for explainability. Deployed with DVC for model versioning.',
    futureScope: [
      'Real-time job posting API integration',
      'Additional ML models for different scam types',
      'User dashboard for job history and alerts',
    ],
    github: 'https://github.com/Kriti4242/fake-job-posting-detector',
    liveDemo: 'https://fakejobdetector.netlify.app/',
    category: 'AI/ML',
  },

  {
    id: 'supply-move',
    name: 'SupplyMove',
    tagline: 'Full-stack transport and logistics management platform.',
    description:
      'SupplyMove is a full-stack transport management platform designed to streamline movement of goods between factories, warehouses, shops, and delivery locations. The system supports multiple user roles and provides structured workflows for transportation, delivery, warehouse operations, and order tracking.',
    image: img('supplyMove.png'),
    thumbnail: img('supplyMove.png'),
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    features: [
      'Role-based authentication and access control',
      'Factory, warehouse, shop, and delivery workflows',
      'Transport and delivery management',
      'Order and shipment tracking',
      'REST API based backend architecture',
      'Responsive dashboard interface',
    ],
    problem:
      'Manufacturing and retail operations require better coordination between factories, warehouses, shops, transport managers, and delivery personnel. SupplyMove provides a centralized platform to organize and track these workflows.',
    challenges: [
      'Designing workflows for multiple user roles',
      'Managing complex transportation and delivery operations',
      'Maintaining secure role-based access across the platform',
    ],
    contribution:
      'Designed and developed the full-stack application with role-based authentication, transportation workflows, dashboards, and REST APIs. Built reusable React components and connected the application with MongoDB.',
    architecture:
      'MERN stack application with JWT authentication, Express.js REST APIs, MongoDB data persistence, and a responsive React frontend.',
    futureScope: [
      'Real-time GPS tracking for vehicles',
      'Advanced logistics analytics',
      'Automated delivery notifications',
    ],
    github: 'https://github.com/Kriti4242/SupplyMove',
    liveDemo: '',
    category: 'Logistics',
  },

  {
    id: 'salon-website',
    name: 'Salon Website',
    tagline: 'Professional salon booking website with service management.',
    description:
      'A complete salon management and booking website featuring service listings, booking system, team profiles, and gallery. Built with React and Tailwind CSS, with smooth animations and responsive design for seamless mobile experience.',
    image: img('salon.png'),
    thumbnail: img('salon.png'),
    techStack: ['React', 'Tailwind CSS', 'JavaScript'],
    features: [
      'Service catalog with pricing and descriptions',
      'Online booking system with date/time selection',
      'Team member profiles and specialties',
      'Photo gallery of work',
      'Responsive design for all devices',
    ],
    problem:
      'Salons needed a digital presence to attract clients and manage bookings efficiently without expensive proprietary software.',
    challenges: [
      'Creating an intuitive booking interface',
      'Managing diverse service offerings',
      'Maintaining consistent brand across all pages',
    ],
    contribution:
      'Designed complete salon website with booking functionality, responsive layout, and modern UI. Implemented smooth animations and accessible design patterns.',
    architecture:
      'React SPA with modular component structure, responsive design with Tailwind CSS, and optimized for mobile-first experience.',
    futureScope: [
      'Calendar integration for availability',
      'SMS notifications for bookings',
      'Customer reviews and ratings',
    ],
    github: 'https://github.com/Kriti4242/Salon-website',
    liveDemo: 'https://salon-website-khaki.vercel.app/',
    category: 'Business',
  },

  {
    id: 'dreamy-products',
    name: 'Dreamy Products',
    tagline: 'B2B stationery ordering platform for bulk purchases.',
    description:
      'Dreamy Products is a production ordering platform for a stationery manufacturer, serving retailers, shopkeepers, and bulk buyers. Built with React using Context API for global state management, allowing for cart functionality across multiple pages. Features include salesman portals, catalog browsing, and streamlined checkout process.',
    image: img('dreamyproducts.png'),
    thumbnail: img('dreamyproducts.png'),
    techStack: ['React', 'JavaScript', 'Vercel'],
    features: [
      'B2B ordering system for bulk purchases',
      'Reusable React components for consistent UI',
      'Context API for global cart state management',
      'Multi-page ordering workflow',
      'Salesman management features',
      'Shop-specific catalog configurations',
    ],
    problem:
      'Small and medium businesses needed an efficient way to order stationery products in bulk with personalized catalogues and streamlined checkout.',
    challenges: [
      'Creating consistent UI across multiple pages',
      'Implementing global state management for cart',
      'Building scalable component architecture',
    ],
    contribution:
      'Designed and implemented the complete ordering flow, built reusable component library, and integrated Context API for state management. Deployed to Vercel for production.',
    architecture:
      'React SPA with Context API for state management, modular component architecture, and responsive design optimized for B2B workflows.',
    futureScope: [
      'Admin dashboard for inventory management',
      'Search and filtering functionality',
      'Multi-language support',
    ],
    github: 'https://github.com/Kriti4242/Dreamy_products',
    liveDemo: 'https://price-with-dreamy-products.vercel.app/',
    category: 'E-Commerce',
  },
];