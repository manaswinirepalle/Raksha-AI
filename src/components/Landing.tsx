import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield, ArrowRight, AlertTriangle, TrendingUp, IndianRupee,
  Activity, Globe, Lock, Fingerprint, Zap, Phone, MessageSquare,
  Banknote, Map, ChevronDown, Eye, Brain, Cpu,
  Sparkles, ShieldCheck, Radar,
} from 'lucide-react';

const STATS = [
  { value: 1140000, display: '1.14M', label: 'Cybercrime complaints in India, 2023', icon: AlertTriangle, color: '#f43f5e' },
  { value: 1776, display: '₹1,776 Cr', label: 'Lost to digital arrest scams (9 months, 2024)', icon: IndianRupee, color: '#f59e0b' },
  { value: 60, display: '60%', label: 'Year-over-year increase in cybercrime', icon: TrendingUp, color: '#f97316' },
];

const FEATURES = [
  { icon: Phone, title: 'Scam Scanner', desc: 'Real-time transcript analysis with multi-agent fraud detection', color: '#f43f5e', module: 'scam-scanner' },
  { icon: MessageSquare, title: 'Message Checker', desc: 'Instant scam detection for suspicious messages in 22 languages', color: '#3b82f6', module: 'message-checker' },
  { icon: Shield, title: 'Safety Center', desc: 'Emergency contacts, safety score, and protection tools', color: '#f59e0b', module: 'safety-center' },
  { icon: Map, title: 'Threat Insights', desc: 'AI-powered threat intelligence and analysis', color: '#10b981', module: 'threat-insights' },
];

const TRUST_ITEMS = [
  { icon: Brain, text: 'AI Powered', color: '#8b5cf6' },
  { icon: Lock, text: 'Privacy First', color: '#3b82f6' },
  { icon: Radar, text: 'Real-Time Detection', color: '#06b6d4' },
  { icon: ShieldCheck, text: 'Secure Analysis', color: '#10b981' },
];

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.15 + 0.03,
  dur: Math.random() * 20 + 15,
  delay: Math.random() * 10,
  drift: (Math.random() - 0.5) * 30,
}));

const ICON_FLOATS = [
  { Icon: Shield, x: 8, y: 15, size: 18, opacity: 0.04, dur: 18, delay: 0, parallax: 0.02 },
  { Icon: Lock, x: 88, y: 20, size: 14, opacity: 0.035, dur: 22, delay: 2, parallax: 0.015 },
  { Icon: Activity, x: 5, y: 75, size: 12, opacity: 0.03, dur: 20, delay: 4, parallax: 0.025 },
  { Icon: Globe, x: 92, y: 70, size: 20, opacity: 0.03, dur: 24, delay: 1, parallax: 0.01 },
  { Icon: Fingerprint, x: 15, y: 88, size: 14, opacity: 0.025, dur: 19, delay: 3, parallax: 0.03 },
  { Icon: Zap, x: 50, y: 5, size: 12, opacity: 0.03, dur: 21, delay: 5, parallax: 0.02 },
  { Icon: Brain, x: 75, y: 85, size: 16, opacity: 0.025, dur: 23, delay: 2.5, parallax: 0.015 },
  { Icon: Eye, x: 30, y: 10, size: 10, opacity: 0.025, dur: 17, delay: 6, parallax: 0.02 },
  { Icon: Cpu, x: 65, y: 12, size: 13, opacity: 0.025, dur: 20, delay: 3.5, parallax: 0.018 },
  { Icon: Sparkles, x: 42, y: 92, size: 11, opacity: 0.02, dur: 25, delay: 7, parallax: 0.022 },
  { Icon: ShieldCheck, x: 78, y: 45, size: 13, opacity: 0.02, dur: 19, delay: 1.5, parallax: 0.016 },
];

export default function Landing({ onEnter, onModuleSelect }: { onEnter: () => void; onModuleSelect?: (id: string) => void }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    };

    const lerp = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setMousePos({ x: currentX, y: currentY });
      rafRef.current = requestAnimationFrame(lerp);
    };

    el.addEventListener('mousemove', handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(lerp);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

  const parallaxX = (mousePos.x - 0.5) * 2;
  const parallaxY = (mousePos.y - 0.5) * 2;

  const cursorGlowStyle = useMemo(() => ({
    left: `${mousePos.x * 100}%`,
    top: `${mousePos.y * 100}%`,
    willChange: 'left, top' as const,
  }), [mousePos.x, mousePos.y]);

  return (
    <div
      ref={heroRef}
      className={`flex-1 flex flex-col relative z-10 overflow-hidden select-none transition-all duration-500 ease-out ${
        isTransitioning ? 'opacity-0 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* ── Cursor glow ── */}
      <div
        className="absolute pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          ...cursorGlowStyle,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 60%)',
          transform: 'translate(-50%, -50%)',
          opacity: heroVisible ? 1 : 0,
        }}
      />

      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb — follows mouse smoothly */}
        <div
          className="absolute"
          style={{
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)',
            left: `calc(${mousePos.x * 100}% - 350px)`,
            top: `calc(${mousePos.y * 100}% - 350px)`,
            willChange: 'left, top',
            animation: 'glowPulse 8s ease-in-out infinite',
          }}
        />
        {/* Secondary orb — purple */}
        <div
          className="absolute"
          style={{
            width: 550, height: 550, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)',
            right: '8%', bottom: '12%',
            animation: 'meshFloat2 20s ease-in-out infinite',
          }}
        />
        {/* Tertiary orb — cyan */}
        <div
          className="absolute"
          style={{
            width: 450, height: 450, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.035) 0%, transparent 65%)',
            left: '18%', top: '55%',
            animation: 'meshFloat3 22s ease-in-out infinite',
          }}
        />
        {/* Warm accent orb */}
        <div
          className="absolute"
          style={{
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.025) 0%, transparent 65%)',
            right: '25%', top: '20%',
            animation: 'meshFloat1 25s ease-in-out infinite',
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial fade over grid */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #09090b 75%)' }}
        />
      </div>

      {/* ── Floating particles ── */}
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
            animation: `particleDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ── Floating icon elements with parallax ── */}
      {ICON_FLOATS.map((el, i) => {
        const Icon = el.Icon;
        const px = parallaxX * el.parallax * 100;
        const py = parallaxY * el.parallax * 100;
        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `translate(${px}px, ${py}px)`,
              willChange: 'transform',
              animation: `particleFloat ${el.dur}s ease-in-out ${el.delay}s infinite`,
            }}
          >
            <Icon size={el.size} style={{ opacity: el.opacity }} className="text-white" />
          </div>
        );
      })}

      {/* ── Orbital rings ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] rounded-full"
          style={{
            border: '1px solid rgba(59,130,246,0.04)',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] md:w-[580px] md:h-[580px] lg:w-[700px] lg:h-[700px] xl:w-[820px] xl:h-[820px] rounded-full"
          style={{ border: '1px solid rgba(139,92,246,0.03)' }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[560px] h-[560px] sm:w-[660px] sm:h-[660px] md:w-[760px] md:h-[760px] lg:w-[900px] lg:h-[900px] xl:w-[1040px] xl:h-[1040px] rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.015)' }}
        />
      </div>

      {/* Orbiting dots */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        <div className="animate-orbit" style={{ width: 0, height: 0 }}>
          <div className="w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'rgba(59,130,246,0.5)', boxShadow: '0 0 12px rgba(59,130,246,0.3)' }} />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        <div className="animate-orbit-reverse" style={{ width: 0, height: 0 }}>
          <div className="w-1 h-1 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'rgba(139,92,246,0.4)', boxShadow: '0 0 10px rgba(139,92,246,0.25)' }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className={`max-w-4xl lg:max-w-5xl w-full space-y-8 sm:space-y-10 lg:space-y-12 transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* ── Top badge ── */}
          <div className="flex justify-center" style={{ transitionDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel text-[10px] sm:text-[11px] font-medium text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>AI-Powered Protection</span>
              <span className="w-px h-3 bg-zinc-700" />
              <span>Built for India</span>
            </div>
          </div>

          {/* ── Hero headline ── */}
          <div className="text-center space-y-6 sm:space-y-7">
            {/* Animated Shield */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
                    filter: 'blur(20px)',
                    transform: 'scale(1.3)',
                  }}
                />
                {/* Shield container */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center glass-panel-strong"
                  style={{
                    boxShadow: '0 0 40px rgba(59,130,246,0.12), 0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
                    animation: 'shieldPulse 4s ease-in-out infinite',
                  }}
                >
                  <Shield size={32} className="text-blue-400 sm:w-9 sm:h-9 md:w-11 md:h-11" strokeWidth={1.5} />
                  {/* Status dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      boxShadow: '0 0 12px rgba(59,130,246,0.5)',
                      animation: 'glowPulse 3s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92]">
              <span className="text-gradient block">RAKSHA</span>
              <span className="text-gradient-accent block mt-1">AI</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              India's AI Scam Protection Platform.
              <span className="text-zinc-200 font-medium"> Detect scams before they detect you</span>
              <span className="text-zinc-500"> — powered by real-time intelligence, not after-the-fact complaints.</span>
            </p>
          </div>

          {/* ── CTA buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button onClick={handleEnter}
              className="btn-premium btn-ripple group flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white cursor-pointer touch-target w-full sm:w-auto justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 0 30px rgba(59,130,246,0.2), 0 4px 20px rgba(59,130,246,0.15)',
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite',
                }}
              />
              <Shield size={18} strokeWidth={2} />
              <span className="relative z-10">Start Smart Protection</span>
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
              <span>15 modules ready</span>
            </div>
          </div>

          {/* ── Trust indicators ── */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-7 lg:gap-x-9">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}
                  className="flex items-center gap-2 text-zinc-500 text-[10px] sm:text-[11px] font-medium group cursor-default"
                  style={{ animationDelay: `${300 + i * 80}ms` }}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${item.color}10` }}>
                    <Icon size={11} style={{ color: item.color }} strokeWidth={1.5} />
                  </div>
                  <span className="group-hover:text-zinc-300 transition-colors duration-200">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* ── Animated statistics ── */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-2xl lg:max-w-3xl mx-auto">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}
                  className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center group"
                  style={{ animationDelay: `${500 + i * 150}ms` }}
                >
                  <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110"
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

          {/* ── Features preview ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-3xl lg:max-w-4xl mx-auto">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <button key={i}
                  onClick={() => handleFeatureClick(feat.module)}
                  className="glass-panel card-hover rounded-xl p-3 sm:p-4 text-left cursor-pointer group transition-all duration-300 btn-ripple relative overflow-hidden"
                  style={{ animationDelay: `${800 + i * 100}ms` }}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${feat.color}10` }}>
                    <Icon size={16} style={{ color: feat.color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-zinc-200 text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">{feat.title}</h3>
                  <p className="text-zinc-500 text-[9px] sm:text-[10px] leading-relaxed line-clamp-2">{feat.desc}</p>
                </button>
              );
            })}
          </div>

          {/* ── Scroll indicator ── */}
          <div className="flex justify-center pt-2">
            <button onClick={handleEnter}
              className="flex flex-col items-center gap-1.5 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer group btn-ripple relative overflow-hidden rounded-lg px-3 py-2">
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase">Explore Platform</span>
              <ChevronDown size={16} className="animate-scroll-bounce group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
