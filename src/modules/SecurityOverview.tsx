import { useState, useEffect, useCallback } from 'react';
import type { RiskLevel } from '../types';
import {
  ShieldCheck, Shield,
  Key, Fingerprint, Eye,
  CheckCircle2, AlertTriangle, XCircle,
  Brain, RefreshCw, Loader2, ChevronRight,
  Settings, WifiOff, Target,
  Bell,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface SecurityItem {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
}

interface Category {
  id: string;
  name: string;
  icon: typeof Shield;
  color: string;
  score: number;
  items: SecurityItem[];
}

interface Recommendation {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
  severity: RiskLevel;
  action: string;
  category: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'auth',
    name: 'Authentication',
    icon: Key,
    color: '#3b82f6',
    score: 85,
    items: [
      { name: 'Two-Factor Authentication', status: 'passed', detail: 'Enabled via authenticator app on primary account' },
      { name: 'Password Strength', status: 'passed', detail: 'All passwords meet complexity requirements' },
      { name: 'Biometric Login', status: 'passed', detail: 'Fingerprint and face recognition configured' },
      { name: 'Session Timeout', status: 'warning', detail: 'Auto-logout set to 30 min — reduce to 15 min' },
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy',
    icon: Eye,
    color: '#8b5cf6',
    score: 62,
    items: [
      { name: 'VPN Status', status: 'failed', detail: 'VPN is not active — enable for network protection' },
      { name: 'Data Sharing', status: 'warning', detail: 'Analytics sharing is enabled — disable for max privacy' },
      { name: 'Location Tracking', status: 'passed', detail: 'Location access restricted to active use only' },
      { name: 'Ad Tracking', status: 'warning', detail: 'Personalized ad tracking is currently active' },
    ],
  },
  {
    id: 'device',
    name: 'Device',
    icon: Fingerprint,
    color: '#10b981',
    score: 90,
    items: [
      { name: 'OS Updates', status: 'passed', detail: 'System fully updated to latest stable release' },
      { name: 'Firewall', status: 'passed', detail: 'Firewall active with default deny policy' },
      { name: 'Antivirus', status: 'passed', detail: 'Real-time scanning enabled — last scan 2h ago' },
      { name: 'Encryption', status: 'passed', detail: 'Full disk encryption active — AES-256' },
    ],
  },
  {
    id: 'protection',
    name: 'Protection',
    icon: Shield,
    color: '#f59e0b',
    score: 75,
    items: [
      { name: 'Scam Awareness', status: 'passed', detail: 'Completed all awareness modules this quarter' },
      { name: 'Reporting History', status: 'passed', detail: '3 scam reports filed — all processed successfully' },
      { name: 'Alert Subscriptions', status: 'warning', detail: 'SMS alerts enabled but push notifications are off' },
      { name: 'Emergency Contacts', status: 'passed', detail: '4 emergency contacts registered and verified' },
    ],
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    icon: WifiOff,
    title: 'Enable VPN Protection',
    description: 'Your VPN is inactive. Activate it to encrypt network traffic and shield your data on public Wi-Fi.',
    severity: 'HIGH',
    action: 'Enable VPN',
    category: 'privacy',
  },
  {
    id: '2',
    icon: Settings,
    title: 'Review Data Sharing',
    description: 'Analytics data sharing is active. Disable it to prevent third-party collection of your usage data.',
    severity: 'MEDIUM',
    action: 'Review Settings',
    category: 'privacy',
  },
  {
    id: '3',
    icon: Target,
    title: 'Turn Off Ad Tracking',
    description: 'Personalized advertising tracking is on. Disable it to stop advertisers from profiling your activity.',
    severity: 'MEDIUM',
    action: 'Disable',
    category: 'privacy',
  },
  {
    id: '4',
    icon: Bell,
    title: 'Enable Push Alerts',
    description: 'Push notifications for security alerts are off. Enable them to receive real-time threat notifications.',
    severity: 'LOW',
    action: 'Enable',
    category: 'protection',
  },
];

const OVERALL_SCORE = 78;

export default function SecurityOverview() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('auth');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    let frameId: number;
    const startTime = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * OVERALL_SCORE));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [loading]);

  const handleScan = useCallback(() => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      addToast(`Security scan complete. Score: ${OVERALL_SCORE}/100 — 12/16 checks passed`, 'success');
    }, 2200);
  }, [addToast]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  const totalPassed = CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.status === 'passed').length,
    0,
  );
  const totalWarnings = CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.status === 'warning').length,
    0,
  );
  const totalFailed = CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.status === 'failed').length,
    0,
  );
  const totalItems = totalPassed + totalWarnings + totalFailed;

  const mainRadius = 58;
  const mainCircumference = 2 * Math.PI * mainRadius;
  const mainOffset = mainCircumference - (animatedScore / 100) * mainCircumference;
  const scoreColor = OVERALL_SCORE >= 80 ? '#10b981' : OVERALL_SCORE >= 60 ? '#f59e0b' : '#ef4444';

  const miniRadius = 36;
  const miniCircumference = 2 * Math.PI * miniRadius;

  if (loading) {
    return (
      <div className="db-page animate-fade-in">
        <div className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="h-48 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-blue-500/10">
            <ShieldCheck size={16} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Security Overview</h2>
            <p className="db-subtitle">
              {totalPassed}/{totalItems} checks passed — {totalFailed} issues need attention
            </p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleScan} disabled={scanning} className="db-btn">
            {scanning ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Full Scan
          </button>
        </div>
      </div>

      <div className="db-card glass-panel-strong" style={{ padding: 24 }}>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="80"
                cy="80"
                r={mainRadius}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={mainRadius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={mainCircumference}
                strokeDashoffset={mainOffset}
                filter="url(#glow)"
                style={{
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: scoreColor,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {animatedScore}
              </span>
              <span style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>/ 100</span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fafafa', margin: 0 }}>
              {OVERALL_SCORE >= 80
                ? 'Excellent Security'
                : OVERALL_SCORE >= 60
                  ? 'Good — Room to Improve'
                  : 'Action Needed'}
            </h3>
            <p
              style={{
                fontSize: 12,
                color: '#71717a',
                margin: '6px 0 0',
                lineHeight: 1.6,
                maxWidth: 380,
              }}
            >
              Your overall security posture is strong. Review the recommendations below to
              reach optimal protection across all categories.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={11} style={{ color: '#10b981' }} />
                <span style={{ color: '#10b981', fontWeight: 600 }}>{totalPassed}</span> passed
              </div>
              <div style={{ fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={11} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>{totalWarnings}</span> warnings
              </div>
              <div style={{ fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 4 }}>
                <XCircle size={11} style={{ color: '#ef4444' }} />
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{totalFailed}</span> failed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="db-stats">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`db-stat card-hover ${activeTab === cat.id ? 'glow-border' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab(cat.id)}
          >
            <div className="db-stat-icon" style={{ background: `${cat.color}15` }}>
              <cat.icon size={14} style={{ color: cat.color }} />
            </div>
            <div>
              <div className="db-stat-value" style={{ color: cat.color }}>
                {cat.score}%
              </div>
              <div className="db-stat-label">{cat.name}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title">
            <Shield size={12} /> Categories
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {CATEGORIES.map((cat) => {
            const passed = cat.items.filter((i) => i.status === 'passed').length;
            return (
              <button
                key={cat.id}
                className={`db-btn ${activeTab === cat.id ? 'db-btn-primary' : ''}`}
                onClick={() => setActiveTab(cat.id)}
                style={{ whiteSpace: 'nowrap' }}
              >
                <cat.icon size={11} />
                {cat.name}
                <span
                  style={{
                    fontSize: 9,
                    opacity: 0.7,
                    marginLeft: 2,
                  }}
                >
                  {passed}/{cat.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="db-grid-2">
        <div
          className="db-card glass-panel-strong card-hover"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '28px 20px',
          }}
        >
          <div style={{ position: 'relative', width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="55"
                cy="55"
                r={miniRadius}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="7"
              />
              <circle
                cx="55"
                cy="55"
                r={miniRadius}
                fill="none"
                stroke={activeCategory.color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={miniCircumference}
                strokeDashoffset={miniCircumference * (1 - activeCategory.score / 100)}
                style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, color: activeCategory.color, lineHeight: 1 }}>
                {activeCategory.score}
              </span>
              <span style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>/ 100</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa' }}>{activeCategory.name}</div>
            <div style={{ fontSize: 11, color: '#71717a', marginTop: 3 }}>
              {activeCategory.items.filter((i) => i.status === 'passed').length}/
              {activeCategory.items.length} checks passed
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#a1a1aa' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              Passed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#a1a1aa' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
              Warning
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#a1a1aa' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              Failed
            </div>
          </div>
        </div>

        <div className="db-card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="db-card-header" style={{ marginBottom: 0, padding: '14px 14px 10px' }}>
            <span className="db-card-title">{activeCategory.name} Checks</span>
            <span style={{ fontSize: 9, color: '#71717a' }}>
              {activeCategory.items.filter((i) => i.status === 'passed').length}/{activeCategory.items.length}
            </span>
          </div>
          <div className="db-divider" />
          {activeCategory.items.map((item, i) => {
            const isLast = i === activeCategory.items.length - 1;
            return (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '12px 14px',
                  borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 200ms ease',
                }}
                className="hover:bg-white/[0.02]"
              >
                {item.status === 'passed' ? (
                  <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                ) : item.status === 'warning' ? (
                  <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                ) : (
                  <XCircle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#d4d4d8', lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#71717a', lineHeight: 1.4, marginTop: 2 }}>
                    {item.detail}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: 6,
                    flexShrink: 0,
                    background:
                      item.status === 'passed'
                        ? 'rgba(16,185,129,0.1)'
                        : item.status === 'warning'
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(239,68,68,0.1)',
                    color:
                      item.status === 'passed'
                        ? '#10b981'
                        : item.status === 'warning'
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                >
                  {item.status === 'passed' ? 'Secure' : item.status === 'warning' ? 'Warning' : 'At Risk'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title">
            <Brain size={12} /> Security Recommendations
          </span>
          <span style={{ fontSize: 10, color: '#71717a' }}>
            {RECOMMENDATIONS.length} actionable items
          </span>
        </div>
        <div className="db-grid-2">
          {RECOMMENDATIONS.map((rec) => {
            const accent =
              rec.severity === 'HIGH'
                ? '#ef4444'
                : rec.severity === 'MEDIUM'
                  ? '#f59e0b'
                  : '#3b82f6';
            const severityLabel =
              rec.severity === 'HIGH' ? 'High' : rec.severity === 'MEDIUM' ? 'Medium' : 'Low';
            return (
              <div
                key={rec.id}
                className="db-card card-hover glass-panel"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: `${accent}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <rec.icon size={15} style={{ color: accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
                        {rec.title}
                      </span>
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: `${accent}15`,
                          color: accent,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {severityLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#71717a', lineHeight: 1.5 }}>
                      {rec.description}
                    </div>
                  </div>
                  <button
                    className="db-btn"
                    style={{ flexShrink: 0, fontSize: 10, padding: '5px 10px', gap: 4 }}
                  >
                    {rec.action}
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
