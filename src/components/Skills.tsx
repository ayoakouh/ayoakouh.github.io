import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';
import SectionHeading from './SectionHeading';

const LANGS = [
  { name: 'C', pct: 95 },
  { name: 'C++', pct: 90 },
  { name: 'Python', pct: 80 },
  { name: 'Bash', pct: 88 },
  { name: 'SQL', pct: 75 },
];

const SYSTEMS = [
  'UNIX / Linux, TCP/IP, Socket Programming',
  'Non-blocking I/O — poll / select / epoll',
  'HTTP Protocol, IRC Protocol',
];

const TOOLS = ['Git, GDB, Valgrind, Makefiles'];

const NOTES = {
  languages:
    "# daily drivers — C is home: everything at 42 starts with malloc and ends with valgrind --leak-check=full",
  systems:
    '# the layer where the real conversation happens: sockets, processes, file descriptors',
  tools: "# if it can't be debugged with gdb and a Makefile, it ships broken",
};

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-tline]');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
      tl.from(lines, {
        opacity: 0,
        x: -12,
        duration: 0.38,
        ease: 'power2.out',
        stagger: 0.055,
      });
      gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((bar, i) => {
        tl.fromTo(
          bar,
          { width: '0%' },
          {
            width: `${bar.dataset.pct}%`,
            duration: 1.0,
            ease: 'power3.out',
          },
          0.45 + i * 0.09,
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={rootRef}
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading command="cat skills.conf" />

      <div className="clip-chamfer border border-white/10 bg-panel/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-fog/15" />
          <span className="size-2.5 rounded-full bg-fog/15" />
          <span className="size-2.5 rounded-full bg-circuit/40" />
          <span className="ml-3 font-mono text-[11px] text-fog/40">
            ayoub@machine: ~/skills.conf
          </span>
        </div>

        <div className="space-y-9 p-6 font-mono text-sm md:p-10">
          <p data-tline className="text-fog/35">
            # parsed at boot — values verified by peer review
          </p>

          <div className="group">
            <p data-tline className="text-ember/90">
              [languages]
            </p>
            <p className="max-h-0 overflow-hidden text-xs text-fog/45 transition-all duration-500 group-hover:max-h-12 group-hover:pt-2">
              {NOTES.languages}
            </p>
            <div className="mt-4 space-y-3">
              {LANGS.map(({ name, pct }) => (
                <div
                  key={name}
                  data-tline
                  className="grid grid-cols-[64px_1fr_52px] items-center gap-3 md:grid-cols-[90px_1fr_56px]"
                >
                  <span className="text-fog/85">{name}</span>
                  <div className="bar-track relative h-3 overflow-hidden">
                    <div
                      data-bar
                      data-pct={pct}
                      className="bar-fill absolute inset-y-0 left-0"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-right text-circuit/80">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="group">
            <p data-tline className="text-ember/90">
              [systems]
            </p>
            <p className="max-h-0 overflow-hidden text-xs text-fog/45 transition-all duration-500 group-hover:max-h-12 group-hover:pt-2">
              {NOTES.systems}
            </p>
            <div className="mt-4 space-y-2.5">
              {SYSTEMS.map((line) => (
                <p key={line} data-tline className="text-fog/75">
                  <span className="mr-2 text-circuit/60">▸</span>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="group">
            <p data-tline className="text-ember/90">
              [tools]
            </p>
            <p className="max-h-0 overflow-hidden text-xs text-fog/45 transition-all duration-500 group-hover:max-h-12 group-hover:pt-2">
              {NOTES.tools}
            </p>
            <div className="mt-4 space-y-2.5">
              {TOOLS.map((line) => (
                <p key={line} data-tline className="text-fog/75">
                  <span className="mr-2 text-circuit/60">▸</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
