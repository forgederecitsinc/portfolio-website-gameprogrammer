import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

/**
 * Dual Light & Dark (Ludonode Studios Obsidian + Neon) palette:
 * Light mode uses crisp white/tinted cards with dark accessible text & borders.
 * Dark mode uses #121216 obsidian cards with Gold (#F6CF3B), Magenta (#EC1D7B),
 * Mint (#2EF2A8), Orange (#FF8A3D), and Sky (#38BDF8) accents.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  sky: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-[#38BDF8]/15 dark:text-[#7DD3FC] dark:border-[#38BDF8]/35',
    border: 'border-slate-200/90 hover:border-sky-400 dark:border-white/10 dark:hover:border-[#38BDF8]/70',
    accentText: 'text-sky-700 dark:text-[#38BDF8]',
    dot: 'bg-sky-600 dark:bg-[#38BDF8]',
  },
  rose: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-[#EC1D7B]/15 dark:text-[#F472B6] dark:border-[#EC1D7B]/40',
    border: 'border-slate-200/90 hover:border-rose-400 dark:border-white/10 dark:hover:border-[#EC1D7B]/75',
    accentText: 'text-rose-700 dark:text-[#EC1D7B]',
    dot: 'bg-rose-600 dark:bg-[#EC1D7B]',
  },
  teal: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-teal-50 text-teal-900 border-teal-200 dark:bg-[#2EF2A8]/15 dark:text-[#6EE7B7] dark:border-[#2EF2A8]/35',
    border: 'border-slate-200/90 hover:border-teal-400 dark:border-white/10 dark:hover:border-[#2EF2A8]/70',
    accentText: 'text-teal-700 dark:text-[#2EF2A8]',
    dot: 'bg-teal-600 dark:bg-[#2EF2A8]',
  },
  amber: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-[#F6CF3B]/15 dark:text-[#FDE047] dark:border-[#F6CF3B]/40',
    border: 'border-slate-200/90 hover:border-amber-400 dark:border-white/10 dark:hover:border-[#F6CF3B]/75',
    accentText: 'text-amber-800 dark:text-[#F6CF3B]',
    dot: 'bg-amber-600 dark:bg-[#F6CF3B]',
  },
  violet: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-orange-50 text-orange-900 border-orange-200 dark:bg-[#FF8A3D]/15 dark:text-[#FDBA74] dark:border-[#FF8A3D]/40',
    border: 'border-slate-200/90 hover:border-orange-400 dark:border-white/10 dark:hover:border-[#FF8A3D]/75',
    accentText: 'text-orange-700 dark:text-[#FF8A3D]',
    dot: 'bg-orange-600 dark:bg-[#FF8A3D]',
  },
  emerald: {
    surface: 'bg-white/95 hover:bg-white shadow-xs dark:bg-[#121216]/95 dark:hover:bg-[#17171D] dark:shadow-none',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-[#2EF2A8]/15 dark:text-[#6EE7B7] dark:border-[#2EF2A8]/35',
    border: 'border-slate-200/90 hover:border-emerald-400 dark:border-white/10 dark:hover:border-[#2EF2A8]/70',
    accentText: 'text-emerald-700 dark:text-[#2EF2A8]',
    dot: 'bg-emerald-600 dark:bg-[#2EF2A8]',
  },
};
