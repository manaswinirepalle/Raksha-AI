import { Sparkles, AlertTriangle, PhoneOff, Shield, FileText } from 'lucide-react';
import type { RiskLevel } from '../types';

const RISK_BORDER: Record<RiskLevel, string> = {
  LOW: '#10b981',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#f43f5e',
};

const CARD_ICONS = [AlertTriangle, PhoneOff, Shield, FileText];

export default function Recommendations({ recommendations, riskLevel, visible = true }: { recommendations: string[]; riskLevel: RiskLevel; visible?: boolean }) {
  if (!visible || recommendations.length === 0) return null;

  const border = RISK_BORDER[riskLevel];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-blue-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">AI Recommendations</h3>
      </div>

      <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
        {recommendations.map((rec, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            <div
              key={i}
              className="animate-fade-slide-up p-3.5 sm:p-4 rounded-xl border bg-white/[0.03] border-white/[0.06] flex items-start gap-3"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: 'both',
                borderLeftWidth: '3px',
                borderLeftColor: border,
              }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${border}12` }}>
                <Icon size={14} style={{ color: border }} />
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed pt-1">{rec}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
