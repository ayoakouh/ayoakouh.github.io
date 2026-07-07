import type { MouseEvent } from 'react';
import { getLenis } from '../lib/scroll';

const LINKS = [
  ['./about', '#about'],
  ['./skills', '#skills'],
  ['./projects', '#projects'],
  ['./contact', '#contact'],
] as const;

export default function Navbar({ visible }: { visible: boolean }) {
  const go = (e: MouseEvent<HTMLAnchorElement>, target: string | number) => {
    e.preventDefault();
    getLenis()?.scrollTo(target, {
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-void/60 backdrop-blur-md transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 font-mono text-xs">
        <a
          href="#top"
          onClick={(e) => go(e, 0)}
          className="text-fog/80 transition-colors hover:text-circuit"
        >
          <span className="text-ember">ayoub</span>@machine:
          <span className="text-circuit">~</span>$
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map(([label, hash]) => (
            <a
              key={hash}
              href={hash}
              onClick={(e) => go(e, hash)}
              className="text-fog/60 transition-colors hover:text-circuit"
            >
              {label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            download="Ayoub_Akouhar_Resume.pdf"
            className="border border-ember/50 px-3 py-1.5 text-ember transition hover:bg-ember/10 hover:shadow-[0_0_18px_rgba(255,183,77,0.25)]"
          >
            resume.pdf
          </a>
        </div>
        <a
          href="/resume.pdf"
          download="Ayoub_Akouhar_Resume.pdf"
          className="border border-ember/50 px-3 py-1.5 text-ember md:hidden"
        >
          resume.pdf
        </a>
      </nav>
    </header>
  );
}
