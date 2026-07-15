import { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Shield, AlertTriangle, CheckCircle2, XCircle,
  RefreshCw, Loader2, Lock, Eye, Fingerprint, Wifi, Key,
  Mail, Globe,
} from 'lucide-react';
import { useToast } from '../components/Toast';


interface SecurityCheck {
  id: string;
  category: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'info';
  description: string;
  icon: typeof Shield;
  color: string;
}

const CHECKS: SecurityCheck[] = [
  { id: '1', category: 'Authentication', name: 'Two-Factor Authentication', status: 'passed', description: '2FA is enabled on your primary account', icon: Key, color: '#10b981' },
  { id: '2', category: 'Authentication', name: 'Password Strength', status: 'passed', description: 'Your password meets security requirements', icon: Lock, color: '#10b981' },
  { id: '3', category: 'Privacy', name: 'Data Sharing Settings', status: 'warning', description: 'Analytics sharing is enabled. Consider disabling for maximum privacy.', icon: Eye, color: '#f59e0b' },
  { id: '4', category: 'Privacy', name: 'Profile Visibility', status: 'passed', description: 'Your profile is set to private', icon: Shield, color: '#10b981' },
  { id: '5', category: 'Device', name: 'Device Security', status: 'passed', description: 'No rooted/jailbroken device detected', icon: Fingerprint, color: '#10b981' },
  { id: '6', category: 'Device', name: 'Network Security', status: 'warning', description: 'Connected to an open WiFi network. Use a VPN for sensitive transactions.', icon: Wifi, color: '#f59e0b' },
  { id: '7', category: 'Protection', name: 'Scam Call Blocking', status: 'passed', description: 'Active protection against known scam numbers', icon: ShieldCheck, color: '#10b981' },
  { id: '8', category: 'Protection', name: 'Phishing URL Filter', status: 'passed', description: 'Browser extension active — blocking known phishing sites', icon: Globe, color: '#10b981' },
  { id: '9', category: 'Protection', name: 'Email Spam Protection', status: 'failed', description: 'Email scanning is not configured. Set up to protect against phishing emails.', icon: Mail, color: '#ef4444' },
];

export default function SecurityOverview() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState(CHECKS);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const score = useMemo(() => {
    const passed = checks.filter(c => c.status === 'passed').length;
    return Math.round((passed / checks.length) * 100);
  }, [checks]);

  const categories = useMemo(() => {
    const cats = [...new Set(checks.map(c => c.category))];
    return cats.map(cat => ({
      name: cat,
      checks: checks.filter(c => c.category === cat),
      passed: checks.filter(c => c.category === cat && c.status === 'passed').length,
      total: checks.filter(c => c.category === cat).length,
    }));
  }, [checks]);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      addToast(`Security scan complete. Score: ${score}/100 — ${checks.filter(c => c.status === 'passed').length}/${checks.length} checks passed`, 'success');
    }, 2000);
  };

  const handleFix = (check: SecurityCheck) => {
    if (check.status === 'passed') return;
    addToast(`Configuring ${check.name}...`, 'info');
    setTimeout(() => {
      setChecks(prev => prev.map(c => c.id === check.id ? { ...c, status: 'passed' as const, description: check.status === 'failed' ? 'Now configured and active' : 'Optimized for maximum security' } : c));
      addToast(`${check.name} is now secured`, 'success');
    }, 1000);
  };

  if (loading) {
    return (
    <div className="db-page animate-fade-in">
        <div className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-emerald-500/10">
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Security Overview</h2>
            <p className="db-subtitle">{checks.filter(c => c.status === 'passed').length}/{checks.length} checks passed</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleScan} disabled={scanning} className="db-btn">
            {scanning ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Full Scan
          </button>
        </div>
      </div>

      {/* Score + Summary */}
      <div className="db-grid-2-1">
        <div className="db-card flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
              <circle cx="48" cy="48" r="40" fill="none"
                stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 251.3} 251.3`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>{score}</span>
              <span className="text-[8px] text-zinc-500">/ 100</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {score >= 80 ? 'Excellent Security' : score >= 50 ? 'Good — Room to Improve' : 'Action Needed'}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {checks.filter(c => c.status === 'failed').length} issues need attention, {checks.filter(c => c.status === 'warning').length} warnings
            </p>
          </div>
        </div>
        <div className="db-card">
          <div className="db-section">
            <span className="db-section-title text-[10px]">Category Summary</span>
            <div className="space-y-1.5">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{cat.name}</span>
                  <span className="text-[9px] font-mono text-zinc-500">{cat.passed}/{cat.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.name} className="db-card">
            <div className="db-card-header">
              <span className="db-card-title">{cat.name}</span>
              <span className="text-[9px] text-zinc-500">{cat.passed}/{cat.total} passed</span>
            </div>
            <div className="space-y-1.5">
              {cat.checks.map(check => {
                const StatusIcon = check.status === 'passed' ? CheckCircle2 : check.status === 'warning' ? AlertTriangle : XCircle;
                return (
                  <div key={check.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: `${check.color}10` }}>
                      <StatusIcon size={11} style={{ color: check.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-medium text-zinc-200 block">{check.name}</span>
                      <span className="text-[9px] text-zinc-500 block">{check.description}</span>
                    </div>
                    {check.status !== 'passed' && (
                      <button onClick={() => handleFix(check)}
                        className="db-btn flex-shrink-0">
                        Fix
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
