import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, ArrowRight, AlertTriangle, TrendingUp, IndianRupee,
  Globe, Phone, MessageSquare,
  Banknote, Map, Brain,
  ShieldCheck, Radar, Network,
} from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

const STATS = [
  { value: 1140000, display: '1.14M', label: 'Cybercrime complaints in India, 2023', icon: AlertTriangle, color: '#f43f5e' },
  { value: 1776, display: '₹1,776 Cr', label: 'Lost to digital arrest scams in 9 months, 2024', icon: IndianRupee, color: '#f59e0b' },
  { value: 60, display: '60%', label: 'Year-over-year increase in cybercrime', icon: TrendingUp, color: '#f97316' },
];

const FEATURES = [
  {
    icon: Phone,
    title: 'Digital Arrest Scam Detector',
    desc: 'Real-time transcript analysis — catches impersonation scripts, urgency tactics & money-transfer demands during the call',
    color: '#f43f5e',
    module: 'scam-scanner',
    hero: true,
  },
  {
    icon: MessageSquare,
    title: 'Citizen Fraud Shield',
    desc: 'Check any suspicious call or message in seconds — in your own language, with instant NCRB report guidance',
    color: '#3b82f6',
    module: 'message-checker',
    hero: true,
  },
  {
    icon: Network,
    title: 'Fraud Network Graph',
    desc: 'Map scammer numbers, UPI IDs & wallets to expose coordinated fraud rings',
    color: '#8b5cf6',
    module: 'fraud-network',
  },
  {
    icon: Map,
    title: 'Crime Heatmap',
    desc: 'Geospatial crime density visualization for patrol prioritization across India',
    color: '#10b981',
    module: 'crime-heatmap',
  },
];

const TRUST_ITEMS = [
  { icon: Brain, text: 'AI Powered', color: '#8b5cf6' },
  { icon: ShieldCheck, text: 'NCRB Compliant', color: '#3b82f6' },
  { icon: Radar, text: 'Intervenes at Contact', color: '#06b6d4' },
  { icon: Globe, text: '22 Languages', color: '#10b981' },
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  opacity: Math.random() * 0.12 + 0.02,
  dur: Math.random() * 25 + 18,
  delay: Math.random() * 12,
}));

export default function Landing({ onEnter, onModuleSelect }: { onEnter: () => void; onModuleSelect?: (id: string) => void }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!glowRef.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glowRef.current.style.left = `${x}%`;
    glowRef.current.style.top = `${y}%`;
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    const el = heroRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced, handleMouseMove]);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => onEnter(), 500);
  };

  const handleFeatureClick = (module: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (onModuleSelect) onModuleSelect(module);
      else onEnter();
    }, 500);
  };

  return (
    <div
      ref={heroRef}
      className="flex-1 flex flex-col relative z-10 overflow-hidden select-none"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        filter: isTransitioning ? 'blur(4px)' : 'blur(0)',
        transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Cursor glow — positioned via ref, no React state */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-[1]"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(99,102,241,0.02) 40%, transparent 65%)',
          transform: 'translate(-50%, -50%)',
          willChange: 'left, top',
        }}
      />

      {/* Background gradient mesh — CSS-only, no JS animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: prefersReduced ? undefined : 'premiumMeshDrift2 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            width: 550, height: 550, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)',
            right: '8%', bottom: '12%',
            animation: prefersReduced ? undefined : 'premiumMeshDrift3 22s ease-in-out infinite',
          }}
        />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #09090b 75%)' }}
        />
      </div>

      {/* Floating particles — pure CSS animation, no JS */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(255,255,255,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(59,130,246,${p.opacity * 0.5})`,
            animation: prefersReduced ? undefined : `particleDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Orbital ring — single ring instead of 3 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] rounded-full"
          style={{
            border: '1px solid rgba(59,130,246,0.04)',
            animation: prefersReduced ? undefined : 'breathe 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-4xl lg:max-w-5xl w-full space-y-8 sm:space-y-10 lg:space-y-12">

          {/* Top badge */}
          <div
            className="flex justify-center"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both' }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel text-[10px] sm:text-[11px] font-medium text-zinc-400 glass-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>AI-Powered · Built for India</span>
              <span className="w-px h-3 bg-zinc-700" />
              <span>Real-Time Detection</span>
            </div>
          </div>

          {/* Hero headline */}
          <div className="text-center space-y-6 sm:space-y-7">
            <div
              className="flex justify-center"
              style={{ animation: prefersReduced ? undefined : 'heroFadeSlideScale 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both' }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
                    filter: 'blur(20px)',
                    transform: 'scale(1.3)',
                  }}
                />
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center glass-panel-strong"
                  style={{
                    boxShadow: '0 0 40px rgba(59,130,246,0.12), 0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
                    animation: prefersReduced ? undefined : 'shieldPulse 4s ease-in-out infinite',
                  }}
                >
                  <Shield size={32} className="text-blue-400 sm:w-9 sm:h-9 md:w-11 md:h-11" strokeWidth={1.5} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      boxShadow: '0 0 12px rgba(59,130,246,0.5)',
                      animation: prefersReduced ? undefined : 'glowPulse 3s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both' }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92]">
                <span className="text-gradient block">RAKSHA</span>
                <span className="text-gradient-accent block mt-1">AI</span>
              </h1>
            </div>

            <div
              style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both' }}
            >
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                India's Digital Public Safety Intelligence platform.
                <span className="text-zinc-200 font-medium"> By the time a victim files a complaint, the money and the trail are already gone</span>
                <span className="text-zinc-500"> — RAKSHA AI intervenes at the moment of contact instead.</span>
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both' }}
          >
            <button onClick={handleEnter}
              className="btn-premium btn-ripple btn-shimmer group flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white cursor-pointer touch-target w-full sm:w-auto justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 0 30px rgba(59,130,246,0.2), 0 4px 20px rgba(59,130,246,0.15)',
              }}
            >
              <Shield size={18} strokeWidth={2} />
              <span className="relative z-10">Start Protection</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" strokeWidth={2} />
            </button>
            <div className="flex items-center gap-3 text-zinc-500 text-xs sm:text-sm">
              <div className="flex -space-x-2">
                {[Phone, MessageSquare, Banknote, Map].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-full glass-panel flex items-center justify-center"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <Icon size={13} className="text-zinc-400" strokeWidth={1.5} />
                  </div>
                ))}
              </div>
              <span>17 modules · Digital Public Safety</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-7 lg:gap-x-9"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 600ms both' }}
          >
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}
                  className="flex items-center gap-2 text-zinc-500 text-[10px] sm:text-[11px] font-medium group cursor-default"
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center icon-hover-rotate"
                    style={{ background: `${item.color}10` }}>
                    <Icon size={11} style={{ color: item.color }} strokeWidth={1.5} />
                  </div>
                  <span className="group-hover:text-zinc-300 transition-colors duration-200">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Animated statistics */}
          <div
            className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-2xl lg:max-w-3xl mx-auto"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both' }}
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}
                  className="glass-panel card-premium rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center group"
                >
                  <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 icon-hover-rotate"
                    style={{ background: `${stat.color}10` }}>
                    <Icon size={16} style={{ color: stat.color }} strokeWidth={1.5} />
                  </div>
                  <div className="font-mono text-lg sm:text-2xl md:text-3xl font-bold tracking-tight animate-count-up"
                    style={{ color: stat.color, animationDelay: `${700 + i * 200}ms` }}>
                    {stat.display}
                  </div>
                  <p className="text-zinc-500 text-[9px] sm:text-[11px] leading-snug mt-1 sm:mt-2 line-clamp-2">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Features preview — Hero + Supporting */}
          <div
            className="max-w-4xl lg:max-w-5xl mx-auto space-y-3"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 800ms both' }}
          >
            {/* Hero Features — 2 large cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.filter(f => f.hero).map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <button key={i}
                    onClick={() => handleFeatureClick(feat.module)}
                    className="glass-panel card-premium rounded-2xl p-5 sm:p-6 text-left cursor-pointer group btn-ripple relative overflow-hidden"
                    style={{
                      border: `1px solid ${feat.color}20`,
                      background: `linear-gradient(135deg, ${feat.color}08 0%, transparent 60%)`,
                    }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 icon-hover-rotate"
                      style={{ background: `${feat.color}12`, border: `1px solid ${feat.color}20` }}>
                      <Icon size={20} style={{ color: feat.color }} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-zinc-100 text-sm sm:text-base font-bold mb-1.5">{feat.title}</h2>
                    <p className="text-zinc-500 text-[10px] sm:text-xs leading-relaxed line-clamp-3">{feat.desc}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-medium group-hover:gap-2.5 transition-all"
                      style={{ color: feat.color }}>
                      <span>Try it now</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Supporting Features — 2 compact cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {FEATURES.filter(f => !f.hero).map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <button key={i}
                    onClick={() => handleFeatureClick(feat.module)}
                    className="glass-panel card-premium rounded-xl p-3 sm:p-4 text-left cursor-pointer group btn-ripple relative overflow-hidden"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-2 sm:mb-3 icon-hover-rotate"
                      style={{ background: `${feat.color}10` }}>
                      <Icon size={16} style={{ color: feat.color }} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-zinc-200 text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">{feat.title}</h2>
                    <p className="text-zinc-500 text-[9px] sm:text-[10px] leading-relaxed line-clamp-2">{feat.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
