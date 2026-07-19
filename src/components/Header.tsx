import { Search, Settings, Command } from 'lucide-react';
import type { ModuleId } from '../MODULE_REGISTRY';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNavigate?: (id: ModuleId) => void;
  onSearchOpen?: () => void;
}

export default function Header({ title, subtitle, onNavigate, onSearchOpen }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between gap-4 h-12 mb-3"
      style={{ opacity: 1 }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {title && (
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-zinc-100 truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-zinc-500 truncate">{subtitle}</p>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-zinc-500 text-[12px] cursor-pointer hover:bg-white/[0.04] hover:text-zinc-300 transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}
        >
          <Search size={13} strokeWidth={1.5} />
          <span className="hidden md:inline">Search...</span>
          <div className="hidden md:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-600" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <Command size={10} />K
          </div>
        </button>
        <button
          onClick={() => onNavigate?.('settings')}
          className="p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 text-zinc-500 hover:text-zinc-300 cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={16} strokeWidth={1.5} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-blue-400" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.15)' }}>
          AI
        </div>
      </div>
    </header>
  );
}
