import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Send, Shield, CheckCircle, ExternalLink, RotateCcw,
  Clipboard, ClipboardCheck, AlertTriangle, Brain, ArrowRight,
  ChevronDown, Upload, Sparkles,
} from 'lucide-react';
import { useToast } from '../components/Toast';

const LANGUAGES: Record<string, { greeting: string; greetingSub: string; prompt: string; verdict: string; safe: string; reportSteps: string[] }> = {
  en: {
    greeting: 'Welcome to Citizen Fraud Shield',
    greetingSub: 'Paste a suspicious message or describe a call you received. I\'ll analyze it instantly and provide a detailed risk assessment with actionable next steps.',
    prompt: 'Paste or type a suspicious message here...',
    verdict: 'VERDICT',
    safe: 'This message appears to be safe. No fraud indicators detected.',
    reportSteps: [
      'File a complaint at cybercrime.gov.in',
      'Call Cybercrime Helpline: 1930',
      'Visit your nearest police station with screenshots',
      'Report to your bank\'s fraud department immediately',
      'Preserve all evidence (screenshots, call logs, messages)',
    ],
  },
  hi: {
    greeting: 'नागरिक धोखाधड़ी शील्ड में आपका स्वागत है',
    greetingSub: 'एक संदिग्ध संदेश पेस्ट करें या कॉल का विवरण दें। मैं तुरंत विश्लेषण करूंगा और विस्तृत जोखिम मूल्यांकन प्रदान करूंगा।',
    prompt: 'संदिग्ध संदेश यहां पेस्ट करें...',
    verdict: 'निर्णय',
    safe: 'यह संदेश सुरक्षित प्रतीत होता है। कोई धोखाधड़ी संकेत नहीं मिला।',
    reportSteps: [
      'cybercrime.gov.in पर शिकायत दर्ज करें',
      'साइबरक्राइम हेल्पलाइन: 1930 पर कॉल करें',
      'स्क्रीनशॉट के साथ निकटतम पुलिस स्टेशन जाएं',
      'तुरंत अपने बैंक के धोखाधड़ी विभाग को रिपोर्ट करें',
      'सभी साक्ष्य सुरक्षित रखें',
    ],
  },
  te: {
    greeting: 'పౌర మోసం షీల్డ్‌కు స్వాగతం',
    greetingSub: 'అనుమానాస్పద సందేశాన్ని పేస్ట్ చేయండి లేదా కాల్ వివరణను వివరించండి. నేను వెంటనే విశ్లేషిస్తాను.',
    prompt: 'అనుమానాస్పద సందేశాన్ని ఇక్కడ పేస్ట్ చేయండి...',
    verdict: 'తీర్పు',
    safe: 'ఈ సందేశం సురక్షితంగా కనిపిస్తుంది. మోసం సూచనలు లేవు.',
    reportSteps: [
      'cybercrime.gov.in వద్ద ఫిర్యాదు దాఖలు చేయండి',
      'సైబర్‌క్రైమ్ హెల్ప్‌లైన్: 1930 కు కాల్ చేయండి',
      'స్క్రీన్‌షాట్‌లతో సమీప పోలీసు స్టేషన్‌ను సందర్శించండి',
      'వెంటనే మీ బ్యాంక్ మోసం విభాగానికి నివేదించండి',
      'అన్ని ఆధారాలను సంరక్షించండి',
    ],
  },
};

const SAMPLE_MESSAGES = [
  { label: 'Aadhaar deactivation', text: 'Your Aadhaar has been deactivated. Call 1800-XXX-XXXX immediately to reactivate or face legal action.' },
  { label: 'Lottery prize', text: 'Congratulations! You won ₹25,00,000 in the Lucky Draw. Click here to claim your prize before it expires.' },
  { label: 'Bank OTP phishing', text: 'Hello, this is SBI. Your account will be suspended tomorrow. Please share your OTP to prevent this.' },
  { label: 'PAN card fear', text: 'URGENT: Your PAN card is being used for money laundering. Share your net banking login to clear your name.' },
  { label: 'Job offer scam', text: 'You are selected for work from home job. Salary ₹50,000/month. Pay ₹999 registration fee to start.' },
];

interface AnalysisResult {
  verdict: 'FRAUD' | 'SUSPICIOUS' | 'SAFE';
  score: number;
  flags: string[];
  summary: string;
  explanation: string;
  recommendedAction: string;
}

function analyzeMessage(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const fraudPatterns = [
    { pattern: /aadhaar|pan card|sim card/i, flag: 'Identity document mention' },
    { pattern: /deactivat|suspend|block|restrict/i, flag: 'Account threat language' },
    { pattern: /otp|password|pin|net banking|login/i, flag: 'Credential request' },
    { pattern: /call.*immediately|urgent|right now|within.*minutes/i, flag: 'Artificial urgency' },
    { pattern: /legal action|arrest|police|fir|court/i, flag: 'Legal threat' },
    { pattern: /won|prize|lottery|congratulat|reward/i, flag: 'Prize scam pattern' },
    { pattern: /click here|link|whatsapp/i, flag: 'Suspicious link request' },
    { pattern: /money laundering|tax evasion|criminal/i, flag: 'Fear induction' },
    { pattern: /share.*screen|screen share|remote access/i, flag: 'Remote access request' },
    { pattern: /transfer|pay|upi|bank.*account/i, flag: 'Financial extraction attempt' },
  ];
  const flags: string[] = [];
  fraudPatterns.forEach(({ pattern, flag }) => { if (pattern.test(lower)) flags.push(flag); });
  let score = 0;
  if (flags.length >= 4) score = 90 + Math.min(flags.length * 2, 10);
  else if (flags.length >= 2) score = 50 + flags.length * 12;
  else if (flags.length === 1) score = 25;
  else score = 5;
  const verdict = score >= 70 ? 'FRAUD' : score >= 40 ? 'SUSPICIOUS' : 'SAFE';

  const summary = verdict === 'FRAUD'
    ? `This message exhibits ${flags.length} fraud indicators and is highly likely a scam.`
    : verdict === 'SUSPICIOUS'
    ? `This message shows ${flags.length} warning signs that suggest potential fraud.`
    : 'No significant fraud indicators were detected in this message.';

  const explanation = verdict === 'FRAUD'
    ? `The message uses ${flags.map(f => f.toLowerCase()).join(', ')} techniques commonly seen in Indian cybercrime. Scammers create panic to force quick action without thinking. Legitimate institutions never request sensitive information through unsolicited messages.`
    : verdict === 'SUSPICIOUS'
    ? `While not definitively fraudulent, this message contains elements (${flags.map(f => f.toLowerCase()).join(', ')}) that are commonly associated with scam attempts. Exercise caution and verify through official channels.`
    : 'The message does not contain typical scam patterns. However, always remain cautious with unexpected communications.';

  const recommendedAction = verdict === 'FRAUD'
    ? 'Do NOT respond or click any links. Block the sender immediately. Report to cybercrime.gov.in or call 1930. If you shared any information, contact your bank right away.'
    : verdict === 'SUSPICIOUS'
    ? 'Do not share any personal or financial information. Verify the sender through official channels before taking any action. When in doubt, ignore the message.'
    : 'Continue normal caution. If this was an unexpected message, stay alert for follow-up attempts.';

  return { verdict, score: Math.min(score, 99), flags, summary, explanation, recommendedAction };
}

const VERDICT_CONFIG = {
  FRAUD: { color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', icon: AlertTriangle, label: 'FRAUD DETECTED' },
  SUSPICIOUS: { color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', icon: Shield, label: 'SUSPICIOUS' },
  SAFE: { color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle, label: 'SAFE' },
} as const;

export default function CitizenShield() {
  const { addToast } = useToast();
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState<Array<{
    id: string; sender: 'user' | 'bot'; text: string; timestamp: string;
    isVerdict?: boolean; verdict?: 'FRAUD' | 'SUSPICIOUS' | 'SAFE';
    analysis?: AnalysisResult; userMessage?: string;
  }>>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pasted, setPasted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = LANGUAGES[lang];

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      sender: 'bot',
      text: t.greeting,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => { autoResize(); }, [input, autoResize]);

  const handleSend = useCallback((text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isAnalyzing) return;
    setInput('');
    setPasted(false);
    setIsAnalyzing(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString(),
    }]);

    setTimeout(() => {
      const analysis = analyzeMessage(msg);
      setMessages(prev => [...prev, {
        id: `verdict-${Date.now()}`,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString(),
        isVerdict: true,
        verdict: analysis.verdict,
        analysis,
        userMessage: msg,
      }]);
      addToast(
        analysis.verdict === 'FRAUD' ? 'Fraud detected — report immediately' :
        analysis.verdict === 'SUSPICIOUS' ? 'Suspicious message detected' :
        'Message appears safe',
        analysis.verdict === 'FRAUD' ? 'error' : analysis.verdict === 'SUSPICIOUS' ? 'info' : 'success'
      );
      if (analysis.verdict !== 'SAFE') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `report-${Date.now()}`,
            sender: 'bot',
            text: '',
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 400);
      }
      setIsAnalyzing(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }, 900);
  }, [input, isAnalyzing, addToast]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        setPasted(true);
        addToast('Text pasted from clipboard', 'success');
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    } catch {
      addToast('Unable to access clipboard', 'error');
    }
  }, [addToast]);

  const handleClear = useCallback(() => {
    setMessages([{
      id: 'welcome',
      sender: 'bot',
      text: t.greeting,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setInput('');
    setPasted(false);
    textareaRef.current?.focus();
  }, [t.greeting]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const text = e.dataTransfer.getData('text/plain');
    if (text) { setInput(text); setPasted(true); }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const charCount = input.length;
  const maxChars = 2000;

  return (
    <div
      className="h-full flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between gap-3 mb-3 animate-fade-slide-up flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-zinc-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <MessageSquare size={14} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <span>Message Checker</span>
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5 hidden sm:block">AI-powered scam detection with structured analysis</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={handleClear}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all cursor-pointer"
            aria-label="Clear conversation">
            <RotateCcw size={10} strokeWidth={1.5} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {(['en', 'hi', 'te'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer transition-all ${
                  lang === l ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-200'
                }`}
                aria-label={`Switch to ${l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Telugu'}`}>
                {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'తె'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0 animate-fade-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>

        {/* ─── Chat Area ─── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto space-y-3 mobile-scroll"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end animate-fade-slide-up" style={{ animationFillMode: 'both' }}>
                    <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-md text-[13px] text-zinc-200 leading-relaxed whitespace-pre-wrap break-words"
                      style={{ background: 'rgba(59,130,246,0.12)' }}>
                      {msg.text}
                    </div>
                  </div>
                );
              }

              if (msg.isVerdict && msg.analysis) {
                return <VerdictCard key={msg.id} analysis={msg.analysis} userMessage={msg.userMessage || ''} />;
              }

              if (!msg.isVerdict && !msg.text && msg.sender === 'bot') {
                return <ReportStepsCard key={msg.id} steps={t.reportSteps} />;
              }

              return (
                <div key={msg.id} className="flex justify-start animate-fade-slide-up" style={{ animationFillMode: 'both' }}>
                  <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-md text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-words"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isAnalyzing && (
              <div className="flex justify-start animate-fade-slide-up" style={{ animationFillMode: 'both' }}>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-blue-400 animate-pulse" />
                    <span className="text-[11px] text-zinc-500">Analyzing message...</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ─── Sample Chips ─── */}
          <div className="flex gap-1.5 overflow-x-auto py-2 no-scrollbar flex-shrink-0" role="group" aria-label="Sample scam messages">
            {SAMPLE_MESSAGES.map((sample, i) => (
              <button key={i} onClick={() => handleSend(sample.text)} disabled={isAnalyzing}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer whitespace-nowrap disabled:opacity-40"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                title={sample.text}>
                {sample.label}
              </button>
            ))}
          </div>

          {/* ─── Input Area ─── */}
          <div
            className={`rounded-xl transition-all duration-300 ${isDragging ? 'ring-2 ring-blue-500/40' : ''}`}
            style={{
              background: isDragging ? 'rgba(59,130,246,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isDragging ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {isDragging && (
              <div className="flex items-center justify-center gap-2 py-3 text-blue-400">
                <Upload size={14} />
                <span className="text-[11px] font-medium">Drop text here to analyze</span>
              </div>
            )}

            <div className="flex items-end gap-2 p-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); setPasted(false); }}
                onKeyDown={handleKeyDown}
                placeholder={t.prompt}
                disabled={isAnalyzing}
                maxLength={maxChars}
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none min-h-[36px] max-h-[160px] px-2 py-1.5 leading-relaxed disabled:opacity-40"
                aria-label={t.prompt}
              />

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Paste button */}
                <button onClick={handlePaste} disabled={isAnalyzing}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-40"
                  aria-label="Paste from clipboard"
                  title="Paste from clipboard">
                  {pasted ? <ClipboardCheck size={13} className="text-blue-400" /> : <Clipboard size={13} />}
                </button>

                {/* Character counter */}
                <span className={`text-[9px] font-mono tabular-nums hidden sm:block ${charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-zinc-600'} ${charCount === 0 ? 'opacity-0' : ''}`}>
                  {charCount}/{maxChars}
                </span>

                {/* Send button */}
                <button onClick={() => handleSend()} disabled={!input.trim() || isAnalyzing}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.04)',
                    color: input.trim() ? '#fff' : '#52525b',
                  }}
                  aria-label="Send message">
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Input hint */}
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[9px] text-zinc-600">
                <kbd className="px-1 py-0.5 rounded text-[8px] font-mono" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>Enter</kbd>
                {' '}to send · {' '}
                <kbd className="px-1 py-0.5 rounded text-[8px] font-mono" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>Shift+Enter</kbd>
                {' '}for new line
              </span>
              <span className="text-[9px] text-zinc-600 hidden sm:block">Drag & drop text supported</span>
            </div>
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="w-full lg:w-56 flex flex-row lg:flex-col gap-3 flex-shrink-0 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          {/* Quick Actions */}
          <div className="min-w-[200px] lg:min-w-0 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-1.5">
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-zinc-300 hover:bg-white/[0.03] transition-all">
                <ExternalLink size={10} className="text-blue-400 flex-shrink-0" />
                <span>File Cybercrime Complaint</span>
              </a>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-zinc-300">
                <Shield size={10} className="text-rose-400 flex-shrink-0" />
                <span>Helpline: <span className="font-mono font-semibold text-zinc-200">1930</span></span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-zinc-300">
                <CheckCircle size={10} className="text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: <span className="font-mono font-semibold text-zinc-200">9013151515</span></span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="min-w-[200px] lg:min-w-0 rounded-xl p-3 flex-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-2">Statistics</h3>
            <div className="space-y-2">
              {[
                { label: 'Messages Analyzed', value: '847,293', color: '#3b82f6' },
                { label: 'Frauds Detected', value: '124,847', color: '#f43f5e' },
                { label: 'Detection Rate', value: '97.3%', color: '#10b981' },
                { label: 'Languages', value: '22', color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500 truncate">{stat.label}</span>
                  <span className="font-mono text-[10px] font-semibold flex-shrink-0" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   VERDICT CARD — Expandable AI Analysis
   ═══════════════════════════════════════ */

function VerdictCard({ analysis, userMessage }: {
  analysis: AnalysisResult;
  userMessage: string;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const vc = VERDICT_CONFIG[analysis.verdict];
  const Icon = vc.icon;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sections = [
    {
      id: 'summary',
      title: 'Summary',
      icon: Brain,
      content: analysis.summary,
    },
    {
      id: 'explanation',
      title: 'Full Explanation',
      icon: MessageSquare,
      content: analysis.explanation,
    },
    {
      id: 'flags',
      title: `Red Flags (${analysis.flags.length})`,
      icon: AlertTriangle,
      content: null,
      items: analysis.flags,
    },
    {
      id: 'action',
      title: 'Recommended Action',
      icon: ArrowRight,
      content: analysis.recommendedAction,
    },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden animate-fade-slide-up"
      style={{
        background: vc.bg,
        border: `1px solid ${vc.border}`,
        animationFillMode: 'both',
      }}
    >
      {/* Verdict Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${vc.border}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${vc.color}15` }}>
            <Icon size={16} style={{ color: vc.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: vc.color }}>{vc.label}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-zinc-500">Risk Score</span>
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${analysis.score}%`, background: vc.color }} />
              </div>
              <span className="font-mono text-[10px] font-bold" style={{ color: vc.color }}>{analysis.score}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* User message echo */}
      <div className="px-4 py-2.5 text-[11px] text-zinc-500 italic" style={{ borderBottom: `1px solid ${vc.border}` }}>
        Analyzed: &ldquo;{userMessage.length > 120 ? userMessage.slice(0, 120) + '...' : userMessage}&rdquo;
      </div>

      {/* Expandable Sections */}
      <div className="divide-y" style={{ borderColor: vc.border }}>
        {sections.map((section) => {
          const SectionIcon = section.icon;
          const isOpen = expandedSections.has(section.id);
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SectionIcon size={12} style={{ color: vc.color }} />
                  <span className="text-[11px] font-medium text-zinc-300">{section.title}</span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-zinc-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-3">
                  {section.content && (
                    <p className="text-[12px] text-zinc-400 leading-relaxed pl-5">{section.content}</p>
                  )}
                  {section.items && (
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {section.items.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium"
                          style={{ background: `${vc.color}10`, color: vc.color, border: `1px solid ${vc.color}20` }}>
                          <AlertTriangle size={8} />
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REPORT STEPS CARD
   ═══════════════════════════════════════ */

function ReportStepsCard({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-xl p-4 animate-fade-slide-up" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animationFillMode: 'both' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <Clipboard size={11} className="text-blue-400" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-300">Reporting Steps</span>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white mt-0.5"
              style={{ background: `hsl(${210 + i * 25}, 70%, 50%)` }}>
              {i + 1}
            </div>
            <span className="text-[12px] text-zinc-400 leading-relaxed">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
          <ExternalLink size={10} />
          Open cybercrime.gov.in
        </a>
      </div>
    </div>
  );
}
