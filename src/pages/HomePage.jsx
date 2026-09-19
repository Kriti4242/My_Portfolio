import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import LoadingScreen from '@/components/common/LoadingScreen/LoadingScreen';
import CustomCursor from '@/components/common/CustomCursor/CustomCursor';
import ScrollProgressBar from '@/components/common/ScrollProgressBar/ScrollProgressBar';
import BackToTop from '@/components/common/BackToTop/BackToTop';
import { useLenis } from '@/hooks/useLenis';
import { useTheme } from '@/hooks/useTheme';
import { siteMeta } from '@/constants/theme';

const About = lazy(() => import('@/components/About/About'));
const Skills = lazy(() => import('@/components/Skills/Skills'));
const Experience = lazy(() => import('@/components/Experience/Experience'));
const Achievements = lazy(() => import('@/components/Achievements/Achievements'));
const Projects = lazy(() => import('@/components/Projects/Projects'));
const Gallery = lazy(() => import('@/components/Gallery/Gallery'));
const Contact = lazy(() => import('@/components/Contact/Contact'));
const Footer = lazy(() => import('@/components/Footer/Footer'));

function SectionFallback() {
  return <div className="section-padding mx-auto max-w-7xl animate-pulse text-center text-muted">Loading...</div>;
}

export default function HomePage() {
  const [booted, setBooted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useLenis(booted);

  useEffect(() => {
    document.title = siteMeta.title;
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
    }
  }, [theme]);

  const onBootComplete = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted && <LoadingScreen onComplete={onBootComplete} />}
      {booted && (
        <>
          <CustomCursor />
          <ScrollProgressBar />
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <main>
            <Hero />
            <Suspense fallback={<SectionFallback />}>
              <About />
              <Skills />
              <Experience />
              <Achievements />
              <Projects />
              <Gallery />
              <Contact />
              <Footer />
            </Suspense>
          </main>
          <BackToTop />
        </>
      )}
    </>
  );
}
