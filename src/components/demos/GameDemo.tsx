import { Gamepad2 } from 'lucide-react';
import { PASTEL_THEME } from '../../utils/theme';
import {
  AsteroidSurvivalDemo,
  LiveWireDemo,
  SphereRunnerDemo,
  TrapRoomsDemo,
} from './ArcadeDemos';
import {
  AtmosphericHorrorDemo,
  SlideNBallDemo,
  SyrupSafariDemo,
  TemporalNexusDemo,
  TicTacToeDemo,
} from './PuzzleAndAudioDemos';

const DEMO_PROJECT_IDS = new Set([
  'asteroid-survival',
  'sphere-runner',
  'live-wire',
  'trap-rooms',
  'multiplayer-tic-tac-toe',
  'slide-n-ball',
  'temporal-nexus',
  'syrup-safari',
  'atmospheric-horror',
]);

export function hasGameDemo(projectId: string): boolean {
  return DEMO_PROJECT_IDS.has(projectId);
}

interface GameDemoProps {
  projectId: string;
  theme: keyof typeof PASTEL_THEME;
  onPlayingChange?: (playing: boolean) => void;
}

/**
 * Renders an interactive, playable browser mini-demo for supported game projects.
 */
export function GameDemo({ projectId, theme, onPlayingChange }: GameDemoProps) {
  if (!hasGameDemo(projectId)) return null;

  const palette = PASTEL_THEME[theme];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <Gamepad2 className={`h-4 w-4 ${palette.accentText}`} />
        <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Interactive Gameplay Demo
        </h4>
      </div>

      <div className={`mt-3 rounded-2xl border ${palette.border} bg-white/80 p-4`}>
        {projectId === 'asteroid-survival' && (
          <AsteroidSurvivalDemo onPlayingChange={onPlayingChange} />
        )}
        {projectId === 'sphere-runner' && (
          <SphereRunnerDemo onPlayingChange={onPlayingChange} />
        )}
        {projectId === 'live-wire' && (
          <LiveWireDemo onPlayingChange={onPlayingChange} />
        )}
        {projectId === 'trap-rooms' && (
          <TrapRoomsDemo onPlayingChange={onPlayingChange} />
        )}
        {projectId === 'multiplayer-tic-tac-toe' && <TicTacToeDemo />}
        {projectId === 'slide-n-ball' && <SlideNBallDemo />}
        {projectId === 'temporal-nexus' && <TemporalNexusDemo />}
        {projectId === 'syrup-safari' && <SyrupSafariDemo />}
        {projectId === 'atmospheric-horror' && (
          <AtmosphericHorrorDemo onPlayingChange={onPlayingChange} />
        )}
      </div>
    </div>
  );
}
