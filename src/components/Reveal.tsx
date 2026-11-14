import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

/**
 * Pass-through wrapper (zero opacity fading or snapping).
 * Spatial motion is handled smoothly by ScrollParallax and ScrollScrub3D.
 */
export function Reveal({ children, className = '' }: RevealProps) {
  return <div className={className}>{children}</div>;
}
