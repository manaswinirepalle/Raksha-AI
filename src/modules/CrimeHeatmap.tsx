import { useState } from 'react';
import { Map, X, AlertTriangle, TrendingUp } from 'lucide-react';
import { INDIA_HEATMAP_DATA } from '../mockData';
import Tooltip from '../components/Tooltip';

export default function CrimeHeatmap() {
  const [selectedCity, setSelectedCity] = useState<typeof INDIA_HEATMAP_DATA[0] | null>(null);

  const maxComplaints = Math.max(...INDIA_HEATMAP_DATA.map(c => c.complaints));

  const project = (lat: number, lng: number) => {
    const x = ((lng - 68) / (97 - 68)) * 700 + 50;
    const y = ((35 - lat) / (35 - 6)) * 500 + 30;
    return { x, y };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-slide-up">
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center gap-2.5">
            <Map size={22} className="text-[#34D399]" />
            Geospatial Crime Heatmap
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">Complaint density visualization by city across India</p>
        </div>
        <Tooltip text="NCRB State-Wise Crime Data" />
      </div>

      <div className="flex-1 flex gap-6 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {/* Map */}
        <div className="flex-1 bg-[#131B2E] rounded-2xl border border-[#1F2937] overflow-hidden relative">
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <path
              d="M180,80 L220,60 L280,70 L320,55 L370,65 L420,50 L470,60 L520,55 L560,70 L600,85 L640,100 L670,130 L690,170 L700,210 L710,260 L700,310 L680,350 L650,390 L620,420 L580,450 L540,470 L500,490 L460,500 L420,495 L380,480 L340,460 L300,430 L260,390 L230,350 L210,300 L190,250 L175,200 L170,150 L175,110 Z"
              fill="none"
              stroke="#1F2937"
              strokeWidth="2"
            />

            {INDIA_HEATMAP_DATA.map((city, i) => {
              const pos = project(city.lat, city.lng);
              const intensity = city.complaints / maxComplaints;
              const r = 15 + intensity * 35;

              return (
                <g
                  key={i}
                  onClick={() => setSelectedCity(selectedCity?.city === city.city ? null : city)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx={pos.x} cy={pos.y} r={r + 10} fill={`rgba(255, 59, 78, ${intensity * 0.15})`} />
                  <circle
                    cx={pos.x} cy={pos.y} r={r}
                    fill={`rgba(255, 59, 78, ${0.15 + intensity * 0.4})`}
                    stroke={selectedCity?.city === city.city ? '#FF3B4E' : `rgba(255, 59, 78, ${0.3 + intensity * 0.5})`}
                    strokeWidth={selectedCity?.city === city.city ? 2.5 : 1.5}
                  />
                  <text x={pos.x} y={pos.y + r + 14} textAnchor="middle" fill={selectedCity?.city === city.city ? '#E5E7EB' : '#6B7280'} fontSize="10" fontFamily="JetBrains Mono">
                    {city.city}
                  </text>
                  <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#E5E7EB" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    {(city.complaints / 1000).toFixed(1)}K
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side panel */}
        <div className="w-80 flex flex-col gap-6">
          {selectedCity ? (
            <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 animate-fade-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider">City Briefing</h3>
                <button onClick={() => setSelectedCity(null)} className="text-[#6B7280] hover:text-[#E5E7EB] cursor-pointer">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-lg font-bold text-[#E5E7EB]">{selectedCity.city}</span>
                  <span className="text-sm text-[#6B7280] ml-2">{selectedCity.state}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1F2937]">
                    <div className="font-mono text-xl font-bold text-[#FF3B4E]">{selectedCity.complaints.toLocaleString()}</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Complaints</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1F2937]">
                    <div className="font-mono text-xl font-bold text-[#FBBF24]">{selectedCity.amount}</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Total Loss</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FF3B4E]/8 border border-[#FF3B4E]/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={12} className="text-[#FF3B4E]" />
                    <span className="font-mono text-[11px] font-semibold text-[#FF3B4E]">THREAT ASSESSMENT</span>
                  </div>
                  <p className="text-xs text-[#E5E7EB]/80 leading-relaxed">
                    {selectedCity.complaints > 30000
                      ? 'Critical hotspot — requires immediate task force deployment. Top 3 complaint types: Digital Arrest (34%), UPI Fraud (28%), Identity Theft (18%).'
                      : selectedCity.complaints > 20000
                        ? 'High-priority zone — increased surveillance recommended. Primary attack vector: WhatsApp-based social engineering.'
                        : 'Moderate concern — community awareness programs recommended. Focus on rural digital literacy.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 flex items-center justify-center text-center">
              <p className="text-sm text-[#6B7280]">Click a hotspot on the map to view the city briefing card</p>
            </div>
          )}

          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">National Overview</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Complaints', value: '291,400', color: '#FF3B4E' },
                { label: 'Total Loss', value: '₹5,097 Cr', color: '#FBBF24' },
                { label: 'Hotspots Tracked', value: String(INDIA_HEATMAP_DATA.length), color: '#22D3EE' },
                { label: 'Active Investigations', value: '12,847', color: '#A78BFA' },
                { label: 'Recovery Rate', value: '18.3%', color: '#34D399' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{stat.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 flex-1 overflow-y-auto">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">
              <TrendingUp size={12} className="inline mr-1" />
              Top Hotspots
            </h3>
            <div className="space-y-2">
              {[...INDIA_HEATMAP_DATA]
                .sort((a, b) => b.complaints - a.complaints)
                .slice(0, 6)
                .map((city, i) => {
                  const intensity = city.complaints / maxComplaints;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer text-left ${
                        selectedCity?.city === city.city
                          ? 'bg-[#FF3B4E]/10 border-[#FF3B4E]/30'
                          : 'bg-[#0B1220] border-[#1F2937] hover:border-[#1F2937]/80'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgba(255,59,78,${0.3 + intensity * 0.7})` }} />
                      <span className="text-xs text-[#E5E7EB] flex-1">{city.city}</span>
                      <span className="font-mono text-[11px] text-[#FF3B4E]">{(city.complaints / 1000).toFixed(1)}K</span>
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
