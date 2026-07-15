import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, ChevronLeft, Check, Upload, Loader2,
  AlertTriangle, FileText, Send, Flag, Phone, MessageCircle,
  CreditCard, Globe, Users, HelpCircle, X, Download,
  Calendar, MapPin, FileImage, FileAudio, FileVideo,
  Shield, ExternalLink, Clock, CircleDot, CheckCircle2,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface ScamType {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface FormData {
  date: string;
  region: string;
  scammerContact: string;
  amount: string;
  description: string;
}

interface EvidenceEntry {
  id: string;
  type: 'file' | 'text';
  content: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

interface TrackedComplaint {
  id: string;
  reportId: string;
  scamType: string;
  date: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  progress: number;
}

interface FormErrors {
  date?: string;
  region?: string;
  scammerContact?: string;
  description?: string;
}

const STEPS = [
  { title: 'Scam Type', description: 'What kind of scam was it?' },
  { title: 'Details', description: 'Tell us what happened' },
  { title: 'Evidence', description: 'Upload supporting evidence' },
  { title: 'Review', description: 'Confirm and submit' },
];

const SCAM_TYPES: ScamType[] = [
  { id: 'phone', label: 'Phone Call', description: 'Fraudulent calls pretending to be banks, police, or companies', icon: Phone, color: '#ef4444' },
  { id: 'message', label: 'SMS / Message', description: 'Phishing texts with malicious links or fake offers', icon: MessageCircle, color: '#3b82f6' },
  { id: 'upi', label: 'UPI / Payment', description: 'Fake UPI requests, QR code scams, payment fraud', icon: CreditCard, color: '#f59e0b' },
  { id: 'website', label: 'Fake Website', description: 'Cloned websites that steal credentials and data', icon: Globe, color: '#8b5cf6' },
  { id: 'social', label: 'Social Media', description: 'Fake profiles, romance scams, investment fraud on social platforms', icon: Users, color: '#ec4899' },
  { id: 'other', label: 'Other', description: 'Any other type of fraud not listed above', icon: HelpCircle, color: '#6b7280' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other',
];

const TRACKED_COMPLAINTS: TrackedComplaint[] = [
  {
    id: '1',
    reportId: 'RPT-7X4K9M2P',
    scamType: 'UPI / Payment Fraud',
    date: '2026-07-10',
    status: 'Submitted',
    progress: 25,
  },
  {
    id: '2',
    reportId: 'RPT-3N8W5R1T',
    scamType: 'Phone Call Scam',
    date: '2026-07-05',
    status: 'Under Review',
    progress: 60,
  },
  {
    id: '3',
    reportId: 'RPT-9F2L6J8Q',
    scamType: 'Fake Website / Phishing',
    date: '2026-06-28',
    status: 'Resolved',
    progress: 100,
  },
];

const EMERGENCY_CONTACTS = [
  { label: 'Cyber Crime Helpline', number: '1930', color: '#ef4444' },
  { label: 'Police', number: '100', color: '#f59e0b' },
  { label: 'Women Helpline', number: '1091', color: '#ec4899' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Submitted: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  'Under Review': { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  Resolved: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('audio/')) return FileAudio;
  if (type.startsWith('video/')) return FileVideo;
  return FileText;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateReportId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RPT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function SkeletonLoader() {
  return (
    <div className="db-page animate-fade-in">
      <div className="db-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-36 rounded bg-white/[0.04] animate-pulse" />
            <div className="h-3 w-52 rounded bg-white/[0.04] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="db-card">
        <div className="flex gap-3 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 rounded-full bg-white/[0.04] animate-pulse" />
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
      <div className="db-grid-2-1">
        <div className="h-28 rounded-xl bg-white/[0.03] animate-pulse" />
        <div className="h-28 rounded-xl bg-white/[0.03] animate-pulse" />
      </div>
    </div>
  );
}

export default function ReportFraud() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState<FormData>({
    date: '',
    region: '',
    scammerContact: '',
    amount: '',
    description: '',
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [evidenceEntries, setEvidenceEntries] = useState<EvidenceEntry[]>([]);
  const [textEvidence, setTextEvidence] = useState('');
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const validateField = useCallback((field: keyof FormData, value: string): string => {
    switch (field) {
      case 'date':
        if (!value) return 'Date of incident is required';
        return '';
      case 'region':
        if (!value) return 'Please select a region/state';
        return '';
      case 'scammerContact':
        if (!value) return 'Scammer contact info is required';
        return '';
      case 'description':
        if (!value) return 'Please describe what happened';
        if (value.length < 20) return `Description must be at least 20 characters (${value.length}/20)`;
        return '';
      default:
        return '';
    }
  }, []);

  const getFormErrors = useCallback((): FormErrors => {
    return {
      date: touchedFields.date ? validateField('date', formData.date) : '',
      region: touchedFields.region ? validateField('region', formData.region) : '',
      scammerContact: touchedFields.scammerContact ? validateField('scammerContact', formData.scammerContact) : '',
      description: touchedFields.description ? validateField('description', formData.description) : '',
    };
  }, [formData, touchedFields, validateField]);

  const isStep1Valid = !!selectedType;

  const isStep2Valid = !!formData.date && !!formData.region && !!formData.scammerContact && formData.description.length >= 20;

  const isStep3Valid = evidenceEntries.length > 0 || textEvidence.trim().length > 0;

  const canProceed = () => {
    if (step === 0) return isStep1Valid;
    if (step === 1) return isStep2Valid;
    if (step === 2) return isStep3Valid;
    return true;
  };

  const handleBlur = (field: keyof FormData) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleAddTextEvidence = () => {
    if (textEvidence.trim().length === 0) return;
    const entry: EvidenceEntry = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: textEvidence.trim(),
    };
    setEvidenceEntries(prev => [...prev, entry]);
    setTextEvidence('');
    addToast('Text evidence added', 'success');
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceEntries(prev => prev.filter(e => e.id !== id));
    addToast('Evidence removed', 'info');
  };

  const handleFileDrop = useCallback((files: FileList | null) => {
    if (!files) return;
    const currentFileCount = evidenceEntries.filter(e => e.type === 'file').length;
    const remainingSlots = MAX_FILES - currentFileCount;

    if (remainingSlots <= 0) {
      addToast(`Maximum ${MAX_FILES} files allowed`, 'error');
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (file.size > MAX_FILE_SIZE) {
        addToast(`"${file.name}" exceeds 10MB limit`, 'error');
        continue;
      }
      const entry: EvidenceEntry = {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'file',
        content: file.name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };
      setEvidenceEntries(prev => [...prev, entry]);
    }

    if (filesToAdd.length > 0) {
      addToast(`${filesToAdd.length} file(s) attached`, 'success');
    }

    if (files.length > remainingSlots) {
      addToast(`Only ${remainingSlots} more file(s) could be added`, 'info');
    }
  }, [evidenceEntries, addToast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileDrop(e.dataTransfer.files);
  };

  const handleBrowseFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,application/pdf,audio/*,video/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileDrop(target.files);
      target.value = '';
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!isStep1Valid || !isStep2Valid) return;
    setSubmitting(true);
    const id = generateReportId();
    setTimeout(() => {
      setReportId(id);
      setSubmitting(false);
      setSubmitted(true);
      addToast(`Report submitted successfully. ID: ${id}`, 'success');
    }, 2500);
  };

  const handleNext = () => {
    if (step === 1) {
      setTouchedFields({ date: true, region: true, scammerContact: true, description: true });
    }
    if (canProceed()) {
      setStep(s => Math.min(STEPS.length - 1, s + 1));
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelectedType('');
    setFormData({ date: '', region: '', scammerContact: '', amount: '', description: '' });
    setTouchedFields({});
    setEvidenceEntries([]);
    setTextEvidence('');
    setConfirmAccurate(false);
    setSubmitting(false);
    setSubmitted(false);
    setReportId('');
  };

  const handleDownloadPdf = () => {
    addToast('PDF report download started', 'success');
  };

  const errors = getFormErrors();
  const selectedScamType = SCAM_TYPES.find(t => t.id === selectedType);
  const fileEvidenceCount = evidenceEntries.filter(e => e.type === 'file').length;

  if (loading) {
    return <SkeletonLoader />;
  }

  if (submitted) {
    return (
      <div className="db-page animate-fade-in">
        <div className="db-header">
          <div className="db-header-left">
            <div className="db-header-icon" style={{ background: 'linear-gradient(135deg, #10b981, #065f46)' }}>
              <Flag size={16} className="text-white" />
            </div>
            <div className="db-header-text">
              <h2 className="db-title">Report Fraud</h2>
              <p className="db-subtitle">File fraud reports, upload evidence, and track complaint status</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', boxShadow: '0 0 32px rgba(16,185,129,0.15)' }}>
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="2" strokeDasharray="126" strokeDashoffset="0" fill="none" opacity="0.3" />
                <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="2.5" strokeDasharray="126" strokeDashoffset="126" fill="none">
                  <animate attributeName="stroke-dashoffset" from="126" to="0" dur="0.8s" fill="freeze" begin="0.2s" />
                </circle>
                <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40">
                  <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.4s" fill="freeze" begin="0.8s" />
                </path>
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-zinc-100 mb-1">Report Submitted Successfully</h2>
          <p className="text-xs text-zinc-400 mb-0.5">Your fraud report has been filed</p>
          <p className="text-xs text-zinc-500 mb-4">
            Tracking ID: <span className="font-mono text-blue-400 font-semibold">{reportId}</span>
          </p>

          <div className="db-card p-3 mb-4 max-w-md w-full">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-[11px] font-medium text-amber-400/80">What happens next?</span>
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-[11px] text-zinc-400">
                <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                Your report will be reviewed by the Cyber Crime Division
              </li>
              <li className="flex items-start gap-2 text-[11px] text-zinc-400">
                <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                You will receive updates via SMS and email
              </li>
              <li className="flex items-start gap-2 text-[11px] text-zinc-400">
                <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                Average resolution time is 7-14 business days
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => addToast('Opening report details...', 'info')}
              className="db-btn db-btn-primary"
            >
              <FileText size={12} /> View Report
            </button>
            <button
              onClick={handleDownloadPdf}
              className="db-btn"
            >
              <Download size={12} /> Download PDF
            </button>
            <button
              onClick={handleReset}
              className="db-btn"
            >
              File Another Report
            </button>
          </div>
        </div>

        <TrackedComplaintsSection />
        <EmergencyContactsSection />
      </div>
    );
  }

  return (
    <div className="db-page animate-fade-in">
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            <Flag size={16} className="text-white" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Report Fraud</h2>
            <p className="db-subtitle">File fraud reports, upload evidence, and track complaint status</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button
            onClick={() => addToast('Opening complaint tracker...', 'info')}
            className="db-btn"
          >
            <CircleDot size={12} /> Track Complaints
          </button>
        </div>
      </div>

      <div className="db-grid-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Step Indicator */}
          <div className="db-card p-3">
            <div className="flex items-center">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                      i < step
                        ? 'text-white'
                        : i === step
                          ? 'text-white border-2 border-blue-400'
                          : 'bg-white/[0.04] text-zinc-600 border border-white/[0.06]'
                    }`}
                    style={
                      i < step
                        ? { background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 10px rgba(16,185,129,0.3)' }
                        : i === step
                          ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 0 10px rgba(59,130,246,0.3)' }
                          : undefined
                    }>
                      {i < step ? <Check size={12} /> : i + 1}
                    </div>
                    <span className={`text-[9px] font-medium hidden sm:block ${i === step ? 'text-blue-400' : i < step ? 'text-emerald-400' : 'text-zinc-600'}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${i < step ? 'bg-emerald-500/40' : 'bg-white/[0.06]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="db-card p-4" style={{ minHeight: '280px' }}>
            <h3 className="text-xs font-medium text-zinc-300 mb-0.5">{STEPS[step].title}</h3>
            <p className="text-[10px] text-zinc-500 mb-4">{STEPS[step].description}</p>

            {/* Step 1: Scam Type */}
            {step === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SCAM_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`btn-ripple flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedType === type.id
                        ? 'border-2 border-blue-500/40 bg-blue-500/[0.08]'
                        : 'border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.02]'
                    }`}
                    style={
                      selectedType === type.id
                        ? { boxShadow: `0 0 16px ${type.color}15, inset 0 0 16px ${type.color}08` }
                        : undefined
                    }
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${type.color}12` }}
                    >
                      <type.icon size={18} style={{ color: type.color }} strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-200">{type.label}</span>
                    <span className="text-[9px] text-zinc-500 text-center leading-tight">{type.description}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Details */}
            {step === 1 && (
              <div className="space-y-3">
                <div className="db-grid-2">
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                      Date of Incident <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                        onBlur={() => handleBlur('date')}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-zinc-200 focus:outline-none transition-colors"
                        style={{
                          borderColor: errors.date ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)',
                        }}
                      />
                    </div>
                    {errors.date && <p className="text-[10px] text-rose-400 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                      Region / State <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <select
                        value={formData.region}
                        onChange={e => setFormData(p => ({ ...p, region: e.target.value }))}
                        onBlur={() => handleBlur('region')}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-zinc-200 focus:outline-none transition-colors appearance-none"
                        style={{
                          borderColor: errors.region ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {errors.region && <p className="text-[10px] text-rose-400 mt-1">{errors.region}</p>}
                  </div>
                </div>

                <div className="db-grid-2">
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                      Scammer Contact Info <span className="text-rose-400">*</span>
                    </label>
                    <input
                      value={formData.scammerContact}
                      onChange={e => setFormData(p => ({ ...p, scammerContact: e.target.value }))}
                      onBlur={() => handleBlur('scammerContact')}
                      placeholder="Phone / UPI ID / Email"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-colors"
                      style={{
                        borderColor: errors.scammerContact ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)',
                      }}
                    />
                    {errors.scammerContact && <p className="text-[10px] text-rose-400 mt-1">{errors.scammerContact}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                      Amount Lost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-medium">₹</span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                        placeholder="0"
                        min="0"
                        className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                    Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    onBlur={() => handleBlur('description')}
                    placeholder="Describe the scam in detail — how it happened, what was said, any demands made..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
                    style={{
                      borderColor: errors.description ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.description ? (
                      <p className="text-[10px] text-rose-400">{errors.description}</p>
                    ) : (
                      <span />
                    )}
                    <span className={`text-[9px] ${formData.description.length < 20 ? 'text-zinc-600' : 'text-emerald-400'}`}>
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Evidence */}
            {step === 2 && (
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-blue-500/40 bg-blue-500/[0.06]'
                      : 'border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.02]'
                  }`}
                  onClick={handleBrowseFiles}
                >
                  <Upload size={24} className={`mx-auto mb-2 ${isDragging ? 'text-blue-400' : 'text-zinc-600'}`} />
                  <p className="text-xs text-zinc-400 mb-0.5">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mb-1.5">or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleBrowseFiles(); }}
                    className="db-btn text-blue-400 hover:text-blue-300"
                  >
                    Browse files
                  </button>
                  <p className="text-[9px] text-zinc-600 mt-2">
                    Images, PDFs, Audio, Video — Max 10MB each, {MAX_FILES} files total
                  </p>
                </div>

                {evidenceEntries.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-zinc-400">
                      Attached Evidence ({evidenceEntries.length})
                    </p>
                    {evidenceEntries.map(entry => {
                      if (entry.type === 'file') {
                        const FileIcon = getFileIcon(entry.fileType || '');
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06]"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-500/10 flex-shrink-0">
                              <FileIcon size={12} className="text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-zinc-300 truncate">{entry.fileName}</p>
                              <p className="text-[9px] text-zinc-600">{formatFileSize(entry.fileSize || 0)}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveEvidence(entry.id)}
                              className="p-1 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={entry.id}
                          className="flex items-start gap-2 p-2 rounded-lg border border-white/[0.06]"
                          style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 flex-shrink-0 mt-0.5">
                            <FileText size={12} className="text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-zinc-500 mb-0.5">Text Evidence</p>
                            <p className="text-[11px] text-zinc-300 line-clamp-2">{entry.content}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveEvidence(entry.id)}
                            className="p-1 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block font-medium">
                    Paste Text Evidence
                  </label>
                  <textarea
                    value={textEvidence}
                    onChange={e => setTextEvidence(e.target.value)}
                    placeholder="Paste chat screenshots text, email content, SMS text, or any other text evidence here..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-zinc-600">
                      {fileEvidenceCount}/{MAX_FILES} files attached
                    </span>
                    <button
                      onClick={handleAddTextEvidence}
                      disabled={textEvidence.trim().length === 0}
                      className="db-btn text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send size={10} /> Add Text
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <Shield size={10} className="text-emerald-500/60" />
                  Evidence strengthens your report and helps authorities take action faster.
                </p>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 3 && (
              <div className="space-y-3">
                {selectedScamType && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${selectedScamType.color}12` }}>
                      <selectedScamType.icon size={16} style={{ color: selectedScamType.color }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500">Scam Type</p>
                      <p className="text-xs font-semibold text-zinc-200">{selectedScamType.label}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {[
                    { label: 'Date of Incident', value: formData.date || 'Not specified', icon: Calendar },
                    { label: 'Region / State', value: formData.region || 'Not specified', icon: MapPin },
                    { label: 'Scammer Contact', value: formData.scammerContact || 'Not provided', icon: Phone },
                    { label: 'Amount Lost', value: formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : 'Not specified', icon: CreditCard },
                    { label: 'Description', value: formData.description || 'Not provided', icon: FileText },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 py-2"
                      style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                    >
                      <item.icon size={11} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">{item.label}</p>
                        <p className="text-[11px] text-zinc-200 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-500/10">
                    <FileText size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Evidence</p>
                    <p className="text-[11px] font-medium text-zinc-200">
                      {evidenceEntries.length === 0
                        ? 'No evidence attached'
                        : `${evidenceEntries.length} item(s) — ${fileEvidenceCount} file(s), ${evidenceEntries.length - fileEvidenceCount} text`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.12]">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-medium text-amber-400/90 mb-0.5">Official Submission</p>
                    <p className="text-[10px] text-amber-400/60 leading-relaxed">
                      Your report will be submitted to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and the relevant law enforcement agencies in your jurisdiction.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-2 p-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmAccurate}
                    onChange={e => setConfirmAccurate(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-white/[0.15] bg-white/[0.03] text-blue-500 focus:ring-blue-500/30 cursor-pointer accent-blue-500"
                  />
                  <span className="text-[10px] text-zinc-400 leading-relaxed">
                    I confirm that the information provided is accurate and truthful. I understand that filing a false report may result in legal consequences under Section 182 of the Indian Penal Code.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="db-btn disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={12} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="db-btn db-btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={12} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !confirmAccurate || !isStep1Valid || !isStep2Valid}
                className="db-btn db-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={12} /> Submit Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <EmergencyContactsSidebar />
      </div>

      <TrackedComplaintsSection />
    </div>
  );
}

function EmergencyContactsSidebar() {
  const { addToast } = useToast();
  const handleCall = (number: string, label: string) => {
    addToast(`Initiating call to ${label}: ${number}`, 'info');
  };

  return (
    <div className="db-card p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Phone size={12} className="text-rose-400" />
        <span className="text-[11px] font-semibold text-zinc-300">Emergency Contacts</span>
      </div>
      <p className="text-[9px] text-zinc-600 leading-relaxed">
        If you are in immediate danger, call these numbers directly.
      </p>
      {EMERGENCY_CONTACTS.map(contact => (
        <button
          key={contact.number}
          onClick={() => handleCall(contact.number, contact.label)}
          className="db-btn w-full justify-start p-2"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${contact.color}12` }}
          >
            <Phone size={12} style={{ color: contact.color }} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[9px] font-medium text-zinc-300">{contact.label}</p>
            <p className="text-[11px] font-bold text-zinc-100 font-mono">{contact.number}</p>
          </div>
          <ExternalLink size={10} className="text-zinc-600" />
        </button>
      ))}
      <div className="pt-2 border-t border-white/[0.04]">
        <p className="text-[9px] text-zinc-600 leading-relaxed">
          Cyber Crime Portal: <span className="text-blue-400">cybercrime.gov.in</span>
        </p>
      </div>
    </div>
  );
}

function TrackedComplaintsSection() {
  return (
    <div className="db-section">
      <div className="db-section-header">
        <span className="db-section-title">
          <CircleDot size={12} className="text-blue-400" />
          Tracked Complaints
        </span>
      </div>
      <div className="db-grid-3">
        {TRACKED_COMPLAINTS.map(complaint => {
          const statusStyle = STATUS_COLORS[complaint.status];
          return (
            <div
              key={complaint.id}
              className="db-card transition-all hover:border-white/[0.08]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-zinc-300">{complaint.reportId}</span>
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.text,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  {complaint.status}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mb-0.5">{complaint.scamType}</p>
              <p className="text-[9px] text-zinc-600 mb-2 flex items-center gap-1">
                <Clock size={8} /> Filed: {complaint.date}
              </p>
              <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${complaint.progress}%`,
                    background: `linear-gradient(90deg, ${statusStyle.text}, ${statusStyle.text}cc)`,
                  }}
                />
              </div>
              <p className="text-[8px] text-zinc-600 mt-1 text-right">{complaint.progress}% complete</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmergencyContactsSection() {
  const { addToast } = useToast();

  return (
    <div className="db-section">
      <div className="db-section-header">
        <span className="db-section-title">
          <Phone size={12} className="text-rose-400" />
          Emergency Contacts
        </span>
      </div>
      <div className="db-grid-3">
        {EMERGENCY_CONTACTS.map(contact => (
          <button
            key={contact.number}
            onClick={() => addToast(`Calling ${contact.label}`, 'info')}
            className="db-card flex items-center gap-2 transition-all hover:border-white/[0.08] cursor-pointer text-left"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${contact.color}12` }}
            >
              <Phone size={14} style={{ color: contact.color }} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-300">{contact.label}</p>
              <p className="text-xs font-bold text-zinc-100 font-mono">{contact.number}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
