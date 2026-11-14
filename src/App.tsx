import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  Copy,
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
import { GameDevBackdrop } from './components/GameDevBackdrop';
import { ProjectModal } from './components/ProjectModal';
import { Reveal } from './components/Reveal';
import { ScrollParallax, ScrollProgressBar } from './components/ScrollMotion';
import { DualSenseScrollPointer } from './components/DualSenseScrollPointer';
import { DualSensePlayground } from './components/DualSensePlayground';
import { HeroNavMeshCanvas } from './components/HeroNavMeshCanvas';
import { Resn3DShowcase } from './components/Resn3DShowcase';
import { Card3DTilt } from './components/Card3DTilt';
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
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'Roshan Christy — Game Designer, Game Writer & Puzzle Designer | Ludonode Studios',
      professional: 'Professional Work — Roshan Christy | Ludonode Studios',
      school: 'School & Game Jam Projects — Roshan Christy | George Brown Polytechnic',
    };
    document.title = titles[route];
  }, [route]);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    const handleScroll = () => setShowBackToTop(window.scrollY > 420);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const copyEmail = (address: string) => {
    navigator.clipboard?.writeText(address);
    setCopiedEmail(address);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

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

  const visibleProjects = useMemo(() => {
    if (activeFilter !== 'All' || showAllProjects) return filteredProjects;
    return filteredProjects.slice(0, 6);
  }, [activeFilter, showAllProjects, filteredProjects]);

  // FLIP (First-Last-Invert-Play) layout transitions for project filtering
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());

  const captureCardPositions = () => {
    const rects = new Map<string, DOMRect>();
    cardRefs.current.forEach((el, id) => {
      rects.set(id, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
  };

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || prevRectsRef.current.size === 0) {
      prevRectsRef.current.clear();
      return;
    }

    const prevRects = prevRectsRef.current;
    prevRectsRef.current = new Map();

    cardRefs.current.forEach((el, id) => {
      const first = prevRects.get(id);
      const last = el.getBoundingClientRect();
      el.style.transition = 'none';
      if (first) {
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 12px, 0) scale(0.97)';
      }
    });

    requestAnimationFrame(() => {
      cardRefs.current.forEach((el) => {
        el.style.transition =
          'transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease-out';
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        el.style.opacity = '1';
      });
    });
  }, [visibleProjects]);

  const selectedIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  return (
    <div className="relative min-h-screen overflow-x-clip text-[#0F0F0F]">
      <div className="film-grain pointer-events-none fixed inset-0 z-50 opacity-[0.025]" aria-hidden="true" />
      <ScrollProgressBar />
      <DualSenseScrollPointer />
      <GameDevBackdrop />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#B4B4AE] bg-[#CFCFC9]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D4D4D2] bg-[#F7F7F5] text-[#0F0F0F]">
              <Gamepad2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block font-serif text-lg font-semibold tracking-tight text-[#0F0F0F]">
                {PROFILE.name}
              </span>
              <span className="block font-mono text-[10px] font-medium tracking-wider text-[#525252] uppercase">
                Narrative &amp; Game Designer
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => navigateTo('professional')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                route === 'professional'
                  ? 'bg-[#0F0F0F] text-[#F7F7F5]'
                  : 'text-[#525252] hover:bg-[#F7F7F5] hover:text-[#0F0F0F]'
              }`}
            >
              Professional
            </button>
            <button
              type="button"
              onClick={() => navigateTo('school')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                route === 'school'
                  ? 'bg-[#0F0F0F] text-[#F7F7F5]'
                  : 'text-[#525252] hover:bg-[#F7F7F5] hover:text-[#0F0F0F]'
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
            <a
              href={`mailto:${PROFILE.emails[0].address}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-800 active:scale-[0.97]"
            >
              Get in Touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
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
          <div className="border-t border-[#B4B4AE] bg-[#CFCFC9] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Main Page
              </button>
              <button
                type="button"
                onClick={() => navigateTo('professional')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => navigateTo('school')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                School Projects
              </button>
              {route === 'home' &&
                NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
        <section className="relative overflow-hidden py-14 sm:py-20">
          <HeroNavMeshCanvas />
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="animate-fade-up lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#D4D4D2] bg-[#F7F7F5] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-[#525252] uppercase">
                <MapPin className="h-3.5 w-3.5 text-[#0F0F0F]" />
                {PROFILE.location}
              </div>

              <h1 className="mt-5 font-serif text-5xl leading-[1.03] font-semibold tracking-tight text-[#0F0F0F] sm:text-6xl lg:text-[4.25rem]">
                {PROFILE.name}
              </h1>
              <p className="mt-3 text-base font-semibold text-[#262626] sm:text-lg">
                {PROFILE.title}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525252]">
                {PROFILE.subheadline}
              </p>

              <blockquote className="mt-6 rounded-lg border border-[#D4D4D2] bg-[#F7F7F5] px-5 py-4 font-serif text-base italic text-[#262626]">
                “{PROFILE.tagline}”
              </blockquote>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-md bg-[#0070D1] px-6 py-3 text-sm font-semibold text-white transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#005BB5] active:scale-[0.97]"
                >
                  Explore Projects
                  <Gamepad2 className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md border border-[#D4D4D2] bg-[#F7F7F5] px-6 py-3 text-sm font-semibold text-[#0F0F0F] transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#0F0F0F] hover:bg-white active:scale-[0.97]"
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
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#D4D4D2] bg-[#F7F7F5] px-3 py-1.5 font-mono text-[11px] font-medium text-[#404040] transition hover:-translate-y-0.5 hover:border-[#0F0F0F] hover:text-[#0F0F0F]"
                  >
                    {social.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>

            <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: '120ms' }}>
              <ScrollParallax offsetY={-24} scaleFrom={0.97} tiltDeg={3}>
                <div className="space-y-3 overflow-hidden rounded-xl border border-[#D4D4D2] bg-[#F7F7F5] p-4 transition duration-300">
                <Resn3DShowcase />
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-lg border border-[#D4D4D2] bg-white p-3 text-center transition hover:-translate-y-0.5">
                    <Gamepad2 className="mx-auto h-6 w-6 text-[#0F0F0F]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-[#262626]">
                      Shipped Mobile Titles
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#D4D4D2] bg-white p-3 text-center transition hover:-translate-y-0.5">
                    <GraduationCap className="mx-auto h-6 w-6 text-[#0F0F0F]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-[#262626]">
                      GBC Game Design
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#D4D4D2] bg-white p-3 text-center transition hover:-translate-y-0.5">
                    <Sparkles className="mx-auto h-6 w-6 text-[#0F0F0F]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-[#262626]">
                      Ludonode Studios
                    </p>
                  </div>
                </div>
              </div>
              </ScrollParallax>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20 border-t border-[#B4B4AE] py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-rose-300">
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
                const count =
                  filter === 'All'
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === filter).length;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      captureCardPositions();
                      setActiveFilter(filter);
                    }}
                    className={`rounded-md px-4 py-2 font-mono text-[11px] font-semibold tracking-tight transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] ${
                      isActive
                        ? 'bg-[#0F0F0F] text-[#F7F7F5]'
                        : 'border border-[#D4D4D2] bg-[#F7F7F5] text-[#525252] hover:border-[#0F0F0F] hover:text-[#0F0F0F]'
                    }`}
                  >
                    {filter} <span className="ml-1 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ScrollParallax offsetY={30} scaleFrom={0.94} tiltDeg={4.5}>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project) => {
              const theme = PASTEL_THEME[project.theme];
              return (
                <Card3DTilt key={project.id} className="h-full">
                  <article
                    ref={(el) => {
                      if (el) cardRefs.current.set(project.id, el);
                      else cardRefs.current.delete(project.id);
                    }}
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    className={`group flex h-full cursor-pointer flex-col justify-between rounded-xl border ${theme.border} ${theme.surface} p-6 transition focus:outline-none focus:ring-2 focus:ring-[#1A1715]`}
                  >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                        {project.category}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{project.context}</p>
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
                </Card3DTilt>
              );
            })}
            </div>
          </ScrollParallax>

          {activeFilter === 'All' && filteredProjects.length > 6 && (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllProjects((prev) => !prev)}
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {showAllProjects
                  ? 'Show featured (6)'
                  : `Show all ${filteredProjects.length} projects`}
              </button>
            </div>
          )}

          {/* Additional GBC Works Strip */}
          <Reveal className="mt-8">
            <div className="rounded-3xl border border-sky-200/70 bg-sky-50/50 p-6 dark:border-sky-800/60 dark:bg-sky-950/35">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Additional George Brown College Projects
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Screenwriting, Cartography &amp; Programming
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {GBC_ADDITIONAL_WORKS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-sky-200/60 bg-white/80 p-3.5 transition hover:-translate-y-0.5 dark:border-sky-800/50 dark:bg-slate-900/80"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Interactive DualSense Haptics & Audio Lab */}
        <ScrollParallax offsetY={32} scaleFrom={0.93} tiltDeg={5}>
          <DualSensePlayground />
        </ScrollParallax>

        {/* Character Design Section */}
        <section id="characters" className="scroll-mt-20 border-t border-[#B4B4AE] py-14 sm:py-16">
          <Reveal>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-violet-700 uppercase dark:text-violet-300">
                <Users className="h-3.5 w-3.5" />
                Character Design
              </span>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
                Original Character Profiles
              </h2>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
                Five complete character concepts built with personality profiles, narrative
                archetypes, and dramatic motivations.
              </p>
            </div>
          </Reveal>

          <ScrollParallax offsetY={30} scaleFrom={0.94} tiltDeg={4.5}>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.map((char, idx) => {
              const theme = PASTEL_THEME[char.theme];
              return (
                <Reveal key={char.id} delayMs={idx * 60}>
                  <div
                    className={`h-full rounded-3xl border ${theme.border} ${theme.surface} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {char.archetype}
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {char.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {char.summary}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          </ScrollParallax>
        </section>

        {/* Writing & Blog Section */}
        <section id="writing" className="scroll-mt-20 border-t border-slate-200/80 py-14 sm:py-16 dark:border-slate-800/80">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-teal-700 uppercase dark:text-teal-300">
                  <Feather className="h-3.5 w-3.5" />
                  Short Stories &amp; Essays
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
                  Fiction &amp; Game Design Writing
                </h2>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://medium.com/@ludonodestudios"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Medium
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="http://www.wattpad.com/user/roshan_christy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Wattpad
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WRITINGS.map((item, idx) => {
              const theme = PASTEL_THEME[item.theme];
              return (
                <Reveal key={item.id} delayMs={idx * 50}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex h-full flex-col justify-between rounded-3xl border ${theme.border} ${theme.surface} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                        >
                          <BookOpen className="h-3 w-3" />
                          {item.kind}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {item.platform}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {item.summary}
                      </p>
                    </div>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText}`}
                    >
                      Read on {item.platform}
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Business & Resume Section */}
        <section id="resume" className="scroll-mt-20 border-t border-[#B4B4AE] py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Studio Card */}
            <div className="lg:col-span-5">
              <ScrollParallax offsetY={26} offsetX={-12} scaleFrom={0.94} tiltDeg={4} yawDeg={-3}>
              <div className="rounded-3xl border border-[#DCD0C7] bg-[#F7F3EF] p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-600 dark:border-violet-700 dark:bg-slate-900 dark:text-violet-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-violet-700 uppercase dark:text-violet-300">
                      {STUDIO.brand}
                    </span>
                    <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {STUDIO.name}
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {STUDIO.established}
                </p>
                <p className="mt-3 text-sm font-medium italic text-violet-900 dark:text-violet-200">
                  “{STUDIO.motto}”
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {STUDIO.mission}
                </p>

                <div className="mt-5 space-y-2">
                  <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Studio Services
                  </h3>
                  {STUDIO.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-2.5 rounded-xl border border-violet-200/60 bg-white/85 px-3.5 py-2 text-xs font-medium text-slate-700 dark:border-violet-800/50 dark:bg-slate-900/85 dark:text-slate-200"
                    >
                      <Compass className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-6 rounded-3xl border border-sky-200/80 bg-sky-50/60 p-6 dark:border-sky-800/60 dark:bg-sky-950/35">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-600 dark:border-sky-700 dark:bg-slate-900 dark:text-sky-300">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Education
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Academic Credentials &amp; Training
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {EDUCATION.map((edu) => (
                    <div
                      key={`${edu.school}-${edu.degree}`}
                      className="rounded-2xl border border-sky-200/60 bg-white/85 p-3.5 dark:border-sky-800/50 dark:bg-slate-900/85"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {edu.degree}
                        </p>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {edu.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-sky-900 dark:text-sky-300">
                        {edu.school}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {edu.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              </ScrollParallax>

              {/* Languages & Certifications */}
              <div className="mt-6 rounded-3xl border border-emerald-200/80 bg-emerald-50/50 p-6 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                <h3 className="text-xs font-semibold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                  Languages
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <span
                      key={lang.name}
                      className="rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 dark:border-emerald-800/60 dark:bg-slate-900/90 dark:text-slate-200"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {lang.name}
                      </span>{' '}
                      · {lang.proficiency}
                    </span>
                  ))}
                </div>

                <h3 className="mt-5 text-xs font-semibold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                  Licenses &amp; Certifications
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {CERTIFICATIONS.map((cert) => (
                    <li
                      key={cert.title}
                      className="flex items-baseline justify-between gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {cert.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
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
                <Briefcase className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                  Experience &amp; Skills
                </span>
              </div>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
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
                        <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {exp.period}
                        </span>
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
          <div className="rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-amber-50/50 to-violet-50/70 p-8 sm:p-10 dark:border-rose-900/50 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-violet-950/30">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-rose-300">
                  Contact
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  Let&apos;s build a world together
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Available for Narrative Design, Game &amp; Puzzle Design, Screenwriting, and
                  French/English Localization collaborations.
                </p>
              </div>

              <div className="space-y-3">
                {PROFILE.emails.map((email) => (
                  <div
                    key={email.address}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200"
                  >
                    <a
                      href={`mailto:${email.address}`}
                      className="flex min-w-0 items-center gap-2.5 truncate transition hover:text-rose-700 dark:hover:text-rose-300"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span className="truncate">
                        <span className="mr-2 text-xs font-semibold text-slate-400 uppercase">
                          {email.label}
                        </span>
                        {email.address}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyEmail(email.address)}
                      aria-label={`Copy ${email.address}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {copiedEmail === email.address ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                ))}

                <a
                  href={`tel:${PROFILE.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {PROFILE.phone}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Toronto, ON</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/50 py-8 dark:border-slate-800/80 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
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
                className="transition hover:text-slate-900 dark:hover:text-white"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed right-5 bottom-5 z-30 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-md backdrop-blur-xs transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-100 dark:hover:text-slate-900"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrev={
          selectedIndex > 0
            ? () => setSelectedProject(filteredProjects[selectedIndex - 1])
            : undefined
        }
        onNext={
          selectedIndex >= 0 && selectedIndex < filteredProjects.length - 1
            ? () => setSelectedProject(filteredProjects[selectedIndex + 1])
            : undefined
        }
      />
    </div>
  );
}
