import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface DemoProps {
  onPlayingChange?: (playing: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* 5. Multiplayer Tic-Tac-Toe (Client-Server Authoritative Demo)              */
/* -------------------------------------------------------------------------- */
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Array<'X' | 'O' | null>): 'X' | 'O' | 'DRAW' | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell !== null)) return 'DRAW';
  return null;
}

export function TicTacToeDemo() {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [vsBot, setVsBot] = useState(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'DRAW' | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '[SERVER] Room #402 ready · Turn: X',
  ]);

  const pushLog = (msg: string) =>
    setLogs((prev) => [msg, ...prev].slice(0, 6));

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    pushLog('[SERVER] REMATCH_ACCEPTED · Board reset · Turn: X');
  };

  const applyMove = (idx: number, actor: 'X' | 'O', currentBoard: Array<'X' | 'O' | null>) => {
    if (currentBoard[idx] !== null) {
      pushLog(`[SERVER] MOVE_ERROR: Cell ${idx} occupied`);
      return;
    }
    const next = [...currentBoard];
    next[idx] = actor;
    const res = checkWinner(next);
    setBoard(next);
    if (res) {
      setWinner(res);
      pushLog(
        res === 'DRAW'
          ? `[SERVER] MOVE_RESULT ${actor}@${idx} → GAME_OVER (DRAW)`
          : `[SERVER] MOVE_RESULT ${actor}@${idx} → GAME_OVER (WINNER: ${res})`
      );
      return;
    }
    const nextTurn = actor === 'X' ? 'O' : 'X';
    setTurn(nextTurn);
    pushLog(`[SERVER] MOVE_RESULT ${actor}@${idx} → Turn: ${nextTurn}`);

    if (vsBot && nextTurn === 'O') {
      setTimeout(() => {
        const empty = next
          .map((v, i) => (v === null ? i : -1))
          .filter((i) => i !== -1);
        if (empty.length === 0) return;
        const pick = empty[Math.floor(Math.random() * empty.length)];
        const botBoard = [...next];
        botBoard[pick] = 'O';
        const botRes = checkWinner(botBoard);
        setBoard(botBoard);
        if (botRes) {
          setWinner(botRes);
          pushLog(
            botRes === 'DRAW'
              ? `[SERVER] MOVE_RESULT O@${pick} → GAME_OVER (DRAW)`
              : `[SERVER] MOVE_RESULT O@${pick} → GAME_OVER (WINNER: ${botRes})`
          );
        } else {
          setTurn('X');
          pushLog(`[SERVER] MOVE_RESULT O@${pick} → Turn: X`);
        }
      }, 280);
    }
  };

  const handleCell = (idx: number) => {
    if (winner) return;
    if (vsBot && turn === 'O') {
      pushLog('[SERVER] MOVE_ERROR: Not your turn (waiting for O)');
      return;
    }
    pushLog(`[CLIENT] MOVE cell=${idx} player=${turn}`);
    applyMove(idx, turn, board);
  };

  return (
    <div className="grid gap-4 rounded-xl border border-slate-300/80 bg-slate-900 p-4 text-slate-100 sm:grid-cols-[200px_1fr]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex w-full items-center justify-between text-xs font-mono">
          <span className="text-sky-300">
            {winner
              ? winner === 'DRAW'
                ? 'MATCH: DRAW'
                : `WINNER: ${winner}`
              : `TURN: ${turn}`}
          </span>
          <button
            type="button"
            onClick={() => {
              setVsBot((v) => !v);
              reset();
            }}
            className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-slate-700"
          >
            {vsBot ? 'vs Bot (O)' : 'Local 2P'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {board.map((cell, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCell(idx)}
              className={`flex h-14 w-14 items-center justify-center rounded-lg border text-xl font-bold transition ${
                cell === 'X'
                  ? 'border-sky-400/50 bg-sky-500/20 text-sky-300'
                  : cell === 'O'
                    ? 'border-rose-400/50 bg-rose-500/20 text-rose-300'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
        >
          <RotateCcw className="h-3 w-3" />
          Rematch
        </button>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Authoritative Server Packet Log
          </p>
          <div className="mt-1.5 h-32 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px]">
            {logs.map((entry, i) => (
              <div
                key={`${i}-${entry}`}
                className={
                  entry.includes('ERROR')
                    ? 'text-rose-400'
                    : entry.includes('WINNER')
                      ? 'text-emerald-400'
                      : entry.includes('CHAT')
                        ? 'text-amber-300'
                        : 'text-slate-300'
                }
              >
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Quick-Chat:</span>
          {['Good luck!', 'Nice move!', 'GG!'].map((msg) => (
            <button
              key={msg}
              type="button"
              onClick={() => pushLog(`[CHAT] ${turn}: "${msg}"`)}
              className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-200 hover:bg-slate-700"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Slide 'n Ball (Draggable Platform Bounce Puzzle)                        */
/* -------------------------------------------------------------------------- */
export function SlideNBallDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [launched, setLaunched] = useState(false);
  const [won, setWon] = useState(false);

  const stateRef = useRef({
    launched: false,
    won: false,
    ball: { x: 65, y: 36, vx: 68, vy: 0, r: 9 },
    platforms: [
      { x: 130, y: 155, w: 96, h: 12, angle: 0.24, color: '#34d399' },
      { x: 295, y: 185, w: 96, h: 12, angle: -0.22, color: '#38bdf8' },
    ],
    draggingIdx: -1,
    dragOffset: { x: 0, y: 0 },
    target: { x: 465, y: 110, r: 16 },
  });

  const resetBall = (launchNow: boolean) => {
    stateRef.current.ball = { x: 65, y: 36, vx: 75, vy: 0, r: 9 };
    stateRef.current.launched = launchNow;
    stateRef.current.won = false;
    setLaunched(launchNow);
    setWon(false);
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000);
      last = now;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const s = stateRef.current;

      if (canvas && ctx) {
        if (s.launched && !s.won) {
          s.ball.vy += 320 * dt;
          s.ball.x += s.ball.vx * dt;
          s.ball.y += s.ball.vy * dt;

          // Bounce off platforms
          for (const p of s.platforms) {
            const dx = s.ball.x - p.x;
            const dy = s.ball.y - p.y;
            const cos = Math.cos(-p.angle);
            const sin = Math.sin(-p.angle);
            const lx = dx * cos - dy * sin;
            const ly = dx * sin + dy * cos;

            if (Math.abs(lx) <= p.w / 2 + s.ball.r && Math.abs(ly) <= p.h / 2 + s.ball.r) {
              const nx = Math.sin(p.angle);
              const ny = -Math.cos(p.angle);
              const dot = s.ball.vx * nx + s.ball.vy * ny;
              if (dot < 0) {
                s.ball.vx = (s.ball.vx - 2 * dot * nx) * 0.92;
                s.ball.vy = (s.ball.vy - 2 * dot * ny) * 0.92;
                s.ball.x += nx * 4;
                s.ball.y += ny * 4;
              }
            }
          }

          // Target check
          if (Math.hypot(s.ball.x - s.target.x, s.ball.y - s.target.y) < s.target.r + s.ball.r) {
            s.won = true;
            s.launched = false;
            setWon(true);
            setLaunched(false);
          }

          // Out of bounds reset
          if (s.ball.y > 275 || s.ball.x > 535 || s.ball.x < -15) {
            s.launched = false;
            setLaunched(false);
          }
        }

        // Draw
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 520, 240);

        // Launcher chute
        ctx.fillStyle = '#334155';
        ctx.fillRect(46, 12, 38, 12);

        // Target Red Button
        ctx.fillStyle = s.won ? '#22c55e' : '#ef4444';
        ctx.beginPath();
        ctx.arc(s.target.x, s.target.y, s.target.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fecaca';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(s.won ? 'HIT!' : 'TARGET', s.target.x, s.target.y + 3);

        // Draggable platforms
        for (const p of s.platforms) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }

        // Ball
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 520,
      y: ((e.clientY - rect.top) / rect.height) * 240,
    };
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-300">
          {won
            ? 'Target Hit! Nice trajectory!'
            : 'Drag the colored platforms, then Launch Ball to hit the red target.'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => resetBall(true)}
            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            {launched ? 'Relaunch' : 'Launch Ball'}
          </button>
          <button
            type="button"
            onClick={() => resetBall(false)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={520}
        height={240}
        onPointerDown={(e) => {
          const pt = toCanvas(e);
          const idx = stateRef.current.platforms.findIndex(
            (p) => Math.hypot(pt.x - p.x, pt.y - p.y) < 55
          );
          if (idx !== -1) {
            stateRef.current.draggingIdx = idx;
            stateRef.current.dragOffset = {
              x: stateRef.current.platforms[idx].x - pt.x,
              y: stateRef.current.platforms[idx].y - pt.y,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          const idx = stateRef.current.draggingIdx;
          if (idx === -1) return;
          const pt = toCanvas(e);
          stateRef.current.platforms[idx].x = Math.max(60, Math.min(460, pt.x + stateRef.current.dragOffset.x));
          stateRef.current.platforms[idx].y = Math.max(45, Math.min(220, pt.y + stateRef.current.dragOffset.y));
        }}
        onPointerUp={() => {
          stateRef.current.draggingIdx = -1;
        }}
        className="block w-full cursor-grab rounded-lg border border-slate-700/70 bg-slate-950 active:cursor-grabbing"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Temporal Nexus (3-Era Causality Toggle Puzzle)                          */
/* -------------------------------------------------------------------------- */
type Era = 'past' | 'present' | 'future';

export function TemporalNexusDemo() {
  const [era, setEra] = useState<Era>('past');
  const [pos, setPos] = useState(0); // 0..4 columns
  const won = pos === 4;

  // Column passability rules per era:
  // Col 0: Start (always safe)
  // Col 1: Bridge intact in Past & Future rubble; gap in Present
  // Col 2: Laser gate active in Past; broken/off in Present & Future
  // Col 3: Intact platform in Past & Present; collapsed in Future
  // Col 4: Goal Exit (always safe)
  const isBlocked = (col: number, currentEra: Era) => {
    if (col === 1 && currentEra === 'present') return true;
    if (col === 2 && currentEra === 'past') return true;
    if (col === 3 && currentEra === 'future') return true;
    return false;
  };

  const step = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(4, pos + dir));
    if (!isBlocked(next, era)) {
      setPos(next);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-300/80 bg-slate-900 p-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {(['past', 'present', 'future'] as Era[]).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                if (!isBlocked(pos, e)) setEra(e);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                era === e
                  ? 'bg-sky-400 text-slate-950'
                  : isBlocked(pos, e)
                    ? 'cursor-not-allowed bg-slate-800/50 text-slate-500'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {e === 'past' ? 'Past (Pristine)' : e === 'present' ? 'Present (Degraded)' : 'Future (Ruined)'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setEra('past');
            setPos(0);
          }}
          className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((col) => {
          const blocked = isBlocked(col, era);
          const hasPlayer = pos === col;
          const label =
            col === 0
              ? 'Start'
              : col === 1
                ? era === 'present'
                  ? 'Gap'
                  : era === 'past'
                    ? 'Bridge'
                    : 'Rubble'
                : col === 2
                  ? era === 'past'
                    ? 'Laser'
                    : 'Gate Off'
                  : col === 3
                    ? era === 'future'
                      ? 'Collapsed'
                      : 'Catwalk'
                    : 'Exit';

          return (
            <div
              key={col}
              className={`flex h-20 flex-col items-center justify-between rounded-lg border p-2 text-center text-xs ${
                col === 4
                  ? 'border-emerald-400/60 bg-emerald-950/50'
                  : blocked
                    ? 'border-rose-500/60 bg-rose-950/50 text-rose-300'
                    : 'border-slate-700 bg-slate-800/80'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400">{label}</span>
              {hasPlayer ? (
                <span className="h-5 w-5 rounded-full bg-sky-400 ring-4 ring-sky-400/30" />
              ) : (
                <span className="h-5 w-5" />
              )}
              <span className="text-[10px] text-slate-500">Col {col + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-300">
          {won
            ? 'Paradox Solved! Reached Exit across 3 eras.'
            : 'Toggle eras to shift bridges & laser gates, then step across.'}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold hover:bg-slate-700"
          >
            ◀ Step Left
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-sky-400"
          >
            Step Right ▶
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Syrup Safari (Color-Coded Switch Maze)                                  */
/* -------------------------------------------------------------------------- */
export function SyrupSafariDemo() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [amberOpen, setAmberOpen] = useState(false);
  const [roseOpen, setRoseOpen] = useState(false);

  const won = pos.x === 4 && pos.y === 3;

  const move = (dx: number, dy: number) => {
    if (won) return;
    const nx = Math.max(0, Math.min(4, pos.x + dx));
    const ny = Math.max(0, Math.min(3, pos.y + dy));
    // Walls & color-coded gates
    if (nx === 2 && ny === 0 && !amberOpen) return;
    if (nx === 3 && ny === 2 && !roseOpen) return;
    if ((nx === 1 && ny === 1) || (nx === 2 && ny === 2)) return;

    setPos({ x: nx, y: ny });
    if (nx === 0 && ny === 3) setAmberOpen(true);
    if (nx === 4 && ny === 0) setRoseOpen(true);
  };

  const reset = () => {
    setPos({ x: 0, y: 0 });
    setAmberOpen(false);
    setRoseOpen(false);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-300/80 bg-slate-900 p-4 text-slate-100">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-amber-300">
          {won ? 'STAGE CLEAR!' : 'Step on Amber & Rose pressure plates to unlock gates'}
        </span>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 20 }, (_, idx) => {
          const x = idx % 5;
          const y = Math.floor(idx / 5);
          const isPlayer = pos.x === x && pos.y === y;
          const isWall = (x === 1 && y === 1) || (x === 2 && y === 2);
          const isAmberSwitch = x === 0 && y === 3;
          const isRoseSwitch = x === 4 && y === 0;
          const isAmberGate = x === 2 && y === 0;
          const isRoseGate = x === 3 && y === 2;
          const isGoal = x === 4 && y === 3;

          return (
            <div
              key={`${x}-${y}`}
              className={`flex h-11 items-center justify-center rounded-md border text-[10px] font-mono ${
                isWall
                  ? 'border-slate-700 bg-slate-950 text-slate-600'
                  : isAmberGate && !amberOpen
                    ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                    : isRoseGate && !roseOpen
                      ? 'border-rose-400 bg-rose-950/60 text-rose-300'
                      : isGoal
                        ? 'border-emerald-400 bg-emerald-950/50 text-emerald-300'
                        : 'border-slate-700/80 bg-slate-800/70 text-slate-400'
              }`}
            >
              {isPlayer ? (
                <span className="h-5 w-5 rounded bg-sky-400 shadow" />
              ) : isWall ? (
                'WALL'
              ) : isAmberSwitch ? (
                'AMB SW'
              ) : isRoseSwitch ? (
                'ROSE SW'
              ) : isAmberGate && !amberOpen ? (
                'LOCKED'
              ) : isRoseGate && !roseOpen ? (
                'LOCKED'
              ) : isGoal ? (
                'EXIT'
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button type="button" onClick={() => move(-1, 0)} className="rounded bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700">◀</button>
        <button type="button" onClick={() => move(0, -1)} className="rounded bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700">▲</button>
        <button type="button" onClick={() => move(0, 1)} className="rounded bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700">▼</button>
        <button type="button" onClick={() => move(1, 0)} className="rounded bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700">▶</button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. Atmospheric Indoor Horror (Dual-Sine Flicker + Spatial WebAudio)        */
/* -------------------------------------------------------------------------- */
export function AtmosphericHorrorDemo({ onPlayingChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const [intensityReadout, setIntensityReadout] = useState(1.0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const stateRef = useRef({
    player: { x: 130, y: 125 },
    light: { x: 350, y: 110 },
    keys: { up: false, down: false, left: false, right: false },
  });

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      droneGainRef.current = null;
    }
    setAudioOn(false);
  };

  const toggleAudio = () => {
    if (audioOn) {
      stopAudio();
      return;
    }
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 55;
      gain.gain.value = 0.04;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      droneGainRef.current = gain;
      setAudioOn(true);
    } catch {
      setAudioOn(false);
    }
  };

  const triggerDelayedCue = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 2.2);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.25);
  };

  useEffect(() => {
    return () => {
      stopAudio();
      onPlayingChange?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') stateRef.current.keys.up = down;
      else if (k === 's' || e.key === 'ArrowDown') stateRef.current.keys.down = down;
      else if (k === 'a' || e.key === 'ArrowLeft') stateRef.current.keys.left = down;
      else if (k === 'd' || e.key === 'ArrowRight') stateRef.current.keys.right = down;
    };
    const kd = (e: KeyboardEvent) => mapKey(e, true);
    const ku = (e: KeyboardEvent) => mapKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const s = stateRef.current;

      if (canvas && ctx) {
        let dx = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
        let dy = (s.keys.down ? 1 : 0) - (s.keys.up ? 1 : 0);
        const mag = Math.hypot(dx, dy);
        if (mag > 0) {
          dx /= mag;
          dy /= mag;
          s.player.x = Math.max(20, Math.min(500, s.player.x + dx * 120 * dt));
          s.player.y = Math.max(20, Math.min(200, s.player.y + dy * 120 * dt));
        }

        // Dual-sine RealisticFlicker
        const t = now / 1000;
        const flickerSpeed = 6.5;
        const intensity = Math.max(
          0.15,
          1.0 + Math.sin(t * flickerSpeed) * 0.45 + Math.sin(t * flickerSpeed * 0.7) * 0.3
        );
        setIntensityReadout(Number(intensity.toFixed(2)));

        // Spatial volume attenuation based on distance to Area Light / Sound Source
        const dist = Math.hypot(s.player.x - s.light.x, s.player.y - s.light.y);
        const atten = Math.max(0.05, 1 - dist / 420);
        if (droneGainRef.current && audioCtxRef.current) {
          droneGainRef.current.gain.setTargetAtTime(0.06 * atten, audioCtxRef.current.currentTime, 0.05);
        }

        // Draw dark room
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, 520, 220);

        // Flickering Area Light (1) radial gradient
        const grad = ctx.createRadialGradient(
          s.light.x,
          s.light.y,
          8,
          s.light.x,
          s.light.y,
          155 * intensity
        );
        grad.addColorStop(0, `rgba(251, 191, 36, ${0.42 * Math.min(1, intensity)})`);
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 520, 220);

        // Area Light source
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(s.light.x, s.light.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px monospace';
        ctx.fillText('Area Light (1) · Spatial Source', s.light.x - 85, s.light.y - 14);

        // Player
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Attenuation: ${Math.round(atten * 100)}%`, 12, 20);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-amber-300">
          FLICKER INTENSITY: {intensityReadout}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              audioOn ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-white'
            }`}
          >
            {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            {audioOn ? 'Spatial Audio ON' : 'Enable Spatial Audio'}
          </button>
          {audioOn && (
            <button
              type="button"
              onClick={triggerDelayedCue}
              className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-amber-300"
            >
              Trigger Fade Cue
            </button>
          )}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={520}
        height={220}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.player.x = ((e.clientX - rect.left) / rect.width) * 520;
          stateRef.current.player.y = ((e.clientY - rect.top) / rect.height) * 220;
        }}
        className="block w-full cursor-pointer rounded-lg border border-slate-700/70 bg-slate-950"
      />
      <p className="text-[11px] text-slate-500">
        Move with WASD/Arrows or click anywhere in the room to test distance-based audio attenuation and dual-sine Area Light flickering.
      </p>
    </div>
  );
}
