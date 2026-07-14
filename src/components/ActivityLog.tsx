import type { ActivityEntry } from '../types';
import { Bot, Shield, AlertTriangle, CheckCircle, FileText, Mic } from 'lucide-react';
import { useEffect, useRef } from 'react';

const AGENT_ICONS: Record<string, typeof Bot> = {
  'VoicePrint Agent': Mic,
  'NLP Intent Agent': Bot,
  'Entity Extraction Agent': AlertTriangle,
  'Financial Flow Agent': Shield,
  'Isolation Pattern Agent': Shield,
  'Threat Escalation Agent': AlertTriangle,
  'Credential Request Agent': Shield,
  'Urgency Detector Agent': AlertTriangle,
  'Policy Compliance Agent': CheckCircle,
  'Evidence Compiler': FileText,
};

const AGENT_COLORS: Record<string, string> = {
  'VoicePrint Agent': '#22D3EE',
  'NLP Intent Agent': '#A78BFA',
  'Entity Extraction Agent': '#FBBF24',
  'Financial Flow Agent': '#FF3B4E',
  'Isolation Pattern Agent': '#F97316',
  'Threat Escalation Agent': '#FF3B4E',
  'Credential Request Agent': '#FF3B4E',
  'Urgency Detector Agent': '#FBBF24',
  'Policy Compliance Agent': '#22D3EE',
  'Evidence Compiler': '#34D399',
};

export default function ActivityLog({ entries, isAnimating }: { entries: ActivityEntry[]; isAnimating: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse-glow" />
        <h3 className="font-mono text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
          Agent Activity Log
        </h3>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{ maxHeight: '400px' }}
      >
        {entries.length === 0 && (
          <div className="text-center py-8 text-[#6B7280] text-sm">
            {isAnimating ? 'Initializing agents...' : 'Select a transcript to begin analysis'}
          </div>
        )}
        {entries.map((entry, i) => {
          const Icon = AGENT_ICONS[entry.agent] || Bot;
          const color = AGENT_COLORS[entry.agent] || '#6B7280';
          return (
            <div
              key={entry.id}
              className="animate-slide-in-left flex gap-3 p-3 rounded-2xl border"
              style={{
                animationDelay: `${i * 60}ms`,
                animationFillMode: 'both',
                backgroundColor: `${color}08`,
                borderColor: `${color}20`,
              }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[11px] font-semibold" style={{ color }}>
                    {entry.agent}
                  </span>
                  <span className="font-mono text-[10px] text-[#6B7280]">
                    T+{entry.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#E5E7EB] leading-relaxed">
                  {entry.action}
                </p>
                <div className="mt-1 font-mono text-[10px] text-[#6B7280] truncate">
                  Triggered by: <span style={{ color: `${color}90` }}>{entry.triggeredBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
