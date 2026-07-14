import { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function Tooltip({ text, children }: { text: string; children?: React.ReactNode }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="relative inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg glass-subtle text-zinc-500 text-[10px] sm:text-[11px] font-mono max-w-[200px] sm:max-w-none animate-fade-in">
      <Info size={10} className="flex-shrink-0" />
      <span className="line-clamp-2 sm:line-none">{text}</span>
      {children}
      <button onClick={() => setShow(false)}
        className="ml-0.5 sm:ml-1 text-zinc-500 hover:text-zinc-200 transition-colors touch-target p-0.5 w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.04]"
        aria-label="Dismiss info">
        <X size={10} />
      </button>
    </div>
  );
}
