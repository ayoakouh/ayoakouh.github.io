import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Shared scroll velocity (px/frame from Lenis). The ambient background
 * reads this every frame and decays it toward 0 so the value settles
 * even after Lenis stops emitting scroll events.
 */
export const scrollState = { velocity: 0 };

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;
