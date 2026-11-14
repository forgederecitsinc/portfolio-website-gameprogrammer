import type { PastelTheme } from '../data/portfolio';

export interface ThemeClasses {
  surface: string;
  badge: string;
  border: string;
  accentText: string;
  dot: string;
}

const ARCHIVAL_CARD: ThemeClasses = {
  surface: 'bg-[#F5F1EA] hover:bg-[#FAF7F2]',
  badge: 'bg-[#EBE5DB] text-[#2A2521] border-[#C8BEB2]',
  border: 'border-[#C8BEB2] hover:border-[#1A1715]/60',
  accentText: 'text-[#1A1715]',
  dot: 'bg-[#7A6A5C]',
};

/**
 * Vintage archival monochrome & sepia palette — crisp, minimal, low-chroma.
 */
export const PASTEL_THEME: Record<PastelTheme, ThemeClasses> = {
  rose: ARCHIVAL_CARD,
  violet: ARCHIVAL_CARD,
  amber: ARCHIVAL_CARD,
  emerald: ARCHIVAL_CARD,
  sky: ARCHIVAL_CARD,
  teal: ARCHIVAL_CARD,
};
