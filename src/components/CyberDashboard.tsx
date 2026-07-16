import type { AnalysisRecord, RiskLevel } from '../types';
import { useEffect, useState } from 'react';
import { BarChart3, ShieldAlert, ShieldCheck, TrendingUp, Activity, Clock, AlertTriangle, FileText, Zap } from 'lucide-react';

const MOCK_WEEKLY = [
  { label: 'Mon', scans: 187 },
  { label: 'Tue', scans: 234 },
  { label: 'Wed', scans: 156 },
  { label: 'Thu', scans: 289 },
  { label: 'Fri', scans: 198 },
  { label: 'Sat', scans: 102 },
  { label: 'Sun', scans: 81 },
];

const MOCK_RISK_DIST: { level: RiskLevel; count: number; pct: number; color: string }[] = [
  { level: 'CRITICAL', count: 41, pct: 12, color: '#e11d48' },
  { level: 'HIGH', count: 78, pct: 23, color: '#f97316' },
  { level: 'MEDIUM', count: 124, pct: 37, color: '#f59e0b' },
  { level: 'LOW', count: 69, pct: 28, color: '#22c55e' },
];

const MOCK_CATEGORIES = [
  { name: 'Phishing', pct: 34 },
  { name: 'UPI Fraud', pct: 27 },
  { name: 'KYC Scam', pct: 19 },
  { name: 'Tech Support', pct: 11 },
  { name: 'Lottery/Prize', pct: 6 },
  { name: 'Loan Scam', pct: 3 },
];

const MOCK_RECENT: { id: string; scenario: string; risk: RiskLevel; score: number; time: string }[] = [
  { id: 'r1', scenario: 'Suspicious UPI Payment Request', risk: 'CRITICAL', score: 94, time: '2 min ago' },
  { id: 'r2', scenario: 'Fake Bank KYC Verification', risk: 'HIGH', score: 81, time: '18 min ago' },
  { id: 'r3', scenario: 'WhatsApp Lottery Notification', risk: 'MEDIUM', score: 62, time: '1 hour ago' },
  { id: 'r4', scenario: 'Phishing Email - Amazon Refund', risk: 'HIGH', score: 88, time: '3 hours ago' },
  { id: 'r5', scenario: 'Genuine Bank Statement', risk: 'LOW', score: 12, time: '5 hours ago' },
];

function riskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
}

export default function CyberDashboard() {
  const [, setHistory] = useState<AnalysisRecord[]>([]);

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

  const maxScans = Math.max(...MOCK_WEEKLY.map(d => d.scans));
  const circumference = 2 * Math.PI * 56;
  const donutCircumference = 2 * Math.PI * 72;

  const riskArcs = (() => {
    let accumulated = 0;
    return MOCK_RISK_DIST.map(item => {
      const dashLength = (item.pct / 100) * donutCircumference;
      const offset = accumulated;
      accumulated += dashLength;
      return { ...item, dashArray: `${dashLength} ${donutCircumference - dashLength}`, dashOffset: -offset };
    });
  })();

  return (
    <div className="db-page">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

        <div className="db-header">
          <div className="db-header-icon">
            <BarChart3 size={24} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h1 className="db-title">Analytics Dashboard</h1>
            <p className="db-subtitle">Comprehensive scam detection insights and protection metrics</p>
          </div>
        </div>

        <div className="db-stats">
          <div className="db-stat">
            <div className="db-stat-icon" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
              <Zap size={20} className="text-blue-400" />
            </div>
            <div className="db-stat-value">1,247</div>
            <div className="db-stat-label">Scans Today</div>
          </div>
          <div className="db-stat">
            <div className="db-stat-icon" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
              <ShieldAlert size={20} className="text-rose-400" />
            </div>
            <div className="db-stat-value">312</div>
            <div className="db-stat-label">Threats Blocked</div>
          </div>
          <div className="db-stat">
            <div className="db-stat-icon" style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
              <FileText size={20} className="text-green-400" />
            </div>
            <div className="db-stat-value">89</div>
            <div className="db-stat-label">Reports Generated</div>
          </div>
          <div className="db-stat">
            <div className="db-stat-icon" style={{ backgroundColor: 'rgba(168,85,247,0.1)' }}>
              <Clock size={20} className="text-purple-400" />
            </div>
            <div className="db-stat-value">0.3s</div>
            <div className="db-stat-label">Avg Response Time</div>
          </div>
        </div>

        <div className="db-grid-3">
          <div className="db-section lg:col-span-2">
            <div className="db-section-header">
              <BarChart3 size={16} className="text-blue-400" />
              <span className="db-section-title">Scan Activity — Last 7 Days</span>
            </div>
            <div className="db-card">
              <div className="flex items-end justify-between gap-2 sm:gap-3 h-48 pt-4">
                {MOCK_WEEKLY.map((day, i) => {
                  const heightPct = (day.scans / maxScans) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-zinc-500 font-medium tabular-nums">{day.scans}</span>
                      <div
                        className="w-full rounded-lg transition-all duration-500"
                        style={{
                          height: `${heightPct}%`,
                          background: 'linear-gradient(180deg, rgba(59,130,246,0.9) 0%, rgba(59,130,246,0.4) 100%)',
                          minHeight: '6px',
                        }}
                      />
                      <span className="text-[10px] text-zinc-500 font-medium">{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="db-section">
            <div className="db-section-header">
              <AlertTriangle size={16} className="text-blue-400" />
              <span className="db-section-title">Risk Level Breakdown</span>
            </div>
            <div className="db-card flex flex-col items-center">
              <div className="relative flex items-center justify-center mb-5">
                <svg width="164" height="164" viewBox="0 0 164 164">
                  <circle cx="82" cy="82" r="72" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                  {riskArcs.map(arc => (
                    <circle
                      key={arc.level}
                      cx="82"
                      cy="82"
                      r="72"
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="12"
                      strokeDasharray={arc.dashArray}
                      strokeDashoffset={arc.dashOffset}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '82px 82px' }}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-zinc-100">312</span>
                  <span className="text-[10px] text-zinc-500">Total Threats</span>
                </div>
              </div>
              <div className="w-full space-y-2.5">
                {MOCK_RISK_DIST.map(item => (
                  <div key={item.level} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-zinc-300">{item.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{item.count}</span>
                      <span className="text-[10px] text-zinc-600 w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="db-grid-3">
          <div className="db-section lg:col-span-2">
            <div className="db-section-header">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="db-section-title">Top Scam Categories</span>
            </div>
            <div className="db-card space-y-4">
              {MOCK_CATEGORIES.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-zinc-300">{cat.name}</span>
                    <span className="text-xs text-zinc-500 tabular-nums">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.pct}%`,
                        background: `linear-gradient(90deg, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.5) 100%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="db-section">
            <div className="db-section-header">
              <ShieldCheck size={16} className="text-blue-400" />
              <span className="db-section-title">Safety Score</span>
            </div>
            <div className="db-card flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 128 128" className="transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (82 / 100) * circumference}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-green-400">82</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Protection Index</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center max-w-[180px] leading-relaxed">
                Your system is well-protected against known scam patterns
              </p>
            </div>
          </div>
        </div>

        <div className="db-section">
          <div className="db-section-header">
            <Activity size={16} className="text-blue-400" />
            <span className="db-section-title">Recent Analysis</span>
          </div>
          <div className="glass-panel-strong rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 text-xs border-b border-white/[0.06]">
                    <th className="px-5 py-3 font-medium">Scenario</th>
                    <th className="px-5 py-3 font-medium">Risk Level</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RECENT.map(row => (
                    <tr key={row.id} className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-zinc-200 truncate max-w-[220px]">{row.scenario}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border ${riskBadgeClass(row.risk)}`}>
                          {row.risk}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-300 tabular-nums">{row.score}</td>
                      <td className="px-5 py-3.5 text-zinc-500 text-[11px] whitespace-nowrap text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
