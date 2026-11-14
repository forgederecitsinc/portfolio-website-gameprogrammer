import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

/**
 * Ludonode Studios Obsidian & Neon-Accent palette:
 * Gold (#F6CF3B), Magenta (#EC1D7B), Mint (#2EF2A8),
 * Orange (#FF8A3D), Sky (#38BDF8), Violet (#A78BFA) on #121216 obsidian cards.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  sky: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#38BDF8]/15 text-[#7DD3FC] border-[#38BDF8]/35',
    border: 'border-white/10 hover:border-[#38BDF8]/70',
    accentText: 'text-[#38BDF8]',
    dot: 'bg-[#38BDF8]',
  },
  rose: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#EC1D7B]/15 text-[#F472B6] border-[#EC1D7B]/40',
    border: 'border-white/10 hover:border-[#EC1D7B]/75',
    accentText: 'text-[#EC1D7B]',
    dot: 'bg-[#EC1D7B]',
  },
  teal: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#2EF2A8]/15 text-[#6EE7B7] border-[#2EF2A8]/35',
    border: 'border-white/10 hover:border-[#2EF2A8]/70',
    accentText: 'text-[#2EF2A8]',
    dot: 'bg-[#2EF2A8]',
  },
  amber: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#F6CF3B]/15 text-[#FDE047] border-[#F6CF3B]/40',
    border: 'border-white/10 hover:border-[#F6CF3B]/75',
    accentText: 'text-[#F6CF3B]',
    dot: 'bg-[#F6CF3B]',
  },
  violet: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#FF8A3D]/15 text-[#FDBA74] border-[#FF8A3D]/40',
    border: 'border-white/10 hover:border-[#FF8A3D]/75',
    accentText: 'text-[#FF8A3D]',
    dot: 'bg-[#FF8A3D]',
  },
  emerald: {
    surface: 'bg-[#121216]/95 hover:bg-[#17171D]',
    badge: 'bg-[#2EF2A8]/15 text-[#6EE7B7] border-[#2EF2A8]/35',
    border: 'border-white/10 hover:border-[#2EF2A8]/70',
    accentText: 'text-[#2EF2A8]',
    dot: 'bg-[#2EF2A8]',
  },
};
