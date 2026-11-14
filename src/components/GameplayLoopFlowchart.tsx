import { GAMEPLAY_LOOPS } from '../data/gameplayLoops';
import type { PastelTheme } from '../data/portfolio';

interface GameplayLoopFlowchartProps {
  projectId: string;
  theme: PastelTheme;
}

const SVG_THEME: Record<
  PastelTheme,
  { bg: string; border: string; pill: string; accent: string; text: string }
> = {
  rose: {
    bg: '#FFF1F2',
    border: '#FDA4AF',
    pill: '#FFE4E6',
    accent: '#E11D48',
    text: '#881337',
  },
  violet: {
    bg: '#F5F3FF',
    border: '#C4B5FD',
    pill: '#EDE9FE',
    accent: '#7C3AED',
    text: '#4C1D95',
  },
  amber: {
    bg: '#FFFBEB',
    border: '#FCD34D',
    pill: '#FEF3C7',
    accent: '#D97706',
    text: '#78350F',
  },
  emerald: {
    bg: '#ECFDF5',
    border: '#6EE7B7',
    pill: '#D1FAE5',
    accent: '#059669',
    text: '#064E3B',
  },
  sky: {
    bg: '#F0F9FF',
    border: '#7DD3FC',
    pill: '#E0F2FE',
    accent: '#0284C7',
    text: '#0C4A6E',
  },
  teal: {
    bg: '#F0FDFA',
    border: '#5EEAD4',
    pill: '#CCFBF1',
    accent: '#0D9488',
    text: '#134E4A',
  },
};

/**
 * Renders an inline SVG flowchart illustrating the project's core gameplay loop,
 * decision diamond, retry feedback branch, and progression reward.
 */
export function GameplayLoopFlowchart({ projectId, theme }: GameplayLoopFlowchartProps) {
  const loop = GAMEPLAY_LOOPS[projectId];
  if (!loop) return null;

  const palette = SVG_THEME[theme];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
      <svg
        viewBox="0 0 820 330"
        className="h-auto w-full"
        role="img"
        aria-label={`${loop.title} gameplay loop flowchart`}
      >
        <defs>
          <marker
            id={`arrow-${projectId}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={palette.accent} />
          </marker>
        </defs>

        {/* Soft pastel background */}
        <rect width="820" height="330" rx="18" fill={palette.bg} />

        {/* Header */}
        <rect
          x="24"
          y="20"
          width="270"
          height="24"
          rx="12"
          fill={palette.pill}
          stroke={palette.border}
          strokeWidth="1.2"
        />
        <text
          x="159"
          y="36"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700"
          letterSpacing="0.7"
          fill={palette.text}
        >
          GAMEPLAY LOOP FLOWCHART
        </text>
        <text x="24" y="68" fontSize="18" fontWeight="700" fill="#0F172A">
          {loop.title}
        </text>

        {/* Step 1: Entry */}
        <rect
          x="24"
          y="108"
          width="148"
          height="68"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="98" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.accent}>
          1. ENTRY
        </text>
        <text x="98" y="150" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#1E293B">
          {loop.entry}
        </text>

        {/* Arrow 1 -> 2 */}
        <line
          x1="172"
          y1="142"
          x2="196"
          y2="142"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 2: Core Action */}
        <rect
          x="200"
          y="108"
          width="148"
          height="68"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="274" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.accent}>
          2. PLAYER ACTION
        </text>
        <text x="274" y="150" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#1E293B">
          {loop.action}
        </text>

        {/* Arrow 2 -> 3 */}
        <line
          x1="348"
          y1="142"
          x2="372"
          y2="142"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 3: System */}
        <rect
          x="376"
          y="108"
          width="152"
          height="68"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="452" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.accent}>
          3. CORE SYSTEM
        </text>
        <text x="452" y="150" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#1E293B">
          {loop.system}
        </text>

        {/* Arrow 3 -> Decision Diamond */}
        <line
          x1="528"
          y1="142"
          x2="554"
          y2="142"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Decision Diamond */}
        <polygon
          points="612,96 668,142 612,188 556,142"
          fill={palette.pill}
          stroke={palette.accent}
          strokeWidth="2"
        />
        <text x="612" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill={palette.text}>
          {loop.decision}
        </text>

        {/* YES branch -> Reward */}
        <line
          x1="668"
          y1="142"
          x2="692"
          y2="142"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <text x="679" y="133" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.text}>
          YES
        </text>

        <rect
          x="696"
          y="108"
          width="104"
          height="68"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.accent}
          strokeWidth="2"
        />
        <text x="748" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.accent}>
          4. ADVANCE
        </text>
        <text x="748" y="149" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1E293B">
          {loop.reward}
        </text>

        {/* NO / Retry loop back from Diamond to Step 2 */}
        <path
          d="M 612 188 L 612 248 L 274 248 L 274 180"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeDasharray="6 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x="355"
          y="234"
          width="180"
          height="26"
          rx="13"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="1.5"
        />
        <text x="445" y="251" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={palette.text}>
          NO · {loop.retryLabel}
        </text>

        {/* Next Level / Cycle Loop from Advance back to Entry */}
        <path
          d="M 748 176 L 748 292 L 98 292 L 98 180"
          fill="none"
          stroke={palette.border}
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x="345"
          y="279"
          width="198"
          height="24"
          rx="12"
          fill={palette.pill}
          stroke={palette.border}
          strokeWidth="1.2"
        />
        <text x="444" y="295" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.text}>
          NEXT STAGE / CONTINUOUS LOOP
        </text>
      </svg>
    </div>
  );
}
