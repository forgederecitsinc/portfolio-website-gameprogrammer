import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

/**
 * Scroll-triggered 3D perspective rise, scale, and unblur reveal wrapper.
 */
export function Reveal({ children, delayMs = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delayMs}ms`,
        transform: visible
          ? 'perspective(1000px) translate3d(0, 0, 0) scale(1) rotateX(0deg)'
          : 'perspective(1000px) translate3d(0, 34px, 0) scale(0.95) rotateX(6deg)',
      }}
      className={`transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transform-none motion-reduce:transition-none ${
        visible ? 'opacity-100 blur-none' : 'opacity-0 blur-[3px] motion-reduce:opacity-100 motion-reduce:blur-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}
