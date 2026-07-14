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
  'VoicePrint Agent': '#3b82f6',
  'NLP Intent Agent': '#8b5cf6',
  'Entity Extraction Agent': '#f59e0b',
  'Financial Flow Agent': '#f43f5e',
  'Isolation Pattern Agent': '#f97316',
  'Threat Escalation Agent': '#f43f5e',
  'Credential Request Agent': '#f43f5e',
  'Urgency Detector Agent': '#f59e0b',
  'Policy Compliance Agent': '#3b82f6',
  'Evidence Compiler': '#10b981',
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
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3 px-1">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-pulse-glow" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">
          Agent Activity Log
        </h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-1 mobile-scroll" style={{ maxHeight: '400px' }}>
        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Bot size={16} className="text-zinc-600" strokeWidth={1} />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mb-0.5">
              {isAnalyzing ? 'Initializing agents...' : 'Select a transcript to begin analysis'}
            </p>
            <p className="text-[10px] text-zinc-600">
              {isAnalyzing ? 'Multi-agent pipeline starting up' : 'Agent activity will appear here in real-time'}
            </p>
          </div>
        )}
        {entries.map((entry, i) => {
          const Icon = AGENT_ICONS[entry.agent] || Bot;
          const color = AGENT_COLORS[entry.agent] || '#52525b';
          return (
            <div key={entry.id}
              className="animate-slide-in-left flex gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border"
              style={{
                animationDelay: `${i * 60}ms`,
                animationFillMode: 'both',
                backgroundColor: `${color}06`,
                borderColor: `${color}18`,
              }}>
              <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center mt-0.5" style={{ backgroundColor: `${color}12` }}>
                <Icon size={12} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                  <span className="font-mono text-[10px] sm:text-[11px] font-medium truncate" style={{ color }}>{entry.agent}</span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 flex-shrink-0">T+{entry.timestamp}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-200 leading-relaxed">{entry.action}</p>
                <div className="mt-1 font-mono text-[9px] sm:text-[10px] text-zinc-500 truncate">
                  Triggered by: <span style={{ color: `${color}cc` }}>{entry.triggeredBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
