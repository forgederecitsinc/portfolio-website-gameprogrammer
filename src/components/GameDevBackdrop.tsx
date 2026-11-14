import { useEffect, useRef } from 'react';
import {
  Code2,
  Compass,
  Cpu,
  Dices,
  Gamepad2,
  GitBranch,
  Puzzle,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface FloatingToken {
  id: string;
  top: string;
  left: string;
  depth: number;
  rotate: number;
  colorClass: string;
  sizeClass: string;
  Icon: typeof Gamepad2;
}

const TOKENS: FloatingToken[] = [
  {
    id: 'pad-1',
    top: '12%',
    left: '7%',
    depth: 26,
    rotate: -12,
    colorClass: 'text-violet-400/40 dark:text-violet-400/25',
    sizeClass: 'h-9 w-9',
    Icon: Gamepad2,
  },
  {
    id: 'code-1',
    top: '18%',
    left: '86%',
    depth: 34,
    rotate: 10,
    colorClass: 'text-sky-400/40 dark:text-sky-400/25',
    sizeClass: 'h-8 w-8',
    Icon: Code2,
  },
  {
    id: 'puzzle-1',
    top: '36%',
    left: '14%',
    depth: 18,
    rotate: 18,
    colorClass: 'text-rose-400/35 dark:text-rose-400/25',
    sizeClass: 'h-8 w-8',
    Icon: Puzzle,
  },
  {
    id: 'branch-1',
    top: '32%',
    left: '90%',
    depth: 28,
    rotate: -8,
    colorClass: 'text-emerald-500/35 dark:text-emerald-400/25',
    sizeClass: 'h-9 w-9',
    Icon: GitBranch,
  },
  {
    id: 'dice-1',
    top: '56%',
    left: '5%',
    depth: 32,
    rotate: 14,
    colorClass: 'text-amber-500/35 dark:text-amber-300/25',
    sizeClass: 'h-8 w-8',
    Icon: Dices,
  },
  {
    id: 'terminal-1',
    top: '58%',
    left: '84%',
    depth: 22,
    rotate: -14,
    colorClass: 'text-teal-500/35 dark:text-teal-300/25',
    sizeClass: 'h-8 w-8',
    Icon: Terminal,
  },
  {
    id: 'compass-1',
    top: '76%',
    left: '12%',
    depth: 24,
    rotate: 8,
    colorClass: 'text-sky-500/35 dark:text-sky-300/20',
    sizeClass: 'h-9 w-9',
    Icon: Compass,
  },
  {
    id: 'cpu-1',
    top: '78%',
    left: '88%',
    depth: 30,
    rotate: -10,
    colorClass: 'text-violet-500/35 dark:text-violet-300/25',
    sizeClass: 'h-8 w-8',
    Icon: Cpu,
  },
  {
    id: 'spark-1',
    top: '22%',
    left: '48%',
    depth: 16,
    rotate: 6,
    colorClass: 'text-amber-400/40 dark:text-amber-300/20',
    sizeClass: 'h-7 w-7',
    Icon: Sparkles,
  },
];

/**
 * Cursor-reactive game-design & game-dev background pattern with blueprint grid,
 * soft spotlight, and multi-depth parallax icons.
 */
export function GameDevBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pointerPxX = window.innerWidth * 0.5;
    let pointerPxY = window.innerHeight * 0.3;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      pointerPxX = e.clientX;
      pointerPxY = e.clientY;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (layerRef.current) {
        const items = layerRef.current.querySelectorAll<HTMLElement>('[data-depth]');
        items.forEach((el) => {
          const depth = Number(el.dataset.depth || 20);
          const rot = Number(el.dataset.rotate || 0);
          const tx = currentX * depth;
          const ty = currentY * depth;
          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot}deg)`;
        });
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(520px circle at ${pointerPxX}px ${pointerPxY}px, rgba(139, 92, 246, 0.10), transparent 70%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Subtle level-design dot grid */}
      <div
        className="absolute inset-0 opacity-45 dark:opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148, 163, 184, 0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Cursor-following soft spotlight */}
      <div ref={spotlightRef} className="absolute inset-0 transition-opacity duration-300" />

      {/* Ambient floating pastel aurora orbs */}
      <div className="animate-float-slow absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-600/20" />
      <div className="animate-float-reverse absolute top-10 right-[-4rem] h-80 w-80 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-600/15" />
      <div className="animate-float-slow absolute top-48 left-1/3 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl dark:bg-sky-500/15" />

      {/* Cursor-reactive game-design & game-dev icon layer */}
      <div ref={layerRef} className="absolute inset-0">
        {TOKENS.map(({ id, top, left, depth, rotate, colorClass, sizeClass, Icon }) => (
          <div
            key={id}
            data-depth={depth}
            data-rotate={rotate}
            style={{ top, left, transform: `rotate(${rotate}deg)` }}
            className={`absolute will-change-transform ${colorClass}`}
          >
            <Icon className={sizeClass} strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </div>
  );
}
