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
    surface: 'bg-rose-50/75 hover:bg-rose-50 dark:bg-rose-950/30 dark:hover:bg-rose-950/45',
    badge:
      'bg-rose-100/80 text-rose-900 border-rose-200/80 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800/70',
    border: 'border-rose-200/70 dark:border-rose-900/60',
    accentText: 'text-rose-800 dark:text-rose-300',
    dot: 'bg-rose-400',
  },
  violet: {
    surface: 'bg-violet-50/75 hover:bg-violet-50 dark:bg-violet-950/30 dark:hover:bg-violet-950/45',
    badge:
      'bg-violet-100/80 text-violet-900 border-violet-200/80 dark:bg-violet-950/70 dark:text-violet-200 dark:border-violet-800/70',
    border: 'border-violet-200/70 dark:border-violet-900/60',
    accentText: 'text-violet-800 dark:text-violet-300',
    dot: 'bg-violet-400',
  },
  amber: {
    surface: 'bg-amber-50/75 hover:bg-amber-50 dark:bg-amber-950/30 dark:hover:bg-amber-950/45',
    badge:
      'bg-amber-100/80 text-amber-900 border-amber-200/80 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800/70',
    border: 'border-amber-200/70 dark:border-amber-900/60',
    accentText: 'text-amber-800 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
  emerald: {
    surface:
      'bg-emerald-50/75 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/45',
    badge:
      'bg-emerald-100/80 text-emerald-900 border-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800/70',
    border: 'border-emerald-200/70 dark:border-emerald-900/60',
    accentText: 'text-emerald-800 dark:text-emerald-300',
    dot: 'bg-emerald-400',
  },
  sky: {
    surface: 'bg-sky-50/75 hover:bg-sky-50 dark:bg-sky-950/30 dark:hover:bg-sky-950/45',
    badge:
      'bg-sky-100/80 text-sky-900 border-sky-200/80 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-800/70',
    border: 'border-sky-200/70 dark:border-sky-900/60',
    accentText: 'text-sky-800 dark:text-sky-300',
    dot: 'bg-sky-400',
  },
  teal: {
    surface: 'bg-teal-50/75 hover:bg-teal-50 dark:bg-teal-950/30 dark:hover:bg-teal-950/45',
    badge:
      'bg-teal-100/80 text-teal-900 border-teal-200/80 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-800/70',
    border: 'border-teal-200/70 dark:border-teal-900/60',
    accentText: 'text-teal-800 dark:text-teal-300',
    dot: 'bg-teal-400',
  },
};
