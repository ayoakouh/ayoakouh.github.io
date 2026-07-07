import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';

export default function SectionHeading({ command }: { command: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const cmd = root.querySelector('[data-cmd]')!;
    if (prefersReducedMotion()) {
      cmd.textContent = command;
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 82%', once: true },
      });
      tl.from('[data-line]', {
        scaleX: 0,
        duration: 0.7,
        ease: 'power3.inOut',
      }).to(
        cmd,
        {
          duration: Math.min(0.9, command.length * 0.05),
          text: command,
          ease: 'none',
        },
        '-=0.15',
      );
    }, root);
    return () => ctx.revert();
  }, [command]);

  return (
    <div ref={ref} className="mb-14">
      <div
        data-line
        className="h-px origin-left bg-gradient-to-r from-circuit/70 via-fog/15 to-transparent"
      />
      <h2 className="caret mt-6 font-mono text-xl text-fog md:text-2xl">
        <span className="text-ember">&gt;</span>{' '}
        <span data-cmd className="text-circuit"></span>
      </h2>
    </div>
  );
}
