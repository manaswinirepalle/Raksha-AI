import { GraduationCap } from 'lucide-react';
import type { TranscriptScenario } from '../types';

const STEP_COLORS = ['#3b82f6', '#f97316', '#f43f5e', '#eab308', '#10b981'];

export default function LearningMode({ scenario, visible = true }: { scenario: TranscriptScenario | null; visible?: boolean }) {
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
      content: `Escalation tactics: ${middleLines || 'The scammer uses urgency and social engineering to build psychological pressure on the victim.'}`,
    },
    {
      title: 'The Ask',
      content: `Financial extraction attempt: ${askLines || 'The scammer demands money, credentials, or sensitive information from the victim.'}`,
    },
    {
      title: 'Red Flags Detected',
      content: redFlags.length > 0
        ? redFlags.map((f) => `• "${f.phrase}" — ${f.category} (${f.severity} severity)`).join('\n')
        : 'No specific red flags detected in this transcript.',
    },
    {
      title: 'How to Stay Safe',
      content: scenario.aiAnalysis.preventionAdvice,
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap size={16} className="text-blue-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">AI Learning Mode</h3>
      </div>

      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        {steps.map((step, i) => {
          const color = STEP_COLORS[i];
          return (
            <div
              key={i}
              className="animate-fade-slide-up p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06]"
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: 'both',
                borderLeftWidth: '3px',
                borderLeftColor: color,
              }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {i + 1}
                </div>
                <h4 className="text-sm sm:text-[13px] font-semibold text-zinc-200">{step.title}</h4>
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed whitespace-pre-line">{step.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
