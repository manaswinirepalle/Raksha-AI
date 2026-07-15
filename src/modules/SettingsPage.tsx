import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette,
  Moon, Sun, Monitor, Check, Loader2,
  Trash2, Download, Lock, Eye,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import useViewportAnimation from '../hooks/useViewportAnimation';

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
  const headerVP = useViewportAnimation();
  const contentVP = useViewportAnimation({ threshold: 0.1 });
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
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer ${
        enabled ? 'bg-blue-500/30' : 'bg-white/[0.06]'
      }`}>
      <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all duration-200 ${
        enabled ? 'left-[21px] bg-blue-400' : 'left-0.5 bg-zinc-500'
      }`} style={{ boxShadow: enabled ? '0 0 8px rgba(59,130,246,0.3)' : 'none' }} />
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in" style={{
        opacity: headerVP.isVisible ? 1 : 0,
        transform: headerVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">Settings</h2>
        <button onClick={handleSave} disabled={saving}
          className="btn-ripple flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-52 flex-shrink-0" ref={headerVP.ref} style={{
              opacity: headerVP.isVisible ? 1 : 0,
              transform: headerVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`btn-ripple flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeSection === s.id ? 'bg-blue-500/[0.08] text-blue-400' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}>
                  <Icon size={15} strokeWidth={1.5} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-xl p-5" ref={contentVP.ref} style={{
              opacity: contentVP.isVisible ? 1 : 0,
              transform: contentVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            }}>
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-zinc-300">Profile Settings</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-semibold text-zinc-300"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' }}>
                  {name.charAt(0)}
                </div>
                <div>
                  <button onClick={() => addToast('Photo upload coming soon', 'info')}
                    className="btn-ripple text-sm text-blue-400 hover:text-blue-300 cursor-pointer">Change photo</button>
                  <p className="text-[10px] text-zinc-600 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
                </div>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <button onClick={() => addToast('Preparing your data export...', 'info')}
                  className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <Download size={14} /> Export my data
                </button>
                <button onClick={() => addToast('This action is irreversible. Please contact support.', 'error')}
                  className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer mt-2">
                  <Trash2 size={14} /> Delete account
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-zinc-300">Notification Preferences</h3>
              {[
                { label: 'Email Alerts', desc: 'Receive scam alerts via email', enabled: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
                { label: 'Push Notifications', desc: 'Browser push notifications', enabled: pushAlerts, toggle: () => setPushAlerts(!pushAlerts) },
                { label: 'Real-time Scam Alerts', desc: 'Immediate alerts for new threats', enabled: scamAlerts, toggle: () => setScamAlerts(!scamAlerts) },
                { label: 'Weekly Security Report', desc: 'Summary of your weekly activity', enabled: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) },
                { label: 'Marketing Emails', desc: 'Product updates and tips', enabled: marketingEmails, toggle: () => setMarketingEmails(!marketingEmails) },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-zinc-200 block">{item.label}</span>
                    <span className="text-xs text-zinc-500">{item.desc}</span>
                  </div>
                  <ToggleSwitch enabled={item.enabled} onToggle={item.toggle} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-zinc-300">Security Settings</h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm text-zinc-200 block">Two-Factor Authentication</span>
                  <span className="text-xs text-zinc-500">Add an extra layer of security</span>
                </div>
                <ToggleSwitch enabled={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); addToast(twoFactor ? '2FA disabled' : '2FA enabled', 'info'); }} />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Session Timeout (minutes)</label>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <button onClick={() => addToast('Password change flow coming soon', 'info')}
                className="btn-ripple flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer">
                <Lock size={14} /> Change password
              </button>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-zinc-300">Appearance</h3>
              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)}
                      className={`btn-ripple flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer ${
                        theme === t.id ? 'bg-blue-500/[0.08] border border-blue-500/20 text-blue-400' : 'border border-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                      }`}>
                      <t.icon size={18} strokeWidth={1.5} />
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm text-zinc-200 block">Compact Mode</span>
                  <span className="text-xs text-zinc-500">Reduce spacing and padding</span>
                </div>
                <ToggleSwitch enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-zinc-300">Privacy Settings</h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm text-zinc-200 block">Analytics Sharing</span>
                  <span className="text-xs text-zinc-500">Help improve Raksha AI with anonymized usage data</span>
                </div>
                <ToggleSwitch enabled={analyticsSharing} onToggle={() => setAnalyticsSharing(!analyticsSharing)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm text-zinc-200 block">Crash Reports</span>
                  <span className="text-xs text-zinc-500">Automatically send crash reports</span>
                </div>
                <ToggleSwitch enabled={crashReports} onToggle={() => setCrashReports(!crashReports)} />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Profile Visibility</label>
                <select value={profileVisibility} onChange={e => setProfileVisibility(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
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
