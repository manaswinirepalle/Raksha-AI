import type { RiskLevel } from '../types';
import { useEffect, useState, useRef } from 'react';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#3b82f6',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#f43f5e',
};

const RISK_BG: Record<RiskLevel, string> = {
  LOW: 'rgba(59,130,246,0.1)',
  MEDIUM: 'rgba(245,158,11,0.1)',
  HIGH: 'rgba(249,115,22,0.1)',
  CRITICAL: 'rgba(244,63,94,0.12)',
};

export default function RiskScore({ score, level, animate = true }: { score: number; level: RiskLevel; animate?: boolean }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [color, setColor] = useState('#52525b');
  const [pulse, setPulse] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setColor(RISK_COLORS[level]);
      setGlowIntensity(score / 100);
      return;
    }

    const duration = 800;
    const steps = 40;
    const increment = score / steps;
    const stepTime = duration / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      const progress = step / steps;
      setGlowIntensity(progress * (score / 100));

      if (progress < 0.33) setColor('#52525b');
      else if (progress < 0.66) setColor(RISK_COLORS.MEDIUM);
      else setColor(RISK_COLORS[level]);

      if (step >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPulse(true);
        pulseTimerRef.current = setTimeout(() => setPulse(false), 500);
      }
    }, stepTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [score, level, animate]);

  const hexOpacity = (val: number) => Math.min(Math.round(val), 255).toString(16).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3" role="img" aria-label={`Risk score: ${score} out of 100, ${level} risk`}>
      <div className="relative">
        <div
          className={`font-mono font-bold transition-all duration-500 text-5xl sm:text-6xl ${pulse ? 'animate-scale-pulse' : ''}`}
          style={{
            color,
            textShadow: `0 0 ${20 + glowIntensity * 30}px ${RISK_COLORS[level]}${hexOpacity(Math.round(glowIntensity * 60))}, 0 0 ${40 + glowIntensity * 40}px ${RISK_COLORS[level]}${hexOpacity(Math.round(glowIntensity * 20))}`,
            lineHeight: 1,
            transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {displayScore}
        </div>
        {pulse && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-24 h-24 rounded-full animate-scale-pulse"
              style={{ background: `radial-gradient(circle, ${RISK_COLORS[level]}15 0%, transparent 70%)` }} />
          </div>
        )}
      </div>
      <div
        className="font-mono text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-500"
        style={{
          color: RISK_COLORS[level],
          backgroundColor: RISK_BG[level],
          borderColor: `${RISK_COLORS[level]}30`,
          boxShadow: `0 0 ${glowIntensity * 20}px ${RISK_COLORS[level]}${hexOpacity(Math.round(glowIntensity * 15))}`,
        }}
      >
        {level === 'CRITICAL' && '⚠ '}{level} RISK
      </div>
    </div>
  );
}
