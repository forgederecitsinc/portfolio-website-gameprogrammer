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

function wrapLines(text: string, maxChars: number, maxLines = 3): string[] {
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
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
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
  fontSize = 10.5,
  fontWeight = 600,
  fill,
  lineHeight = 13,
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
  const retryPillW = Math.min(340, Math.max(190, retryText.length * 6.2 + 28));
  const retryPillX = 448 - retryPillW / 2;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
      <svg
        viewBox="0 0 860 345"
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
        <rect width="860" height="345" rx="18" fill={palette.bg} />

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
          x="20"
          y="102"
          width="150"
          height="82"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="95" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.accent}>
          1. ENTRY
        </text>
        <SvgWrappedText
          x={95}
          centerY={152}
          text={loop.entry}
          maxChars={20}
          fontSize={10.5}
          fill="#1E293B"
        />

        {/* Arrow 1 -> 2 */}
        <line
          x1="170"
          y1="143"
          x2="192"
          y2="143"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 2: Core Action */}
        <rect
          x="196"
          y="102"
          width="150"
          height="82"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="271" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.accent}>
          2. PLAYER ACTION
        </text>
        <SvgWrappedText
          x={271}
          centerY={152}
          text={loop.action}
          maxChars={20}
          fontSize={10.5}
          fill="#1E293B"
        />

        {/* Arrow 2 -> 3 */}
        <line
          x1="346"
          y1="143"
          x2="368"
          y2="143"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Step 3: System */}
        <rect
          x="372"
          y="102"
          width="152"
          height="82"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="2"
        />
        <text x="448" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.accent}>
          3. CORE SYSTEM
        </text>
        <SvgWrappedText
          x={448}
          centerY={152}
          text={loop.system}
          maxChars={20}
          fontSize={10.5}
          fill="#1E293B"
        />

        {/* Arrow 3 -> Decision Diamond */}
        <line
          x1="524"
          y1="143"
          x2="548"
          y2="143"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />

        {/* Decision Diamond */}
        <polygon
          points="614,90 678,143 614,196 550,143"
          fill={palette.pill}
          stroke={palette.accent}
          strokeWidth="2"
        />
        <SvgWrappedText
          x={614}
          centerY={143}
          text={loop.decision}
          maxChars={13}
          fontSize={10}
          fontWeight={700}
          fill={palette.text}
          lineHeight={12}
        />

        {/* YES branch -> Reward */}
        <line
          x1="678"
          y1="143"
          x2="704"
          y2="143"
          stroke={palette.accent}
          strokeWidth="2"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <text x="690" y="133" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.text}>
          YES
        </text>

        <rect
          x="708"
          y="102"
          width="132"
          height="82"
          rx="14"
          fill="#FFFFFF"
          stroke={palette.accent}
          strokeWidth="2"
        />
        <text x="774" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={palette.accent}>
          4. ADVANCE
        </text>
        <SvgWrappedText
          x={774}
          centerY={152}
          text={loop.reward}
          maxChars={18}
          fontSize={10}
          fill="#1E293B"
          lineHeight={12}
        />

        {/* NO / Retry loop back from Diamond to Step 2 */}
        <path
          d="M 614 196 L 614 256 L 271 256 L 271 188"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          strokeDasharray="6 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x={retryPillX}
          y="242"
          width={retryPillW}
          height="26"
          rx="13"
          fill="#FFFFFF"
          stroke={palette.border}
          strokeWidth="1.5"
        />
        <text x="448" y="259" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={palette.text}>
          {retryText}
        </text>

        {/* Next Level / Cycle Loop from Advance back to Entry */}
        <path
          d="M 774 184 L 774 302 L 95 302 L 95 188"
          fill="none"
          stroke={palette.border}
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd={`url(#arrow-${projectId})`}
        />
        <rect
          x="349"
          y="289"
          width="198"
          height="24"
          rx="12"
          fill={palette.pill}
          stroke={palette.border}
          strokeWidth="1.2"
        />
        <text x="448" y="305" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.text}>
          NEXT STAGE / CONTINUOUS LOOP
        </text>
      </svg>
    </div>
  );
}
