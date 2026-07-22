import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Shield, ArrowRight, Target, Zap, Eye } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

const TRUST_INDICATORS = [
  { icon: Target, label: '97.3% Detection Accuracy' },
  { icon: Zap, label: 'Real-time Analysis' },
  { icon: Eye, label: 'Instant Alerts' },
];

const SHARE_URL = 'https://raksha-ai-umber.vercel.app';
const SHARE_TEXT = 'RAKSHA AI \u2014 Free AI-powered platform detecting digital arrest scams and fraud networks in India.';
const HERO_SHARE_LINKS = [
  {
    label: 'Share on X',
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Share on LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Share on WhatsApp',
    href: `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
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

          {/* Social share buttons — hero placement */}
          <div
            className="flex items-center gap-1.5 mt-4 sm:mt-5 lg:mt-6"
            style={{ animation: prefersReduced ? undefined : 'heroFadeSlideUp 600ms cubic-bezier(0.16,1,0.3,1) 600ms both' }}
          >
            <span className="text-[10px] sm:text-[11px] font-medium mr-1" style={{ color: 'rgba(148,163,184,0.5)' }}>
              Share
            </span>
            {HERO_SHARE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-200"
                style={{ color: 'rgba(148,163,184,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(148,163,184,0.8)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {link.icon}
              </a>
            ))}
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
