import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Loader2,
  Trash2, CheckCircle2, Clock, AlertTriangle, Share2,
  Plus,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import useViewportAnimation from '../hooks/useViewportAnimation';

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
  const headerVP = useViewportAnimation();
  const filtersVP = useViewportAnimation({ threshold: 0.1 });
  const listVP = useViewportAnimation({ threshold: 0.05 });
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
    <div className="space-y-5 animate-fade-in" ref={headerVP.ref} style={{
      opacity: headerVP.isVisible ? 1 : 0,
      transform: headerVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Reports</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{reports.length} reports available</p>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="btn-ripple flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Generate Report
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" ref={filtersVP.ref} style={{
        opacity: filtersVP.isVisible ? 1 : 0,
        transform: filtersVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms',
      }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              typeFilter === t ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3" ref={listVP.ref} style={{
        opacity: listVP.isVisible ? 1 : 0,
        transform: listVP.isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 160ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 160ms',
      }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No reports match this filter</p>
          </div>
        ) : filtered.map(report => {
          const st = STATUS_MAP[report.status];
          return (
            <div key={report.id} className="glass-panel card-premium rounded-xl p-4 hover:border-white/[0.08] transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${st.color}10` }}>
                  <FileText size={18} style={{ color: st.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-200">{report.title}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${st.color}15`, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{report.summary}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-zinc-600">{report.type}</span>
                    <span className="text-[10px] text-zinc-600">{report.date}</span>
                    {report.size !== '—' && <span className="text-[10px] text-zinc-600">{report.size}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => handleDownload(report)}
                    className="btn-ripple p-2 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                    title="Download">
                    <Download size={14} />
                  </button>
                  <button onClick={() => { navigator.clipboard?.writeText(`${report.title}\n${report.summary}`); addToast('Report summary copied', 'success'); }}
                    className="btn-ripple p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    title="Share">
                    <Share2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(report.id)}
                    className="btn-ripple p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete">
                    <Trash2 size={14} />
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
