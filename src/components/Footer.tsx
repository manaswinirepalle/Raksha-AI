import { SECTIONS, getModulesBySection } from '../MODULE_REGISTRY';
import type { ModuleId } from '../MODULE_REGISTRY';

interface FooterProps {
  onNavigate?: (id: ModuleId) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {SECTIONS.map((section) => {
            const modules = getModulesBySection(section);
            if (modules.length === 0) return null;
            return (
              <div key={section}>
                <h3
                  className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#71717a', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {section}
                </h3>
                <ul className="space-y-1.5 list-none p-0 m-0">
                  {modules.map((mod) => (
                    <li key={mod.id}>
                      <a
                        href={`#${mod.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate?.(mod.id as ModuleId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[13px] hover:text-zinc-100 transition-colors duration-200 block py-0.5"
                        style={{ color: '#a1a1aa' }}
                      >
                        {mod.shortLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div
          className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-zinc-300">RAKSHA AI</span>
            <span className="text-[11px] text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-500">Digital Public Safety Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#help-center"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('help-center');
              }}
              className="text-[11px] hover:text-zinc-300 transition-colors"
              style={{ color: '#71717a' }}
            >
              Help
            </a>
            <a
              href="#settings"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('settings');
              }}
              className="text-[11px] hover:text-zinc-300 transition-colors"
              style={{ color: '#71717a' }}
            >
              Settings
            </a>
            <span className="text-[11px] text-zinc-700">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
