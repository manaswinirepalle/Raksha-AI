import { useState, useCallback } from 'react';
import {
  Headphones,
  CircleDot,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Send,
  Loader2,
  ChevronRight,
  MessageCircle,
  Calendar,
  Tag,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useToast } from '../components/Toast';

type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketCategory = 'Account' | 'Security' | 'Technical' | 'Billing' | 'Other';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  name: string;
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  date: string;
  lastMessage: string;
  messages: Message[];
}

const STATUS_CONFIG: Record<TicketStatus, { color: string; icon: typeof CircleDot; label: string }> = {
  open: { color: '#3b82f6', icon: CircleDot, label: 'Open' },
  'in-progress': { color: '#f59e0b', icon: Clock, label: 'In Progress' },
  resolved: { color: '#10b981', icon: CheckCircle2, label: 'Resolved' },
  closed: { color: '#71717a', icon: XCircle, label: 'Closed' },
};

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; label: string }> = {
  low: { color: '#71717a', label: 'Low' },
  medium: { color: '#3b82f6', label: 'Medium' },
  high: { color: '#f59e0b', label: 'High' },
  urgent: { color: '#ef4444', label: 'Urgent' },
};

const CATEGORIES: TicketCategory[] = ['Account', 'Security', 'Technical', 'Billing', 'Other'];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const STATUSES: (TicketStatus | 'all')[] = ['all', 'open', 'in-progress', 'resolved', 'closed'];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-1042',
    subject: 'Unauthorized UPI transaction flagged by fraud detection',
    status: 'open',
    priority: 'urgent',
    category: 'Security',
    date: '2026-07-15',
    lastMessage: 'We are actively investigating this with your bank. Please do not share OTP with anyone.',
    messages: [
      { id: 'm1', sender: 'user', name: 'You', text: 'I noticed a ₹4,999 UPI transaction from an unknown merchant on my linked account. I did not authorize this payment. Please investigate immediately.', timestamp: '2026-07-15 09:14' },
      { id: 'm2', sender: 'agent', name: 'Priya M.', text: 'We have flagged this transaction for immediate review. Our fraud investigation team is now working with your bank to reverse the charge. You will receive an update within 4 hours.', timestamp: '2026-07-15 09:31' },
      { id: 'm3', sender: 'user', name: 'You', text: 'Thank you. Should I also file a complaint on the National Cybercrime Portal?', timestamp: '2026-07-15 09:45' },
      { id: 'm4', sender: 'agent', name: 'Priya M.', text: 'Yes, filing on cybercrime.gov.in is recommended for your records. We are actively investigating this with your bank. Please do not share OTP with anyone.', timestamp: '2026-07-15 10:02' },
    ],
  },
  {
    id: 'TKT-1041',
    subject: 'False positive blocking legitimate bank SMS',
    status: 'in-progress',
    priority: 'high',
    category: 'Technical',
    date: '2026-07-14',
    lastMessage: 'Our ML team is tuning the classifier. ETA for fix is tomorrow morning.',
    messages: [
      { id: 'm5', sender: 'user', name: 'You', text: 'The scam detector is incorrectly flagging all OTP messages from HDFC Bank as phishing. I cannot receive any bank alerts now.', timestamp: '2026-07-14 14:20' },
      { id: 'm6', sender: 'agent', name: 'Arjun K.', text: 'Thank you for reporting this. We are seeing a pattern with certain bank sender IDs. Can you share 2-3 example messages that were incorrectly flagged?', timestamp: '2026-07-14 14:45' },
      { id: 'm7', sender: 'agent', name: 'Arjun K.', text: 'Our ML team is tuning the classifier. ETA for fix is tomorrow morning.', timestamp: '2026-07-15 08:10' },
    ],
  },
  {
    id: 'TKT-1039',
    subject: 'Request for family plan with multi-device monitoring',
    status: 'open',
    priority: 'medium',
    category: 'Billing',
    date: '2026-07-13',
    lastMessage: 'Feature request logged. Our product team will evaluate priority for Q3 2026.',
    messages: [
      { id: 'm8', sender: 'user', name: 'You', text: 'I would like to protect my elderly parents as well. Do you offer a family plan that covers up to 5 devices under one subscription?', timestamp: '2026-07-13 11:00' },
      { id: 'm9', sender: 'agent', name: 'Neha S.', text: 'Thank you for your interest! Family plans are on our roadmap. Feature request logged. Our product team will evaluate priority for Q3 2026.', timestamp: '2026-07-13 11:30' },
    ],
  },
  {
    id: 'TKT-1038',
    subject: 'Account locked after too many failed login attempts',
    status: 'resolved',
    priority: 'medium',
    category: 'Account',
    date: '2026-07-12',
    lastMessage: 'Account has been unlocked. We recommend enabling biometric login for convenience.',
    messages: [
      { id: 'm10', sender: 'user', name: 'You', text: 'My account is locked after I forgot my password and tried too many times. I need access urgently.', timestamp: '2026-07-12 08:30' },
      { id: 'm11', sender: 'agent', name: 'Vikram R.', text: 'I have verified your identity via registered phone number. Your account has been unlocked. We recommend enabling biometric login for convenience.', timestamp: '2026-07-12 09:05' },
    ],
  },
  {
    id: 'TKT-1035',
    subject: 'Subscription renewal failed — charged but no access',
    status: 'in-progress',
    priority: 'high',
    category: 'Billing',
    date: '2026-07-11',
    lastMessage: 'Payment gateway confirms double deduction. Refund initiated, will reflect in 3-5 business days.',
    messages: [
      { id: 'm12', sender: 'user', name: 'You', text: 'My yearly subscription renewed today but I am still seeing the free plan. ₹1,499 was debited from my account. Please restore my Pro access.', timestamp: '2026-07-11 16:00' },
      { id: 'm13', sender: 'agent', name: 'Neha S.', text: 'Payment gateway confirms double deduction. Refund initiated, will reflect in 3-5 business days.', timestamp: '2026-07-12 10:20' },
    ],
  },
  {
    id: 'TKT-1033',
    subject: 'How to set up call screening for unknown numbers',
    status: 'resolved',
    priority: 'low',
    category: 'Technical',
    date: '2026-07-10',
    lastMessage: 'You can enable call screening under Settings > Privacy > Call Protection.',
    messages: [
      { id: 'm14', sender: 'user', name: 'You', text: 'I want to enable call screening so unknown numbers get a verification prompt before reaching me. How do I set this up?', timestamp: '2026-07-10 13:00' },
      { id: 'm15', sender: 'agent', name: 'Arjun K.', text: 'You can enable call screening under Settings > Privacy > Call Protection. Toggle "Screen Unknown Callers" and set your preferred verification method.', timestamp: '2026-07-10 13:20' },
    ],
  },
  {
    id: 'TKT-1030',
    subject: 'Phishing SMS pretending to be IRCTC — need guidance',
    status: 'closed',
    priority: 'low',
    category: 'Security',
    date: '2026-07-08',
    lastMessage: 'Issue resolved. The phishing domain has been reported to CERT-In and added to our blocklist.',
    messages: [
      { id: 'm16', sender: 'user', name: 'You', text: 'I received an SMS claiming my IRCTC ticket refund is pending. The link looks suspicious. Can you help verify?', timestamp: '2026-07-08 10:15' },
      { id: 'm17', sender: 'agent', name: 'Priya M.', text: 'This is a known phishing campaign. Do not click the link. The phishing domain has been reported to CERT-In and added to our blocklist.', timestamp: '2026-07-08 10:40' },
      { id: 'm18', sender: 'user', name: 'You', text: 'Thank you for confirming. I have deleted the message.', timestamp: '2026-07-08 10:50' },
      { id: 'm19', sender: 'agent', name: 'Priya M.', text: 'Great. Stay safe. If you ever receive similar messages, use the "Report" button in the app for faster processing.', timestamp: '2026-07-08 11:05' },
    ],
  },
  {
    id: 'TKT-1027',
    subject: 'Export my scam detection history and reports',
    status: 'resolved',
    priority: 'low',
    category: 'Other',
    date: '2026-07-06',
    lastMessage: 'Data export has been emailed to your registered address.',
    messages: [
      { id: 'm20', sender: 'user', name: 'You', text: 'I need a copy of all my scam detection reports for legal documentation. Can you export the full history?', timestamp: '2026-07-06 09:00' },
      { id: 'm21', sender: 'agent', name: 'Vikram R.', text: 'Your data export is ready. A CSV file with your full detection history has been emailed to your registered address.', timestamp: '2026-07-06 15:30' },
    ],
  },
  {
    id: 'TKT-1025',
    subject: 'App crashes on startup after latest Android update',
    status: 'open',
    priority: 'high',
    category: 'Technical',
    date: '2026-07-14',
    lastMessage: 'Our engineering team is aware of a compatibility issue with Android 15 Beta 3.',
    messages: [
      { id: 'm22', sender: 'user', name: 'You', text: 'After updating to Android 15 Beta 3, Raksha AI crashes immediately on launch. I have tried reinstalling but the issue persists.', timestamp: '2026-07-14 18:30' },
      { id: 'm23', sender: 'agent', name: 'Arjun K.', text: 'Our engineering team is aware of a compatibility issue with Android 15 Beta 3. A patch is in development and will be released within 48 hours.', timestamp: '2026-07-15 09:00' },
    ],
  },
];

let ticketCounter = 1043;

export default function ContactSupport() {
  const { addToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeStatus, setActiveStatus] = useState<TicketStatus | 'all'>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState<TicketCategory>('Account');
  const [submitting, setSubmitting] = useState(false);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  const filteredTickets = activeStatus === 'all' ? tickets : tickets.filter((t) => t.status === activeStatus);

  const handleSubmit = useCallback(() => {
    if (!subject.trim() || !message.trim()) {
      addToast('Subject and message are required', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TKT-${ticketCounter++}`,
        subject: subject.trim(),
        status: 'open',
        priority,
        category,
        date: new Date().toISOString().split('T')[0],
        lastMessage: message.trim().slice(0, 100),
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            name: 'You',
            text: message.trim(),
            timestamp: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
          },
        ],
      };
      setTickets((prev) => [newTicket, ...prev]);
      setSubject('');
      setMessage('');
      setPriority('medium');
      setCategory('Account');
      setSubmitting(false);
      addToast(`Ticket ${newTicket.id} created successfully`, 'success');
    }, 1500);
  }, [subject, message, priority, category, addToast]);

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Headphones size={16} style={{ color: '#60a5fa' }} />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Contact Support</h2>
            <p className="db-subtitle">24/7 enterprise support for Raksha AI</p>
          </div>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat card-hover">
          <div className="db-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <CircleDot size={14} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <div className="db-stat-value">{openCount}</div>
            <div className="db-stat-label">Open Tickets</div>
          </div>
        </div>
        <div className="db-stat card-hover">
          <div className="db-stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Clock size={14} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div className="db-stat-value">{inProgressCount}</div>
            <div className="db-stat-label">In Progress</div>
          </div>
        </div>
        <div className="db-stat card-hover">
          <div className="db-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 size={14} style={{ color: '#34d399' }} />
          </div>
          <div>
            <div className="db-stat-value">{resolvedCount}</div>
            <div className="db-stat-label">Resolved</div>
          </div>
        </div>
        <div className="db-stat card-hover">
          <div className="db-stat-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <Zap size={14} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <div className="db-stat-value">2.4h</div>
            <div className="db-stat-label">Avg Response</div>
          </div>
        </div>
      </div>

      <div className="db-grid-2" style={{ alignItems: 'start' }}>
        <div className="db-section">
          <div className="db-section-header">
            <span className="db-section-title">
              <MessageCircle size={13} /> Your Tickets
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className="db-btn"
                style={{
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: activeStatus === s ? 600 : 400,
                  background: activeStatus === s ? 'rgba(59,130,246,0.15)' : undefined,
                  color: activeStatus === s ? '#60a5fa' : undefined,
                  borderColor: activeStatus === s ? 'rgba(59,130,246,0.3)' : undefined,
                }}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredTickets.length === 0 && (
              <div className="db-card" style={{ textAlign: 'center', padding: '20px', color: '#71717a', fontSize: '11px' }}>
                No tickets found for this filter.
              </div>
            )}
            {filteredTickets.map((ticket) => {
              const st = STATUS_CONFIG[ticket.status];
              const StIcon = st.icon;
              const pr = PRIORITY_CONFIG[ticket.priority];
              const isExpanded = expandedTicket === ticket.id;

              return (
                <div key={ticket.id}>
                  <button
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                    className="db-card card-hover"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: isExpanded ? 'rgba(59,130,246,0.25)' : undefined,
                      background: isExpanded ? 'rgba(59,130,246,0.04)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ marginTop: '2px' }}>
                        <StIcon size={12} style={{ color: st.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#71717a' }}>{ticket.id}</span>
                          <span
                            style={{
                              fontSize: '8px',
                              fontWeight: 600,
                              padding: '1px 6px',
                              borderRadius: '9999px',
                              background: `${pr.color}18`,
                              color: pr.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {pr.label}
                          </span>
                          <span
                            style={{
                              fontSize: '8px',
                              fontWeight: 500,
                              padding: '1px 6px',
                              borderRadius: '9999px',
                              background: `${st.color}18`,
                              color: st.color,
                            }}
                          >
                            {st.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: '#e4e4e7', marginBottom: '3px', lineHeight: 1.3 }}>
                          {ticket.subject}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#71717a' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Tag size={8} /> {ticket.category}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Calendar size={8} /> {ticket.date}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={12}
                        style={{
                          color: '#52525b',
                          transition: 'transform 200ms ease',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="glass-panel" style={{ padding: '12px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
                        <div style={{ color: '#71717a' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}><Calendar size={9} /> Date</span>
                          <span style={{ color: '#d4d4d8' }}>{ticket.date}</span>
                        </div>
                        <div style={{ color: '#71717a' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}><Tag size={9} /> Category</span>
                          <span style={{ color: '#d4d4d8' }}>{ticket.category}</span>
                        </div>
                      </div>
                      <div className="db-divider" />
                      <div style={{ fontSize: '10px', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Message Thread
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '250px', overflowY: 'auto' }}>
                        {ticket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '10px',
                              background: msg.sender === 'user' ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
                              border: msg.sender === 'user' ? '1px solid rgba(59,130,246,0.12)' : '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                              <User size={9} style={{ color: msg.sender === 'agent' ? '#10b981' : '#60a5fa' }} />
                              <span style={{ fontSize: '10px', fontWeight: 600, color: msg.sender === 'agent' ? '#34d399' : '#60a5fa' }}>
                                {msg.name}
                              </span>
                              <span style={{ fontSize: '8px', color: '#52525b', marginLeft: 'auto' }}>{msg.timestamp}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#d4d4d8', lineHeight: 1.5 }}>{msg.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="db-section">
          <div className="db-section-header">
            <span className="db-section-title">
              <Send size={13} /> New Ticket
            </span>
          </div>

          <div className="glass-panel-strong" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', display: 'block' }}>Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="input-premium"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', color: '#e4e4e7', boxSizing: 'border-box' }}
              />
            </div>

            <div className="db-grid-2">
              <div>
                <label style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', display: 'block' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="input-premium"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', color: '#e4e4e7', appearance: 'none', boxSizing: 'border-box' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', display: 'block' }}>Priority</label>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {PRIORITIES.map((p) => {
                    const cfg = PRIORITY_CONFIG[p];
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          fontSize: '10px',
                          fontWeight: isSelected ? 600 : 400,
                          padding: '5px 8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: `1px solid ${isSelected ? cfg.color + '50' : 'rgba(255,255,255,0.06)'}`,
                          background: isSelected ? cfg.color + '18' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? cfg.color : '#71717a',
                          transition: 'all 200ms ease',
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', display: 'block' }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={5}
                className="input-premium"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', color: '#e4e4e7', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '9px', color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={9} /> Response within 2 hours
              </span>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="db-btn db-btn-primary"
                style={{ padding: '7px 16px', fontSize: '11px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? (
                  <><Loader2 size={11} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={11} /> Submit Ticket</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
