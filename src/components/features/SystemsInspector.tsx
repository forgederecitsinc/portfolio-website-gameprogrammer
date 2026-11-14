import { useMemo, useState } from 'react';
import { Sliders } from 'lucide-react';

interface SystemsInspectorProps {
  compact?: boolean;
}

/**
 * Interactive GDD & Systems Inspector: lets recruiters scrub gameplay tuning
 * parameters and observe jump arcs, apex height, air time, and enemy catch-up live.
 */
export function SystemsInspector({ compact = false }: SystemsInspectorProps) {
  const [gravity, setGravity] = useState(15); // m/s^2
  const [jumpVel, setJumpVel] = useState(9.5); // m/s
  const [enemySpeed, setEnemySpeed] = useState(300); // cm/s
  const [cooldown, setCooldown] = useState(1.5); // s

  const metrics = useMemo(() => {
    const timeToApex = jumpVel / gravity;
    const totalAirTime = timeToApex * 2;
    const maxHeight = (jumpVel * jumpVel) / (2 * gravity);
    const catchUpDist = (enemySpeed / 100) * cooldown; // meters covered during cooldown
    const dpsPerCycle = Number((25 / cooldown).toFixed(1));

    // Sample parabolic trajectory points for SVG (width 320, height 110)
    const points: string[] = [];
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const t = frac * totalAirTime;
      const yMeters = Math.max(0, jumpVel * t - 0.5 * gravity * t * t);
      const px = 16 + frac * 288;
      const py = 96 - Math.min(82, (yMeters / 6) * 82);
      points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }

    return {
      timeToApex: timeToApex.toFixed(2),
      totalAirTime: totalAirTime.toFixed(2),
      maxHeight: maxHeight.toFixed(2),
      catchUpDist: catchUpDist.toFixed(2),
      dpsPerCycle,
      polyline: points.join(' '),
    };
  }, [gravity, jumpVel, enemySpeed, cooldown]);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-900 p-4 text-slate-100">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-sky-400" />
          <h5 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
            Live GDD &amp; Physics Tuning Inspector
          </h5>
        </div>
        <span className="font-mono text-[11px] text-sky-300">
          Apex: {metrics.maxHeight}m · Air: {metrics.totalAirTime}s
        </span>
      </div>

      <div className={`mt-3 grid gap-4 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'}`}>
        <div className="space-y-2.5 text-xs">
          <label className="block">
            <div className="flex justify-between font-mono text-[11px] text-slate-300">
              <span>Gravity</span>
              <span className="text-sky-300">-{gravity} m/s²</span>
            </div>
            <input
              type="range"
              min={6}
              max={30}
              step={1}
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="mt-1 w-full accent-sky-400"
            />
          </label>

          <label className="block">
            <div className="flex justify-between font-mono text-[11px] text-slate-300">
              <span>Jump Velocity</span>
              <span className="text-emerald-300">{jumpVel.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={5}
              max={16}
              step={0.5}
              value={jumpVel}
              onChange={(e) => setJumpVel(Number(e.target.value))}
              className="mt-1 w-full accent-emerald-400"
            />
          </label>

          <label className="block">
            <div className="flex justify-between font-mono text-[11px] text-slate-300">
              <span>Enemy Chase Speed</span>
              <span className="text-rose-300">{enemySpeed} cm/s</span>
            </div>
            <input
              type="range"
              min={150}
              max={550}
              step={25}
              value={enemySpeed}
              onChange={(e) => setEnemySpeed(Number(e.target.value))}
              className="mt-1 w-full accent-rose-400"
            />
          </label>

          <label className="block">
            <div className="flex justify-between font-mono text-[11px] text-slate-300">
              <span>Ability / Hazard Cooldown</span>
              <span className="text-amber-300">{cooldown.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={4.0}
              step={0.1}
              value={cooldown}
              onChange={(e) => setCooldown(Number(e.target.value))}
              className="mt-1 w-full accent-amber-400"
            />
          </label>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
          <svg viewBox="0 0 320 110" className="h-auto w-full" aria-label="Jump arc curve">
            <line x1="12" y1="96" x2="308" y2="96" stroke="#334155" strokeWidth="1.5" />
            <line x1="16" y1="14" x2="16" y2="96" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={metrics.polyline}
            />
            <text x="20" y="20" fontSize="9" fill="#94a3b8" fontFamily="monospace">
              JUMP ARC (0–6m)
            </text>
          </svg>

          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
            <div className="rounded bg-slate-900 px-1.5 py-1">
              <div className="text-slate-400">APEX TIME</div>
              <div className="text-sky-300">{metrics.timeToApex}s</div>
            </div>
            <div className="rounded bg-slate-900 px-1.5 py-1">
              <div className="text-slate-400">CHASE GAP</div>
              <div className="text-rose-300">{metrics.catchUpDist}m</div>
            </div>
            <div className="rounded bg-slate-900 px-1.5 py-1">
              <div className="text-slate-400">EFF. DPS</div>
              <div className="text-amber-300">{metrics.dpsPerCycle}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
