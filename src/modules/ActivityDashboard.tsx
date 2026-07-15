import { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, Shield, AlertTriangle,
  RefreshCw, Loader2,
  Eye,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import useViewportAnimation from '../hooks/useViewportAnimation';

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
  const headerVP = useViewportAnimation();
  const statsVP = useViewportAnimation({ threshold: 0.1 });
  const filterVP = useViewportAnimation({ threshold: 0.1 });
  const listVP = useViewportAnimation({ threshold: 0.05 });
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
      <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" ref={statsVP.ref} style={{
        opacity: statsVP.isVisible ? 1 : 0,
        transform: statsVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms',
      }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in" ref={headerVP.ref} style={{
      opacity: headerVP.isVisible ? 1 : 0,
      transform: headerVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Activity Dashboard</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Recent scans, alerts, and protection activity</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-50">
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Scans', value: stats.totalScans, icon: Eye, color: '#3b82f6', change: '+8 today' },
          { label: 'Threats Blocked', value: stats.threatsBlocked, icon: Shield, color: '#10b981', change: '+2 today' },
          { label: 'Reports Filed', value: stats.reports, icon: BarChart3, color: '#8b5cf6', change: '+1 today' },
          { label: 'Active Alerts', value: stats.alerts, icon: AlertTriangle, color: '#f59e0b', change: '1 new' },
        ].map((s, i) => (
          <div key={i} className="glass-panel card-premium rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}10` }}>
              <s.icon size={18} style={{ color: s.color }} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-xl font-bold text-zinc-100 block">{s.value}</span>
              <span className="text-[10px] text-zinc-500">{s.label}</span>
              <span className="text-[9px] text-zinc-600 block">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2" ref={filterVP.ref} style={{
        opacity: filterVP.isVisible ? 1 : 0,
        transform: filterVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 160ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 160ms',
      }}>
        {[
          { key: 'all', label: 'All Activity' },
          { key: 'scan', label: 'Scans' },
          { key: 'blocked', label: 'Blocked' },
          { key: 'alert', label: 'Alerts' },
          { key: 'report', label: 'Reports' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`btn-ripple px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === f.key ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2" ref={listVP.ref} style={{
        opacity: listVP.isVisible ? 1 : 0,
        transform: listVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 240ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 240ms',
      }}>
        {filtered.map(item => {
          const Icon = TYPE_ICONS[item.type] || Shield;
          const color = STATUS_COLORS[item.status];
          return (
            <div key={item.id} className="glass-panel card-premium rounded-xl p-4 flex items-start gap-3 hover:border-white/[0.08] transition-all">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${color}10` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-zinc-200 block">{item.title}</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">{item.details}</span>
              </div>
              <span className="text-[10px] text-zinc-600 flex-shrink-0 mt-1">{item.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
