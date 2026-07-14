import { ShieldCheck, Check } from 'lucide-react';

export default function SafetyTips({ tips, visible = true }: { tips: string[]; visible?: boolean }) {
  if (!visible || tips.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-green-400" />
        <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">Smart Safety Tips</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="animate-fade-slide-up p-3.5 sm:p-4 rounded-xl border bg-white/[0.03] border-white/[0.06] card-hover flex items-start gap-3 transition-all duration-200 hover:translate-y-[-1px]"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
              <Check size={11} className="text-green-400" strokeWidth={2.5} />
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
