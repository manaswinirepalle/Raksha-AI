import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Shield, ArrowRight, Target, Zap, Eye } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

const TRUST_INDICATORS = [
  { icon: Target, label: '97.3% Detection Accuracy' },
  { icon: Zap, label: 'Real-time Analysis' },
  { icon: Eye, label: 'Instant Alerts' },
];

export default function Landing({ onEnter, onModuleSelect }: { onEnter: () => void; onModuleSelect?: (id: string) => void }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current || prefersReduced) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: x * 4, y: y * 3 });
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const el = heroRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced, handleMouseMove]);

  const navigateTo = useCallback((id: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (onModuleSelect) onModuleSelect(id);
      else onEnter();
    }, 500);
  }, [onModuleSelect, onEnter]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        minHeight: '100vh',
        background: '#020617',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        filter: isTransitioning ? 'blur(4px)' : 'blur(0)',
        transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1), filter 500ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0"
        style={{
          animation: prefersReduced ? undefined : 'heroImageIn 1.2s cubic-bezier(0.16,1,0.3,1) 0s both',
        }}
      >
        <img
          src="/images/cyber-rainy-night.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: `translateX(${mousePos.x}px) translateY(${mousePos.y}px) scale(1.08)`,
            transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {/* Gradient overlay — heavy left for text readability, transparent right to show image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.82) 20%, rgba(2,6,23,0.55) 45%, rgba(2,6,23,0.2) 65%, rgba(2,6,23,0.08) 80%, transparent 100%)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '30vh',
            minHeight: 120,
            background: 'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.6) 40%, transparent 100%)',
          }}
        />
        {/* Top subtle vignette */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '15vh',
            background: 'linear-gradient(to bottom, rgba(2,6,23,0.4) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content — positioned over the image */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-24 lg:py-0">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 100ms both' }}
          >
            <p
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6 lg:mb-8"
              style={{ color: 'rgba(148,163,184,0.7)' }}
            >
              Digital Public Safety Intelligence
            </p>
          </div>

          {/* RAKSHA AI brand wordmark with shield icon */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 200ms both' }}
          >
            <h1 className="flex items-center gap-3 sm:gap-4 font-black tracking-tight leading-none text-white">
              <Shield
                className="text-blue-400 flex-shrink-0"
                strokeWidth={1.5}
                style={{ width: 'clamp(2rem, 5vw, 3.5rem)', height: 'clamp(2rem, 5vw, 3.5rem)' }}
              />
              <span style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', letterSpacing: '-0.03em' }}>
                RAKSHA AI
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 350ms both' }}
          >
            <p
              className="font-light tracking-wide mt-3 sm:mt-4 lg:mt-5"
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.35rem)',
                color: 'rgba(203,213,225,0.8)',
              }}
            >
              One shield. Every threat.
            </p>
          </div>

          {/* Stat line */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 450ms both' }}
          >
            <p className="text-slate-500 text-xs sm:text-sm mt-2.5 sm:mt-3 lg:mt-4 font-light max-w-md leading-relaxed">
              Indian families lost{' '}
              <span className="text-slate-400 font-medium">₹1,031.9 crore</span>{' '}
              to digital arrest scams in 2024. RAKSHA AI detects and prevents them before they cost you money.
            </p>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 mt-5 sm:mt-6 lg:mt-7"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 550ms both' }}
          >
            {TRUST_INDICATORS.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <Icon size={13} strokeWidth={1.5} className="text-blue-400" />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-400">{f.label}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-6 sm:mt-7 lg:mt-8"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 650ms both' }}
          >
            <button
              onClick={() => navigateTo('scam-scanner')}
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm text-white cursor-pointer overflow-hidden transition-all duration-300 hover:translate-y-[-2px] w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                boxShadow: '0 0 40px rgba(37,99,235,0.3), 0 4px 24px rgba(37,99,235,0.25)',
                minHeight: 48,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <ShieldCheck size={18} strokeWidth={2} className="relative z-10" />
              <span className="relative z-10">Get Protected</span>
              <ArrowRight size={16} strokeWidth={2} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
