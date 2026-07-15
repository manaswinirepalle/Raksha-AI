import { useRef, useEffect } from 'react';
import { MODULES, type ModuleId } from '../MODULE_REGISTRY';
import type { LucideIcon } from 'lucide-react';

const NAV_ITEMS = MODULES.slice(0, 5).map(m => ({
  id: m.id,
  icon: m.icon as unknown as LucideIcon,
  label: m.shortLabel,
}));

export default function MobileNav({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeIdx = NAV_ITEMS.findIndex(item => item.id === active);
    if (activeIdx === -1) return;

    const buttons = navRef.current.querySelectorAll('button');
    const btn = buttons[activeIdx];
    if (!btn) return;

    const navRect = navRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const centerX = btnRect.left - navRect.left + btnRect.width / 2;

    indicatorRef.current.style.transform = `translateX(${centerX - 16}px) scaleX(1)`;
    indicatorRef.current.style.opacity = '1';
  }, [active]);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{
        background: 'rgba(9,9,11,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div ref={navRef} className="relative flex items-center justify-around h-16 px-0.5 max-w-lg mx-auto">
        {/* Animated indicator bar */}
        <div
          ref={indicatorRef}
          className="absolute top-0 h-[2px] w-8 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 8px rgba(59,130,246,0.4)',
            transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
            opacity: 0,
          }}
        />
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="touch-target flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1.5 rounded-xl cursor-pointer btn-ripple relative overflow-hidden"
              style={{
                color: isActive ? '#60a5fa' : '#52525b',
                transition: 'color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className="relative p-1.5 sm:p-2 rounded-xl"
                style={{
                  background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                  transition: 'background 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <span
                className="text-[8px] sm:text-[9px] font-medium leading-none truncate max-w-full px-0.5"
                style={{
                  color: isActive ? '#60a5fa' : undefined,
                  transition: 'color 250ms ease',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
