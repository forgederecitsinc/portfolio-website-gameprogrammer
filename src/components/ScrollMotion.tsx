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
  /** Subtle scale-in range (e.g. 0.94 -> 1.0). */
  scaleFrom?: number;
  /** Subtle 3D pitch tilt in degrees at entry -> 0deg at center. */
  tiltDeg?: number;
  /** Subtle 3D yaw tilt in degrees for spatial depth. */
  yawDeg?: number;
  className?: string;
}

/**
 * Butter-smooth lerp-damped 3D camera-dolly scroll parallax container.
 * Zero opacity fading and zero snapping (C2-smooth cosine easing).
 */
export function ScrollParallax({
  children,
  offsetY = 30,
  offsetX = 0,
  scaleFrom = 0.95,
  tiltDeg = 5,
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
      const raw = Math.max(-1, Math.min(1, (center - vh / 2) / (vh * 0.85)));
      // Smooth sine curve so velocity eases to 0 at edges & center (no snap)
      targetNorm = Math.sin((raw * Math.PI) / 2);
    };

    const tick = () => {
      if (!active) return;
      const el = ref.current;
      if (!el) return;

      curNorm += (targetNorm - curNorm) * 0.085;
      const absNorm = Math.abs(curNorm);

      const y = curNorm * offsetY;
      const x = curNorm * offsetX;
      const scale = 1 - (1 - scaleFrom) * (absNorm * absNorm);
      const tiltX = curNorm * tiltDeg;
      const tiltY = curNorm * yawDeg;

      el.style.transform = `perspective(1200px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

      if (Math.abs(targetNorm - curNorm) > 0.0008) {
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
  /** 'left' | 'right' | 'center' fans columns smoothly in 3D space as you scroll */
  origin?: 'left' | 'right' | 'center';
  /** Enables a smooth scroll-scrubbed border-radius & scale portal curve */
  portalWipe?: boolean;
  className?: string;
}

/**
 * Liquid-smooth 3D spatial scrub with zero opacity fading and zero snapping.
 * Uses a continuous symmetric bell-curve around viewport center + 0.085 lerp.
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
      const center = rect.top + rect.height / 2;
      // -1 below viewport, 0 centered, +1 above viewport
      target = Math.max(-1, Math.min(1, (center - vh / 2) / (vh * 0.85)));
    };

    const apply = (signed: number) => {
      const el = ref.current;
      if (!el) return;
      // C2-continuous bell curve: 0 at center, smoothly rising to 1 at edges
      const edgeFactor = 0.5 - 0.5 * Math.cos(signed * Math.PI);
      const dirSign = origin === 'left' ? -1 : origin === 'right' ? 1 : 0;

      const tx = dirSign * edgeFactor * 34;
      const ty = signed * 26;
      const scale = 1 - edgeFactor * 0.075;
      const rotX = -signed * 9;
      const rotY = dirSign * edgeFactor * -10;

      el.style.transform = `perspective(1200px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      if (portalWipe) {
        const inset = edgeFactor * 3.5;
        const radius = Math.round(12 + edgeFactor * 22);
        el.style.clipPath = `inset(0% ${inset.toFixed(2)}% round ${radius}px)`;
      }
    };

    const tick = () => {
      if (!active) return;
      cur += (target - cur) * 0.085;
      apply(cur);

      if (Math.abs(target - cur) > 0.0008) {
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
