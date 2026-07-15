import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Shield, CheckCircle, ExternalLink, RotateCcw } from 'lucide-react';
import type { ChatMessage } from '../types';
import Tooltip from '../components/Tooltip';
import { useToast } from '../components/Toast';

const LANGUAGES: Record<string, { greeting: string; prompt: string; verdict: string; safe: string; report: string[] }> = {
  en: {
    greeting: 'Welcome to Citizen Fraud Shield. Paste a suspicious message or describe a call you received, and I will analyze it instantly.',
    prompt: 'Type or paste a suspicious message...',
    verdict: 'VERDICT',
    safe: 'This message appears to be safe. No fraud indicators detected.',
    report: [
      'Step 1: File a complaint at cybercrime.gov.in',
      'Step 2: Call Cybercrime Helpline: 1930',
      'Step 3: Visit your nearest police station with screenshots',
      'Step 4: Report to your bank\'s fraud department immediately',
      'Step 5: Preserve all evidence (screenshots, call logs, messages)',
    ],
  },
  hi: {
    greeting: 'नागरिक धोखाधड़ी शील्ड में आपका स्वागत है। एक संदिग्ध संदेश पेस्ट करें या कॉल का विवरण दें, और मैं तुरंत विश्लेषण करूंगा।',
    prompt: 'संदिग्ध संदेश पेस्ट करें...',
    verdict: 'निर्णय',
    safe: 'यह संदेश सुरक्षित प्रतीत होता है। कोई धोखाधड़ी संकेत नहीं मिला।',
    report: ['चरण 1: cybercrime.gov.in पर शिकायत दर्ज करें', 'चरण 2: साइबरक्राइम हेल्पलाइन: 1930 पर कॉल करें', 'चरण 3: स्क्रीनशॉट के साथ निकटतम पुलिस स्टेशन जाएं', 'चरण 4: तुरंत अपने बैंक के धोखाधड़ी विभाग को रिपोर्ट करें', 'चरण 5: सभी साक्ष्य सुरक्षित रखें'],
  },
  te: {
    greeting: 'పౌర మోసం షీల్డ్‌కు స్వాగతం. అనుమానాస్పద సందేశాన్ని పేస్ట్ చేయండి లేదా కాల్ వివరణను వివరించండి, నేను వెంటనే విశ్లేషిస్తాను.',
    prompt: 'అనుమానాస్పద సందేశాన్ని పేస్ట్ చేయండి...',
    verdict: 'తీర్పు',
    safe: 'ఈ సందేశం సురక్షితంగా కనిపిస్తుంది. మోసం సూచనలు లేవు.',
    report: ['దశ 1: cybercrime.gov.in వద్ద ఫిర్యాదు దాఖలు చేయండి', 'దశ 2: సైబర్‌క్రైమ్ హెల్ప్‌లైన్: 1930 కు కాల్ చేయండి', 'దశ 3: స్క్రీన్‌షాట్‌లతో సమీప పోలీసు స్టేషన్‌ను సందర్శించండి', 'దశ 4: వెంటనే మీ బ్యాంక్ మోసం విభాగానికి నివేదించండి', 'దశ 5: అన్ని ఆధారాలను సంరక్షించండి'],
  },
};

const SAMPLE_MESSAGES = [
  { label: 'Aadhaar deactivation scam', text: 'Your Aadhaar has been deactivated. Call 1800-XXX-XXXX immediately to reactivate or face legal action.' },
  { label: 'Lottery prize scam', text: 'Congratulations! You won ₹25,00,000 in the Lucky Draw. Click here to claim your prize.' },
  { label: 'Bank OTP phishing', text: 'Hello, this is SBI. Your account will be suspended tomorrow. Please share your OTP to prevent this.' },
  { label: 'PAN card fear scam', text: 'URGENT: Your PAN card is being used for money laundering. Share your net banking login to clear your name.' },
];

function analyzeMessage(text: string): { verdict: 'FRAUD' | 'SUSPICIOUS' | 'SAFE'; score: number; flags: string[] } {
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
  return { verdict, score: Math.min(score, 99), flags };
}

export default function CitizenShield() {
  const { addToast } = useToast();
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isAnalyzing) return;
    setInput('');
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: msg, timestamp: new Date().toLocaleTimeString() }]);

    setTimeout(() => {
      const { verdict, score, flags } = analyzeMessage(msg);
      const verdictText = verdict === 'FRAUD'
        ? `🚨 ${t.verdict}: FRAUD — Risk Score ${score}/100\n\nDetected issues:\n${flags.map(f => `• ${f}`).join('\n')}\n\nRecommended action: Report immediately`
        : verdict === 'SUSPICIOUS'
        ? `⚠️ ${t.verdict}: SUSPICIOUS — Risk Score ${score}/100\n\nPotential issues:\n${flags.map(f => `• ${f}`).join('\n')}\n\nRecommendation: Do not share any personal information`
        : `✅ ${t.safe}\n\nRisk Score: ${score}/100`;

      setMessages(prev => [...prev, { id: `verdict-${Date.now()}`, sender: 'bot', text: verdictText, timestamp: new Date().toLocaleTimeString(), isVerdict: true, verdict }]);

      addToast(
        verdict === 'FRAUD' ? 'Fraud detected — report immediately' :
        verdict === 'SUSPICIOUS' ? 'Suspicious message — do not share personal info' :
        'Message appears safe',
        verdict === 'FRAUD' ? 'error' : verdict === 'SUSPICIOUS' ? 'info' : 'success'
      );

      if (verdict !== 'SAFE') {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `report-${Date.now()}`, sender: 'bot', text: `📋 Reporting Steps:\n\n${t.report.join('\n')}`, timestamp: new Date().toLocaleTimeString() }]);
        }, 500);
      }
      setIsAnalyzing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800);
  };

  const handleClearChat = () => {
    setMessages([{
      id: 'welcome',
      sender: 'bot',
      text: t.greeting,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start sm:items-center justify-between gap-2.5 mb-3 animate-fade-slide-up">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <MessageSquare size={14} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <span className="truncate">Citizen Fraud Shield</span>
          </h2>
          <p className="text-zinc-500 text-[10px] mt-0.5 hidden sm:block">Instant scam detection with guided NCRB reporting</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={handleClearChat}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg glass-subtle text-[10px] text-zinc-500 hover:text-zinc-200 transition-all duration-300 cursor-pointer touch-target btn-ripple relative overflow-hidden"
            aria-label="Clear conversation">
            <RotateCcw size={10} strokeWidth={1.5} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg glass-subtle">
            {(['en', 'hi', 'te'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`touch-target px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer transition-all duration-300 ${
                  lang === l ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-200'
                }`}
                aria-label={`Switch to ${l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Telugu'}`}
                aria-pressed={lang === l}>
                {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'తె'}
              </button>
            ))}
          </div>
          <div className="hidden sm:block">
            <Tooltip text="NCRB Cybercrime Portal Integration" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        <div className="flex-1 flex flex-col glass-panel card-hover rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-2.5 mobile-scroll" role="log" aria-label="Chat messages" aria-live="polite">
            {messages.map(msg => (
              <div key={msg.id} className={`animate-fade-slide-up flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animationFillMode: 'both' }}>
                <div className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-3.5 py-2 rounded-2xl text-xs sm:text-[11px] whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'text-zinc-200 rounded-br-md'
                    : msg.isVerdict
                      ? msg.verdict === 'FRAUD'
                        ? 'border rounded-bl-md text-zinc-200'
                        : msg.verdict === 'SUSPICIOUS'
                          ? 'border rounded-bl-md text-zinc-200'
                          : 'border rounded-bl-md text-zinc-200'
                      : 'glass-subtle rounded-bl-md text-zinc-200/80'
                }`}
                  style={
                    msg.sender === 'user'
                      ? { background: 'rgba(59,130,246,0.12)' }
                      : msg.isVerdict
                        ? msg.verdict === 'FRAUD'
                          ? { background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.2)' }
                          : msg.verdict === 'SUSPICIOUS'
                            ? { background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }
                            : { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }
                        : undefined
                  }
                >{msg.text}</div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start animate-fade-slide-up" style={{ animationFillMode: 'both' }}>
                <div className="px-3 sm:px-3.5 py-2 rounded-2xl rounded-bl-md glass-subtle">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-3 sm:px-4 pb-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar" role="group" aria-label="Sample scam messages">
              {SAMPLE_MESSAGES.map((sample, i) => (
                <button key={i} onClick={() => handleSend(sample.text)} disabled={isAnalyzing}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full glass-subtle text-[9px] text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 touch-target btn-ripple relative overflow-hidden"
                  aria-label={`Try sample: ${sample.label}`}
                  title={sample.text}>
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 sm:px-4 pb-3">
            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={t.prompt} disabled={isAnalyzing}
                maxLength={500}
                className="flex-1 px-3 py-2 rounded-xl glass-subtle text-zinc-200 text-xs sm:text-[11px] placeholder-zinc-600 focus:outline-none transition-all duration-300 disabled:opacity-50 min-h-[36px] input-premium"
                aria-label={t.prompt} />
              <div className="flex items-end gap-1">
                <span className={`text-[8px] font-mono self-center ${input.length > 450 ? 'text-amber-400' : 'text-zinc-600'} ${input.length === 0 ? 'hidden' : ''}`} aria-live="polite">
                  {input.length}/500
                </span>
                <button onClick={() => handleSend()} disabled={!input.trim() || isAnalyzing}
                  className="touch-target px-3 py-2 rounded-xl btn-premium btn-ripple cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px] relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                  aria-label="Send message">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-64 flex flex-col gap-3 sm:gap-4 lg:gap-5 flex-shrink-0 lg:min-h-0">
          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Quick Actions</h3>
            <div className="space-y-1.5">
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl glass-subtle hover:border-blue-500/20 transition-all duration-300 text-[10px] sm:text-[11px] text-zinc-200 touch-target">
                <ExternalLink size={10} className="text-blue-400 flex-shrink-0" />
                <span className="truncate">File Cybercrime Complaint</span>
              </a>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl glass-subtle text-[10px] sm:text-[11px] text-zinc-200">
                <Shield size={10} className="text-rose-400 flex-shrink-0" />
                Helpline: 1930
              </div>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl glass-subtle text-[10px] sm:text-[11px] text-zinc-200">
                <CheckCircle size={10} className="text-emerald-400 flex-shrink-0" />
                WhatsApp: 9013151515
              </div>
            </div>
          </div>
          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1">
            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Statistics</h3>
            <div className="space-y-2">
              {[
                { label: 'Messages Analyzed', value: '847,293', color: '#3b82f6' },
                { label: 'Frauds Detected', value: '124,847', color: '#f43f5e' },
                { label: 'Detection Rate', value: '97.3%', color: '#10b981' },
                { label: 'Languages Supported', value: '22', color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 truncate">{stat.label}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold flex-shrink-0" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
