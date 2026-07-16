import { useState, useRef, useCallback } from 'react';
import {
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  MapPin,
  Activity,
  Shield,
} from 'lucide-react';

type Period = '7D' | '30D' | '90D' | '1Y';

interface ScamType {
  name: string;
  color: string;
  data: number[];
}

interface Category {
  name: string;
  pct: number;
  change: number;
  color: string;
}

interface StateRow {
  rank: number;
  state: string;
  complaints: number;
  amount: string;
}

interface Prediction {
  scamType: string;
  confidence: number;
  window: string;
  risk: 'high' | 'medium' | 'low';
}

interface MonthlyComparison {
  category: string;
  thisMonth: number;
  lastMonth: number;
}

const SCAM_TYPES: ScamType[] = [
  {
    name: 'Phishing',
    color: '#60a5fa',
    data: [1800, 2100, 1950, 2400, 2800, 3200, 3100, 3500, 3800, 4200, 4600, 5100],
  },
  {
    name: 'UPI Fraud',
    color: '#a78bfa',
    data: [1200, 1400, 1350, 1600, 1900, 2100, 2050, 2300, 2500, 2700, 2900, 3200],
  },
  {
    name: 'Job Scam',
    color: '#34d399',
    data: [800, 900, 850, 1100, 1300, 1500, 1450, 1700, 1900, 2100, 2300, 2600],
  },
  {
    name: 'Loan App',
    color: '#fb923c',
    data: [600, 700, 680, 800, 950, 1100, 1050, 1200, 1350, 1500, 1650, 1800],
  },
  {
    name: 'Crypto',
    color: '#f472b6',
    data: [300, 350, 400, 500, 650, 800, 900, 1100, 1300, 1600, 1900, 2300],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORIES: Category[] = [
  { name: 'Phishing', pct: 34, change: 8.2, color: '#60a5fa' },
  { name: 'UPI Fraud', pct: 26, change: 12.5, color: '#a78bfa' },
  { name: 'Job Scams', pct: 18, change: 5.1, color: '#34d399' },
  { name: 'Loan App', pct: 12, change: -3.4, color: '#fb923c' },
  { name: 'Crypto', pct: 7, change: 22.1, color: '#f472b6' },
  { name: 'Other', pct: 3, change: -1.8, color: '#71717a' },
];

const TOP_STATES: StateRow[] = [
  { rank: 1, state: 'Delhi', complaints: 11800, amount: '₹42.3 Cr' },
  { rank: 2, state: 'Maharashtra', complaints: 10400, amount: '₹38.7 Cr' },
  { rank: 3, state: 'Karnataka', complaints: 8200, amount: '₹29.1 Cr' },
  { rank: 4, state: 'Tamil Nadu', complaints: 7600, amount: '₹26.8 Cr' },
  { rank: 5, state: 'Gujarat', complaints: 6100, amount: '₹21.4 Cr' },
  { rank: 6, state: 'Rajasthan', complaints: 5400, amount: '₹18.9 Cr' },
  { rank: 7, state: 'Uttar Pradesh', complaints: 4900, amount: '₹16.2 Cr' },
  { rank: 8, state: 'West Bengal', complaints: 3800, amount: '₹12.6 Cr' },
];

const PREDICTIONS: Prediction[] = [
  {
    scamType: 'Phishing Surge',
    confidence: 91,
    window: 'Next 14 days',
    risk: 'high',
  },
  {
    scamType: 'UPI Fraud Spike',
    confidence: 78,
    window: 'Next 30 days',
    risk: 'high',
  },
  {
    scamType: 'Crypto Ponzi',
    confidence: 65,
    window: 'Next 60 days',
    risk: 'medium',
  },
];

const MONTHLY_COMPARISON: MonthlyComparison[] = [
  { category: 'Phishing', thisMonth: 5100, lastMonth: 4600 },
  { category: 'UPI Fraud', thisMonth: 3200, lastMonth: 2900 },
  { category: 'Job Scam', thisMonth: 2600, lastMonth: 2300 },
  { category: 'Loan App', thisMonth: 1800, lastMonth: 1650 },
  { category: 'Crypto', thisMonth: 2300, lastMonth: 1900 },
  { category: 'E-comm', thisMonth: 1200, lastMonth: 1400 },
];

const CHART_W = 800;
const CHART_H = 320;
const PAD = { top: 30, right: 30, bottom: 40, left: 60 };
const PLOT_W = CHART_W - PAD.left - PAD.right;
const PLOT_H = CHART_H - PAD.top - PAD.bottom;

const ALL_VALUES = SCAM_TYPES.flatMap((t) => t.data);
const Y_MIN = 0;
const Y_MAX = Math.ceil(Math.max(...ALL_VALUES) / 1000) * 1000;

function getX(i: number): number {
  return PAD.left + (i / (MONTHS.length - 1)) * PLOT_W;
}

function getY(v: number): number {
  return PAD.top + PLOT_H - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
}

function buildSmoothPath(data: number[]): string {
  return data
    .map((v, i) => {
      const x = getX(i);
      const y = getY(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = getX(i - 1);
      const py = getY(data[i - 1]);
      const cpx1 = px + (x - px) * 0.4;
      const cpx2 = x - (x - px) * 0.4;
      return `C ${cpx1} ${py}, ${cpx2} ${y}, ${x} ${y}`;
    })
    .join(' ');
}

function buildAreaPath(data: number[]): string {
  const line = buildSmoothPath(data);
  const lastX = getX(data.length - 1);
  const firstX = getX(0);
  const bottom = PAD.top + PLOT_H;
  return `${line} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
}

function GradientDefs() {
  return (
    <defs>
      {SCAM_TYPES.map((t) => (
        <linearGradient key={t.name} id={`grad-${t.name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={t.color} stopOpacity={0.02} />
        </linearGradient>
      ))}
    </defs>
  );
}

function GridLines() {
  const steps = 5;
  return (
    <>
      {Array.from({ length: steps + 1 }, (_, i) => {
        const v = Y_MIN + (i / steps) * (Y_MAX - Y_MIN);
        const y = getY(v);
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={y}
              x2={CHART_W - PAD.right}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
            <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#52525b" fontSize={11}>
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
      {MONTHS.map((m, i) => (
        <text
          key={m}
          x={getX(i)}
          y={CHART_H - 8}
          textAnchor="middle"
          fill="#52525b"
          fontSize={11}
        >
          {m}
        </text>
      ))}
    </>
  );
}

interface TooltipData {
  monthIdx: number;
  x: number;
  y: number;
}

interface TrendChartProps {
  hoveredPoint: TooltipData | null;
  onHover: (d: TooltipData | null) => void;
}

function TrendChart({ hoveredPoint, onHover }: TrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * CHART_W;
      let closest = 0;
      let closestDist = Infinity;
      MONTHS.forEach((_, i) => {
        const dist = Math.abs(getX(i) - mouseX);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      if (closestDist < PLOT_W / MONTHS.length) {
        onHover({ monthIdx: closest, x: getX(closest), y: PAD.top });
      } else {
        onHover(null);
      }
    },
    [onHover],
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
    >
      <GradientDefs />
      <GridLines />
      {SCAM_TYPES.map((t) => (
        <path key={t.name} d={buildAreaPath(t.data)} fill={`url(#grad-${t.name})`} />
      ))}
      {SCAM_TYPES.map((t) => (
        <path
          key={`line-${t.name}`}
          d={buildSmoothPath(t.data)}
          fill="none"
          stroke={t.color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {hoveredPoint && (
        <>
          <line
            x1={hoveredPoint.x}
            y1={PAD.top}
            x2={hoveredPoint.x}
            y2={PAD.top + PLOT_H}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 2"
          />
          {SCAM_TYPES.map((t) => {
            const val = t.data[hoveredPoint.monthIdx];
            const cy = getY(val);
            return (
              <circle
                key={`dot-${t.name}`}
                cx={hoveredPoint.x}
                cy={cy}
                r={4}
                fill="#18181b"
                stroke={t.color}
                strokeWidth={2}
              />
            );
          })}
          <foreignObject
            x={hoveredPoint.x + 10 > CHART_W - 160 ? hoveredPoint.x - 170 : hoveredPoint.x + 10}
            y={PAD.top + 4}
            width={160}
            height={SCAM_TYPES.length * 24 + 32}
          >
            <div
              style={{
                background: 'rgba(24,24,27,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '8px 10px',
                backdropFilter: 'blur(12px)',
                fontSize: 11,
              }}
            >
              <div style={{ color: '#a1a1aa', marginBottom: 4, fontWeight: 600, fontSize: 10 }}>
                {MONTHS[hoveredPoint.monthIdx]}
              </div>
              {SCAM_TYPES.map((t) => (
                <div
                  key={t.name}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span style={{ color: '#d4d4d8' }}>{t.name}</span>
                  </div>
                  <span style={{ color: '#e4e4e7', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {t.data[hoveredPoint.monthIdx].toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </foreignObject>
        </>
      )}
    </svg>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {SCAM_TYPES.map((t) => (
        <div key={t.name} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
          <span className="text-[11px] text-zinc-400">{t.name}</span>
        </div>
      ))}
    </div>
  );
}

function StatsRow() {
  const stats = [
    { label: 'Total Scams', value: '45,230', icon: <BarChart3 size={14} className="text-blue-400" /> },
    { label: 'This Month', value: '3,847', icon: <Activity size={14} className="text-violet-400" /> },
    { label: 'Growth', value: '+12.3%', icon: <TrendingUp size={14} className="text-rose-400" /> },
    { label: 'Most Common', value: 'Phishing', icon: <Shield size={14} className="text-amber-400" /> },
  ];
  return (
    <div className="db-stats">
      {stats.map((s) => (
        <div key={s.label} className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            {s.icon}
          </div>
          <div>
            <span className="db-stat-value">{s.value}</span>
            <span className="db-stat-label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryBreakdown() {
  return (
    <div className="db-section">
      <div className="db-section-header">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-blue-400" />
          <span className="db-section-title">Category Breakdown</span>
        </div>
      </div>
      <div className="db-card">
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-20 text-right flex-shrink-0">{c.name}</span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.pct}%`, background: c.color, opacity: 0.8 }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 w-10 text-right">{c.pct}%</span>
              <span className={`text-[11px] font-semibold flex items-center gap-0.5 w-14 justify-end ${c.change > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {c.change > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {Math.abs(c.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopStates() {
  const maxComplaints = TOP_STATES[0].complaints;
  return (
    <div className="db-section">
      <div className="db-section-header">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-blue-400" />
          <span className="db-section-title">Top Affected States</span>
        </div>
      </div>
      <div className="db-card">
        <div className="space-y-2.5">
          {TOP_STATES.map((s) => (
            <div key={s.state} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-zinc-500 w-5 text-center flex-shrink-0">#{s.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-300 font-medium">{s.state}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-zinc-500">{s.complaints.toLocaleString()} complaints</span>
                    <span className="text-[11px] text-zinc-400 font-medium">{s.amount}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(s.complaints / maxComplaints) * 100}%`,
                      background: 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.7))',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIPredictions() {
  const riskColor: Record<string, string> = {
    high: 'text-rose-400 bg-rose-500/10',
    medium: 'text-amber-400 bg-amber-500/10',
    low: 'text-emerald-400 bg-emerald-500/10',
  };
  const confColor: Record<string, string> = {
    high: '#f43f5e',
    medium: '#f59e0b',
    low: '#10b981',
  };
  return (
    <div className="db-section">
      <div className="db-section-header">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-violet-400" />
          <span className="db-section-title">AI Predictions</span>
        </div>
      </div>
      <div className="db-grid-3">
        {PREDICTIONS.map((p) => (
          <div key={p.scamType} className="db-card card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-200">{p.scamType}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskColor[p.risk]}`}>
                {p.risk.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-zinc-500">Confidence</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${p.confidence}%`, background: confColor[p.risk] }}
                />
              </div>
              <span className="text-[11px] text-zinc-300 font-semibold">{p.confidence}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500">Window:</span>
              <span className="text-[11px] text-zinc-400">{p.window}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyComparisonChart() {
  const maxVal = Math.max(...MONTHLY_COMPARISON.flatMap((c) => [c.thisMonth, c.lastMonth]));
  return (
    <div className="db-section">
      <div className="db-section-header">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-blue-400" />
          <span className="db-section-title">Monthly Comparison</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(59,130,246,0.7)' }} />
            <span className="text-[10px] text-zinc-500">This Month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(59,130,246,0.25)' }} />
            <span className="text-[10px] text-zinc-500">Last Month</span>
          </div>
        </div>
      </div>
      <div className="db-card">
        <div className="flex items-end gap-3" style={{ height: 180 }}>
          {MONTHLY_COMPARISON.map((c) => (
            <div key={c.category} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1" style={{ height: 140 }}>
                <div
                  className="w-[40%] rounded-t transition-all duration-500"
                  style={{
                    height: `${(c.thisMonth / maxVal) * 100}%`,
                    background: 'rgba(59,130,246,0.7)',
                    minHeight: 4,
                  }}
                />
                <div
                  className="w-[40%] rounded-t transition-all duration-500"
                  style={{
                    height: `${(c.lastMonth / maxVal) * 100}%`,
                    background: 'rgba(59,130,246,0.25)',
                    minHeight: 4,
                  }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 text-center leading-tight mt-1">{c.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScamTrends() {
  const [period, setPeriod] = useState<Period>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<TooltipData | null>(null);
  const periods: Period[] = ['7D', '30D', '90D', '1Y'];

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
            <TrendingUp size={16} className="text-white" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Scam Trends</h2>
            <p className="db-subtitle">Advanced analytics, AI predictions, and regional intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`db-btn text-[11px] px-3 py-1 ${
                period === p ? '!bg-blue-500/15 !text-blue-400 !border-blue-500/20' : '!border-transparent !bg-transparent !text-zinc-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <StatsRow />

      <div className="db-section">
        <div className="db-section-header">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-blue-400" />
            <span className="db-section-title">Scam Trends Over Time</span>
          </div>
          <Legend />
        </div>
        <div className="db-card glass-panel overflow-x-auto">
          <TrendChart hoveredPoint={hoveredPoint} onHover={setHoveredPoint} />
        </div>
      </div>

      <CategoryBreakdown />
      <TopStates />
      <AIPredictions />
      <MonthlyComparisonChart />
    </div>
  );
}
