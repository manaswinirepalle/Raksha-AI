import { useState, useEffect, useMemo } from 'react';
import {
  MapPin, RefreshCw, Loader2, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface Trend {
  id: string;
  category: string;
  change: number;
  reports: number;
  topRegion: string;
  description: string;
  timeframe: string;
}

const TRENDS: Trend[] = [
  { id: '1', category: 'UPI Fraud', change: 34, reports: 8420, topRegion: 'Maharashtra', description: 'Payment request scams via fake UPI IDs. Scammers claim to have sent money and request return.', timeframe: 'Last 30 days' },
  { id: '2', category: 'Job Scams', change: 28, reports: 5640, topRegion: 'Karnataka', description: 'Work-from-home job offers requiring upfront registration fees. Mostly via WhatsApp groups.', timeframe: 'Last 30 days' },
  { id: '3', category: 'Digital Arrest', change: -12, reports: 3200, topRegion: 'Delhi NCR', description: 'Impersonation of law enforcement via video call. Awareness campaigns reducing success rate.', timeframe: 'Last 30 days' },
  { id: '4', category: 'Phishing Links', change: 45, reports: 12300, topRegion: 'All India', description: 'SMS and email phishing with fake bank/IRCTC/Amazon links. Record increase this quarter.', timeframe: 'Last 30 days' },
  { id: '5', category: 'Loan App Fraud', change: 18, reports: 6780, topRegion: 'Tamil Nadu', description: 'Predatory loan apps with hidden charges and threatening recovery practices.', timeframe: 'Last 30 days' },
  { id: '6', category: 'Crypto Scams', change: 52, reports: 4100, topRegion: 'Gujarat', description: 'Ponzi-style crypto investment schemes. Fastest growing scam category this quarter.', timeframe: 'Last 30 days' },
  { id: '7', category: 'E-commerce Fraud', change: -5, reports: 2890, topRegion: 'West Bengal', description: 'Fake e-commerce sites and social media sellers taking payment without delivery.', timeframe: 'Last 30 days' },
  { id: '8', category: 'Insurance Fraud', change: 15, reports: 1890, topRegion: 'Rajasthan', description: 'Fake insurance policies sold via cold calls. Not registered with IRDAI.', timeframe: 'Last 30 days' },
];

const TIMEFRAMES = ['Last 7 days', 'Last 30 days', 'Last quarter', 'This year'];

export default function ScamTrends() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('Last 30 days');
  const [sortBy, setSortBy] = useState<'change' | 'reports'>('change');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const sortedTrends = useMemo(() => {
    return [...TRENDS].sort((a, b) => sortBy === 'change' ? Math.abs(b.change) - Math.abs(a.change) : b.reports - a.reports);
  }, [sortBy]);

  const totalReports = useMemo(() => TRENDS.reduce((a, t) => a + t.reports, 0), []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast('Latest trend data loaded', 'success');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Scam Trends</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Emerging patterns and regional analysis</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-50">
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel rounded-xl p-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Reports</span>
          <span className="text-2xl font-bold text-zinc-100 block mt-1">{totalReports.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">↑ 23% vs previous period</span>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Top Category</span>
          <span className="text-lg font-bold text-zinc-100 block mt-1">Phishing Links</span>
          <span className="text-[10px] text-zinc-500 mt-1 block">12,300 reports</span>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Fastest Growing</span>
          <span className="text-lg font-bold text-zinc-100 block mt-1">Crypto Scams</span>
          <span className="text-[10px] text-rose-400 mt-1 block">↑ 52% increase</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TIMEFRAMES.map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)}
              className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeframe === tf ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}>
              {tf}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSortBy('change')}
            className={`btn-ripple px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              sortBy === 'change' ? 'bg-white/[0.05] text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
            }`}>By Change</button>
          <button onClick={() => setSortBy('reports')}
            className={`btn-ripple px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              sortBy === 'reports' ? 'bg-white/[0.05] text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
            }`}>By Reports</button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTrends.map(trend => (
          <div key={trend.id} className="glass-panel rounded-xl p-4 hover:border-white/[0.08] transition-all">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${trend.change > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                {trend.change > 0 ? <ArrowUpRight size={18} className="text-rose-400" /> : <ArrowDownRight size={18} className="text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">{trend.category}</span>
                  <span className={`text-sm font-bold ${trend.change > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{trend.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <BarChart3 size={10} /> {trend.reports.toLocaleString()} reports
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin size={10} /> {trend.topRegion}
                  </span>
                  <span className="text-[10px] text-zinc-600">{trend.timeframe}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
