import { useRef, type ReactNode } from 'react';

interface Card3DTiltProps {
  children: ReactNode;
  className?: string;
}

/**
 * Lightweight 3D perspective tilt wrapper for interactive cards.
 * Animates GPU-composited transform only and skips under prefers-reduced-motion.
 */
export function Card3DTilt({ children, className = '' }: Card3DTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = px * 8;
    const rotateX = -py * 8;
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
