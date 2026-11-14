import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Compass,
  Feather,
  Gamepad2,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  CERTIFICATIONS,
  CHARACTERS,
  EDUCATION,
  EXPERIENCE,
  GBC_ADDITIONAL_WORKS,
  LANGUAGES,
  PROFILE,
  PROJECTS,
  SKILLS,
  STUDIO,
  WRITINGS,
  type ProjectCategory,
  type ProjectItem,
} from './data/portfolio';
import { PASTEL_THEME } from './utils/theme';
import { ProjectModal } from './components/ProjectModal';
import { ThemeToggle } from './components/ThemeToggle';
import { ProfessionalPage } from './pages/ProfessionalPage';
import { SchoolPage } from './pages/SchoolPage';

type PageRoute = 'home' | 'professional' | 'school';

function getRouteFromHash(): PageRoute {
  const hash = window.location.hash;
  if (hash === '#/professional') return 'professional';
  if (hash === '#/school') return 'school';
  return 'home';
}

const PROJECT_FILTERS: Array<'All' | ProjectCategory> = [
  'All',
  'Professional',
  'GBC School',
  'Game Design',
  'Narrative & Worldbuilding',
];

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Characters', href: '#characters' },
  { label: 'Writing', href: '#writing' },
  { label: 'Studio & Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => getRouteFromHash());
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (nextRoute: PageRoute) => {
    const hashMap: Record<PageRoute, string> = {
      home: '#/',
      professional: '#/professional',
      school: '#/school',
    };
    window.location.hash = hashMap[nextRoute];
    setRoute(nextRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Subtle decorative pastel wash */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-violet-50/70 via-rose-50/40 to-transparent dark:from-violet-950/30 dark:via-rose-950/15" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#FAF8F5]/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="flex items-center gap-3"
          >
            <img
              src="./images/ludonode-logo.jpg"
              alt="Ludonode Studios — Roshan's Forge de Récits Inc."
              className="h-9 w-9 rounded-xl border border-slate-200/80 object-cover shadow-2xs dark:border-slate-700"
            />
            <div>
              <span className="block font-serif text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 dark:text-slate-100">
                {PROFILE.name}
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 dark:text-slate-400">
                Narrative &amp; Game Designer
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => navigateTo('professional')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                route === 'professional'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              Professional
            </button>
            <button
              type="button"
              onClick={() => navigateTo('school')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                route === 'school'
                  ? 'bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              School Projects
            </button>
            {route === 'home' ? (
              NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {item.label}
                </a>
              ))
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                Main Page
              </button>
            )}
            <ThemeToggle />
            <a
              href={`mailto:${PROFILE.emails[0].address}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:text-slate-100 dark:hover:bg-white"
            >
              Get in Touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200/70 bg-[#FAF8F5] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Main Page
              </button>
              <button
                type="button"
                onClick={() => navigateTo('professional')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => navigateTo('school')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                School Projects
              </button>
              {route === 'home' &&
                NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </div>
        )}
      </header>

      {route === 'professional' ? (
        <ProfessionalPage onNavigate={navigateTo} onSelectProject={setSelectedProject} />
      ) : route === 'school' ? (
        <SchoolPage onNavigate={navigateTo} onSelectProject={setSelectedProject} />
      ) : (
        <main id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1.5 text-xs font-medium text-violet-900">
                <MapPin className="h-3.5 w-3.5 text-violet-600" />
                {PROFILE.location}
              </div>

              <h1 className="mt-5 font-serif text-4xl leading-tight font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-[3.25rem]">
                {PROFILE.name}
              </h1>
              <p className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-300 sm:text-lg">
                {PROFILE.title}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-400">
                {PROFILE.subheadline}
              </p>

              <blockquote className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50/60 px-5 py-4 text-sm italic text-slate-700 dark:text-slate-300 dark:text-slate-300">
                “{PROFILE.tagline}”
              </blockquote>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore Projects
                  <Gamepad2 className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Contact &amp; Socials
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {PROFILE.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    {social.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-3 text-center">
                    <img
                      src="./images/hfg-badge.png"
                      alt="HFG Entertainments"
                      className="mx-auto h-8 w-auto object-contain"
                    />
                    <p className="mt-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">
                      Shipped Mobile Titles
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-200/70 bg-sky-50/70 p-3 text-center">
                    <img
                      src="./images/gbc-badge.png"
                      alt="George Brown College"
                      className="mx-auto h-8 w-auto object-contain"
                    />
                    <p className="mt-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">
                      GBC Game Design
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-200/70 bg-violet-50/70 p-3 text-center">
                    <img
                      src="./images/ludonode-logo.jpg"
                      alt="Ludonode Studios — Roshan's Forge de Récits Inc."
                      className="mx-auto h-8 w-8 rounded-lg object-cover"
                    />
                    <p className="mt-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">
                      Ludonode Studios
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20 border-t border-slate-200/80 dark:border-slate-800/80 py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-700 uppercase">
                <Layers className="h-3.5 w-3.5" />
                Selected Works
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
                Games, Levels &amp; Narrative Worlds
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                Commercial mobile escape rooms, George Brown College game jams and capstones,
                original puzzle prototypes, and lore bibles. Click any card for full details.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROJECT_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const theme = PASTEL_THEME[project.theme];
              return (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`group flex cursor-pointer flex-col justify-between rounded-3xl border ${theme.border} ${theme.surface} p-6 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                        {project.category}
                      </span>
                      {project.badgeImage && (
                        <img
                          src={project.badgeImage}
                          alt={project.context}
                          className="h-6 w-auto object-contain opacity-85"
                        />
                      )}
                    </div>

                    <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">{project.context}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 dark:text-slate-300">
                      {project.overview}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-md bg-white/85 dark:bg-slate-900/85 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-200/70 dark:ring-slate-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText}`}
                    >
                      View case details
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Additional GBC Works Strip */}
          <div className="mt-8 rounded-3xl border border-sky-200/70 bg-sky-50/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-sky-700" />
                <h3 className="font-serif text-lg font-semibold text-slate-900">
                  Additional George Brown College Projects
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Screenwriting, Cartography &amp; Programming
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {GBC_ADDITIONAL_WORKS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-sky-200/60 bg-white/80 dark:bg-slate-900/80 p-3.5"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 dark:text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Character Design Section */}
        <section id="characters" className="scroll-mt-20 border-t border-slate-200/80 dark:border-slate-800/80 py-14 sm:py-16">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-violet-700 uppercase">
              <Users className="h-3.5 w-3.5" />
              Character Design
            </span>
            <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Original Character Profiles
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Five complete character concepts built with personality profiles, narrative
              archetypes, and dramatic motivations.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.map((char) => {
              const theme = PASTEL_THEME[char.theme];
              return (
                <div
                  key={char.id}
                  className={`rounded-3xl border ${theme.border} ${theme.surface} p-6 transition`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {char.archetype}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900">
                    {char.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 dark:text-slate-300">{char.summary}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Writing & Blog Section */}
        <section id="writing" className="scroll-mt-20 border-t border-slate-200/80 dark:border-slate-800/80 py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-teal-700 uppercase">
                <Feather className="h-3.5 w-3.5" />
                Short Stories &amp; Essays
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
                Fiction &amp; Game Design Writing
              </h2>
            </div>
            <div className="flex gap-2">
              <a
                href="https://medium.com/@ludonodestudios"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50"
              >
                Medium
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="http://www.wattpad.com/user/roshan_christy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50"
              >
                Wattpad
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WRITINGS.map((item) => {
              const theme = PASTEL_THEME[item.theme];
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex flex-col justify-between rounded-3xl border ${theme.border} ${theme.surface} p-6 transition hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                      >
                        <BookOpen className="h-3 w-3" />
                        {item.kind}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {item.platform}
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 dark:text-slate-300">{item.summary}</p>
                  </div>
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText}`}
                  >
                    Read on {item.platform}
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Business & Resume Section */}
        <section id="resume" className="scroll-mt-20 border-t border-slate-200/80 dark:border-slate-800/80 py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Studio Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-violet-200/80 bg-violet-50/60 p-7">
                <div className="flex items-center gap-4">
                  <img
                    src={STUDIO.emblem}
                    alt={`${STUDIO.brand} — ${STUDIO.name}`}
                    className="h-14 w-14 rounded-2xl border border-violet-200 object-cover"
                  />
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-violet-700 uppercase">
                      {STUDIO.brand}
                    </span>
                    <h2 className="font-serif text-2xl font-semibold text-slate-900">
                      {STUDIO.name}
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-xs font-medium text-slate-500">{STUDIO.established}</p>
                <p className="mt-3 text-sm font-medium italic text-violet-900">
                  “{STUDIO.motto}”
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 dark:text-slate-300">{STUDIO.mission}</p>

                <div className="mt-5 space-y-2">
                  <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Studio Services
                  </h3>
                  {STUDIO.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-2.5 rounded-xl border border-violet-200/60 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300"
                    >
                      <Compass className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-6 rounded-3xl border border-sky-200/80 bg-sky-50/60 p-6">
                <div className="flex items-center gap-3">
                  <img
                    src="./images/gbc-badge.png"
                    alt="George Brown Polytechnic"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      Education
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">
                      Academic Credentials &amp; Training
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {EDUCATION.map((edu) => (
                    <div
                      key={`${edu.school}-${edu.degree}`}
                      className="rounded-2xl border border-sky-200/60 bg-white/85 dark:bg-slate-900/85 p-3.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-900">{edu.degree}</p>
                        <span className="text-[11px] font-medium text-slate-500">
                          {edu.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-sky-900">{edu.school}</p>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 dark:text-slate-400">{edu.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Certifications */}
              <div className="mt-6 rounded-3xl border border-emerald-200/80 bg-emerald-50/50 p-6">
                <h3 className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
                  Languages
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <span
                      key={lang.name}
                      className="rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300"
                    >
                      <span className="font-semibold text-slate-900">{lang.name}</span> ·{' '}
                      {lang.proficiency}
                    </span>
                  ))}
                </div>

                <h3 className="mt-5 text-xs font-semibold tracking-wider text-emerald-800 uppercase">
                  Licenses &amp; Certifications
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {CERTIFICATIONS.map((cert) => (
                    <li
                      key={cert.title}
                      className="flex items-baseline justify-between gap-2 text-xs text-slate-700 dark:text-slate-300 dark:text-slate-300"
                    >
                      <span className="font-medium text-slate-800">{cert.title}</span>
                      <span className="shrink-0 text-[11px] text-slate-500">
                        {cert.issuer}
                        {cert.date ? ` · ${cert.date}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-700" />
                <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                  Experience &amp; Skills
                </span>
              </div>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
                Career Timeline
              </h2>

              <div className="mt-6 space-y-3.5">
                {EXPERIENCE.map((exp) => {
                  const theme = PASTEL_THEME[exp.theme];
                  return (
                    <div
                      key={`${exp.organization}-${exp.period}`}
                      className={`rounded-2xl border ${theme.border} ${theme.surface} p-5`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-lg font-semibold text-slate-900">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">{exp.period}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-400">
                        {exp.organization} · {exp.location}
                      </p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 dark:text-slate-300">{exp.highlights}</p>
                    </div>
                  );
                })}
              </div>

              {/* Skills */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {SKILLS.map((group) => {
                  const theme = PASTEL_THEME[group.theme];
                  return (
                    <div
                      key={group.group}
                      className={`rounded-2xl border ${theme.border} bg-white/80 dark:bg-slate-900/80 p-4`}
                    >
                      <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        {group.group}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${theme.badge}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20 border-t border-slate-200/80 dark:border-slate-800/80 py-14 sm:py-16">
          <div className="rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-amber-50/50 to-violet-50/70 p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">
                  Contact
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
                  Let&apos;s build a world together
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 dark:text-slate-300">
                  Available for Narrative Design, Game &amp; Puzzle Design, Screenwriting, and
                  French/English Localization collaborations.
                </p>
              </div>

              <div className="space-y-3">
                {PROFILE.emails.map((email) => (
                  <a
                    key={email.address}
                    href={`mailto:${email.address}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300"
                  >
                    <span className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-rose-600" />
                      <span>
                        <span className="mr-2 text-xs font-semibold text-slate-400 uppercase">
                          {email.label}
                        </span>
                        {email.address}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </a>
                ))}

                <a
                  href={`tel:${PROFILE.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    {PROFILE.phone}
                  </span>
                  <span className="text-xs text-slate-500">Toronto, ON</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} · {STUDIO.name}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {PROFILE.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-slate-900"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
