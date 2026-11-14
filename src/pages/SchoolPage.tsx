import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { GBC_ADDITIONAL_WORKS, PROJECTS, type ProjectItem } from '../data/portfolio';
import { PASTEL_THEME } from '../utils/theme';
import { GameplayLoopFlowchart } from '../components/GameplayLoopFlowchart';

interface SchoolPageProps {
  onNavigate: (route: 'home' | 'professional' | 'school') => void;
  onSelectProject: (project: ProjectItem) => void;
}

/**
 * Dedicated page for George Brown College game design, game jam, and academic projects.
 */
export function SchoolPage({ onNavigate, onSelectProject }: SchoolPageProps) {
  const schoolProjects = PROJECTS.filter((p) => p.category === 'GBC School');

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Main Page
        </button>

        <button
          type="button"
          onClick={() => onNavigate('professional')}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-100 dark:hover:bg-amber-900/80"
        >
          View Professional Projects
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Page Header */}
      <section className="mt-8 rounded-3xl border border-sky-200/80 bg-sky-50/75 p-7 sm:p-10 dark:border-sky-800/60 dark:bg-sky-950/35">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-sky-800 uppercase dark:text-sky-300">
              <GraduationCap className="h-3.5 w-3.5" />
              George Brown College · Toronto
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              School &amp; Game Jam Projects
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
              Academic capstones, 48-hour game jams, screenwriting, cartography, and Unreal
              programming projects completed during the Game Design Post-Graduate Program at George
              Brown College.
            </p>
          </div>
        </div>
      </section>

      {/* Featured GBC Projects */}
      <section className="mt-10 space-y-8">
        {schoolProjects.map((project) => {
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
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                    {project.category}
                  </span>

                  <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{project.context}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 ring-1 ring-slate-200/80 dark:bg-[#16161B] dark:text-slate-300 dark:ring-slate-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">{project.overview}</p>

                  <ul className="mt-4 space-y-2">
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

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#16161B] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      {project.mechanics ? 'View Full Mechanics & Modal' : 'Quick View Modal'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Additional GBC Coursework */}
      <section className="mt-14 border-t border-slate-200/80 dark:border-slate-800/80 pt-10">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Additional Coursework &amp; Prototypes
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GBC_ADDITIONAL_WORKS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-sky-200/80 bg-white p-5 shadow-xs dark:border-sky-800/60 dark:bg-[#121216] dark:shadow-none"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
