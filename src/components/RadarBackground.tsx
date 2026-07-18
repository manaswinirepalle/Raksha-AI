import { useEffect, useRef, useCallback } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface LightBeam {
  angle: number;
  speed: number;
  width: number;
  opacity: number;
  hue: number;
}

export default function RadarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  const onPointerMove = useCallback((e: PointerEvent) => {
    targetMouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let isVisible = true;
    let angle = 0;
    const particles: Particle[] = [];
    const lightBeams: LightBeam[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        hue: Math.random() > 0.7 ? 220 + Math.random() * 40 : 200 + Math.random() * 60,
        life: Math.random() * 600,
        maxLife: 400 + Math.random() * 400,
      });
    }

    for (let i = 0; i < 3; i++) {
      lightBeams.push({
        angle: (Math.PI * 2 * i) / 3,
        speed: 0.0004 + Math.random() * 0.0002,
        width: 0.08 + Math.random() * 0.04,
        opacity: 0.04 + Math.random() * 0.02,
        hue: [210, 240, 200][i],
      });
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const draw = (time: number) => {
      if (!isVisible) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 640;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.max(w, h) * 0.45;

      // Cursor glow
      const glowX = mx * w;
      const glowY = my * h;
      const cursorGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 350);
      cursorGrad.addColorStop(0, 'rgba(59, 130, 246, 0.035)');
      cursorGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.015)');
      cursorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, w, h);

      // Center gradient mesh
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.7);
      bgGrad.addColorStop(0, 'rgba(59, 130, 246, 0.018)');
      bgGrad.addColorStop(0.4, 'rgba(139, 92, 246, 0.008)');
      bgGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.004)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Floating gradient orbs
      const orbTime = time * 0.0003;
      const orbs = [
        { ox: cx + Math.sin(orbTime * 0.7) * w * 0.15, oy: cy + Math.cos(orbTime * 0.5) * h * 0.12, r: 200, color: '59,130,246', a: 0.012 },
        { ox: cx + Math.cos(orbTime * 0.4) * w * 0.2, oy: cy + Math.sin(orbTime * 0.6) * h * 0.18, r: 160, color: '139,92,246', a: 0.008 },
        { ox: cx + Math.sin(orbTime * 0.3) * w * 0.25, oy: h * 0.3 + Math.cos(orbTime * 0.5) * h * 0.1, r: 140, color: '6,182,212', a: 0.006 },
      ];
      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(orb.ox, orb.oy, 0, orb.ox, orb.oy, orb.r);
        grad.addColorStop(0, `rgba(${orb.color},${orb.a})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Radar rings
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR * i) / 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.01 + i * 0.002})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Cross hairs
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Radar sweep
      if (!prefersReduced) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxR, -0.3, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
        sweepGrad.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
        sweepGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.02)');
        sweepGrad.addColorStop(1, 'rgba(59, 130, 246, 0.002)');
        ctx.fillStyle = sweepGrad;
        ctx.fill();
        ctx.restore();

        // Sweep line
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxR, 0);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();

        angle += (2 * Math.PI) / (20 * 60);
      }

      // Light beams
      if (!prefersReduced) {
        for (const beam of lightBeams) {
          beam.angle += beam.speed;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(beam.angle);
          const bGrad = ctx.createLinearGradient(0, 0, maxR * 0.6, 0);
          bGrad.addColorStop(0, `hsla(${beam.hue}, 70%, 60%, ${beam.opacity})`);
          bGrad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(maxR * 0.6, Math.tan(beam.width) * maxR * 0.6);
          ctx.lineTo(maxR * 0.6, -Math.tan(beam.width) * maxR * 0.6);
          ctx.closePath();
          ctx.fillStyle = bGrad;
          ctx.fill();
          ctx.restore();
        }
      }

      // Particles
      for (let pi = 0; pi < particles.length; pi++) {
        if (isMobile && pi % 2 !== 0) continue;
        const p = particles[pi];
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random();
          p.y = Math.random();
          p.life = 0;
          p.maxLife = 400 + Math.random() * 400;
          p.opacity = Math.random() * 0.3 + 0.05;
        }

        if (!prefersReduced) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const force = (0.15 - dist) * 0.3;
            p.vx += dx * force * 0.01;
            p.vy += dy * force * 0.01;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.8) * 5, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.8 ? fadeOut : 1);

        if (alpha > 0.01) {
          const px = p.x * w;
          const py = p.y * h;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${alpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Connection lines between nearby particles (skipped on mobile for perf)
      if (w > 640) {
        const distThreshold = 100;
        const distThresholdSq = distThreshold * distThreshold;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = (a.x - b.x) * w;
            const dy = (a.y - b.y) * h;
            const distSq = dx * dx + dy * dy;
            if (distSq < distThresholdSq) {
              const alpha = (1 - Math.sqrt(distSq) / distThreshold) * 0.03;
              ctx.beginPath();
              ctx.moveTo(a.x * w, a.y * h);
              ctx.lineTo(b.x * w, b.y * h);
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [prefersReduced, onPointerMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.08, zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
