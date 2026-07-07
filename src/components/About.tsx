import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';
import SectionHeading from './SectionHeading';

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const rm = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!rm) {
        gsap.from('[data-about-copy]', {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        });
        gsap.from('[data-about-photo]', {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 66%', once: true },
        });
        gsap.fromTo(
          '[data-about-tilt]',
          { rotate: -3 },
          {
            rotate: 2.5,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      ScrollTrigger.create({
        trigger: '[data-stats]',
        start: 'top 84%',
        once: true,
        onEnter: () => {
          gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((el) => {
            const num = el.dataset.num;
            const suffix = el.dataset.suffix ?? '';
            const scramble = el.dataset.scramble;
            if (rm) {
              el.textContent = scramble ?? `${num}${suffix}`;
              return;
            }
            if (scramble) {
              gsap.to(el, {
                duration: 1.3,
                scrambleText: { text: scramble, chars: '01</>#&', speed: 0.35 },
              });
            } else {
              const proxy = { v: 0 };
              gsap.to(proxy, {
                v: Number(num),
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = `${Math.round(proxy.v)}${suffix}`;
                },
              });
            }
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading command="./about" />
      <div className="grid items-start gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div data-about-copy>
          <p className="text-lg leading-relaxed text-fog/85 md:text-xl">
            I build things that run{' '}
            <span className="text-circuit">close to the metal</span>. From HTTP
            servers to shell interpreters, I work in{' '}
            <span className="text-circuit">C/C++</span> and think in{' '}
            <span className="text-circuit">system calls</span>.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fog/70 md:text-xl">
            Trained at <span className="text-ember">42 School</span>'s
            peer-to-peer program, I've learned that elegant code isn't about
            frameworks — it's about understanding what happens beneath them.
          </p>

          <div data-stats className="mt-14 grid grid-cols-3 gap-6">
            <div className="border-l border-circuit/30 pl-4">
              <p
                data-stat
                data-num="5"
                data-suffix="+"
                className="font-mono text-3xl font-bold text-circuit md:text-4xl"
              >
                0
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-fog/50">
                major projects
              </p>
            </div>
            <div className="border-l border-circuit/30 pl-4">
              <p
                data-stat
                data-scramble="C / C++"
                className="font-mono text-3xl font-bold text-circuit md:text-4xl"
              >
                &nbsp;
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-fog/50">
                primary stack
              </p>
            </div>
            <div className="border-l border-ember/40 pl-4">
              <p
                data-stat
                data-num="42"
                className="font-mono text-3xl font-bold text-ember md:text-4xl"
              >
                0
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-fog/50">
                school — training ground
              </p>
            </div>
          </div>
        </div>

        <div data-about-photo className="relative mx-auto w-[min(360px,80vw)]" data-cursor>
          <div data-about-tilt>
            <div className="clip-chamfer-bl absolute -inset-3 border border-circuit/15" />
            <div className="clip-chamfer-bl bg-gradient-to-tl from-circuit/50 via-circuit/10 to-fog/20 p-px">
              <div className="clip-chamfer-bl relative overflow-hidden bg-panel">
                <img
                  src="/images/ayoub-stool.jpg"
                  alt="Ayoub Akouhar"
                  className="aspect-square w-full object-cover brightness-[0.92] contrast-[1.03] saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/55 via-transparent to-transparent" />
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px] text-fog/40">
              $ file ayoub.jpg → human, systems-oriented
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
