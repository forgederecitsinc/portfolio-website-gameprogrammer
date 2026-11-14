import { useEffect } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Smartphone,
  X,
} from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';
import { GameplayLoopFlowchart } from './GameplayLoopFlowchart';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Accessible detail modal displaying full project metadata, contributions, and links.
 */
export function ProjectModal({ project, onClose, onPrev, onNext }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose, onPrev, onNext]);

  if (!project) return null;

  const theme = PASTEL_THEME[project.theme];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className={`animate-modal-in relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border ${theme.border} bg-[#FAF8F5] p-6 shadow-2xl sm:p-8 dark:bg-slate-900`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-5 right-5 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${theme.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
            {project.category}
          </span>
          {project.platforms?.map((platform) => (
            <span
              key={platform}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Smartphone className="h-3 w-3" />
              {platform}
            </span>
          ))}
        </div>

        <h3
          id="project-modal-title"
          className="mt-4 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {project.context}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.roles.map((role) => (
            <span
              key={role}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
            >
              {role}
            </span>
          ))}
        </div>

        <div className={`mt-6 rounded-2xl border ${theme.border} ${theme.surface} p-5`}>
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Overview
          </h4>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-200">
            {project.overview}
          </p>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            System Architecture &amp; Gameplay Loop
          </h4>
          <div className="mt-3">
            <GameplayLoopFlowchart projectId={project.id} theme={project.theme} />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Key Contributions
          </h4>
          <ul className="mt-3 space-y-2.5">
            {project.contributions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.accentText}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous project"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Next project"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
            {project.badgeImage && (
              <img
                src={project.badgeImage}
                alt={project.context}
                className="ml-2 h-8 w-auto object-contain opacity-90"
              />
            )}
          </div>

          {project.link && (
            <a
              href={project.link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {project.link.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
