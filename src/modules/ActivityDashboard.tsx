import { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, Shield, AlertTriangle,
  RefreshCw, Loader2,
  Eye,
} from 'lucide-react';
import { useToast } from '../components/Toast';


interface ActivityItem {
  id: string;
  type: 'scan' | 'alert' | 'report' | 'blocked';
  title: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  details: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'scan', title: 'SMS analyzed — Phishing detected', timestamp: '2 min ago', status: 'warning', details: 'Banking phishing link detected and blocked' },
  { id: '2', type: 'blocked', title: 'Number blocked — Spam caller', timestamp: '15 min ago', status: 'success', details: '+91-9876543210 added to blocklist' },
  { id: '3', type: 'alert', title: 'New scam alert — UPI fraud wave', timestamp: '1h ago', status: 'info', details: 'Trending scam in your region' },
  { id: '4', type: 'scan', title: 'WhatsApp message checked — Safe', timestamp: '2h ago', status: 'success', details: 'No scam indicators found' },
  { id: '5', type: 'report', title: 'Fraud report submitted', timestamp: '3h ago', status: 'info', details: 'Report RPT-A7X2 filed for UPI scam' },
  { id: '6', type: 'blocked', title: 'URL blocked — Phishing site', timestamp: '5h ago', status: 'success', details: 'fake-bank.com blocked by DNS filter' },
  { id: '7', type: 'scan', title: 'Email analyzed — Spam detected', timestamp: '6h ago', status: 'warning', details: 'Lottery scam email quarantined' },
  { id: '8', type: 'alert', title: 'Threat level increased — Your area', timestamp: '8h ago', status: 'error', details: 'Cybercrime reports up 34% in your region' },
  { id: '9', type: 'scan', title: 'Call analyzed — Robocall detected', timestamp: '1d ago', status: 'warning', details: 'Automated scam call flagged and logged' },
  { id: '10', type: 'report', title: 'Weekly security report generated', timestamp: '1d ago', status: 'info', details: '12 scans, 3 threats blocked, score: 87/100' },
];

const TYPE_ICONS: Record<string, typeof Shield> = { scan: Eye, alert: AlertTriangle, report: BarChart3, blocked: Shield };
const STATUS_COLORS: Record<string, string> = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };

export default function ActivityDashboard() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => ({
    totalScans: ACTIVITIES.filter(a => a.type === 'scan').length,
    threatsBlocked: ACTIVITIES.filter(a => a.type === 'blocked').length,
    reports: ACTIVITIES.filter(a => a.type === 'report').length,
    alerts: ACTIVITIES.filter(a => a.type === 'alert').length,
  }), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return ACTIVITIES;
    return ACTIVITIES.filter(a => a.type === filter);
  }, [filter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest activity loaded', 'success');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="db-page animate-fade-in">
      <div className="db-stats">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
        {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-blue-500/10">
            <BarChart3 size={16} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Activity Dashboard</h2>
            <p className="db-subtitle">Recent scans, alerts, and protection activity</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleRefresh} disabled={refreshing} className="db-btn">
            {refreshing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="db-stats">
        {[
          { label: 'Total Scans', value: stats.totalScans, icon: Eye, color: '#3b82f6', change: '+8 today' },
          { label: 'Threats Blocked', value: stats.threatsBlocked, icon: Shield, color: '#10b981', change: '+2 today' },
          { label: 'Reports Filed', value: stats.reports, icon: BarChart3, color: '#8b5cf6', change: '+1 today' },
          { label: 'Active Alerts', value: stats.alerts, icon: AlertTriangle, color: '#f59e0b', change: '1 new' },
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

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Activity' },
          { key: 'scan', label: 'Scans' },
          { key: 'blocked', label: 'Blocked' },
          { key: 'alert', label: 'Alerts' },
          { key: 'report', label: 'Reports' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`db-btn ${filter === f.key ? 'db-btn-primary' : ''}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-1.5">
        {filtered.map(item => {
          const Icon = TYPE_ICONS[item.type] || Shield;
          const color = STATUS_COLORS[item.status];
          return (
            <div key={item.id} className="db-card flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}10` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-zinc-200 block">{item.title}</span>
                <span className="text-[10px] text-zinc-500 block">{item.details}</span>
              </div>
              <span className="text-[9px] text-zinc-600 flex-shrink-0">{item.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
