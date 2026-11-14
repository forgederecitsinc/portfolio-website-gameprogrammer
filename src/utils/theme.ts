import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  rose: {
    surface: 'bg-rose-50/75 hover:bg-rose-50',
    badge: 'bg-rose-100/80 text-rose-900 border-rose-200/80',
    border: 'border-rose-200/70',
    accentText: 'text-rose-800',
    dot: 'bg-rose-400',
  },
  violet: {
    surface: 'bg-violet-50/75 hover:bg-violet-50',
    badge: 'bg-violet-100/80 text-violet-900 border-violet-200/80',
    border: 'border-violet-200/70',
    accentText: 'text-violet-800',
    dot: 'bg-violet-400',
  },
  amber: {
    surface: 'bg-amber-50/75 hover:bg-amber-50',
    badge: 'bg-amber-100/80 text-amber-900 border-amber-200/80',
    border: 'border-amber-200/70',
    accentText: 'text-amber-800',
    dot: 'bg-amber-400',
  },
  emerald: {
    surface: 'bg-emerald-50/75 hover:bg-emerald-50',
    badge: 'bg-emerald-100/80 text-emerald-900 border-emerald-200/80',
    border: 'border-emerald-200/70',
    accentText: 'text-emerald-800',
    dot: 'bg-emerald-400',
  },
  sky: {
    surface: 'bg-sky-50/75 hover:bg-sky-50',
    badge: 'bg-sky-100/80 text-sky-900 border-sky-200/80',
    border: 'border-sky-200/70',
    accentText: 'text-sky-800',
    dot: 'bg-sky-400',
  },
  teal: {
    surface: 'bg-teal-50/75 hover:bg-teal-50',
    badge: 'bg-teal-100/80 text-teal-900 border-teal-200/80',
    border: 'border-teal-200/70',
    accentText: 'text-teal-800',
    dot: 'bg-teal-400',
  },
};
