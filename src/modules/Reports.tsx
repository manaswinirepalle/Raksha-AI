import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Loader2, Trash2, CheckCircle2, Clock,
  AlertTriangle, Share2, Search, ChevronDown, ShieldAlert,
  Bug, Radio, Calendar, ArrowUpDown, X,
} from 'lucide-react';
import type { RiskLevel } from '../types';
import { useToast } from '../components/Toast';

interface ReportItem {
  id: string;
  title: string;
  type: string;
  date: string;
  timestamp: number;
  status: 'completed' | 'processing' | 'failed';
  riskLevel: RiskLevel;
  size: string;
  summary: string;
}

const NOW = Date.now();
const DAY = 86400000;

const MOCK_REPORTS: ReportItem[] = [
  { id: 'RPT-001', title: 'Digital Arrest Scam Analysis — Case #4521', type: 'Scam Analysis', date: '2026-07-16', timestamp: NOW - 1 * DAY, status: 'completed', riskLevel: 'CRITICAL', size: '2.4 MB', summary: 'Deep-dive into digital arrest impersonation scam targeting senior citizens in Delhi NCR region' },
  { id: 'RPT-002', title: 'UPI Fraud Network Mapping — May-July 2026', type: 'Fraud Report', date: '2026-07-15', timestamp: NOW - 2 * DAY, status: 'completed', riskLevel: 'HIGH', size: '3.1 MB', summary: 'Cross-referenced UPI fraud cases across 4 states identifying 12 connected mule accounts' },
  { id: 'RPT-003', title: 'Weekly Threat Intelligence Brief — W28', type: 'Threat Intel', date: '2026-07-14', timestamp: NOW - 3 * DAY, status: 'completed', riskLevel: 'MEDIUM', size: '1.8 MB', summary: 'Aggregated threat intelligence covering phishing domains, scam call patterns, and emerging fraud vectors' },
  { id: 'RPT-004', title: 'QR Code Phishing Campaign — Karnataka Hotspot', type: 'Scam Analysis', date: '2026-07-13', timestamp: NOW - 4 * DAY, status: 'completed', riskLevel: 'HIGH', size: '2.0 MB', summary: 'Analysis of 340+ QR code phishing incidents across Bengaluru and Mysuru commercial districts' },
  { id: 'RPT-005', title: 'Monthly Security Posture Review — June 2026', type: 'Fraud Report', date: '2026-07-12', timestamp: NOW - 5 * DAY, status: 'processing', riskLevel: 'LOW', size: '—', summary: 'Compiling monthly security posture data across all monitored accounts and devices' },
  { id: 'RPT-006', title: 'AI Voice Cloning Threat Assessment', type: 'Threat Intel', date: '2026-07-11', timestamp: NOW - 6 * DAY, status: 'completed', riskLevel: 'CRITICAL', size: '4.2 MB', summary: 'Comprehensive assessment of AI-generated voice cloning attacks targeting banking customers' },
  { id: 'RPT-007', title: 'OTP Phishing SMS Pattern Analysis', type: 'Scam Analysis', date: '2026-07-10', timestamp: NOW - 7 * DAY, status: 'completed', riskLevel: 'HIGH', size: '1.5 MB', summary: 'Pattern recognition analysis of 2,800+ phishing SMS messages attempting OTP interception' },
  { id: 'RPT-008', title: 'Investment Fraud Network — Telegram Groups', type: 'Fraud Report', date: '2026-07-09', timestamp: NOW - 8 * DAY, status: 'failed', riskLevel: 'CRITICAL', size: '—', summary: 'Report generation failed — external data source for Telegram group metadata timed out' },
  { id: 'RPT-009', title: 'Regional Crime Heatmap — Western India', type: 'Threat Intel', date: '2026-07-08', timestamp: NOW - 9 * DAY, status: 'completed', riskLevel: 'MEDIUM', size: '5.7 MB', summary: 'Geospatial crime density visualization covering Maharashtra, Gujarat, and Rajasthan cybercrime data' },
  { id: 'RPT-010', title: 'KYC Fraud Escalation Report — Q2 2026', type: 'Fraud Report', date: '2026-07-07', timestamp: NOW - 10 * DAY, status: 'completed', riskLevel: 'HIGH', size: '2.8 MB', summary: 'Quarterly escalation analysis of KYC-related fraud attempts with victim behavior profiling' },
  { id: 'RPT-011', title: 'WhatsApp Group Scam Propagation Study', type: 'Scam Analysis', date: '2026-07-06', timestamp: NOW - 11 * DAY, status: 'processing', riskLevel: 'MEDIUM', size: '—', summary: 'Tracking viral scam message propagation patterns across 450+ WhatsApp groups' },
  { id: 'RPT-012', title: 'Emergency Cyber Alert — SIM Swap Surge', type: 'Threat Intel', date: '2026-07-05', timestamp: NOW - 12 * DAY, status: 'completed', riskLevel: 'CRITICAL', size: '1.1 MB', summary: 'Urgent intelligence brief on 40% spike in SIM swap attacks targeting mobile banking users' },
  { id: 'RPT-013', title: 'Phishing Domain Takedown Report', type: 'Fraud Report', date: '2026-07-04', timestamp: NOW - 13 * DAY, status: 'completed', riskLevel: 'MEDIUM', size: '890 KB', summary: 'Documentation of 67 phishing domains identified and reported for takedown in cooperation with CERT-In' },
  { id: 'RPT-014', title: 'Deepfake Video Scam Detection — Pilot Results', type: 'Scam Analysis', date: '2026-07-03', timestamp: NOW - 14 * DAY, status: 'failed', riskLevel: 'HIGH', size: '—', summary: 'Report generation failed — video processing pipeline encountered insufficient source material' },
];

const REPORT_TYPES = ['All', 'Scam Analysis', 'Fraud Report', 'Threat Intel'];
const STATUS_OPTIONS = ['All', 'Completed', 'Processing', 'Failed'];
const SORT_OPTIONS = ['Newest', 'Oldest', 'Risk Level'];

const STATUS_CONFIG = {
  completed: { color: '#10b981', icon: CheckCircle2, label: 'Completed' },
  processing: { color: '#f59e0b', icon: Clock, label: 'Processing' },
  failed: { color: '#ef4444', icon: AlertTriangle, label: 'Failed' },
} as const;

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string }> = {
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  HIGH: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  LOW: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: typeof FileText }> = {
  'Scam Analysis': { color: '#f97316', bg: 'rgba(249,115,22,0.08)', icon: Bug },
  'Fraud Report': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: ShieldAlert },
  'Threat Intel': { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: Radio },
};

const ITEMS_PER_PAGE = 6;

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7) return `${diffD} days ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const RISK_ORDER: Record<RiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function Reports() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => ({
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    processing: reports.filter(r => r.status === 'processing').length,
    failed: reports.filter(r => r.status === 'failed').length,
  }), [reports]);

  const filtered = useMemo(() => {
    let result = [...reports];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      const s = statusFilter.toLowerCase() as ReportItem['status'];
      result = result.filter(r => r.status === s);
    }

    if (typeFilter !== 'All') {
      result = result.filter(r => r.type === typeFilter);
    }

    if (sortBy === 'Newest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'Oldest') {
      result.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortBy === 'Risk Level') {
      result.sort((a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]);
    }

    return result;
  }, [reports, search, statusFilter, typeFilter, sortBy]);

  const visibleReports = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const handleDownload = (report: ReportItem) => {
    if (report.status !== 'completed') {
      addToast('Report is not ready for download yet', 'error');
      return;
    }
    addToast(`Downloading ${report.title} (${report.size})`, 'success');
  };

  const handleShare = (report: ReportItem) => {
    const text = `${report.title}\n${report.summary}\nRisk: ${report.riskLevel} | Status: ${STATUS_CONFIG[report.status].label}`;
    navigator.clipboard?.writeText(text);
    addToast('Report details copied to clipboard', 'success');
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setDeletingId(null);
    addToast('Report has been permanently deleted', 'info');
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `RPT-${Date.now().toString(36).toUpperCase().slice(0, 4)}`,
        title: 'On-Demand Security Scan — ' + new Date().toLocaleDateString('en-IN'),
        type: 'Scam Analysis',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        status: 'completed',
        riskLevel: 'MEDIUM',
        size: '1.3 MB',
        summary: 'Custom security scan generated on demand — reviewing recent activity for anomalies',
      };
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
      addToast('Your report is ready for download', 'success');
    }, 2000);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setSortBy('Newest');
  };

  const activeFilterCount = (statusFilter !== 'All' ? 1 : 0) + (typeFilter !== 'All' ? 1 : 0) + (sortBy !== 'Newest' ? 1 : 0);

  if (loading) {
    return (
      <div className="db-page animate-fade-in">
        <div className="db-header">
          <div className="db-header-left">
            <div className="h-8 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="h-4 w-20 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        </div>
        <div className="db-stats">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
        <div className="h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-blue-500/10">
            <FileText size={16} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Reports</h2>
            <p className="db-subtitle">{reports.length} reports available</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleGenerate} disabled={generating} className="db-btn db-btn-primary">
            {generating ? <Loader2 size={11} className="animate-spin" /> : <FileText size={11} />}
            Generate
          </button>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <FileText size={14} className="text-blue-400" />
          </div>
          <div>
            <div className="db-stat-value">{stats.total}</div>
            <div className="db-stat-label">Total Reports</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div>
            <div className="db-stat-value">{stats.completed}</div>
            <div className="db-stat-label">Completed</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Clock size={14} className="text-amber-400" />
          </div>
          <div>
            <div className="db-stat-value">{stats.processing}</div>
            <div className="db-stat-label">Processing</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <div>
            <div className="db-stat-value">{stats.failed}</div>
            <div className="db-stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="glass-panel-strong" style={{ padding: '10px 12px', borderRadius: 14 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <div style={{
            flex: '1 1 200px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <Search size={13} className="text-zinc-500" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reports..."
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e4e4e7',
                fontSize: 11,
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
                <X size={12} className="text-zinc-500 hover:text-zinc-300" />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {REPORT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`db-btn flex-shrink-0 ${typeFilter === t ? 'db-btn-primary' : ''}`}
                style={{ fontSize: 10, padding: '5px 10px' }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="db-btn flex-shrink-0"
            style={{
              fontSize: 10,
              padding: '5px 10px',
              position: 'relative',
            }}
          >
            <ArrowUpDown size={11} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#3b82f6',
                color: '#fff',
                fontSize: 8,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#71717a' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#d4d4d8',
                  fontSize: 10,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#71717a' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#d4d4d8',
                  fontSize: 10,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={handleResetFilters} className="db-btn" style={{ fontSize: 10, padding: '4px 10px' }}>
                <X size={10} />
                Clear
              </button>
            )}
            <span style={{ fontSize: 10, color: '#52525b', marginLeft: 'auto' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="db-section">
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '48px 24px',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Search size={20} className="text-zinc-600" />
            </div>
            <p style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 500 }}>No reports found</p>
            <p style={{ fontSize: 11, color: '#52525b', textAlign: 'center', maxWidth: 280 }}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button onClick={handleResetFilters} className="db-btn" style={{ marginTop: 4 }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visibleReports.map(report => {
                const st = STATUS_CONFIG[report.status];
                const risk = RISK_CONFIG[report.riskLevel];
                const tc = TYPE_CONFIG[report.type] || TYPE_CONFIG['Scam Analysis'];
                const isDeleting = deletingId === report.id;

                return (
                  <div key={report.id} className="db-card card-hover" style={{ position: 'relative' }}>
                    <div className="flex items-start gap-3">
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: tc.bg,
                        border: `1px solid ${tc.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <tc.icon size={15} style={{ color: tc.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7' }}>
                            {report.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 6 }}>
                          <span style={{
                            fontSize: 8,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: `${st.color}12`,
                            color: st.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            letterSpacing: '0.02em',
                          }}>
                            <span style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: st.color,
                              display: 'inline-block',
                              ...(report.status === 'processing' ? { animation: 'pulse 2s ease-in-out infinite' } : {}),
                            }} />
                            {st.label}
                          </span>
                          <span style={{
                            fontSize: 8,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: risk.bg,
                            color: risk.color,
                            letterSpacing: '0.02em',
                          }}>
                            {report.riskLevel}
                          </span>
                          <span style={{
                            fontSize: 8,
                            fontWeight: 500,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: tc.bg,
                            color: tc.color,
                            letterSpacing: '0.02em',
                          }}>
                            {report.type}
                          </span>
                        </div>

                        <p style={{ fontSize: 10, color: '#71717a', lineHeight: 1.5, marginBottom: 6 }}>
                          {report.summary}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span style={{ fontSize: 9, color: '#52525b', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={9} />
                            {formatDate(report.timestamp)}
                          </span>
                          <span style={{ fontSize: 9, color: '#52525b' }}>
                            {report.id}
                          </span>
                          {report.size !== '—' && (
                            <span style={{ fontSize: 9, color: '#52525b' }}>
                              {report.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0" style={{ marginTop: 2 }}>
                        {!isDeleting ? (
                          <>
                            <button
                              onClick={() => handleDownload(report)}
                              className="db-btn"
                              style={{ padding: 5 }}
                              title="Download"
                            >
                              <Download size={11} />
                            </button>
                            <button
                              onClick={() => handleShare(report)}
                              className="db-btn"
                              style={{ padding: 5 }}
                              title="Share"
                            >
                              <Share2 size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(report.id)}
                              className="db-btn"
                              style={{ padding: 5 }}
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </>
                        ) : (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px',
                            borderRadius: 10,
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)',
                          }}>
                            <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 500 }}>Delete?</span>
                            <button
                              onClick={() => handleDeleteConfirm(report.id)}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 6,
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                fontSize: 9,
                                fontWeight: 600,
                                cursor: 'pointer',
                                lineHeight: 1.4,
                              }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={handleDeleteCancel}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 6,
                                background: 'rgba(255,255,255,0.06)',
                                color: '#a1a1aa',
                                border: 'none',
                                fontSize: 9,
                                fontWeight: 500,
                                cursor: 'pointer',
                                lineHeight: 1.4,
                              }}
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="db-btn"
                  style={{ padding: '6px 20px' }}
                >
                  <ChevronDown size={12} />
                  Show More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
