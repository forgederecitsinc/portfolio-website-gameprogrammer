import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light mode', Icon: Sun },
  { value: 'dark', label: 'Dark mode', Icon: Moon },
  { value: 'system', label: 'Use system settings', Icon: Monitor },
];

function applyTheme(pref: ThemePreference) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = pref === 'dark' || (pref === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', shouldBeDark);
}

/**
 * Three-state theme switcher supporting Light, Dark, and System settings.
 */
export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'system';
  });

  useEffect(() => {
    applyTheme(preference);
    localStorage.setItem(STORAGE_KEY, preference);

    if (preference !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/90 p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-900"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`rounded-full p-1.5 transition ${
              active
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
