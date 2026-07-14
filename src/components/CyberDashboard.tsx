import type { AnalysisRecord, RiskLevel } from '../types';
import { useEffect, useState, useMemo } from 'react';
import { Shield, BarChart3, ShieldCheck, ShieldAlert, TrendingUp, Activity } from 'lucide-react';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(ts).toLocaleDateString();
}

function scoreColor(score: number): string {
  if (score > 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return '#e11d48';
    case 'HIGH': return '#f97316';
    case 'MEDIUM': return '#f59e0b';
    case 'LOW': return '#22c55e';
  }
}

function riskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
}

export default function CyberDashboard() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('raksha-analysis-history');
      if (raw) {
        const parsed = JSON.parse(raw) as AnalysisRecord[];
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const safe = history.filter(r => r.riskLevel === 'LOW').length;
    const dangerous = history.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;
    const avgScore = total > 0 ? history.reduce((s, r) => s + r.score, 0) / total : 0;
    const safetyScore = Math.round(100 - avgScore);
    return { total, safe, dangerous, safetyScore };
  }, [history]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const days: { date: string; count: number; riskLevels: RiskLevel[] }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      days.push({ date: dateStr, count: 0, riskLevels: [] });
    }
    history.forEach(r => {
      const d = new Date(r.timestamp).toDateString();
      const day = days.find(dy => dy.date === d);
      if (day) {
        day.count++;
        day.riskLevels.push(r.riskLevel);
      }
    });
    const maxCount = Math.max(...days.map(d => d.count), 1);
    return days.map(d => {
      const levelCounts: Record<string, number> = {};
      d.riskLevels.forEach(lv => { levelCounts[lv] = (levelCounts[lv] || 0) + 1; });
      let dominant: RiskLevel = 'LOW';
      let maxLv = 0;
      for (const [lv, cnt] of Object.entries(levelCounts)) {
        if (cnt > maxLv) { maxLv = cnt; dominant = lv as RiskLevel; }
      }
      const dayIndex = new Date(d.date).getDay();
      return { label: DAY_NAMES[dayIndex], count: d.count, heightPct: (d.count / maxCount) * 100, color: riskColor(dominant) };
    });
  }, [history]);

  const riskDist = useMemo(() => {
    const counts: Record<RiskLevel, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    history.forEach(r => { counts[r.riskLevel]++; });
    const total = history.length || 1;
    const levels: { level: RiskLevel; count: number; pct: number; color: string }[] = [
      { level: 'CRITICAL', count: counts.CRITICAL, pct: Math.round((counts.CRITICAL / total) * 100), color: '#e11d48' },
      { level: 'HIGH', count: counts.HIGH, pct: Math.round((counts.HIGH / total) * 100), color: '#f97316' },
      { level: 'MEDIUM', count: counts.MEDIUM, pct: Math.round((counts.MEDIUM / total) * 100), color: '#f59e0b' },
      { level: 'LOW', count: counts.LOW, pct: Math.round((counts.LOW / total) * 100), color: '#22c55e' },
    ];
    return levels;
  }, [history]);

  const recent = useMemo(() => history.slice(-10).reverse(), [history]);

  const circumference = 2 * Math.PI * 56;
  const scoreOffset = circumference - (stats.safetyScore / 100) * circumference;

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <Shield size={40} className="text-blue-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">No Analysis History Yet</h2>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto leading-relaxed">
            Complete your first scam analysis to start tracking your safety insights
          </p>
          <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 transition-colors cursor-default">
            Start Analyzing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Shield size={24} className="text-blue-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Cyber Safety Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Your personal security analytics and protection overview</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BarChart3} label="Total Analyses" value={stats.total} circleColor="#3b82f6" />
          <StatCard icon={ShieldCheck} label="Safe Cases" value={stats.safe} circleColor="#22c55e" />
          <StatCard icon={ShieldAlert} label="Dangerous Cases" value={stats.dangerous} circleColor="#ef4444" />
          <StatCard icon={TrendingUp} label="Personal Safety Score" value={`${stats.safetyScore}%`} circleColor="#06b6d4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weekly Trends */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/[0.06] card-hover">
            <h3 className="text-sm font-semibold text-zinc-200 mb-5 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-400" />
              Weekly Analysis Trends
            </h3>
            <div className="flex items-end justify-between gap-3 h-40">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-zinc-500 font-medium">{day.count}</span>
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(day.heightPct, day.count > 0 ? 4 : 0)}%`,
                      backgroundColor: day.color,
                      opacity: day.count > 0 ? 0.85 : 0.15,
                      minHeight: day.count > 0 ? '8px' : '4px',
                    }}
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] card-hover">
            <h3 className="text-sm font-semibold text-zinc-200 mb-5 flex items-center gap-2">
              <ShieldAlert size={16} className="text-blue-400" />
              Risk Distribution
            </h3>
            <div className="space-y-4">
              {riskDist.map(({ level, count, pct, color }) => (
                <div key={level}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-zinc-300">{level}</span>
                    <span className="text-xs text-zinc-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/[0.06] card-hover">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              Recent Analyses
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 text-xs border-b border-white/[0.06]">
                    <th className="pb-3 font-medium">Scenario</th>
                    <th className="pb-3 font-medium">Risk Level</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(r => (
                    <tr key={r.id} className="border-b border-white/[0.03]">
                      <td className="py-3 pr-3 text-zinc-200 truncate max-w-[160px]">{r.scenarioLabel}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border ${riskBadgeClass(r.riskLevel)}`}>
                          {r.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">{r.score}</td>
                      <td className="py-3 text-right text-zinc-500 text-[11px] whitespace-nowrap">{relativeTime(r.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety Score Ring */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] card-hover flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-zinc-200 mb-5 self-start flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              Safety Score
            </h3>
            <div className="relative flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 128 128" className="transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={scoreColor(stats.safetyScore)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={scoreOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-zinc-100" style={{ color: scoreColor(stats.safetyScore) }}>
                  {stats.safetyScore}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Your Safety Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, circleColor }: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  circleColor: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] card-hover flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${circleColor}14` }}
      >
        <Icon size={20} className="text-zinc-100" style={{ color: circleColor }} />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-zinc-100">{value}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
