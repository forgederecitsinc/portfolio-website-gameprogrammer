import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

/**
 * PS5 flagship game-themed light-mode palette:
 * Astro Bot Blue, Spider-Man 2 Crimson, Returnal Teal,
 * Ghost of Tsushima Amber, Demon's Souls Indigo, Horizon Emerald.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  sky: {
    surface: 'bg-[#F4F7FB] hover:bg-white',
    badge: 'bg-[#E1ECFA] text-[#004A8F] border-[#B8D2F2]',
    border: 'border-[#C2D4EA] hover:border-[#0070D1]',
    accentText: 'text-[#005BB5]',
    dot: 'bg-[#0070D1]',
  },
  rose: {
    surface: 'bg-[#FBF4F4] hover:bg-white',
    badge: 'bg-[#FBE2E2] text-[#991B1B] border-[#F3BDBD]',
    border: 'border-[#E6C7C7] hover:border-[#DC2626]',
    accentText: 'text-[#B91C1C]',
    dot: 'bg-[#DC2626]',
  },
  teal: {
    surface: 'bg-[#F2F9F8] hover:bg-white',
    badge: 'bg-[#DCF2EF] text-[#115E59] border-[#B0E0D9]',
    border: 'border-[#BBDAD5] hover:border-[#0D9488]',
    accentText: 'text-[#0F766E]',
    dot: 'bg-[#0D9488]',
  },
  amber: {
    surface: 'bg-[#FAF7F0] hover:bg-white',
    badge: 'bg-[#F7E8CC] text-[#92400E] border-[#EBD09E]',
    border: 'border-[#E3D3B6] hover:border-[#D97706]',
    accentText: 'text-[#B45309]',
    dot: 'bg-[#D97706]',
  },
  violet: {
    surface: 'bg-[#F5F5FB] hover:bg-white',
    badge: 'bg-[#E6E6FA] text-[#3730A3] border-[#C7C8F5]',
    border: 'border-[#C9CAE6] hover:border-[#4F46E5]',
    accentText: 'text-[#4338CA]',
    dot: 'bg-[#4F46E5]',
  },
  emerald: {
    surface: 'bg-[#F2F9F5] hover:bg-white',
    badge: 'bg-[#DCF2E5] text-[#065F46] border-[#B0DFC4]',
    border: 'border-[#BDD8C9] hover:border-[#059669]',
    accentText: 'text-[#047857]',
    dot: 'bg-[#059669]',
  },
};
