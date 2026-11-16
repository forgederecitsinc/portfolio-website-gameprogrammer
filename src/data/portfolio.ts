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
  mechanics?: Array<{
    heading: string;
    points: string[];
  }>;
  link?: {
    label: string;
    url: string;
  };
  badgeImage?: string;
  images?: Array<{
    src: string;
    alt: string;
  }>;
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

export interface YouTubeVideoItem {
  id: string;
  title: string;
  tag: string;
  theme: PastelTheme;
}

export const PROFILE = {
  name: 'Roshan Christy',
  title: 'Game Programmer | Game Designer | Puzzle Designer | Game Writer',
  location: 'Toronto, Ontario, Canada',
  tagline:
    'Navigating the Evolution of Story Ideas: From Better Past Concepts to Stronger Present Narratives',
  subheadline:
    'Pursuing an Advanced Diploma in Game Programming at George Brown College while serving as a Game Writer at Black Squirrels Studio. Background in Screenwriting & Narrative Design and Digital Game Design, focused on "show, don’t tell" storytelling, puzzle architecture, and C++ / C# gameplay systems.',
  emails: [
    { label: 'Studio', address: 'ludonodestudios@outlook.com' },
    { label: 'Personal', address: 'roshanchristyr@hotmail.com' },
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
      handle: 'forge_de_recits',
      url: 'https://www.wattpad.com/user/forge_de_recits',
    },
    {
      name: 'ArtStation',
      handle: 'roshanchristyr',
      url: 'https://www.artstation.com/roshanchristyr',
    },
    {
      name: 'YouTube',
      handle: 'Ludonode Studios',
      url: 'https://www.youtube.com/channel/UCoTcZqq_AYRAOkK9UmRkAWQ',
    },
    {
      name: 'Discord',
      handle: '@roshan_christy',
      url: 'https://discord.com/channels/@me',
    },
  ],
};

export const YOUTUBE_CHANNEL_URL =
  'https://www.youtube.com/channel/UCoTcZqq_AYRAOkK9UmRkAWQ';

export const YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'JaMXJV_VneM',
    title: 'Live Wire — Unreal Engine 5 Gameplay Demo | Sci-Fi Puzzle & Combat (UE5 C++)',
    tag: 'UE5 C++ · Gameplay Demo',
    theme: 'emerald',
  },
  {
    id: 'Oe7FVja7tjc',
    title: 'Enemy Drone AI in Unreal Engine 5 C++ (Patrol, Detection, Chase) | Live Wire Dev Log 1',
    tag: 'UE5 C++ · AI Devlog',
    theme: 'sky',
  },
  {
    id: 'a4i7tog7elU',
    title: 'How I Architected High-Stakes Timed Rooms in UE5 | Devlog | Trap Rooms',
    tag: 'UE5 C++ · Systems Devlog',
    theme: 'rose',
  },
  {
    id: 'BoDVQT_aRtY',
    title: 'Building a Fast-Paced Mobile Arcade Game in Unity 2D',
    tag: 'Unity 2D · Mobile Devlog',
    theme: 'amber',
  },
  {
    id: '0stGfZPYl9c',
    title: 'Unity 6.6 AI Pathfinding Showcase | GAME3121 Lab Test 2',
    tag: 'Unity 6 · AI Pathfinding',
    theme: 'teal',
  },
  {
    id: '8QmfpyOQjSk',
    title: 'GAME3121 Lab Test 2 Final Build: AI Pathfinding',
    tag: 'Unity 6 · Final Build',
    theme: 'violet',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'carpe-dino',
    title: 'Carpe Dino: Seize the Date',
    category: 'Professional',
    roles: ['Game Writer', 'Narrative Designer'],
    context: 'Black Squirrels Studio · Jan 2026 – Present',
    overview:
      'Writing dialogue and branching narratives in Yarn Spinner–style scripting, keeping each character’s voice consistent across paths.',
    contributions: [
      'Authored branching dialogue and Yarn Spinner–style narrative scripts.',
      'Maintained distinct, consistent character voices across player choices and story routes.',
    ],
    images: [
      {
        src: './images/systems/carpe-dino.svg',
        alt: 'Carpe Dino: Seize the Date branching narrative system diagram',
      },
    ],
    theme: 'violet',
  },
  {
    id: 'grim-of-legacy',
    title: 'Escape Room: Grim of Legacy 2',
    category: 'Professional',
    roles: ['Game Designer', 'Level Designer'],
    context: 'HFG Entertainments · Mar 2023 – May 2023',
    platforms: ['iOS', 'Android'],
    overview:
      'Point-and-click puzzle adventure with 250+ challenging levels and over 600 unique puzzles spanning riddles, ciphers, and logic challenges across 26 languages.',
    contributions: [
      'Designed interactive door and inventory-combination puzzles across 250+ levels.',
      'Balanced item discovery sequences and escape progression curves.',
      'Authored spatial flow diagrams and player puzzle walkthroughs.',
    ],
    link: {
      label: 'Google Play Store',
      url: 'https://play.google.com/store/apps/details?id=air.com.hfg.grimoflegacy&hl=en&gl=US',
    },
    badgeImage: './images/hfg-badge.png',
    images: [
      {
        src: './images/systems/grim-of-legacy.svg',
        alt: 'Escape Room: Grim of Legacy puzzle and spatial flow system diagram',
      },
    ],
    theme: 'amber',
  },
  {
    id: 'allys-adventure',
    title: "Escape Room: Ally's Adventure",
    category: 'Professional',
    roles: ['Narrative Writer', 'Level Designer'],
    context: 'HFG Entertainments · Jan 2023 – Mar 2023 · 170K+ Downloads (4.35/5)',
    platforms: ['iOS', 'Android'],
    overview:
      'Point-and-click puzzle game featuring 50 uniquely crafted levels and 150+ puzzles following Ally and her alien companion Bozzy, localized in 26 languages with 170,000+ downloads worldwide.',
    contributions: [
      'Authored story narrative, dialogue scripting, and environmental story clues.',
      'Designed multi-room puzzle sequencing and clue progression across 50 levels.',
    ],
    link: {
      label: 'Google Play Store',
      url: 'https://play.google.com/store/apps/details?id=air.com.hfg.allysadventures&hl=en&gl=US',
    },
    badgeImage: './images/hfg-badge.png',
    images: [
      {
        src: './images/systems/allys-adventure.svg',
        alt: "Escape Room: Ally's Adventure narrative and lock progression system diagram",
      },
    ],
    theme: 'rose',
  },
  {
    id: 'live-wire',
    title: 'Live Wire',
    category: 'GBC School',
    roles: ['Game Programmer', 'Systems & Level Designer'],
    context: 'George Brown College · GAME3023 (Fall 2026) · Unreal Engine 5.8 (C++ & Blueprints)',
    platforms: ['PC', 'PS5 DualSense', 'macOS Apple Silicon'],
    overview:
      'Top-down 2.5D action-puzzle game set inside a decommissioned, multi-tier power substation (upper control booth, catwalks, moving walkways, and ground-level junction grid). Restore power by routing energy from portable batteries into laser turrets and targets to ignite transformer bushings while surviving laser hazards and enemy interference.',
    contributions: [
      'Player, Isometric Camera & Health (C++): Fixed -60° isometric SpringArm camera (1600 cm arm, 85° FOV), 260 cm interaction scanner, 100 HP damage/knockback/respawn system, and looped 2D substation audio.',
      'ID-Matched Power & Puzzle Loop: Engineered ABatteryCapsule (1001+ color-mapped IDs), ARedPowerCylinder (2500 cm trace laser turrets), ALaserTarget receivers, and neon-igniting ATransformerBushing (25× emissive + 8000-lumen flicker).',
      'Security Grid & Enemy AI Waves: Built instanced AGridLaser + AGridLaserButton toggles, AEnemyBatteryThief wave spawner (Patrol → Approach → 10 s Battery Removal → DropSpot), and hovering AEnemyDrone spotlight patrols dropping 1400 cm/s laser bolts.',
      'Slate HUD, Occlusion Shader & DualSense: Authored Slate radial hold-badge (5 s hold), lagging health bar, overhead thief countdown, MPC_PlayerOcclusion cutout (260 radius / 5% center opacity), and Enhanced Input + DualSense rumble.',
    ],
    mechanics: [
      {
        heading: 'Core Gameplay Loop',
        points: [
          '1. Explore & Locate Batteries: Navigate the ground plane to find spinning, bobbing Battery Capsules color-coded by a 4-digit BatteryID.',
          '2. Collect & Carry: Walk within 260 cm and tap E (keyboard) or Square (DualSense) to pick up one battery at a time (R / Q / Circle drops it).',
          '3. Match & Charge Laser Guns: Hold E / Square for 5 seconds (radial ring + pulsed rumble) to socket into an ARedPowerCylinder. Matching CellID fires a continuous beam; mismatch keeps the turret OFFLINE with a warning.',
          '4. Hit Targets & Light Bushings: Route the 2500 cm beam into a matching Laser Target (TargetID == CellID) or bushing to ignite Transformer Bushings (neon flicker + 8000-lumen glow, permanent if bStayLitOnceActivated).',
          '5. Defend & Survive: Protect active turrets from Battery Thieves and avoid Enemy Drones, active laser beams, and Security Grid Lasers.',
        ],
      },
      {
        heading: 'Movement, Camera & Occlusion',
        points: [
          'Ground-plane WASD / Left Stick movement + Mouse / Right Stick aim (0.2 dead zone); jumping intentionally disabled for puzzle clarity.',
          'Fixed -60° isometric camera (1600 cm arm, 85° FOV, 4.0 lag) with collision disabled so catwalks never snap the camera inward.',
          'Dynamic 260-radius circular occlusion cutout (140 softness, 5% center opacity, cyan rim glow) when upper-tier roofs/catwalks block sightlines.',
        ],
      },
      {
        heading: 'Interaction, Hazards & Security Grids',
        points: [
          'Per-tick 260 cm proximity scanner drives the bottom-center Interact Prompt (Collect, Hands Full, Attach, Remove, Requires Battery).',
          '5-second hold-to-attach cancels on early release; loose pickup and socket removal are instant.',
          'Active laser beams deal 10 damage every 0.35 s; AGridLaser barriers act as solid forcefields or 10.0 tick-damage hazards toggled by BP_GridLaserButton.',
        ],
      },
      {
        heading: 'Enemy AI & Wave Spawning',
        points: [
          'Enemy Drones (AEnemyDrone): Hover at 350 cm, patrol NavMesh at 450 cm/s (600 cm grid), scan with a 12°/18° spotlight (1500 cm range), and drop 1400 cm/s laser bombs every 0.45 s (10 damage).',
          'Battery Thieves (AEnemyBatteryThief): Spawn from (-878, -3679, 10) every 10.0 s (max 5, 300 cm/s; 60.0 s replacement on death).',
          'Thief State Machine (EBatteryThiefState): Patrolling → Approaching → Removing (10 s overhead countdown turning red < 2.5 s) → Carrying to nearest BP_BatteryDropSpot → FollowingPlayer (+70 cm/s if bumped).',
        ],
      },
      {
        heading: 'Health, Respawn & DualSense Feedback',
        points: [
          '100 HP top-right Slate health bar (340 × 24) with cyan/green → yellow → crimson gradient, lagging damage trail, and critical pulse (debug: K -15 HP, H +15 HP).',
          'At 0 HP, any carried battery drops automatically and the player respawns at RespawnLocation after 1 s.',
          'DualSense rumble (0.75 intensity) on pickup, plug-in, and damage plus pulsed rumble during 5 s holds; looped LiveWire_Substation_Theme 2D audio.',
        ],
      },
    ],
    link: {
      label: 'GitHub Repository',
      url: 'https://github.com/forgederecitsinc/GAME3023_F2026_101473963',
    },
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/live-wire.svg',
        alt: 'Live Wire Unreal Engine 5.8 C++ puzzle and AI system diagram',
      },
    ],
    theme: 'teal',
  },
  {
    id: 'trap-rooms',
    title: 'Trap Rooms',
    category: 'GBC School',
    roles: ['Game Programmer', 'UI & Systems Designer'],
    context: 'George Brown College · Sep 2026 – Present · Unreal Engine 5.8 (C++ & Blueprints)',
    platforms: ['PC', 'PS5 DualSense'],
    overview:
      '3D third-person risk-reward arcade game (A_Christy_Roshan) built in Unreal Engine 5.8 C++. Players race a 300-second global match timer, unlock timed poison-gas trap rooms to gamble UnbankedScore vs. BankedScore, cross breakable Glass Bridge platforms, and unlock elevators and the Final Key.',
    contributions: [
      'Match Flow & Risk-Reward Scoring (AGameGM & ATrapRoom): 300 s match timer, 1-key inventory cap, 10 s trap-room countdowns, Banked vs. UnbankedScore transfers, PoisonGas failure penalties (-10 BankedScore), and WBP_ResultScreen victory/defeat states.',
      'DualSense Haptics & Tuned Platforming (AGameCharacter): Tunable jump physics (JumpStrength 550, Gravity 1.75, AirControl 0.5), stride-based footstep taps (135 cm), landing pulses, and PlayDynamicForceFeedback for heartbeats, coins, glass shatters, and enemy hits.',
      'AI, Glass Bridge & Hazard Actors: Built AEnemyCharacter (500 cm wander / 1000 cm chase / -5 BankedScore), configurable AGlassPlatform (3-blink shatter), AElevator (40+ BankedScore unlock), AFinalKey (150+ BankedScore), AKillVolume, and ARespawnTrigger.',
      'Persistent Subsystems & Console UI: Implemented UBGMAudioSubsystem, UGlobalFadeSubsystem, AJesus shrine 5 s pray-to-earn key mechanic (1.0/s decay), and full UMG/Slate gamepad focus management.',
    ],
    mechanics: [
      {
        heading: 'Core Gameplay Loop (6 Stages)',
        points: [
          '1. Start & Match Timer (AGameGM): Match begins in 01_Gameplay with a 300-second (5-minute) global countdown; hitting 0 opens WBP_ResultScreen in Defeat state.',
          '2. Acquire a Key: Hold at most 1 key (KeysCollected max 1) via AKeyPickup, praying at an AJesus shrine (hold Square for 5.0 s, 1.0/s decay on release), or collecting AFinalKey at 150+ BankedScore.',
          '3. Unlock & Enter Trap Room (ATrapRoom): Interact in UnlockZone to call TryUnlock() (consumes key, opens DoorMesh), then step into TriggerZone to start the 10.0 s TrapDuration countdown.',
          '4. Risk-Reward Coin Collection: Outside coins bank directly into BankedScore; inside coins accumulate in UnbankedScore ("At Risk").',
          '5. Escape or Fail: Exiting TriggerZone in time banks UnbankedScore (room re-arms after timer); running out of time triggers ExecuteTrap() with PoisonGas, wiping UnbankedScore and deducting 10 BankedScore.',
          '6. Progression & Win Flow: OnBankedScoreChanged unlocks AElevator at 40 BankedScore and AFinalKey at 150 BankedScore; ShowResultScreen(bool bVictory) pauses and focuses UResultScreenWidget.',
        ],
      },
      {
        heading: 'Movement & DualSense Force Feedback',
        points: [
          'Tuned third-person platforming (AGameCharacter): JumpStrength = 550.0, JumpGravityScale = 1.75, JumpAirControl = 0.5.',
          'Dynamic controller haptics: Stride-based footstep taps (135 cm), jump takeoff & fall-scaled landing pulses, heartbeat warnings inside trap rooms / final 10 s, coin pickups, door unlocks/rejections, and glass shatter feedback.',
        ],
      },
      {
        heading: 'Enemies, Glass Bridge & Hazards',
        points: [
          'AEnemyCharacter: Wanders within 500 cm (150 cm/s), chases player within 1000 cm (300 cm/s), and deals 5 BankedScore damage via DamageSphere with a 1.0 s cooldown.',
          'AGlassPlatform: Tempered (safe) or breakable (bBreakWhenSteppedOn = true) blinking 3 times every 0.2 s before destroying.',
          'AKillVolume (3.0 s delay, -20 ScorePenalty) and ARespawnTrigger (controller rumble, 1.0 s delay, optional velocity reset) teleport back to safe checkpoints.',
        ],
      },
      {
        heading: 'Audio & Transition Subsystems',
        points: [
          'UBGMAudioSubsystem manages cross-level background music across Start Screen, Menu, and Gameplay states.',
          'UGlobalFadeSubsystem handles smooth screen fade transitions.',
        ],
      },
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/trap-rooms.svg',
        alt: 'Trap Rooms risk-reward arcade and C++ subsystem diagram',
      },
    ],
    theme: 'rose',
  },
  {
    id: 'multiplayer-tic-tac-toe',
    title: 'Multiplayer Tic-Tac-Toe (Client-Server)',
    category: 'GBC School',
    roles: ['Network Programmer', 'Game Designer'],
    context: 'George Brown College · GAME3110 · Unity 6 & Unity Transport (C#)',
    platforms: ['PC', 'Online Multiplayer', 'Local 2-Player'],
    overview:
      '3x3 Tic-Tac-Toe featuring a server-authoritative online multiplayer architecture (accounts, matchmaking rooms, quick-chat wheel, and live spectator sync) alongside an offline pass-and-play 2-player mode.',
    contributions: [
      'Server-Authoritative Core (NetworkServer.cs): Owns GameRoom board state (cells 0–8), CurrentTurn, 8-line win/draw checks, and rejects invalid, out-of-turn, occupied-cell, or spectator moves with MOVE_ERROR.',
      'Auth, Rooms & State Machine (GameStateManager.cs): Connects to 127.0.0.1:9001 via Unity Transport reliableAndInOrderPipeline across 6 states (MainMenu → Login/CreateAccount → RoomLobby → WaitingForOpponent → Playing).',
      'Spectator Sync & Quick-Chat Wheel: Assigns Host = X, Guest = O, and 3rd+ clients as Observers (SPECTATOR_JOINED live board sync); supports 5 preset CHAT_MSG quick-chats while blocking spectator inputs.',
      'Offline Local 2-Player Mode: LocalTicTacToeScene (TicTacToeGame.cs & TicTacToeUI.cs) runs same-device pass-and-play with instant RestartButton and BackToMenuButton transitions.',
    ],
    mechanics: [
      {
        heading: '1. Core Game Mechanics',
        points: [
          'Board & Symbols: 3x3 grid indexed 0–8; X always goes first, alternating turns with O.',
          'Win & Draw Detection: Checks 8 winning lines (3 rows, 3 columns, 2 diagonals) after every move; 9 filled cells with no winner triggers a draw.',
          'Server-Authoritative Validation: NetworkServer.cs owns board state, active turn, and match status inside GameRoom, rejecting invalid, out-of-turn, occupied-cell, or spectator moves with MOVE_ERROR.',
        ],
      },
      {
        heading: '2. Multiplayer Gameplay Loop',
        points: [
          'Connect & Authenticate: Client connects to 127.0.0.1:9001 via Unity Transport (reliableAndInOrderPipeline) and sends CREATE_ACCOUNT or LOGIN; server stores accounts in memory and replies LOGIN_SUCCESS → RoomLobby.',
          'Room Matchmaking & Roles: Players send JOIN_ROOM|<roomName> (1–24 chars). 1st Player (Host = X) enters WaitingForOpponent (ROOM_WAITING); 2nd Player (Guest = O) triggers GAME_START + ROOM_STARTED → Playing; 3rd+ Players join room.Observers (SPECTATOR_JOINED) synced to live board/turn.',
          'Turn-Based Match Loop: Active player clicks empty cell 0–8 to send MAKE_MOVE|<cellIndex>; server broadcasts MOVE_MADE (flipping X ↔ O) or GAME_OVER|<X|O|DRAW>|<winningLine>.',
          'Rematch & Disconnects: Players click RestartButton (RESTART_GAME) to reset with X first (SPECTATOR_RESET for observers). Leaving spectators are removed silently; if Host or Guest leaves, OPPONENT_LEFT returns everyone to RoomLobby.',
        ],
      },
      {
        heading: '3. Preset Chat Wheel & Spectator Mode',
        points: [
          'Chat Wheel (ChatWheelPanel): Host and Guest send 5 preset messages ("Good luck!", "Nice move!", "Well played!", "Oops!", "Thinking...") via CHAT_MSG|<text>, forwarded to opponent and spectators.',
          'Spectator Mode: Read-only live board, turn status, chat banner, and resets; board buttons, RestartButton, and ChatWheelButton are disabled, and server blocks spectator MAKE_MOVE, RESTART_GAME, and CHAT_MSG packets.',
        ],
      },
      {
        heading: '4. Local 2-Player Mode (Offline)',
        points: [
          'PlayLocalButton loads LocalTicTacToeScene where TicTacToeGame.cs and TicTacToeUI.cs run pass-and-play on one device (X starts first) with RestartButton and BackToMenuButton to SampleScene.',
        ],
      },
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/multiplayer-tic-tac-toe.svg',
        alt: 'Multiplayer Tic-Tac-Toe client-server networking diagram',
      },
    ],
    theme: 'sky',
  },
  {
    id: 'asteroid-survival',
    title: '2D Asteroid Survival Arcade Game',
    category: 'GBC School',
    roles: ['Game Programmer', 'Game Designer'],
    context: 'George Brown College · GAME3121 · Unity 6 (URP 2D / WebGL)',
    platforms: ['WebGL', 'PC'],
    overview:
      '2D top-down survival/avoidance game built in Unity 6 (6000.6.0f1) where you pilot a ship inside a walled arena, dodging bouncing obstacles until reaching the 300-point survival target.',
    contributions: [
      'Mouse-Aim & Click-Thrust Physics (PlayerMovement.cs): Smooth cursor tracking at 220°/s via Mathf.MoveTowardsAngle, Left-Click thrust (12f), maxSpeed clamping (6f), and W debug win trigger.',
      'Bouncing Obstacles & Non-Lethal Walls (ObstacleMovement.cs, WallSound.cs): Random 0°–360° launch (3f ± 1f speed), single-owner spark FX on obstacle-to-obstacle collisions, and non-lethal wall bump SFX.',
      'Proximity Radar & Dynamic Smoke: Distance-scaled warning beep (8f → 1.2f, pitch 0.8–2.0, interval 0.75s–0.08s) plus velocity-aligned trailing smoke (18–48 particles/s above 0.15f speed).',
      'Scoring, Persistence & WebGL Audio (GameManager.cs): Live time-based scoring (10 pts/s), PlayerPrefs high-score persistence (LabTest3HighScore), confetti win / explosion game-over states, and WebGL autoplay unlock.',
    ],
    mechanics: [
      {
        heading: '1. Core Gameplay Loop',
        points: [
          'Start / Spawn: GameManager.cs loads LabTest3HighScore from PlayerPrefs, resets score to 0, hides end panels, starts looping music, and launches obstacles at random 0°–360° angles.',
          'Survive & Steer: Weave around bouncing obstacles inside the arena while survival time awards 10 pts/sec (elapsedTime * pointsPerSecond) and updates live Score & HighScore labels.',
          'Win (300 Pts): Reaching scoreToWin (300 pts / 30 s, or pressing W) triggers WinActivation(), halting the ship, spawning multi-color confetti, saving the high score, and displaying "YOU WIN!".',
          'Lose & Restart: Hitting any non-wall obstacle sets dead = true, stops smoke, spawns explosion FX + SFX, disables the ship, saves the high score, and shows "GAME OVER" with RestartGame() scene reload.',
        ],
      },
      {
        heading: '2. Player Controls, Obstacles & Feedback',
        points: [
          'Controls (PlayerMovement.cs): Rotates smoothly toward world mouse position (turnSpeed = 220°/s); holding Left Mouse applies thrust = 12f clamped to maxSpeed = 6f.',
          'Obstacles & Walls (ObstacleMovement.cs / WallSound.cs): Launch at 3f ± 1f speed (min 0.1f); lower-numbered obstacle spawns contact sparks on collision; arena walls play SFX without destroying the ship.',
          'Proximity Warning Beep: Scans nearest active obstacle inside maxBeepDistance (8f), scaling pitch (0.8 → 2.0) and interval (0.75s → 0.08s) down to minBeepDistance (1.2f).',
          'Dynamic Trailing Smoke & WebGL Audio: Emits 18–48 particles/s opposite the velocity vector above motionThreshold (0.15f); GameManager unlocks AudioListener on first mouse, keyboard, or touch input for WebGL.',
        ],
      },
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/asteroid-survival.svg',
        alt: '2D Asteroid Survival Arcade Unity 6 WebGL system diagram',
      },
    ],
    theme: 'amber',
  },
  {
    id: 'sphere-runner',
    title: 'Sphere Runner — 3D Arcade Survival',
    category: 'GBC School',
    roles: ['Game Programmer', 'Game Designer'],
    context: 'George Brown College · GAME3121 Lab Test 2 · Unity 6 (URP / WebGL)',
    platforms: ['WebGL', 'PC'],
    overview:
      'Fast-paced 3D arcade survival game in Unity 6 (C#, URP, NavMeshAgent, WebGL) where you pilot a sphere to collect all 9 golden Pickup spheres while evading a relentless NavMesh chaser and avoiding >3s contact with electric outer boundary walls.',
    contributions: [
      'Engineered snappy camera-relative controls in PlayerController.cs (WASD/Arrows projected onto flattened camera XZ vectors, direct rb.linearVelocity at speed 10 preserving gravity) with a smooth Vector3.Lerp follow camera (C_camerafollow.cs, offset (0, 10, -10), smoothSpeed 5).',
      'Implemented relentless NavMeshAgent pursuit AI (E_EnemyChase.cs, stoppingDistance = 0, autoBraking = false) with an 8.0-unit proximity warning that sets IsNearPlayer and sine-pulses URP emission (pulseSpeed = 8.0).',
      'Built the 3-second OuterWall electric hazard timer with looping electricSound (BoundaryWallSound.cs), unscaled-time victory confetti (winCelebrationEffect), and GameUIManager.cs runtime UI fallback with live Enemy Speed (2.0–10.0) and Music Volume (0–100%) sliders.',
    ],
    mechanics: [
      {
        heading: 'Core Gameplay Loop',
        points: [
          'Title & Setup (GameUIManager.cs): PlayerController and EnemyChase start disabled behind the Title Screen (PLAY GAME, SETTINGS, QUIT GAME) while counting scene "Pickup" objects (9 golden spheres) to set scoreToWin.',
          'Active Play & Pause: Clicking PLAY GAME enables movement and AI at Time.timeScale = 1; pressing Escape or clicking PAUSE / MENU freezes time (Time.timeScale = 0) to adjust Enemy Speed or Music Volume mid-run.',
          'Victory & Defeat (PlayerController.cs): Collecting all Pickups stops BGM, disables the dust trail, spawns unscaled-time winCelebrationEffect confetti, plays winMusic, and freezes time. Touching the Enemy or lingering in an OuterWall trigger >3s triggers Game Over.',
        ],
      },
      {
        heading: 'Controls, AI & Hazards',
        points: [
          'Snappy Sphere & Dust Trail: Input.GetAxisRaw projects onto camera XZ vectors and overrides rb.linearVelocity directly (speed 10), emitting a directional cone of dust particles while sqrMagnitude > 0.05.',
          'NavMesh Chaser & Proximity Pulse (E_EnemyChase.cs): Updates agent.SetDestination(player.position) every frame; within 8.0 units, triggers IsNearPlayer and oscillates light-to-bright red URP emission.',
          'Electric Boundary & Runtime UI: Entering an "OuterWall" trigger starts touchStartTime and looping electricSound (cancelled on exit before 3s); GameUIManager auto-generates a black/white/orange Canvas fallback if panels are unassigned.',
        ],
      },
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/sphere-runner.svg',
        alt: 'Sphere Runner 3D arcade survival system diagram',
      },
    ],
    theme: 'emerald',
  },
  {
    id: 'atmospheric-horror',
    title: 'Atmospheric Indoor Horror & Spatial Audio',
    category: 'GBC School',
    roles: ['Audio & Lighting Programmer', 'Designer'],
    context: 'George Brown College · GAME3121 Lab Test 4 · Unity 6 (URP / Cinemachine)',
    platforms: ['WebGL', 'Desktop'],
    overview:
      'Atmospheric 3D indoor horror exploration and spatial audio showcase in Unity 6 (Audio_Indoor_Scene.unity) combining 8 layered AudioSources, timed coroutine fade-outs, dual-sine URP area-light flickering, and open-ended character/camera navigation.',
    contributions: [
      'Layered 8 AudioSources with looping background ambience (horror-ambience, thunderstorm-rain), one-shot army-marching cues, and SimpleDelayedAudio.cs coroutine fade-outs (startTime 0s/10s, 20s linear volume fade).',
      'Implemented dual-sine RealisticFlicker.cs (flickerSpeed + flickerSpeed * 0.7f around baseIntensity) on Area Light (1), plus a randomized LightFlicker.cs variant (0.1s–0.5s intervals).',
      'Integrated ThirdPersonController.cs + StarterAssetsInputs.cs (walk/sprint 2.0–5.335, crouch halving CharacterController height, jump/gravity -15.0) alongside SimpleCameraController.cs and Cinemachine pitch clamping.',
    ],
    mechanics: [
      {
        heading: 'Open-Ended Exploration Loop',
        points: [
          'Establish Atmosphere: Scene startup triggers looping horror-ambience and thunderstorm-rain, plays army-marching cues, and starts RealisticFlicker.cs on Area Light (1).',
          'Timed Audio Events (SimpleDelayedAudio.cs): horror-ambience-sound plays at startTime 0 and fades out over 20s; screaming sound waits 10s, plays screaming people, and linearly fades volume to 0 over 20s.',
          'Continuous Cycle: With no win/lose states or enemies, players freely move, observe flickering lighting, and react to spatial and timed audio cues.',
        ],
      },
      {
        heading: 'Movement, Camera & Lighting Systems',
        points: [
          'ThirdPersonController & Inputs: Supports smooth walk/sprint (2.0 / 5.335), grounded sphere-checked jump (JumpHeight 1.2, gravity -15.0), crouch height-halving, and Attack/Interact animator triggers.',
          'Camera Control: MainCamera uses SimpleCameraController.cs (WASD/Arrows, mouse look, scroll speed boost) with CinemachineCameraTarget pitch clamping (TopClamp 70, BottomClamp -30).',
          'Dynamic Lighting & Package Utilities: RealisticFlicker.cs drives organic dual-sine light instability on Area Light (1); project also includes LightFlicker.cs, FootstepManager.cs, BasicRigidBodyPush.cs, and CCManager.cs.',
        ],
      },
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/atmospheric-horror.svg',
        alt: 'Atmospheric Indoor Horror spatial audio and lighting diagram',
      },
    ],
    theme: 'violet',
  },
  {
    id: 'red-tide',
    title: 'Red Tide',
    category: 'GBC School',
    roles: ['Game Designer', 'Level Designer', 'Writer', 'Project Manager'],
    context: 'George Brown College · May 2025 – Present',
    overview:
      'Narrative-driven ecological adventure game following Ricky, a young ichthyologist stranded on a mysterious island with a robotic pigeon guide, uncovering the perilous Red Tide crisis.',
    contributions: [
      'Authored the Game Design Document (GDD), ecological narrative arc, and level layouts.',
      'Designed encounter pacing, environmental storytelling, and mission progression.',
      'Led sprint planning and Agile project management across the team.',
    ],
    link: {
      label: 'Project Showcase',
      url: 'https://www.roshanchristy-gamedesignerleveldesignerwriter.com/school-game-design-projects/redtide',
    },
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/red-tide.svg',
        alt: 'Red Tide ecological narrative adventure system diagram',
      },
    ],
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
    images: [
      {
        src: './images/systems/fair-fortunes.svg',
        alt: 'Fair Fortunes tarot and contraption puzzle system diagram',
      },
    ],
    theme: 'violet',
  },
  {
    id: 'syrup-safari',
    title: 'Syrup Safari - AR Cube Puzzle Game',
    category: 'GBC School',
    roles: ['Level Designer', 'Puzzle Designer'],
    context: 'George Brown College · Nov 2023 – Dec 2023 · Unity 3D',
    overview:
      'Vibrant cube-based puzzle game featuring fruit- and candy-themed levels built in Unity 3D, where players navigate mazes using color-coded pressure-sensitive switches and timed challenges.',
    contributions: [
      'Designed color-coded switch mechanics, pressure plates, and timed puzzle challenges.',
      'Architected maze layouts and strategic movement paths in Unity 3D.',
    ],
    badgeImage: './images/gbc-badge.png',
    images: [
      {
        src: './images/systems/syrup-safari.svg',
        alt: 'Syrup Safari AR cube puzzle system diagram',
      },
    ],
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
    images: [
      {
        src: './images/systems/temporal-nexus.svg',
        alt: 'Temporal Nexus 3-era causality toggle system diagram',
      },
    ],
    theme: 'sky',
  },
  {
    id: 'slide-n-ball',
    title: "Slide 'n Ball",
    category: 'Game Design',
    roles: ['Game Designer', 'Level Designer'],
    context: 'Ludonode Studios · Nov 2025 – Present',
    overview:
      'Kinetic physics puzzle game where players click and drag linked, colored platforms to create pathways for a launched ball, anticipating bounces to hit the red button target.',
    contributions: [
      'Authored the complete Game Design Document (GDD) and core platform-manipulation mechanics.',
      'Structured escalating spatial prediction and bounce-anticipation challenges.',
    ],
    link: {
      label: 'Game Design Document (GDD)',
      url: 'https://docs.google.com/document/d/1RGUxhvyyN-6owVgEYlwoJ3qacFtKlf0JX24Tj2LlvNc/edit?usp=sharing&usp=embed_facebook',
    },
    images: [
      {
        src: './images/systems/slide-n-ball.svg',
        alt: "Slide 'n Ball Game momentum and gravity-well loop diagram",
      },
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
    images: [
      {
        src: './images/systems/mirage-of-maravi.svg',
        alt: 'Mirage of Maravi faction and dialogue matrix diagram',
      },
    ],
    theme: 'amber',
  },
  {
    id: 'solaureus',
    title: 'Solaureus',
    category: 'Narrative & Worldbuilding',
    roles: ['Worldbuilder', 'Lore Architect'],
    context: 'George Brown College · Sep 2024 – Dec 2024',
    overview:
      'Worldbuilding group project featuring Welkin Legend, Welkin Security System, and Lamaria Legend—driven by celestial energy, solar dynastic guilds, and astronomical alchemy.',
    contributions: [
      'Developed comprehensive lore on geography, theological sects, and socio-economic caste systems.',
      'Co-authored Welkin Legend, Welkin Security System, and Lamaria Legend.',
    ],
    images: [
      {
        src: './images/systems/solaureus.svg',
        alt: 'Solaureus solar alchemy and guild system diagram',
      },
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
    id: 'beyond-photorealism',
    title: 'Beyond Photorealism: How Cohesive Art Direction and Custom Shaders Elevate Game Design',
    kind: 'Game Design Essay',
    summary:
      'Exploring how stylized shaders, cohesive color palettes, and intentional art direction create stronger visual identity and readability than raw photorealism.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/beyond-photorealism-how-cohesive-art-direction-and-custom-shaders-elevate-game-design-38bb05e63f38',
    theme: 'teal',
  },
  {
    id: 'emergent-gameplay',
    title: 'Designing Emergent Gameplay: How to Build Systems That Yield Unscripted Stories',
    kind: 'Game Design Essay',
    summary:
      'How to architect interlocking gameplay systems that generate memorable, unscripted player stories without breaking core game balance.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/designing-emergent-gameplay-how-to-build-systems-that-yield-unscripted-stories-without-breaking-01f0c043dc8c',
    theme: 'sky',
  },
  {
    id: 'directx12-scene-architecture',
    title: 'From Code to Castle: Mastering Scene Architecture in DirectX 12',
    kind: 'Game Design Essay',
    summary:
      'Technical breakdown of scene graph architecture, command lists, and rendering pipeline organization in DirectX 12.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/from-code-to-castle-mastering-scene-architecture-in-directx-12-4ac019303616',
    theme: 'emerald',
  },
  {
    id: 'invisible-tutorials',
    title: 'Invisible Tutorials: Designing the First Level of The Gardens Between',
    kind: 'Game Design Essay',
    summary:
      'Level design analysis of how The Gardens Between teaches time-manipulation mechanics purely through environmental affordances and pacing.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/invisible-tutorials-designing-the-first-level-of-the-gardens-between-06a21fe8d373',
    theme: 'amber',
  },
  {
    id: 'beyond-ragdolls',
    title: 'Beyond Ragdolls: Mastering “Weighted” Character Logic and Euphoria Physics',
    kind: 'Game Design Essay',
    summary:
      'Deep dive into procedural animation, active ragdoll balance, and how physics-driven character weight sells impact.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/beyond-ragdolls-mastering-weighted-character-logic-and-euphoria-physics-23290536dc4a',
    theme: 'rose',
  },
  {
    id: 'gtav-cloud-camera',
    title: 'The Illusion of Speed: How GTA V’s “Cloud Camera” Solves the Streaming Nightmare',
    kind: 'Game Design Essay',
    summary:
      'How Rockstar Games uses the sky-high character-switch transition to mask asynchronous world streaming and asset loading.',
    platform: 'Medium',
    url: 'https://ludonodestudios.medium.com/the-illusion-of-speed-how-gta-vs-cloud-camera-solves-the-streaming-nightmare-478976e4655e',
    theme: 'violet',
  },
  {
    id: 'cinco',
    title: 'Cinco: A Time Travel Short Story',
    kind: 'Short Story',
    summary:
      'A gripping temporal fiction exploring the paradox of 5-minute pre-cognition and time slips, the emotional consequences of trying to undo irreversible tragedies, and the psychological unraveling of destiny.',
    platform: 'Wattpad',
    url: 'https://www.wattpad.com/user/forge_de_recits',
    theme: 'violet',
  },
  {
    id: 'every-christmas-eve',
    title: 'Every Christmas Eve',
    kind: 'Short Story',
    summary:
      'Published on Wattpad (Dec 2021) — a story about a girl stuck in a time loop who uncovers deep truths about herself along the journey.',
    platform: 'Wattpad',
    url: 'https://www.wattpad.com/user/forge_de_recits',
    theme: 'rose',
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
    role: 'Peer Tutor (Accessible Learning Services)',
    organization: 'George Brown Polytechnic',
    location: 'Toronto, ON · Hybrid',
    period: 'Oct 2026 – Present',
    highlights:
      'Deliver one-on-one academic coaching across hybrid environments, breaking down complex programming and design concepts with Mutual Learning Agreements.',
    theme: 'sky',
  },
  {
    role: 'Game Writer',
    organization: 'Black Squirrels Studio',
    location: 'Toronto, ON · Hybrid',
    period: 'Jan 2026 – Present',
    highlights:
      'Edit and refine dialogue, redesign narrative elements around "show, don’t tell" principles, and integrate story beats with game designers.',
    theme: 'rose',
  },
  {
    role: 'Founder | Game Designer',
    organization: "Ludonode Studios (Roshan's Forge de Récits Inc.)",
    location: 'Toronto, ON · Remote',
    period: 'Jan 2025 – Present',
    highlights:
      'Lead creative direction, game concept design, GDD authoring, prototyping, and milestone planning for original interactive projects.',
    theme: 'violet',
  },
  {
    role: 'English Translator',
    organization: '4S Interpretation & Translation Services Inc.',
    location: 'Ontario, Canada · Hybrid',
    period: 'Jul 2024 – Dec 2024',
    highlights:
      'Delivered English translation, proofreading, and editing while preserving tone, context, and cultural nuance.',
    theme: 'teal',
  },
  {
    role: 'Server',
    organization: 'Markham Station Restaurant',
    location: 'Ontario, Canada · On-site',
    period: 'Sep 2023 – Present',
    highlights:
      'High-volume guest service, POS operations, kitchen/front-of-house coordination, and multitasking under pressure.',
    theme: 'emerald',
  },
  {
    role: 'Game Designer',
    organization: 'HFG Entertainments Private Limited',
    location: 'Chennai, India · On-site',
    period: 'Jan 2023 – May 2023',
    highlights:
      'Spearheaded level architecture, puzzle design, quest sequences, and UI wireframing for Grim of Legacy 2 (250+ levels) and Ally’s Adventure (170K+ downloads).',
    theme: 'amber',
  },
  {
    role: 'Content Editor (Internship)',
    organization: 'Cannibals Media',
    location: 'Pune District, India',
    period: 'Apr 2022 – May 2022',
    highlights:
      'Edited, proofread, fact-checked, and SEO-formatted digital articles, reviews, and blog posts.',
    theme: 'rose',
  },
  {
    role: 'Content Writer (Internship)',
    organization: 'DigitalImpulse Online Private Limited',
    location: 'India',
    period: 'Sep 2021 – Dec 2021',
    highlights:
      'Researched and authored SEO-targeted articles, blog posts, and web copy across client verticals.',
    theme: 'sky',
  },
];

export const EDUCATION = [
  {
    school: 'George Brown Polytechnic (George Brown College)',
    degree: 'Advanced Diploma, Game Programming',
    period: 'Sep 2025 – Aug 2027',
    detail: 'C++, C#, Unreal Engine, Unity, gameplay systems & software architecture.',
    theme: 'sky' as PastelTheme,
  },
  {
    school: 'George Brown Polytechnic (George Brown College)',
    degree: 'Postgraduate Degree, Screenwriting & Narrative Design',
    period: 'Sep 2024 – Aug 2025',
    detail: 'Ontario College Graduate Certificate in interactive narrative, dialogue & scripts.',
    theme: 'violet' as PastelTheme,
  },
  {
    school: 'George Brown Polytechnic (George Brown College)',
    degree: 'Graduate Certificate, Digital Design – Game Design',
    period: 'Sep 2023 – Sep 2024',
    detail: 'Game design principles, systems balancing, GDD authoring & prototyping.',
    theme: 'amber' as PastelTheme,
  },
  {
    school: 'Sathyabama Institute of Science & Technology, Chennai',
    degree: 'Bachelor of Technology (BTech), Information Technology',
    period: '2018 – 2022',
    detail: 'Programming, data structures, algorithms, databases & software development.',
    theme: 'emerald' as PastelTheme,
  },
  {
    school: 'ECT',
    degree: 'Certification, Advanced Content Writing',
    period: 'Oct 2021 – Dec 2021',
    detail: 'Digital content writing, copywriting & audience-focused storytelling.',
    theme: 'rose' as PastelTheme,
  },
];

export const CERTIFICATIONS = [
  { title: 'Cybersecurity at Work (2025)', issuer: 'LinkedIn', date: 'Nov 2026' },
  {
    title: 'Occupational Health And Safety Awareness',
    issuer: 'George Brown Polytechnic',
    date: 'Nov 2026',
  },
  { title: 'Prioritizing Effectively as a Leader', issuer: 'LinkedIn', date: 'Oct 2026' },
  { title: 'Sharpen your logic', issuer: 'LinkedIn', date: 'Apr 2026' },
  {
    title: 'Worker Health and Safety Awareness in 4 Steps',
    issuer: 'Ministry of Labour, Training and Skills Development',
    date: 'Mar 2026',
  },
  {
    title: 'Verified International Academic Qualifications',
    issuer: 'World Education Services (WES)',
    date: 'Nov 2025',
  },
  { title: 'Will Wright: Game Design and Theory', issuer: 'MasterClass', date: '' },
  { title: 'James Cameron: Filmmaking', issuer: 'MasterClass', date: '' },
  { title: 'John Douglas: How to Think Like an FBI Profiler', issuer: 'MasterClass', date: '' },
  { title: 'The Art of Intelligence with Former CIA Officers', issuer: 'MasterClass', date: '' },
];

export const LANGUAGES = [
  { name: 'English', proficiency: 'Full professional proficiency' },
  { name: 'Tamil', proficiency: 'Native or bilingual proficiency' },
];

export const SKILLS = [
  {
    group: 'Programming & Engines',
    theme: 'sky' as PastelTheme,
    items: [
      'C++',
      'C#',
      'Python',
      'Unreal Engine 5.8',
      'Unity 6',
      'Data Structures',
      'Databases',
    ],
  },
  {
    group: 'Game, Level & Narrative',
    theme: 'rose' as PastelTheme,
    items: [
      'Game & Puzzle Design',
      'Level Design',
      'Wireframing',
      'Storytelling',
      'Dialogue Editing',
      'Screenwriting',
      'Yarn Spinner / Twine',
      'SEO & Copywriting',
    ],
  },
  {
    group: 'Leadership & Tools',
    theme: 'emerald' as PastelTheme,
    items: [
      'Project Management',
      'Agile / Jira / Trello',
      'Academic Coaching',
      'Translation & Proofreading',
    ],
  },
];
