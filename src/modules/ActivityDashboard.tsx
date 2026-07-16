import { useState, useMemo } from 'react';
import {
  Activity, Shield, AlertTriangle, FileText, Clock,
  Cpu, HardDrive, Wifi, Server, RefreshCw, Loader2,
  Eye, TrendingUp, Zap, Database, Ban,
  ShieldCheck, Globe,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface ActivityItem {
  id: string;
  type: 'scan' | 'alert' | 'report' | 'blocked';
  title: string;
  timestamp: string;
  timeRaw: number;
  status: 'success' | 'warning' | 'error' | 'info';
  details: string;
  category: string;
}

interface SystemMetric {
  label: string;
  value: number;
  color: string;
  icon: typeof Cpu;
}

interface ThreatCategory {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'scan', title: 'SMS analyzed — Phishing detected', timestamp: '2 min ago', timeRaw: 120, status: 'warning', details: 'Banking phishing link detected and quarantined', category: 'Phishing' },
  { id: '2', type: 'blocked', title: 'Number blocked — Spam caller', timestamp: '15 min ago', timeRaw: 900, status: 'success', details: '+91-9876543210 added to permanent blocklist', category: 'Spam' },
  { id: '3', type: 'alert', title: 'New scam alert — UPI fraud wave', timestamp: '42 min ago', timeRaw: 2520, status: 'info', details: 'Trending scam pattern reported in your region', category: 'UPI Fraud' },
  { id: '4', type: 'scan', title: 'WhatsApp message checked — Safe', timestamp: '1h ago', timeRaw: 3600, status: 'success', details: 'No scam indicators found in message content', category: 'Messaging' },
  { id: '5', type: 'report', title: 'Fraud report submitted to Cyber Cell', timestamp: '1.5h ago', timeRaw: 5400, status: 'info', details: 'Report RPT-A7X2 filed for fake investment scam', category: 'Reporting' },
  { id: '6', type: 'blocked', title: 'URL blocked — Phishing site', timestamp: '2h ago', timeRaw: 7200, status: 'success', details: 'secure-pay-verify.com blocked by DNS filter', category: 'Phishing' },
  { id: '7', type: 'scan', title: 'Email analyzed — Spam detected', timestamp: '3h ago', timeRaw: 10800, status: 'warning', details: 'Lottery prize scam email quarantined automatically', category: 'Email Scam' },
  { id: '8', type: 'alert', title: 'Threat level elevated — Your district', timestamp: '4h ago', timeRaw: 14400, status: 'error', details: 'Cybercrime reports up 34% in your area this week', category: 'Regional Alert' },
  { id: '9', type: 'scan', title: 'Call analyzed — Robocall detected', timestamp: '6h ago', timeRaw: 21600, status: 'warning', details: 'Automated scam call flagged and logged to database', category: 'Call Fraud' },
  { id: '10', type: 'report', title: 'Weekly security report generated', timestamp: '8h ago', timeRaw: 28800, status: 'info', details: '47 scans, 8 threats blocked, safety score: 91/100', category: 'Reporting' },
  { id: '11', type: 'blocked', title: 'App blocked — Malicious APK', timestamp: '12h ago', timeRaw: 43200, status: 'success', details: 'loan-quick.apk flagged as banking trojan', category: 'Malware' },
  { id: '12', type: 'scan', title: 'UPI ID verified — Suspicious merchant', timestamp: '1d ago', timeRaw: 86400, status: 'warning', details: 'Merchant linked to 3 prior fraud complaints', category: 'UPI Fraud' },
];

const SYSTEM_METRICS: SystemMetric[] = [
  { label: 'CPU Usage', value: 34, color: '#3b82f6', icon: Cpu },
  { label: 'Memory', value: 62, color: '#8b5cf6', icon: Server },
  { label: 'Network I/O', value: 28, color: '#06b6d4', icon: Wifi },
  { label: 'Storage', value: 71, color: '#f59e0b', icon: HardDrive },
];

const WEEKLY_DATA = [
  { day: 'Mon', scans: 42, threats: 8 },
  { day: 'Tue', scans: 56, threats: 12 },
  { day: 'Wed', scans: 38, threats: 6 },
  { day: 'Thu', scans: 67, threats: 15 },
  { day: 'Fri', scans: 51, threats: 9 },
  { day: 'Sat', scans: 29, threats: 4 },
  { day: 'Sun', scans: 34, threats: 7 },
];

const THREAT_CATEGORIES: ThreatCategory[] = [
  { name: 'Phishing & Smishing', count: 184, percentage: 78, color: '#ef4444' },
  { name: 'UPI / Payment Fraud', count: 127, percentage: 54, color: '#f97316' },
  { name: 'Spam Calls', count: 96, percentage: 41, color: '#f59e0b' },
  { name: 'Fake Investment Scams', count: 73, percentage: 31, color: '#8b5cf6' },
  { name: 'Malware & Phishing URLs', count: 58, percentage: 25, color: '#3b82f6' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'All Activity' },
  { key: 'scan', label: 'Scans' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'alert', label: 'Alerts' },
  { key: 'report', label: 'Reports' },
] as const;

const TYPE_ICONS: Record<string, typeof Shield> = {
  scan: Eye,
  alert: AlertTriangle,
  report: FileText,
  blocked: Ban,
};

const STATUS_COLORS: Record<string, string> = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export default function ActivityDashboard() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return ACTIVITIES;
    return ACTIVITIES.filter(a => a.type === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    totalScans: 247,
    threatsBlocked: 61,
    reportsFiled: 12,
    uptime: '99.97%',
  }), []);

  const maxScans = useMemo(() => Math.max(...WEEKLY_DATA.map(d => d.scans)), []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Activity feed refreshed', 'success');
    }, 1200);
  };

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-blue-500/10">
            <Activity size={16} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Activity Dashboard</h2>
            <p className="db-subtitle">Real-time scans, alerts, and protection activity</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleRefresh} disabled={refreshing} className="db-btn">
            {refreshing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="db-stats">
        {[
          { label: 'Total Scans', value: stats.totalScans, icon: Eye, color: '#3b82f6', change: '+38 today' },
          { label: 'Threats Blocked', value: stats.threatsBlocked, icon: ShieldCheck, color: '#10b981', change: '+8 today' },
          { label: 'Reports Filed', value: stats.reportsFiled, icon: FileText, color: '#8b5cf6', change: '+2 today' },
          { label: 'Uptime', value: stats.uptime, icon: Zap, color: '#06b6d4', change: 'Last 30 days' },
        ].map((s, i) => (
          <div key={i} className="db-stat">
            <div className="db-stat-icon" style={{ background: `${s.color}15` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div>
              <span className="db-stat-value">{s.value}</span>
              <span className="db-stat-label">{s.label}</span>
              <span className="text-[8px] text-zinc-600 block">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-grid-2-1" style={{ gap: '12px' }}>
        <div className="db-section">
          <div className="db-section-header">
            <span className="db-section-title">
              <Clock size={12} style={{ color: '#71717a' }} />
              Recent Activity
            </span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`db-btn ${filter === f.key ? 'db-btn-primary' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '10px' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="db-card glass-panel-strong" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="relative">
              <div
                style={{
                  position: 'absolute',
                  left: '23px',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                }}
              />
              <div style={{ padding: '8px 0', maxHeight: '440px', overflowY: 'auto' }}>
                {filtered.map((item) => {
                  const Icon = TYPE_ICONS[item.type] || Shield;
                  const color = STATUS_COLORS[item.status];
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 14px',
                        transition: 'background 200ms ease',
                        cursor: 'default',
                      }}
                      className="group"
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <div
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: color,
                          marginTop: '4px',
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${color}40`,
                          marginLeft: '14px',
                          zIndex: 1,
                        }}
                      />
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: `${color}10`,
                          border: `1px solid ${color}15`,
                        }}
                      >
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: '#e4e4e7' }}>{item.title}</span>
                          <span
                            style={{
                              fontSize: '8px',
                              padding: '1px 6px',
                              borderRadius: '9999px',
                              background: `${color}10`,
                              color,
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {item.category}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#71717a', lineHeight: 1.4 }}>{item.details}</span>
                      </div>
                      <span style={{ fontSize: '9px', color: '#52525b', flexShrink: 0, whiteSpace: 'nowrap', paddingTop: '2px' }}>
                        {item.timestamp}
                      </span>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#52525b' }}>No activity matches this filter</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="db-section">
          <div className="db-section-header">
            <span className="db-section-title">
              <Server size={12} style={{ color: '#71717a' }} />
              System Health
            </span>
            <span style={{ fontSize: '9px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'gentlePulse 2s ease-in-out infinite' }} />
              All Systems Operational
            </span>
          </div>
          <div className="db-card glass-panel-strong" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SYSTEM_METRICS.map((metric, i) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${metric.color}10`,
                          }}
                        >
                          <MetricIcon size={12} style={{ color: metric.color }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>{metric.label}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#fafafa', fontVariantNumeric: 'tabular-nums' }}>
                        {metric.value}%
                      </span>
                    </div>
                    <div className="progress-premium" style={{ height: '6px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${metric.value}%`,
                          background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                        }}
                      />
                      <div
                        className="progress-glow"
                        style={{ background: metric.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="db-divider" style={{ margin: '14px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Active Connections', value: '1,247', icon: Globe, color: '#3b82f6' },
                { label: 'Requests/min', value: '342', icon: TrendingUp, color: '#10b981' },
                { label: 'Database Size', value: '2.4 GB', icon: Database, color: '#8b5cf6' },
                { label: 'Blocked IPs', value: '891', icon: Ban, color: '#ef4444' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <item.icon size={11} style={{ color: item.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7', display: 'block' }}>{item.value}</span>
                    <span style={{ fontSize: '8px', color: '#71717a' }}>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title">
            <BarChartIcon />
            Weekly Scan Summary
          </span>
          <span style={{ fontSize: '9px', color: '#52525b' }}>Jul 7 — Jul 13, 2026</span>
        </div>
        <div className="db-card glass-panel">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', padding: '0 4px' }}>
            {WEEKLY_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', flex: 1, width: '100%', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '14px',
                      height: `${(d.scans / maxScans) * 100}%`,
                      minHeight: '4px',
                      borderRadius: '4px 4px 2px 2px',
                      background: 'linear-gradient(180deg, #3b82f6 0%, #3b82f680 100%)',
                      transition: 'height 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: '14px',
                      height: `${(d.threats / maxScans) * 100}%`,
                      minHeight: '3px',
                      borderRadius: '4px 4px 2px 2px',
                      background: 'linear-gradient(180deg, #ef4444 0%, #ef444480 100%)',
                      transition: 'height 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '9px', color: '#71717a', fontWeight: 500 }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#3b82f6', display: 'inline-block' }} />
              <span style={{ fontSize: '10px', color: '#71717a' }}>Scans</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ fontSize: '10px', color: '#71717a' }}>Threats Blocked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title">
            <Shield size={12} style={{ color: '#71717a' }} />
            Top Threat Categories
          </span>
          <span style={{ fontSize: '9px', color: '#52525b' }}>Last 30 days</span>
        </div>
        <div className="db-card glass-panel-strong">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {THREAT_CATEGORIES.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: cat.color,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#d4d4d8' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#71717a' }}>{cat.count.toLocaleString()} incidents</span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: cat.color,
                        fontVariantNumeric: 'tabular-nums',
                        minWidth: '28px',
                        textAlign: 'right',
                      }}
                    >
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
                <div className="progress-premium" style={{ height: '5px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      background: `linear-gradient(90deg, ${cat.color}60, ${cat.color})`,
                    }}
                  />
                  <div
                    className="progress-glow"
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
