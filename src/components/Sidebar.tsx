import { useState } from 'react';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { SECTIONS, getModulesBySection, type ModuleId } from '../MODULE_REGISTRY';

export type { ModuleId };

export default function Sidebar({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col h-full transition-all duration-300 ease-out ${
        collapsed ? 'w-[68px]' : 'w-[232px]'
      }`}
      style={{
        background: 'rgba(255,255,255,0.015)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div className={`flex items-center h-14 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' }}>
          <Shield size={16} className="text-blue-400" strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-zinc-100 tracking-wide truncate">RAKSHA AI</span>
            <span className="text-[9px] font-mono text-zinc-600 tracking-wider">v1.0.0</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 mobile-scroll">
        {SECTIONS.map(section => {
          const sectionModules = getModulesBySection(section);
          return (
            <div key={section}>
              {!collapsed && (
                <div className="px-3 mb-1.5">
                  <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.12em]">
                    {section}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {sectionModules.map(m => {
                  const Icon = m.icon;
                  const isActive = active === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelect(m.id)}
                      className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer group relative btn-ripple overflow-hidden ${
                        collapsed ? 'justify-center px-0 py-2.5 mx-auto w-10' : 'px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-blue-500/[0.08] text-blue-400'
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                          style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                      )}
                      <Icon size={17} strokeWidth={1.5} className="flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-[13px] font-medium truncate">{m.label}</span>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 glass-panel-strong text-zinc-200 font-medium shadow-xl shadow-black/30">
                          {m.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer btn-ripple relative overflow-hidden ${
            collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
          }`}>
          {collapsed ? <ChevronRight size={17} strokeWidth={1.5} /> : <ChevronLeft size={17} strokeWidth={1.5} />}
          {!collapsed && <span className="text-[13px] font-medium">Collapse</span>}
        </button>

        <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mt-1 transition-colors duration-200 hover:bg-white/[0.03] cursor-default ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-zinc-300"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' }}>
            AI
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium text-zinc-200 truncate">Analyst</span>
              <span className="text-[10px] text-zinc-600 truncate">admin@raksha.ai</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
