import { AlertTriangle, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useScamAlerts } from '../hooks/useScamAlerts';

export default function ScamAlertFeed() {
  const alerts = useScamAlerts();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase">Live Scam Alerts</span>
      </div>
      {alerts.map((alert, i) => (
        <div
          key={alert.id}
          className="animate-fade-slide-up p-3 rounded-xl border bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-default group"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${alert.color}12` }}
            >
              <AlertTriangle size={14} style={{ color: alert.color }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-semibold text-zinc-200 truncate">{alert.title}</span>
                <span
                  className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${alert.color}15`, color: alert.color, border: `1px solid ${alert.color}25` }}
                >
                  {alert.type}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{alert.detail}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[9px] text-zinc-600">
                  <MapPin size={9} strokeWidth={1.5} />{alert.region}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-zinc-600">
                  <Clock size={9} strokeWidth={1.5} />{alert.timeAgo}
                </span>
              </div>
            </div>
            <ChevronRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
