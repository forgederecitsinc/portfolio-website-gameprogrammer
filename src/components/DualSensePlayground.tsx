import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Zap } from 'lucide-react';

type InputZone = 'touchpad' | 'l2' | 'r2' | 'dpad' | 'triangle' | 'circle' | 'cross' | 'square' | 'ps' | 'body';

interface ZoneSpec {
  label: string;
  freq: number;
  endFreq: number;
  type: OscillatorType;
  trauma: number;
  color: string;
  detail: string;
}

const ZONES: Record<InputZone, ZoneSpec> = {
  touchpad: {
    label: 'Touchpad Haptic Thump',
    freq: 140,
    endFreq: 42,
    type: 'sine',
    trauma: 0.75,
    color: '#8b5cf6',
    detail: 'Sub-bass VCM actuator pulse + resonant chime',
  },
  l2: {
    label: 'L2 Adaptive Trigger',
    freq: 220,
    endFreq: 68,
    type: 'triangle',
    trauma: 0.65,
    color: '#0ea5e9',
    detail: 'Spring-resistance ratchet click + low-end recoil',
  },
  r2: {
    label: 'R2 Adaptive Trigger',
    freq: 260,
    endFreq: 74,
    type: 'sawtooth',
    trauma: 0.85,
    color: '#f43f5e',
    detail: 'Heavy trigger breakaway + weapon-fire impulse',
  },
  dpad: {
    label: 'D-Pad Micro-Switch',
    freq: 340,
    endFreq: 120,
    type: 'square',
    trauma: 0.35,
    color: '#6366f1',
    detail: 'Crisp tactile directional snap',
  },
  triangle: {
    label: 'Triangle (△) Action',
    freq: 523.25,
    endFreq: 659.25,
    type: 'sine',
    trauma: 0.45,
    color: '#10b981',
    detail: 'Harmonic confirm + light camera kick',
  },
  circle: {
    label: 'Circle (○) Cancel / Dodge',
    freq: 440,
    endFreq: 293.66,
    type: 'triangle',
    trauma: 0.5,
    color: '#f43f5e',
    detail: 'Quick evade whoosh + lateral impulse',
  },
  cross: {
    label: 'Cross (✕) Confirm / Jump',
    freq: 587.33,
    endFreq: 783.99,
    type: 'sine',
    trauma: 0.55,
    color: '#3b82f6',
    detail: 'Bright confirmation tone + vertical bounce',
  },
  square: {
    label: 'Square (□) Strike',
    freq: 329.63,
    endFreq: 110,
    type: 'sawtooth',
    trauma: 0.7,
    color: '#a855f7',
    detail: 'Melee impact transient + screen trauma',
  },
  ps: {
    label: 'PS Home Pulse',
    freq: 392,
    endFreq: 523.25,
    type: 'sine',
    trauma: 0.6,
    color: '#8b5cf6',
    detail: 'System wake chord + full-shell rumble',
  },
  body: {
    label: 'DualSense Shell Impact',
    freq: 165,
    endFreq: 48,
    type: 'triangle',
    trauma: 0.65,
    color: '#8b5cf6',
    detail: 'Dual-actuator rumble + camera shake',
  },
};

export function DualSensePlayground() {
  const [muted, setMuted] = useState(false);
  const [activeZone, setActiveZone] = useState<InputZone | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const shakeRafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (shakeRafRef.current) cancelAnimationFrame(shakeRafRef.current);
      document.documentElement.style.transform = '';
    };
  }, []);

  const playSound = (spec: ZoneSpec) => {
    if (muted) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary tone / chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, spec.endFreq), now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      // Sub-bass haptic thump layer
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(85, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.14);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.24 * spec.trauma, now + 0.01);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.17);
    } catch {
      // Ignore Web Audio errors on restricted browsers
    }
  };

  const triggerScreenShake = (trauma: number) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (shakeRafRef.current) cancelAnimationFrame(shakeRafRef.current);

    const start = performance.now();
    const duration = 260;
    const maxOffset = 10 * trauma;
    const maxRot = 0.75 * trauma;

    const frame = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const decay = (1 - t) * (1 - t);

      if (t >= 1) {
        document.documentElement.style.transform = '';
        shakeRafRef.current = 0;
        return;
      }

      const x = (Math.random() * 2 - 1) * maxOffset * decay;
      const y = (Math.random() * 2 - 1) * maxOffset * decay;
      const r = (Math.random() * 2 - 1) * maxRot * decay;
      document.documentElement.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg)`;
      shakeRafRef.current = requestAnimationFrame(frame);
    };

    shakeRafRef.current = requestAnimationFrame(frame);
  };

  const handleZoneTrigger = (zone: InputZone, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const spec = ZONES[zone];
    setActiveZone(zone);
    setPulseCount((c) => c + 1);
    playSound(spec);
    triggerScreenShake(spec.trauma);
  };

  const currentSpec = activeZone ? ZONES[activeZone] : null;
  const lightbarColor = currentSpec ? currentSpec.color : '#8b5cf6';

  return (
    <section id="haptics-lab" className="scroll-mt-20 border-t border-slate-200/80 py-14 sm:py-16">
      <div className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/80 via-white to-sky-50/70 p-6 shadow-xs sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Copy + Live Haptic Telemetry */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-violet-800">
              <Zap className="h-3.5 w-3.5 text-violet-600" />
              Interactive Game-Feel Demo
            </span>
            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Click the DualSense
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
              Tap the triggers, touchpad, D-pad, or face buttons on the controller to synthesize
              Web Audio haptic sound effects and trigger trauma-based camera shake.
            </p>

            {/* Telemetry readout */}
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Haptic Telemetry
                </span>
                <button
                  type="button"
                  onClick={() => setMuted((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.97]"
                >
                  {muted ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                      Muted
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-violet-600" />
                      Audio On
                    </>
                  )}
                </button>
              </div>

              {currentSpec ? (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{currentSpec.label}</span>
                    <span className="font-mono text-[11px] text-violet-700">
                      {Math.round(currentSpec.freq)} Hz · Trauma {(currentSpec.trauma * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{currentSpec.detail}</p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  Waiting for input — click any button or trigger on the DualSense.
                </p>
              )}
            </div>
          </div>

          {/* Interactive DualSense SVG */}
          <div className="flex flex-col items-center justify-center lg:col-span-7">
            <div
              key={pulseCount}
              className="relative flex w-full max-w-md items-center justify-center rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm"
            >
              {/* Subtle radial glow behind controller */}
              <div
                className="pointer-events-none absolute inset-10 rounded-full blur-2xl transition-all duration-300"
                style={{
                  backgroundColor: lightbarColor,
                  opacity: activeZone ? 0.2 : 0.08,
                }}
              />

              <svg
                viewBox="0 0 360 250"
                className="relative z-10 w-full max-w-[360px] cursor-pointer select-none drop-shadow-md"
                role="img"
                aria-label="Interactive DualSense Controller — click buttons for sound and screen shake"
                onClick={(e) => handleZoneTrigger('body', e)}
              >
                {/* L2 / R2 Adaptive Triggers */}
                <g
                  onClick={(e) => handleZoneTrigger('l2', e)}
                  className="cursor-pointer transition-transform duration-100 hover:opacity-90"
                >
                  <path
                    d="M66 46C66 36 76 30 96 30H118V52H66V46Z"
                    fill={activeZone === 'l2' ? '#0ea5e9' : '#334155'}
                  />
                  <text x="86" y="45" fill="#fff" fontSize="10" fontWeight="700" fontFamily="monospace">
                    L2
                  </text>
                </g>

                <g
                  onClick={(e) => handleZoneTrigger('r2', e)}
                  className="cursor-pointer transition-transform duration-100 hover:opacity-90"
                >
                  <path
                    d="M294 46C294 36 284 30 264 30H242V52H294V46Z"
                    fill={activeZone === 'r2' ? '#f43f5e' : '#334155'}
                  />
                  <text x="260" y="45" fill="#fff" fontSize="10" fontWeight="700" fontFamily="monospace">
                    R2
                  </text>
                </g>

                {/* Main DualSense Pearl-White Shell */}
                <path
                  d="M96 46C66 46 48 66 40 98L24 176C19 202 33 220 53 220C68 220 79 210 90 189L106 155C112 145 122 140 135 140H225C238 140 248 145 254 155L270 189C281 210 292 220 307 220C327 220 341 202 336 176L320 98C312 66 294 46 264 46H96Z"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />

                {/* Signature Two-Tone Dark Lower Trim */}
                <path
                  d="M102 126C114 122 126 128 135 140H225C234 128 246 122 258 126L270 162C261 150 248 144 230 144H130C112 144 99 150 90 162L102 126Z"
                  fill="#1e293b"
                />

                {/* Touchpad */}
                <g
                  onClick={(e) => handleZoneTrigger('touchpad', e)}
                  className="cursor-pointer"
                >
                  <path
                    d="M126 50H234L226 108C225 114 220 118 214 118H146C140 118 135 114 134 108L126 50Z"
                    fill={activeZone === 'touchpad' ? '#ede9fe' : '#f8fafc'}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  {/* Lightbar strips */}
                  <path
                    d="M124 56L131 106"
                    stroke={lightbarColor}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M236 56L229 106"
                    stroke={lightbarColor}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* D-Pad */}
                <g
                  onClick={(e) => handleZoneTrigger('dpad', e)}
                  className="cursor-pointer"
                >
                  <rect
                    x="76"
                    y="80"
                    width="14"
                    height="36"
                    rx="4"
                    fill={activeZone === 'dpad' ? '#6366f1' : '#334155'}
                  />
                  <rect
                    x="65"
                    y="91"
                    width="36"
                    height="14"
                    rx="4"
                    fill={activeZone === 'dpad' ? '#6366f1' : '#334155'}
                  />
                </g>

                {/* Face Buttons: Triangle, Circle, Cross, Square */}
                <g
                  onClick={(e) => handleZoneTrigger('triangle', e)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="278"
                    cy="80"
                    r="10"
                    fill={activeZone === 'triangle' ? '#10b981' : '#334155'}
                  />
                  <polygon points="278,74 283,84 273,84" fill="none" stroke="#6ee7b7" strokeWidth="1.8" />
                </g>

                <g
                  onClick={(e) => handleZoneTrigger('circle', e)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="298"
                    cy="98"
                    r="10"
                    fill={activeZone === 'circle' ? '#f43f5e' : '#334155'}
                  />
                  <circle cx="298" cy="98" r="4.5" fill="none" stroke="#fda4af" strokeWidth="1.8" />
                </g>

                <g
                  onClick={(e) => handleZoneTrigger('cross', e)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="278"
                    cy="116"
                    r="10"
                    fill={activeZone === 'cross' ? '#3b82f6' : '#334155'}
                  />
                  <path d="M274 112L282 120M282 112L274 120" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
                </g>

                <g
                  onClick={(e) => handleZoneTrigger('square', e)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="258"
                    cy="98"
                    r="10"
                    fill={activeZone === 'square' ? '#a855f7' : '#334155'}
                  />
                  <rect x="253.5" y="93.5" width="9" height="9" fill="none" stroke="#d8b4fe" strokeWidth="1.8" />
                </g>

                {/* Analog Thumbsticks */}
                <circle cx="136" cy="146" r="20" fill="#0f172a" />
                <circle cx="136" cy="146" r="13" fill="#475569" />
                <circle cx="224" cy="146" r="20" fill="#0f172a" />
                <circle cx="224" cy="146" r="13" fill="#475569" />

                {/* PS Home Button */}
                <g
                  onClick={(e) => handleZoneTrigger('ps', e)}
                  className="cursor-pointer"
                >
                  <circle cx="180" cy="133" r="8" fill={lightbarColor} />
                  <circle cx="180" cy="133" r="3" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
