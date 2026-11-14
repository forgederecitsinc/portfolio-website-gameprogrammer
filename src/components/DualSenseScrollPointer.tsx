import { useEffect, useRef, useState, type MouseEvent } from 'react';

/**
 * Right-edge DualSense controller scrollbar pointer that travels along a
 * vertical track, tilts with scroll velocity, deflects its thumbsticks,
 * and glows its touchpad lightbar as the user scrolls.
 */
export function DualSenseScrollPointer() {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const pct = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;

      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      const clampedVel = Math.max(-1, Math.min(1, delta / 40));

      setProgress(pct);
      setVelocity(clampedVel);

      if (Math.abs(delta) > 0.5) {
        setIsScrolling(true);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => {
          setIsScrolling(false);
          setVelocity(0);
        }, 160);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    lastScrollY.current = window.scrollY;
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  const handleTrackClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' });
  };

  // Monochrome archival charcoal -> sepia tone
  const lightness = Math.round(52 - progress * 34);
  const lightbarColor = `hsl(30, 14%, ${lightness}%)`;
  const tiltDeg = velocity * 10;
  const stickOffsetY = velocity * 2.4;
  const pctLabel = Math.round(progress * 100);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-2.5 top-24 bottom-8 z-40 hidden w-12 select-none sm:flex sm:flex-col sm:items-center md:right-4"
    >
      {/* Clickable vertical track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        title="Click to jump to scroll position"
        className="pointer-events-auto relative h-full w-full cursor-pointer"
      >
        {/* Background rail */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-slate-300/60 dark:bg-slate-700/60" />

        {/* Active progress fill */}
        <div
          className="absolute top-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#1A1715] transition-[height] duration-75 ease-out"
          style={{ height: `${progress * 100}%` }}
        />

        {/* DualSense controller pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
          style={{
            top: `${progress * 100}%`,
            transform: `translate(-50%, -50%) rotate(${tiltDeg.toFixed(1)}deg) scale(${isScrolling ? 1.08 : 1})`,
          }}
        >
          {/* Outer glow when scrolling */}
          <div
            className="absolute inset-0 -z-10 rounded-full blur-md transition-opacity duration-200"
            style={{
              backgroundColor: lightbarColor,
              opacity: isScrolling ? 0.5 : 0.18,
            }}
          />

          {/* DualSense SVG */}
          <svg
            width="44"
            height="32"
            viewBox="0 0 88 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            {/* L2 / R2 adaptive triggers */}
            <path
              d="M17 12C17 9.5 19.5 8 24 8H30V13H17V12Z"
              className="fill-slate-700 dark:fill-slate-400"
            />
            <path
              d="M71 12C71 9.5 68.5 8 64 8H58V13H71V12Z"
              className="fill-slate-700 dark:fill-slate-400"
            />

            {/* Main white/pearl DualSense shell */}
            <path
              d="M24 12C17 12 12.5 17 10.5 25L6.5 45C5.2 51.5 8.5 56 13.5 56C17 56 19.5 53.5 22 48.5L26 40C27.5 37.5 30 36 33 36H55C58 36 60.5 37.5 62 40L66 48.5C68.5 53.5 71 56 74.5 56C79.5 56 82.8 51.5 81.5 45L77.5 25C75.5 17 71 12 64 12H24Z"
              className="fill-white stroke-slate-300 dark:fill-slate-100 dark:stroke-slate-500"
              strokeWidth="2"
            />

            {/* Dark lower grip accent (signature DualSense two-tone) */}
            <path
              d="M25 32C28 31 31 32.5 33 35.5H55C57 32.5 60 31 63 32L66 41C64 38 60.5 36.5 56 36.5H32C27.5 36.5 24 38 22 41L25 32Z"
              className="fill-slate-800 dark:fill-slate-900"
            />

            {/* Touchpad */}
            <path
              d="M31 13H57L55 27C54.7 28.5 53.5 29.5 52 29.5H36C34.5 29.5 33.3 28.5 33 27L31 13Z"
              className="fill-slate-100 stroke-slate-300 dark:fill-slate-200 dark:stroke-slate-400"
              strokeWidth="1.2"
            />

            {/* DualSense glowing lightbar strips flanking touchpad */}
            <path
              d="M30.5 14.5L32.4 26.5"
              stroke={lightbarColor}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M57.5 14.5L55.6 26.5"
              stroke={lightbarColor}
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* D-pad (left) */}
            <g className="fill-slate-700">
              <rect x="19" y="20" width="3.5" height="9" rx="1" />
              <rect x="16.25" y="22.75" width="9" height="3.5" rx="1" />
            </g>

            {/* Face buttons (right) */}
            <circle cx="67.5" cy="20.5" r="1.9" fill={isScrolling ? '#34d399' : '#64748b'} />
            <circle cx="71.5" cy="24.5" r="1.9" fill={isScrolling ? '#fb7185' : '#64748b'} />
            <circle cx="67.5" cy="28.5" r="1.9" fill={isScrolling ? '#60a5fa' : '#64748b'} />
            <circle cx="63.5" cy="24.5" r="1.9" fill={isScrolling ? '#c084fc' : '#64748b'} />

            {/* Left & Right Analog Sticks (deflect vertically with scroll) */}
            <circle cx="33.5" cy="36.5" r="5" className="fill-slate-900" />
            <circle
              cx="33.5"
              cy={36.5 + stickOffsetY}
              r="3.4"
              className="fill-slate-600 transition-all duration-100"
            />
            <circle cx="54.5" cy="36.5" r="5" className="fill-slate-900" />
            <circle
              cx="54.5"
              cy={36.5 + stickOffsetY}
              r="3.4"
              className="fill-slate-600 transition-all duration-100"
            />

            {/* Center PS button */}
            <circle cx="44" cy="33" r="1.7" fill={lightbarColor} />
          </svg>

          {/* Compact scroll percentage badge */}
          <span className="mt-0.5 block text-center font-mono text-[9px] font-semibold tracking-tight text-slate-600 dark:text-slate-300">
            {pctLabel}%
          </span>
        </div>
      </div>
    </div>
  );
}
