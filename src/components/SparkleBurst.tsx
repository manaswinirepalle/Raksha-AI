import { useState, useEffect } from 'react';

interface SparkleBurstProps {
  trigger: boolean;
  color?: string;
  count?: number;
}

export default function SparkleBurst({ trigger, color = '#3b82f6', count = 8 }: SparkleBurstProps) {
  const [sparkles, setSparkles] = useState<{ id: number; sx: number; sy: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const newSparkles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360;
      const distance = 20 + Math.random() * 15;
      const rad = (angle * Math.PI) / 180;
      return {
        id: Date.now() + i,
        sx: Math.cos(rad) * distance,
        sy: Math.sin(rad) * distance,
        delay: Math.random() * 100,
        size: 3 + Math.random() * 3,
      };
    });
    setSparkles(newSparkles);
    const timer = setTimeout(() => setSparkles([]), 800);
    return () => clearTimeout(timer);
  }, [trigger, count]);

  if (sparkles.length === 0) return null;

  return (
    <div className="sparkle-container absolute inset-0 pointer-events-none" aria-hidden="true">
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            width: s.size,
            height: s.size,
            background: color,
            top: '50%',
            left: '50%',
            '--sx': `${s.sx}px`,
            '--sy': `${s.sy}px`,
            animationDelay: `${s.delay}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
