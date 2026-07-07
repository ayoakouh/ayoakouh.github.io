import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/usePrefs';

/* ------------------------------------------------------------------ */
/* webserv — HTTP request/response flow                                */
/* ------------------------------------------------------------------ */
export function HttpVisual() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <svg viewBox="0 0 300 170" className="w-full max-w-[330px]" fill="none">
        {/* client */}
        <rect x="8" y="62" width="72" height="46" stroke="#4FC3F7" strokeOpacity="0.5" />
        <text x="44" y="89" textAnchor="middle" fill="#E8E8E8" fillOpacity="0.7" fontSize="10" fontFamily="JetBrains Mono, monospace">
          client
        </text>
        {/* server */}
        <rect x="220" y="62" width="72" height="46" stroke="#4FC3F7" strokeOpacity="0.8" />
        <rect x="226" y="68" width="60" height="34" stroke="#4FC3F7" strokeOpacity="0.2" />
        <text x="256" y="89" textAnchor="middle" fill="#4FC3F7" fontSize="10" fontFamily="JetBrains Mono, monospace">
          :8080
        </text>
        {/* request */}
        <text x="150" y="52" textAnchor="middle" fill="#4FC3F7" fontSize="9" fontFamily="JetBrains Mono, monospace">
          GET /index.html
        </text>
        <path d="M88 70 H206" stroke="#4FC3F7" strokeOpacity="0.65" className="dash-flow" />
        <path d="M206 66 l8 4 -8 4 Z" fill="#4FC3F7" fillOpacity="0.8" />
        <circle r="2.5" fill="#4FC3F7">
          <animateMotion dur="1.6s" repeatCount="indefinite" path="M88 70 H206" />
        </circle>
        {/* response */}
        <text x="150" y="130" textAnchor="middle" fill="#FFB74D" fontSize="9" fontFamily="JetBrains Mono, monospace">
          HTTP/1.1 200 OK
        </text>
        <path d="M212 100 H94" stroke="#FFB74D" strokeOpacity="0.55" className="dash-flow" />
        <path d="M94 96 l-8 4 8 4 Z" fill="#FFB74D" fillOpacity="0.8" />
        <circle r="2.5" fill="#FFB74D">
          <animateMotion dur="1.9s" repeatCount="indefinite" path="M212 100 H94" />
        </circle>
        {/* event loop hint */}
        <text x="256" y="122" textAnchor="middle" fill="#E8E8E8" fillOpacity="0.35" fontSize="8" fontFamily="JetBrains Mono, monospace">
          epoll_wait()
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ft_irc — multi-client network graph                                 */
/* ------------------------------------------------------------------ */
const IRC_CLIENTS = [
  { x: 40, y: 30, n: 'zed' },
  { x: 258, y: 26, n: 'amy' },
  { x: 282, y: 118, n: 'kai' },
  { x: 150, y: 152, n: 'joe' },
  { x: 24, y: 122, n: 'sam' },
];

export function IrcVisual() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <svg viewBox="0 0 300 170" className="w-full max-w-[330px]" fill="none">
        {IRC_CLIENTS.map((c, i) => (
          <g key={c.n}>
            <path d={`M${c.x} ${c.y} L150 85`} stroke="#E8E8E8" strokeOpacity="0.14" />
            <circle r="2.2" fill="#4FC3F7">
              <animateMotion
                dur={`${1.5 + i * 0.35}s`}
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
                path={`M${c.x} ${c.y} L150 85`}
              />
            </circle>
            <circle r="2.2" fill="#FFB74D" opacity="0.9">
              <animateMotion
                dur={`${2.1 + i * 0.3}s`}
                begin={`${0.8 + i * 0.55}s`}
                repeatCount="indefinite"
                path={`M150 85 L${c.x} ${c.y}`}
              />
            </circle>
            <circle cx={c.x} cy={c.y} r="7" stroke="#4FC3F7" strokeOpacity="0.45" />
            <text
              x={c.x}
              y={c.y - 12}
              textAnchor="middle"
              fill="#E8E8E8"
              fillOpacity="0.55"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {c.n}
            </text>
          </g>
        ))}
        {/* hub */}
        <circle cx="150" cy="85" r="17" stroke="#4FC3F7" strokeOpacity="0.9">
          <animate attributeName="r" values="15;18;15" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.9;0.5;0.9" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="89" textAnchor="middle" fill="#4FC3F7" fontSize="9" fontFamily="JetBrains Mono, monospace">
          poll()
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* minishell — embedded terminal typing loop                           */
/* ------------------------------------------------------------------ */
const SHELL_SCRIPT: Array<{ t: string; out?: boolean }> = [
  { t: '$ ./minishell' },
  { t: 'minishell v1.0 — no readline harmed', out: true },
  { t: '$ ls srcs | wc -l' },
  { t: '23', out: true },
  { t: '$ echo "segfault free" | tr a-z A-Z' },
  { t: 'SEGFAULT FREE', out: true },
  { t: '$ exit 0' },
];

export function ShellVisual() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current!;
    if (prefersReducedMotion()) {
      for (const item of SHELL_SCRIPT) {
        const div = document.createElement('div');
        if (item.out) div.className = 'text-circuit/75';
        div.textContent = item.t;
        el.appendChild(div);
      }
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let running = false;
    let line = 0;
    let ch = 0;
    let cur: HTMLDivElement | null = null;

    const step = () => {
      if (!visible) {
        running = false;
        return;
      }
      running = true;
      const item = SHELL_SCRIPT[line];
      if (!cur) {
        cur = document.createElement('div');
        if (item.out) cur.className = 'text-circuit/75';
        el.appendChild(cur);
      }
      if (item.out) {
        cur.textContent = item.t;
        ch = item.t.length;
      } else {
        ch++;
        cur.textContent = item.t.slice(0, ch);
      }
      if (ch >= item.t.length) {
        line++;
        ch = 0;
        cur = null;
        if (line >= SHELL_SCRIPT.length) {
          timer = setTimeout(() => {
            el.textContent = '';
            line = 0;
            step();
          }, 2400);
          return;
        }
        timer = setTimeout(step, item.out ? 180 : 430);
      } else {
        timer = setTimeout(step, 34);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !running) step();
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="clip-chamfer-sm w-full max-w-[340px] border border-white/10 bg-void/85">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-fog/15" />
          <span className="size-2 rounded-full bg-fog/15" />
          <span className="size-2 rounded-full bg-ember/40" />
          <span className="ml-2 font-mono text-[10px] text-fog/40">
            minishell — tty1
          </span>
        </div>
        <div
          ref={bodyRef}
          className="h-[152px] overflow-hidden p-3 font-mono text-[11px] leading-5 text-fog/80"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* cub3D — live raycasting render (DDA, Lodev-style)                   */
/* ------------------------------------------------------------------ */
const MAP = [
  '11111111',
  '10100101',
  '10000001',
  '10000001',
  '10000001',
  '10000001',
  '10100101',
  '11111111',
].map((r) => r.split('').map(Number));

export function RaycastVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = 200;
    const H = 120;
    canvas.width = W;
    canvas.height = H;

    const renderFrame = (t: number) => {
      const orbit = t * 0.22;
      const cx = 4 + 1.4 * Math.cos(orbit);
      const cy = 4 + 1.4 * Math.sin(orbit);
      const a = orbit + Math.PI / 2 + 0.35 * Math.sin(t * 0.6);
      const dirX = Math.cos(a);
      const dirY = Math.sin(a);
      const planeX = -dirY * 0.66;
      const planeY = dirX * 0.66;

      // ceiling / floor
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#07070c');
      sky.addColorStop(0.5, '#0a0a10');
      sky.addColorStop(0.5, '#10101a');
      sky.addColorStop(1, '#07070c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (let x = 0; x < W; x++) {
        const camX = (2 * x) / W - 1;
        const rdx = dirX + planeX * camX || 1e-9;
        const rdy = dirY + planeY * camX || 1e-9;
        let mapX = Math.floor(cx);
        let mapY = Math.floor(cy);
        const ddx = Math.abs(1 / rdx);
        const ddy = Math.abs(1 / rdy);
        let stepX: number, stepY: number, sdx: number, sdy: number;
        if (rdx < 0) {
          stepX = -1;
          sdx = (cx - mapX) * ddx;
        } else {
          stepX = 1;
          sdx = (mapX + 1 - cx) * ddx;
        }
        if (rdy < 0) {
          stepY = -1;
          sdy = (cy - mapY) * ddy;
        } else {
          stepY = 1;
          sdy = (mapY + 1 - cy) * ddy;
        }
        let side = 0;
        let guard = 0;
        while (guard++ < 32) {
          if (sdx < sdy) {
            sdx += ddx;
            mapX += stepX;
            side = 0;
          } else {
            sdy += ddy;
            mapY += stepY;
            side = 1;
          }
          if (MAP[mapY]?.[mapX]) break;
        }
        const dist = Math.max(side === 0 ? sdx - ddx : sdy - ddy, 0.06);
        const lineH = Math.min(H / dist, H * 1.6);
        let shade = Math.max(0.09, Math.min(1 - dist / 7.5, 1));
        if (side === 1) shade *= 0.62;
        // fake texture: bright seam at wall-block edges
        let wallX = side === 0 ? cy + dist * rdy : cx + dist * rdx;
        wallX -= Math.floor(wallX);
        const edge = wallX < 0.045 || wallX > 0.955;
        const r = Math.round(18 + 48 * shade + (edge ? 20 : 0));
        const g = Math.round(38 + 110 * shade + (edge ? 40 : 0));
        const b = Math.round(58 + 150 * shade + (edge ? 47 : 0));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, (H - lineH) / 2, 1, lineH);
      }
    };

    if (prefersReducedMotion()) {
      renderFrame(2.5);
      return;
    }

    let raf = 0;
    let visible = false;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      renderFrame((now - start) / 1000);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) {
          raf = requestAnimationFrame(loop);
        } else if (!visible) {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="clip-chamfer-sm w-full max-w-[340px] overflow-hidden border border-white/10 bg-void/85">
        <canvas
          ref={canvasRef}
          className="h-[150px] w-full object-cover [image-rendering:pixelated]"
        />
        <div className="border-t border-white/10 px-3 py-1.5 font-mono text-[10px] text-fog/40">
          cub3D — live raycast @ 200×120 · one ray per column
        </div>
      </div>
    </div>
  );
}
