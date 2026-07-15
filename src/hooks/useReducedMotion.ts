import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

export default function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
