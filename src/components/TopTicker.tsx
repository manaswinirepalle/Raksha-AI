import { useState, useEffect, useRef } from 'react';
import {
  Shield, AlertTriangle, Activity, TrendingDown, ChevronRight,
  Search, Bell, Command,
} from 'lucide-react';
import { getModuleById, type ModuleId } from '../MODULE_REGISTRY';

const MODULE_LABELS: Record<string, string> = Object.fromEntries(
  ['scam-scanner', 'message-checker', 'call-protection', 'safety-center', 'scam-alerts',
   'report-fraud', 'threat-insights', 'scam-trends', 'safety-tips',
   'activity-dashboard', 'reports', 'security-overview', 'help-center', 'contact-support', 'settings']
    .map(id => [id, getModuleById(id as ModuleId)?.label || id])
);

interface TickerStat {
  icon: typeof Shield;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

export default function TopTicker({ activeView }: { activeView: ModuleId }) {
  const [stats, setStats] = useState<TickerStat[]>([
    { icon: Shield, label: 'Scams Intercepted', value: 12847, suffix: '', color: '#3b82f6' },
    { icon: AlertTriangle, label: 'Active Alerts', value: 3291, suffix: '', color: '#f59e0b' },
    { icon: TrendingDown, label: 'False Positive', value: 2.3, suffix: '%', color: '#10b981' },
    { icon: Activity, label: 'Networks Flagged', value: 156, suffix: '', color: '#8b5cf6' },
  ]);

  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * 4);
      setFlashIndex(idx);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlashIndex(null), 600);
      setStats(prev => prev.map((s, i) => i === idx ? {
        ...s,
        value: s.suffix === '%'
          ? Math.round((s.value + (Math.random() * 0.1 - 0.05)) * 10) / 10
          : s.value + Math.floor(Math.random() * 3),
      } : s));
    }, 3000);
    return () => {
      clearInterval(interval);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  return (
    <header className="hidden lg:flex h-14 items-center gap-0 flex-1 min-w-0 flex-shrink-0"
      style={{ background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-5 h-full flex-shrink-0" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[12px] text-zinc-600 font-medium">Dashboard</span>
        <ChevronRight size={12} className="text-zinc-700" />
        <span className="text-[12px] text-zinc-300 font-medium">
          {MODULE_LABELS[activeView] || 'Overview'}
        </span>
      </div>

      {/* Live stats */}
      <div className="flex items-center gap-4 xl:gap-5 px-5 h-full overflow-x-auto no-scrollbar flex-1 min-w-0">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isFlashing = flashIndex === i;
          return (
            <div key={i}
              className="flex items-center gap-2 flex-shrink-0 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-white/[0.02] cursor-default group"
              style={{ background: isFlashing ? `${stat.color}08` : undefined }}>
              <div className="w-5 h-5 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${stat.color}10` }}>
                <Icon size={11} style={{ color: stat.color }} strokeWidth={1.5} />
              </div>
              <span className="text-zinc-500 text-[11px] font-medium whitespace-nowrap group-hover:text-zinc-400 transition-colors duration-200">
                {stat.label}
              </span>
              <span className="font-mono text-[11px] font-semibold tabular-nums transition-all duration-300"
                style={{
                  color: stat.color,
                  textShadow: isFlashing ? `0 0 8px ${stat.color}40` : undefined,
                }}>
                {stat.value.toLocaleString()}{stat.suffix}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 px-3 h-full flex-shrink-0" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer btn-ripple relative overflow-hidden"
          aria-label="Search">
          <Search size={15} strokeWidth={1.5} />
        </button>

        <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-md text-zinc-600 text-[10px] font-mono transition-colors duration-200 hover:text-zinc-500 cursor-default"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Command size={10} />
          <span>K</span>
        </div>

        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer btn-ripple relative overflow-hidden"
          aria-label="Notifications">
          <Bell size={15} strokeWidth={1.5} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 animate-glow-pulse"
            style={{ boxShadow: '0 0 6px rgba(244,63,94,0.4)' }} />
        </button>

        <div className="w-9 h-9 rounded-full flex items-center justify-center ml-1 text-[10px] font-semibold text-zinc-300 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' }}
          aria-label="AI Assistant">
          AI
        </div>
      </div>
    </header>
  );
}
