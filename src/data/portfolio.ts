export type ProjectCategory =
  | 'Professional'
  | 'GBC School'
  | 'Game Design'
  | 'Narrative & Worldbuilding';

export type PastelTheme = 'rose' | 'violet' | 'amber' | 'emerald' | 'sky' | 'teal';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  roles: string[];
  context: string;
  platforms?: string[];
  overview: string;
  contributions: string[];
  link?: {
    label: string;
    url: string;
  };
  badgeImage?: string;
  theme: PastelTheme;
}

export interface CharacterProfile {
  id: string;
  name: string;
  archetype: string;
  summary: string;
  theme: PastelTheme;
}

export interface WritingItem {
  id: string;
  title: string;
  kind: 'Short Story' | 'Game Design Essay' | 'Personal Essay';
  summary: string;
  platform: 'Medium' | 'Wattpad';
  url: string;
  theme: PastelTheme;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights: string;
  theme: PastelTheme;
}

export const PROFILE = {
  name: 'Roshan Christy',
  title: 'Narrative Designer | Game Designer | Puzzle Designer',
  location: 'Toronto, Ontario, Canada',
  tagline:
    'Navigating the Evolution of Story Ideas: From Better Past Concepts to Stronger Present Narratives',
  subheadline:
    'I am a Narrative Designer, Game Designer, and Puzzle Designer based in Toronto, crafting player-driven worlds, intricate puzzle architectures, and branching stories.',
  emails: [
    { label: 'Work', address: 'roshanchristy.work@gmail.com' },
    { label: 'Studio', address: 'forgederecits@gmail.com' },
  ],
  phone: '(437) 937-3469',
  socials: [
    {
      name: 'LinkedIn',
      handle: 'in/roshanchristy',
      url: 'https://www.linkedin.com/in/roshanchristy/',
    },
    {
      name: 'Medium',
      handle: '@ludonodestudios',
      url: 'https://medium.com/@ludonodestudios',
    },
    {
      name: 'Wattpad',
      handle: 'roshan_christy',
      url: 'http://www.wattpad.com/user/roshan_christy',
    },
    {
      name: 'ArtStation',
      handle: 'roshanchristyr',
      url: 'https://www.artstation.com/roshanchristyr',
    },
    {
      name: 'Discord',
      handle: '@roshan_christy',
      url: 'https://discord.com/channels/@me',
    },
  ],
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'grim-of-legacy',
    title: 'Escape Room: Grim of Legacy',
    category: 'Professional',
    roles: ['Game Designer', 'Level Designer'],
    context: 'HFG Entertainments (Uncredited)',
    platforms: ['iOS', 'Android'],
    overview:
      '2D point-and-click puzzle escape game set in an archaeological expedition and ancient mystery environment.',
    contributions: [
      'Designed interactive door and inventory-combination puzzles.',
      'Balanced item discovery sequences and escape progression curves.',
      'Authored spatial flow diagrams and player puzzle walkthroughs.',
    ],
    link: {
      label: 'Google Play Store',
      url: 'https://play.google.com/store/apps/details?id=air.com.hfg.grimoflegacy&hl=en&gl=US',
    },
    badgeImage: './images/hfg-badge.png',
    theme: 'amber',
  },
  {
    id: 'allys-adventure',
    title: "Escape Room: Ally's Adventure",
    category: 'Professional',
    roles: ['Narrative Writer', 'Level Designer'],
    context: 'HFG Entertainments (Uncredited)',
    platforms: ['iOS', 'Android'],
    overview:
      'Whimsical fairy-tale mystery escape room adventure following young protagonist Ally through enchanted ruins, magical rooms, and cryptic lock mechanisms.',
    contributions: [
      'Story narrative, dialogue scripting, and environmental story clues.',
      'Multi-room puzzle sequencing and clue progression design.',
    ],
    link: {
      label: 'Google Play Store',
      url: 'https://play.google.com/store/apps/details?id=air.com.hfg.allysadventures&hl=en&gl=US',
    },
    badgeImage: './images/hfg-badge.png',
    theme: 'rose',
  },
  {
    id: 'red-tide',
    title: 'Red Tide',
    category: 'GBC School',
    roles: ['Game Designer', 'Level Designer', 'Writer', 'Project Manager'],
    context: 'Capstone / Flagship Academic Team Project · George Brown College',
    overview:
      'Sci-fi deep-sea survival psychological horror thriller where players navigate a compromised underwater research outpost amidst mutated crimson bioluminescent organisms.',
    contributions: [
      'Authored the complete Game Design Document (GDD) and level layouts.',
      'Designed encounter pacing, narrative audio logs, and environmental storytelling.',
      'Led sprint planning and Agile project management across the team.',
    ],
    badgeImage: './images/gbc-badge.png',
    theme: 'rose',
  },
  {
    id: 'fair-fortunes',
    title: 'Fair Fortunes',
    category: 'GBC School',
    roles: ['Level Designer', 'Puzzle Designer'],
    context: '48-Hour Game Jam 1 · George Brown College',
    overview:
      'Carnivalesque fortune-telling puzzle game where players manipulate tarot/destiny cards and mechanical arcade contraptions to reveal fortunes and bypass locked challenges.',
    contributions: [
      'Designed card-manipulation puzzle mechanics and progression locks.',
      'Rapidly prototyped and playtested level flow within a 48-hour jam window.',
    ],
    badgeImage: './images/gbc-badge.png',
    theme: 'violet',
  },
  {
    id: 'syrup-safari',
    title: 'Syrup Safari',
    category: 'GBC School',
    roles: ['Level Designer', 'Puzzle Designer'],
    context: 'Game Jam 3 · George Brown College',
    overview:
      'Canadian wilderness and maple-syrup-themed arcade-puzzle platformer focused on fluid navigation, resource collection, obstacle pathing, and environmental hazard timing.',
    contributions: [
      'Architected platforming puzzle layouts and hazard timing loops.',
      'Tuned resource placement and player traversal flow.',
    ],
    badgeImage: './images/gbc-badge.png',
    theme: 'amber',
  },
  {
    id: 'temporal-nexus',
    title: 'Temporal Nexus',
    category: 'Game Design',
    roles: ['Game Designer', 'Puzzle Designer'],
    context: 'Original Game Design Concept',
    overview:
      '3D sci-fi puzzle-adventure concept centered on temporal manipulation mechanics. Players toggle between multiple time states of the same facility (past pristine, present degraded, future ruined) to alter object geometry and solve paradoxical physics puzzles.',
    contributions: [
      'Designed multi-state temporal toggling rules and causality constraints.',
      'Mapped paradoxical physics puzzle scenarios across three eras.',
    ],
    theme: 'sky',
  },
  {
    id: 'slide-n-ball',
    title: "Slide 'n Ball Game",
    category: 'Game Design',
    roles: ['Game Designer', 'Level Designer'],
    context: 'Original Arcade Puzzle Concept',
    overview:
      'Kinetic physics-based puzzle arcade title designed for tactile feedback, momentum manipulation, gravity wells, and spatial prediction challenges.',
    contributions: [
      'Designed momentum-driven mechanics and gravity-well interactions.',
      'Structured escalating spatial prediction challenges.',
    ],
    theme: 'emerald',
  },
  {
    id: 'mirage-of-maravi',
    title: 'Mirage of Maravi',
    category: 'Narrative & Worldbuilding',
    roles: ['Narrative Designer', 'Writer'],
    context: 'Narrative Design Bible & Quest Architecture',
    overview:
      'Rich narrative bible and branching dialogue quest design set in the mystical arid kingdom of Maravi.',
    contributions: [
      'Built faction politics, moral ambiguity frameworks, and cultural worldbuilding.',
      'Authored dialogue trees, cinematic narrative beats, and character motivation matrices.',
    ],
    theme: 'amber',
  },
  {
    id: 'solaureus',
    title: 'Solaureus',
    category: 'Narrative & Worldbuilding',
    roles: ['Worldbuilder', 'Lore Architect'],
    context: 'Original Sci-Fantasy Universe',
    overview:
      'Solar-punk / mythic sci-fantasy universe driven by celestial energy, solar dynastic guilds, crystalline architecture, and astronomical alchemy.',
    contributions: [
      'Developed comprehensive lore on geography, theological sects, and socio-economic caste systems.',
      'Designed technological artifacts powered by crystallized sunlight.',
    ],
    theme: 'teal',
  },
];

export const GBC_ADDITIONAL_WORKS = [
  { title: 'Last Drive', detail: 'Game Jam 2 — Game & Level Design' },
  { title: 'Color of Blood', detail: 'Episodic Crime Drama TV Show — Screenwriting' },
  { title: 'Vidhiyin Naanayam', detail: 'Feature Drama Film — Screenwriting' },
  { title: 'RPG World Design Cartographer', detail: 'Video Game — World & Map Design' },
  { title: 'Unreal Car Combat', detail: 'Game Programming — Survival Action Game' },
];

export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'elena-stormbourne',
    name: 'Elena Stormbourne',
    archetype: 'Elemental Battlemage',
    summary:
      'Fierce elemental battlemage wrestling with inherited tempest magic and moral responsibility over shattered city-states.',
    theme: 'sky',
  },
  {
    id: 'nithya-velayudham',
    name: 'Nithya Velayudham',
    archetype: 'Relic Archaeologist & Blade Master',
    summary:
      'Scholar blade master seeking to preserve ancient martial traditions and recovered artifacts against imperial pillagers.',
    theme: 'amber',
  },
  {
    id: 'suhani-skydancer',
    name: 'Suhani Skydancer',
    archetype: 'Aerial Scout & Navigator',
    summary:
      'Free-spirited aerial scout and skyship navigator with unmatched instinct for weather anomalies and stealth recon.',
    theme: 'teal',
  },
  {
    id: 'thalia-kullari',
    name: 'Agent Thalia Kullari',
    archetype: 'Covert Intelligence Operative',
    summary:
      'Shrewd undercover intelligence operative navigating double crosses, bureaucratic corruption, and counter-insurgency operations.',
    theme: 'rose',
  },
  {
    id: 'ishan',
    name: 'Ishan',
    archetype: 'Solitary Technomancer Prodigy',
    summary:
      'Driven by grief, wielding arcane-cybernetic conduits to commune with decommissioned sentiences.',
    theme: 'violet',
  },
];

export const WRITINGS: WritingItem[] = [
  {
    id: 'cinco',
    title: 'Cinco: A Time Travel Short Story',
    kind: 'Short Story',
    summary:
      'A gripping temporal fiction exploring the paradox of 5-minute pre-cognition and time slips, the emotional consequences of trying to undo irreversible tragedies, and the psychological unraveling of destiny.',
    platform: 'Wattpad',
    url: 'http://www.wattpad.com/user/roshan_christy',
    theme: 'violet',
  },
  {
    id: 'switch-maze',
    title: 'Designing Tension, Timing, and Trust: Behind the Puzzle of Switch Maze',
    kind: 'Game Design Essay',
    summary:
      'Deep-dive game design analysis examining player psychology during maze solving, cognitive load, time pressure, and building fair player-designer trust.',
    platform: 'Medium',
    url: 'https://medium.com/@ludonodestudios',
    theme: 'teal',
  },
  {
    id: 'how-to-design-puzzles',
    title: 'How to Design Games series - Puzzles',
    kind: 'Game Design Essay',
    summary:
      'Fundamental breakdown of puzzle design principles: mechanics discovery, clue conveyance, the "Eureka!" curve, and avoiding frustration loops.',
    platform: 'Medium',
    url: 'https://medium.com/@ludonodestudios',
    theme: 'sky',
  },
  {
    id: 'people-surprise-us',
    title: 'How do you Know when People Surprise Us?',
    kind: 'Personal Essay',
    summary:
      'Philosophical exploration of human intuition, cognitive biases, empathy, and subversion of character expectations in storytelling.',
    platform: 'Medium',
    url: 'https://medium.com/@ludonodestudios',
    theme: 'amber',
  },
  {
    id: 'in-love-when',
    title: "You Know You're in Love When…",
    kind: 'Personal Essay',
    summary:
      'Reflective personal essay dissecting emotional vulnerability, creative synergy, and romantic resonance.',
    platform: 'Medium',
    url: 'https://medium.com/@ludonodestudios',
    theme: 'rose',
  },
  {
    id: 'atheist-christian-family',
    title: '4 Reasons not to be An Atheist in a Christian Family',
    kind: 'Personal Essay',
    summary:
      'Nuanced exploration of family harmony, cultural heritage, spiritual dialectics, and navigating secular vs. traditional religious dynamics with respect.',
    platform: 'Medium',
    url: 'https://medium.com/@ludonodestudios',
    theme: 'emerald',
  },
];

export const STUDIO = {
  brand: 'Ludonode Studios',
  name: "Roshan's Forge de Récits Inc.",
  motto: 'Your world, our words, their choice',
  established: 'Incorporated 2024 · Toronto, Ontario',
  mission:
    'Narrative design consultancy, screenwriting, game level & puzzle architecture, and bilingual narrative translation services.',
  emblem: './images/ludonode-logo.jpg',
  services: [
    'Game Narrative & Dialogue Architecture',
    'Level Design & Puzzle Mechanics Engineering',
    'Scriptwriting & Screenplay Development',
    'French / English Translation & Localization',
  ],
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Narrative Translator',
    organization: '4S Interpretation and Translation Services Inc.',
    location: 'Toronto / Remote',
    period: 'Jul 2024 – Present',
    highlights: 'Bilingual French/English narrative translation and localization.',
    theme: 'teal',
  },
  {
    role: 'Founder | Writer',
    organization: "Roshan's Forge de Récits Inc.",
    location: 'Toronto, Ontario',
    period: '2024 – Present',
    highlights:
      'Independent studio delivering narrative design, puzzle architecture, screenwriting, and localization.',
    theme: 'violet',
  },
  {
    role: 'Game Designer',
    organization: 'HFG Entertainments',
    location: 'Chennai, India',
    period: 'Jan – May 2023',
    highlights:
      'Designed levels, puzzles, and narrative scripts for commercial mobile escape-room titles (Grim of Legacy, Ally’s Adventure).',
    theme: 'amber',
  },
  {
    role: 'Editor',
    organization: 'Cannibals Media',
    location: 'Online',
    period: 'Apr – May 2022',
    highlights: 'Editorial review, story refinement, and content quality assurance.',
    theme: 'rose',
  },
  {
    role: 'Content Writer',
    organization: 'DigitalImpulse Inc.',
    location: 'Online',
    period: 'Sep – Dec 2021',
    highlights: 'Authored structured web copy, narrative articles, and creative briefs.',
    theme: 'sky',
  },
];

export const SKILLS = [
  {
    group: 'Game & Level Design',
    theme: 'sky' as PastelTheme,
    items: [
      'Unreal Engine',
      'Unity',
      'Paper Prototyping',
      'Puzzle Flowcharts',
      'GDD Authoring',
      'Encounter Pacing',
    ],
  },
  {
    group: 'Narrative & Writing',
    theme: 'rose' as PastelTheme,
    items: [
      'Branching Dialogue',
      'Twine',
      'Final Draft',
      'Screenwriting',
      'World Building',
      'Character Conception',
      'FR/EN Localization',
    ],
  },
  {
    group: 'Project Management',
    theme: 'emerald' as PastelTheme,
    items: ['Agile', 'Jira', 'Trello', 'Sprint Planning'],
  },
];
