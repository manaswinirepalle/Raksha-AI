import { Search, Bell, Settings, Command } from 'lucide-react';

export default function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
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
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-zinc-500 text-[12px] cursor-pointer hover:bg-white/[0.03] transition-all duration-200" style={{ border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
          <Search size={13} strokeWidth={1.5} />
          <span className="hidden md:inline">Search...</span>
          <div className="hidden md:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-600" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <Command size={10} />K
          </div>
        </div>
        <button className="relative p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 text-zinc-500 hover:text-zinc-300" aria-label="Notifications">
          <Bell size={16} strokeWidth={1.5} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#f43f5e', boxShadow: '0 0 6px rgba(244,63,94,0.5)' }} />
        </button>
        <button className="p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 text-zinc-500 hover:text-zinc-300" aria-label="Settings">
          <Settings size={16} strokeWidth={1.5} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-blue-400" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.15)' }}>
          AI
        </div>
      </div>
    </header>
  );
}
