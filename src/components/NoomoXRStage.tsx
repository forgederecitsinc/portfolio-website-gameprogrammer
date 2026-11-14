import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface XRChapter {
  id: string;
  num: string;
  label: string;
  content: ReactNode;
}

interface NoomoXRStageProps {
  chapters: XRChapter[];
}

/**
 * Sticky 3D Z-axis camera-tunnel scroll stage inspired by xr.noomoagency.com.
 * - Desktop: chapters fly forward out of deep Z-space into focus and pass the camera.
 * - Mobile (< 768px) or prefers-reduced-motion: falls back to clean vertical flow.
 */
export function NoomoXRStage({ chapters }: NoomoXRStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isXRMode, setIsXRMode] = useState(false);

  useEffect(() => {
    const checkMode = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      setIsXRMode(!reduced && desktop);
    };
    checkMode();
    window.addEventListener('resize', checkMode, { passive: true });
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  useEffect(() => {
    if (!isXRMode) return;

    let raf = 0;
    let cur = 0;
    let target = 0;
    let mounted = true;
    const maxIndex = Math.max(0, chapters.length - 1);

    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      target = (scrolled / scrollable) * maxIndex;
    };

    const applyTransforms = (progress: number) => {
      const nearest = Math.round(progress);
      setActiveIndex((prev) => (prev !== nearest ? nearest : prev));

      for (let i = 0; i < chapters.length; i++) {
        const layer = layerRefs.current[i];
        if (!layer) continue;

        const delta = i - progress;
        const abs = Math.abs(delta);

        if (abs > 1.35) {
          layer.style.opacity = '0';
          layer.style.pointerEvents = 'none';
          layer.style.visibility = 'hidden';
          continue;
        }

        layer.style.visibility = 'visible';

        // Upcoming chapters emerge from deep Z-space; passed chapters zoom past camera
        const z = delta >= 0 ? -delta * 540 : -delta * 340;
        const y = delta * 36;
        const scale = delta >= 0 ? Math.max(0.66, 1 - delta * 0.24) : 1 + abs * 0.22;
        const rotX = delta * -4.5;
        const opacity = delta >= 0 ? Math.max(0, 1 - delta * 1.15) : Math.max(0, 1 - abs * 1.45);

        layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg)`;
        layer.style.opacity = opacity.toFixed(3);
        layer.style.pointerEvents = abs < 0.42 ? 'auto' : 'none';
        layer.style.zIndex = String(Math.round(50 - abs * 10));
      }
    };

    const tick = () => {
      if (!mounted) return;
      cur += (target - cur) * 0.12;
      applyTransforms(cur);

      if (Math.abs(target - cur) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        cur = target;
        applyTransforms(cur);
        raf = 0;
      }
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    cur = target;
    applyTransforms(cur);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      mounted = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isXRMode, chapters.length]);

  const jumpToChapter = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const maxIndex = Math.max(1, chapters.length - 1);
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    const topOffset = el.getBoundingClientRect().top + window.scrollY;
    const targetY = topOffset + (index / maxIndex) * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isXRMode) return;
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute('href') || '';
      if (hash.startsWith('#/')) return;
      const id = hash.slice(1);
      if (!id) return;
      const idx = chapters.findIndex(
        (ch, i) => ch.id === id || layerRefs.current[i]?.querySelector(`#${CSS.escape(id)}`) !== null
      );
      if (idx !== -1) {
        e.preventDefault();
        jumpToChapter(idx);
      }
    };
    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, [isXRMode, chapters]);

  if (!isXRMode) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {chapters.map((ch) => (
          <div key={ch.id} id={ch.id}>
            {ch.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: `${chapters.length * 115}vh` }}
      className="relative"
    >
      <div
        className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden"
        style={{ perspective: '1250px', transformStyle: 'preserve-3d' }}
      >
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            id={ch.id}
            ref={(el) => {
              layerRefs.current[idx] = el;
            }}
            className="absolute inset-0 flex items-center justify-center overflow-y-auto px-4 py-6 will-change-transform sm:px-6"
          >
            <div className="mx-auto w-full max-w-6xl">{ch.content}</div>
          </div>
        ))}

        {/* Bottom XR Chapter Navigation Bar */}
        <div className="pointer-events-auto fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#B4B4AE] bg-[#F7F7F5]/90 p-1.5 shadow-lg backdrop-blur-md">
          {chapters.map((ch, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-[#0070D1] text-white shadow-2xs'
                    : 'text-[#404040] hover:bg-[#ECEBE9] hover:text-[#0F0F0F]'
                }`}
              >
                <span className="opacity-70">{ch.num}</span>
                <span className="hidden lg:inline">{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
