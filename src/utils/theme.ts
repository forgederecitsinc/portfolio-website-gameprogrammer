import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

/**
 * Pantone 2025 Mocha Mousse (#A47864) minimal editorial palette.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  rose: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#EFE3DA] text-[#5B3A2E] border-[#DFCBBF]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#8E5B49]',
    dot: 'bg-[#A47864]',
  },
  violet: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#ECE4DF] text-[#473832] border-[#D8CAC2]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#6E5348]',
    dot: 'bg-[#8B6B5C]',
  },
  amber: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#F1E7DC] text-[#5F452E] border-[#E0CFC0]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#8F6544]',
    dot: 'bg-[#B58963]',
  },
  emerald: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#E6EAE3] text-[#354434] border-[#CFD6CB]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#4F634D]',
    dot: 'bg-[#748A71]',
  },
  sky: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#E6EAEB] text-[#354045] border-[#CED6D8]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#4E6169]',
    dot: 'bg-[#738991]',
  },
  teal: {
    surface: 'bg-[#F7F3EF] hover:bg-[#FCF9F6]',
    badge: 'bg-[#E5EAE7] text-[#33443F] border-[#CDD6D1]',
    border: 'border-[#DCD0C7]',
    accentText: 'text-[#4A625B]',
    dot: 'bg-[#6D8980]',
  },
};
