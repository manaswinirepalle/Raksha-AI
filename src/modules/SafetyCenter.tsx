import { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert, Phone, Plus, Trash2, Check, X,
  ShieldCheck, AlertTriangle, Loader2, RefreshCw, Star, Heart, Siren,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Police', phone: '100', relation: 'Emergency', isPrimary: true },
  { id: '2', name: 'Cyber Crime Helpline', phone: '1930', relation: 'Helpline', isPrimary: true },
  { id: '3', name: 'Women Helpline', phone: '1091', relation: 'Safety', isPrimary: false },
];

const SAFETY_CHECKLIST = [
  { id: '1', label: 'Enable two-factor authentication on all accounts', checked: true },
  { id: '2', label: 'Never share OTPs with anyone', checked: true },
  { id: '3', label: 'Verify sender before clicking links', checked: false },
  { id: '4', label: 'Keep emergency contacts updated', checked: true },
  { id: '5', label: 'Install security updates regularly', checked: false },
  { id: '6', label: 'Use strong, unique passwords', checked: false },
  { id: '7', label: 'Review app permissions monthly', checked: true },
  { id: '8', label: 'Enable transaction alerts on bank accounts', checked: false },
];

export default function SafetyCenter() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [checklist, setChecklist] = useState(SAFETY_CHECKLIST);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [savingContact, setSavingContact] = useState(false);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const safetyScore = useMemo(() => {
    const checked = checklist.filter(c => c.checked).length;
    return Math.round((checked / checklist.length) * 100);
  }, [checklist]);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      addToast('Name and phone number are required', 'error');
      return;
    }
    setSavingContact(true);
    setTimeout(() => {
      setContacts(prev => [...prev, { ...newContact, id: Date.now().toString(), isPrimary: false }]);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowAddForm(false);
      setSavingContact(false);
      addToast(`${newContact.name} added to emergency contacts`, 'success');
    }, 600);
  };

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    addToast(`${contact?.name} removed`, 'info');
  };

  const handleToggleCheck = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleRecalcScore = () => {
    setScoring(true);
    setTimeout(() => {
      setScoring(false);
      addToast(`Your safety score is ${safetyScore}%`, 'success');
    }, 1000);
  };

  const handleTestEmergency = () => {
    addToast('Test notification sent to all emergency contacts', 'info');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
        <AlertTriangle size={40} className="text-rose-400" />
        <p className="text-zinc-400 text-sm">Failed to load Safety Center</p>
        <button onClick={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 800); }}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">Safety Center</h2>
        <button onClick={handleTestEmergency}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer">
          <Siren size={14} /> Test Emergency
        </button>
      </div>

      {/* Safety Score */}
      <div className="glass-panel rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-300">Safety Score</h3>
          <button onClick={handleRecalcScore} disabled={scoring}
            className="btn-ripple flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50">
            {scoring ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Recalculate
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={safetyScore >= 70 ? '#10b981' : safetyScore >= 40 ? '#f59e0b' : '#f43f5e'}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(safetyScore / 100) * 213.6} 213.6`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold" style={{ color: safetyScore >= 70 ? '#10b981' : safetyScore >= 40 ? '#f59e0b' : '#f43f5e' }}>
                {safetyScore}
              </span>
            </div>
          </div>
          <div>
            <p className="text-zinc-200 font-medium text-sm">
              {safetyScore >= 70 ? 'Good' : safetyScore >= 40 ? 'Moderate' : 'Needs Attention'}
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              {checklist.filter(c => c.checked).length} of {checklist.length} safety measures active
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emergency Contacts */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-300">Emergency Contacts</h3>
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="btn-ripple flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              <Plus size={12} /> Add
            </button>
          </div>
          {showAddForm && (
            <div className="mb-4 p-3 rounded-lg space-y-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                placeholder="Contact name" className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30" />
              <input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                placeholder="Phone number" className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30" />
              <input value={newContact.relation} onChange={e => setNewContact(p => ({ ...p, relation: e.target.value }))}
                placeholder="Relation (optional)" className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30" />
              <div className="flex gap-2">
                <button onClick={handleAddContact} disabled={savingContact}
                  className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer disabled:opacity-50">
                  {savingContact ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save
                </button>
                <button onClick={() => setShowAddForm(false)}
                  className="btn-ripple flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {contacts.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: c.isPrimary ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  <Phone size={14} className={c.isPrimary ? 'text-red-400' : 'text-zinc-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200 truncate">{c.name}</span>
                    {c.isPrimary && <Star size={10} className="text-amber-400 flex-shrink-0" fill="currentColor" />}
                  </div>
                  <span className="text-xs text-zinc-500">{c.phone} · {c.relation}</span>
                </div>
                <button onClick={() => handleDeleteContact(c.id)}
                  className="btn-ripple opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Checklist */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Safety Checklist</h3>
          <div className="space-y-2">
            {checklist.map(item => (
              <button key={item.id} onClick={() => handleToggleCheck(item.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors text-left cursor-pointer">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  item.checked ? 'bg-emerald-500/20 border border-emerald-500/30' : 'border border-white/[0.08] hover:border-white/[0.15]'
                }`}>
                  {item.checked && <Check size={11} className="text-emerald-400" />}
                </div>
                <span className={`text-sm transition-colors ${item.checked ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Phone, label: 'Call Police', color: '#ef4444', action: () => addToast('Connecting to emergency services...', 'info') },
            { icon: ShieldAlert, label: 'Block Number', color: '#f59e0b', action: () => addToast('Enter a number to block in Call Protection', 'info') },
            { icon: Heart, label: 'Report Scam', color: '#ec4899', action: () => addToast('Redirecting to Report Fraud page...', 'info') },
            { icon: ShieldCheck, label: 'Security Scan', color: '#10b981', action: () => addToast('Running full device security check...', 'success') },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="btn-ripple flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${item.color}10` }}>
                <item.icon size={18} style={{ color: item.color }} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
