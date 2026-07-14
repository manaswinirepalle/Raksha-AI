import type { RiskLevel } from '../types';
import { useEffect, useState, useRef } from 'react';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#22D3EE',
  MEDIUM: '#FBBF24',
  HIGH: '#F97316',
  CRITICAL: '#FF3B4E',
};

const RISK_BG: Record<RiskLevel, string> = {
  LOW: 'rgba(34,211,238,0.1)',
  MEDIUM: 'rgba(251,191,36,0.1)',
  HIGH: 'rgba(249,115,22,0.1)',
  CRITICAL: 'rgba(255,59,78,0.15)',
};

export default function RiskScore({ score, level, animate = true }: { score: number; level: RiskLevel; animate?: boolean }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [color, setColor] = useState('#6B7280');
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setColor(RISK_COLORS[level]);
      return;
    }

    const duration = 600;
    const steps = 30;
    const increment = score / steps;
    const stepTime = duration / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);

      const progress = step / steps;
      if (progress < 0.33) setColor('#6B7280');
      else if (progress < 0.66) setColor(RISK_COLORS.MEDIUM);
      else setColor(RISK_COLORS[level]);

      if (step >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPulse(true);
        setTimeout(() => setPulse(false), 400);
      }
    }, stepTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [score, level, animate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`font-mono font-bold transition-all duration-400 ${pulse ? 'animate-scale-pulse' : ''}`}
        style={{
          fontSize: '48px',
          color,
          textShadow: `0 0 20px ${RISK_COLORS[level]}40`,
          lineHeight: 1,
        }}
      >
        {displayScore}
      </div>
      <div
        className="font-mono text-sm font-semibold px-4 py-1 rounded-full border transition-colors duration-400"
        style={{
          color: RISK_COLORS[level],
          backgroundColor: RISK_BG[level],
          borderColor: `${RISK_COLORS[level]}40`,
        }}
      >
        {level === 'CRITICAL' && '⚠ '}{level} RISK
      </div>
    </div>
  );
}
