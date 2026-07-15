import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, RefreshCw, Loader2, BarChart3, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Brain, MapPin, Calendar,
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

interface StateData {
  state: string;
  complaints: number;
}

interface Prediction {
  text: string;
  confidence: number;
  color: string;
}

interface MonthlyPoint {
  month: string;
  value: number;
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

const STATES: StateData[] = [
  { state: 'Maharashtra', complaints: 14200 },
  { state: 'Delhi', complaints: 11800 },
  { state: 'Karnataka', complaints: 9600 },
  { state: 'Tamil Nadu', complaints: 8400 },
  { state: 'Gujarat', complaints: 7100 },
  { state: 'Rajasthan', complaints: 5800 },
  { state: 'West Bengal', complaints: 4900 },
  { state: 'Uttar Pradesh', complaints: 4200 },
];

const PREDICTIONS: Prediction[] = [
  { text: 'Phishing links expected to surge 40% next month', confidence: 87, color: 'rose' },
  { text: 'Crypto scams targeting tier-2 cities', confidence: 73, color: 'amber' },
  { text: 'Job scams shifting to Telegram groups', confidence: 81, color: 'violet' },
];

const MONTHLY_DATA: MonthlyPoint[] = [
  { month: 'Jan', value: 8200 },
  { month: 'Feb', value: 9100 },
  { month: 'Mar', value: 10400 },
  { month: 'Apr', value: 11200 },
  { month: 'May', value: 11800 },
  { month: 'Jun', value: 12300 },
];

const SPARKLINE_PATHS: Record<string, string> = {
  '1': 'M0 8 Q5 6, 10 7 T20 4 T30 5',
  '2': 'M0 9 Q5 8, 10 6 T20 5 T30 3',
  '3': 'M0 3 Q5 4, 10 5 T20 7 T30 8',
  '4': 'M0 10 Q5 8, 10 7 T20 5 T30 2',
  '5': 'M0 7 Q5 6, 10 5 T20 5 T30 4',
  '6': 'M0 9 Q5 7, 10 6 T20 4 T30 1',
  '7': 'M0 5 Q5 5, 10 6 T20 7 T30 7',
  '8': 'M0 8 Q5 7, 10 6 T20 5 T30 5',
};

function getBarColor(change: number): string {
  return change > 0 ? '#f43f5e' : '#10b981';
}

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
    return [...TRENDS].sort((a, b) =>
      sortBy === 'change' ? Math.abs(b.change) - Math.abs(a.change) : b.reports - a.reports
    );
  }, [sortBy]);

  const totalReports = useMemo(() => TRENDS.reduce((a, t) => a + t.reports, 0), []);

  const topCategory = useMemo(() =>
    [...TRENDS].sort((a, b) => b.reports - a.reports)[0], []
  );

  const fastestGrowing = useMemo(() =>
    [...TRENDS].sort((a, b) => b.change - a.change)[0], []
  );

  const maxReports = useMemo(() => Math.max(...TRENDS.map(t => t.reports)), []);

  const maxStateComplaints = useMemo(() => Math.max(...STATES.map(s => s.complaints)), []);

  const maxMonthly = useMemo(() => Math.max(...MONTHLY_DATA.map(d => d.value)), []);
  const minMonthly = useMemo(() => Math.min(...MONTHLY_DATA.map(d => d.value)), []);

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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="space-y-1.5">
            <div className="h-5 w-40 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="h-3 w-64 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
        <div className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      </div>
    );
  }

  const chartBarWidth = 40;
  const chartBarGap = 12;
  const chartWidth = TRENDS.length * (chartBarWidth + chartBarGap) - chartBarGap;
  const chartHeight = 180;
  const chartPaddingTop = 30;

  const monthlyChartWidth = 400;
  const monthlyChartHeight = 180;
  const monthlyPaddingLeft = 40;
  const monthlyPaddingBottom = 30;
  const monthlyPlotWidth = monthlyChartWidth - monthlyPaddingLeft;
  const monthlyPlotHeight = monthlyChartHeight - monthlyPaddingBottom;

  const monthlyPoints = MONTHLY_DATA.map((d, i) => ({
    x: monthlyPaddingLeft + (i / (MONTHLY_DATA.length - 1)) * monthlyPlotWidth,
    y: chartPaddingTop + (1 - (d.value - minMonthly) / (maxMonthly - minMonthly)) * (monthlyPlotHeight - chartPaddingTop),
    label: d.month,
    value: d.value,
  }));

  const monthlyPathD = monthlyPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Scam Trends</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Emerging scam patterns, regional data, and AI predictions</p>
          </div>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-50">
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10">
              <BarChart3 size={14} className="text-blue-400" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Reports This Month</span>
          </div>
          <span className="text-2xl font-bold text-zinc-100 block">{totalReports.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">↑ 23% vs previous period</span>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10">
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Most Reported Category</span>
          </div>
          <span className="text-lg font-bold text-zinc-100 block">{topCategory.category}</span>
          <span className="text-[10px] text-zinc-500 mt-1 block">{topCategory.reports.toLocaleString()} reports</span>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10">
              <TrendingUp size={14} className="text-rose-400" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Fastest Growing</span>
          </div>
          <span className="text-lg font-bold text-zinc-100 block">{fastestGrowing.category}</span>
          <span className="text-[10px] text-rose-400 mt-1 block">↑ {fastestGrowing.change}% increase</span>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 overflow-x-auto">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Category Reports Distribution</h3>
        <svg width={chartWidth} height={chartHeight + 50} viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`} className="w-full" style={{ minWidth: chartWidth }}>
          {TRENDS.map((trend, i) => {
            const barHeight = (trend.reports / maxReports) * chartHeight;
            const x = i * (chartBarWidth + chartBarGap);
            const y = chartPaddingTop + (chartHeight - barHeight);
            const color = getBarColor(trend.change);
            return (
              <g key={trend.id} className="group cursor-pointer">
                <rect
                  x={x}
                  y={y}
                  width={chartBarWidth}
                  height={barHeight}
                  rx={4}
                  fill={color}
                  fillOpacity={0.7}
                  className="transition-all duration-200 group-hover:fill-opacity-100"
                  style={{ filter: 'brightness(1)', transition: 'filter 0.2s' }}
                  onMouseEnter={(e) => { (e.target as SVGRectElement).style.filter = 'brightness(1.3)'; }}
                  onMouseLeave={(e) => { (e.target as SVGRectElement).style.filter = 'brightness(1)'; }}
                />
                <text
                  x={x + chartBarWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="text-[10px] font-bold"
                  fill={color}
                >
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </text>
                <text
                  x={x + chartBarWidth / 2}
                  y={chartPaddingTop + chartHeight + 14}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#a1a1aa"
                >
                  {trend.reports.toLocaleString()}
                </text>
                <text
                  x={x + chartBarWidth / 2}
                  y={chartPaddingTop + chartHeight + 28}
                  textAnchor="middle"
                  className="text-[8px]"
                  fill="#71717a"
                >
                  {trend.category.length > 10 ? trend.category.slice(0, 9) + '..' : trend.category}
                </text>
              </g>
            );
          })}
        </svg>
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
              sortBy === 'change' ? 'bg-white/[0.05] text-zinc-200 border border-white/[0.08]' : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
            }`}>Sort by Change</button>
          <button onClick={() => setSortBy('reports')}
            className={`btn-ripple px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              sortBy === 'reports' ? 'bg-white/[0.05] text-zinc-200 border border-white/[0.08]' : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
            }`}>Sort by Reports</button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTrends.map(trend => (
          <div key={trend.id} className="glass-panel card-premium rounded-xl p-4 hover:border-white/[0.08] transition-all">
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
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{trend.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <BarChart3 size={10} /> {trend.reports.toLocaleString()} reports
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <MapPin size={10} /> {trend.topRegion}
                    </span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Calendar size={10} /> {trend.timeframe}
                    </span>
                  </div>
                  <svg width="50" height="16" viewBox="0 0 50 16" className="flex-shrink-0 opacity-60">
                    <path
                      d={SPARKLINE_PATHS[trend.id] || 'M0 8 Q5 8, 10 8 T20 8 T30 8'}
                      fill="none"
                      stroke={trend.change > 0 ? '#f43f5e' : '#10b981'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      transform="scale(1.5, 1)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Top Affected States</h3>
        <div className="space-y-2">
          {STATES.map((s) => {
            const barWidth = (s.complaints / maxStateComplaints) * 100;
            return (
              <div key={s.state} className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-400 w-28 text-right flex-shrink-0 truncate">{s.state}</span>
                <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(59,130,246,0.6))' }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">{s.complaints.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10">
            <Brain size={14} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-medium text-zinc-300">AI Trend Predictions</h3>
        </div>
        <div className="space-y-3">
          {PREDICTIONS.map((pred, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                pred.color === 'rose' ? 'bg-rose-400' : pred.color === 'amber' ? 'bg-amber-400' : 'bg-violet-400'
              }`} />
              <div className="flex-1">
                <p className="text-xs text-zinc-300 leading-relaxed">{pred.text}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-zinc-500">Confidence</span>
                  <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pred.confidence}%`,
                        background: pred.color === 'rose' ? '#f43f5e' : pred.color === 'amber' ? '#f59e0b' : '#8b5cf6',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{pred.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Monthly Overview - {topCategory.category}</h3>
        <svg width="100%" height={monthlyChartHeight + monthlyPaddingBottom} viewBox={`0 0 ${monthlyChartWidth} ${monthlyChartHeight + monthlyPaddingBottom}`} preserveAspectRatio="xMidYMid meet">
          {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
            const val = minMonthly + frac * (maxMonthly - minMonthly);
            const y = chartPaddingTop + (1 - frac) * (monthlyPlotHeight - chartPaddingTop);
            return (
              <g key={i}>
                <line
                  x1={monthlyPaddingLeft}
                  y1={y}
                  x2={monthlyChartWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={monthlyPaddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px]"
                  fill="#71717a"
                >
                  {(val / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}
          <path
            d={monthlyPathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {monthlyPoints.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill="#18181b" stroke="#3b82f6" strokeWidth="2" />
              <text
                x={p.x}
                y={monthlyChartHeight + 16}
                textAnchor="middle"
                className="text-[9px]"
                fill="#71717a"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
