import { useLayoutEffect, useState } from 'react';
import { gsap, ScrollTrigger } from './lib/gsap';
import { initSmoothScroll } from './lib/scroll';
import AmbientBackground, { ambient } from './components/AmbientBackground';
import CustomCursor from './components/CustomCursor';
import BootSequence from './components/BootSequence';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';

/** Per-section color grade for the machine: [selector, warmth, energy]. */
const GRADES: Array<[string, number, number]> = [
  ['#hero', 0, 0],
  ['#about', 0.32, 0.12],
  ['#skills', 0.12, 0.18],
  ['#projects', 0.85, 0.55],
  ['#education', 0.4, 0.2],
  ['#contact', 0.05, 0.25],
];

export default function App() {
  const [booted, setBooted] = useState(false);

  useLayoutEffect(() => {
    initSmoothScroll();
    const triggers = GRADES.map(([sel, warmth, energy]) =>
      ScrollTrigger.create({
        trigger: sel,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(ambient, {
              warmth,
              energy,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: true,
            });
          }
        },
      }),
    );
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <>
      <AmbientBackground />
      <div className="grain" aria-hidden="true" />
      <CustomCursor />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <Navbar visible={booted} />
      <main>
        <Hero active={booted} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  );
}
