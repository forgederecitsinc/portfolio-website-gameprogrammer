import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ShieldAlert, Sparkles, Target, X, Zap } from 'lucide-react';
import type { CharacterProfile } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';

interface CharacterModalProps {
  character: CharacterProfile | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Accessible detail modal displaying full character profile, personality traits,
 * dramatic motivation, fatal flaw, signature abilities, and quote.
 */
export function CharacterModal({ character, onClose, onPrev, onNext }: CharacterModalProps) {
  useEffect(() => {
    if (!character) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [character, onClose, onPrev, onNext]);

  if (!character) return null;

  const theme = PASTEL_THEME[character.theme];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-modal-title"
    >
      <div
        className={`animate-modal-in relative max-h-[90vh] w-full max-w-2xl overscroll-contain overflow-y-auto rounded-2xl border ${theme.border} bg-white p-6 text-slate-900 shadow-2xl dark:bg-[#111115] dark:text-slate-100 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close character profile"
          className="absolute top-5 right-5 rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badge}`}
          >
            <Sparkles className="h-3 w-3" />
            {character.archetype}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
            <MapPin className="h-3 w-3" />
            {character.origin}
          </span>
        </div>

        <h3
          id="character-modal-title"
          className="mt-4 font-serif text-2xl font-semibold text-amber-800 dark:text-[#F6CF3B] sm:text-3xl"
        >
          {character.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {character.summary}
        </p>

        <blockquote className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-serif text-sm italic text-slate-700 dark:border-white/10 dark:bg-[#16161B] dark:text-slate-200">
          “{character.quote}”
        </blockquote>

        <div className="mt-5">
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Personality Traits
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {character.personality.map((trait) => (
              <span
                key={trait}
                className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#16161B]">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-[#2EF2A8]">
              <Target className="h-3.5 w-3.5" />
              Dramatic Motivation
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {character.motivation}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#16161B]">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-[#EC1D7B]">
              <ShieldAlert className="h-3.5 w-3.5" />
              Core Flaw
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {character.flaw}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            <Zap className={`h-3.5 w-3.5 ${theme.accentText}`} />
            Signature Abilities &amp; Skills
          </h4>
          <ul className="mt-2.5 space-y-2">
            {character.abilities.map((ability) => (
              <li
                key={ability}
                className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200"
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
                <span>{ability}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/15"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/15"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-[#F6CF3B] dark:text-slate-950 dark:hover:bg-[#FDE047]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
