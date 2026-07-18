import { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle, ChevronDown, RefreshCw, Loader2,
  Share2, Bookmark, ExternalLink, Flame, Search,
  ShieldAlert, MapPin, Clock, Users, Flag, BarChart3,
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
  {
    id: '1',
    title: 'UPI Payment Request Scam',
    category: 'Payment Fraud',
    severity: 'critical',
    description:
      'Scammers request money via UPI claiming to have sent payment by mistake. They create urgency by saying the money will be debited twice if not returned. Never pay without verifying the sender\'s identity and transaction history. Report immediately if you receive such requests.',
    region: 'All India',
    timestamp: '2h ago',
    affected: 12400,
    trending: true,
    source: 'CERT-In',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Fake Job Offer via WhatsApp',
    category: 'Employment Fraud',
    severity: 'high',
    description:
      'Messages offering work-from-home jobs with ₹50,000+ salary for simple tasks like rating hotels or liking YouTube videos. Victims are asked to pay an upfront "registration fee" of ₹500–₹2,000. Once paid, the scammer vanishes or demands more money.',
    region: 'Maharashtra',
    timestamp: '4h ago',
    affected: 8200,
    trending: true,
    source: 'Cyber Cell',
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Digital Arrest Scam Revival',
    category: 'Impersonation',
    severity: 'critical',
    description:
      'Scammers impersonating CBI/Police officers via video call, claiming the victim is involved in a money laundering case. They demand immediate "verification" by transferring funds to a "safe account." No law enforcement agency in India demands money over phone or video call.',
    region: 'Delhi NCR',
    timestamp: '6h ago',
    affected: 5600,
    trending: false,
    source: 'NCRP',
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'QR Code Phishing Campaign',
    category: 'Phishing',
    severity: 'high',
    description:
      'Fake QR codes placed at shops and street vendors that auto-debit money instead of making payments. When scanned, they open a malicious link that triggers a UPI collect request. Always verify the amount before authorizing any UPI transaction.',
    region: 'Karnataka',
    timestamp: '8h ago',
    affected: 3400,
    trending: false,
    source: 'Local Police',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Tax Refund SMS Scam',
    category: 'Phishing',
    severity: 'medium',
    description:
      'SMS messages claiming an income tax refund is pending, with a link to a fake portal that steals PAN, Aadhaar, and bank details. The Income Tax Department never asks for sensitive data via SMS. Always file returns through the official e-filing portal.',
    region: 'All India',
    timestamp: '12h ago',
    affected: 15000,
    trending: true,
    source: 'CERT-In',
    isBookmarked: false,
  },
  {
    id: '6',
    title: 'Fake Loan App Scam',
    category: 'Financial Fraud',
    severity: 'high',
    description:
      'Unlicensed apps offering instant loans with minimal documentation charge hidden processing fees and use contacts from the phone to threaten repayment. Some apps use morphed photos for blackmail. Only borrow from RBI-regulated lenders and check registration before applying.',
    region: 'All India',
    timestamp: '1d ago',
    affected: 22000,
    trending: false,
    source: 'RBI',
    isBookmarked: false,
  },
  {
    id: '7',
    title: 'KYC Update Fraud Call',
    category: 'Impersonation',
    severity: 'high',
    description:
      'Callers pretending to be bank representatives ask customers to "update KYC" by sharing OTPs or downloading remote access apps like AnyDesk. Banks never ask for OTPs over the phone. Hang up and call your bank\'s official number to verify.',
    region: 'Tamil Nadu',
    timestamp: '1d ago',
    affected: 4100,
    trending: false,
    source: 'Cyber Cell',
    isBookmarked: false,
  },
  {
    id: '8',
    title: 'Stock Market Tips Telegram Scam',
    category: 'Financial Fraud',
    severity: 'medium',
    description:
      'Telegram groups promising guaranteed stock returns with AI-powered trading bots. Victims pay subscription fees and lose money following fake tips. SEBI has warned against unregistered investment advisors operating via social media.',
    region: 'All India',
    timestamp: '2d ago',
    affected: 9800,
    trending: false,
    source: 'SEBI',
    isBookmarked: false,
  },
  {
    id: '9',
    title: 'E-commerce Refund Phishing',
    category: 'Phishing',
    severity: 'medium',
    description:
      'Messages posing as Amazon/Flipkart customer support claiming a refund is pending. They ask for bank details to "process the refund" or request remote desktop access. Legitimate refunds are processed automatically without asking for banking credentials.',
    region: 'Delhi NCR',
    timestamp: '2d ago',
    affected: 6300,
    trending: false,
    source: 'CERT-In',
    isBookmarked: false,
  },
  {
    id: '10',
    title: 'SIM Swap Fraud Surge',
    category: 'Payment Fraud',
    severity: 'critical',
    description:
      'Fraudsters obtain duplicate SIM cards using forged identity documents, then intercept OTPs to drain bank accounts. Keep your mobile number linked to Aadhaar secure and enable SIM lock features. Report lost signals to your carrier immediately.',
    region: 'Gujarat',
    timestamp: '3d ago',
    affected: 3200,
    trending: false,
    source: 'CERT-In',
    isBookmarked: false,
  },
  {
    id: '11',
    title: 'Fake Immigration Office Call',
    category: 'Impersonation',
    severity: 'low',
    description:
      'Callers claiming to be from immigration authorities inform victims that their passport is being used for illegal activities. They demand money to "clear the case." Immigration offices never contact citizens this way for resolving legal matters.',
    region: 'Karnataka',
    timestamp: '3d ago',
    affected: 1800,
    trending: false,
    source: 'Local Police',
    isBookmarked: false,
  },
  {
    id: '12',
    title: 'Charity Scam After Natural Disaster',
    category: 'Phishing',
    severity: 'medium',
    description:
      'Fake charity accounts surface on social media after floods or earthquakes, soliciting donations via UPI. Always verify the legitimacy of charitable organizations through official government portals before donating.',
    region: 'Tamil Nadu',
    timestamp: '4d ago',
    affected: 4500,
    trending: false,
    source: 'NCRP',
    isBookmarked: false,
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#10b981',
};

const CATEGORIES = [
  'All',
  'Payment Fraud',
  'Employment Fraud',
  'Impersonation',
  'Phishing',
  'Financial Fraud',
];

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'] as const;

const REGIONS = [
  'All India',
  'Delhi NCR',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
];

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function SeverityBarChart({ alerts }: { alerts: ScamAlert[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    alerts.forEach((a) => {
      map[a.severity] = (map[a.severity] || 0) + 1;
    });
    return map;
  }, [alerts]);

  const max = Math.max(...Object.values(counts), 1);
  const bars = [
    { key: 'critical', label: 'Critical', color: SEVERITY_COLORS.critical },
    { key: 'high', label: 'High', color: SEVERITY_COLORS.high },
    { key: 'medium', label: 'Medium', color: SEVERITY_COLORS.medium },
    { key: 'low', label: 'Low', color: SEVERITY_COLORS.low },
  ];

  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="db-card-header">
        <BarChart3 size={13} className="text-zinc-400" />
        <span className="db-card-title">Severity Chart</span>
      </div>
      <svg viewBox="0 0 200 80" className="w-full h-auto" style={{ maxHeight: 100 }}>
        {bars.map((bar, i) => {
          const count = counts[bar.key] || 0;
          const barHeight = (count / max) * 45;
          const x = 10 + i * 48;
          const y = 60 - barHeight;
          return (
            <g key={bar.key}>
              <rect x={x} y={y} width={30} height={barHeight} rx={4} fill={bar.color} opacity={0.85} />
              <text x={x + 15} y={y - 4} textAnchor="middle" fill="#d4d4d8" fontSize={9} fontWeight={600}>
                {count}
              </text>
              <text x={x + 15} y={74} textAnchor="middle" fill="#71717a" fontSize={7}>
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ScamAlerts() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<ScamAlert[]>(INITIAL_ALERTS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState('All India');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'All') count++;
    if (severityFilter !== 'all') count++;
    if (regionFilter !== 'All India') count++;
    return count;
  }, [categoryFilter, severityFilter, regionFilter]);

  const stats = useMemo(() => {
    const critical = alerts.filter((a) => a.severity === 'critical').length;
    const high = alerts.filter((a) => a.severity === 'high').length;
    const medium = alerts.filter((a) => a.severity === 'medium').length;
    const low = alerts.filter((a) => a.severity === 'low').length;
    return { critical, high, medium, low };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const result = alerts.filter((a) => {
      if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (regionFilter !== 'All India' && a.region !== regionFilter) return false;
      return true;
    });
    result.sort((a, b) => {
      const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      if (sevDiff !== 0) return sevDiff;
      return 0;
    });
    return result;
  }, [alerts, categoryFilter, severityFilter, regionFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest scam alerts loaded', 'success');
    }, 1200);
  };

  const handleBookmark = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );
    const alert = alerts.find((a) => a.id === id);
    addToast(alert?.isBookmarked ? 'Bookmark removed' : 'Alert bookmarked', 'info');
  };

  const handleShare = (alert: ScamAlert) => {
    const text = `${alert.title}\n${alert.description}\nSeverity: ${alert.severity.toUpperCase()}\nSource: ${alert.source}\nRegion: ${alert.region}`;
    navigator.clipboard?.writeText(text);
    addToast('Alert details copied for sharing', 'success');
  };

  const handleReport = (alert: ScamAlert) => {
    addToast(`Reported "${alert.title}" to CERT-In`, 'success');
  };

  const clearFilters = () => {
    setCategoryFilter('All');
    setSeverityFilter('all');
    setRegionFilter('All India');
  };

  if (loading) {
    return (
      <div className="db-page">
        <div className="glass-panel rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="db-header-icon animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-2.5 w-48 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          </div>
          <div className="h-7 w-20 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="db-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="db-stat animate-pulse">
              <div className="db-stat-icon" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="space-y-1">
                <div className="h-4 w-8 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-2.5 w-16 rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-16 rounded-md animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel rounded-xl p-3 animate-pulse">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-3/4 rounded bg-white/[0.04]" />
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-14 rounded-full bg-white/[0.04]" />
                    <div className="h-2.5 w-10 rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="h-2.5 w-full rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      {/* ─── Header ─── */}
      <div className="glass-panel rounded-xl p-3">
        <div className="db-header">
          <div className="db-header-left">
            <div
              className="db-header-icon"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                boxShadow: '0 0 12px rgba(239,68,68,0.2)',
              }}
            >
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="db-header-text">
              <h2 className="db-title">Scam Alerts</h2>
              <p className="db-subtitle">Live trending scam alerts from across India</p>
            </div>
          </div>
          <div className="db-header-actions">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="db-btn"
            >
              {refreshing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="db-stats">
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <ShieldAlert size={14} className="text-red-400" />
          </div>
          <div>
            <p className="db-stat-value">{stats.critical}</p>
            <p className="db-stat-label">Critical</p>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <AlertTriangle size={14} className="text-orange-400" />
          </div>
          <div>
            <p className="db-stat-value">{stats.high}</p>
            <p className="db-stat-label">High Priority</p>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <MapPin size={14} className="text-blue-400" />
          </div>
          <div>
            <p className="db-stat-value">{stats.medium}</p>
            <p className="db-stat-label">Medium</p>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <Users size={14} className="text-emerald-400" />
          </div>
          <div>
            <p className="db-stat-value">{stats.low}</p>
            <p className="db-stat-label">Low</p>
          </div>
        </div>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="glass-panel rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Search size={12} className="text-zinc-500" />
            <span className="text-[10px] font-medium text-zinc-400">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold bg-blue-500/20 text-blue-400">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="btn-ripple text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider flex-shrink-0 font-medium">Category</span>
          <div className="w-px h-2.5 bg-zinc-800 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn-ripple flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer border ${
                categoryFilter === cat
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Severity Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider flex-shrink-0 font-medium">Severity</span>
          <div className="w-px h-2.5 bg-zinc-800 flex-shrink-0" />
          {SEVERITIES.map((sev) => {
            const isActive = severityFilter === sev;
            const color = sev === 'all' ? '#a1a1aa' : SEVERITY_COLORS[sev];
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`btn-ripple flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer border ${
                  isActive ? 'border-white/[0.1]' : 'text-zinc-600 hover:text-zinc-400 border-transparent'
                }`}
                style={isActive ? { background: `${color}15`, color } : undefined}
              >
                {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider flex-shrink-0 font-medium">Region</span>
          <div className="w-px h-2.5 bg-zinc-800 flex-shrink-0" />
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={`btn-ripple flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer border ${
                regionFilter === region
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border-transparent'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Alert Feed + Sidebar ─── */}
      <div className="db-grid-2-1">
        {/* Alert Feed */}
        <div className="space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800/60">
                <AlertTriangle size={20} className="text-zinc-600" />
              </div>
              <p className="text-xs text-zinc-400 font-medium">No alerts match your filters</p>
              <p className="text-[10px] text-zinc-600">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="btn-ripple text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const borderColor = SEVERITY_COLORS[alert.severity];
              const isExpanded = expandedId === alert.id;
              return (
                <div
                  key={alert.id}
                  className="glass-panel rounded-xl overflow-hidden transition-all duration-200 hover:border-white/[0.08]"
                  style={{ borderLeft: `3px solid ${borderColor}` }}
                >
                  {/* Collapsed Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                    className="w-full p-3 text-left cursor-pointer flex items-start gap-2.5"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${borderColor}12` }}
                    >
                      <AlertTriangle size={14} style={{ color: borderColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-zinc-100">{alert.title}</span>
                        {alert.trending && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-px rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/15 animate-pulse"
                            style={{ animationDuration: '2s' }}
                          >
                            <Flame size={8} />
                            Trending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span
                          className="inline-flex items-center px-1.5 py-px rounded-full text-[9px] font-medium"
                          style={{ background: `${borderColor}15`, color: borderColor }}
                        >
                          {alert.category}
                        </span>
                        <span
                          className="inline-flex items-center px-1.5 py-px rounded-full text-[9px] font-medium capitalize"
                          style={{ background: `${borderColor}15`, color: borderColor }}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-zinc-600">·</span>
                        <span className="text-[9px] text-zinc-500 flex items-center gap-0.5">
                          <MapPin size={8} /> {alert.region}
                        </span>
                        <span className="text-[9px] text-zinc-600">·</span>
                        <span className="text-[9px] text-zinc-500 flex items-center gap-0.5">
                          <Clock size={8} /> {alert.timestamp}
                        </span>
                        <span className="text-[9px] text-zinc-600">·</span>
                        <span className="text-[9px] text-zinc-500 flex items-center gap-0.5">
                          <Users size={8} /> {alert.affected.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={12}
                      className={`text-zinc-600 flex-shrink-0 mt-2 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 space-y-2">
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{alert.description}</p>

                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span className="flex items-center gap-0.5">
                          <ShieldAlert size={9} />
                          Source: <span className="text-zinc-300 font-medium">{alert.source}</span>
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin size={9} /> {alert.region}
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span className="flex items-center gap-0.5">
                          <Users size={9} /> {alert.affected.toLocaleString()} affected
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBookmark(alert.id); }}
                          className={`btn-ripple flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                            alert.isBookmarked
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent'
                          }`}
                        >
                          <Bookmark size={10} fill={alert.isBookmarked ? 'currentColor' : 'none'} />
                          {alert.isBookmarked ? 'Saved' : 'Bookmark'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShare(alert); }}
                          className="btn-ripple flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer border border-transparent"
                        >
                          <Share2 size={10} /> Share
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToast(`Opening details for "${alert.title}"`, 'info');
                          }}
                          className="btn-ripple flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer border border-transparent"
                        >
                          <ExternalLink size={10} /> View
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReport(alert); }}
                          className="btn-ripple flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer border border-transparent"
                        >
                          <Flag size={10} /> Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-2">
          {/* Trending Now */}
          <div className="glass-panel rounded-xl p-3 space-y-1.5">
            <div className="db-card-header">
              <Flame size={13} className="text-amber-400" />
              <span className="db-card-title">Trending Now</span>
            </div>
            {filteredAlerts.filter((a) => a.trending).length === 0 ? (
              <p className="text-[10px] text-zinc-600">No trending alerts in current filters</p>
            ) : (
              filteredAlerts
                .filter((a) => a.trending)
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setExpandedId(a.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <p className="text-[10px] font-medium text-zinc-300 line-clamp-1">{a.title}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">
                      {a.affected.toLocaleString()} affected · {a.timestamp}
                    </p>
                  </button>
                ))
            )}
          </div>

          {/* Severity Chart */}
          <SeverityBarChart alerts={filteredAlerts} />
        </div>
      </div>
    </div>
  );
}
