import { useState, useEffect, useMemo } from 'react';
import {
  Shield, ShieldAlert, Phone, PhoneCall, Plus, Trash2, Check, X,
  AlertTriangle, Loader2, RefreshCw, Star, Siren, Ban, Flag, ScanLine,
  Lock, KeyRound, Link, Users, ArrowDownToLine, Eye, Wifi, HardDrive,
  Calendar, TrendingUp, MessageSquare, FileText, Brain, Sparkles,
  ShieldPlus, ShieldOff,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  icon: typeof Shield;
  checked: boolean;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Police', phone: '100', relation: 'Emergency', isPrimary: true },
  { id: '2', name: 'Cyber Crime Helpline', phone: '1930', relation: 'Helpline', isPrimary: true },
  { id: '3', name: 'Women Helpline', phone: '1091', relation: 'Safety', isPrimary: false },
  { id: '4', name: 'Ambulance', phone: '108', relation: 'Medical', isPrimary: false },
];

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Two-factor authentication enabled', icon: KeyRound, checked: true },
  { id: '2', label: 'Never share OTPs with anyone', icon: Lock, checked: true },
  { id: '3', label: 'Verify sender before clicking links', icon: Link, checked: false },
  { id: '4', label: 'Emergency contacts updated', icon: Users, checked: true },
  { id: '5', label: 'Security updates installed', icon: ArrowDownToLine, checked: false },
  { id: '6', label: 'Strong, unique passwords used', icon: KeyRound, checked: false },
  { id: '7', label: 'App permissions reviewed', icon: Eye, checked: true },
  { id: '8', label: 'Bank transaction alerts enabled', icon: ShieldAlert, checked: false },
  { id: '9', label: 'VPN usage on public networks', icon: Wifi, checked: false },
  { id: '10', label: 'Data backup enabled', icon: HardDrive, checked: true },
];

const WEEKLY_DATA = [
  { day: 'Mon', scams: 3, calls: 7, messages: 12, reports: 1 },
  { day: 'Tue', scams: 5, calls: 4, messages: 8, reports: 2 },
  { day: 'Wed', scams: 2, calls: 9, messages: 15, reports: 0 },
  { day: 'Thu', scams: 7, calls: 6, messages: 11, reports: 3 },
  { day: 'Fri', scams: 4, calls: 8, messages: 18, reports: 1 },
  { day: 'Sat', scams: 6, calls: 3, messages: 9, reports: 2 },
  { day: 'Sun', scams: 1, calls: 5, messages: 6, reports: 0 },
];

const AI_TIPS = [
  {
    id: '1',
    icon: Brain,
    title: 'Suspicious Pattern Detected',
    description: '3 unknown numbers tried to reach you this week. Consider enabling call screening for unknown callers.',
  },
  {
    id: '2',
    icon: ShieldPlus,
    title: 'Password Strength Alert',
    description: 'You have 2 accounts with weak passwords. Update them with strong, unique combinations to stay protected.',
  },
  {
    id: '3',
    icon: TrendingUp,
    title: 'Scam Risk Rising',
    description: 'Scam attempts in your region increased 12% this month. Stay vigilant with unsolicited messages.',
  },
  {
    id: '4',
    icon: Sparkles,
    title: 'Backup Recommendation',
    description: 'Enable cloud backup for your contacts and messages. In case of device loss, recovery becomes instant.',
  },
];

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#10b981';
  if (score >= 30) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 30) return 'Moderate';
  return 'Critical';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'url(#gaugeGradientGreen)';
  if (score >= 60) return 'url(#gaugeGradientEmerald)';
  if (score >= 30) return 'url(#gaugeGradientAmber)';
  return 'url(#gaugeGradientRed)';
}

function getRecommendation(score: number): string {
  if (score >= 80) return 'Excellent! Your digital safety posture is strong. Keep maintaining these habits.';
  if (score >= 60) return 'Good progress! Enable a few more protections to reach Excellent status.';
  if (score >= 30) return 'Your safety score needs improvement. Toggle on more protections to boost your score.';
  return 'Your device is vulnerable. Enable as many safety measures as possible right away.';
}

export default function SafetyCenter() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [savingContact, setSavingContact] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [gaugeProgress, setGaugeProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const safetyScore = useMemo(() => {
    const checked = checklist.filter(c => c.checked).length;
    return Math.round((checked / checklist.length) * 100);
  }, [checklist]);

  useEffect(() => {
    let frame: number;
    const duration = 1000;
    const start = Date.now();
    const from = gaugeProgress;
    const to = safetyScore;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setGaugeProgress(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [safetyScore]);

  const checkedCount = useMemo(() => checklist.filter(c => c.checked).length, [checklist]);
  const failedCount = useMemo(() => checklist.filter(c => !c.checked).length, [checklist]);

  const weeklyStats = useMemo(() => {
    const totalScams = WEEKLY_DATA.reduce((a, d) => a + d.scams, 0);
    const totalCalls = WEEKLY_DATA.reduce((a, d) => a + d.calls, 0);
    const totalMessages = WEEKLY_DATA.reduce((a, d) => a + d.messages, 0);
    const totalReports = WEEKLY_DATA.reduce((a, d) => a + d.reports, 0);
    return { totalScams, totalCalls, totalMessages, totalReports };
  }, []);

  const maxDailyValue = useMemo(() => {
    let max = 0;
    WEEKLY_DATA.forEach(d => {
      const total = d.scams + d.calls + d.messages + d.reports;
      if (total > max) max = total;
    });
    return max;
  }, []);

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      addToast('Name and phone number are required', 'error');
      return;
    }
    setSavingContact(true);
    setTimeout(() => {
      setContacts(prev => [
        ...prev,
        { ...newContact, id: Date.now().toString(), isPrimary: false },
      ]);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowAddForm(false);
      setSavingContact(false);
      addToast(`${newContact.name} added to emergency contacts`, 'success');
    }, 500);
  };

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact?.isPrimary) {
      addToast('Cannot remove primary emergency contacts', 'error');
      return;
    }
    setContacts(prev => prev.filter(c => c.id !== id));
    addToast(`${contact?.name} removed from contacts`, 'info');
  };

  const handleToggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleRecalcScore = () => {
    setScoring(true);
    setTimeout(() => {
      setScoring(false);
      addToast(`Safety score recalculated: ${safetyScore}%`, 'success');
    }, 800);
  };

  const handleTestEmergency = () => {
    addToast('Test alert sent to all emergency contacts', 'info');
  };

  const handleCallContact = (phone: string, name: string) => {
    addToast(`Dialing ${name} at ${phone}...`, 'info');
  };

  const handleCallPolice = () => {
    addToast('Connecting to Police (100)...', 'error');
  };

  const handleBlockNumber = () => {
    addToast('Open Call Protection to block a suspicious number', 'info');
  };

  const handleReportScam = () => {
    addToast('Redirecting to Report Fraud page...', 'info');
  };

  const handleSecurityScan = () => {
    addToast('Running full device security scan...', 'success');
  };

  const gaugeRadius = 70;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (gaugeProgress / 100) * gaugeCircumference;

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 w-64 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
            <div className="h-9 w-28 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-8">
            <div className="w-[180px] h-[180px] rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="h-3 w-56 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-panel rounded-xl p-5 space-y-3">
            <div className="h-4 w-36 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
          <div className="glass-panel rounded-xl p-5 space-y-3">
            <div className="h-4 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5">
          <div className="h-4 w-28 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5">
          <div className="h-4 w-40 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
          <div className="mt-4 h-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="glass-panel rounded-xl p-5 space-y-3">
              <div className="h-4 w-44 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 w-full rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in py-20">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,63,94,0.1)' }}>
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <div className="text-center">
          <p className="text-zinc-200 font-medium text-sm">Failed to load Safety Center</p>
          <p className="text-zinc-500 text-xs mt-1">An error occurred while loading your safety data</p>
        </div>
        <button
          onClick={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 1000); }}
          className="btn-ripple flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 transition-all cursor-pointer"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ─── Premium Header ─── */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))' }}
            >
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-100">Safety Center</h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 max-w-xs">
                Personal safety score, emergency contacts, and protection tools
              </p>
            </div>
          </div>
          <button
            onClick={handleTestEmergency}
            className="btn-ripple flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
          >
            <Siren size={15} /> Test Emergency
          </button>
        </div>
      </div>

      {/* ─── Safety Score ─── */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* SVG Gauge */}
          <div className="relative w-[180px] h-[180px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="gaugeGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <linearGradient id="gaugeGradientEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="gaugeGradientAmber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="gaugeGradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <filter id="gaugeGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Track */}
              <circle
                cx="90" cy="90" r={gaugeRadius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Tick marks */}
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const x1 = 90 + 78 * Math.cos(rad);
                const y1 = 90 + 78 * Math.sin(rad);
                const x2 = 90 + (i % 5 === 0 ? 82 : 80) * Math.cos(rad);
                const y2 = 90 + (i % 5 === 0 ? 82 : 80) * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={i % 5 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={i % 5 === 0 ? 2 : 1}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Gauge arc */}
              <circle
                cx="90" cy="90" r={gaugeRadius}
                fill="none"
                stroke={getScoreGradient(safetyScore)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeOffset}
                filter="url(#gaugeGlow)"
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl sm:text-5xl font-black tabular-nums"
                style={{ color: getScoreColor(safetyScore) }}
              >
                {gaugeProgress}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">out of 100</span>
            </div>
          </div>

          {/* Score details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <p className="text-xl font-bold text-zinc-100">{getScoreLabel(safetyScore)}</p>
              <p className="text-xs text-zinc-500 mt-1">Based on {checklist.length} security checks</p>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <Check size={12} /> {checkedCount} passed
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium">
                <X size={12} /> {failedCount} failed
              </span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <Brain size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 leading-relaxed">{getRecommendation(safetyScore)}</p>
            </div>
            <button
              onClick={handleRecalcScore}
              disabled={scoring}
              className="btn-ripple inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-50"
            >
              {scoring ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              Recalculate Score
            </button>
          </div>
        </div>
      </div>

      {/* ─── Protection Checklist + Emergency Contacts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Protection Checklist */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Protection Checklist</h3>
            <span className="text-xs font-medium text-zinc-500">
              {checkedCount}/{checklist.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(checkedCount / checklist.length) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #22c55e)',
                }}
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5">
              {Math.round((checkedCount / checklist.length) * 100)}% of protections active
            </p>
          </div>
          <div className="space-y-1.5">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all text-left cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    item.checked
                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                      : 'border border-white/[0.08] group-hover:border-white/[0.15]'
                  }`}
                >
                  {item.checked && <Check size={11} className="text-emerald-400" />}
                </div>
                <item.icon size={14} className={`flex-shrink-0 ${item.checked ? 'text-emerald-400/60' : 'text-zinc-600'}`} />
                <span
                  className={`text-sm transition-colors ${
                    item.checked ? 'text-zinc-500 line-through' : 'text-zinc-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Emergency Contacts</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-ripple flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <Plus size={13} /> Add Contact
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div
              className="mb-4 p-4 rounded-xl space-y-2.5 border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <input
                value={newContact.name}
                onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                placeholder="Contact name"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
              />
              <input
                value={newContact.phone}
                onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                placeholder="Phone number"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
              />
              <input
                value={newContact.relation}
                onChange={e => setNewContact(p => ({ ...p, relation: e.target.value }))}
                placeholder="Relation (optional)"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddContact}
                  disabled={savingContact}
                  className="btn-ripple flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingContact ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setNewContact({ name: '', phone: '', relation: '' }); }}
                  className="btn-ripple flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Contact List */}
          <div className="space-y-2">
            {contacts.length === 0 ? (
              <div className="py-8 text-center">
                <Users size={24} className="text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No emergency contacts added</p>
                <p className="text-[10px] text-zinc-600 mt-1">Add contacts to quickly reach help</p>
              </div>
            ) : (
              contacts.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: c.isPrimary ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <Phone size={15} className={c.isPrimary ? 'text-red-400' : 'text-zinc-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200 truncate">{c.name}</span>
                      {c.isPrimary && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-medium flex-shrink-0">
                          <Star size={8} fill="currentColor" /> Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">{c.phone} · {c.relation}</span>
                  </div>
                  <button
                    onClick={() => handleCallContact(c.phone, c.name)}
                    className="btn-ripple p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                    title={`Call ${c.name}`}
                  >
                    <PhoneCall size={14} />
                  </button>
                  {!c.isPrimary && (
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="btn-ripple opacity-0 group-hover:opacity-100 p-2 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title={`Remove ${c.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Phone,
              label: 'Call Police',
              color: '#ef4444',
              bg: 'rgba(239,68,68,0.08)',
              hoverBg: 'rgba(239,68,68,0.15)',
              action: handleCallPolice,
            },
            {
              icon: Ban,
              label: 'Block Suspicious Number',
              color: '#f97316',
              bg: 'rgba(249,115,22,0.08)',
              hoverBg: 'rgba(249,115,22,0.15)',
              action: handleBlockNumber,
            },
            {
              icon: Flag,
              label: 'Report Scam',
              color: '#3b82f6',
              bg: 'rgba(59,130,246,0.08)',
              hoverBg: 'rgba(59,130,246,0.15)',
              action: handleReportScam,
            },
            {
              icon: ScanLine,
              label: 'Security Scan',
              color: '#a855f7',
              bg: 'rgba(168,85,247,0.08)',
              hoverBg: 'rgba(168,85,247,0.15)',
              action: handleSecurityScan,
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="btn-ripple card-premium flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-xl transition-all cursor-pointer group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{ background: item.bg }}
              >
                <item.icon size={20} style={{ color: item.color }} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors text-center leading-snug">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Weekly Insights ─── */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={14} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">This Week's Summary</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Scams Blocked', value: weeklyStats.totalScams, icon: ShieldOff, color: '#ef4444' },
            { label: 'Calls Screened', value: weeklyStats.totalCalls, icon: PhoneCall, color: '#f59e0b' },
            { label: 'Messages Checked', value: weeklyStats.totalMessages, icon: MessageSquare, color: '#3b82f6' },
            { label: 'Reports Filed', value: weeklyStats.totalReports, icon: FileText, color: '#10b981' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}10` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-100 tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-zinc-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-3">Daily Activity</p>
          <div className="flex items-end gap-2 h-28">
            {WEEKLY_DATA.map((d, i) => {
              const total = d.scams + d.calls + d.messages + d.reports;
              const heightPercent = maxDailyValue > 0 ? (total / maxDailyValue) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-zinc-600 tabular-nums">{total}</span>
                  <div className="w-full flex flex-col gap-0.5" style={{ height: '80px' }}>
                    <div className="flex-1 flex items-end justify-center">
                      <div
                        className="w-full max-w-[28px] rounded-t-md transition-all duration-500 ease-out"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: heightPercent > 0 ? '4px' : '0px',
                          background: `linear-gradient(180deg, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.2) 100%)`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── AI Recommendations ─── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={14} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AI_TIPS.map(tip => (
            <div
              key={tip.id}
              className="glass-panel card-premium rounded-xl p-5 group cursor-default"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 border border-blue-500/10 transition-all group-hover:border-blue-500/20">
                  <tip.icon size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{tip.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
