import { useState, useEffect, useMemo } from 'react';
import {
  Brain, TrendingUp, AlertTriangle, Shield,
  RefreshCw, Loader2, Search,
  Share2, Bookmark, ChevronDown,
  Eye, Globe, BarChart3, Zap, FileText,
} from 'lucide-react';
import { useToast } from '../components/Toast';

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
  {
    id: '1',
    title: 'AI Voice Clone Scams on Rise',
    category: 'AI-Generated Fraud',
    severity: 'critical',
    description: 'Scammers using AI voice cloning to impersonate family members in distress. Calls sound remarkably realistic with emotional manipulation tactics. Victims report losing ₹2-10 lakhs per incident. Always verify identity through a separate channel before acting on any urgent financial requests.',
    confidence: 94,
    source: 'CERT-In',
    timestamp: '1h ago',
    affectedRegions: ['Delhi', 'Mumbai', 'Bangalore'],
    indicators: ['Unusual voice patterns', 'Urgency pressure', 'Separate phone number', 'Emotional manipulation'],
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Crypto Investment Ponzi Scheme',
    category: 'Investment Fraud',
    severity: 'high',
    description: 'Network promoting guaranteed 30% monthly returns through a fake crypto trading platform with fabricated dashboards. Over ₹50 Cr collected from 12,000+ victims. Uses multi-level referral structure typical of Ponzi schemes.',
    confidence: 89,
    source: 'Enforcement Directorate',
    timestamp: '3h ago',
    affectedRegions: ['All India'],
    indicators: ['Guaranteed returns', 'Referral bonuses', 'No SEBI registration', 'Fake dashboard'],
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Fake Insurance Policy Scam',
    category: 'Identity Fraud',
    severity: 'high',
    description: 'Fraudulent insurance policies sold via cold calls and social media ads. Policies appear legitimate but are not registered with IRDAI. Scammers use stolen personal data to create convincing policy documents.',
    confidence: 85,
    source: 'IRDAI',
    timestamp: '5h ago',
    affectedRegions: ['Gujarat', 'Rajasthan', 'Maharashtra'],
    indicators: ['Cold call sales', 'No IRDAI number', 'Discount pressure', 'Unsolicited contact'],
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Ransomware Targeting SMEs',
    category: 'Cyber Attack',
    severity: 'critical',
    description: 'New ransomware variant targeting small businesses through phishing emails with fake invoice attachments. Encrypts entire network and demands payment in cryptocurrency. Estimated 500+ businesses affected in the last month alone.',
    confidence: 92,
    source: 'NATIONAL-CERT',
    timestamp: '6h ago',
    affectedRegions: ['All India'],
    indicators: ['Invoice attachments', '.zip files', 'Unknown sender', 'Bitcoin demand'],
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'SIM Swap Fraud Ring',
    category: 'Telecom Fraud',
    severity: 'medium',
    description: 'Organized group obtaining duplicate SIM cards using forged identity documents to bypass OTP security and drain bank accounts. Operates across multiple states with inside contacts at telecom stores.',
    confidence: 78,
    source: 'TRAI',
    timestamp: '1d ago',
    affectedRegions: ['Hyderabad', 'Chennai', 'Pune'],
    indicators: ['Network loss', 'OTP not received', 'Unknown SIM activation', 'Social engineering'],
    isBookmarked: false,
  },
  {
    id: '6',
    title: 'Deepfake Video Campaign',
    category: 'AI-Generated Fraud',
    severity: 'critical',
    description: 'AI-generated deepfake videos of celebrities endorsing fraudulent investment platforms circulating on social media. Uses advanced lip-sync technology making detection extremely difficult for average users.',
    confidence: 91,
    source: 'MeitY',
    timestamp: '2h ago',
    affectedRegions: ['Delhi', 'Mumbai', 'Kolkata', 'Bangalore'],
    indicators: ['Celebrity endorsement', 'Social media ads', 'Fake testimonials', 'AI artifacts'],
    isBookmarked: false,
  },
];

const CATEGORIES = ['All', 'AI-Generated Fraud', 'Investment Fraud', 'Identity Fraud', 'Cyber Attack', 'Telecom Fraud'];
const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#10b981',
};

const SEVERITY_BG: Record<string, string> = {
  critical: 'rgba(239,68,68,0.12)',
  high: 'rgba(245,158,11,0.12)',
  medium: 'rgba(59,130,246,0.12)',
  low: 'rgba(16,185,129,0.12)',
};

const CATEGORY_DATA = [
  { name: 'AI-Generated Fraud', value: 94, color: '#ef4444' },
  { name: 'Cyber Attack', value: 92, color: '#f59e0b' },
  { name: 'Investment Fraud', value: 89, color: '#f97316' },
  { name: 'Identity Fraud', value: 85, color: '#3b82f6' },
  { name: 'Telecom Fraud', value: 78, color: '#8b5cf6' },
];

const RADAR_DIMS = [
  'Sophistication',
  'Financial Impact',
  'Victim Count',
  'Geographic Spread',
  'Detection Difficulty',
];

const RADAR_DATA: Record<string, number[]> = {
  '1': [95, 70, 80, 65, 90],
  '2': [60, 95, 85, 50, 55],
  '3': [45, 60, 55, 70, 40],
  '4': [85, 80, 60, 90, 75],
  '5': [70, 65, 50, 55, 60],
  '6': [98, 50, 75, 85, 92],
};

const KEY_FINDINGS = [
  'AI-generated fraud schemes have increased 340% over the past quarter, with voice cloning and deepfakes leading the surge.',
  'Critical-severity threats now account for 50% of all active threats, up from 25% last month.',
  'Investment fraud losses exceeded ₹50 Cr in Q1 2026, with cryptocurrency-related scams dominating the landscape.',
];

export default function ThreatInsights() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [threats, setThreats] = useState(THREATS);
  const [category, setCategory] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return threats
      .filter(t => {
        if (category !== 'All' && t.category !== category) return false;
        if (severityFilter !== 'All' && t.severity !== severityFilter.toLowerCase()) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.confidence - a.confidence);
  }, [threats, category, severityFilter, search]);

  const stats = useMemo(() => {
    const regions = new Set<string>();
    threats.forEach(t => t.affectedRegions.forEach(r => regions.add(r)));
    const avgConfidence = Math.round(threats.reduce((a, t) => a + t.confidence, 0) / threats.length);
    const severityOrder = ['critical', 'high', 'medium', 'low'] as const;
    let topSeverity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    for (const s of severityOrder) {
      if (threats.some(t => t.severity === s)) {
        topSeverity = s;
        break;
      }
    }
    return {
      activeThreats: threats.length,
      avgConfidence,
      regionsAffected: regions.size,
      threatLevel: topSeverity,
    };
  }, [threats]);

  const topThreat = useMemo(() => {
    return filtered.length > 0 ? filtered[0] : null;
  }, [filtered]);

  const radarPoints = useMemo(() => {
    if (!topThreat) return '';
    const values = RADAR_DATA[topThreat.id] || [50, 50, 50, 50, 50];
    const cx = 120;
    const cy = 110;
    const radius = 80;
    const angleStep = (2 * Math.PI) / 5;
    const startAngle = -Math.PI / 2;
    const points = values.map((v, i) => {
      const angle = startAngle + i * angleStep;
      const r = (v / 100) * radius;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    return points.map(p => p.join(',')).join(' ');
  }, [topThreat]);

  const radarLabelPositions = useMemo(() => {
    const cx = 120;
    const cy = 110;
    const radius = 100;
    const angleStep = (2 * Math.PI) / 5;
    const startAngle = -Math.PI / 2;
    return RADAR_DIMS.map((dim, i) => {
      const angle = startAngle + i * angleStep;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const anchor = x < cx - 10 ? 'end' : x > cx + 10 ? 'start' : 'middle';
      return { dim, x, y, anchor };
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest threat intelligence loaded', 'success');
    }, 1200);
  };

  const handleBookmark = (id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t));
    addToast('Threat saved to watchlist', 'info');
  };

  const handleShare = (threat: Threat) => {
    navigator.clipboard?.writeText(`${threat.title}\n\n${threat.description}\n\nCategory: ${threat.category}\nSeverity: ${threat.severity}\nConfidence: ${threat.confidence}%\nSource: ${threat.source}`);
    addToast('Threat details copied to clipboard', 'success');
  };

  const handleViewReport = (threat: Threat) => {
    addToast(`Opening full report for: ${threat.title}`, 'info');
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(139,92,246,0.15)' }} />
          <div>
            <div className="h-5 w-40 rounded bg-white/[0.06] animate-pulse mb-2" />
            <div className="h-3 w-64 rounded bg-white/[0.04] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div>
                  <div className="h-6 w-16 rounded bg-white/[0.06] animate-pulse mb-1" />
                  <div className="h-3 w-20 rounded bg-white/[0.04] animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-xl p-5">
          <div className="h-5 w-48 rounded bg-white/[0.06] animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="w-48 h-24 rounded bg-white/[0.04] animate-pulse" />
            <div className="flex-1 space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-3 rounded bg-white/[0.04] animate-pulse" style={{ width: `${90 - i * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5">
          <div className="h-5 w-48 rounded bg-white/[0.06] animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-36 rounded bg-white/[0.04] animate-pulse" />
                <div className="flex-1 h-4 rounded bg-white/[0.04] animate-pulse" />
                <div className="h-3 w-10 rounded bg-white/[0.06] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Premium Header */}
      <div className="glass-panel rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(168,85,247,0.15))' }}
          >
            <Brain size={22} className="text-purple-400" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Threat Insights</h2>
            <p className="text-xs text-zinc-500 mt-0.5">AI-powered threat intelligence and fraud pattern analysis</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors cursor-pointer disabled:opacity-50 border border-white/[0.06]"
        >
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {/* Threat Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)' }}
          >
            <AlertTriangle size={18} style={{ color: '#ef4444' }} strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-lg font-bold text-zinc-100 block">{stats.activeThreats}</span>
            <span className="text-[10px] text-zinc-500">Active Threats</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.12)' }}
          >
            <Brain size={18} style={{ color: '#3b82f6' }} strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-lg font-bold text-zinc-100 block">{stats.avgConfidence}%</span>
            <span className="text-[10px] text-zinc-500">AI Confidence</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(245,158,11,0.12)' }}
          >
            <Globe size={18} style={{ color: '#f59e0b' }} strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-lg font-bold text-zinc-100 block">{stats.regionsAffected}</span>
            <span className="text-[10px] text-zinc-500">Regions Affected</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: SEVERITY_BG[stats.threatLevel] }}
          >
            <Shield size={18} style={{ color: SEVERITY_COLORS[stats.threatLevel] }} strokeWidth={1.5} />
          </div>
          <div>
            <span
              className="text-sm font-bold block uppercase tracking-wide"
              style={{ color: SEVERITY_COLORS[stats.threatLevel] }}
            >
              {stats.threatLevel}
            </span>
            <span className="text-[10px] text-zinc-500">Threat Level</span>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      <div className="glass-panel rounded-xl p-5 card-premium">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-zinc-200">AI Threat Assessment</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Semicircle Gauge */}
          <div className="flex flex-col items-center flex-shrink-0">
            <svg width="160" height="95" viewBox="0 0 160 95">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path
                d="M 15 85 A 65 65 0 0 1 145 85"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 15 85 A 65 65 0 0 1 145 85"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(stats.avgConfidence / 100) * 204.2} 204.2`}
              />
              <text x="80" y="72" textAnchor="middle" className="fill-zinc-100" fontSize="24" fontWeight="700">
                {stats.avgConfidence}%
              </text>
              <text x="80" y="88" textAnchor="middle" className="fill-zinc-500" fontSize="10">
                Overall Confidence
              </text>
            </svg>
          </div>

          <div className="flex-1 space-y-4">
            {/* Key Findings */}
            <div>
              <h4 className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Key Findings</h4>
              <ul className="space-y-2">
                {KEY_FINDINGS.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                    <Zap size={10} className="text-purple-400 flex-shrink-0 mt-1" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence Meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Confidence Meter</span>
                <span className="text-xs font-medium text-blue-400">{stats.avgConfidence}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${stats.avgConfidence}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-zinc-500">Last analyzed: 2 minutes ago</span>
        </div>
      </div>

      {/* Threat Categories Chart */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Threat Categories</h3>
        </div>
        <div className="space-y-3">
          {CATEGORY_DATA.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-32 flex-shrink-0 text-right">{cat.name}</span>
              <div className="flex-1 h-4 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${cat.value}%`,
                    background: `linear-gradient(90deg, ${cat.color}40, ${cat.color})`,
                  }}
                >
                  <span className="text-[9px] font-semibold text-white drop-shadow-sm">{cat.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search threats by name or description..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-wrap">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1 flex-shrink-0">Category:</span>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                category === c
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/[0.03]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-wrap">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1 flex-shrink-0">Severity:</span>
          {SEVERITIES.map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                severityFilter === s
                  ? 'bg-white/[0.08] text-zinc-200 border-white/[0.12]'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/[0.03]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Threat Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Brain size={28} className="text-zinc-700" />
            </div>
            <p className="text-sm text-zinc-500 font-medium">No threats match your filters</p>
            <p className="text-xs text-zinc-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setSeverityFilter('All'); }}
              className="btn-ripple text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer mt-1"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map(threat => (
            <div
              key={threat.id}
              className="glass-panel card-premium rounded-xl overflow-hidden transition-all hover:border-white/[0.08]"
              style={{ borderLeft: `3px solid ${SEVERITY_COLORS[threat.severity]}` }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: SEVERITY_BG[threat.severity] }}
                  >
                    <Brain size={16} style={{ color: SEVERITY_COLORS[threat.severity] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-zinc-200">{threat.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                        style={{ background: SEVERITY_BG[threat.severity], color: SEVERITY_COLORS[threat.severity] }}
                      >
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.04]">
                        {threat.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{threat.description}</p>

                    {/* Confidence Score */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-zinc-600">Confidence Score</span>
                        <span className="text-[11px] font-semibold" style={{ color: SEVERITY_COLORS[threat.severity] }}>
                          {threat.confidence}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${threat.confidence}%`,
                            background: SEVERITY_COLORS[threat.severity],
                          }}
                        />
                      </div>
                    </div>

                    {/* Source + Timestamp */}
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Shield size={10} />
                        Source: {threat.source}
                      </span>
                      <span>·</span>
                      <span>{threat.timestamp}</span>
                    </div>

                    {/* Affected Regions */}
                    <div className="mt-3">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Affected Regions</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {threat.affectedRegions.map((r, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-blue-500/[0.06] text-blue-400/80 border border-blue-500/10 flex items-center gap-1">
                            <Globe size={8} />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Indicators */}
                    <div className="mt-3">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Key Indicators</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {threat.indicators.map((ind, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.03] text-zinc-400 border border-white/[0.04] flex items-center gap-1">
                            <AlertTriangle size={8} className="text-amber-400/60" />
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <button
                        onClick={() => handleBookmark(threat.id)}
                        className={`btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          threat.isBookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                        }`}
                      >
                        <Bookmark size={11} fill={threat.isBookmarked ? 'currentColor' : 'none'} />
                        {threat.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>
                      <button
                        onClick={() => handleShare(threat)}
                        className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <Share2 size={11} />
                        Share
                      </button>
                      <button
                        onClick={() => handleViewReport(threat)}
                        className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <FileText size={11} />
                        View Full Report
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => setExpandedId(expandedId === threat.id ? null : threat.id)}
                        className="btn-ripple flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <Eye size={11} />
                        {expandedId === threat.id ? 'Less' : 'More'}
                        <ChevronDown size={10} className={`transition-transform duration-200 ${expandedId === threat.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Expandable Details */}
                    {expandedId === threat.id && (
                      <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-3 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">Threat ID</span>
                            <span className="text-xs text-zinc-300 font-mono">THR-{threat.id.padStart(6, '0')}</span>
                          </div>
                          <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">Risk Rating</span>
                            <span className="text-xs font-semibold" style={{ color: SEVERITY_COLORS[threat.severity] }}>
                              {threat.confidence >= 90 ? 'SEVERE' : threat.confidence >= 80 ? 'HIGH' : threat.confidence >= 70 ? 'MODERATE' : 'LOW'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">First Seen</span>
                            <span className="text-xs text-zinc-300">2026-06-28</span>
                          </div>
                          <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">Last Updated</span>
                            <span className="text-xs text-zinc-300">2026-07-15</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
                          <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1.5">Recommendation</span>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {threat.severity === 'critical'
                              ? 'Immediate action required. Block related communications and report to authorities. Monitor for related phishing attempts.'
                              : threat.severity === 'high'
                              ? 'Urgent review recommended. Verify all communications related to this threat category and update security protocols.'
                              : 'Monitor situation closely. Ensure preventive measures are in place and staff are aware of indicators.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fraud Pattern Analysis - Radar Chart */}
      {topThreat && (
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Fraud Pattern Analysis</h3>
            <span className="text-[10px] text-zinc-500 ml-1">— {topThreat.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6">
            <svg width="240" height="220" viewBox="0 0 240 220" className="flex-shrink-0">
              {/* Background rings */}
              {[20, 40, 60, 80, 100].map(ring => {
                const cx = 120;
                const cy = 110;
                const r = (ring / 100) * 80;
                const pts = RADAR_DIMS.map((_, i) => {
                  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                  return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                }).join(' ');
                return (
                  <polygon
                    key={ring}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axes */}
              {RADAR_DIMS.map((_, i) => {
                const cx = 120;
                const cy = 110;
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                const ex = cx + 80 * Math.cos(angle);
                const ey = cy + 80 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={ex}
                    y2={ey}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data polygon */}
              {radarPoints && (
                <polygon
                  points={radarPoints}
                  fill="rgba(139,92,246,0.15)"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
              )}

              {/* Data points */}
              {radarPoints && (() => {
                const cx = 120;
                const cy = 110;
                const values = RADAR_DATA[topThreat.id] || [50, 50, 50, 50, 50];
                return values.map((v, i) => {
                  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                  const r = (v / 100) * 80;
                  return (
                    <circle
                      key={i}
                      cx={cx + r * Math.cos(angle)}
                      cy={cy + r * Math.sin(angle)}
                      r="3"
                      fill="#8b5cf6"
                      stroke="#1a1a2e"
                      strokeWidth="2"
                    />
                  );
                });
              })()}

              {/* Labels */}
              {radarLabelPositions.map((lp, i) => (
                <text
                  key={i}
                  x={lp.x}
                  y={lp.y}
                  textAnchor={lp.anchor as "start" | "middle" | "end"}
                  dominantBaseline="middle"
                  className="fill-zinc-400"
                  fontSize="9"
                >
                  {lp.dim}
                </text>
              ))}
            </svg>

            <div className="flex-1 space-y-3 w-full">
              {RADAR_DIMS.map((dim, i) => {
                const val = (RADAR_DATA[topThreat.id] || [50, 50, 50, 50, 50])[i];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-400">{dim}</span>
                      <span className="text-xs font-medium text-purple-400">{val}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${val}%`,
                          background: `linear-gradient(90deg, rgba(139,92,246,0.5), #8b5cf6)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
