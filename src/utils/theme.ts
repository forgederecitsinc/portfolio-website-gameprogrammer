import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

const MONOCHROME_CARD: ThemeClasses = {
  surface: 'bg-[#F7F7F5] hover:bg-white',
  badge: 'bg-[#ECEBE9] text-[#0F0F0F] border-[#D4D4D2]',
  border: 'border-[#D4D4D2] hover:border-[#0F0F0F]',
  accentText: 'text-[#0F0F0F]',
  dot: 'bg-[#0F0F0F]',
};

/**
 * Vintage black & white silver-gelatin editorial palette.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  rose: MONOCHROME_CARD,
  violet: MONOCHROME_CARD,
  amber: MONOCHROME_CARD,
  emerald: MONOCHROME_CARD,
  sky: MONOCHROME_CARD,
  teal: MONOCHROME_CARD,
};
