import { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle, ChevronDown, RefreshCw, Loader2,
  Share2, Bookmark, ExternalLink,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface ScamAlert {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  region: string;
  timestamp: string;
  affected: number;
  trending: boolean;
  source: string;
  isBookmarked: boolean;
}

const INITIAL_ALERTS: ScamAlert[] = [
  { id: '1', title: 'UPI Payment Request Scam', category: 'Payment Fraud', severity: 'critical', description: 'Scammers request money via UPI claiming to have sent payment by mistake. Never pay without verifying.', region: 'All India', timestamp: '2h ago', affected: 12400, trending: true, source: 'CERT-In', isBookmarked: false },
  { id: '2', title: 'Fake Job Offer via WhatsApp', category: 'Employment Fraud', severity: 'high', description: 'Messages offering work-from-home jobs with ₹50,000+ salary. Upfront "registration fee" required.', region: 'Maharashtra', timestamp: '4h ago', affected: 8200, trending: true, source: 'Cyber Cell', isBookmarked: true },
  { id: '3', title: 'Digital Arrest Scam Revival', category: 'Impersonation', severity: 'critical', description: 'Scammers impersonating CBI/Police officers via video call. No law enforcement demands money over phone.', region: 'Delhi NCR', timestamp: '6h ago', affected: 5600, trending: false, source: 'NCRP', isBookmarked: false },
  { id: '4', title: 'QR Code Phishing Campaign', category: 'Phishing', severity: 'high', description: 'Fake QR codes at shops that auto-debit money instead of making payments. Always check amount before scanning.', region: 'Karnataka', timestamp: '8h ago', affected: 3400, trending: false, source: 'Local Police', isBookmarked: false },
  { id: '5', title: 'Tax Refund SMS Scam', category: 'Phishing', severity: 'medium', description: 'SMS claiming income tax refund pending. Links lead to fake portal that steals PAN and bank details.', region: 'All India', timestamp: '12h ago', affected: 15000, trending: true, source: 'CERT-In', isBookmarked: false },
  { id: '6', title: 'Fake Loan App Scam', category: 'Financial Fraud', severity: 'high', description: 'Apps offering instant loans but charging hidden fees and threatening users with fake recovery agents.', region: 'All India', timestamp: '1d ago', affected: 22000, trending: false, source: 'RBI', isBookmarked: false },
];

const SEVERITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' };
const CATEGORIES = ['All', 'Payment Fraud', 'Employment Fraud', 'Impersonation', 'Phishing', 'Financial Fraud'];

export default function ScamAlerts() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<ScamAlert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (filter !== 'All' && a.category !== filter) return false;
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      return true;
    });
  }, [alerts, filter, severityFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest scam alerts loaded', 'success');
    }, 1000);
  };

  const handleBookmark = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a));
    const alert = alerts.find(a => a.id === id);
    addToast(alert?.isBookmarked ? 'Bookmark removed' : 'Alert bookmarked', 'info');
  };

  const handleShare = (alert: ScamAlert) => {
    navigator.clipboard?.writeText(`${alert.title}\n${alert.description}\nSource: ${alert.source}`);
    addToast('Alert details copied for sharing', 'success');
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Scam Alerts</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{filteredAlerts.length} active alerts</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-50">
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === cat ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent'
            }`}>
            {cat}
          </button>
        ))}
        <div className="w-px h-4 bg-zinc-800 mx-1 flex-shrink-0" />
        {['all', 'critical', 'high', 'medium'].map(sev => (
          <button key={sev} onClick={() => setSeverityFilter(sev)}
            className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              severityFilter === sev ? 'border border-white/[0.1]' : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
            }`}
            style={severityFilter === sev ? { background: sev === 'all' ? 'rgba(255,255,255,0.05)' : `${SEVERITY_COLORS[sev as keyof typeof SEVERITY_COLORS]}15`, color: sev === 'all' ? '#d4d4d8' : SEVERITY_COLORS[sev as keyof typeof SEVERITY_COLORS] } : {}}>
            {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertTriangle size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No alerts match your filters</p>
            <button onClick={() => { setFilter('All'); setSeverityFilter('all'); }}
              className="btn-ripple text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Clear filters</button>
          </div>
        ) : filteredAlerts.map(alert => (
          <div key={alert.id}
            className="glass-panel card-premium rounded-xl overflow-hidden transition-all duration-200 hover:border-white/[0.08]"
            style={{ borderLeft: `3px solid ${SEVERITY_COLORS[alert.severity]}` }}>
            <button onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
              className="w-full p-4 text-left cursor-pointer flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${SEVERITY_COLORS[alert.severity]}12` }}>
                <AlertTriangle size={16} style={{ color: SEVERITY_COLORS[alert.severity] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-zinc-200">{alert.title}</span>
                  {alert.trending && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">Trending</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                  <span>{alert.category}</span>
                  <span>·</span>
                  <span>{alert.region}</span>
                  <span>·</span>
                  <span>{alert.timestamp}</span>
                  <span>·</span>
                  <span>{alert.affected.toLocaleString()} affected</span>
                </div>
              </div>
              <ChevronDown size={14} className={`text-zinc-600 flex-shrink-0 mt-2 transition-transform ${expandedId === alert.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedId === alert.id && (
              <div className="px-4 pb-4 pt-0 space-y-3">
                <p className="text-sm text-zinc-400 leading-relaxed">{alert.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                  <span>Source: {alert.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleBookmark(alert.id)}
                    className={`btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      alert.isBookmarked ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                    }`}>
                    <Bookmark size={12} fill={alert.isBookmarked ? 'currentColor' : 'none'} /> {alert.isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => handleShare(alert)}
                    className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <Share2 size={12} /> Share
                  </button>
                  <button onClick={() => addToast(`Viewing details from ${alert.source}`, 'info')}
                    className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <ExternalLink size={12} /> Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
