import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';
import SectionHeading from './SectionHeading';

export default function Education() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-edu]', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: root, start: 'top 74%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={rootRef}
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading command="cat education.log" />

      <div className="relative ml-2 space-y-14 border-l border-white/10 pl-8 md:pl-12">
        <div data-edu className="relative">
          <span className="pulse-dot absolute -left-[37px] top-2 size-2.5 rounded-full bg-circuit md:-left-[53px]" />
          <div className="flex items-start gap-5">
            <div className="clip-chamfer-sm flex h-14 w-14 shrink-0 items-center justify-center border border-circuit/40 bg-circuit/5 font-mono text-xl font-bold text-circuit">
              42
            </div>
            <div>
              <p className="font-mono text-xs text-ember">2024 — present</p>
              <h3 className="mt-1 font-mono text-lg text-fog">
                42 School — Common Core
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-fog/65">
                Peer-to-peer, project-based engineering school. No lectures, no
                teachers — only code reviewed by other students, and projects
                that segfault until they don't.
              </p>
            </div>
          </div>
        </div>

        <div data-edu className="relative">
          <span className="absolute -left-[36px] top-2 size-2 rounded-full bg-ember/80 md:-left-[52px]" />
          <p className="font-mono text-xs text-ember">daily practice</p>
          <a
            href="https://leetcode.com/u/ayoakouh"
            target="_blank"
            rel="noreferrer"
            className="term-link group mt-2 inline-flex flex-wrap items-center gap-3 font-mono text-sm text-fog/85 transition-colors hover:text-circuit"
          >
            <span className="relative flex size-2">
              <span className="pulse-dot absolute inline-flex size-2 rounded-full bg-circuit" />
            </span>
            <span className="glowable">leetcode.com/u/ayoakouh</span>
            <span className="text-fog/40 transition-colors group-hover:text-ember">
              → solving daily
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
