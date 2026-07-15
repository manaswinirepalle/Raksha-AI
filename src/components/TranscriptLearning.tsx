import { GraduationCap, AlertTriangle, Shield, Brain, Eye, CheckCircle } from 'lucide-react';
import type { TranscriptScenario } from '../types';

const STEP_COLORS = ['#3b82f6', '#f97316', '#f43f5e', '#eab308', '#10b981'];
const STEP_ICONS = [Eye, Brain, AlertTriangle, Shield, CheckCircle];

export default function TranscriptLearning({ scenario, visible = true }: { scenario: TranscriptScenario | null; visible?: boolean }) {
  if (!visible) return null;

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-3">
        <GraduationCap size={32} className="text-zinc-600" />
        <p className="font-mono text-xs text-zinc-600 text-center">Select a scenario to enter learning mode</p>
      </div>
    );
  }

  const { transcript, redFlags } = scenario;
  const midIdx = Math.floor(transcript.length / 2);
  const firstLine = transcript[0]?.text || '';
  const middleLines = transcript.slice(1, midIdx).map((l) => l.text).join(' ');
  const askLines = transcript.slice(midIdx).map((l) => l.text).join(' ');

  const steps = [
    {
      title: 'The Hook',
      content: `The scammer initiates contact with: "${firstLine}" This is the opening move designed to grab attention and establish credibility.`,
    },
    {
      title: 'Building Pressure',
      content: `The scammer escalates with: "${middleLines}" They create urgency and fear to prevent rational thinking.`,
    },
    {
      title: 'The Ask',
      content: `The scammer makes their demand: "${askLines}" This is where the actual fraud attempt occurs — requesting money, information, or access.`,
    },
    {
      title: 'Red Flags Identified',
      content: redFlags.length > 0
        ? `${redFlags.length} red flags detected: ${redFlags.map((r) => r.phrase).join(', ')}. These are the key indicators that this is a scam.`
        : 'No significant red flags detected in this transcript.',
    },
    {
      title: 'How to Stay Safe',
      content: scenario.aiAnalysis.safeActions?.join(' • ') || 'Always verify independently. Never share personal information under pressure. Report suspicious contacts to 1930.',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2">
        <GraduationCap size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Learning Mode</h3>
        <span className="text-[10px] font-mono text-zinc-600">— Understanding the scam step by step</span>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i] || Eye;
          return (
            <div
              key={i}
              className="glass-panel rounded-xl p-4 sm:p-5"
              style={{
                borderLeft: `3px solid ${STEP_COLORS[i]}`,
                animation: `fadeSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms both`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${STEP_COLORS[i]}15` }}
                >
                  <Icon size={14} style={{ color: STEP_COLORS[i] }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: STEP_COLORS[i] }}>
                      Step {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-zinc-200">{step.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
