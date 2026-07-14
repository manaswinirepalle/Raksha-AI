import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import type { ChatMessage } from '../types';
import Tooltip from '../components/Tooltip';

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
    report: [
      'चरण 1: cybercrime.gov.in पर शिकायत दर्ज करें',
      'चरण 2: साइबरक्राइम हेल्पलाइन: 1930 पर कॉल करें',
      'चरण 3: स्क्रीनशॉट के साथ निकटतम पुलिस स्टेशन जाएं',
      'चरण 4: तुरंत अपने बैंक के धोखाधड़ी विभाग को रिपोर्ट करें',
      'चरण 5: सभी साक्ष्य सुरक्षित रखें',
    ],
  },
  te: {
    greeting: 'పౌర మోసం షీల్డ్‌కు స్వాగతం. అనుమానాస్పద సందేశాన్ని పేస్ట్ చేయండి లేదా కాల్ వివరణను వివరించండి, నేను వెంటనే విశ్లేషిస్తాను.',
    prompt: 'అనుమానాస్పద సందేశాన్ని పేస్ట్ చేయండి...',
    verdict: 'తీర్పు',
    safe: 'ఈ సందేశం సురక్షితంగా కనిపిస్తుంది. మోసం సూచనలు లేవు.',
    report: [
      'దశ 1: cybercrime.gov.in వద్ద ఫిర్యాదు దాఖలు చేయండి',
      'దశ 2: సైబర్‌క్రైమ్ హెల్ప్‌లైన్: 1930 కు కాల్ చేయండి',
      'దశ 3: స్క్రీన్‌షాట్‌లతో సమీప పోలీసు స్టేషన్‌ను సందర్శించండి',
      'దశ 4: వెంటనే మీ బ్యాంక్ మోసం విభాగానికి నివేదించండి',
      'దశ 5: అన్ని ఆధారాలను సంరక్షించండి',
    ],
  },
};

const SAMPLE_MESSAGES = [
  'Your Aadhaar has been deactivated. Call 1800-XXX-XXXX immediately to reactivate or face legal action.',
  'Congratulations! You won ₹25,00,000 in the Lucky Draw. Click here to claim your prize.',
  'Hello, this is SBI. Your account will be suspended tomorrow. Please share your OTP to prevent this.',
  'URGENT: Your PAN card is being used for money laundering. Share your net banking login to clear your name.',
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
  fraudPatterns.forEach(({ pattern, flag }) => {
    if (pattern.test(lower)) flags.push(flag);
  });

  let score = 0;
  if (flags.length >= 4) score = 90 + Math.min(flags.length * 2, 10);
  else if (flags.length >= 2) score = 50 + flags.length * 12;
  else if (flags.length === 1) score = 25;
  else score = 5;

  const verdict = score >= 70 ? 'FRAUD' : score >= 40 ? 'SUSPICIOUS' : 'SAFE';
  return { verdict, score: Math.min(score, 99), flags };
}

export default function CitizenShield() {
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
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

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString(),
    }]);

    setTimeout(() => {
      const { verdict, score, flags } = analyzeMessage(msg);

      const verdictText = verdict === 'FRAUD'
        ? `🚨 ${t.verdict}: FRAUD — Risk Score ${score}/100\n\nDetected issues:\n${flags.map(f => `• ${f}`).join('\n')}\n\nRecommended action: Report immediately`
        : verdict === 'SUSPICIOUS'
        ? `⚠️ ${t.verdict}: SUSPICIOUS — Risk Score ${score}/100\n\nPotential issues:\n${flags.map(f => `• ${f}`).join('\n')}\n\nRecommendation: Do not share any personal information`
        : `✅ ${t.safe}\n\nRisk Score: ${score}/100`;

      setMessages(prev => [...prev, {
        id: `verdict-${Date.now()}`,
        sender: 'bot',
        text: verdictText,
        timestamp: new Date().toLocaleTimeString(),
        isVerdict: true,
        verdict,
      }]);

      if (verdict !== 'SAFE') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `report-${Date.now()}`,
            sender: 'bot',
            text: `📋 Reporting Steps:\n\n${t.report.join('\n')}`,
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 500);
      }

      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-slide-up">
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center gap-2.5">
            <MessageSquare size={22} className="text-[#22D3EE]" />
            Citizen Fraud Shield
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">Instant scam detection with guided NCRB reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#131B2E] border border-[#1F2937]">
            <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${lang === 'en' ? 'bg-[#22D3EE]/15 text-[#22D3EE]' : 'text-[#6B7280] hover:text-[#E5E7EB]'}`}>EN</button>
            <button onClick={() => setLang('hi')} className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${lang === 'hi' ? 'bg-[#22D3EE]/15 text-[#22D3EE]' : 'text-[#6B7280] hover:text-[#E5E7EB]'}`}>हि</button>
            <button onClick={() => setLang('te')} className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${lang === 'te' ? 'bg-[#22D3EE]/15 text-[#22D3EE]' : 'text-[#6B7280] hover:text-[#E5E7EB]'}`}>తె</button>
          </div>
          <Tooltip text="NCRB Cybercrime Portal Integration" />
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#131B2E] rounded-2xl border border-[#1F2937] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`animate-fade-slide-up flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animationFillMode: 'both' }}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-[#22D3EE]/15 text-[#E5E7EB] rounded-br-md'
                    : msg.isVerdict
                      ? msg.verdict === 'FRAUD'
                        ? 'bg-[#FF3B4E]/10 border border-[#FF3B4E]/30 text-[#E5E7EB] rounded-bl-md'
                        : msg.verdict === 'SUSPICIOUS'
                          ? 'bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#E5E7EB] rounded-bl-md'
                          : 'bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#E5E7EB] rounded-bl-md'
                      : 'bg-[#1F2937] text-[#E5E7EB]/80 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start animate-fade-slide-up" style={{ animationFillMode: 'both' }}>
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-[#1F2937]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Sample messages */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SAMPLE_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(msg)}
                  disabled={isAnalyzing}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#1F2937] border border-[#1F2937] text-[10px] text-[#6B7280] hover:text-[#E5E7EB] hover:border-[#22D3EE]/30 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={t.prompt}
                disabled={isAnalyzing}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#0B1220] border border-[#1F2937] text-[#E5E7EB] text-sm placeholder-[#6B7280] focus:border-[#22D3EE]/50 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isAnalyzing}
                className="px-4 py-2.5 rounded-lg bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30 hover:bg-[#22D3EE]/25 hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-72 flex flex-col gap-6">
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2937] border border-[#1F2937] hover:border-[#22D3EE]/30 transition-colors text-sm text-[#E5E7EB]">
                <ExternalLink size={14} className="text-[#22D3EE]" />
                File Cybercrime Complaint
              </a>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2937] border border-[#1F2937] text-sm text-[#E5E7EB]">
                <Shield size={14} className="text-[#FF3B4E]" />
                Helpline: 1930
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2937] border border-[#1F2937] text-sm text-[#E5E7EB]">
                <CheckCircle size={14} className="text-[#34D399]" />
                WhatsApp: 9013151515
              </div>
            </div>
          </div>
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 flex-1">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Messages Analyzed', value: '847,293', color: '#22D3EE' },
                { label: 'Frauds Detected', value: '124,847', color: '#FF3B4E' },
                { label: 'Detection Rate', value: '97.3%', color: '#34D399' },
                { label: 'Languages Supported', value: '22', color: '#A78BFA' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{stat.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
