import { useEffect } from 'react';
import { ExternalLink, X, CheckCircle2, Smartphone } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

/**
 * Accessible detail modal displaying full project metadata, contributions, and links.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

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
        className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border ${theme.border} bg-[#FAF8F5] p-6 shadow-xl sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-5 right-5 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              <Smartphone className="h-3 w-3" />
              {platform}
            </span>
          ))}
        </div>

        <h3
          id="project-modal-title"
          className="mt-4 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500">{project.context}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.roles.map((role) => (
            <span
              key={role}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80"
            >
              {role}
            </span>
          ))}
        </div>

        <div className={`mt-6 rounded-2xl border ${theme.border} ${theme.surface} p-5`}>
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Overview
          </h4>
          <p className="mt-2 leading-relaxed text-slate-700">{project.overview}</p>
        </div>

        {project.images && project.images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              System Architecture
            </h4>
            <div className="mt-3 space-y-3">
              {project.images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className="w-full rounded-2xl border border-slate-200/80 bg-white object-contain"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Key Contributions
          </h4>
          <ul className="mt-3 space-y-2.5">
            {project.contributions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.accentText}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5">
          {project.badgeImage ? (
            <img
              src={project.badgeImage}
              alt={project.context}
              className="h-9 w-auto object-contain opacity-90"
            />
          ) : (
            <span />
          )}

          {project.link && (
            <a
              href={project.link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
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
