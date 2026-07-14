import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, ArrowRight, AlertTriangle, TrendingUp, IndianRupee,
  Activity, Globe, Lock, Fingerprint, Zap, Phone, MessageSquare,
  Banknote, Map, CheckCircle, ChevronDown, Eye, Brain, Cpu,
} from 'lucide-react';

const STATS = [
  { value: 1140000, display: '1.14M', label: 'Cybercrime complaints in India, 2023', icon: AlertTriangle, color: '#f43f5e' },
  { value: 1776, display: '₹1,776 Cr', label: 'Lost to digital arrest scams (9 months, 2024)', icon: IndianRupee, color: '#f59e0b', prefix: '₹', suffix: ' Cr' },
  { value: 60, display: '60%', label: 'Year-over-year increase in cybercrime', icon: TrendingUp, color: '#f97316', suffix: '%' },
];

const FEATURES = [
  { icon: Phone, title: 'Scam Detector', desc: 'Real-time transcript analysis with multi-agent fraud detection', color: '#f43f5e', module: 'scam-detector' as const },
  { icon: MessageSquare, title: 'Citizen Shield', desc: 'Instant scam detection for suspicious messages in 22 languages', color: '#3b82f6', module: 'citizen-shield' as const },
  { icon: Banknote, title: 'Counterfeit Agent', desc: 'Security feature verification with confidence scoring', color: '#f59e0b', module: 'counterfeit' as const },
  { icon: Map, title: 'Crime Heatmap', desc: 'Geospatial complaint density visualization across India', color: '#10b981', module: 'heatmap' as const },
];

const TRUST_ITEMS = [
  { icon: CheckCircle, text: 'MHA Advisory Compliant' },
  { icon: Shield, text: 'IT Act Section 65B' },
  { icon: Lock, text: '100% Offline Capable' },
  { icon: Globe, text: '22 Indian Languages' },
];

const FLOATING_ELEMENTS = [
  { Icon: Shield, x: 8, y: 15, size: 20, opacity: 0.035, dur: 18, delay: 0 },
  { Icon: Lock, x: 88, y: 20, size: 16, opacity: 0.03, dur: 22, delay: 2 },
  { Icon: Activity, x: 5, y: 75, size: 14, opacity: 0.025, dur: 20, delay: 4 },
  { Icon: Globe, x: 92, y: 70, size: 22, opacity: 0.025, dur: 24, delay: 1 },
  { Icon: Fingerprint, x: 15, y: 88, size: 16, opacity: 0.02, dur: 19, delay: 3 },
  { Icon: Zap, x: 50, y: 5, size: 14, opacity: 0.025, dur: 21, delay: 5 },
  { Icon: Brain, x: 75, y: 85, size: 18, opacity: 0.02, dur: 23, delay: 2.5 },
  { Icon: Eye, x: 30, y: 10, size: 12, opacity: 0.02, dur: 17, delay: 6 },
  { Icon: Cpu, x: 65, y: 12, size: 15, opacity: 0.02, dur: 20, delay: 3.5 },
];

function useCountUp(target: number, duration: number = 2000, startOnMount: boolean = true) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const frameRef = useRef<number>(0);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [target, duration, started]);

  useEffect(() => {
    if (startOnMount) start();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [start, startOnMount]);

  return { value, start };
}

export default function Landing({ onEnter, onModuleSelect }: { onEnter: () => void; onModuleSelect?: (id: string) => void }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
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
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
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

  const handleFeatureClick = (module: string) => {
    if (onModuleSelect) onModuleSelect(module);
    else onEnter();
  };

  return (
    <div ref={heroRef} className="flex-1 flex flex-col relative z-10 overflow-hidden select-none">
      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb — follows mouse smoothly via lerp */}
        <div className="absolute animate-glow-pulse"
          style={{
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            left: `calc(${mousePos.x * 100}% - 300px)`,
            top: `calc(${mousePos.y * 100}% - 300px)`,
            willChange: 'left, top',
          }} />
        {/* Secondary orb */}
        <div className="absolute animate-mesh-2"
          style={{
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            right: '10%', bottom: '15%',
          }} />
        {/* Tertiary orb */}
        <div className="absolute animate-mesh-3"
          style={{
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
            left: '20%', top: '60%',
          }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        {/* Radial fade over grid */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #09090b 80%)' }} />
      </div>

      {/* ── Floating glowing elements ── */}
      {FLOATING_ELEMENTS.map((el, i) => {
        const Icon = el.Icon;
        return (
          <div key={i} className="absolute pointer-events-none"
            style={{
              left: `${el.x}%`, top: `${el.y}%`,
              animation: `particleFloat ${el.dur}s ease-in-out ${el.delay}s infinite`,
            }}>
            <Icon size={el.size} style={{ opacity: el.opacity }} className="text-white" />
          </div>
        );
      })}

      {/* ── Orbital rings ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full border animate-breathe"
          style={{ borderColor: 'rgba(59,130,246,0.04)' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] md:w-[580px] md:h-[580px] rounded-full"
          style={{ border: '1px solid rgba(139,92,246,0.03)' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[560px] h-[560px] sm:w-[660px] sm:h-[660px] md:w-[760px] md:h-[760px] rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.015)' }} />
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
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 sm:px-8">
        <div className={`max-w-4xl w-full space-y-8 sm:space-y-10 transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* ── Top badge ── */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[10px] sm:text-[11px] font-medium text-zinc-400"
              style={{ animationDelay: '200ms' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              <span>Powered by Multi-Agent AI Intelligence</span>
              <span className="text-zinc-600">|</span>
              <span>India First</span>
            </div>
          </div>

          {/* ── Hero headline ── */}
          <div className="text-center space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center glass-panel-strong glow-blue-soft animate-float-slow">
                  <Shield size={32} className="text-blue-400 sm:w-9 sm:h-9" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }} />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
              <span className="text-gradient block">RAKSHA</span>
              <span className="text-gradient-accent block mt-1">AI</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
              India's AI-powered defense against digital arrest scams, counterfeiting, and fraud networks.
              <span className="text-zinc-200 font-medium"> Intelligence before victimization</span> — not after-the-fact complaints.
            </p>
          </div>

          {/* ── CTA buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button onClick={onEnter}
              className="btn-premium btn-ripple group flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white cursor-pointer touch-target w-full sm:w-auto justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}>
              <Shield size={18} strokeWidth={2} />
              Enter Command Center
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
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
              <span>5 modules ready</span>
            </div>
          </div>

          {/* ── Animated statistics ── */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}
                  className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center group"
                  style={{ animationDelay: `${400 + i * 150}ms` }}>
                  <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${stat.color}10` }}>
                    <Icon size={16} style={{ color: stat.color }} strokeWidth={1.5} />
                  </div>
                  <div className="font-mono text-lg sm:text-2xl md:text-3xl font-bold tracking-tight animate-count-up"
                    style={{ color: stat.color, animationDelay: `${600 + i * 200}ms` }}>
                    {stat.display}
                  </div>
                  <p className="text-zinc-500 text-[9px] sm:text-[11px] leading-snug mt-1 sm:mt-2 line-clamp-2">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Features preview ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <button key={i}
                  onClick={() => handleFeatureClick(feat.module)}
                  className="glass-panel card-hover rounded-xl p-3 sm:p-4 text-left cursor-pointer group transition-all duration-300 btn-ripple relative overflow-hidden"
                  style={{ animationDelay: `${700 + i * 100}ms` }}>
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

          {/* ── Trust indicators ── */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-[11px] font-medium">
                  <Icon size={12} className="text-zinc-600" strokeWidth={1.5} />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* ── Scroll / CTA indicator ── */}
          <div className="flex justify-center pt-2">
            <button onClick={onEnter}
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
