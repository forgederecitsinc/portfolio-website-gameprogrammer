import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Top-of-screen gradient progress bar tracking page scroll percentage.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      setProgress(pct);
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[#D7C4B6] via-[#A47864] to-[#4A352C] transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  /** Vertical parallax travel in pixels as the element crosses the viewport. */
  offsetY?: number;
  /** Subtle scale-in range (e.g. 0.94 -> 1.0). */
  scaleFrom?: number;
  /** Subtle 3D tilt in degrees at entry -> 0deg at center. */
  tiltDeg?: number;
  className?: string;
}

/**
 * Noomo-inspired continuous scroll-scrubbed parallax, scale, and 3D perspective container.
 */
export function ScrollParallax({
  children,
  offsetY = 28,
  scaleFrom = 0.96,
  tiltDeg = 4,
  className = '',
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (below viewport) -> 0 (centered) -> +1 (above viewport)
      const center = rect.top + rect.height / 2;
      const normalized = Math.max(-1, Math.min(1, (center - vh / 2) / (vh * 0.75)));
      const absNorm = Math.abs(normalized);

      const y = normalized * offsetY;
      const scale = 1 - (1 - scaleFrom) * Math.min(1, absNorm);
      const tilt = normalized * tiltDeg;

      el.style.transform = `perspective(1000px) translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${tilt.toFixed(2)}deg)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offsetY, scaleFrom, tiltDeg]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
