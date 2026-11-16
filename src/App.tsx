import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  Moon,
  Phone,
  PlayCircle,
  Sparkles,
  Sun,
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
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_VIDEOS,
  type ProjectCategory,
  type ProjectItem,
} from './data/portfolio';
import { PASTEL_THEME } from './utils/theme';
import { GameDevBackdrop } from './components/GameDevBackdrop';
import { ProjectModal } from './components/ProjectModal';
import { Reveal } from './components/Reveal';
import { ScrollParallax, ScrollProgressBar, ScrollScrub3D } from './components/ScrollMotion';
import { DualSenseScrollPointer } from './components/DualSenseScrollPointer';
import { DualSensePlayground } from './components/DualSensePlayground';
import { HeroNavMeshCanvas } from './components/HeroNavMeshCanvas';
import { Resn3DShowcase } from './components/Resn3DShowcase';
import { Card3DTilt } from './components/Card3DTilt';
import { ProfessionalPage } from './pages/ProfessionalPage';
import { SchoolPage } from './pages/SchoolPage';
import { AudioAtmosphereDock } from './components/features/AudioAtmosphereDock';
import { DialoguePlayer } from './components/features/DialoguePlayer';
import { useGamepadNav } from './hooks/useGamepadNav';
import { useKonamiCode } from './hooks/useKonamiCode';
import { TOUR_STOPS, useRecruiterTour } from './hooks/useRecruiterTour';
import { useTheme } from './hooks/useTheme';

const TECH_TAGS = [
  'All Tech',
  'Unreal 5.8 / C++',
  'Unity 6 / C#',
  'AI / StateTree',
  'Networking',
  'Narrative / Yarn',
  'Puzzle Design',
] as const;
type TechTag = (typeof TECH_TAGS)[number];

const RECRUITER_FLAGSHIP_IDS = new Set(['live-wire', 'trap-rooms', 'grim-of-legacy']);

function projectMatchesTech(p: ProjectItem, tech: TechTag): boolean {
  if (tech === 'All Tech') return true;
  const hay = `${p.context} ${p.overview} ${p.contributions.join(' ')} ${p.roles.join(' ')}`.toLowerCase();
  if (tech === 'Unreal 5.8 / C++') return hay.includes('unreal') || hay.includes('c++');
  if (tech === 'Unity 6 / C#') return hay.includes('unity') || hay.includes('c#');
  if (tech === 'AI / StateTree') return hay.includes('statetree') || hay.includes('navmesh') || hay.includes('ai');
  if (tech === 'Networking') return hay.includes('multiplayer') || hay.includes('server') || hay.includes('tcp');
  if (tech === 'Narrative / Yarn') return hay.includes('narrative') || hay.includes('yarn') || hay.includes('story');
  if (tech === 'Puzzle Design') return hay.includes('puzzle') || hay.includes('escape');
  return true;
}

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
  { label: 'Videos', href: '#videos' },
  { label: 'Articles', href: '#articles' },
  { label: 'Characters', href: '#characters' },
  { label: 'Writing', href: '#writing' },
  { label: 'Studio & Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => getRouteFromHash());
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectCategory>('All');
  const [activeTech, setActiveTech] = useState<TechTag>('All Tech');
  const [recruiterTour, setRecruiterTour] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [dialogueSampleId, setDialogueSampleId] = useState<'carpe-dino' | 'red-tide'>('carpe-dino');
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
    let list = PROJECTS;
    if (recruiterTour) {
      return list.filter((p) => RECRUITER_FLAGSHIP_IDS.has(p.id));
    }
    if (activeFilter !== 'All') {
      list = list.filter((p) => p.category === activeFilter);
    }
    if (activeTech !== 'All Tech') {
      list = list.filter((p) => projectMatchesTech(p, activeTech));
    }
    return list;
  }, [activeFilter, activeTech, recruiterTour]);

  const visibleProjects = useMemo(() => {
    if (recruiterTour || activeFilter !== 'All' || activeTech !== 'All Tech' || showAllProjects) {
      return filteredProjects;
    }
    return filteredProjects.slice(0, 6);
  }, [recruiterTour, activeFilter, activeTech, showAllProjects, filteredProjects]);

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

  const { isDark, toggleTheme } = useTheme();
  const { crtMode, setCrtMode } = useKonamiCode();

  // Dynamic SEO document title for routes and opened project modals
  useEffect(() => {
    if (selectedProject) {
      document.title = `${selectedProject.title} — Roshan Christy | Game Programmer & Designer Toronto`;
    } else if (route === 'professional') {
      document.title = 'Professional Work — Roshan Christy | Game Programmer & Designer Toronto';
    } else if (route === 'school') {
      document.title = 'GBC Game Programming & Design Projects — Roshan Christy | Toronto';
    } else {
      document.title =
        'Roshan Christy — Game Programmer & Game Designer in Toronto | UE5 C++ & Unity';
    }
  }, [selectedProject, route]);
  const stopTour = useCallback(() => setRecruiterTour(false), []);
  const { secondsLeft, stopIndex, currentStop, progressPct } = useRecruiterTour(
    recruiterTour,
    stopTour
  );

  const toggleTour = () => {
    if (!recruiterTour) {
      if (route !== 'home') navigateTo('home');
      setSelectedProject(null);
      setMobileMenuOpen(false);
    }
    captureCardPositions();
    setRecruiterTour((prev) => !prev);
  };
  const { connectedName, focusedIndex } = useGamepadNav({
    itemCount: visibleProjects.length,
    isModalOpen: Boolean(selectedProject),
    onOpenIndex: (idx) => {
      const target = visibleProjects[idx];
      if (target) setSelectedProject(target);
    },
    onCloseModal: () => setSelectedProject(null),
    onPrevModal: () => {
      if (selectedIndex > 0) setSelectedProject(filteredProjects[selectedIndex - 1]);
    },
    onNextModal: () => {
      if (selectedIndex >= 0 && selectedIndex < filteredProjects.length - 1) {
        setSelectedProject(filteredProjects[selectedIndex + 1]);
      }
    },
  });

  useEffect(() => {
    if (focusedIndex === null) return;
    const p = visibleProjects[focusedIndex];
    if (!p) return;
    const el = cardRefs.current.get(p.id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [focusedIndex, visibleProjects]);

  return (
    <div className={`relative min-h-screen overflow-x-clip text-slate-900 dark:text-slate-100 ${crtMode ? 'brightness-95 contrast-110 saturate-125' : ''}`}>
      <div className="film-grain pointer-events-none fixed inset-0 z-50 opacity-[0.025]" aria-hidden="true" />
      {crtMode && <div className="crt-scanlines pointer-events-none fixed inset-0 z-50" aria-hidden="true" />}
      <ScrollProgressBar />
      <DualSenseScrollPointer />
      <GameDevBackdrop />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-300/80 bg-[#EAE6DC]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#080808]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-300 bg-amber-50 text-amber-700 dark:border-[#F6CF3B]/40 dark:bg-[#121216] dark:text-[#F6CF3B]">
              <Gamepad2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block font-serif text-lg font-bold tracking-wide text-amber-800 dark:text-[#F6CF3B]">
                {PROFILE.name}
              </span>
              <span className="block font-mono text-[10px] font-medium tracking-wider text-orange-700 uppercase dark:text-[#FF8A3D]">
                Ludonode Studios · Toronto
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-4 md:flex">
            <div className={`flex items-center gap-4 ${recruiterTour ? 'pointer-events-none opacity-45' : ''}`}>
              <button
                type="button"
                onClick={() => navigateTo('professional')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  route === 'professional'
                    ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                    : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => navigateTo('school')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  route === 'school'
                    ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                    : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                School Projects
              </button>
              {route === 'home' ? (
                NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-slate-700 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-[#F6CF3B]"
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-sm font-medium text-slate-700 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-[#F6CF3B]"
                >
                  Main Page
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-[#121216] dark:text-slate-200 dark:hover:border-[#F6CF3B] dark:hover:text-[#F6CF3B]"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-[#F6CF3B]" /> : <Moon className="h-3.5 w-3.5 text-slate-700" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTour}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                recruiterTour
                  ? 'bg-[#EC1D7B] text-white shadow-sm'
                  : 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-[#EC1D7B]/50 dark:bg-[#EC1D7B]/15 dark:text-[#F472B6] dark:hover:bg-[#EC1D7B]/25'
              }`}
            >
              {recruiterTour ? `Stop Tour (${secondsLeft}s)` : '30s Tour'}
            </button>
            <a
              href={`mailto:${PROFILE.emails[0].address}`}
              className={`inline-flex items-center gap-1.5 rounded-full bg-[#F37336] px-4 py-2 text-xs font-semibold text-white transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#e26124] active:scale-[0.97] dark:text-slate-950 dark:hover:bg-[#FF8A3D] ${
                recruiterTour ? 'pointer-events-none opacity-45' : ''
              }`}
            >
              Get in Touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-300/80 bg-[#EAE6DC] px-4 py-4 dark:border-white/10 dark:bg-[#0F0F12] md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Main Page
              </button>
              <button
                type="button"
                onClick={() => navigateTo('professional')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => navigateTo('school')}
                className="rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                School Projects
              </button>
              {route === 'home' &&
                NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800"
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
        <main
          id="top"
          className={`mx-auto max-w-6xl px-4 sm:px-6 ${recruiterTour ? 'pointer-events-none select-none' : ''}`}
        >
        {/* Hero Section */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <HeroNavMeshCanvas />
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="animate-fade-up lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm border border-amber-300 bg-amber-50 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-slate-800 uppercase dark:border-[#F6CF3B]/30 dark:bg-[#121216] dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-amber-700 dark:text-[#F6CF3B]" />
                “founder of LUDONODE STUDIOS” · {PROFILE.location}
              </div>

              <h1 className="mt-5 font-serif text-5xl leading-[1.02] font-bold tracking-tight text-amber-800 uppercase dark:text-[#F6CF3B] sm:text-6xl lg:text-[4.5rem]">
                {PROFILE.name}
              </h1>
              <p className="mt-2.5 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 sm:text-base">
                {PROFILE.title}
              </p>

              {/* Signature Discipline Banner Strip */}
              <div className="mt-5 space-y-2 border-y border-slate-200 py-4 dark:border-white/15">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm font-bold tracking-[0.25em] text-orange-700 uppercase dark:text-[#FF8A3D]">
                    WRITER
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-slate-600 uppercase dark:text-slate-300">
                    NARRATIVE DESIGNER | WORLDBUILDING | DIALOGUES
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm font-bold tracking-[0.25em] text-rose-700 uppercase dark:text-[#EC1D7B]">
                    GAME DESIGNER
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-slate-600 uppercase dark:text-slate-300">
                    MECHANICS | ECONOMY | SYSTEMS DESIGN
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm font-bold tracking-[0.25em] text-emerald-700 uppercase dark:text-[#2EF2A8]">
                    PUZZLE DESIGNER
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-slate-600 uppercase dark:text-slate-300">
                    BOARD PUZZLES | RUBE GOLDBERG | STRUCTURAL ENGINEERING
                  </span>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
                {PROFILE.subheadline}
              </p>

              <blockquote className="mt-6 rounded-lg border border-slate-200 bg-white/90 px-5 py-4 font-serif text-base italic text-slate-800 shadow-2xs dark:border-white/10 dark:bg-[#121216] dark:text-slate-200 dark:shadow-none">
                “{PROFILE.tagline}”
              </blockquote>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-md bg-[#F37336] px-6 py-3 text-sm font-semibold text-white transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#e26124] active:scale-[0.97] dark:text-slate-950 dark:hover:bg-[#FF8A3D]"
                >
                  Explore Projects
                  <Gamepad2 className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700 active:scale-[0.97] dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:border-[#F6CF3B] dark:hover:bg-white/15 dark:hover:text-[#F6CF3B]"
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
                    className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-[#121216] dark:text-slate-300 dark:hover:border-[#F6CF3B] dark:hover:text-[#F6CF3B]"
                  >
                    {social.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>

            <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: '120ms' }}>
              <ScrollParallax offsetY={-24} scaleFrom={0.97} tiltDeg={3}>
                <div className="space-y-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 dark:border-white/10 dark:bg-[#121216] dark:shadow-none">
                <Resn3DShowcase />
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="flex min-h-[76px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-center transition hover:-translate-y-0.5 hover:border-rose-400 dark:border-white/10 dark:bg-[#18181D] dark:hover:border-[#EC1D7B]/50">
                    <Gamepad2 className="mx-auto h-6 w-6 text-rose-600 dark:text-[#EC1D7B]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-slate-800 dark:text-slate-200">
                      Shipped Mobile Titles
                    </p>
                  </div>
                  <div className="flex min-h-[76px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-center transition hover:-translate-y-0.5 hover:border-emerald-400 dark:border-white/10 dark:bg-[#18181D] dark:hover:border-[#2EF2A8]/50">
                    <GraduationCap className="mx-auto h-6 w-6 text-emerald-600 dark:text-[#2EF2A8]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-slate-800 dark:text-slate-200">
                      GBC Game Design
                    </p>
                  </div>
                  <div className="flex min-h-[76px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-center transition hover:-translate-y-0.5 hover:border-orange-400 dark:border-white/10 dark:bg-[#18181D] dark:hover:border-[#FF8A3D]/50">
                    <Sparkles className="mx-auto h-6 w-6 text-orange-600 dark:text-[#FF8A3D]" />
                    <p className="mt-1.5 font-mono text-[10px] font-medium tracking-tight text-slate-800 dark:text-slate-200">
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
        <section id="projects" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-[#EC1D7B]">
                <Layers className="h-3.5 w-3.5" />
                Selected Works
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-[#F6CF3B] sm:text-4xl">
                Games, Levels &amp; Narrative Worlds
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Commercial mobile escape rooms, George Brown College game jams and capstones,
                original puzzle prototypes, and lore bibles. Click any card for full details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleTour}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 font-mono text-[11px] font-semibold tracking-tight transition ${
                  recruiterTour
                    ? 'bg-[#EC1D7B] text-white shadow-sm'
                    : 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-[#EC1D7B]/50 dark:bg-[#EC1D7B]/15 dark:text-[#F472B6] dark:hover:bg-[#EC1D7B]/25'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {recruiterTour ? `Stop Tour (${secondsLeft}s)` : '30s Recruiter Tour'}
              </button>
              {PROJECT_FILTERS.map((filter) => {
                const isActive = !recruiterTour && activeFilter === filter;
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
                      setRecruiterTour(false);
                      setActiveFilter(filter);
                    }}
                    className={`rounded-md px-4 py-2 font-mono text-[11px] font-semibold tracking-tight transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-amber-500 hover:text-slate-950 dark:border-white/15 dark:bg-[#121216] dark:text-slate-300 dark:hover:border-[#F6CF3B]/60 dark:hover:text-white'
                    }`}
                  >
                    {filter} <span className="ml-1 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tech Stack & System Dependency Matrix */}
          {!recruiterTour && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Tech Matrix:
              </span>
              {TECH_TAGS.map((tag) => {
                const active = activeTech === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      captureCardPositions();
                      setActiveTech(tag);
                    }}
                    className={`rounded-full px-3 py-1 font-mono text-[10px] font-medium transition ${
                      active
                        ? 'bg-emerald-600 text-white font-semibold dark:bg-[#2EF2A8] dark:text-slate-950'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-slate-950 dark:border-white/15 dark:bg-[#121216] dark:text-slate-300 dark:hover:border-[#2EF2A8]/60 dark:hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          {recruiterTour && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-300 bg-rose-50/80 p-4 text-xs text-slate-800 dark:border-[#EC1D7B]/40 dark:bg-[#16161B] dark:text-slate-200">
              <div>
                <p className="font-mono text-[11px] font-bold tracking-wider text-rose-700 uppercase dark:text-[#EC1D7B]">
                  30-Second Recruiter Highlights · Flagship 3
                </p>
                <p className="mt-1 text-slate-700 dark:text-slate-300">
                  Core Stack: <strong>UE 5.8 (C++ / StateTree)</strong> · <strong>Unity 6 (C# / URP / Netcode)</strong> · <strong>170K+ Shipped Mobile Downloads</strong>.
                </p>
              </div>
              <a
                href="#resume"
                className="rounded-full bg-[#F37336] px-4 py-1.5 font-semibold text-white hover:bg-[#e26124] dark:text-slate-950 dark:hover:bg-[#FF8A3D]"
              >
                Jump to Experience &amp; Resume
              </a>
            </div>
          )}

          <ScrollParallax offsetY={30} scaleFrom={0.94} tiltDeg={4.5}>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project, idx) => {
              const theme = PASTEL_THEME[project.theme];
              const origin = idx % 3 === 0 ? 'left' : idx % 3 === 2 ? 'right' : 'center';
              return (
                <ScrollScrub3D key={project.id} origin={origin} className="h-full">
                  <Card3DTilt className="h-full">
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
                    className={`group flex h-full cursor-pointer flex-col justify-between rounded-xl border ${theme.border} ${theme.surface} p-6 transition focus:outline-none focus:ring-2 focus:ring-[#1A1715] ${
                      focusedIndex === idx ? 'ring-2 ring-[#0070D1] shadow-lg' : ''
                    }`}
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

                    <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-[#F6CF3B]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{project.context}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {project.overview}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/80 pt-4 dark:border-slate-800/60">
                    <div className="flex flex-wrap gap-1.5">
                      {project.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800 ring-1 ring-slate-200/80 dark:bg-[#16161B] dark:text-slate-300 dark:ring-slate-700"
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
                </ScrollScrub3D>
              );
            })}
            </div>
          </ScrollParallax>

          {activeFilter === 'All' && filteredProjects.length > 6 && (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllProjects((prev) => !prev)}
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {showAllProjects
                  ? 'Show featured (6)'
                  : `Show all ${filteredProjects.length} projects`}
              </button>
            </div>
          )}

          {/* Additional GBC Works Strip */}
          <Reveal className="mt-8">
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/75 p-6 dark:border-sky-800/60 dark:bg-sky-950/35">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Additional George Brown College Projects
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Screenwriting, Cartography &amp; Programming
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {GBC_ADDITIONAL_WORKS.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-full flex-col justify-between rounded-xl border border-sky-200/80 bg-white p-3.5 transition hover:-translate-y-0.5 dark:border-sky-800/50 dark:bg-slate-900/80"
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
        <div id="dualsense" className="scroll-mt-20">
          <ScrollScrub3D portalWipe>
            <DualSensePlayground />
          </ScrollScrub3D>
        </div>

        {/* YouTube Devlogs & Gameplay Videos Section */}
        <section id="videos" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-[#EC1D7B]">
                  <PlayCircle className="h-3.5 w-3.5" />
                  Ludonode Studios · YouTube
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-[#F6CF3B]">
                  Devlogs &amp; Gameplay Videos
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
                  Unreal Engine 5.8 C++ gameplay demos, AI StateTree &amp; pathfinding breakdowns,
                  and Unity 2D/6 devlogs from my YouTube channel.
                </p>
              </div>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 dark:bg-[#EC1D7B] dark:hover:bg-[#f43f91]"
              >
                <PlayCircle className="h-4 w-4" />
                Visit YouTube Channel
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {YOUTUBE_VIDEOS.map((video) => {
              const theme = PASTEL_THEME[video.theme];
              return (
                <article
                  key={video.id}
                  className={`flex flex-col justify-between overflow-hidden rounded-xl border ${theme.border} ${theme.surface} transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="aspect-video w-full bg-slate-950">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${theme.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                        {video.tag}
                      </span>
                      <h3 className="mt-2.5 line-clamp-2 font-serif text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {video.title}
                      </h3>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText}`}
                    >
                      Watch on YouTube
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Game Dev Medium Articles Section */}
        <section id="articles" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-[#2EF2A8]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Ludonode Studios · Medium
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-[#F6CF3B]">
                  Game Dev Articles &amp; Technical Breakdowns
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
                  Deep-dive essays on DirectX 12 scene architecture, emergent gameplay systems,
                  physics-driven character weight, and level design published on Medium.
                </p>
              </div>
              <a
                href="https://medium.com/@ludonodestudios"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/15 dark:bg-[#121216] dark:text-slate-200 dark:hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" />
                Follow on Medium
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WRITINGS.filter((w) => w.platform === 'Medium').map((article, idx) => {
              const theme = PASTEL_THEME[article.theme];
              const origin = idx % 3 === 0 ? 'left' : idx % 3 === 2 ? 'right' : 'center';
              return (
                <ScrollScrub3D key={article.id} origin={origin} className="h-full">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex h-full flex-col justify-between rounded-xl border ${theme.border} ${theme.surface} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                        >
                          <BookOpen className="h-3 w-3" />
                          {article.kind}
                        </span>
                        <span className="font-mono text-[10px] font-medium text-slate-500 uppercase dark:text-slate-400">
                          Medium
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-[#F6CF3B]">
                        {article.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {article.summary}
                      </p>
                    </div>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText}`}
                    >
                      Read Full Article
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </ScrollScrub3D>
              );
            })}
          </div>
        </section>

        {/* Character Design Section */}
        <section id="characters" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
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
              const origin = idx % 3 === 0 ? 'left' : idx % 3 === 2 ? 'right' : 'center';
              return (
                <ScrollScrub3D key={char.id} origin={origin} className="h-full">
                  <div
                    className={`flex h-full flex-col rounded-xl border ${theme.border} ${theme.surface} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
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
                </ScrollScrub3D>
              );
            })}
          </div>
          </ScrollParallax>
        </section>

        {/* Writing & Blog Section */}
        <section id="writing" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Medium
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.wattpad.com/user/ludonodestudios"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Wattpad
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* On-Page Interactive Yarn Spinner Dialogue Showcase */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#121216] dark:shadow-none">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-orange-700 uppercase dark:text-[#FF8A3D]">
                Interactive Branching Dialogue Showcase
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setDialogueSampleId('carpe-dino')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    dialogueSampleId === 'carpe-dino'
                      ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  Carpe Dino
                </button>
                <button
                  type="button"
                  onClick={() => setDialogueSampleId('red-tide')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    dialogueSampleId === 'red-tide'
                      ? 'bg-slate-900 text-white dark:bg-[#F6CF3B] dark:text-slate-950'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  Red Tide
                </button>
              </div>
            </div>
            <DialoguePlayer key={`inline-${dialogueSampleId}`} projectId={dialogueSampleId} />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WRITINGS.filter((item) => item.platform !== 'Medium').map((item, idx) => {
              const theme = PASTEL_THEME[item.theme];
              const origin = idx % 3 === 0 ? 'left' : idx % 3 === 2 ? 'right' : 'center';
              return (
                <ScrollScrub3D key={item.id} origin={origin} className="h-full">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex h-full flex-col justify-between rounded-xl border ${theme.border} ${theme.surface} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
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
                </ScrollScrub3D>
              );
            })}
          </div>
        </section>

        {/* Business & Resume Section */}
        <section id="resume" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Studio Card */}
            <div className="lg:col-span-5">
              <ScrollParallax offsetY={26} offsetX={-12} scaleFrom={0.94} tiltDeg={4} yawDeg={-3}>
              <div className="rounded-2xl border border-orange-200 bg-white p-7 shadow-xs dark:border-[#FF8A3D]/35 dark:bg-[#121216] dark:shadow-none">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-700 dark:bg-slate-900 dark:text-violet-300">
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
                <p className="mt-3 text-sm font-medium italic text-violet-700 dark:text-violet-200">
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
                      className="flex items-center gap-2.5 rounded-xl border border-violet-200/80 bg-violet-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 dark:border-violet-800/50 dark:bg-slate-900/85 dark:text-slate-200"
                    >
                      <Compass className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-6 rounded-2xl border border-sky-200/80 bg-sky-50/75 p-6 dark:border-sky-800/60 dark:bg-sky-950/35">
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
                      className="rounded-2xl border border-sky-200/80 bg-white p-3.5 dark:border-sky-800/50 dark:bg-slate-900/85"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {edu.degree}
                        </p>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {edu.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300">
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
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-[#2EF2A8]/30 dark:bg-[#121216] dark:shadow-none">
                <h3 className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-[#2EF2A8]">
                  Languages
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <span
                      key={lang.name}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-slate-800 dark:border-[#2EF2A8]/30 dark:bg-[#16161B] dark:text-slate-200"
                    >
                      <span className="font-semibold text-slate-950 dark:text-white">
                        {lang.name}
                      </span>{' '}
                      · {lang.proficiency}
                    </span>
                  ))}
                </div>

                <h3 className="mt-5 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-[#2EF2A8]">
                  Licenses &amp; Certifications
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {CERTIFICATIONS.map((cert) => (
                    <li
                      key={cert.title}
                      className="flex items-baseline justify-between gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-medium text-slate-900 dark:text-slate-100">
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
                      <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {exp.organization} · {exp.location}
                      </p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{exp.highlights}</p>
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
                      className={`rounded-2xl border ${theme.border} bg-white p-4 shadow-xs dark:bg-slate-900/80 dark:shadow-none`}
                    >
                      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
        <section id="contact" className="scroll-mt-20 border-t border-slate-200 py-14 dark:border-white/10 sm:py-16">
          <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-sky-50/70 p-8 shadow-xs dark:border-[#EC1D7B]/30 dark:from-[#18121A] dark:via-[#121216] dark:to-[#12161B] dark:shadow-none sm:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase dark:text-[#EC1D7B]">
                  Contact
                </span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-amber-800 dark:text-[#F6CF3B]">
                  Let&apos;s build a world together
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  Available for Narrative Design, Game &amp; Puzzle Design, Screenwriting, and
                  French/English Localization collaborations.
                </p>
              </div>

              <div className="space-y-3">
                {PROFILE.emails.map((email) => (
                  <div
                    key={email.address}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 dark:border-white/15 dark:bg-[#16161B] dark:text-slate-100"
                  >
                    <a
                      href={`mailto:${email.address}`}
                      className="flex min-w-0 items-center gap-2.5 truncate transition hover:text-rose-700 dark:hover:text-rose-300"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span className="truncate">
                        <span className="mr-2 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                          {email.label}
                        </span>
                        {email.address}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyEmail(email.address)}
                      aria-label={`Copy ${email.address}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200"
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
      <footer className="border-t border-slate-300/80 bg-[#E2DDD1] py-8 dark:border-slate-800/80 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-600 sm:flex-row sm:px-6 dark:text-slate-400">
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
                className="transition hover:text-slate-950 dark:hover:text-white"
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
          className="fixed right-5 bottom-5 z-30 rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-md backdrop-blur-xs transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {recruiterTour && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 rounded-2xl border border-[#0070D1]/50 bg-slate-950/95 p-3.5 text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-wider text-sky-400 uppercase">
                Guided Tour · Stop {stopIndex + 1}/{TOUR_STOPS.length}
              </p>
              <p className="text-xs font-semibold text-white">{currentStop.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-sky-300">
                {secondsLeft}s
              </span>
              <button
                type="button"
                onClick={toggleTour}
                className="rounded-full bg-[#0070D1] px-3 py-1 text-xs font-semibold text-white hover:bg-[#005BB5]"
              >
                Stop Tour
              </button>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-sky-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            Navigation locked during tour · Stops automatically at 0s or click Stop Tour
          </p>
        </div>
      )}

      <AudioAtmosphereDock />

      {connectedName && (
        <div className="fixed right-5 bottom-18 z-40 rounded-full border border-sky-400/50 bg-slate-900/95 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-sky-300 shadow-lg">
          🎮 {connectedName} · D-Pad / ✕ Open / ○ Close
        </div>
      )}

      {crtMode && (
        <button
          type="button"
          onClick={() => setCrtMode(false)}
          className="fixed top-20 right-4 z-50 rounded-full border border-emerald-400 bg-slate-950 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300 shadow-lg"
        >
          CRT 8-BIT MODE ON · Click to Exit
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
