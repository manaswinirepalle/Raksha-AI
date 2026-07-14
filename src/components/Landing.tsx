import { Shield, ArrowRight, AlertTriangle, TrendingUp, IndianRupee, Activity, Globe, Lock } from 'lucide-react';

const STATS = [
  { value: '1.14M', label: 'Cybercrime complaints in India, 2023', icon: AlertTriangle, color: '#FF3B4E' },
  { value: '₹1,776 Cr', label: 'Lost to digital arrest scams (9 months, 2024)', icon: IndianRupee, color: '#FBBF24' },
  { value: '60%', label: 'Year-over-year increase in cybercrime', icon: TrendingUp, color: '#F97316' },
];

const FLOATING_ICONS = [
  { Icon: Shield, x: '12%', y: '18%', delay: '0s', dur: '6s', size: 18, opacity: 0.06 },
  { Icon: Lock, x: '85%', y: '22%', delay: '1s', dur: '7s', size: 16, opacity: 0.05 },
  { Icon: Activity, x: '8%', y: '72%', delay: '2s', dur: '8s', size: 14, opacity: 0.05 },
  { Icon: Globe, x: '90%', y: '68%', delay: '0.5s', dur: '6.5s', size: 20, opacity: 0.04 },
  { Icon: AlertTriangle, x: '20%', y: '85%', delay: '1.5s', dur: '7.5s', size: 15, opacity: 0.05 },
  { Icon: Shield, x: '78%', y: '82%', delay: '3s', dur: '9s', size: 12, opacity: 0.04 },
  { Icon: Lock, x: '50%', y: '8%', delay: '2.5s', dur: '8.5s', size: 14, opacity: 0.04 },
  { Icon: Activity, x: '35%', y: '90%', delay: '1s', dur: '7s', size: 16, opacity: 0.05 },
];

export default function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-hidden">
      {/* Floating particles */}
      {FLOATING_ICONS.map((p, i) => {
        const Icon = p.Icon;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              opacity: p.opacity,
              animation: `float ${p.dur} ease-in-out ${p.delay} infinite`,
            }}
          >
            <Icon size={p.size} className="text-[#22D3EE]" />
          </div>
        );
      })}

      {/* Orbiting rings behind the logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[320px] h-[320px] rounded-full border border-[#22D3EE]/5 animate-breathe" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[480px] h-[480px] rounded-full border border-[#22D3EE]/3" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[640px] h-[640px] rounded-full border border-[#1F2937]/50" />
      </div>

      {/* Orbiting dots */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        <div className="animate-orbit" style={{ width: 0, height: 0 }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]/30 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        <div className="animate-orbit-reverse" style={{ width: 0, height: 0 }}>
          <div className="w-1 h-1 rounded-full bg-[#FBBF24]/25 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="max-w-3xl w-full px-8 space-y-14">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 animate-slide-up-fade">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#22D3EE]/8 border border-[#22D3EE]/20 flex items-center justify-center
              shadow-[0_0_60px_rgba(34,211,238,0.12)] animate-float-slow">
              <Shield size={44} className="text-[#22D3EE]" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22D3EE]/80 animate-pulse-glow" />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#E5E7EB]">
              RAKSHA <span className="bg-gradient-to-r from-[#22D3EE] to-[#A78BFA] bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-[#6B7280] text-sm mt-3 font-mono tracking-[0.2em] uppercase">
              Digital Public Safety Intelligence
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6" style={{ animationFillMode: 'both' }}>
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-[#131B2E]/80 border border-[#1F2937]/80 text-center space-y-3
                  hover:border-[#1F2937] hover:bg-[#131B2E] transition-all duration-300
                  animate-slide-up-fade`}
                style={{ animationDelay: `${300 + i * 120}ms`, animationFillMode: 'both' }}
              >
                <Icon size={22} className="mx-auto" style={{ color: stat.color }} />
                <div className="font-mono text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <p className="text-[#6B7280] text-xs leading-relaxed">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div className="text-center animate-slide-up-fade" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <p className="text-[#E5E7EB] text-xl leading-relaxed">
            Intelligence <span className="text-[#22D3EE] font-semibold">before</span> mass victimization —
            not after-the-fact complaints.
          </p>
          <p className="text-[#6B7280] text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            AI-powered detection of digital arrest scams, counterfeiting, and fraud networks — built for the Indian public safety ecosystem.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center animate-slide-up-fade" style={{ animationDelay: '750ms', animationFillMode: 'both' }}>
          <button
            onClick={onEnter}
            className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-base
              bg-[#22D3EE] text-[#0B1220]
              hover:shadow-[0_0_32px_rgba(34,211,238,0.35)] hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-200 cursor-pointer"
          >
            Enter Command Center
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Status badge */}
        <div className="flex justify-center animate-slide-up-fade" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#131B2E]/60 border border-[#1F2937]/60 text-[#6B7280] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse-glow" />
            All systems operational — 100% offline capable
          </span>
        </div>
      </div>
    </div>
  );
}
