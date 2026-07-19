import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { TranscriptScenario } from '../types';

export default function ConfidenceBreakdown({ scenario, visible }: { scenario: TranscriptScenario; visible: boolean }) {
  const [expanded, setExpanded] = useState(true);
  if (!visible || !scenario) return null;

  const analysis = scenario.aiAnalysis;
  const categories = scenario.redFlags.reduce<Record<string, { count: number; maxSeverity: string; phrases: string[] }>>((acc, flag) => {
    if (!acc[flag.category]) acc[flag.category] = { count: 0, maxSeverity: 'LOW', phrases: [] };
    acc[flag.category].count++;
    acc[flag.category].phrases.push(flag.phrase);
    if (flag.severity === 'CRITICAL') acc[flag.category].maxSeverity = 'CRITICAL';
    else if (flag.severity === 'HIGH' && acc[flag.category].maxSeverity !== 'CRITICAL') acc[flag.category].maxSeverity = 'HIGH';
    return acc;
  }, {});

  const severityColors: Record<string, string> = {
    CRITICAL: '#f43f5e',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#10b981',
  };

  return (
    <div className="animate-fade-slide-up" style={{ animationDelay: '60ms', animationFillMode: 'both' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 mb-3 cursor-pointer group"
      >
        <Brain size={16} className="text-blue-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase flex-1 text-left">Confidence Breakdown</h3>
        {expanded ? <ChevronUp size={14} className="text-zinc-600" /> : <ChevronDown size={14} className="text-zinc-600" />}
      </button>

      {expanded && (
        <div className="space-y-2">
          {/* Overall scores */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Confidence', value: analysis.confidence, color: '#3b82f6' },
              { label: 'Scam Probability', value: analysis.scamProbability, color: '#f43f5e' },
              { label: 'Flags Detected', value: scenario.redFlags.length, color: '#8b5cf6', suffix: '' },
            ].map((stat, i) => (
              <div key={i} className="p-2.5 rounded-lg border bg-white/[0.02] border-white/[0.06] text-center">
                <div className="text-[14px] sm:text-[16px] font-bold font-mono" style={{ color: stat.color }}>
                  {stat.value}{stat.suffix !== undefined ? stat.suffix : '%'}
                </div>
                <div className="text-[8px] sm:text-[9px] text-zinc-600 mt-0.5 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div className="space-y-1.5">
            {Object.entries(categories).map(([category, data], i) => {
              const barColor = severityColors[data.maxSeverity] || '#71717a';
              const barWidth = Math.min((data.count / Math.max(scenario.redFlags.length, 1)) * 100, 100);
              return (
                <div key={category} className="animate-fade-slide-up p-2.5 rounded-lg border bg-white/[0.02] border-white/[0.06]"
                  style={{ animationDelay: `${(i + 1) * 30}ms`, animationFillMode: 'both' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-zinc-300">{category}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ background: `${barColor}12`, color: barColor }}>
                      {data.count} {data.count === 1 ? 'flag' : 'flags'}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, background: barColor }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.phrases.map((phrase, pi) => (
                      <span key={pi} className="text-[8px] sm:text-[9px] text-zinc-600 bg-white/[0.04] rounded px-1.5 py-0.5">
                        "{phrase}"
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
