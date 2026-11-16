import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  GitBranch,
  Smartphone,
  X,
} from 'lucide-react';
import { CODE_HIGHLIGHTS } from '../data/codeHighlights';
import type { ProjectItem } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';
import { GameplayLoopFlowchart } from './GameplayLoopFlowchart';
import { GameDemo } from './demos/GameDemo';
import { DialoguePlayer } from './features/DialoguePlayer';

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
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'code'>('flowchart');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    setIsDemoPlaying(false);
    setActiveTab('flowchart');
    setCopiedFile(null);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!isDemoPlaying) {
        if (e.key === 'ArrowLeft' && onPrev) onPrev();
        if (e.key === 'ArrowRight' && onNext) onNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose, onPrev, onNext, isDemoPlaying]);

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
        className={`animate-modal-in relative max-h-[90vh] w-full max-w-3xl overscroll-contain overflow-y-auto rounded-2xl border ${theme.border} bg-white p-6 text-slate-900 shadow-2xl dark:bg-[#111115] dark:text-slate-100 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-5 right-5 rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
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
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
            >
              <Smartphone className="h-3 w-3" />
              {platform}
            </span>
          ))}
        </div>

        <h3
          id="project-modal-title"
          className="mt-4 font-serif text-2xl font-semibold text-amber-800 dark:text-[#F6CF3B] sm:text-3xl"
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          {project.context}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.roles.map((role) => (
            <span
              key={role}
              className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              System Architecture &amp; Gameplay Loop
            </h4>
            <div className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/15 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('flowchart')}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  activeTab === 'flowchart'
                    ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <GitBranch className="h-3 w-3" />
                Flowchart
              </button>
              {CODE_HIGHLIGHTS[project.id] && (
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    activeTab === 'code'
                      ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <Code2 className="h-3 w-3" />
                  Code Highlights
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            {activeTab === 'flowchart' && (
              <GameplayLoopFlowchart projectId={project.id} theme={project.theme} />
            )}
            {activeTab === 'code' && CODE_HIGHLIGHTS[project.id] && (
              <div className="space-y-3">
                {CODE_HIGHLIGHTS[project.id].map((snippet) => (
                  <div
                    key={snippet.filename}
                    className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-slate-100"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3.5 py-2">
                      <div>
                        <span className="font-mono text-xs font-semibold text-sky-300">
                          {snippet.filename}
                        </span>
                        <span className="ml-2 text-[11px] text-slate-400">
                          {snippet.summary}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(snippet.code);
                          setCopiedFile(snippet.filename);
                          setTimeout(() => setCopiedFile(null), 1500);
                        }}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-700"
                      >
                        {copiedFile === snippet.filename ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copiedFile === snippet.filename ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-3.5 font-mono text-[11px] leading-relaxed text-emerald-200">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialoguePlayer key={`dialogue-${project.id}`} projectId={project.id} />

        <GameDemo
          key={project.id}
          projectId={project.id}
          theme={project.theme}
          onPlayingChange={setIsDemoPlaying}
        />

        <div className="mt-6">
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Key Contributions
          </h4>
          <ul className="mt-3 space-y-2.5">
            {project.contributions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200"
              >
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.accentText}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {project.mechanics && project.mechanics.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Detailed Mechanics &amp; Systems Breakdown
            </h4>
            <div className="grid gap-3">
              {project.mechanics.map((section) => (
                <div
                  key={section.heading}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#16161B]"
                >
                  <h5 className="text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-[#F6CF3B]">
                    {section.heading}
                  </h5>
                  <ul className="mt-2 space-y-1.5">
                    {section.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                      >
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-white/10">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous project"
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
                aria-label="Next project"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/15"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {project.link && (
            <a
              href={project.link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F6CF3B] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-[#FDE047]"
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
