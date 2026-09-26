import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import TechIntroScreen from '@/components/Intro/TechIntroScreen';
import CustomCursor from '@/components/common/CustomCursor/CustomCursor';
import ScrollProgressBar from '@/components/common/ScrollProgressBar/ScrollProgressBar';
import BackToTop from '@/components/common/BackToTop/BackToTop';
import { useLenis } from '@/hooks/useLenis';
import { useTheme } from '@/hooks/useTheme';
import { siteMeta } from '@/constants/theme';

// The 3D world is always mounted (behind everything) so it's already
// animating while the intro overlay sits in front.
const DeveloperWorld = lazy(() => import('@/components/ThreeD/DeveloperWorld'));

const About        = lazy(() => import('@/components/About/About'));
const Skills       = lazy(() => import('@/components/Skills/Skills'));
const Experience   = lazy(() => import('@/components/Experience/Experience'));
const Achievements = lazy(() => import('@/components/Achievements/Achievements'));
const Projects     = lazy(() => import('@/components/Projects/Projects'));
const Gallery      = lazy(() => import('@/components/Gallery/Gallery'));
const Contact      = lazy(() => import('@/components/Contact/Contact'));
const Footer       = lazy(() => import('@/components/Footer/Footer'));

function SectionFallback() {
  return (
    <div className="section-padding mx-auto max-w-7xl animate-pulse text-center text-muted">
      Loading...
    </div>
  );
}

export default function HomePage() {
  // `introComplete` = the intro overlay has finished (or been skipped)
  // `animationReady` = Hero content spring-drop animations should fire
  const [introComplete,   setIntroComplete]   = useState(false);
  const [animationReady,  setAnimationReady]  = useState(false);

  const { theme, toggleTheme } = useTheme();
  useLenis(introComplete);

  // Apply theme class
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

  useEffect(() => {
    document.title = siteMeta.title;
  }, []);

  // When the intro finishes, unlock Lenis scrolling and fire Hero animations
  const onIntroComplete = useCallback(() => {
    setIntroComplete(true);
    // Give one frame for the overlay to fade before Hero starts its cascade
    setTimeout(() => setAnimationReady(true), 60);
  }, []);

  return (
    <>
      {/* 3D world is always mounted behind everything */}
      <Suspense fallback={null}>
        <DeveloperWorld />
      </Suspense>

      {/* Intro overlay — sits on top of the 3D world */}
      {!introComplete && (
        <TechIntroScreen onComplete={onIntroComplete} />
      )}

      {/* Main portfolio content — rendered immediately but animated in by Hero */}
      <>
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main>
          {/* Hero receives animationReady to control its spring cascade */}
          <Hero animationReady={animationReady} />
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
    </>
  );
}
