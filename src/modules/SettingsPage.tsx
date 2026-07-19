import { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette,
  Moon, Sun, Monitor, Check, Loader2,
  Trash2, Download, Lock, Eye,
} from 'lucide-react';
import { useToast } from '../components/Toast';

const STORAGE_KEY = 'raksha-settings';

interface SettingsData {
  name: string;
  email: string;
  phone: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  scamAlerts: boolean;
  weeklyReport: boolean;
  marketingEmails: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
  theme: string;
  language: string;
  compactMode: boolean;
  analyticsSharing: boolean;
  crashReports: boolean;
  profileVisibility: string;
}

const DEFAULTS: SettingsData = {
  name: 'Analyst',
  email: 'admin@raksha.ai',
  phone: '+91 98765 43210',
  emailAlerts: true,
  pushAlerts: true,
  scamAlerts: true,
  weeklyReport: true,
  marketingEmails: false,
  twoFactor: true,
  sessionTimeout: '30',
  theme: 'dark',
  language: 'en',
  compactMode: false,
  analyticsSharing: false,
  crashReports: true,
  profileVisibility: 'private',
};

function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function saveSettings(data: SettingsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

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

  const [settings, setSettings] = useState<SettingsData>(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  const update = useCallback(<K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    saveSettings(settings);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      addToast('Preferences saved successfully', 'success');
    }, 300);
  }, [settings, addToast]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raksha-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Settings exported successfully', 'success');
  }, [settings, addToast]);

  const handleDeleteAccount = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings({ ...DEFAULTS });
    addToast('Account data cleared. This action is local only.', 'info');
  }, [addToast]);

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className={`toggle-track ${enabled ? 'active' : ''}`}>
      <div className="toggle-thumb" />
    </button>
  );

  if (loading) {
    return (
      <div className="db-page animate-fade-in">
        <div className="skeleton" style={{ height: 32, width: 128, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 192, borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-zinc-500/10">
            <SettingsIcon size={16} className="text-zinc-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Settings</h2>
            <p className="db-subtitle">{dirty ? 'Unsaved changes' : 'Manage your preferences'}</p>
          </div>
        </div>
        <div className="db-header-actions">
          {dirty && (
            <span className="text-[10px] text-amber-400 mr-2">Modified</span>
          )}
          <button onClick={handleSave} disabled={saving || !dirty}
            className={`db-btn ${dirty ? 'db-btn-primary' : ''}`}>
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save Changes
          </button>
        </div>
      </div>

      <div className="db-grid-1-2">
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

        <div className="db-card mobile-scroll" style={{ maxHeight: 'calc(100dvh - 140px)' }}>
          {activeSection === 'profile' && (
            <div className="db-section">
              <span className="db-section-title"><User size={11} /> Profile Settings</span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold text-zinc-300"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' }}>
                  {settings.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 font-medium">{settings.name}</p>
                  <p className="text-[9px] text-zinc-600">{settings.email}</p>
                </div>
              </div>
              <div className="db-grid-2">
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Full Name</label>
                  <input value={settings.name} onChange={e => update('name', e.target.value)}
                    className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Email</label>
                  <input value={settings.email} onChange={e => update('email', e.target.value)}
                    className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Phone</label>
                  <input value={settings.phone} onChange={e => update('phone', e.target.value)}
                    className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200" />
                </div>
              </div>
              <div className="db-divider" />
              <div className="flex flex-col gap-1.5">
                <button onClick={handleExport}
                  className="db-btn self-start">
                  <Download size={11} /> Export my data
                </button>
                <button onClick={handleDeleteAccount}
                  className="db-btn self-start hover:!text-rose-400">
                  <Trash2 size={11} /> Clear all data
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="db-section">
              <span className="db-section-title"><Bell size={11} /> Notification Preferences</span>
              {[
                { label: 'Email Alerts', desc: 'Receive scam alerts via email', key: 'emailAlerts' as const },
                { label: 'Push Notifications', desc: 'Browser push notifications', key: 'pushAlerts' as const },
                { label: 'Real-time Scam Alerts', desc: 'Immediate alerts for new threats', key: 'scamAlerts' as const },
                { label: 'Weekly Security Report', desc: 'Summary of your weekly activity', key: 'weeklyReport' as const },
                { label: 'Marketing Emails', desc: 'Product updates and tips', key: 'marketingEmails' as const },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <div>
                    <span className="text-[11px] text-zinc-200 block">{item.label}</span>
                    <span className="text-[9px] text-zinc-500">{item.desc}</span>
                  </div>
                  <ToggleSwitch enabled={settings[item.key]} onToggle={() => update(item.key, !settings[item.key])} />
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
                <ToggleSwitch enabled={settings.twoFactor} onToggle={() => {
                  update('twoFactor', !settings.twoFactor);
                  addToast(settings.twoFactor ? '2FA disabled' : '2FA enabled', settings.twoFactor ? 'info' : 'success');
                }} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Session Timeout (minutes)</label>
                <select value={settings.sessionTimeout} onChange={e => update('sessionTimeout', e.target.value)}
                  className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200 appearance-none">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <button onClick={() => addToast('Password change requires email verification. Check your inbox.', 'info')}
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
                    <button key={t.id} onClick={() => { update('theme', t.id); if (t.id !== 'dark') addToast(`${t.label} theme coming soon — dark mode is optimized for safety analysis`, 'info'); }}
                      className={`db-btn flex flex-col items-center gap-1.5 py-2.5 ${
                        settings.theme === t.id ? 'db-btn-primary' : ''
                      }`}>
                      <t.icon size={14} strokeWidth={1.5} />
                      <span className="text-[10px] font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Language</label>
                <select value={settings.language} onChange={e => { update('language', e.target.value); if (e.target.value !== 'en') addToast('Multi-language support coming soon', 'info'); }}
                  className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200 appearance-none">
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
                <ToggleSwitch enabled={settings.compactMode} onToggle={() => { update('compactMode', !settings.compactMode); addToast(!settings.compactMode ? 'Compact mode enabled' : 'Compact mode disabled', 'success'); }} />
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
                <ToggleSwitch enabled={settings.analyticsSharing} onToggle={() => update('analyticsSharing', !settings.analyticsSharing)} />
              </div>
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-[11px] text-zinc-200 block">Crash Reports</span>
                  <span className="text-[9px] text-zinc-500">Automatically send crash reports</span>
                </div>
                <ToggleSwitch enabled={settings.crashReports} onToggle={() => update('crashReports', !settings.crashReports)} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block">Profile Visibility</label>
                <select value={settings.profileVisibility} onChange={e => update('profileVisibility', e.target.value)}
                  className="input-premium w-full px-2.5 py-2 rounded-lg text-[11px] text-zinc-200 appearance-none">
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
