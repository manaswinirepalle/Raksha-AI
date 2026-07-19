import { ShieldAlert, Phone, Globe, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { RiskLevel } from '../types';

interface ActionItem {
  icon: typeof Phone;
  label: string;
  detail: string;
  color: string;
  urgent?: boolean;
  link?: string;
}

const ACTIONS: Record<RiskLevel, ActionItem[]> = {
  CRITICAL: [
    { icon: Phone, label: 'Call 1930 Now', detail: 'National Cyber Crime Helpline — available 24/7', color: '#f43f5e', urgent: true, link: 'tel:1930' },
    { icon: ShieldAlert, label: 'Alert Your Bank', detail: 'Freeze accounts if you shared any financial details', color: '#f97316', urgent: true },
    { icon: Globe, label: 'Report on cybercrime.gov.in', detail: 'File an NCRB complaint within 24 hours for best recovery chances', color: '#3b82f6' },
    { icon: FileText, label: 'Save Evidence Screenshot', detail: 'Screenshot this analysis — it admissible under IT Act Section 65B', color: '#8b5cf6' },
    { icon: CheckCircle2, label: 'Block the Caller', detail: 'Block the scammer\'s number on your phone and WhatsApp immediately', color: '#10b981' },
  ],
  HIGH: [
    { icon: Phone, label: 'Call 1930', detail: 'Report the suspicious contact to Cyber Crime Helpline', color: '#f97316', urgent: true, link: 'tel:1930' },
    { icon: ShieldAlert, label: 'Do Not Engage Further', detail: 'Hang up and do not respond to any follow-up messages', color: '#f43f5e', urgent: true },
    { icon: Globe, label: 'Verify Independently', detail: 'Call the organization directly using their official website number', color: '#3b82f6' },
    { icon: FileText, label: 'Save This Report', detail: 'Keep this analysis for your records and potential future complaint', color: '#8b5cf6' },
  ],
  MEDIUM: [
    { icon: ShieldAlert, label: 'Stay Cautious', detail: 'Verify the caller\'s identity through official channels before acting', color: '#eab308' },
    { icon: Globe, label: 'Check Official Sources', detail: 'Visit the organization\'s official website or app to confirm claims', color: '#3b82f6' },
    { icon: FileText, label: 'Save Analysis', detail: 'Keep this report for reference if the contact escalates', color: '#8b5cf6' },
  ],
  LOW: [
    { icon: CheckCircle2, label: 'This Appears Safe', detail: 'No immediate action required — stay vigilant', color: '#10b981' },
    { icon: ShieldAlert, label: 'Keep Monitoring', detail: 'Always verify unexpected contacts through official channels', color: '#3b82f6' },
  ],
};

export default function WhatToDoNext({ riskLevel, visible }: { riskLevel: RiskLevel; visible: boolean }) {
  if (!visible) return null;
  const actions = ACTIONS[riskLevel];

  return (
    <div className="space-y-3">
      <div className="animate-fade-slide-up flex items-center gap-2" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
        <ShieldAlert size={16} className="text-blue-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">What To Do Next</h3>
      </div>

      <div className="space-y-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <div
              key={i}
              className="animate-fade-slide-up flex items-start gap-3 p-3 rounded-xl border bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
              style={{ animationDelay: `${(i + 1) * 60}ms`, animationFillMode: 'both' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${action.color}12`, border: `1px solid ${action.color}20` }}
              >
                <Icon size={14} style={{ color: action.color }} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-zinc-200">{action.label}</span>
                  {action.urgent && (
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Urgent</span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed mt-0.5">{action.detail}</p>
              </div>
              {action.link && (
                <a
                  href={action.link}
                  className="flex-shrink-0 mt-2 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                  aria-label={`Call ${action.label}`}
                >
                  <ExternalLink size={12} className="text-zinc-500" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
