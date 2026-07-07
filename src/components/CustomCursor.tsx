import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { isCoarsePointer, prefersReducedMotion } from '../lib/usePrefs';

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const el = ref.current!;
    document.documentElement.classList.add('has-custom-cursor');

    const xTo = gsap.quickTo(el, 'x', { duration: 0.16, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.16, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      el.style.opacity = '1';
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, [data-cursor]');
    const over = (e: PointerEvent) => {
      if (isInteractive(e.target)) el.classList.add('cursor-hot');
    };
    const out = (e: PointerEvent) => {
      if (isInteractive(e.target)) el.classList.remove('cursor-hot');
    };
    const hide = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, true);
    window.addEventListener('pointerout', out, true);
    document.documentElement.addEventListener('pointerleave', hide);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over, true);
      window.removeEventListener('pointerout', out, true);
      document.documentElement.removeEventListener('pointerleave', hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-root pointer-events-none fixed left-0 top-0 z-[80] opacity-0 transition-opacity duration-300"
      aria-hidden="true"
    >
      <span className="cursor-x" />
      <span className="cursor-y" />
      <span className="cursor-dot" />
    </div>
  );
}
