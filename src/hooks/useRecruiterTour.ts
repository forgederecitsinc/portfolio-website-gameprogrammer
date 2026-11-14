import { useEffect, useState } from 'react';

export interface TourStop {
  id: string;
  label: string;
  targetId: string;
}

export const TOUR_STOPS: TourStop[] = [
  { id: 'hero', label: 'Identity & Overview', targetId: 'top' },
  { id: 'projects', label: 'Flagship Games & Systems', targetId: 'projects' },
  { id: 'dualsense', label: 'DualSense Haptics & Audio Lab', targetId: 'dualsense' },
  { id: 'characters', label: 'Original Character Profiles', targetId: 'characters' },
  { id: 'writing', label: 'Branching Narrative & Writing', targetId: 'writing' },
  { id: 'resume', label: 'Experience, Studio & Contact', targetId: 'resume' },
];

const TOUR_DURATION_SECONDS = 30;

/**
 * Drives an automated 30-second guided scroll tour across the portfolio.
 * Locks manual scrolling/navigation until the 30s timer finishes or the user stops it.
 */
export function useRecruiterTour(active: boolean, onStop: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(TOUR_DURATION_SECONDS);
  const [stopIndex, setStopIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setSecondsLeft(TOUR_DURATION_SECONDS);
      setStopIndex(0);
      return;
    }

    setSecondsLeft(TOUR_DURATION_SECONDS);
    setStopIndex(0);

    // Lock manual wheel, touchmove, and navigation keys while on tour
    const preventWheelOrTouch = (e: Event) => {
      e.preventDefault();
    };
    const preventNavKeys = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventWheelOrTouch, { passive: false });
    window.addEventListener('touchmove', preventWheelOrTouch, { passive: false });
    window.addEventListener('keydown', preventNavKeys, { passive: false });

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          onStop();
          return 0;
        }
        const elapsed = TOUR_DURATION_SECONDS - (prev - 1);
        const nextStop = Math.min(
          TOUR_STOPS.length - 1,
          Math.floor((elapsed / TOUR_DURATION_SECONDS) * TOUR_STOPS.length)
        );
        setStopIndex(nextStop);
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('wheel', preventWheelOrTouch);
      window.removeEventListener('touchmove', preventWheelOrTouch);
      window.removeEventListener('keydown', preventNavKeys);
      window.clearInterval(interval);
    };
  }, [active, onStop]);

  // Smoothly scroll to the active stop whenever stopIndex changes
  useEffect(() => {
    if (!active) return;
    const stop = TOUR_STOPS[stopIndex];
    if (!stop) return;
    if (stop.targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(stop.targetId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [active, stopIndex]);

  return {
    secondsLeft,
    stopIndex,
    currentStop: TOUR_STOPS[stopIndex],
    progressPct: ((TOUR_DURATION_SECONDS - secondsLeft) / TOUR_DURATION_SECONDS) * 100,
  };
}
