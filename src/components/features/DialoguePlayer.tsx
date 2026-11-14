import { useState } from 'react';
import { MessageSquare, RotateCcw } from 'lucide-react';

interface DialogueChoice {
  label: string;
  next: string;
  trustDelta: number;
  yarnCommand?: string;
}

interface DialogueNode {
  speaker: string;
  line: string;
  choices?: DialogueChoice[];
  ending?: string;
}

const DIALOGUE_SCRIPTS: Record<string, { title: string; start: string; nodes: Record<string, DialogueNode> }> = {
  'carpe-dino': {
    title: 'Yarn Spinner Sample — Carpe Dino: First Coffee Date',
    start: 'intro',
    nodes: {
      intro: {
        speaker: 'REX (T-Rex)',
        line: 'Okay, stay cool. Tiny arms, normal mug. Just act natural and ask about their favorite era.',
        choices: [
          {
            label: '“So, Cretaceous or Jurassic? No wrong answers.”',
            next: 'witty',
            trustDelta: 2,
            yarnCommand: '<<set $charm += 2>>',
          },
          {
            label: '*Try to lift the espresso cup with both tiny hands*',
            next: 'clumsy',
            trustDelta: 1,
            yarnCommand: '<<trigger_anim "TinyArmFumble">>',
          },
        ],
      },
      witty: {
        speaker: 'VELMA (Velociraptor)',
        line: 'Bold opener. Honestly? Late Cretaceous had the best brunch spots before the meteor ruined the patio.',
        choices: [
          {
            label: '“Let’s seize the date before another asteroid shows up.”',
            next: 'good_end',
            trustDelta: 2,
            yarnCommand: '<<unlock_ending "MeteorRomance">>',
          },
        ],
      },
      clumsy: {
        speaker: 'VELMA (Velociraptor)',
        line: 'Need a straw? Actually, that was pretty endearing. Most carnivores try way too hard to look stoic.',
        choices: [
          {
            label: '“Two straws, one iced latte?”',
            next: 'good_end',
            trustDelta: 2,
            yarnCommand: '<<unlock_ending "SharedLatte">>',
          },
        ],
      },
      good_end: {
        speaker: 'NARRATOR',
        line: 'Velma laughs and slides the napkin across the table. Date meter maxed!',
        ending: 'ENDING UNLOCKED: Second Date Secured',
      },
    },
  },
  'red-tide': {
    title: 'Yarn Spinner Sample — Red Tide: Island Shorelines',
    start: 'intro',
    nodes: {
      intro: {
        speaker: 'PIGEON-BOT',
        line: 'Coo-diagnostic complete! Salinity spike detected in Cove 4. Algae bloom density is 340% above baseline, Ricky.',
        choices: [
          {
            label: '“Log the samples first—we need hard data for the council.”',
            next: 'science',
            trustDelta: 2,
            yarnCommand: '<<set $evidence += 1>>',
          },
          {
            label: '“Check the tide pools for surviving specimens right now!”',
            next: 'field',
            trustDelta: 1,
            yarnCommand: '<<scan_species "Cove4">>',
          },
        ],
      },
      science: {
        speaker: 'RICKY',
        line: 'If we trace the nutrient runoff upstream, we can prove the industrial outfall triggered the Red Tide.',
        choices: [
          {
            label: '“Deploy Pigeon-Bot aerial thermal scan.”',
            next: 'reveal_end',
            trustDelta: 2,
            yarnCommand: '<<reveal_zone "OutfallPipe">>',
          },
        ],
      },
      field: {
        speaker: 'PIGEON-BOT',
        line: 'Three bioluminescent crab species cataloged! Wait—one is carrying synthetic polymer residue.',
        choices: [
          {
            label: '“Follow the residue trail toward the cliffs!”',
            next: 'reveal_end',
            trustDelta: 2,
            yarnCommand: '<<reveal_zone "CliffOutfall">>',
          },
        ],
      },
      reveal_end: {
        speaker: 'NARRATOR',
        line: 'The thermal map locks onto a hidden drainage valve beneath the northern cliffside.',
        ending: 'ACT II UNLOCKED: Source of the Red Tide',
      },
    },
  },
};

export function DialoguePlayer({ projectId }: { projectId: string }) {
  const script = DIALOGUE_SCRIPTS[projectId];
  const [nodeId, setNodeId] = useState(script?.start ?? 'intro');
  const [trust, setTrust] = useState(1);
  const [lastCmd, setLastCmd] = useState('<<start_node "intro">>');

  if (!script) return null;
  const node = script.nodes[nodeId] ?? script.nodes[script.start];

  const choose = (c: DialogueChoice) => {
    setTrust((t) => Math.min(5, t + c.trustDelta));
    setLastCmd(c.yarnCommand ?? `<<jump ${c.next}>>`);
    setNodeId(c.next);
  };

  const reset = () => {
    setNodeId(script.start);
    setTrust(1);
    setLastCmd('<<start_node "intro">>');
  };

  return (
    <div className="mt-6 rounded-2xl border border-violet-200/80 bg-slate-900 p-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-violet-400" />
          <h4 className="text-xs font-semibold tracking-wider text-violet-200 uppercase">
            {script.title}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-emerald-300">
            AFFINITY / EVIDENCE: {'★'.repeat(trust)}
            {'☆'.repeat(5 - trust)}
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            Replay
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-violet-300">{node.speaker}</span>
          <span className="font-mono text-[10px] text-slate-500">{lastCmd}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-100">{node.line}</p>

        {node.choices && (
          <div className="mt-3 space-y-1.5">
            {node.choices.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => choose(c)}
                className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:border-violet-400 hover:bg-slate-800"
              >
                → {c.label}
              </button>
            ))}
          </div>
        )}

        {node.ending && (
          <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-3 py-2 font-mono text-xs font-semibold text-emerald-300">
            {node.ending}
          </div>
        )}
      </div>
    </div>
  );
}
