import { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Check, Upload, Loader2,
  AlertTriangle, FileText, Send,
  Phone, MessageCircle, CreditCard, Globe,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface ReportStep {
  title: string;
  description: string;
}

const STEPS: ReportStep[] = [
  { title: 'Scam Type', description: 'What kind of scam was it?' },
  { title: 'Details', description: 'Tell us what happened' },
  { title: 'Evidence', description: 'Upload supporting evidence' },
  { title: 'Review', description: 'Confirm and submit' },
];

const SCAM_TYPES = [
  { id: 'phone', label: 'Phone Call Scam', icon: Phone, color: '#ef4444' },
  { id: 'message', label: 'SMS / Message Scam', icon: MessageCircle, color: '#3b82f6' },
  { id: 'upi', label: 'UPI / Payment Fraud', icon: CreditCard, color: '#f59e0b' },
  { id: 'website', label: 'Fake Website / Phishing', icon: Globe, color: '#8b5cf6' },
  { id: 'social', label: 'Social Media Scam', icon: Globe, color: '#ec4899' },
  { id: 'other', label: 'Other', icon: AlertTriangle, color: '#6b7280' },
];

const REGIONS = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Other'];

export default function ReportFraud() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({ date: '', time: '', region: '', amount: '', description: '', scammerNumber: '', scammerName: '' });
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const canProceed = () => {
    if (step === 0) return !!selectedType;
    if (step === 1) return formData.description.length > 10;
    return true;
  };

  const handleAddEvidence = () => {
    const types = ['Screenshot', 'Audio Recording', 'Transaction Receipt', 'Chat Export'];
    const newEvidence = types[evidenceFiles.length % types.length];
    setEvidenceFiles(prev => [...prev, newEvidence]);
    addToast(`${newEvidence} attached to report`, 'success');
  };

  const handleSubmit = () => {
    if (!canProceed()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addToast(`Report submitted. Tracking ID: RPT-${Date.now().toString(36).toUpperCase().slice(0, 8)}`, 'success');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 animate-fade-in py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <Check size={36} className="text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Report Submitted Successfully</h2>
          <p className="text-sm text-zinc-400">Tracking ID: <span className="font-mono text-blue-400">RPT-{Date.now().toString(36).toUpperCase().slice(0, 8)}</span></p>
        </div>
        <p className="text-xs text-zinc-500 text-center max-w-md">Your report has been forwarded to the relevant authorities. You'll receive updates on the investigation status.</p>
        <button onClick={() => { setSubmitted(false); setStep(0); setSelectedType(''); setFormData({ date: '', time: '', region: '', amount: '', description: '', scammerNumber: '', scammerName: '' }); setEvidenceFiles([]); }}
          className="btn-ripple px-5 py-2.5 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
          File Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h2 className="text-lg font-semibold text-zinc-100">Report Fraud</h2>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((_s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold transition-all ${
              i < step ? 'bg-emerald-500/20 text-emerald-400' : i === step ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/[0.03] text-zinc-600'
            }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/30' : 'bg-white/[0.05]'}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass-panel rounded-xl p-6 min-h-[300px]">
        <h3 className="text-sm font-medium text-zinc-300 mb-1">{STEPS[step].title}</h3>
        <p className="text-xs text-zinc-500 mb-5">{STEPS[step].description}</p>

        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SCAM_TYPES.map(type => (
              <button key={type.id} onClick={() => setSelectedType(type.id)}
                className={`btn-ripple flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all cursor-pointer ${
                  selectedType === type.id ? 'border border-blue-500/30 bg-blue-500/[0.08]' : 'border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]'
                }`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${type.color}10` }}>
                  <type.icon size={18} style={{ color: type.color }} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-zinc-300">{type.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Date of Incident</label>
                <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Region</label>
                <select value={formData.region} onChange={e => setFormData(p => ({ ...p, region: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 focus:outline-none focus:border-blue-500/30 transition-colors appearance-none">
                  <option value="">Select region</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Scammer Phone / UPI ID</label>
                <input value={formData.scammerNumber} onChange={e => setFormData(p => ({ ...p, scammerNumber: e.target.value }))}
                  placeholder="e.g. 9876543210 or scammer@upi"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Amount Lost (₹)</label>
                <input value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">What happened? *</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe the scam in detail..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors resize-none" />
              <span className="text-[10px] text-zinc-600 mt-1 block">{formData.description.length}/500 characters (min 10)</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 text-center hover:border-white/[0.1] transition-colors">
              <Upload size={28} className="mx-auto text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400 mb-1">Drop files here or</p>
              <button onClick={handleAddEvidence}
                className="btn-ripple text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
                Browse files
              </button>
              <p className="text-[10px] text-zinc-600 mt-2">Supports screenshots, audio, PDFs up to 10MB</p>
            </div>
            {evidenceFiles.length > 0 && (
              <div className="space-y-2">
                {evidenceFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <FileText size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-zinc-300 flex-1">{file}</span>
                    <button onClick={() => { setEvidenceFiles(prev => prev.filter((_, j) => j !== i)); addToast(`${file} removed`, 'info'); }}
                      className="text-xs text-zinc-600 hover:text-rose-400 cursor-pointer transition-colors">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-zinc-500">Evidence strengthens your report and helps authorities take action faster.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Scam Type', value: SCAM_TYPES.find(t => t.id === selectedType)?.label || 'Not selected' },
                { label: 'Date', value: formData.date || 'Not specified' },
                { label: 'Region', value: formData.region || 'Not specified' },
                { label: 'Scammer Contact', value: formData.scammerNumber || 'Not provided' },
                { label: 'Amount Lost', value: formData.amount ? `₹${formData.amount}` : 'Not specified' },
                { label: 'Description', value: formData.description || 'Not provided' },
                { label: 'Evidence', value: `${evidenceFiles.length} file(s) attached` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="text-xs text-zinc-500 w-28 flex-shrink-0">{item.label}</span>
                  <span className="text-sm text-zinc-200">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.1]">
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-400/80">By submitting, you confirm this report is accurate. False reports may result in account restrictions.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="btn-ripple flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft size={14} /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={!canProceed()}
            className="btn-ripple flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="btn-ripple flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit Report
          </button>
        )}
      </div>
    </div>
  );
}
