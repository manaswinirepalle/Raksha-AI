import { useState, useMemo } from 'react';
import { Map, X, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { INDIA_HEATMAP_DATA } from '../mockData';
import Tooltip from '../components/Tooltip';

export default function CrimeHeatmap() {
  const [selectedCity, setSelectedCity] = useState<typeof INDIA_HEATMAP_DATA[0] | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const maxComplaints = Math.max(...INDIA_HEATMAP_DATA.map(c => c.complaints));

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return [];
    const q = citySearch.toLowerCase();
    return INDIA_HEATMAP_DATA.filter(c =>
      c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [citySearch]);

  const topHotspots = useMemo(() =>
    [...INDIA_HEATMAP_DATA].sort((a, b) => b.complaints - a.complaints).slice(0, 6),
    []
  );

  const project = (lat: number, lng: number) => {
    const x = ((lng - 68) / (97 - 68)) * 700 + 50;
    const y = ((35 - lat) / (35 - 6)) * 500 + 30;
    return { x, y };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 animate-fade-slide-up">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-zinc-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <Map size={16} className="text-emerald-400" strokeWidth={1.5} />
            </div>
            <span className="truncate">Geospatial Crime Heatmap</span>
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 hidden sm:block">Complaint density visualization by city across India</p>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <Tooltip text="NCRB State-Wise Crime Data" />
        </div>
      </div>

      {/* City search */}
      <div className="relative mb-4 sm:mb-5 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
          <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
            placeholder="Search cities or states..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-subtle text-zinc-200 text-xs sm:text-sm placeholder-zinc-600 focus:outline-none transition-all duration-300 input-premium"
            aria-label="Search cities" />
          {citySearch && (
            <button onClick={() => setCitySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
              aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        {citySearch && filteredCities.length > 0 && (
          <div className="absolute z-[200] w-full mt-2 glass-panel-strong rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-[200px] overflow-y-auto">
            {filteredCities.map((city, i) => {
              const intensity = city.complaints / maxComplaints;
              return (
                <button key={i} onClick={() => { setSelectedCity(city); setCitySearch(''); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer border-b border-white/[0.04] last:border-b-0 flex items-center gap-2.5 touch-target btn-ripple relative overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: `rgba(244,63,94,${0.3 + intensity * 0.7})` }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm text-zinc-200 font-medium truncate block">{city.city}</span>
                    <span className="text-[10px] text-zinc-500">{city.state} — {city.complaints.toLocaleString()} complaints</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {citySearch && filteredCities.length === 0 && (
          <div className="absolute z-[200] w-full mt-2 glass-panel-strong rounded-xl shadow-2xl shadow-black/40 px-4 py-3 text-center">
            <span className="text-xs text-zinc-500">No cities found for "{citySearch}"</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-0 animate-fade-slide-up stagger-2" style={{ animationFillMode: 'both' }}>
        <div className="flex-1 glass-panel card-hover rounded-xl sm:rounded-2xl overflow-hidden relative min-h-[250px] sm:min-h-[300px] lg:min-h-0">
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path d="M180,80 L220,60 L280,70 L320,55 L370,65 L420,50 L470,60 L520,55 L560,70 L600,85 L640,100 L670,130 L690,170 L700,210 L710,260 L700,310 L680,350 L650,390 L620,420 L580,450 L540,470 L500,490 L460,500 L420,495 L380,480 L340,460 L300,430 L260,390 L230,350 L210,300 L190,250 L175,200 L170,150 L175,110 Z"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            {INDIA_HEATMAP_DATA.map((city, i) => {
              const pos = project(city.lat, city.lng);
              const intensity = city.complaints / maxComplaints;
              const r = 15 + intensity * 35;
              return (
                <g key={i} onClick={() => setSelectedCity(selectedCity?.city === city.city ? null : city)} style={{ cursor: 'pointer' }}>
                  <circle cx={pos.x} cy={pos.y} r={r + 10} fill={`rgba(244, 63, 94, ${intensity * 0.1})`} />
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={`rgba(244, 63, 94, ${0.1 + intensity * 0.3})`}
                    stroke={selectedCity?.city === city.city ? '#f43f5e' : `rgba(244, 63, 94, ${0.2 + intensity * 0.4})`}
                    strokeWidth={selectedCity?.city === city.city ? 2 : 1} />
                  <text x={pos.x} y={pos.y + r + 14} textAnchor="middle" fill={selectedCity?.city === city.city ? '#e4e4e7' : '#52525b'} fontSize="10" fontFamily="JetBrains Mono">
                    {city.city}
                  </text>
                  <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#e4e4e7" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    {(city.complaints / 1000).toFixed(1)}K
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4 sm:gap-5 lg:gap-6 flex-shrink-0">
          {selectedCity ? (
            <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5 animate-fade-slide-up">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <h3 className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider">City Briefing</h3>
                <button onClick={() => setSelectedCity(null)} className="text-zinc-500 hover:text-zinc-200 cursor-pointer touch-target p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors" aria-label="Close briefing">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                <div>
                  <span className="text-base sm:text-lg font-semibold text-zinc-100">{selectedCity.city}</span>
                  <span className="text-xs sm:text-sm text-zinc-500 ml-2">{selectedCity.state}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-3 rounded-xl glass-subtle">
                    <div className="font-mono text-lg sm:text-xl font-semibold text-rose-400">{selectedCity.complaints.toLocaleString()}</div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">Complaints</div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl glass-subtle">
                    <div className="font-mono text-lg sm:text-xl font-semibold text-amber-400">{selectedCity.amount}</div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">Total Loss</div>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={10} className="text-rose-400" />
                    <span className="font-mono text-[10px] sm:text-[11px] font-medium text-rose-400">THREAT ASSESSMENT</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed">
                    {selectedCity.complaints > 30000
                      ? 'Critical hotspot — requires immediate task force deployment. Top 3: Digital Arrest (34%), UPI Fraud (28%), Identity Theft (18%).'
                      : selectedCity.complaints > 20000
                        ? 'High-priority zone — increased surveillance recommended. Primary vector: WhatsApp-based social engineering.'
                        : 'Moderate concern — community awareness programs recommended. Focus on rural digital literacy.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center py-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <Map size={16} className="text-zinc-600" strokeWidth={1} />
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mb-1">Click a hotspot on the map</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-600">or search cities above to view briefing cards</p>
            </div>
          )}

          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <h3 className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-2.5 sm:mb-3">National Overview</h3>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { label: 'Total Complaints', value: '291,400', color: '#f43f5e' },
                { label: 'Total Loss', value: '₹5,097 Cr', color: '#f59e0b' },
                { label: 'Hotspots Tracked', value: String(INDIA_HEATMAP_DATA.length), color: '#3b82f6' },
                { label: 'Active Investigations', value: '12,847', color: '#8b5cf6' },
                { label: 'Recovery Rate', value: '18.3%', color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs text-zinc-500 truncate">{stat.label}</span>
                  <span className="font-mono text-xs sm:text-sm font-semibold flex-shrink-0" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5 flex-1 overflow-y-auto mobile-scroll">
            <h3 className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-2.5 sm:mb-3">
              <TrendingUp size={10} className="inline mr-1" />Top Hotspots
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {topHotspots.map((city, i) => {
                const intensity = city.complaints / maxComplaints;
                return (
                  <button key={i} onClick={() => setSelectedCity(city)}
                    className={`w-full flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer text-left touch-target btn-ripple relative overflow-hidden ${
                      selectedCity?.city === city.city
                        ? 'bg-rose-500/[0.06] border-rose-500/20'
                        : 'glass-subtle border-white/[0.04] hover:border-white/10'
                    }`}
                    aria-label={`#${i + 1} ${city.city} — ${(city.complaints / 1000).toFixed(1)}K complaints`}>
                    <span className="font-mono text-[9px] sm:text-[10px] text-zinc-600 w-4 flex-shrink-0 text-right font-semibold">{i + 1}</span>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `rgba(244,63,94,${0.3 + intensity * 0.7})` }} />
                    <span className="text-[10px] sm:text-xs text-zinc-200 flex-1 truncate">{city.city}</span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-rose-400 flex-shrink-0">{(city.complaints / 1000).toFixed(1)}K</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
