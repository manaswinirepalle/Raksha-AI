import { useState, useMemo } from 'react';
import {
  Lightbulb, CheckCircle, Brain, ChevronDown,
  AlertTriangle, Clock, BookOpen, Play, ShieldCheck,
  MessageCircle, Lock, Eye, CircleCheck, RefreshCw,
} from 'lucide-react';
import { useToast } from './Toast';

type Category = 'All' | 'Phone Scams' | 'Message Fraud' | 'Online Safety' | 'Financial' | 'Emergency';

const CATEGORIES: Category[] = ['All', 'Phone Scams', 'Message Fraud', 'Online Safety', 'Financial', 'Emergency'];

const CATEGORY_COLORS: Record<Category, string> = {
  All: '#3b82f6',
  'Phone Scams': '#ef4444',
  'Message Fraud': '#f97316',
  'Online Safety': '#22c55e',
  Financial: '#eab308',
  Emergency: '#a855f7',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#22c55e',
  Intermediate: '#f97316',
  Advanced: '#ef4444',
};

interface LearningCard {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: string;
  readTime: string;
  keyTakeaway: string;
}

const LEARNING_CARDS: LearningCard[] = [
  {
    id: '1', title: 'Caller ID Spoofing Detection', category: 'Phone Scams', difficulty: 'Beginner', readTime: '2 min',
    description: 'Scammers can fake caller IDs to display legitimate numbers (banks, police, government). Never trust caller ID alone. Hang up and call the official number from the organization\'s website or your bank card.',
    keyTakeaway: 'Caller ID can be spoofed. Always initiate calls to official numbers yourself.',
  },
  {
    id: '2', title: 'UPI Payment Fraud Prevention', category: 'Financial', difficulty: 'Intermediate', readTime: '3 min',
    description: 'Never share UPI PIN, OTP, or card CVV with anyone claiming to be from your bank. Legitimate banks never ask for these over phone or message. Enable transaction limits and set up UPI alerts.',
    keyTakeaway: 'Legitimate institutions never ask for your UPI PIN, OTP, or CVV.',
  },
  {
    id: '3', title: 'Phishing Link Recognition', category: 'Message Fraud', difficulty: 'Beginner', readTime: '2 min',
    description: 'Look for misspelled domains (amaz0n.com, paypa1.in), urgency language ("act now!", "account suspended"), and suspicious sender addresses. Hover over links before clicking. Use URL checkers for unknown links.',
    keyTakeaway: 'Misspelled domains and urgency language are the biggest phishing indicators.',
  },
  {
    id: '4', title: 'OTP and SMS Safety', category: 'Message Fraud', difficulty: 'Beginner', readTime: '2 min',
    description: 'Never share OTPs with anyone, including people claiming to be bank officials. OTPs are for your authentication only. Enable app-based 2FA instead of SMS where possible.',
    keyTakeaway: 'Your OTP is your key. Never share it with anyone under any circumstances.',
  },
  {
    id: '5', title: 'Social Media Privacy Hardening', category: 'Online Safety', difficulty: 'Intermediate', readTime: '3 min',
    description: 'Set profiles to private, disable location tagging, limit friend list visibility, and remove personal details like phone numbers and birth dates from public view. Regularly audit third-party app permissions.',
    keyTakeaway: 'Your social media profile is a goldmine for scammers. Lock it down.',
  },
  {
    id: '6', title: 'Emergency Response Protocol', category: 'Emergency', difficulty: 'Beginner', readTime: '2 min',
    description: 'If you\'ve been scammed: 1) Call 1930 immediately, 2) File a complaint on cybercrime.gov.in, 3) Contact your bank to freeze the account, 4) Preserve all evidence (screenshots, call logs, messages), 5) Visit your local cyber cell.',
    keyTakeaway: 'Time is critical. Call 1930 and your bank within 1 hour of being scammed.',
  },
  {
    id: '7', title: 'AI Voice Cloning Awareness', category: 'Phone Scams', difficulty: 'Advanced', readTime: '4 min',
    description: 'Modern AI can clone voices from just 3 seconds of audio. Scammers use this to impersonate family members in distress. Establish a family code word for emergency verification. Never wire money based on a voice call alone.',
    keyTakeaway: 'AI can clone voices. Establish a family code word for emergencies.',
  },
  {
    id: '8', title: 'KYC Update Scam Prevention', category: 'Financial', difficulty: 'Intermediate', readTime: '3 min',
    description: 'Banks never ask you to update KYC via SMS links or phone calls. Always visit your branch or use the official banking app. KYC scams often create urgency with "account will be blocked" threats.',
    keyTakeaway: 'KYC updates are done in-branch or via official apps — never through links.',
  },
  {
    id: '9', title: 'Public Wi-Fi Safety', category: 'Online Safety', difficulty: 'Intermediate', readTime: '3 min',
    description: 'Avoid accessing banking or sensitive accounts on public Wi-Fi. If you must use it, always use a VPN. Enable HTTPS-only mode in your browser. Turn off auto-connect to open networks.',
    keyTakeaway: 'Public Wi-Fi is inherently insecure. Use a VPN or avoid sensitive tasks.',
  },
  {
    id: '10', title: 'Loan App Safety Checklist', category: 'Financial', difficulty: 'Advanced', readTime: '4 min',
    description: 'RBI-approved loan apps display their registration number. Never pay upfront fees for loan approvals. Avoid apps that demand excessive permissions like contacts, photos, and SMS access.',
    keyTakeaway: 'Only use RBI-registered lending apps. If an app asks for contact list access or charges processing fees upfront, uninstall immediately.',
  },
];

const EMERGENCY_STEPS = [
  { text: "Don't panic — hang up immediately", color: '#ef4444' },
  { text: 'Call 1930 (Cyber Crime Helpline)', color: '#f97316' },
  { text: "Block the scammer's number", color: '#eab308' },
  { text: 'Do NOT share any more information', color: '#22c55e' },
  { text: 'File complaint on cybercrime.gov.in', color: '#3b82f6' },
  { text: 'Contact your bank to freeze affected accounts', color: '#8b5cf6' },
  { text: 'Preserve all evidence — screenshots, call logs, messages', color: '#06b6d4' },
  { text: 'Visit local cyber cell police station', color: '#ec4899' },
];

const PREVENTION_GUIDES = [
  { title: 'Verify Before You Trust', icon: ShieldCheck, color: '#3b82f6', steps: ['Check official websites for phone numbers', 'Never click links from unknown messages', 'Verify emails by checking sender addresses', 'Call institutions directly using official numbers'] },
  { title: 'Protect Your Identity', icon: Lock, color: '#22c55e', steps: ['Use strong, unique passwords for each account', 'Enable two-factor authentication everywhere', 'Never share OTPs or PINs with anyone', 'Regularly check bank statements for unauthorized transactions'] },
  { title: 'Report Immediately', icon: AlertTriangle, color: '#ef4444', steps: ['Call 1930 within 1 hour of being scammed', 'File complaint on cybercrime.gov.in', 'Contact your bank to freeze compromised accounts', 'Visit local police station with all evidence'] },
];

const FAQ_ITEMS = [
  { q: 'What should I do if I shared my bank details with a scammer?', a: 'Immediately call your bank\'s fraud helpline to freeze your account. Change your internet banking password. File a complaint on cybercrime.gov.in and call 1930. The faster you act, the higher the chance of recovering your money.' },
  { q: 'How do I know if a website is legitimate?', a: 'Check for HTTPS (padlock icon), verify the domain spelling carefully, look for contact information and physical address, search for reviews on independent sites, and check RBI/SEBI registrations for financial services.' },
  { q: 'Can I recover money lost to a scam?', a: 'Yes, but time is critical. Report within 1-3 hours for the best chance. File on cybercrime.gov.in, contact your bank, and visit the cyber cell. UPI transactions can sometimes be reversed if reported quickly.' },
  { q: 'Are government agencies actually calling me?', a: 'Government agencies typically communicate through official letters and emails, not unsolicited phone calls. If you receive a suspicious call claiming to be from a government office, hang up and call the official number from the government website.' },
  { q: 'What are the most common scam types in India right now?', a: 'The most prevalent scams include: digital arrest scams, UPI/cross-border payment fraud, KYC update phishing, fake customer care numbers, investment/trading scams, and AI voice cloning fraud targeting families.' },
];

const VIDEO_SUGGESTIONS = [
  { title: 'Understanding Digital Arrest Scams', duration: '8:24', channel: 'Cyber Safe India', description: 'How scammers impersonate CBI/police officers to extort money through "digital arrest" tactics.' },
  { title: 'UPI Fraud Prevention Guide', duration: '12:15', channel: 'RBI Financial Literacy', description: 'Step-by-step guide to safe UPI transactions and what to do if you\'re defrauded.' },
  { title: 'AI Voice Cloning: The New Threat', duration: '6:42', channel: 'Tech Explained', description: 'How scammers use AI to clone voices and impersonate your loved ones for fraud.' },
];

export default function LearningMode() {
  const [readCards, setReadCards] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { addToast } = useToast();

  const filteredCards = useMemo(
    () => selectedCategory === 'All' ? LEARNING_CARDS : LEARNING_CARDS.filter((c) => c.category === selectedCategory),
    [selectedCategory]
  );

  const progress = Math.round((readCards.size / LEARNING_CARDS.length) * 100);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = { All: LEARNING_CARDS.length, 'Phone Scams': 0, 'Message Fraud': 0, 'Online Safety': 0, Financial: 0, Emergency: 0 };
    LEARNING_CARDS.forEach((c) => { counts[c.category]++; });
    return counts;
  }, []);

  const toggleRead = (id: string) => {
    setReadCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markAllRead = () => {
    setReadCards(new Set(LEARNING_CARDS.map((c) => c.id)));
    addToast('All cards marked as read!', 'success');
  };

  const stats = [
    { label: 'Total Lessons', value: LEARNING_CARDS.length, icon: BookOpen, color: '#3b82f6' },
    { label: 'Completed', value: readCards.size, icon: CircleCheck, color: '#22c55e' },
    { label: 'In Progress', value: LEARNING_CARDS.length - readCards.size, icon: RefreshCw, color: '#f97316' },
    { label: 'Categories', value: CATEGORIES.length - 1, icon: Lightbulb, color: '#eab308' },
  ];

  return (
    <div className="db-page max-w-5xl">
      {/* Header */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-amber-500/10">
            <Lightbulb size={16} className="text-amber-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Safety Tips &amp; Learning Center</h2>
            <p className="db-subtitle">Master cybersecurity with interactive lessons and expert guides</p>
          </div>
        </div>
        <div className="db-header-actions">
          <button onClick={markAllRead} className="db-btn">
            <CheckCircle size={11} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="db-card">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-zinc-400">Overall Progress</span>
          <span className="text-[10px] font-mono text-blue-400">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[9px] text-zinc-600 mt-1">{readCards.size} of {LEARNING_CARDS.length} lessons completed</p>
      </div>

      {/* Stats */}
      <div className="db-stats">
        {stats.map((s) => (
          <div key={s.label} className="db-stat">
            <div className="db-stat-icon" style={{ background: `${s.color}15` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div>
              <span className="db-stat-value">{s.value}</span>
              <span className="db-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`db-btn ${selectedCategory === cat ? 'db-btn-primary' : ''}`}
            style={selectedCategory === cat ? { background: CATEGORY_COLORS[cat], boxShadow: `0 0 12px ${CATEGORY_COLORS[cat]}40` } : undefined}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Learning Cards */}
      <div className="db-grid-2">
        {filteredCards.map((card) => {
          const isRead = readCards.has(card.id);
          return (
            <div
              key={card.id}
              className={`db-card ${isRead ? 'border-green-500/20 bg-green-500/[0.03]' : ''}`}
              style={{ animation: 'fadeSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider flex-shrink-0"
                    style={{ background: `${CATEGORY_COLORS[card.category]}15`, color: CATEGORY_COLORS[card.category] }}
                  >
                    {card.category}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider flex-shrink-0"
                    style={{ background: `${DIFFICULTY_COLORS[card.difficulty]}15`, color: DIFFICULTY_COLORS[card.difficulty] }}
                  >
                    {card.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-zinc-600 flex-shrink-0">
                  <Clock size={9} />
                  <span className="text-[9px] font-mono">{card.readTime}</span>
                </div>
              </div>
              <h3 className="text-[11px] font-semibold text-zinc-200 mb-1">{card.title}</h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed mb-2">{card.description}</p>
              <div className="flex items-start gap-1.5 p-2 rounded-lg bg-blue-500/[0.06] border border-blue-500/10 mb-2">
                <Brain size={10} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-300/80 leading-relaxed">{card.keyTakeaway}</p>
              </div>
              <button
                onClick={() => toggleRead(card.id)}
                className={`w-full text-[10px] py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isRead
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
              >
                {isRead ? <><CheckCircle size={10} /> Completed</> : <><Eye size={10} /> Mark as Read</>}
              </button>
            </div>
          );
        })}
      </div>

      {/* Emergency Guide */}
      <div className="db-card">
        <div className="db-card-header">
          <AlertTriangle size={12} className="text-red-400" />
          <span className="db-card-title">Emergency Response — If You've Been Scammed</span>
        </div>
        <div className="space-y-1.5">
          {EMERGENCY_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white"
                style={{ background: step.color }}
              >
                {i + 1}
              </div>
              <span className="text-[10px] text-zinc-300">{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Guides */}
      <div className="db-grid-3">
        {PREVENTION_GUIDES.map((guide) => (
          <div key={guide.title} className="db-card">
            <div className="db-card-header">
              <guide.icon size={12} style={{ color: guide.color }} />
              <span className="db-card-title">{guide.title}</span>
            </div>
            <div className="space-y-1">
              {guide.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px] text-zinc-400">
                  <CheckCircle size={8} className="flex-shrink-0 mt-0.5" style={{ color: guide.color }} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title"><MessageCircle size={11} /> FAQ</span>
        </div>
        <div className="space-y-1.5">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="db-card overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <span className="text-[11px] font-medium text-zinc-300 pr-3">{item.q}</span>
                <ChevronDown
                  size={12}
                  className={`text-zinc-500 flex-shrink-0 transition-transform duration-200 ${
                    expandedFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === i && (
                <div className="px-3 pb-3 border-t border-white/[0.04]">
                  <p className="text-[10px] text-zinc-400 leading-relaxed pt-2">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Suggestions */}
      <div className="db-section">
        <div className="db-section-header">
          <span className="db-section-title"><Play size={11} className="text-purple-400" /> Recommended Videos</span>
        </div>
        <div className="db-grid-3">
          {VIDEO_SUGGESTIONS.map((video) => (
            <div key={video.title} className="db-card cursor-pointer">
              <div className="db-card-header">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Play size={10} className="text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-zinc-600">
                  <Clock size={8} />
                  <span className="text-[8px] font-mono">{video.duration}</span>
                </div>
              </div>
              <h4 className="text-[11px] font-semibold text-zinc-200 mb-0.5">{video.title}</h4>
              <p className="text-[9px] text-zinc-500 mb-1">{video.channel}</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">{video.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
