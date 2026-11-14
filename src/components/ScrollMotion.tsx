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
        className="h-full origin-left bg-gradient-to-r from-[#0070D1] via-[#00B4FF] to-[#4F46E5] transition-transform duration-75 ease-out"
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

interface ScrollScrub3DProps {
  children: ReactNode;
  /** 'left' | 'right' | 'center' fans columns into 3D formation as you scroll */
  origin?: 'left' | 'right' | 'center';
  /** Enables a scroll-scrubbed clip-path portal reveal */
  portalWipe?: boolean;
  className?: string;
}

/**
 * Continuous scroll-scrubbed 3D spatial reveal (no one-shot fade, no sticky trap).
 * Scrubs 3D perspective, lateral fan, scale, and optional clip-path portal wipe
 * directly with scroll progress using smooth lerp damping.
 */
export function ScrollScrub3D({
  children,
  origin = 'center',
  portalWipe = false,
  className = '',
}: ScrollScrub3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    let cur = 0;
    let target = 0;
    let active = true;

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 = well below viewport, 1 = centered/entered, 2 = scrolled past top
      const enterProgress = (vh - rect.top) / (vh * 0.65);
      target = Math.max(0, Math.min(1, enterProgress));
    };

    const apply = (p: number) => {
      const el = ref.current;
      if (!el) return;
      const inv = 1 - p; // 1 before entering -> 0 when in view

      const dirSign = origin === 'left' ? -1 : origin === 'right' ? 1 : 0;
      const tx = dirSign * inv * 44;
      const ty = inv * 52;
      const scale = 0.88 + p * 0.12;
      const rotX = inv * 14;
      const rotY = dirSign * inv * -12;

      el.style.transform = `perspective(1100px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      el.style.opacity = Math.min(1, 0.15 + p * 0.85).toFixed(3);

      if (portalWipe) {
        const insetX = Math.max(0, inv * 6);
        const insetY = Math.max(0, inv * 8);
        const radius = Math.round(12 + inv * 24);
        el.style.clipPath = `inset(${insetY.toFixed(1)}% ${insetX.toFixed(1)}% round ${radius}px)`;
      }
    };

    const tick = () => {
      if (!active) return;
      cur += (target - cur) * 0.16;
      apply(cur);

      if (Math.abs(target - cur) > 0.002) {
        raf = requestAnimationFrame(tick);
      } else {
        cur = target;
        apply(cur);
        raf = 0;
      }
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    cur = target;
    apply(cur);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      active = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [origin, portalWipe]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
