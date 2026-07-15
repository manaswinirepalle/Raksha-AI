import { MODULES, type ModuleId } from '../MODULE_REGISTRY';
import type { LucideIcon } from 'lucide-react';

const NAV_ITEMS = MODULES.slice(0, 5).map(m => ({
  id: m.id,
  icon: m.icon as unknown as LucideIcon,
  label: m.shortLabel,
}));

export default function MobileNav({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{
        background: 'rgba(9,9,11,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
      }}>
      <div className="flex items-center justify-around h-16 px-0.5 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`touch-target flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1.5 rounded-xl transition-all duration-200 cursor-pointer btn-ripple relative overflow-hidden
                ${isActive ? 'text-blue-400' : 'text-zinc-600 active:text-zinc-300'}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`relative p-1.5 sm:p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-blue-500/[0.08]' : ''
              }`}>
                <Icon size={18} strokeWidth={1.5} />
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                )}
              </div>
              <span className={`text-[8px] sm:text-[9px] font-medium leading-none transition-colors truncate max-w-full px-0.5 ${isActive ? 'text-blue-400' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
