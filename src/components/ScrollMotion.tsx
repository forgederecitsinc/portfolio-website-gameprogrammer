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
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-[#0F0F0F] transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  /** Vertical parallax travel in pixels as the element crosses the viewport. */
  offsetY?: number;
  /** Optional subtle horizontal drift in pixels (Noomo XR spatial offset). */
  offsetX?: number;
  /** Subtle scale-in range (e.g. 0.92 -> 1.0). */
  scaleFrom?: number;
  /** Subtle 3D pitch tilt in degrees at entry -> 0deg at center. */
  tiltDeg?: number;
  /** Subtle 3D yaw tilt in degrees for spatial depth. */
  yawDeg?: number;
  className?: string;
}

/**
 * Noomo XR-inspired lerp-damped 3D camera-dolly scroll parallax container.
 * Uses native scroll + GPU-composited transform/opacity (zero scroll-jacking).
 */
export function ScrollParallax({
  children,
  offsetY = 36,
  offsetX = 0,
  scaleFrom = 0.93,
  tiltDeg = 6,
  yawDeg = 0,
  className = '',
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    let curNorm = 0;
    let targetNorm = 0;
    let active = true;

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      targetNorm = Math.max(-1, Math.min(1, (center - vh / 2) / (vh * 0.8)));
    };

    const tick = () => {
      if (!active) return;
      const el = ref.current;
      if (!el) return;

      curNorm += (targetNorm - curNorm) * 0.14;
      const absNorm = Math.abs(curNorm);

      const y = curNorm * offsetY;
      const x = curNorm * offsetX;
      const scale = 1 - (1 - scaleFrom) * Math.min(1, absNorm * 1.15);
      const tiltX = curNorm * tiltDeg;
      const tiltY = curNorm * yawDeg;
      const opacity = Math.max(0.45, 1 - absNorm * 0.35);

      el.style.transform = `perspective(1200px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);

      if (Math.abs(targetNorm - curNorm) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    curNorm = targetNorm;
    tick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      active = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offsetY, offsetX, scaleFrom, tiltDeg, yawDeg]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
