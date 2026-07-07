import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { getLenis } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/usePrefs';

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (prefersReducedMotion()) {
      doneRef.current();
      return;
    }
    const lenis = getLenis();
    lenis?.stop();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          doneRef.current();
        },
      });
      tl.to('[data-boot-1]', {
        duration: 0.42,
        text: '> initializing system...',
        ease: 'none',
      })
        .set('[data-boot-1]', { className: 'min-h-6' })
        .to(
          '[data-boot-2]',
          {
            duration: 0.52,
            text: '> loading profile: ayoub_akouhar',
            ease: 'none',
          },
          '+=0.1',
        )
        .to(
          rootRef.current,
          { autoAlpha: 0, duration: 0.35, ease: 'power2.inOut' },
          '+=0.3',
        );
    }, rootRef);
    return () => {
      ctx.revert();
      lenis?.start();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-void"
    >
      <div className="w-[min(560px,88vw)] font-mono text-sm text-circuit md:text-base">
        <p data-boot-1 className="caret min-h-6"></p>
        <p data-boot-2 className="caret mt-2 min-h-6"></p>
      </div>
    </div>
  );
}
