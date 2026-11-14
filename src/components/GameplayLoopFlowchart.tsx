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

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines.slice(0, 4);
}

interface WrappedTextProps {
  x: number;
  centerY: number;
  text: string;
  maxChars: number;
  fontSize?: number;
  fontWeight?: number;
  fill: string;
  lineHeight?: number;
}

function SvgWrappedText({
  x,
  centerY,
  text,
  maxChars,
  fontSize = 9.5,
  fontWeight = 600,
  fill,
  lineHeight = 12,
}: WrappedTextProps) {
  const lines = wrapLines(text, maxChars);
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={x}
      y={startY}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight={fontWeight}
      fill={fill}
    >
      {lines.map((line, i) => (
        <tspan key={`${i}-${line}`} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/**
 * Renders an inline SVG flowchart illustrating the project's core gameplay loop,
 * decision diamond, retry feedback branch, and progression reward.
 */
export function GameplayLoopFlowchart({ projectId, theme }: GameplayLoopFlowchartProps) {
  const loop = GAMEPLAY_LOOPS[projectId];
  if (!loop) return null;

  const palette = SVG_THEME[theme];
  const retryText = `NO · ${loop.retryLabel}`;
  const retryPillW = Math.min(380, Math.max(210, retryText.length * 6.0 + 32));
  const retryPillX = 492 - retryPillW / 2;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
      <svg
        viewBox="0 0 960 360"
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
        <rect width="960" height="360" rx="18" fill={palette.bg} />

        {/* Header */}
        <rect
          x="24"
          y="18"
          width="260"
          height="24"
          rx="12"
          fill={palette.pill}
          stroke={palette.border}
          strokeWidth="1.2"
        />
        <text
          x="154"
          y="34"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.7"
          fill={palette.text}
        >
          GAMEPLAY LOOP FLOWCHART
        </text>
        <text x="24" y="64" fontSize="17" fontWeight="700" fill="#0F172A">
          {loop.title}
        </text>

        {/* Step 1: Entry */}
        <rect
          x="20"
          y="96"
          width="172"
          height="96"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="106" y="114" textAnchor="middle" fontSize="9" fontWeight="700" fill={palette.accent}>
          1. ENTRY
        </text>
        <SvgWrappedText
          x={106}
          centerY={152}
          text={loop.entry}
          maxChars={16}
          fontSize={9.5}
          fill="#1E293B"
        />

        {/* Arrow 1 -> 2 */}
        <line
          x1="192"
          y1="144"
          x2="212"
          y2="144"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 2: Core Action */}
        <rect
          x="216"
          y="96"
          width="172"
          height="96"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="302" y="114" textAnchor="middle" fontSize="9" fontWeight="700" fill={palette.accent}>
          2. PLAYER ACTION
        </text>
        <SvgWrappedText
          x={302}
          centerY={152}
          text={loop.action}
          maxChars={16}
          fontSize={9.5}
          fill="#1E293B"
        />

        {/* Arrow 2 -> 3 */}
        <line
          x1="388"
          y1="144"
          x2="408"
          y2="144"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 3: System */}
        <rect
          x="412"
          y="96"
          width="172"
          height="96"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="498" y="114" textAnchor="middle" fontSize="9" fontWeight="700" fill={palette.accent}>
          3. CORE SYSTEM
        </text>
        <SvgWrappedText
          x={498}
          centerY={152}
          text={loop.system}
          maxChars={16}
          fontSize={9.5}
          fill="#1E293B"
        />

        {/* Arrow 3 -> Decision Diamond */}
        <line
          x1="584"
          y1="144"
          x2="604"
          y2="144"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Decision Diamond */}
        <polygon
          points="682,82 758,144 682,206 606,144"
          fill={palette.pill}
          stroke={palette.accent}
          strokeWidth="2"
        />
        <SvgWrappedText
          x={682}
          centerY={144}
          text={loop.decision}
          maxChars={11}
          fontSize={9}
          fontWeight={700}
          fill={palette.text}
          lineHeight={11}
        />

        {/* YES branch -> Reward */}
        <line
          x1="758"
          y1="144"
          x2="782"
          y2="144"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <text x="770" y="134" textAnchor="middle" fontSize="9" fontWeight="700" fill={palette.text}>
          YES
        </text>

        <rect
          x="786"
          y="96"
          width="154"
          height="96"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.accent}
          strokeWidth="2"
        />
        <text x="863" y="114" textAnchor="middle" fontSize="9" fontWeight="700" fill={palette.accent}>
          4. ADVANCE
        </text>
        <SvgWrappedText
          x={863}
          centerY={152}
          text={loop.reward}
          maxChars={15}
          fontSize={9.5}
          fill="#1E293B"
          lineHeight={12}
        />

        {/* NO / Retry loop back from Diamond to Step 2 */}
        <path
          d="M 682 206 L 682 268 L 302 268 L 302 196"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeDasharray="6 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x={retryPillX}
          y="254"
          width={retryPillW}
          height="26"
          rx="13"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="1.5"
        />
        <text x="492" y="271" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={palette.text}>
          {retryText}
        </text>

        {/* Next Level / Cycle Loop from Advance back to Entry */}
        <path
          d="M 863 192 L 863 316 L 106 316 L 106 196"
          fill="none"
          stroke={palette.border}
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x="390"
          y="303"
          width="204"
          height="24"
          rx="12"
          fill={palette.pill}
          stroke={palette.border}
          strokeWidth="1.2"
        />
        <text x="492" y="319" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.text}>
          NEXT STAGE / CONTINUOUS LOOP
        </text>
      </svg>
    </div>
  );
}
