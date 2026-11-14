import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface DemoProps {
  onPlayingChange?: (playing: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* 1. 2D Asteroid Survival (Lab Test 3)                                       */
/* -------------------------------------------------------------------------- */
export function AsteroidSurvivalDemo({ onPlayingChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('LabTest3HighScore') || '0');
    } catch {
      return 0;
    }
  });
  const [radarLevel, setRadarLevel] = useState<'SAFE' | 'NEAR' | 'CRITICAL'>('SAFE');

  const stateRef = useRef<{
    playing: boolean;
    ship: { x: number; y: number; vx: number; vy: number; angle: number };
    mouse: { x: number; y: number; down: boolean };
    spaceDown: boolean;
    score: number;
    obstacles: Array<{ x: number; y: number; vx: number; vy: number; r: number }>;
    particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string; r: number }>;
  }>({
    playing: false,
    ship: { x: 260, y: 130, vx: 0, vy: 0, angle: -Math.PI / 2 },
    mouse: { x: 260, y: 50, down: false },
    spaceDown: false,
    score: 0,
    obstacles: [],
    particles: [],
  });

  const resetGame = (startNow: boolean) => {
    const obstacles = Array.from({ length: 5 }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      const spd = 75 + Math.random() * 65;
      const edgeX = i % 2 === 0 ? 45 + Math.random() * 90 : 385 + Math.random() * 90;
      const edgeY = i < 3 ? 35 + Math.random() * 60 : 170 + Math.random() * 60;
      return {
        x: edgeX,
        y: edgeY,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        r: 11 + (i % 2) * 3,
      };
    });

    stateRef.current = {
      playing: startNow,
      ship: { x: 260, y: 130, vx: 0, vy: 0, angle: -Math.PI / 2 },
      mouse: { x: 260, y: 60, down: false },
      spaceDown: false,
      score: 0,
      obstacles,
      particles: [],
    };
    setScore(0);
    setRadarLevel('SAFE');
    setStatus(startNow ? 'playing' : 'ready');
    onPlayingChange?.(startNow);
  };

  useEffect(() => {
    resetGame(false);
    return () => onPlayingChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!stateRef.current.playing) return;
      if (e.code === 'Space') {
        e.preventDefault();
        stateRef.current.spaceDown = true;
      }
      if (e.key === 'w' || e.key === 'W') {
        // Test win shortcut from PlayerMovement.cs
        stateRef.current.score = 300;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') stateRef.current.spaceDown = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
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
        if (s.playing) {
          // Rotate ship toward mouse at 220 deg/s
          const targetAngle = Math.atan2(s.mouse.y - s.ship.y, s.mouse.x - s.ship.x);
          let diff = targetAngle - s.ship.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const maxTurn = ((220 * Math.PI) / 180) * dt;
          s.ship.angle += Math.max(-maxTurn, Math.min(maxTurn, diff));

          // Thrust
          if (s.mouse.down || s.spaceDown) {
            s.ship.vx += Math.cos(s.ship.angle) * 280 * dt;
            s.ship.vy += Math.sin(s.ship.angle) * 280 * dt;
            if (Math.random() < 0.7) {
              s.particles.push({
                x: s.ship.x - Math.cos(s.ship.angle) * 12,
                y: s.ship.y - Math.sin(s.ship.angle) * 12,
                vx: -Math.cos(s.ship.angle) * 45 + (Math.random() - 0.5) * 25,
                vy: -Math.sin(s.ship.angle) * 45 + (Math.random() - 0.5) * 25,
                life: 0.45,
                color: '#cbd5e1',
                r: 3.5,
              });
            }
          }

          s.ship.vx *= 0.985;
          s.ship.vy *= 0.985;
          s.ship.x = Math.max(16, Math.min(504, s.ship.x + s.ship.vx * dt));
          s.ship.y = Math.max(16, Math.min(244, s.ship.y + s.ship.vy * dt));
          if (s.ship.x <= 16 || s.ship.x >= 504) s.ship.vx *= -0.5;
          if (s.ship.y <= 16 || s.ship.y >= 244) s.ship.vy *= -0.5;

          // Obstacles + wall sparks
          let minDist = Infinity;
          for (const ob of s.obstacles) {
            ob.x += ob.vx * dt;
            ob.y += ob.vy * dt;
            let hitWall = false;
            if (ob.x - ob.r < 8) {
              ob.x = 8 + ob.r;
              ob.vx = Math.abs(ob.vx);
              hitWall = true;
            } else if (ob.x + ob.r > 512) {
              ob.x = 512 - ob.r;
              ob.vx = -Math.abs(ob.vx);
              hitWall = true;
            }
            if (ob.y - ob.r < 8) {
              ob.y = 8 + ob.r;
              ob.vy = Math.abs(ob.vy);
              hitWall = true;
            } else if (ob.y + ob.r > 252) {
              ob.y = 252 - ob.r;
              ob.vy = -Math.abs(ob.vy);
              hitWall = true;
            }
            if (hitWall) {
              for (let k = 0; k < 4; k++) {
                s.particles.push({
                  x: ob.x,
                  y: ob.y,
                  vx: (Math.random() - 0.5) * 90,
                  vy: (Math.random() - 0.5) * 90,
                  life: 0.35,
                  color: '#fbbf24',
                  r: 2,
                });
              }
            }

            const d = Math.hypot(ob.x - s.ship.x, ob.y - s.ship.y);
            minDist = Math.min(minDist, d - ob.r);
            if (d < ob.r + 9) {
              s.playing = false;
              for (let k = 0; k < 18; k++) {
                const a = Math.random() * Math.PI * 2;
                const spd = 40 + Math.random() * 110;
                s.particles.push({
                  x: s.ship.x,
                  y: s.ship.y,
                  vx: Math.cos(a) * spd,
                  vy: Math.sin(a) * spd,
                  life: 0.7,
                  color: k % 2 === 0 ? '#f97316' : '#ef4444',
                  r: 3,
                });
              }
              const finalScore = Math.floor(s.score);
              setScore(finalScore);
              setHighScore((prev) => {
                const next = Math.max(prev, finalScore);
                try {
                  localStorage.setItem('LabTest3HighScore', String(next));
                } catch {
                  // ignore storage errors
                }
                return next;
              });
              setStatus('lost');
              onPlayingChange?.(false);
            }
          }

          if (s.playing) {
            setRadarLevel(minDist < 48 ? 'CRITICAL' : minDist < 90 ? 'NEAR' : 'SAFE');
            s.score += 10 * dt;
            const rounded = Math.floor(s.score);
            setScore(rounded);
            if (s.score >= 300) {
              s.playing = false;
              for (let k = 0; k < 32; k++) {
                const a = Math.random() * Math.PI * 2;
                const spd = 50 + Math.random() * 120;
                const colors = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6'];
                s.particles.push({
                  x: s.ship.x,
                  y: s.ship.y,
                  vx: Math.cos(a) * spd,
                  vy: Math.sin(a) * spd,
                  life: 1.1,
                  color: colors[k % colors.length],
                  r: 3.5,
                });
              }
              setScore(300);
              setHighScore((prev) => {
                const next = Math.max(prev, 300);
                try {
                  localStorage.setItem('LabTest3HighScore', String(next));
                } catch {
                  // ignore
                }
                return next;
              });
              setStatus('won');
              onPlayingChange?.(false);
            }
          }
        }

        // Update particles
        s.particles = s.particles.filter((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          return p.life > 0;
        });

        // Draw background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 520, 260);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(6, 6, 508, 248);

        // Grid
        ctx.strokeStyle = 'rgba(148,163,184,0.08)';
        ctx.lineWidth = 1;
        for (let x = 40; x < 520; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 8);
          ctx.lineTo(x, 252);
          ctx.stroke();
        }
        for (let y = 40; y < 260; y += 40) {
          ctx.beginPath();
          ctx.moveTo(8, y);
          ctx.lineTo(512, y);
          ctx.stroke();
        }

        // Particles
        for (const p of s.particles) {
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Obstacles
        for (const ob of s.obstacles) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Ship
        if (status !== 'lost') {
          ctx.save();
          ctx.translate(s.ship.x, s.ship.y);
          ctx.rotate(s.ship.angle);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(13, 0);
          ctx.lineTo(-9, -8);
          ctx.lineTo(-5, 0);
          ctx.lineTo(-9, 8);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onPlayingChange, status]);

  const updateMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    stateRef.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 520;
    stateRef.current.mouse.y = ((e.clientY - rect.top) / rect.height) * 260;
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="rounded bg-slate-900 px-2 py-0.5 text-amber-300">
            SCORE: {score} / 300
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-200">
            HIGH: {highScore}
          </span>
          <span
            className={`rounded px-2 py-0.5 font-semibold ${
              radarLevel === 'CRITICAL'
                ? 'bg-rose-600 text-white'
                : radarLevel === 'NEAR'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-700 text-emerald-100'
            }`}
          >
            RADAR: {radarLevel}
          </span>
        </div>
        <button
          type="button"
          onClick={() => resetGame(true)}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          {status === 'ready' ? 'Start Demo' : 'Restart'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={520}
          height={260}
          onMouseMove={updateMouse}
          onMouseDown={(e) => {
            updateMouse(e);
            stateRef.current.mouse.down = true;
            if (status === 'ready') resetGame(true);
          }}
          onMouseUp={() => {
            stateRef.current.mouse.down = false;
          }}
          onMouseLeave={() => {
            stateRef.current.mouse.down = false;
          }}
          className="block w-full cursor-crosshair select-none"
        />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 p-4 text-center">
            <p className="font-serif text-lg font-semibold text-white">
              {status === 'won'
                ? 'YOU WIN! (300 pts Survived)'
                : status === 'lost'
                  ? `GAME OVER — Score: ${score}`
                  : '2D Asteroid Survival'}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Aim with Mouse (220°/s), Hold Click or Space to Thrust, Dodge Bouncing Obstacles
            </p>
            <button
              type="button"
              onClick={() => resetGame(true)}
              className="mt-3 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300"
            >
              {status === 'ready' ? 'Play Demo' : 'Play Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Sphere Runner (Lab Test 2)                                              */
/* -------------------------------------------------------------------------- */
export function SphereRunnerDemo({ onPlayingChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [lostReason, setLostReason] = useState('');
  const [score, setScore] = useState(0);
  const [wallTimer, setWallTimer] = useState(0);

  const stateRef = useRef({
    playing: false,
    player: { x: 260, y: 130 },
    enemy: { x: 60, y: 60, speed: 68 },
    pickups: [] as Array<{ x: number; y: number; collected: boolean }>,
    keys: { up: false, down: false, left: false, right: false },
    wallContactTime: 0,
    dust: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number }>,
  });

  const resetGame = (startNow: boolean) => {
    const spots = [
      [85, 50],
      [260, 42],
      [435, 50],
      [75, 130],
      [445, 130],
      [85, 210],
      [260, 218],
      [435, 210],
      [355, 130],
    ];
    stateRef.current = {
      playing: startNow,
      player: { x: 200, y: 130 },
      enemy: { x: 460, y: 46, speed: 68 },
      pickups: spots.map(([x, y]) => ({ x, y, collected: false })),
      keys: { up: false, down: false, left: false, right: false },
      wallContactTime: 0,
      dust: [],
    };
    setScore(0);
    setWallTimer(0);
    setLostReason('');
    setStatus(startNow ? 'playing' : 'ready');
    onPlayingChange?.(startNow);
  };

  useEffect(() => {
    resetGame(false);
    return () => onPlayingChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapKey = (e: KeyboardEvent, down: boolean) => {
      if (!stateRef.current.playing) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        stateRef.current.keys.up = down;
      } else if (k === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        stateRef.current.keys.down = down;
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stateRef.current.keys.left = down;
      } else if (k === 'd' || e.key === 'ArrowRight') {
        e.preventDefault();
        stateRef.current.keys.right = down;
      }
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
        if (s.playing) {
          let dx = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
          let dy = (s.keys.down ? 1 : 0) - (s.keys.up ? 1 : 0);
          const mag = Math.hypot(dx, dy);
          if (mag > 0) {
            dx /= mag;
            dy /= mag;
            const speed = 155;
            s.player.x = Math.max(18, Math.min(502, s.player.x + dx * speed * dt));
            s.player.y = Math.max(18, Math.min(242, s.player.y + dy * speed * dt));
            if (Math.random() < 0.65) {
              s.dust.push({
                x: s.player.x - dx * 10,
                y: s.player.y - dy * 10,
                vx: -dx * 25 + (Math.random() - 0.5) * 18,
                vy: -dy * 25 + (Math.random() - 0.5) * 18,
                life: 0.35,
              });
            }
          }

          // OuterWall 3-second electric hazard check
          const nearWall =
            s.player.x <= 24 || s.player.x >= 496 || s.player.y <= 24 || s.player.y >= 236;
          if (nearWall) {
            s.wallContactTime += dt;
            setWallTimer(Number(s.wallContactTime.toFixed(1)));
            if (s.wallContactTime >= 3.0) {
              s.playing = false;
              setLostReason('Outer Electric Wall > 3.0s');
              setStatus('lost');
              onPlayingChange?.(false);
            }
          } else if (s.wallContactTime > 0) {
            s.wallContactTime = 0;
            setWallTimer(0);
          }

          // Enemy chase
          const ex = s.player.x - s.enemy.x;
          const ey = s.player.y - s.enemy.y;
          const ed = Math.hypot(ex, ey);
          if (ed > 1) {
            s.enemy.x += (ex / ed) * s.enemy.speed * dt;
            s.enemy.y += (ey / ed) * s.enemy.speed * dt;
          }
          if (ed < 20 && s.playing) {
            s.playing = false;
            setLostReason('Caught by Red NavMesh Chaser');
            setStatus('lost');
            onPlayingChange?.(false);
          }

          // Pickups
          let collectedCount = 0;
          for (const p of s.pickups) {
            if (!p.collected && Math.hypot(p.x - s.player.x, p.y - s.player.y) < 18) {
              p.collected = true;
            }
            if (p.collected) collectedCount++;
          }
          setScore(collectedCount);
          if (collectedCount === s.pickups.length && s.playing) {
            s.playing = false;
            setStatus('won');
            onPlayingChange?.(false);
          }
        }

        s.dust = s.dust.filter((d) => {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.life -= dt;
          return d.life > 0;
        });

        // Draw arena
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 520, 260);

        // Electric outer boundary
        const pulseWall = 0.5 + 0.5 * Math.sin(now * 0.012);
        ctx.strokeStyle =
          s.wallContactTime > 0
            ? `rgba(239, 68, 68, ${0.7 + 0.3 * pulseWall})`
            : `rgba(56, 189, 248, ${0.45 + 0.35 * pulseWall})`;
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, 510, 250);

        // Dust trail
        for (const d of s.dust) {
          ctx.globalAlpha = Math.max(0, d.life * 2);
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Golden Pickups
        for (const p of s.pickups) {
          if (p.collected) continue;
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Enemy chaser + 8u proximity pulse
        const distToPlayer = Math.hypot(s.player.x - s.enemy.x, s.player.y - s.enemy.y);
        const isNear = distToPlayer < 95;
        const pulse = isNear ? 0.5 + 0.5 * Math.sin(now * 0.008 * 3) : 0;
        if (isNear) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.25 + 0.45 * pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.enemy.x, s.enemy.y, 20 + pulse * 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = isNear ? (pulse > 0.5 ? '#ef4444' : '#fca5a5') : '#dc2626';
        ctx.beginPath();
        ctx.arc(s.enemy.x, s.enemy.y, 11, 0, Math.PI * 2);
        ctx.fill();

        // Player sphere
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d1fae5';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onPlayingChange]);

  const setDir = (dir: 'up' | 'down' | 'left' | 'right', down: boolean) => {
    stateRef.current.keys[dir] = down;
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="rounded bg-slate-900 px-2 py-0.5 text-yellow-300">
            PICKUPS: {score} / 9
          </span>
          <span
            className={`rounded px-2 py-0.5 ${
              wallTimer > 0 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            WALL TIMER: {wallTimer.toFixed(1)}s / 3.0s
          </span>
        </div>
        <button
          type="button"
          onClick={() => resetGame(true)}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          {status === 'ready' ? 'Start Demo' : 'Restart'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950">
        <canvas ref={canvasRef} width={520} height={260} className="block w-full select-none" />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 p-4 text-center">
            <p className="font-serif text-lg font-semibold text-white">
              {status === 'won'
                ? 'VICTORY! All 9 Pickups Collected'
                : status === 'lost'
                  ? `GAME OVER — ${lostReason}`
                  : 'Sphere Runner — 3D Arcade Survival'}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              WASD / Arrow Keys to Roll · Collect 9 Golden Spheres · Don&apos;t linger &gt;3s on the Electric Wall
            </p>
            <button
              type="button"
              onClick={() => resetGame(true)}
              className="mt-3 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
            >
              {status === 'ready' ? 'Play Demo' : 'Play Again'}
            </button>
          </div>
        )}
      </div>

      {status === 'playing' && (
        <div className="flex items-center justify-center gap-1.5 pt-1 sm:hidden">
          {(['left', 'up', 'down', 'right'] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onPointerDown={() => setDir(dir, true)}
              onPointerUp={() => setDir(dir, false)}
              onPointerLeave={() => setDir(dir, false)}
              className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 uppercase active:bg-slate-200"
            >
              {dir}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Live Wire (Substation Power Routing Demo)                               */
/* -------------------------------------------------------------------------- */
export function LiveWireDemo({ onPlayingChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won'>('ready');
  const [hint, setHint] = useState('Move near a Battery (#1042 or #2088) and press E / Action');
  const [litCount, setLitCount] = useState(0);

  const stateRef = useRef({
    playing: false,
    player: { x: 80, y: 130, carrying: null as null | '1042' | '2088' },
    batteries: [
      { id: '1042' as const, x: 90, y: 58, color: '#38bdf8', socketedIn: null as null | string },
      { id: '2088' as const, x: 90, y: 202, color: '#fbbf24', socketedIn: null as null | string },
    ],
    turrets: [
      { id: '1042' as const, x: 260, y: 65, color: '#38bdf8', charge: 0, powered: false, targetX: 445, targetY: 65, lit: false },
      { id: '2088' as const, x: 260, y: 195, color: '#fbbf24', charge: 0, powered: false, targetX: 445, targetY: 195, lit: false },
    ],
    thief: { x: 350, y: 130, vy: 58 },
    keys: { up: false, down: false, left: false, right: false, interact: false },
  });

  const resetGame = (startNow: boolean) => {
    stateRef.current = {
      playing: startNow,
      player: { x: 80, y: 130, carrying: null },
      batteries: [
        { id: '1042', x: 90, y: 58, color: '#38bdf8', socketedIn: null },
        { id: '2088', x: 90, y: 202, color: '#fbbf24', socketedIn: null },
      ],
      turrets: [
        { id: '1042', x: 260, y: 65, color: '#38bdf8', charge: 0, powered: false, targetX: 445, targetY: 65, lit: false },
        { id: '2088', x: 260, y: 195, color: '#fbbf24', charge: 0, powered: false, targetX: 445, targetY: 195, lit: false },
      ],
      thief: { x: 350, y: 130, vy: 58 },
      keys: { up: false, down: false, left: false, right: false, interact: false },
    };
    setLitCount(0);
    setHint('Walk to Battery #1042 or #2088 and press E / Pickup');
    setStatus(startNow ? 'playing' : 'ready');
    onPlayingChange?.(startNow);
  };

  useEffect(() => {
    resetGame(false);
    return () => onPlayingChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerPickupOrDrop = () => {
    const s = stateRef.current;
    if (!s.playing) return;
    if (!s.player.carrying) {
      const near = s.batteries.find(
        (b) => !b.socketedIn && Math.hypot(b.x - s.player.x, b.y - s.player.y) < 36
      );
      if (near) {
        s.player.carrying = near.id;
        setHint(`Carrying Battery #${near.id} — hold E near matching Power Cylinder!`);
      }
    } else {
      const carried = s.batteries.find((b) => b.id === s.player.carrying);
      if (carried) {
        carried.x = s.player.x;
        carried.y = s.player.y;
      }
      s.player.carrying = null;
      setHint('Dropped battery.');
    }
  };

  useEffect(() => {
    const mapKey = (e: KeyboardEvent, down: boolean) => {
      if (!stateRef.current.playing) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        stateRef.current.keys.up = down;
      } else if (k === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        stateRef.current.keys.down = down;
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stateRef.current.keys.left = down;
      } else if (k === 'd' || e.key === 'ArrowRight') {
        e.preventDefault();
        stateRef.current.keys.right = down;
      } else if (k === 'e' || e.code === 'Space') {
        e.preventDefault();
        if (down && !stateRef.current.keys.interact) {
          const s = stateRef.current;
          const nearTurret = s.turrets.find(
            (t) => Math.hypot(t.x - s.player.x, t.y - s.player.y) < 38
          );
          if (!nearTurret) {
            triggerPickupOrDrop();
          }
        }
        stateRef.current.keys.interact = down;
      } else if (k === 'q' && down && stateRef.current.player.carrying) {
        triggerPickupOrDrop();
      }
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
        if (s.playing) {
          let dx = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
          let dy = (s.keys.down ? 1 : 0) - (s.keys.up ? 1 : 0);
          const mag = Math.hypot(dx, dy);
          if (mag > 0) {
            dx /= mag;
            dy /= mag;
            s.player.x = Math.max(20, Math.min(500, s.player.x + dx * 150 * dt));
            s.player.y = Math.max(20, Math.min(240, s.player.y + dy * 150 * dt));
          }

          // Keep carried battery attached
          if (s.player.carrying) {
            const b = s.batteries.find((bat) => bat.id === s.player.carrying);
            if (b) {
              b.x = s.player.x;
              b.y = s.player.y - 16;
            }
          }

          // Charging turret when holding E near turret
          if (s.keys.interact && s.player.carrying) {
            const t = s.turrets.find(
              (turret) => !turret.powered && Math.hypot(turret.x - s.player.x, turret.y - s.player.y) < 38
            );
            if (t) {
              if (t.id === s.player.carrying) {
                t.charge = Math.min(1, t.charge + dt * 0.85);
                if (t.charge >= 1) {
                  t.powered = true;
                  t.lit = true;
                  const b = s.batteries.find((bat) => bat.id === s.player.carrying);
                  if (b) {
                    b.socketedIn = t.id;
                    b.x = t.x;
                    b.y = t.y;
                  }
                  s.player.carrying = null;
                  setHint(`Turret #${t.id} ONLINE! Laser ignited Transformer Bushing!`);
                }
              } else {
                setHint(`OFFLINE: Battery #${s.player.carrying} != CellID #${t.id}`);
              }
            }
          }

          // Patrol Battery Thief
          s.thief.y += s.thief.vy * dt;
          if (s.thief.y < 38 || s.thief.y > 222) s.thief.vy *= -1;

          const count = s.turrets.filter((t) => t.lit).length;
          setLitCount(count);
          if (count === s.turrets.length) {
            s.playing = false;
            setStatus('won');
            onPlayingChange?.(false);
          }
        }

        // Render Substation
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 520, 260);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 26; x < 520; x += 26) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 260);
          ctx.stroke();
        }
        for (let y = 26; y < 260; y += 26) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(520, y);
          ctx.stroke();
        }

        // Turrets, Laser Beams & Bushings
        for (const t of s.turrets) {
          // Laser beam
          if (t.powered) {
            ctx.strokeStyle = t.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(t.targetX, t.targetY);
            ctx.stroke();
          }

          // Power cylinder
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = t.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (t.charge > 0 && !t.powered) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 21, -Math.PI / 2, -Math.PI / 2 + t.charge * Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = '#e2e8f0';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`#${t.id}`, t.x, t.y + 30);

          // Target + Transformer Bushing
          ctx.fillStyle = t.lit ? t.color : '#334155';
          ctx.beginPath();
          ctx.arc(t.targetX, t.targetY, 14, 0, Math.PI * 2);
          ctx.fill();
          if (t.lit) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(t.lit ? '8000 lm LIT' : 'BUSHING', t.targetX, t.targetY + 26);
        }

        // Batteries
        for (const b of s.batteries) {
          if (b.socketedIn) continue;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 7, b.y - 10, 14, 20);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(b.id, b.x, b.y + 3);
        }

        // Battery Thief
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(s.thief.x, s.thief.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f3e8ff';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THIEF', s.thief.x, s.thief.y - 14);

        // Player
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onPlayingChange]);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-sky-300">
          BUSHINGS LIT: {litCount} / 2
        </span>
        <span className="truncate text-slate-300">{hint}</span>
        <button
          type="button"
          onClick={() => resetGame(true)}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          {status === 'ready' ? 'Start Demo' : 'Restart'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950">
        <canvas ref={canvasRef} width={520} height={260} className="block w-full select-none" />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 p-4 text-center">
            <p className="font-serif text-lg font-semibold text-white">
              {status === 'won'
                ? 'SUBSTATION RESTORED! Both Bushings Lit'
                : 'Live Wire — Power Routing Demo'}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              WASD / Arrows to Move · Press E to Grab Battery · Hold E on Matching Cylinder to Socket &amp; Fire Laser
            </p>
            <button
              type="button"
              onClick={() => resetGame(true)}
              className="mt-3 rounded-full bg-sky-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-300"
            >
              {status === 'ready' ? 'Play Demo' : 'Play Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Trap Rooms (Key, Shrine, 10s Risk-Reward Trap Room)                     */
/* -------------------------------------------------------------------------- */
export function TrapRoomsDemo({ onPlayingChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [hud, setHud] = useState({ keys: 0, banked: 0, unbanked: 0, trapTimer: 0, hp: 100 });

  const stateRef = useRef({
    playing: false,
    player: { x: 70, y: 130, keys: 0, banked: 0, unbanked: 0, hp: 100 },
    keyItem: { x: 115, y: 55, taken: false },
    doorOpen: false,
    inTrap: false,
    trapTimer: 0,
    coins: [
      { x: 350, y: 65, taken: false },
      { x: 430, y: 65, taken: false },
      { x: 430, y: 195, taken: false },
      { x: 350, y: 195, taken: false },
    ],
    enemy: { x: 205, y: 195, dir: -1 },
    keys: { up: false, down: false, left: false, right: false },
  });

  const resetGame = (startNow: boolean) => {
    stateRef.current = {
      playing: startNow,
      player: { x: 70, y: 130, keys: 0, banked: 0, unbanked: 0, hp: 100 },
      keyItem: { x: 115, y: 55, taken: false },
      doorOpen: false,
      inTrap: false,
      trapTimer: 0,
      coins: [
        { x: 350, y: 65, taken: false },
        { x: 430, y: 65, taken: false },
        { x: 430, y: 195, taken: false },
        { x: 350, y: 195, taken: false },
      ],
      enemy: { x: 205, y: 195, dir: -1 },
      keys: { up: false, down: false, left: false, right: false },
    };
    setHud({ keys: 0, banked: 0, unbanked: 0, trapTimer: 0, hp: 100 });
    setStatus(startNow ? 'playing' : 'ready');
    onPlayingChange?.(startNow);
  };

  useEffect(() => {
    resetGame(false);
    return () => onPlayingChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapKey = (e: KeyboardEvent, down: boolean) => {
      if (!stateRef.current.playing) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        stateRef.current.keys.up = down;
      } else if (k === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        stateRef.current.keys.down = down;
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stateRef.current.keys.left = down;
      } else if (k === 'd' || e.key === 'ArrowRight') {
        e.preventDefault();
        stateRef.current.keys.right = down;
      }
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
        if (s.playing) {
          let dx = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
          let dy = (s.keys.down ? 1 : 0) - (s.keys.up ? 1 : 0);
          const mag = Math.hypot(dx, dy);
          if (mag > 0) {
            dx /= mag;
            dy /= mag;
            let nx = Math.max(18, Math.min(502, s.player.x + dx * 155 * dt));
            const ny = Math.max(18, Math.min(242, s.player.y + dy * 155 * dt));
            // Door barrier at x=280 unless unlocked
            if (!s.doorOpen && s.player.x <= 274 && nx > 274) {
              if (s.player.keys > 0) {
                s.player.keys -= 1;
                s.doorOpen = true;
              } else {
                nx = 274;
              }
            }
            s.player.x = nx;
            s.player.y = ny;
          }

          // Key pickup
          if (!s.keyItem.taken && Math.hypot(s.player.x - s.keyItem.x, s.player.y - s.keyItem.y) < 18) {
            s.keyItem.taken = true;
            s.player.keys = 1;
          }

          // Enter/Exit Trap Room
          const insideTrap = s.player.x > 290;
          if (insideTrap && !s.inTrap) {
            s.inTrap = true;
            s.trapTimer = 10.0;
          } else if (!insideTrap && s.inTrap) {
            s.inTrap = false;
            s.player.banked += s.player.unbanked;
            s.player.unbanked = 0;
            s.trapTimer = 0;
            if (s.coins.every((c) => c.taken)) {
              s.playing = false;
              setStatus('won');
              onPlayingChange?.(false);
            }
          }

          if (s.inTrap) {
            s.trapTimer -= dt;
            if (s.trapTimer <= 0) {
              s.trapTimer = 0;
              s.playing = false;
              setStatus('lost');
              onPlayingChange?.(false);
            }
          }

          // Coins (2x value inside trap room)
          for (const c of s.coins) {
            if (!c.taken && Math.hypot(c.x - s.player.x, c.y - s.player.y) < 18) {
              c.taken = true;
              s.player.unbanked += 20;
            }
          }

          // Enemy patrol
          s.enemy.y += s.enemy.dir * 65 * dt;
          if (s.enemy.y < 40 || s.enemy.y > 220) s.enemy.dir *= -1;
          if (Math.hypot(s.enemy.x - s.player.x, s.enemy.y - s.player.y) < 18) {
            s.player.hp = Math.max(0, s.player.hp - 50 * dt);
            if (s.player.hp <= 0) {
              s.playing = false;
              setStatus('lost');
              onPlayingChange?.(false);
            }
          }

          setHud({
            keys: s.player.keys,
            banked: s.player.banked,
            unbanked: s.player.unbanked,
            trapTimer: Number(s.trapTimer.toFixed(1)),
            hp: Math.ceil(s.player.hp),
          });
        }

        // Draw
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 280, 260);
        ctx.fillStyle = s.inTrap ? '#29151d' : '#171726';
        ctx.fillRect(280, 0, 240, 260);

        // Divider wall & door
        ctx.fillStyle = s.doorOpen ? '#22c55e' : '#ef4444';
        ctx.fillRect(278, 0, 6, s.doorOpen ? 30 : 260);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('SAFE HUB (BANK)', 14, 18);
        ctx.fillText('TRAP ROOM (10s · 2x COINS)', 294, 18);

        // Key
        if (!s.keyItem.taken) {
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(s.keyItem.x, s.keyItem.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillText('KEY', s.keyItem.x - 9, s.keyItem.y + 18);
        }

        // Coins
        for (const c of s.coins) {
          if (c.taken) continue;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Enemy
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(s.enemy.x, s.enemy.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Player
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(s.player.x, s.player.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onPlayingChange]);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-slate-900 px-2 py-0.5 text-yellow-300">KEY: {hud.keys}/1</span>
          <span className="rounded bg-slate-900 px-2 py-0.5 text-emerald-300">BANKED: {hud.banked}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-amber-300">RISK: {hud.unbanked}</span>
          {hud.trapTimer > 0 && (
            <span className="rounded bg-rose-600 px-2 py-0.5 text-white">TRAP: {hud.trapTimer}s</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => resetGame(true)}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          {status === 'ready' ? 'Start Demo' : 'Restart'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950">
        <canvas ref={canvasRef} width={520} height={260} className="block w-full select-none" />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 p-4 text-center">
            <p className="font-serif text-lg font-semibold text-white">
              {status === 'won'
                ? `ESCAPED! Banked ${hud.banked} Score`
                : status === 'lost'
                  ? 'TRAPPED / DEFEATED!'
                  : 'Trap Rooms — Risk-Reward Escape'}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              WASD / Arrows · Grab Key → Unlock Trap Room → Collect Coins &amp; Exit to Hub before 10s!
            </p>
            <button
              type="button"
              onClick={() => resetGame(true)}
              className="mt-3 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300"
            >
              {status === 'ready' ? 'Play Demo' : 'Play Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
