import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

interface ToastContextType {
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[2000] flex flex-col gap-2 pointer-events-none max-sm:top-auto max-sm:bottom-20 max-sm:left-4 max-sm:right-4" style={{ maxWidth: '380px' }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />,
    error: <AlertTriangle size={15} className="text-rose-400 flex-shrink-0" />,
    info: <Info size={15} className="text-blue-400 flex-shrink-0" />,
  };

  const borders = {
    success: 'rgba(16,185,129,0.2)',
    error: 'rgba(244,63,94,0.2)',
    info: 'rgba(59,130,246,0.2)',
  };

  const glows = {
    success: '0 0 20px rgba(16,185,129,0.1)',
    error: '0 0 20px rgba(244,63,94,0.1)',
    info: '0 0 20px rgba(59,130,246,0.1)',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-strong shadow-2xl shadow-black/30 relative overflow-hidden ${
        exiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      style={{ border: `1px solid ${borders[toast.type]}`, boxShadow: glows[toast.type] }}
      role="alert"
      aria-live="assertive"
    >
      {icons[toast.type]}
      <span className="text-[12px] sm:text-[13px] text-zinc-200 font-medium flex-1">{toast.message}</span>
      <button onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05]"
        aria-label="Dismiss notification">
        <X size={14} />
      </button>
      <div
        className="toast-progress"
        style={{
          width: '100%',
          background: borders[toast.type],
          animationDuration: `${toast.duration}ms`,
        }}
      />
    </div>
  );
}
