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
    surface:
      'bg-rose-50/80 hover:bg-rose-50 dark:bg-rose-950/40 dark:hover:bg-rose-900/50',
    badge:
      'bg-rose-100/90 text-rose-900 border-rose-200/80 dark:bg-rose-900/70 dark:text-rose-100 dark:border-rose-700/80',
    border: 'border-rose-200/80 dark:border-rose-700/60',
    accentText: 'text-rose-800 dark:text-rose-300',
    dot: 'bg-rose-400 dark:bg-rose-300',
  },
  violet: {
    surface:
      'bg-violet-50/80 hover:bg-violet-50 dark:bg-violet-950/40 dark:hover:bg-violet-900/50',
    badge:
      'bg-violet-100/90 text-violet-900 border-violet-200/80 dark:bg-violet-900/70 dark:text-violet-100 dark:border-violet-700/80',
    border: 'border-violet-200/80 dark:border-violet-700/60',
    accentText: 'text-violet-800 dark:text-violet-300',
    dot: 'bg-violet-400 dark:bg-violet-300',
  },
  amber: {
    surface:
      'bg-amber-50/80 hover:bg-amber-50 dark:bg-amber-950/35 dark:hover:bg-amber-900/45',
    badge:
      'bg-amber-100/90 text-amber-900 border-amber-200/80 dark:bg-amber-900/70 dark:text-amber-100 dark:border-amber-700/80',
    border: 'border-amber-200/80 dark:border-amber-700/60',
    accentText: 'text-amber-800 dark:text-amber-300',
    dot: 'bg-amber-400 dark:bg-amber-300',
  },
  emerald: {
    surface:
      'bg-emerald-50/80 hover:bg-emerald-50 dark:bg-emerald-950/35 dark:hover:bg-emerald-900/45',
    badge:
      'bg-emerald-100/90 text-emerald-900 border-emerald-200/80 dark:bg-emerald-900/70 dark:text-emerald-100 dark:border-emerald-700/80',
    border: 'border-emerald-200/80 dark:border-emerald-700/60',
    accentText: 'text-emerald-800 dark:text-emerald-300',
    dot: 'bg-emerald-400 dark:bg-emerald-300',
  },
  sky: {
    surface: 'bg-sky-50/80 hover:bg-sky-50 dark:bg-sky-950/40 dark:hover:bg-sky-900/50',
    badge:
      'bg-sky-100/90 text-sky-900 border-sky-200/80 dark:bg-sky-900/70 dark:text-sky-100 dark:border-sky-700/80',
    border: 'border-sky-200/80 dark:border-sky-700/60',
    accentText: 'text-sky-800 dark:text-sky-300',
    dot: 'bg-sky-400 dark:bg-sky-300',
  },
  teal: {
    surface:
      'bg-teal-50/80 hover:bg-teal-50 dark:bg-teal-950/35 dark:hover:bg-teal-900/45',
    badge:
      'bg-teal-100/90 text-teal-900 border-teal-200/80 dark:bg-teal-900/70 dark:text-teal-100 dark:border-teal-700/80',
    border: 'border-teal-200/80 dark:border-teal-700/60',
    accentText: 'text-teal-800 dark:text-teal-300',
    dot: 'bg-teal-400 dark:bg-teal-300',
  },
};
