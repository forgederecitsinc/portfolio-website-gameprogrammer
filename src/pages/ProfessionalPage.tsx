import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { EXPERIENCE, PROJECTS, STUDIO, type ProjectItem } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';
import { GameplayLoopFlowchart } from '../components/GameplayLoopFlowchart';

interface ProfessionalPageProps {
  onNavigate: (route: 'home' | 'professional' | 'school') => void;
  onSelectProject: (project: ProjectItem) => void;
}

/**
 * Dedicated page for commercial/professional game design work and studio experience.
 */
export function ProfessionalPage({ onNavigate, onSelectProject }: ProfessionalPageProps) {
  const professionalProjects = PROJECTS.filter((p) => p.category === 'Professional');

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#16161B] dark:border-slate-700 dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 dark:text-slate-300 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Main Page
        </button>

        <button
          type="button"
          onClick={() => onNavigate('school')}
          className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-[#16161B] px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/70 dark:text-sky-100 dark:hover:bg-sky-900/80"
        >
          View School Projects
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Page Header */}
      <section className="mt-8 rounded-3xl border border-amber-200/70 bg-amber-50/55 p-7 sm:p-10 dark:border-amber-800/60 dark:bg-amber-950/35">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase dark:text-amber-300">
              <Briefcase className="h-3.5 w-3.5" />
              Professional Portfolio
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100 dark:text-slate-100 sm:text-4xl">
              Commercial &amp; Studio Work
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 dark:text-slate-300 sm:text-base">
              Published mobile escape-room titles designed at HFG Entertainments alongside
              narrative design, bilingual localization, and independent work through{' '}
              <span className="font-semibold text-slate-100 dark:text-slate-100 dark:text-slate-100">{STUDIO.brand}</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Shipped Mobile Projects */}
      <section className="mt-10 space-y-8">
        {professionalProjects.map((project) => {
          const theme = PASTEL_THEME[project.theme];
          return (
            <article
              key={project.id}
              className={`rounded-3xl border ${theme.border} ${theme.surface} p-6 sm:p-8`}
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                {/* Gameplay Loop Architecture Panel */}
                <div className="lg:col-span-5">
                  <GameplayLoopFlowchart projectId={project.id} theme={project.theme} />
                </div>

                {/* Details */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                      {project.category}
                    </span>
                    {project.platforms?.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-[#16161B] dark:border-slate-700 dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 dark:text-slate-400 dark:text-slate-400"
                      >
                        <Smartphone className="h-3 w-3" />
                        {platform}
                      </span>
                    ))}
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold text-slate-100 dark:text-slate-100 sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-400 dark:text-slate-400">{project.context}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-lg bg-[#16161B] px-2.5 py-1 text-xs font-medium text-slate-200 dark:text-slate-300 ring-1 ring-slate-200/80 dark:ring-slate-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 leading-relaxed text-slate-200 dark:text-slate-300 dark:text-slate-300">{project.overview}</p>

                  <ul className="mt-4 space-y-2">
                    {project.contributions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200 dark:text-slate-300 dark:text-slate-300"
                      >
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.accentText}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {project.link && (
                      <a
                        href={project.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        {project.link.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-[#16161B] px-4 py-2.5 text-xs font-semibold text-slate-200 dark:text-slate-300 transition hover:bg-white/10"
                    >
                      Quick View Modal
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Experience Summary */}
      <section className="mt-14 border-t border-slate-200/80 dark:border-slate-800/80 pt-10">
        <h2 className="text-2xl font-semibold text-slate-100 dark:text-slate-100 dark:text-slate-100">Work Experience</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {EXPERIENCE.map((exp) => {
            const theme = PASTEL_THEME[exp.theme];
            return (
              <div
                key={`${exp.organization}-${exp.period}`}
                className={`rounded-2xl border ${theme.border} ${theme.surface} p-5`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-100 dark:text-slate-100 dark:text-slate-100">{exp.role}</h3>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 dark:text-slate-400">{exp.period}</span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-slate-300 dark:text-slate-400 dark:text-slate-400">
                  {exp.organization} · {exp.location}
                </p>
                <p className="mt-2 text-sm text-slate-200 dark:text-slate-300 dark:text-slate-300">{exp.highlights}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
