import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, TriangleAlert, Lock, Fingerprint, Eye, Bell, ArrowRight } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

const GLASS_CARDS = [
  { icon: TriangleAlert, label: 'Scam Alert', color: '#EF4444', position: { top: '8%', left: '-4%' }, delay: '0s' },
  { icon: ShieldCheck, label: 'Fraud Detected', color: '#2563EB', position: { top: '15%', right: '-3%' }, delay: '1.2s' },
  { icon: Fingerprint, label: 'AI Analysis', color: '#38BDF8', position: { bottom: '18%', left: '-2%' }, delay: '0.6s' },
  { icon: Lock, label: 'OTP Protection', color: '#2563EB', position: { bottom: '12%', right: '-4%' }, delay: '1.8s' },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.15 + 0.03,
  dur: Math.random() * 30 + 20,
  delay: Math.random() * 15,
  isRed: Math.random() < 0.12,
}));

export default function Landing({ onEnter, onModuleSelect }: { onEnter: () => void; onModuleSelect?: (id: string) => void }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current || prefersReduced) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: x * 6, y: y * 4 });
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const el = heroRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced, handleMouseMove]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #020617 0%, #07152F 50%, #0F172A 100%)',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        filter: isTransitioning ? 'blur(4px)' : 'blur(0)',
        transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1), filter 500ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Background particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isRed ? `rgba(239,68,68,${p.opacity})` : `rgba(56,189,248,${p.opacity})`,
            boxShadow: p.isRed
              ? `0 0 ${p.size * 4}px rgba(239,68,68,${p.opacity * 0.4})`
              : `0 0 ${p.size * 4}px rgba(37,99,235,${p.opacity * 0.3})`,
            animation: prefersReduced ? undefined : `heroParticleFloat ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Radial blue glow behind image area */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '70%',
          height: '70%',
          right: '-5%',
          top: '15%',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main content grid */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 sm:px-8 lg:px-12 xl:px-16 gap-10 lg:gap-16 py-20 lg:py-0">

        {/* LEFT — Text content */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center gap-7 sm:gap-8 lg:gap-9">
          {/* Badge */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 100ms both' }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">AI-Powered · Built for India</span>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 200ms both' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl font-bold tracking-tight leading-[1.08] text-slate-100">
              Stop{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Scams
              </span>
              <br className="hidden sm:block" />
              {' '}Before They<br className="hidden md:block" /> Cost You Money.
            </h1>
          </div>

          {/* Subtitle */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 350ms both' }}
          >
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg font-light">
              Protect yourself from phishing, fraud, fake websites, suspicious links, and online financial scams with AI-powered real-time detection.
            </p>
          </div>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 450ms both' }}
          >
            <button
              onClick={() => { setIsTransitioning(true); setTimeout(() => { if (onModuleSelect) onModuleSelect('scam-scanner'); else onEnter(); }, 500); }}
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                boxShadow: '0 0 30px rgba(37,99,235,0.25), 0 4px 24px rgba(37,99,235,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <ShieldCheck size={18} strokeWidth={2} className="relative z-10" />
              <span className="relative z-10">Get Protected</span>
              <ArrowRight size={16} strokeWidth={2} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => { setIsTransitioning(true); setTimeout(() => { if (onModuleSelect) onModuleSelect('message-checker'); else onEnter(); }, 500); }}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 cursor-pointer transition-all duration-300 hover:text-white hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>Learn More</span>
              <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Trust line */}
          <div
            className="flex items-center gap-5 pt-1"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 550ms both' }}
          >
            {[
              { icon: Eye, text: 'Real-time' },
              { icon: Bell, text: 'Instant Alerts' },
              { icon: Lock, text: 'Bank-grade Security' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                  <Icon size={12} strokeWidth={1.5} className="text-blue-400/60" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Hero image */}
        <div className="w-full lg:w-[58%] flex items-center justify-center relative" style={{ minHeight: '50vh' }}>
          {/* Image container with floating cards */}
          <div
            className="relative w-full"
            style={{ maxWidth: 680 }}
          >
            {/* Main image */}
            <div
              ref={imageRef}
              className="relative overflow-hidden"
              style={{
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
                animation: prefersReduced ? undefined : 'heroImageIn 1s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                transform: `translateX(${mousePos.x}px) translateY(${mousePos.y}px)`,
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <img
                src="/images/scam-hero.jpg"
                alt="Cybersecurity threat detection — real-time AI analysis of scam attempts"
                className="w-full block"
                style={{
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  animation: prefersReduced ? undefined : 'heroImageZoom 15s ease-in-out infinite alternate',
                }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(rgba(2,6,23,0.35), rgba(2,6,23,0.60))',
                }}
              />
              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(10,10,14,0.7)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-blue-400 tracking-wide">RAKSHA AI</span>
                  <span className="text-[9px] text-emerald-400 font-mono">ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(10,10,14,0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <ShieldCheck size={11} className="text-blue-400" strokeWidth={2} />
                  <span className="text-[10px] text-slate-400 font-medium">Protected</span>
                </div>
              </div>
            </div>

            {/* Floating glass cards */}
            {GLASS_CARDS.map((card, i) => {
              const Icon = card.icon;
              const posStyle: React.CSSProperties = {
                position: 'absolute',
                ...card.position,
                zIndex: 20,
                animation: prefersReduced ? undefined : `heroCardFloat 5s ease-in-out ${card.delay} infinite alternate`,
              };
              return (
                <div
                  key={i}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl pointer-events-none"
                  style={{
                    ...posStyle,
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                    animation: prefersReduced ? undefined : `heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.15}s both, heroCardFloat 5s ease-in-out ${card.delay} infinite alternate`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}25`,
                    }}
                  >
                    <Icon size={13} style={{ color: card.color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 whitespace-nowrap">{card.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, #0F172A, transparent)',
        }}
      />
    </div>
  );
}
