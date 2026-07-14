import { Shield, Brain, Zap, Eye, Lock, AlertTriangle } from 'lucide-react';
import type { AIInsight } from '../types';

const ICON_MAP: Record<string, typeof Shield> = {
  shield: Shield,
  brain: Brain,
  zap: Zap,
  eye: Eye,
  lock: Lock,
  alertTriangle: AlertTriangle,
};

export default function AIInsights({ insights, visible = true }: { insights: AIInsight[]; visible?: boolean }) {
  if (!visible || insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
      {insights.map((insight, i) => {
        const Icon = ICON_MAP[insight.icon] || Shield;
        return (
          <div
            key={insight.id}
            className="animate-fade-slide-up p-3.5 sm:p-4 rounded-xl border bg-white/[0.03] border-white/[0.06] flex items-center gap-3"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${insight.color}14` }}
            >
              <Icon size={16} style={{ color: insight.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider truncate">{insight.label}</p>
              <p className="text-xs text-zinc-300 mt-0.5 truncate">{insight.value}</p>
              <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${insight.score}%`,
                    backgroundColor: insight.color,
                    boxShadow: `0 0 8px ${insight.color}60`,
                    transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
            <span className="font-mono text-sm font-bold flex-shrink-0" style={{ color: insight.color }}>
              {insight.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
