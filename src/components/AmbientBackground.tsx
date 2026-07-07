import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { scrollState } from '../lib/scroll';
import { isCoarsePointer, prefersReducedMotion } from '../lib/usePrefs';

/**
 * Section color grading, tweened by ScrollTriggers in App.
 * warmth: 0 = cold electric blue, 1 = warm amber.
 * energy: extra glow for showcase sections.
 */
export const ambient = { warmth: 0, energy: 0 };

const BLUE = [79, 195, 247] as const;
const AMBER = [255, 183, 77] as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function tint(alpha: number): string {
  const w = ambient.warmth;
  const r = Math.round(lerp(BLUE[0], AMBER[0], w));
  const g = Math.round(lerp(BLUE[1], AMBER[1], w));
  const b = Math.round(lerp(BLUE[2], AMBER[2], w));
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  tw: number;
}
interface Thread {
  x: number;
  speed: number;
  len: number;
  head: number;
  sway: number;
}
interface Hex {
  x: number;
  y: number;
  r: number;
  rot: number;
  vr: number;
  pulse: number;
  z: number;
}

/** Circuit traces drawn in normalized coordinates. */
const TRACES: number[][][] = [
  [
    [0.06, 0.88],
    [0.19, 0.88],
    [0.19, 0.64],
    [0.33, 0.64],
    [0.33, 0.8],
  ],
  [
    [0.94, 0.16],
    [0.79, 0.16],
    [0.79, 0.38],
    [0.63, 0.38],
  ],
];

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const video = videoRef.current!;
    const coarse = isCoarsePointer();
    const still = prefersReducedMotion();

    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const N_PART = coarse ? 44 : 90;
    const N_THREAD = coarse ? 7 : 14;
    const N_HEX = coarse ? 3 : 6;

    const particles: Particle[] = Array.from({ length: N_PART }, () => ({
      x: rand(0, 1),
      y: rand(0, 1),
      z: rand(0.25, 1),
      tw: rand(0, Math.PI * 2),
    }));
    const threads: Thread[] = Array.from({ length: N_THREAD }, () => ({
      x: rand(0.03, 0.97),
      speed: rand(0.6, 1.7),
      len: rand(70, 230),
      head: rand(0, 1),
      sway: rand(10, 34),
    }));
    const hexes: Hex[] = Array.from({ length: N_HEX }, () => ({
      x: rand(0.08, 0.92),
      y: rand(0.05, 0.95),
      r: rand(55, 150),
      rot: rand(0, Math.PI),
      vr: rand(-0.06, 0.06),
      pulse: rand(0, Math.PI * 2),
      z: rand(0.5, 1),
    }));

    // ---- the machine clock: baseline drift + scroll-linked scrubbing ----
    const BASE = still ? 0 : 26;
    let depth = 0;
    let vel = BASE;
    let elapsed = 0;

    // ---- optional Higgsfield video layer (activates if the file exists) ----
    let videoOk = false;
    const onCanPlay = () => {
      if (still) return;
      videoOk = true;
      video.style.opacity = '0.35';
      video.play().catch(() => {
        /* autoplay refused — canvas carries the scene */
      });
    };
    const onVideoErr = () => {
      videoOk = false;
      video.style.opacity = '0';
    };
    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('error', onVideoErr);

    let hueFrame = 0;
    const driveVideo = (dt: number) => {
      if (!videoOk || !video.duration) return;
      const nv = vel / (BASE || 26); // 1 == idle drift
      if (nv >= 0.3) {
        // forward: modulate playbackRate — buttery, no seeking
        if (video.paused) video.play().catch(() => {});
        video.playbackRate = Math.min(Math.max(nv * 0.18, 0.06), 3.2);
      } else {
        // reverse scrub: playbackRate can't go negative, so seek backward
        if (!video.paused) video.pause();
        if (!video.seeking) {
          const t = video.currentTime + vel * dt * 0.004;
          const d = video.duration;
          video.currentTime = ((t % d) + d) % d;
        }
      }
      if (++hueFrame % 8 === 0) {
        video.style.filter = `hue-rotate(${(-160 * ambient.warmth).toFixed(1)}deg) brightness(${(1 + ambient.energy * 0.15).toFixed(2)})`;
      }
    };

    // ---- render layers ----
    const drawGrid = (glow: number) => {
      ctx.lineWidth = 1;
      for (const [z, cell] of [
        [0.22, 84],
        [0.45, 148],
      ] as const) {
        const off = (((depth * z) % cell) + cell) % cell;
        ctx.strokeStyle = tint(0.028 * glow);
        ctx.beginPath();
        for (let y = -off; y < h + cell; y += cell) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
        }
        for (let x = cell / 2; x < w + cell; x += cell) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, h);
        }
        ctx.stroke();
        // solder pads at intersections
        ctx.fillStyle = tint(0.05 * glow);
        for (let y = -off; y < h + cell; y += cell) {
          for (let x = cell / 2; x < w + cell; x += cell) {
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
      }
    };

    const drawParticles = (dt: number, glow: number) => {
      for (const p of particles) {
        if (!still) {
          p.y -= (vel * p.z * 0.35 * dt) / h;
          p.x += Math.sin(p.tw) * 0.00012;
          p.tw += dt * (0.5 + p.z * 1.1);
          if (p.y < -0.02) p.y += 1.04;
          if (p.y > 1.02) p.y -= 1.04;
        }
        const a = p.z * (0.1 + 0.08 * Math.sin(p.tw)) * glow;
        ctx.fillStyle = tint(Math.max(a, 0.02));
        const s = p.z * 1.9;
        ctx.fillRect(p.x * w, p.y * h, s, s);
      }
    };

    const drawThreads = (dt: number, glow: number) => {
      ctx.lineCap = 'round';
      for (const th of threads) {
        if (!still) {
          th.head -= ((vel * th.speed * 2.1) / h) * dt;
          th.head = ((th.head % 1) + 1) % 1;
        }
        const x = th.x * w + Math.sin(th.head * Math.PI * 2) * th.sway;
        const y0 = th.head * h;
        const y1 = y0 + th.len;
        const grad = ctx.createLinearGradient(x, y0, x, y1);
        grad.addColorStop(0, tint(0.5 * glow));
        grad.addColorStop(1, tint(0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y1);
        ctx.stroke();
        // luminous head
        ctx.fillStyle = tint(0.12 * glow);
        ctx.beginPath();
        ctx.arc(x, y0, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = tint(0.75 * glow);
        ctx.beginPath();
        ctx.arc(x, y0, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawHexes = (dt: number, glow: number) => {
      for (const hx of hexes) {
        if (!still) {
          hx.rot += hx.vr * dt;
          hx.pulse += dt * 0.9;
          hx.y -= (vel * hx.z * 0.09 * dt) / h;
          if (hx.y < -0.25) hx.y += 1.5;
          if (hx.y > 1.25) hx.y -= 1.5;
        }
        const a = (0.05 + 0.05 * (0.5 + 0.5 * Math.sin(hx.pulse))) * glow;
        const r = hx.r * (1 + 0.04 * Math.sin(hx.pulse * 0.8));
        const cx = hx.x * w;
        const cy = hx.y * h;
        ctx.beginPath();
        for (let k = 0; k <= 6; k++) {
          const ang = hx.rot + (k * Math.PI) / 3;
          const px = cx + r * Math.cos(ang);
          const py = cy + r * Math.sin(ang);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        // soft-focus double stroke
        ctx.strokeStyle = tint(a * 0.35);
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.strokeStyle = tint(a);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    const drawTraces = (glow: number) => {
      TRACES.forEach((pts, ti) => {
        const abs = pts.map(([px, py]) => [px * w, py * h] as const);
        ctx.strokeStyle = tint(0.06 * glow);
        ctx.lineWidth = 1;
        ctx.beginPath();
        abs.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
        ctx.stroke();
        // endpoint pads
        ctx.fillStyle = tint(0.1 * glow);
        const [ex, ey] = abs[abs.length - 1];
        const [sx, sy] = abs[0];
        ctx.fillRect(sx - 2, sy - 2, 4, 4);
        ctx.fillRect(ex - 2, ey - 2, 4, 4);
        // traveling pulse
        let total = 0;
        const lens = abs.slice(1).map(([px, py], i) => {
          const l = Math.hypot(px - abs[i][0], py - abs[i][1]);
          total += l;
          return l;
        });
        let u = ((depth * 0.0016 * (ti === 0 ? 1 : -1)) % 1 + 1) % 1;
        let dist = u * total;
        for (let i = 0; i < lens.length; i++) {
          if (dist <= lens[i]) {
            const t = dist / lens[i];
            const x = lerp(abs[i][0], abs[i + 1][0], t);
            const y = lerp(abs[i][1], abs[i + 1][1], t);
            ctx.fillStyle = tint(0.55 * glow);
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          dist -= lens[i];
        }
      });
    };

    const draw = (dt: number) => {
      const glow = 1 + ambient.energy * 0.7;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);
      drawGrid(glow);
      drawParticles(dt, glow);
      ctx.globalCompositeOperation = 'lighter';
      drawThreads(dt, glow);
      drawHexes(dt, glow);
      drawTraces(glow);
      ctx.globalCompositeOperation = 'source-over';
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      // scroll velocity feeds the clock; decays once Lenis goes quiet
      const sv = scrollState.velocity;
      scrollState.velocity *= 0.92;
      const target = BASE + (still ? 0 : sv * (coarse ? 9 : 14));
      vel = lerp(vel, target, 0.085);
      depth += vel * dt;
      draw(dt);
      driveVideo(dt);
    };

    if (still) {
      // render one static frame, no loop
      draw(0);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onVis = () => {
      if (still) return;
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('error', onVideoErr);
      void elapsed;
    };
  }, []);

  return (
    <div
      id="ambient-stage"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={
        {
          '--amb-blur': '0px',
          filter: 'blur(var(--amb-blur))',
          willChange: 'filter',
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Higgsfield AI ambient loop — drops in automatically when
          public/media/ambient.mp4 exists; canvas carries the scene until then */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        style={{ opacity: 0 }}
        src="/media/ambient.mp4"
        muted
        playsInline
        loop
        preload="auto"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 32%, transparent 0%, rgba(6,6,10,0.45) 62%, rgba(4,4,8,0.85) 100%)',
        }}
      />
    </div>
  );
}
