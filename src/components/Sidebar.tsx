import { useState, useEffect, useCallback } from 'react';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { SECTIONS, getModulesBySection, type ModuleId } from '../MODULE_REGISTRY';

export type { ModuleId };

const COLLAPSE_WIDTH = 64;
const EXPAND_WIDTH = 228;
const PANEL_MARGIN = 10;
const PANEL_VERTICAL_MARGIN = 10;

const SIDEBAR_STATE_KEY = 'raksha-sidebar-collapsed';

export default function Sidebar({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (stored !== null) return stored === 'true';
    } catch { /* ignore */ }
    return window.innerWidth < 1400;
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);



  useEffect(() => {
    const totalWidth = windowWidth >= 1024 ? (collapsed ? COLLAPSE_WIDTH + PANEL_MARGIN * 2 : EXPAND_WIDTH + PANEL_MARGIN * 2) : 0;
    document.documentElement.style.setProperty('--sidebar-width', `${totalWidth}px`);
    return () => { document.documentElement.style.setProperty('--sidebar-width', '0px'); };
  }, [collapsed, windowWidth]);

  const toggleCollapse = useCallback(() => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem(SIDEBAR_STATE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const sidebarWidth = collapsed ? COLLAPSE_WIDTH : EXPAND_WIDTH;

  return (
    <aside
      className="hidden lg:flex flex-col"
      style={{
        position: 'fixed',
        top: PANEL_VERTICAL_MARGIN,
        left: PANEL_MARGIN,
        bottom: PANEL_VERTICAL_MARGIN,
        zIndex: 30,
        width: sidebarWidth,
        minWidth: sidebarWidth,
        borderRadius: 18,
        background: 'rgba(15, 15, 18, 0.82)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), min-width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'width',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div
        className={`flex items-center h-12 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 icon-hover-rotate"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <Shield size={17} className="text-blue-400" strokeWidth={1.5} />
        </div>
        <div
          className="flex flex-col min-w-0 overflow-hidden"
          style={{
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? 'translateX(-8px)' : 'translateX(0)',
            transition: 'opacity 200ms ease, transform 200ms ease',
            width: collapsed ? 0 : 'auto',
          }}
        >
          <span className="text-[13px] font-bold text-zinc-100 tracking-wide truncate whitespace-nowrap">RAKSHA AI</span>
          <span className="text-[9px] font-mono text-zinc-600 tracking-wider whitespace-nowrap">v1.0.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 mobile-scroll">
        {SECTIONS.map((section, sectionIdx) => {
          const sectionModules = getModulesBySection(section);
          return (
            <div
              key={section}
              className="animate-viewport-reveal visible"
              style={{ transitionDelay: `${sectionIdx * 60}ms` }}
            >
              <div
                className="px-3 mb-1.5 overflow-hidden"
                style={{
                  opacity: collapsed ? 0 : 1,
                  height: collapsed ? 0 : 'auto',
                  transition: 'opacity 200ms ease, height 200ms ease',
                }}
              >
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.12em] whitespace-nowrap">
                  {section}
                </span>
              </div>
              <div className="space-y-0.5">
                {sectionModules.map((m) => {
                  const Icon = m.icon;
                  const isActive = active === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelect(m.id)}
                      className={`w-full flex items-center rounded-xl cursor-pointer group relative btn-ripple overflow-hidden ${
                        collapsed ? 'justify-center px-0 py-2.5 mx-auto w-10' : 'px-3 py-2 gap-3'
                      }`}
                      style={{
                        color: isActive ? '#60a5fa' : '#71717a',
                        background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#e4e4e7';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#71717a';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                          style={{
                            background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
                            boxShadow: '0 0 12px rgba(59,130,246,0.4)',
                          }}
                        />
                      )}
                      <Icon size={17} strokeWidth={1.5} className="flex-shrink-0 icon-hover-rotate" />
                      <span
                        className="text-[13px] font-medium truncate whitespace-nowrap overflow-hidden"
                        style={{
                          opacity: collapsed ? 0 : 1,
                          width: collapsed ? 0 : 'auto',
                          transition: 'opacity 150ms ease, width 200ms ease',
                        }}
                      >
                        {m.label}
                      </span>
                      {collapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 glass-panel-strong text-zinc-200 font-medium shadow-xl shadow-black/30 top-1/2 -translate-y-1/2">
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
      <div className="px-2 py-3 space-y-1" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <button
          onClick={toggleCollapse}
          className={`w-full flex items-center rounded-xl text-zinc-600 hover:text-zinc-300 transition-all duration-200 cursor-pointer btn-ripple relative overflow-hidden ${
            collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2 gap-3'
          }`}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed ? <ChevronRight size={17} strokeWidth={1.5} className="transition-transform duration-200" /> : <ChevronLeft size={17} strokeWidth={1.5} className="transition-transform duration-200" />}
          <span
            className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: 'opacity 150ms ease, width 200ms ease',
            }}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
