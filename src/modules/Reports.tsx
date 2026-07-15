import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Loader2,
  Trash2, CheckCircle2, Clock, AlertTriangle, Share2,
  Plus,
} from 'lucide-react';
import { useToast } from '../components/Toast';


interface ReportItem {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  size: string;
  summary: string;
}

const REPORTS: ReportItem[] = [
  { id: 'RPT-001', title: 'Monthly Security Summary — June 2026', type: 'Security', date: '2026-07-01', status: 'completed', size: '2.4 MB', summary: '127 scans, 23 threats blocked, safety score 91/100' },
  { id: 'RPT-002', title: 'Scam Analysis — UPI Fraud Wave', type: 'Analysis', date: '2026-06-28', status: 'completed', size: '1.8 MB', summary: 'Deep analysis of the recent UPI payment request scam campaign' },
  { id: 'RPT-003', title: 'Weekly Activity Report', type: 'Activity', date: '2026-06-25', status: 'completed', size: '890 KB', summary: '45 messages scanned, 8 calls analyzed, 3 numbers blocked' },
  { id: 'RPT-004', title: 'Threat Intelligence Brief', type: 'Intelligence', date: '2026-06-22', status: 'completed', size: '3.1 MB', summary: 'New AI voice cloning scam techniques identified in 3 states' },
  { id: 'RPT-005', title: 'Regional Crime Heatmap Report', type: 'Geospatial', date: '2026-06-20', status: 'processing', size: '—', summary: 'Generating crime density visualization for your region...' },
  { id: 'RPT-006', title: 'Compliance Audit — Data Protection', type: 'Compliance', date: '2026-06-15', status: 'failed', size: '—', summary: 'Report generation failed due to data source unavailability' },
];

const TYPES = ['All', 'Security', 'Analysis', 'Activity', 'Intelligence', 'Geospatial', 'Compliance'];
const STATUS_MAP = { completed: { color: '#10b981', icon: CheckCircle2, label: 'Completed' }, processing: { color: '#f59e0b', icon: Clock, label: 'Processing' }, failed: { color: '#ef4444', icon: AlertTriangle, label: 'Failed' } };

export default function Reports() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(REPORTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (typeFilter === 'All') return reports;
    return reports.filter(r => r.type === typeFilter);
  }, [reports, typeFilter]);

  const handleDownload = (report: ReportItem) => {
    if (report.status !== 'completed') {
      addToast('Report is not ready yet', 'error');
      return;
    }
    addToast(`Downloading ${report.title} (${report.size})`, 'success');
  };

  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    addToast('Report has been removed', 'info');
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `RPT-${Date.now().toString(36).toUpperCase().slice(0, 4)}`,
        title: 'On-Demand Report — ' + new Date().toLocaleDateString(),
        type: 'Security',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '1.2 MB',
        summary: 'Custom report generated on demand',
      };
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
      addToast('Your report is ready for download', 'success');
    }, 2000);
  };

  if (loading) {
    return (
    <div className="db-page animate-fade-in">
        <div className="h-8 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-indigo-500/10">
            <FileText size={16} className="text-indigo-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Reports</h2>
            <p className="db-subtitle">{reports.length} reports available</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={handleGenerate} disabled={generating}
            className="db-btn db-btn-primary">
            {generating ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />} Generate Report
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`db-btn flex-shrink-0 ${typeFilter === t ? 'db-btn-primary' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Report List */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <FileText size={24} className="text-zinc-700" />
            <p className="text-[11px] text-zinc-500">No reports match this filter</p>
          </div>
        ) : filtered.map(report => {
          const st = STATUS_MAP[report.status];
          return (
            <div key={report.id} className="db-card">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${st.color}10` }}>
                  <FileText size={14} style={{ color: st.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-zinc-200">{report.title}</span>
                    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${st.color}15`, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{report.summary}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-600">{report.type}</span>
                    <span className="text-[9px] text-zinc-600">{report.date}</span>
                    {report.size !== '—' && <span className="text-[9px] text-zinc-600">{report.size}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleDownload(report)}
                    className="db-btn p-1.5"
                    title="Download">
                    <Download size={11} />
                  </button>
                  <button onClick={() => { navigator.clipboard?.writeText(`${report.title}\n${report.summary}`); addToast('Report summary copied', 'success'); }}
                    className="db-btn p-1.5"
                    title="Share">
                    <Share2 size={11} />
                  </button>
                  <button onClick={() => handleDelete(report.id)}
                    className="db-btn p-1.5 hover:!text-rose-400"
                    title="Delete">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
