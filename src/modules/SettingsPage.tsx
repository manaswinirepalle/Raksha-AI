import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette,
  Moon, Sun, Monitor, Check, Loader2,
  Trash2, Download, Lock, Eye,
} from 'lucide-react';
import { useToast } from '../components/Toast';


interface SettingSection {
  id: string;
  label: string;
  icon: typeof SettingsIcon;
}

const SECTIONS: SettingSection[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Eye },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('Analyst');
  const [email, setEmail] = useState('admin@raksha.ai');
  const [phone, setPhone] = useState('+91 98765 43210');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [scamAlerts, setScamAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  const [analyticsSharing, setAnalyticsSharing] = useState(false);
  const [crashReports, setCrashReports] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('private');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Your preferences have been updated', 'success');
    }, 800);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
        enabled ? 'bg-blue-500/30' : 'bg-white/[0.06]'
      }`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
        enabled ? 'left-[18px] bg-blue-400' : 'left-0.5 bg-zinc-500'
      }`} style={{ boxShadow: enabled ? '0 0 8px rgba(59,130,246,0.3)' : 'none' }} />
    </button>
  );

  if (loading) {
    return (
      <div className="db-page animate-fade-in">
        <div className="h-8 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-48 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-zinc-500/10">
            <SettingsIcon size={16} className="text-zinc-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Settings</h2>
            <p className="db-subtitle">Manage your preferences</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleSave} disabled={saving}
            className="db-btn db-btn-primary">
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save Changes
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="db-grid-1-2">
        {/* Sidebar */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`db-btn flex items-center gap-2 whitespace-nowrap ${
                  activeSection === s.id ? 'db-btn-primary' : ''
                }`}>
                <Icon size={12} strokeWidth={1.5} /> {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="db-card">
          {activeSection === 'profile' && (
            <div className="db-section">
              <span className="db-section-title"><User size={11} /> Profile Settings</span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold text-zinc-300"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' }}>
                  {name.charAt(0)}
                </div>
                <div>
                  <button onClick={() => addToast('Photo upload coming soon', 'info')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer">Change photo</button>
                  <p className="text-[9px] text-zinc-600">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="db-grid-2">
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
              </div>
              <div className="db-divider" />
              <div className="flex flex-col gap-1.5">
                <button onClick={() => addToast('Preparing your data export...', 'info')}
                  className="db-btn self-start">
                  <Download size={11} /> Export my data
                </button>
                <button onClick={() => addToast('This action is irreversible. Please contact support.', 'error')}
                  className="db-btn self-start hover:!text-rose-400">
                  <Trash2 size={11} /> Delete account
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="db-section">
              <span className="db-section-title"><Bell size={11} /> Notification Preferences</span>
              {[
                { label: 'Email Alerts', desc: 'Receive scam alerts via email', enabled: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
                { label: 'Push Notifications', desc: 'Browser push notifications', enabled: pushAlerts, toggle: () => setPushAlerts(!pushAlerts) },
                { label: 'Real-time Scam Alerts', desc: 'Immediate alerts for new threats', enabled: scamAlerts, toggle: () => setScamAlerts(!scamAlerts) },
                { label: 'Weekly Security Report', desc: 'Summary of your weekly activity', enabled: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) },
                { label: 'Marketing Emails', desc: 'Product updates and tips', enabled: marketingEmails, toggle: () => setMarketingEmails(!marketingEmails) },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <div>
                    <span className="text-[11px] text-zinc-200 block">{item.label}</span>
                    <span className="text-[9px] text-zinc-500">{item.desc}</span>
                  </div>
                  <ToggleSwitch enabled={item.enabled} onToggle={item.toggle} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="db-section">
              <span className="db-section-title"><Shield size={11} /> Security Settings</span>
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-[11px] text-zinc-200 block">Two-Factor Authentication</span>
                  <span className="text-[9px] text-zinc-500">Add an extra layer of security</span>
                </div>
                <ToggleSwitch enabled={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); addToast(twoFactor ? '2FA disabled' : '2FA enabled', 'info'); }} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Session Timeout (minutes)</label>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <button onClick={() => addToast('Password change flow coming soon', 'info')}
                className="db-btn self-start">
                <Lock size={11} /> Change password
              </button>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="db-section">
              <span className="db-section-title"><Palette size={11} /> Appearance</span>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1.5 block">Theme</label>
                <div className="db-grid-3">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)}
                      className={`db-btn flex flex-col items-center gap-1.5 py-2.5 ${
                        theme === t.id ? 'db-btn-primary' : ''
                      }`}>
                      <t.icon size={14} strokeWidth={1.5} />
                      <span className="text-[10px] font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-[11px] text-zinc-200 block">Compact Mode</span>
                  <span className="text-[9px] text-zinc-500">Reduce spacing and padding</span>
                </div>
                <ToggleSwitch enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="db-section">
              <span className="db-section-title"><Eye size={11} /> Privacy Settings</span>
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-[11px] text-zinc-200 block">Analytics Sharing</span>
                  <span className="text-[9px] text-zinc-500">Help improve Raksha AI with anonymized usage data</span>
                </div>
                <ToggleSwitch enabled={analyticsSharing} onToggle={() => setAnalyticsSharing(!analyticsSharing)} />
              </div>
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-[11px] text-zinc-200 block">Crash Reports</span>
                  <span className="text-[9px] text-zinc-500">Automatically send crash reports</span>
                </div>
                <ToggleSwitch enabled={crashReports} onToggle={() => setCrashReports(!crashReports)} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Profile Visibility</label>
                <select value={profileVisibility} onChange={e => setProfileVisibility(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
