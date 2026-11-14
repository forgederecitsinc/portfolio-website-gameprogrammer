import { useEffect, useRef, useState } from 'react';
import { CloudRain, Radio, Volume2, VolumeX, Zap } from 'lucide-react';

type Preset = 'off' | 'rain' | 'substation' | 'horror';

/**
 * Floating ambient audio dock synthesizing procedural Rain, Substation Hum,
 * or Horror Drone via the Web Audio API (zero external audio asset dependencies).
 */
export function AudioAtmosphereDock() {
  const [preset, setPreset] = useState<Preset>('off');
  const [volume, setVolume] = useState(0.25);
  const [expanded, setExpanded] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
      gainRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(volume * 0.18, ctxRef.current.currentTime, 0.06);
    }
  }, [volume]);

  const selectPreset = (next: Preset) => {
    stopAudio();
    if (next === 'off' || next === preset) {
      setPreset('off');
      return;
    }

    try {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = volume * 0.18;
      master.connect(ctx.destination);

      if (next === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 950;
        bp.Q.value = 0.7;
        noise.connect(bp);
        bp.connect(master);
        noise.start();
      } else if (next === 'substation') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 60;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 180;
        osc.connect(lp);
        lp.connect(master);
        osc.start();
      } else if (next === 'horror') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 48;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.35;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 12;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(master);
        osc.start();
        lfo.start();
      }

      ctxRef.current = ctx;
      gainRef.current = master;
      setPreset(next);
    } catch {
      setPreset('off');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Open ambient audio dock"
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition ${
            preset !== 'off'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-[#2EF2A8] dark:bg-[#121216] dark:text-[#2EF2A8]'
              : 'border-slate-200 bg-white/95 text-slate-800 hover:border-amber-500 hover:text-amber-700 dark:border-white/15 dark:bg-[#121216]/95 dark:text-slate-200 dark:hover:border-[#F6CF3B] dark:hover:text-[#F6CF3B]'
          }`}
        >
          {preset !== 'off' ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{preset === 'off' ? 'Audio Lab' : `Ambient: ${preset}`}</span>
        </button>
      ) : (
        <div className="w-64 rounded-2xl border border-slate-200 bg-white/95 p-3.5 text-slate-800 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#121216]/95 dark:text-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
              Ambient Audio Dock
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Minimize
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => selectPreset('rain')}
              className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                preset === 'rain'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 dark:border-[#38BDF8] dark:bg-[#38BDF8]/15 dark:text-[#7DD3FC]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#18181D] dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <CloudRain className="h-3.5 w-3.5" />
              Rain
            </button>
            <button
              type="button"
              onClick={() => selectPreset('substation')}
              className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                preset === 'substation'
                  ? 'border-amber-500 bg-amber-50 text-amber-800 dark:border-[#F6CF3B] dark:bg-[#F6CF3B]/15 dark:text-[#FDE047]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#18181D] dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              60Hz Hum
            </button>
            <button
              type="button"
              onClick={() => selectPreset('horror')}
              className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                preset === 'horror'
                  ? 'border-rose-500 bg-rose-50 text-rose-800 dark:border-[#EC1D7B] dark:bg-[#EC1D7B]/15 dark:text-[#F472B6]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#18181D] dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              Drone
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-slate-900 dark:accent-[#F6CF3B]"
              aria-label="Ambient volume"
            />
            {preset !== 'off' && (
              <button
                type="button"
                onClick={() => selectPreset('off')}
                className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-[#F6CF3B] dark:text-slate-950"
              >
                Stop
              </button>
            )}
          </div>

          {preset !== 'off' && (
            <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
              <span>Signal Active · {Math.round(volume * 100)}% Gain</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
