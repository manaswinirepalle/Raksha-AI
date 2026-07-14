import { Shield, Phone, Banknote, Network, Map, MessageSquare } from 'lucide-react';

export type ModuleId = 'landing' | 'scam-detector' | 'counterfeit' | 'fraud-network' | 'heatmap' | 'citizen-shield';

const MODULES: { id: ModuleId; icon: typeof Shield; label: string; priority: string }[] = [
  { id: 'scam-detector', icon: Phone, label: 'Scam Detector', priority: 'P1' },
  { id: 'citizen-shield', icon: MessageSquare, label: 'Citizen Shield', priority: 'P1' },
  { id: 'counterfeit', icon: Banknote, label: 'Counterfeit Agent', priority: 'P3' },
  { id: 'fraud-network', icon: Network, label: 'Network Graph', priority: 'P2' },
  { id: 'heatmap', icon: Map, label: 'Crime Heatmap', priority: 'P2' },
];

export default function Sidebar({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <div className="flex flex-col items-center w-[72px] h-full bg-[#131B2E] border-r border-[#1F2937] py-5 gap-1.5">
      <div className="flex items-center justify-center w-11 h-11 mb-4">
        <Shield size={24} className="text-[#22D3EE]" />
      </div>
      {MODULES.map(m => {
        const Icon = m.icon;
        const isActive = active === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`relative group flex flex-col items-center justify-center w-[46px] h-[46px] rounded-xl
              transition-all duration-150 cursor-pointer
              ${isActive
                ? 'bg-[#22D3EE]/10 text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'text-[#6B7280] hover:text-[#E5E7EB] hover:bg-[#1F2937]'
              }`}
            title={m.label}
          >
            <Icon size={20} />
            <span className="text-[9px] mt-0.5 font-medium leading-none">{m.label.split(' ')[0]}</span>
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-[#22D3EE]" />
            )}
            <div className="absolute left-full ml-2 px-2 py-1 rounded bg-[#1F2937] border border-[#1F2937] text-[#E5E7EB] text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {m.label}
            </div>
          </button>
        );
      })}
      <div className="flex-1" />
      <div className="w-9 h-9 rounded-full bg-[#1F2937] flex items-center justify-center">
        <span className="font-mono text-[10px] text-[#6B7280]">AI</span>
      </div>
    </div>
  );
}
