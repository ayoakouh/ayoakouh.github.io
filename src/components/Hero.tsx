import { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';

const ROLE = 'Software Engineer • Systems Architect • Problem Solver';

export default function Hero({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!active || played.current) return;
    played.current = true;
    const root = rootRef.current!;
    const roleEl = root.querySelector('[data-role]')!;

    if (prefersReducedMotion()) {
      roleEl.textContent = ROLE;
      return;
    }

    const ctx = gsap.context(() => {
      const split = new SplitText('[data-name]', { type: 'chars' });
      const tl = gsap.timeline();
      tl.from(split.chars, {
        opacity: 0,
        yPercent: 55,
        filter: 'blur(6px)',
        stagger: 0.035,
        duration: 0.7,
        ease: 'power3.out',
      })
        .from('[data-osc]', { opacity: 0, duration: 0.5 }, '-=0.3')
        .to(roleEl, { duration: 1.5, text: ROLE, ease: 'none' }, '-=0.2')
        .from(
          '[data-photo]',
          { opacity: 0, x: 40, duration: 0.9, ease: 'power3.out' },
          0.35,
        )
        .from('[data-hint]', { opacity: 0, y: 10, duration: 0.6 }, '-=0.6')
        .from(
          '[data-tag]',
          { opacity: 0, y: -8, duration: 0.5 },
          0.15,
        );

      // parallax: photo drifts, name block eases away as you scroll on
      gsap.to('[data-photo-inner]', {
        yPercent: 11,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-name-wrap]', {
        yPercent: -10,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [active]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div data-name-wrap>
          <p
            data-tag
            className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-circuit/70"
          >
            // profile loaded_
          </p>
          <h1
            data-name
            className="font-mono text-[clamp(2.6rem,7.5vw,5.4rem)] font-bold uppercase leading-[1.04] tracking-[0.06em] text-fog"
          >
            Ayoub
            <br />
            Akouhar
          </h1>
          <svg
            data-osc
            viewBox="0 0 440 40"
            className="mt-7 w-[min(440px,100%)]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 20 H140 l10 -12 12 24 10 -18 8 6 H300 l8 -8 10 16 8 -8 H440"
              stroke="#4FC3F7"
              strokeOpacity="0.22"
              strokeWidth="1.5"
              pathLength={1000}
            />
            <path
              d="M0 20 H140 l10 -12 12 24 10 -18 8 6 H300 l8 -8 10 16 8 -8 H440"
              className="osc-pulse"
              stroke="#4FC3F7"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1000}
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,195,247,0.8))' }}
            />
          </svg>
          <p className="caret mt-7 min-h-7 font-mono text-sm text-fog/75 md:text-base">
            <span data-role />
          </p>
        </div>

        <div
          data-photo
          data-cursor
          className="relative mx-auto w-[min(320px,75vw)] lg:w-full lg:max-w-[370px]"
        >
          <div data-photo-inner className="relative">
            <div className="clip-chamfer absolute -inset-3 border border-circuit/20" />
            <div className="clip-chamfer bg-gradient-to-br from-circuit/60 via-circuit/10 to-ember/50 p-px">
              <div className="clip-chamfer relative overflow-hidden bg-panel">
                <img
                  src="/images/ayoub-portrait.jpg"
                  alt="Ayoub Akouhar — professional headshot"
                  className="aspect-[4/5] w-full object-cover object-top brightness-[0.94] contrast-[1.04] saturate-[0.82]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-circuit/10" />
              </div>
            </div>
            <p className="mt-3 text-right font-mono text-[11px] text-fog/40">
              // ayoub_akouhar — profile.img
            </p>
          </div>
        </div>
      </div>

      <div
        data-hint
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="mb-2 font-mono text-[11px] tracking-[0.25em] text-fog/45">
          scroll to explore
        </p>
        <svg
          viewBox="0 0 16 10"
          className="chevron-bob mx-auto h-3.5 w-5 text-circuit"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
