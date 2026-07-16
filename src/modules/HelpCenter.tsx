import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Mail,
  MessageSquare,
  Headphones,
  Star,
  Shield,
  AlertTriangle,
  Lock,
  CreditCard,
  Monitor,
  UserCog,
  FileText,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
}

interface VoteState {
  [key: string]: 'up' | 'down' | null;
}

const CATEGORIES = ['All', 'Account', 'Security', 'Scams', 'Technical', 'Billing'] as const;

const CATEGORY_META: Record<string, { icon: ReactNode; color: string }> = {
  Account: { icon: <UserCog size={10} />, color: '#3b82f6' },
  Security: { icon: <Lock size={10} />, color: '#10b981' },
  Scams: { icon: <AlertTriangle size={10} />, color: '#f59e0b' },
  Technical: { icon: <Monitor size={10} />, color: '#8b5cf6' },
  Billing: { icon: <CreditCard size={10} />, color: '#ec4899' },
};

const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    category: 'Security',
    question: 'How does Raksha AI protect my personal data?',
    answer:
      'All analysis is performed locally on your device using on-device AI models. We never upload, store, or share your personal messages, call logs, or financial data. Only fully anonymized threat signatures — stripped of all personally identifiable information — are used to improve our detection models across the network.',
  },
  {
    id: 'faq-2',
    category: 'Scams',
    question: 'What types of scams can Raksha AI detect?',
    answer:
      'Our multi-agent AI engine detects a comprehensive range of threats including UPI payment fraud, digital arrest scams, KYC update phishing, fake investment schemes, loan app fraud, sextortion attempts, SIM swap attacks, QR code scams, tech support impersonation, and romance/con artistry schemes targeting Indian users.',
  },
  {
    id: 'faq-3',
    category: 'Scams',
    question: 'I received a suspicious WhatsApp message. How do I check it?',
    answer:
      'Navigate to Detection → Message Checker and paste the full message text. Our AI will analyze linguistic patterns, known scam signatures, urgency indicators, and sender behavior to provide a risk score within seconds. You can also forward messages directly from WhatsApp using the Share function.',
  },
  {
    id: 'faq-4',
    category: 'Account',
    question: 'How do I create or link my Raksha AI account?',
    answer:
      'Tap Settings → Account → Create Account. You can register with your email or phone number. Linking your account enables cross-device sync of your block lists and threat preferences. Your message data is never synced — only your security settings and blocked number lists.',
  },
  {
    id: 'faq-5',
    category: 'Account',
    question: 'How do I delete my account and all associated data?',
    answer:
      'Go to Settings → Account → Delete Account. You will be asked to confirm via OTP. Once confirmed, all your data — including blocked numbers, scan history, and preferences — is permanently erased from our servers within 48 hours. This action is irreversible.',
  },
  {
    id: 'faq-6',
    category: 'Technical',
    question: 'Why is the app draining my battery?',
    answer:
      'Raksha AI runs lightweight background monitoring to protect you in real time. If you notice unusual battery drain, go to Settings → Performance → Battery Optimization and enable Adaptive Scanning. This reduces monitoring frequency during low-battery states while keeping essential protections active.',
  },
  {
    id: 'faq-7',
    category: 'Technical',
    question: 'The app is not detecting calls on my phone. What should I do?',
    answer:
      'Ensure you have granted Phone, Contacts, and Call Log permissions in your device settings. On Android 13+, also enable the "Display over other apps" permission. If issues persist, go to Settings → Troubleshooting → Run Diagnostics to identify the specific permission or configuration problem.',
  },
  {
    id: 'faq-8',
    category: 'Security',
    question: 'How accurate is the AI scam detection system?',
    answer:
      'Our ensemble model achieves 96.3% accuracy in controlled testing across 50,000+ known scam samples. However, no automated system is infallible. We strongly recommend treating our risk assessments as an additional layer of protection alongside your own judgment and bank-issued alerts.',
  },
  {
    id: 'faq-9',
    category: 'Scams',
    question: 'What should I do immediately after losing money to a scam?',
    answer:
      'Act within the first 60 minutes: 1) Call your bank immediately to freeze or reverse the transaction. 2) Dial the Cybercrime Helpline at 1930. 3) File a complaint at cybercrime.gov.in with transaction IDs and screenshots. 4) Use Protection → Report Fraud in Raksha AI for automated evidence bundling and reporting.',
  },
  {
    id: 'faq-10',
    category: 'Billing',
    question: 'What does the free plan include?',
    answer:
      'The free plan includes real-time call screening, basic scam detection for up to 10 message checks per day, a personal block list, and access to our community threat database. You also get weekly security digests and fraud awareness alerts via push notifications.',
  },
  {
    id: 'faq-11',
    category: 'Billing',
    question: 'What are the benefits of the Pro subscription?',
    answer:
      'Raksha Pro ($4.99/month or $39.99/year) includes unlimited message checks, advanced AI deep analysis, family protection for up to 5 members, priority incident response, dark web monitoring for your credentials, detailed threat reports, and ad-free experience with early access to new features.',
  },
  {
    id: 'faq-12',
    category: 'Billing',
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Settings → Subscription → Manage Plan → Cancel. Your Pro features remain active until the end of your current billing period. You can resubscribe at any time, and your preferences and block lists are preserved for 90 days after cancellation.',
  },
  {
    id: 'faq-13',
    category: 'Account',
    question: 'How do I customize my notification preferences?',
    answer:
      'Navigate to Settings → Notifications. You can independently toggle alerts for scam calls, suspicious messages, scam alerts, family member warnings, weekly reports, and system updates. Each category supports High, Normal, and Low priority levels, plus scheduled quiet hours.',
  },
  {
    id: 'faq-14',
    category: 'Security',
    question: 'Can Raksha AI protect my family members?',
    answer:
      'Yes. Go to Protection → Family Shield to add up to 5 family members (Pro plan). They receive scam alerts and you receive a summary dashboard of threats detected across your family. All analysis remains on each member\'s individual device — no cross-device data sharing occurs.',
  },
  {
    id: 'faq-15',
    category: 'Technical',
    question: 'Is Raksha AI compatible with my device?',
    answer:
      'Raksha AI supports Android 8.0+ and iOS 15+. We require minimum 2GB RAM and 150MB free storage. The app is optimized for budget devices and includes a Lite Mode for older hardware. Check Settings → About → Compatibility Check for a full device health report.',
  },
  {
    id: 'faq-16',
    category: 'Scams',
    question: 'How do I report a scam number to help others?',
    answer:
      'Tap the report icon next to any detected threat, or go to Protection → Report Fraud. Fill in the details including the number, scam type, and any evidence. Your report is anonymously contributed to our community threat database, helping protect millions of other users in real time.',
  },
  {
    id: 'faq-17',
    category: 'Security',
    question: 'Does Raksha AI monitor for data breaches?',
    answer:
      'Pro subscribers get Dark Web Monitoring which continuously checks if your email, phone number, or PAN details appear in known breach databases or underground forums. You receive instant alerts with recommended actions if your credentials are found in a leak.',
  },
  {
    id: 'faq-18',
    category: 'Technical',
    question: 'How do I update the app to the latest version?',
    answer:
      'Enable auto-updates in the Play Store or App Store for seamless updates. For manual updates, search "Raksha AI" in your app store. Always update promptly — each release includes new scam pattern data and detection model improvements that protect you against emerging threats.',
  },
];

const POPULAR_ARTICLES: Article[] = [
  { id: 'art-1', title: 'How to identify UPI payment scams instantly', category: 'Scams', readTime: '4 min' },
  { id: 'art-2', title: 'Setting up Family Shield for elderly parents', category: 'Security', readTime: '6 min' },
  { id: 'art-3', title: 'What to do in the first 60 minutes after a scam', category: 'Scams', readTime: '3 min' },
  { id: 'art-4', title: 'Configuring call blocking and whitelist rules', category: 'Technical', readTime: '5 min' },
  { id: 'art-5', title: 'Understanding your weekly threat report', category: 'Account', readTime: '3 min' },
];

export default function HelpCenter() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteState>({});

  const filteredFaqs = useMemo(() => {
    const query = search.toLowerCase().trim();
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleVote = (faqId: string, type: 'up' | 'down') => {
    setVotes((prev) => {
      const current = prev[faqId];
      if (current === type) {
        return { ...prev, [faqId]: null };
      }
      return { ...prev, [faqId]: type };
    });
    addToast(type === 'up' ? 'Thanks for your feedback!' : 'Feedback recorded', 'info');
  };

  return (
    <div className="db-page animate-fade-in" style={{ background: '#09090b' }}>
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-header-icon bg-blue-500/10">
            <HelpCircle size={16} className="text-blue-400" />
          </div>
          <div className="db-header-text">
            <h2 className="db-title">Help Center</h2>
            <p className="db-subtitle">Find answers to common questions</p>
          </div>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <div className="db-stat-icon bg-blue-500/10">
            <FileText size={12} className="text-blue-400" />
          </div>
          <div className="db-stat-value">{FAQS.length}</div>
          <div className="db-stat-label">Articles</div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon bg-emerald-500/10">
            <Shield size={12} className="text-emerald-400" />
          </div>
          <div className="db-stat-value">5</div>
          <div className="db-stat-label">Categories</div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon bg-amber-500/10">
            <Star size={12} className="text-amber-400" />
          </div>
          <div className="db-stat-value">5</div>
          <div className="db-stat-label">Popular</div>
        </div>
      </div>

      <div className="relative mb-3">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="glass-panel w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`db-btn flex-shrink-0 text-[10px] ${
              activeCategory === cat ? 'db-btn-primary' : ''
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="db-grid-3">
        <div className="col-span-2">
          <div className="space-y-1.5">
            {filteredFaqs.length === 0 ? (
              <div className="glass-panel flex flex-col items-center justify-center py-16 gap-3 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <HelpCircle size={20} className="text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-500">No articles match your search</p>
                <p className="text-[10px] text-zinc-600">
                  Try different keywords or browse categories
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('All');
                  }}
                  className="db-btn db-btn-primary text-[10px] mt-1"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const meta = CATEGORY_META[faq.category];
                const isExpanded = expandedId === faq.id;
                const voteState = votes[faq.id] ?? null;

                return (
                  <div
                    key={faq.id}
                    className="db-card glass-panel overflow-hidden card-hover"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="w-full p-3.5 text-left cursor-pointer flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-medium"
                            style={{
                              background: `${meta?.color ?? '#71717a'}15`,
                              color: meta?.color ?? '#a1a1aa',
                            }}
                          >
                            {meta?.icon}
                            {faq.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-200 block leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        size={12}
                        className={`text-zinc-600 flex-shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 animate-content-reveal">
                        <div className="db-divider mb-3" />
                        <p className="text-[10px] text-zinc-400 leading-relaxed pl-6 mb-3">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-2 pl-6">
                          <span className="text-[9px] text-zinc-600 mr-1">Was this helpful?</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(faq.id, 'up');
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] cursor-pointer transition-all ${
                              voteState === 'up'
                                ? 'bg-blue-500/15 text-blue-400'
                                : 'bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
                            }`}
                          >
                            <ThumbsUp size={9} />
                            Yes
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(faq.id, 'down');
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] cursor-pointer transition-all ${
                              voteState === 'down'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
                            }`}
                          >
                            <ThumbsDown size={9} />
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="db-section">
            <div className="db-section-header">
              <div className="flex items-center gap-2">
                <Star size={11} className="text-amber-400" />
                <h3 className="db-section-title">Popular Articles</h3>
              </div>
            </div>
            <div className="space-y-1.5">
              {POPULAR_ARTICLES.map((article) => {
                const meta = CATEGORY_META[article.category];
                return (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSearch(article.title.split(' ').slice(0, 3).join(' '));
                      setActiveCategory('All');
                      addToast(`Searching for: ${article.title}`, 'info');
                    }}
                    className="db-card glass-panel w-full text-left p-3 cursor-pointer card-hover group"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-medium"
                        style={{
                          background: `${meta?.color ?? '#71717a'}15`,
                          color: meta?.color ?? '#a1a1aa',
                        }}
                      >
                        {meta?.icon}
                        {article.category}
                      </span>
                      <span className="text-[7px] text-zinc-600">{article.readTime} read</span>
                    </div>
                    <span className="text-[10px] text-zinc-300 group-hover:text-zinc-100 transition-colors leading-snug block">
                      {article.title}
                    </span>
                    <ExternalLink
                      size={8}
                      className="text-zinc-600 group-hover:text-blue-400 mt-1.5 transition-colors"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="db-section">
            <div className="db-section-header">
              <div className="flex items-center gap-2">
                <Phone size={11} className="text-blue-400" />
                <h3 className="db-section-title">Emergency Contacts</h3>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="db-card glass-panel p-3">
                <span className="text-[10px] text-zinc-400 block">Cybercrime Helpline</span>
                <span className="text-[11px] text-zinc-200 font-medium">1930</span>
              </div>
              <div className="db-card glass-panel p-3">
                <span className="text-[10px] text-zinc-400 block">Women Helpline</span>
                <span className="text-[11px] text-zinc-200 font-medium">181</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="db-section mt-4">
        <div className="db-card glass-panel-strong overflow-hidden">
          <div className="p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
              <Headphones size={18} className="text-blue-400" />
            </div>
            <h3 className="text-xs font-medium text-zinc-200 mb-1">Still need help?</h3>
            <p className="text-[10px] text-zinc-500 mb-4 max-w-xs mx-auto">
              Our support team is available to assist you with any questions or issues
            </p>
            <div className="db-grid-2 max-w-md mx-auto">
              <button
                onClick={() => addToast('Opening email support...', 'info')}
                className="db-card flex items-center gap-2.5 text-left cursor-pointer card-hover p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-zinc-200 block">Email Support</span>
                  <span className="text-[8px] text-zinc-500">support@raksha.ai</span>
                </div>
              </button>
              <button
                onClick={() => addToast('Opening live chat...', 'info')}
                className="db-card flex items-center gap-2.5 text-left cursor-pointer card-hover p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={13} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-zinc-200 block">Live Chat</span>
                  <span className="text-[8px] text-zinc-500">9am – 6pm IST</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
