import { Brain } from 'lucide-react';
import type { AIAnalysis } from '../types';

export default function AIExplanation({ analysis, visible = true }: { analysis: AIAnalysis; visible?: boolean }) {
  if (!visible) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div
        className="animate-fade-slide-up flex items-center gap-2"
        style={{ animationDelay: '0ms', animationFillMode: 'both' }}
      >
        <Brain size={16} className="text-blue-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">AI Deep Analysis</h3>
      </div>

      <div
        className="animate-fade-slide-up p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06]"
        style={{ animationDelay: '60ms', animationFillMode: 'both' }}
      >
        <p className="text-sm sm:text-[13px] text-zinc-300 leading-relaxed">{analysis.deepReasoning}</p>
      </div>

      <div
        className="animate-fade-slide-up grid grid-cols-1 sm:grid-cols-2 gap-3"
        style={{ animationDelay: '120ms', animationFillMode: 'both' }}
      >
        <div className="p-4 rounded-xl border bg-white/[0.03] border-white/[0.06]">
          <h4 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-red-400 uppercase mb-3">Psychological Tricks</h4>
          <ol className="space-y-2">
            {analysis.psychologicalTricks.map((trick, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
                <span className="font-mono text-[11px] font-bold text-red-400 mt-0.5 flex-shrink-0">{i + 1}</span>
                <span>{trick}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-4 rounded-xl border bg-white/[0.03] border-white/[0.06]">
          <h4 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-green-400 uppercase mb-3">Safe Actions</h4>
          <ol className="space-y-2">
            {analysis.safeActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
                <span className="font-mono text-[11px] font-bold text-green-400 mt-0.5 flex-shrink-0">{i + 1}</span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        className="animate-fade-slide-up p-4 rounded-xl border bg-white/[0.03] border-white/[0.06]"
        style={{ animationDelay: '180ms', animationFillMode: 'both' }}
      >
        <h4 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-yellow-400 uppercase mb-2">What Victims Usually Do</h4>
        <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">{analysis.victimBehavior}</p>
      </div>

      <div
        className="animate-fade-slide-up p-4 rounded-xl border bg-white/[0.03] border-white/[0.06]"
        style={{ animationDelay: '240ms', animationFillMode: 'both' }}
      >
        <h4 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-blue-400 uppercase mb-2">Prevention Advice</h4>
        <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">{analysis.preventionAdvice}</p>
      </div>
    </div>
  );
}
