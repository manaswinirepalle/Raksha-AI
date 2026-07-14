import { useEffect, useState, useRef, useCallback } from 'react';
import type { RiskLevel } from '../types';

const LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: '#10b981',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#f43f5e',
};

const RADIUS = 68;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskGauge({ score, level, animate = true }: { score: number; level: RiskLevel; animate?: boolean }) {
  const [offset, setOffset] = useState(animate ? CIRCUMFERENCE : CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE);
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [pulse, setPulse] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const color = LEVEL_COLORS[level];
  const intensity = score / 100;

  const hexOpacity = (val: number) => Math.min(Math.round(val), 255).toString(16).padStart(2, '0');

  const animateArc = useCallback(() => {
    const duration = 1000;
    const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
    const startOffset = CIRCUMFERENCE;
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setOffset(startOffset + (targetOffset - startOffset) * eased);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [score]);

  useEffect(() => {
    if (animate) {
      animateArc();
    } else {
      setOffset(CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE);
      setDisplayScore(score);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, score, animateArc]);

  return (
    <div className="flex flex-col items-center gap-3" role="img" aria-label={`Risk gauge: ${score} out of 100, ${level} risk`}>
      <div className="relative w-[160px] h-[160px]">
        {animate && pulse && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
              animation: 'ping 600ms cubic-bezier(0, 0, 0.2, 1) forwards',
            }}
          />
        )}
        {animate && (
          <div
            className="absolute inset-[-4px] rounded-full pointer-events-none"
            aria-hidden="true"
            style={{
              boxShadow: `0 0 ${20 + intensity * 30}px ${color}${hexOpacity(Math.round(intensity * 40))}`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
        <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="#27272a"
            strokeWidth={STROKE}
          />
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 ${6 + intensity * 10}px ${color}${hexOpacity(Math.round(intensity * 80))})`,
              transition: 'stroke 400ms ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-4xl font-bold tabular-nums"
            style={{
              color,
              textShadow: `0 0 ${12 + intensity * 20}px ${color}${hexOpacity(Math.round(intensity * 50))}`,
              lineHeight: 1,
            }}
          >
            {displayScore}
          </span>
        </div>
      </div>
      <span
        className="font-mono text-[11px] font-semibold px-3 py-1 rounded-full border"
        style={{
          color,
          backgroundColor: `${color}12`,
          borderColor: `${color}30`,
          boxShadow: `0 0 ${10 + intensity * 15}px ${color}${hexOpacity(Math.round(intensity * 15))}`,
        }}
      >
        {level === 'CRITICAL' && '⚠ '}{level}
      </span>
    </div>
  );
}
