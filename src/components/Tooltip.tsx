import { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function Tooltip({ text, children }: { text: string; children?: React.ReactNode }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1F2937]/80 border border-[#1F2937] text-[#6B7280] text-[11px] font-mono">
      <Info size={12} className="flex-shrink-0" />
      <span>{text}</span>
      {children}
      <button
        onClick={() => setShow(false)}
        className="ml-1 text-[#6B7280] hover:text-[#E5E7EB] transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
