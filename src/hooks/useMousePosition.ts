import { useEffect, useRef, useState } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
}

export default function useMousePosition(target?: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, normalX: 0.5, normalY: 0.5 });
  const rafRef = useRef(0);
  const targetRef = useRef({ tx: 0.5, ty: 0.5, cx: 0.5, cy: 0.5 });

  useEffect(() => {
    const el = target?.current || document.body;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetRef.current.tx = (e.clientX - rect.left) / rect.width;
      targetRef.current.ty = (e.clientY - rect.top) / rect.height;
    };

    const lerp = () => {
      const t = targetRef.current;
      t.cx += (t.tx - t.cx) * 0.08;
      t.cy += (t.ty - t.cy) * 0.08;
      setPos({ x: t.cx, y: t.cy, normalX: t.cx, normalY: t.cy });
      rafRef.current = requestAnimationFrame(lerp);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(lerp);
    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return pos;
}
