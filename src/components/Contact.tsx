import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/usePrefs';
import SectionHeading from './SectionHeading';

const LINKS = [
  {
    cmd: 'mail',
    arg: 'akouharayoub12@gmail.com',
    href: 'mailto:akouharayoub12@gmail.com',
  },
  {
    cmd: 'open',
    arg: 'github.com/ayoakouh',
    href: 'https://github.com/ayoakouh',
  },
  {
    cmd: 'open',
    arg: 'linkedin.com/in/ayoub-akouhar',
    href: 'https://linkedin.com/in/ayoub-akouhar',
  },
  { cmd: 'call', arg: '+212 682 484 311', href: 'tel:+212682484311' },
  { cmd: 'wget', arg: 'resume.pdf', href: '/resume.pdf', hot: true },
];

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-contact-row]', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-xl">
        <SectionHeading command="ping ayoub" />

        <p
          data-contact-row
          className="mb-10 font-mono text-xs leading-6 text-fog/45"
        >
          PING ayoub: 64 bytes — icmp_seq=1 ttl=42 time=0.042 ms
          <br />
          <span className="text-circuit/70">reply received.</span> open a
          channel below:
        </p>

        <div className="space-y-1.5">
          {LINKS.map(({ cmd, arg, href, hot }) => (
            <a
              key={arg}
              data-contact-row
              href={href}
              {...(href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
              {...(hot ? { download: 'Ayoub_Akouhar_Resume.pdf' } : {})}
              className="term-link group flex items-baseline gap-3 border border-transparent px-4 py-3 font-mono text-sm transition-all duration-300 hover:translate-x-1 hover:border-white/10 hover:bg-white/[0.02]"
            >
              <span className="text-fog/40 transition-colors group-hover:text-ember">
                &gt;
              </span>
              <span className="text-circuit/90">{cmd}</span>
              <span
                className={`glowable break-all ${hot ? 'text-ember' : 'text-fog/85'}`}
              >
                {arg}
              </span>
              <span className="ml-auto text-fog/25 opacity-0 transition group-hover:text-circuit group-hover:opacity-100">
                ↵
              </span>
            </a>
          ))}
        </div>
      </div>

      <footer className="mt-28 text-center">
        <p className="caret font-mono text-lg text-circuit">&gt;</p>
        <p className="mt-8 font-mono text-[11px] text-fog/30">
          © 2026 ayoub akouhar — built close to the metal
        </p>
      </footer>
    </section>
  );
}
