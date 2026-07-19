import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { TranscriptScenario } from '../types';

interface SearchableComboboxProps {
  scenarios: TranscriptScenario[];
  selectedId: string | null;
  onSelect: (scenario: TranscriptScenario) => void;
  placeholder?: string;
  disabled?: boolean;
  riskMeta: Record<string, { label: string; color: string; bgColor: string; borderColor: string }>;
}

export default function SearchableCombobox({
  scenarios,
  selectedId,
  onSelect,
  placeholder = 'Search scenarios...',
  disabled = false,
  riskMeta,
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return scenarios;
    return scenarios.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }, [scenarios, search]);

  const measureAndOpen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
        setFocusedIndex(-1);
      }
    };
    const onScroll = (e: Event) => {
      const target = e.target as Node;
      if (listRef.current && listRef.current.contains(target)) return;
      setIsOpen(false);
      setSearch('');
      setFocusedIndex(-1);
    };
    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', () => {
      setIsOpen(false);
      setSearch('');
      setFocusedIndex(-1);
    });
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          e.preventDefault();
          measureAndOpen();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < filtered.length - 1 ? prev + 1 : 0;
            itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
            return next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filtered.length - 1;
            itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
            return next;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            onSelect(filtered[focusedIndex]);
            setIsOpen(false);
            setSearch('');
            setFocusedIndex(-1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearch('');
          setFocusedIndex(-1);
          inputRef.current?.focus();
          break;
      }
    },
    [isOpen, focusedIndex, filtered, onSelect, measureAndOpen]
  );

  const handleSelect = useCallback(
    (scenario: TranscriptScenario) => {
      onSelect(scenario);
      setIsOpen(false);
      setSearch('');
      setFocusedIndex(-1);
    },
    [onSelect]
  );

  const selectedScenario = scenarios.find((s) => s.id === selectedId);

  const dropdown = isOpen && dropPos ? createPortal(
    <div
      className="sd-combo-dropdown"
      role="listbox"
      id="sd-combo-listbox"
      ref={listRef}
      style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width }}
    >
      {filtered.length === 0 ? (
        <div className="sd-combo-empty">
          <FileText size={16} strokeWidth={1.5} />
          <span>No scenarios match</span>
        </div>
      ) : (
        filtered.map((scenario, i) => {
          const meta = riskMeta[scenario.riskLevel];
          const isSelected = scenario.id === selectedId;
          const isFocused = i === focusedIndex;
          return (
            <div
              key={scenario.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`sd-combo-item${isFocused ? ' sd-combo-item-active' : ''}${isSelected ? ' sd-combo-item-selected' : ''}`}
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(scenario);
              }}
              onMouseEnter={() => setFocusedIndex(i)}
            >
              <div className="sd-combo-item-risk" style={{ background: meta.color }} />
              <div className="sd-combo-item-body">
                <div className="sd-combo-item-label">{scenario.label}</div>
                <div className="sd-combo-item-desc">{scenario.description}</div>
              </div>
              <div className="sd-combo-item-meta">
                <span
                  className="sd-combo-item-badge"
                  style={{ background: meta.bgColor, color: meta.color, borderColor: meta.borderColor }}
                >
                  {meta.label}
                </span>
                <span className="sd-combo-item-score" style={{ color: meta.color }}>
                  {scenario.finalScore}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className="sd-combo-wrap" onKeyDown={handleKeyDown}>
      <div
        className="sd-combo-input-wrap"
        onClick={() => {
          if (!disabled) {
            if (isOpen) {
              setIsOpen(false);
              setSearch('');
              setFocusedIndex(-1);
            } else {
              measureAndOpen();
            }
          }
        }}
      >
        <div className="sd-combo-icon">
          <Search size={14} strokeWidth={1.5} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="sd-combo-input"
          value={isOpen ? search : (selectedScenario?.label ?? '')}
          onChange={(e) => {
            setSearch(e.target.value);
            setFocusedIndex(-1);
          }}
          onFocus={() => {
            if (!disabled && !isOpen) measureAndOpen();
          }}
          placeholder={selectedScenario ? selectedScenario.label : placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="sd-combo-listbox"
          autoComplete="off"
        />
        <div className="sd-combo-chevron">
          {isOpen ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
        </div>
      </div>

      {dropdown}
    </div>
  );
}
