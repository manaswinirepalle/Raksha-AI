import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, TrendingDown } from 'lucide-react';

interface TickerStat {
  icon: typeof Shield;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

export default function TopTicker() {
  const [stats, setStats] = useState<TickerStat[]>([
    { icon: Shield, label: 'Scams Intercepted Today', value: 12847, suffix: '', color: '#22D3EE' },
    { icon: AlertTriangle, label: 'Alerts Generated', value: 3291, suffix: '', color: '#FBBF24' },
    { icon: TrendingDown, label: 'False Positive Rate', value: 2.3, suffix: '%', color: '#34D399' },
    { icon: Activity, label: 'Networks Flagged', value: 156, suffix: '', color: '#A78BFA' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev =>
        prev.map(s => ({
          ...s,
          value: s.suffix === '%'
            ? Math.round((s.value + (Math.random() * 0.1 - 0.05)) * 10) / 10
            : s.value + Math.floor(Math.random() * 3),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-4 h-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex items-center gap-2">
            <Icon size={14} style={{ color: stat.color }} />
            <span className="text-[#6B7280] text-[11px] font-medium whitespace-nowrap">
              {stat.label}
            </span>
            <span
              className="font-mono text-[12px] font-bold tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value.toLocaleString()}{stat.suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}
