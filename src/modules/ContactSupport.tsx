import { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, Phone, Send, Loader2, CheckCircle2,
  Clock, AlertTriangle, Paperclip, ChevronDown,
} from 'lucide-react';
import { useToast } from '../components/Toast';


interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  date: string;
  lastReply: string;
}

const TICKETS: Ticket[] = [
  { id: 'TKT-001', subject: 'Unable to verify UPI transaction', status: 'open', date: '2026-07-12', lastReply: 'Awaiting response' },
  { id: 'TKT-002', subject: 'False positive on legitimate SMS', status: 'resolved', date: '2026-07-10', lastReply: 'False positive confirmed and model updated' },
  { id: 'TKT-003', subject: 'Feature request — Bulk SMS scan', status: 'pending', date: '2026-07-08', lastReply: 'Feature logged for next sprint' },
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];
const CATEGORY_OPTIONS = ['General Inquiry', 'Bug Report', 'Feature Request', 'Account Issue', 'Scam Report Assistance'];

const STATUS_MAP = {
  open: { color: '#3b82f6', icon: Clock, label: 'Open' },
  pending: { color: '#f59e0b', icon: AlertTriangle, label: 'Pending' },
  resolved: { color: '#10b981', icon: CheckCircle2, label: 'Resolved' },
};

export default function ContactSupport() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General Inquiry');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTickets, setShowTickets] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = () => {
    if (!subject || !message) {
      addToast('Subject and message are required', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addToast('Our team will respond within 24 hours', 'success');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 animate-fade-in py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <CheckCircle2 size={36} className="text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Ticket Submitted</h2>
          <p className="text-sm text-zinc-400">We'll get back to you within 24 hours</p>
        </div>
        <button onClick={() => { setSubmitted(false); setSubject(''); setMessage(''); setPriority('Medium'); setCategory('General Inquiry'); }}
          className="btn-ripple px-5 py-2.5 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Contact Support</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Get help from our support team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Mail, label: 'Email', value: 'support@raksha.ai', color: '#3b82f6' },
          { icon: MessageSquare, label: 'Live Chat', value: '9am — 6pm IST', color: '#10b981' },
          { icon: Phone, label: 'Helpline', value: '1800-XXX-XXXX', color: '#8b5cf6' },
        ].map((item, i) => (
          <button key={i}
            onClick={() => addToast(`Connecting via ${item.value}`, 'info')}
            className="btn-ripple glass-panel card-premium rounded-xl p-4 flex items-center gap-3 hover:border-white/[0.08] transition-all cursor-pointer text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}10` }}>
              <item.icon size={18} style={{ color: item.color }} />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-200 block">{item.label}</span>
              <span className="text-[10px] text-zinc-500">{item.value}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Submit a Ticket</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Message *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors resize-none" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => addToast('File upload coming soon', 'info')}
              className="btn-ripple flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Paperclip size={12} /> Attach files
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-ripple flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <button onClick={() => setShowTickets(!showTickets)}
          className="flex items-center justify-between w-full cursor-pointer">
          <h3 className="text-sm font-medium text-zinc-300">Your Tickets</h3>
          <ChevronDown size={14} className={`text-zinc-600 transition-transform ${showTickets ? 'rotate-180' : ''}`} />
        </button>
        {showTickets && (
          <div className="mt-3 space-y-2">
            {TICKETS.map(ticket => {
              const st = STATUS_MAP[ticket.status];
              const StIcon = st.icon;
              return (
                <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors card-premium">
                  <StIcon size={14} style={{ color: st.color }} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">{ticket.id}</span>
                      <span className="text-sm text-zinc-200 truncate">{ticket.subject}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 block">{ticket.lastReply}</span>
                  </div>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${st.color}15`, color: st.color }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
