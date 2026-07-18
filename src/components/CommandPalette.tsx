import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, Command, ArrowRight, X } from 'lucide-react';
import { MODULES, type ModuleId } from '../MODULE_REGISTRY';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: ModuleId) => void;
}

export default function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return MODULES;
    const q = query.toLowerCase();
    return MODULES.filter(m =>
      m.label.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.section.toLowerCase().includes(q) ||
      m.shortLabel.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = useCallback((id: ModuleId) => {
    onNavigate(id);
    onClose();
    setQuery('');
  }, [onNavigate, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-command-palette-in"
        style={{
          background: 'rgba(18, 18, 22, 0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(40px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, features..."
            className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/[0.05]">
            <X size={14} />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2 mobile-scroll">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-600 text-[12px]">No results found</div>
          ) : (
            <>
              {['Detection', 'Protection', 'Insights', 'Analytics', 'Support'].map(section => {
                const sectionResults = results.filter(m => m.section === section);
                if (sectionResults.length === 0) return null;
                return (
                  <div key={section}>
                    <div className="px-4 py-1.5">
                      <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">{section}</span>
                    </div>
                    {sectionResults.map(m => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleSelect(m.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <Icon size={15} strokeWidth={1.5} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-zinc-200 truncate">{m.label}</div>
                            <div className="text-[10px] text-zinc-600 truncate">{m.description}</div>
                          </div>
                          <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5 text-[10px] text-zinc-600" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="flex items-center gap-1"><Command size={10} />K to open</span>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
