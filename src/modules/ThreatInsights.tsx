import { useState, useEffect, useMemo } from 'react';
import {
  Brain, TrendingUp, AlertTriangle, Shield,
  RefreshCw, Loader2, Search,
  Share2, Bookmark, ChevronDown,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import useViewportAnimation from '../hooks/useViewportAnimation';

interface Threat {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  confidence: number;
  source: string;
  timestamp: string;
  affectedRegions: string[];
  indicators: string[];
  isBookmarked: boolean;
}

const THREATS: Threat[] = [
  { id: '1', title: 'AI Voice Clone Scams on Rise', category: 'AI-Generated Fraud', severity: 'critical', description: 'Scammers using AI voice cloning to impersonate family members. Always verify identity through a separate channel before acting.', confidence: 94, source: 'CERT-In', timestamp: '1h ago', affectedRegions: ['Delhi', 'Mumbai', 'Bangalore'], indicators: ['Unusual voice patterns', 'Urgency pressure', 'Separate phone number'], isBookmarked: false },
  { id: '2', title: 'Crypto Investment Ponzi Scheme', category: 'Investment Fraud', severity: 'high', description: 'Network promoting guaranteed 30% monthly returns through a fake crypto trading platform. Over ₹50 Cr collected from victims.', confidence: 89, source: 'Enforcement Directorate', timestamp: '3h ago', affectedRegions: ['All India'], indicators: ['Guaranteed returns', 'Referral bonuses', 'No SEBI registration'], isBookmarked: true },
  { id: '3', title: 'Fake Insurance Policy Scam', category: 'Identity Fraud', severity: 'high', description: 'Fraudulent insurance policies sold via cold calls. Policies appear legitimate but are not registered with IRDAI.', confidence: 85, source: 'IRDAI', timestamp: '5h ago', affectedRegions: ['Gujarat', 'Rajasthan', 'Maharashtra'], indicators: ['Cold call sales', 'No IRDAI number', 'Discount pressure'], isBookmarked: false },
  { id: '4', title: 'Ransomware Targeting SMEs', category: 'Cyber Attack', severity: 'critical', description: 'New ransomware variant targeting small businesses through phishing emails with fake invoice attachments.', confidence: 92, source: 'NATIONAL-CERT', timestamp: '6h ago', affectedRegions: ['All India'], indicators: ['Invoice attachments', '.zip files', 'Unknown sender'], isBookmarked: false },
  { id: '5', title: 'SIM Swap Fraud Ring', category: 'Telecom Fraud', severity: 'medium', description: 'Organized group obtaining duplicate SIM cards to bypass OTP security and drain bank accounts.', confidence: 78, source: 'TRAI', timestamp: '1d ago', affectedRegions: ['Hyderabad', 'Chennai'], indicators: ['Network loss', 'OTP not received', 'Unknown SIM activation'], isBookmarked: false },
];

const CATEGORIES = ['All', 'AI-Generated Fraud', 'Investment Fraud', 'Identity Fraud', 'Cyber Attack', 'Telecom Fraud'];
const SEVERITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' };

export default function ThreatInsights() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [threats, setThreats] = useState(THREATS);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const vpWrapper = useViewportAnimation();
  const vpHeader = useViewportAnimation();
  const vpStats = useViewportAnimation();
  const vpSearch = useViewportAnimation();
  const vpList = useViewportAnimation();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return threats.filter(t => {
      if (category !== 'All' && t.category !== category) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [threats, category, search]);

  const stats = useMemo(() => ({
    total: threats.length,
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    avgConfidence: Math.round(threats.reduce((a, t) => a + t.confidence, 0) / threats.length),
  }), [threats]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest threat intelligence loaded', 'success');
    }, 1000);
  };

  const handleBookmark = (id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t));
    addToast('Threat saved to watchlist', 'info');
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
        {[1, 2].map(i => <div key={i} className="h-40 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in" ref={vpWrapper.ref}
      style={{
        opacity: vpWrapper.isVisible ? 1 : 0,
        transform: vpWrapper.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      <div className="flex items-center justify-between flex-wrap gap-3" ref={vpHeader.ref}
        style={{
          opacity: vpHeader.isVisible ? 1 : 0,
          transform: vpHeader.isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Threat Insights</h2>
          <p className="text-xs text-zinc-500 mt-0.5">AI-powered threat intelligence</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-50">
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" ref={vpStats.ref}
        style={{
          opacity: vpStats.isVisible ? 1 : 0,
          transform: vpStats.isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
        }}>
        {[
          { label: 'Active Threats', value: stats.total, icon: Brain, color: '#8b5cf6' },
          { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: '#ef4444' },
          { label: 'High Severity', value: stats.high, icon: TrendingUp, color: '#f59e0b' },
          { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: Shield, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}10` }}>
              <s.icon size={18} style={{ color: s.color }} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-lg font-bold text-zinc-100 block">{s.value}</span>
              <span className="text-[10px] text-zinc-500">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap" ref={vpSearch.ref}
        style={{
          opacity: vpSearch.isVisible ? 1 : 0,
          transform: vpSearch.isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
        }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search threats..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                category === c ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-3" ref={vpList.ref}
        style={{
          opacity: vpList.isVisible ? 1 : 0,
          transform: vpList.isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
        }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Brain size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No threats match your search</p>
          </div>
        ) : filtered.map(threat => (
          <div key={threat.id} className="glass-panel card-premium rounded-xl overflow-hidden transition-all hover:border-white/[0.08]"
            style={{ borderLeft: `3px solid ${SEVERITY_COLORS[threat.severity]}` }}>
            <button onClick={() => setExpandedId(expandedId === threat.id ? null : threat.id)}
              className="w-full p-4 text-left cursor-pointer flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${SEVERITY_COLORS[threat.severity]}12` }}>
                <Brain size={16} style={{ color: SEVERITY_COLORS[threat.severity] }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-zinc-200 block">{threat.title}</span>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                  <span>{threat.category}</span>
                  <span>·</span>
                  <span>{threat.timestamp}</span>
                  <span>·</span>
                  <span className="text-emerald-400">{threat.confidence}% confidence</span>
                </div>
              </div>
              <ChevronDown size={14} className={`text-zinc-600 flex-shrink-0 mt-2 transition-transform ${expandedId === threat.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedId === threat.id && (
              <div className="px-4 pb-4 space-y-3">
                <p className="text-sm text-zinc-400 leading-relaxed">{threat.description}</p>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Key Indicators</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {threat.indicators.map((ind, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.03] text-zinc-400 border border-white/[0.04]">{ind}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Affected Regions</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {threat.affectedRegions.map((r, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-blue-500/[0.06] text-blue-400/80">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600">Source: {threat.source}</span>
                  <div className="flex-1" />
                  <button onClick={() => handleBookmark(threat.id)}
                    className={`btn-ripple p-1.5 rounded-lg transition-colors cursor-pointer ${threat.isBookmarked ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                    <Bookmark size={12} fill={threat.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => { navigator.clipboard?.writeText(threat.title + '\n' + threat.description); addToast('Threat details copied', 'success'); }}
                    className="btn-ripple p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer">
                    <Share2 size={12} />
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
