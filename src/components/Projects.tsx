import { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { gsap } from '../lib/gsap';
import { isCoarsePointer, prefersReducedMotion } from '../lib/usePrefs';
import SectionHeading from './SectionHeading';
import {
  HttpVisual,
  IrcVisual,
  RaycastVisual,
  ShellVisual,
} from './ProjectVisuals';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  href: string;
  Visual: ComponentType;
}

const PROJECTS: Project[] = [
  {
    id: 'webserv',
    title: 'webserv',
    subtitle: 'Event-Driven HTTP Service',
    desc: 'An HTTP/1.1 server built on raw sockets — single-threaded, event-driven, fully non-blocking. Virtual hosts from config, CGI execution, chunked transfers. NGINX-inspired, zero frameworks.',
    tags: ['C++', 'Linux', 'Non-blocking I/O'],
    href: 'https://github.com/ayoakouh',
    Visual: HttpVisual,
  },
  {
    id: 'ft_irc',
    title: 'ft_irc',
    subtitle: 'Multi-Client TCP Chat Server',
    desc: 'An IRC server speaking the real protocol: channels, operators, modes, private messages — every client multiplexed through a single poll() loop. No threads, no deadlocks, no mercy.',
    tags: ['C++', 'Socket Programming', 'poll()'],
    href: 'https://github.com/ayoakouh/ft_irc-',
    Visual: IrcVisual,
  },
  {
    id: 'minishell',
    title: 'minishell',
    subtitle: 'Bash-Inspired Command Interpreter',
    desc: 'A shell that does what shells do: lexing, parsing, expansion, pipelines, redirections, heredocs and signal handling — powered by fork, execve and careful file-descriptor plumbing.',
    tags: ['C', 'fork / exec', 'pipe / dup2', 'Signal Handling'],
    href: 'https://github.com/ayoakouh/minishell',
    Visual: ShellVisual,
  },
  {
    id: 'cub3d',
    title: 'cub3D',
    subtitle: 'Raycasting 3D Engine',
    desc: 'A Wolfenstein-style 3D engine casting one ray per screen column through a 2D map — DDA grid traversal, perspective projection, textured walls. The panel on this card is rendering live.',
    tags: ['C', 'DDA Algorithm', 'Texture Mapping'],
    href: 'https://github.com/ayoakouh/CUB3d',
    Visual: RaycastVisual,
  },
];

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const rm = prefersReducedMotion();
    const fine = !isCoarsePointer();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card, i) => {
        if (!rm) {
          gsap.from(card, {
            x: i % 2 ? 90 : -90,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 78%', once: true },
          });
        }
        if (fine && !rm) {
          // hovering a card pulls the machine slightly out of focus
          const stage = document.getElementById('ambient-stage');
          card.addEventListener('mouseenter', () => {
            gsap.to(stage, { '--amb-blur': '5px', duration: 0.5, ease: 'power2.out' });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(stage, { '--amb-blur': '0px', duration: 0.6, ease: 'power2.out' });
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={rootRef}
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading command="ls -la /projects" />

      <div className="space-y-14 md:space-y-20">
        {PROJECTS.map(({ id, title, subtitle, desc, tags, href, Visual }, i) => {
          const flip = i % 2 === 1;
          return (
            <a
              key={id}
              data-card
              href={href}
              target="_blank"
              rel="noreferrer"
              className="clip-chamfer-sm group relative grid overflow-hidden border border-white/10 bg-panel/55 backdrop-blur-sm transition-all duration-500 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:border-circuit/50 hover:shadow-[0_24px_70px_-24px_rgba(79,195,247,0.4)] md:grid-cols-2"
            >
              <div
                className={`relative min-h-[230px] border-white/10 ${
                  flip ? 'md:order-2 md:border-l' : 'md:border-r'
                }`}
              >
                <Visual />
              </div>
              <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                <p className="font-mono text-xs text-fog/40">~/projects/{id}</p>
                <h3 className="font-mono text-2xl text-fog transition-colors group-hover:text-circuit md:text-3xl">
                  {title}
                  <span className="mt-1.5 block font-sans text-sm font-normal text-fog/55">
                    {subtitle}
                  </span>
                </h3>
                <p className="text-sm leading-relaxed text-fog/70">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="border border-circuit/25 bg-circuit/5 px-2.5 py-1 font-mono text-[11px] text-circuit/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-1 font-mono text-sm text-ember/90">
                  <span className="text-fog/40">&gt;</span> git clone {id}
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
