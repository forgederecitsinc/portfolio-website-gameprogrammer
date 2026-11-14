import { useRef, useState } from 'react';
import { Gamepad2, Maximize2, Minimize2 } from 'lucide-react';
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
 * Renders an interactive, playable browser mini-demo for supported game projects,
 * complete with a Fullscreen Launcher for WebGL-style instant play.
 */
export function GameDemo({ projectId, theme, onPlayingChange }: GameDemoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!hasGameDemo(projectId)) return null;

  const palette = PASTEL_THEME[theme];

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // ignore fullscreen restrictions
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gamepad2 className={`h-4 w-4 ${palette.accentText}`} />
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Interactive Gameplay Demo · Instant Play
          </h4>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-[#16161B] dark:text-slate-200 dark:hover:bg-white/10"
        >
          {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`mt-3 rounded-2xl border ${palette.border} bg-[#16161B] p-4`}
      >
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
