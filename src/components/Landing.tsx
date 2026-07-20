import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, ArrowRight, Target, Zap, Eye } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.5,
  opacity: Math.random() * 0.12 + 0.03,
  dur: Math.random() * 25 + 18,
  delay: Math.random() * 12,
  isRed: Math.random() < 0.1,
}));

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
        className="absolute inset-0 w-full h-full"
        style={{
          animation: prefersReduced ? undefined : 'heroImageIn 1.2s cubic-bezier(0.16,1,0.3,1) 0s both',
        }}
      >
        <picture className="block w-full h-full">
          <source srcSet="/images/scam-hero.webp" type="image/webp" />
          <img
            src="/images/scam-hero.jpg"
            alt=""
            aria-hidden="true"
            className="block w-full h-full"
            width={1200}
            height={630}
            loading="eager"
            fetchPriority="high"
            style={{
              objectFit: 'cover',
              objectPosition: 'center 30%',
              transform: `translateX(${mousePos.x}px) translateY(${mousePos.y}px) scale(1.05)`,
              transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
              animation: prefersReduced ? undefined : 'heroImageZoom 18s ease-in-out infinite alternate',
            }}
          />
        </picture>
        {/* Gradient overlay — strong left for text, lighter right to reveal image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.85) 30%, rgba(2,6,23,0.55) 55%, rgba(2,6,23,0.25) 80%, rgba(2,6,23,0.1) 100%)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #020617 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full z-10"
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

      {/* Content — positioned over the image */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-24 lg:py-0">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 100ms both' }}
          >
            <p
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase mb-6 sm:mb-8"
              style={{ color: 'rgba(148,163,184,0.7)' }}
            >
              Digital Public Safety Intelligence
            </p>
          </div>

          {/* Headline */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 200ms both' }}
          >
            <h1
              className="font-extrabold tracking-tight leading-[1.05] text-white"
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
              }}
            >
              Digital arrest scams cost Indian families{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #F97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ₹1,031.9 crore
              </span>{' '}
              in 2024.
            </h1>
          </div>

          {/* Supporting line */}
          <div
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 380ms both' }}
          >
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mt-5 sm:mt-7 font-light">
              RAKSHA AI uses multi-agent AI to detect and prevent digital arrest scams before they cost you money.
            </p>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-6 sm:mt-8"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 480ms both' }}
          >
            {TRUST_INDICATORS.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <Icon size={14} strokeWidth={1.5} className="text-blue-400" />
                  <span className="text-[11px] sm:text-xs font-medium text-slate-400">{f.label}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-8 sm:mt-10"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 580ms both' }}
          >
            <button
              onClick={() => navigateTo('scam-scanner')}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm text-white cursor-pointer overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
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
