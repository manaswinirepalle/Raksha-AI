import { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle, Search, ChevronDown, Mail, MessageSquare,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  { id: '1', category: 'Getting Started', question: 'How do I scan a suspicious message?', answer: 'Go to Detection → Scam Scanner and paste the message text, or use Message Checker to verify SMS/WhatsApp messages. Our AI will analyze it in seconds and provide a risk assessment.' },
  { id: '2', category: 'Getting Started', question: 'How does the scam detection work?', answer: 'Raksha AI uses multi-agent AI analysis that examines text patterns, known scam signatures, linguistic red flags, and behavioral indicators to determine if a message or call is suspicious.' },
  { id: '3', category: 'Getting Started', question: 'Is my data safe with Raksha AI?', answer: 'Yes. All analysis happens locally on your device. We never store your personal messages or call data. Only anonymized threat patterns are used to improve our detection models.' },
  { id: '4', category: 'Detection', question: 'What types of scams can you detect?', answer: 'We detect phone call scams, SMS phishing, WhatsApp fraud, UPI/payment scams, email phishing, social media scams, job offer fraud, digital arrest scams, fake investment schemes, and more.' },
  { id: '5', category: 'Detection', question: 'How accurate is the scam detection?', answer: 'Our AI achieves 94% accuracy in scam detection based on independent testing. However, we always recommend using your judgment alongside our analysis. No automated system is 100% accurate.' },
  { id: '6', category: 'Protection', question: 'How do I report a scam?', answer: 'Navigate to Protection → Report Fraud. Fill out the multi-step form with details about the scam, including any evidence you have. The report is forwarded to relevant authorities.' },
  { id: '7', category: 'Protection', question: 'Can I block scam callers?', answer: 'Yes. Go to Detection → Call Protection to manage your block list. You can manually add numbers or enable automatic blocking of known scam callers in our database.' },
  { id: '8', category: 'Protection', question: 'What should I do if I already lost money to a scam?', answer: 'Immediately: 1) Call your bank to freeze the transaction, 2) File a complaint at cybercrime.gov.in or call 1930, 3) Use Report Fraud in Raksha AI to file a detailed report, 4) Save all evidence including screenshots and transaction IDs.' },
  { id: '9', category: 'Account', question: 'How do I change my notification settings?', answer: 'Go to Support → Settings to manage your notification preferences. You can customize which alerts you receive and how frequently.' },
  { id: '10', category: 'Account', question: 'How do I delete my account?', answer: 'Go to Support → Settings → Account → Delete Account. This will permanently remove all your data from our servers. This action cannot be undone.' },
];

const CATEGORIES = ['All', 'Getting Started', 'Detection', 'Protection', 'Account'];

export default function HelpCenter() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      if (category !== 'All' && f.category !== category) return false;
      if (search && !f.question.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category]);

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-10 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-12 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }} />
        {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Help Center</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Find answers to common questions</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`btn-ripple flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              category === c ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <HelpCircle size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No articles match your search</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}
              className="btn-ripple text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Clear search</button>
          </div>
        ) : filtered.map(faq => (
          <div key={faq.id} className="glass-panel rounded-xl overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full p-4 text-left cursor-pointer flex items-center gap-3 hover:bg-white/[0.01] transition-colors">
              <div className="flex-1">
                <span className="text-sm font-medium text-zinc-200 block">{faq.question}</span>
                <span className="text-[10px] text-zinc-600 mt-0.5 block">{faq.category}</span>
              </div>
              <ChevronDown size={14} className={`text-zinc-600 flex-shrink-0 transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedId === faq.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-zinc-400 leading-relaxed pl-8">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Still need help?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Mail, label: 'Email Support', desc: 'support@raksha.ai', color: '#3b82f6' },
            { icon: MessageSquare, label: 'Live Chat', desc: 'Available 9am–6pm IST', color: '#10b981' },
          ].map((item, i) => (
            <button key={i}
              onClick={() => addToast(`Opening ${item.desc}`, 'info')}
              className="btn-ripple flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer text-left">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}10` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <div>
                <span className="text-sm font-medium text-zinc-200 block">{item.label}</span>
                <span className="text-[10px] text-zinc-500">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
