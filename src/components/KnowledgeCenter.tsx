import { useState, useMemo } from 'react';
import type { RiskLevel } from '../types';
import {
  Shield,
  ChevronDown,
  AlertTriangle,
  Smartphone,
  QrCode,
  Briefcase,
  TrendingUp,
  Package,
  MessageCircle,
  Mail,
  IndianRupee,
  Clock,
  CheckCircle2,
  Eye,
  FileWarning,
  Phone,
  Fingerprint,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface ScamCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  riskLevel: RiskLevel;
  shortDescription: string;
  fullDescription: string;
  tactics: string[];
  howToIdentify: string[];
  whatToDo: string[];
  stats: string;
  statsValue: number;
}

const CATEGORIES: ScamCategory[] = [
  {
    id: 'digital-arrest',
    name: 'Digital Arrest Scam',
    icon: <Phone size={20} />,
    riskLevel: 'CRITICAL',
    shortDescription:
      'Criminals impersonate CBI or police officers, fabricate an urgent FIR, and coerce victims into transferring money under the guise of avoiding arrest.',
    fullDescription:
      'The Digital Arrest scam is one of the most psychologically aggressive fraud tactics in India. Scammers pose as senior CBI officials, police officers, or income tax authorities and call victims claiming they are under investigation for money laundering or cybercrime. They simulate a video call with a fake "official" background, show fabricated documents, and maintain prolonged psychological pressure — sometimes keeping victims on calls for 8–10 hours straight. The goal is to induce panic so the victim transfers funds to a "safe account" or purchases gift cards. This scam disproportionately targets elderly citizens and working professionals who fear reputational damage.',
    tactics: [
      'Authority impersonation using fake CBI/police badges and uniforms on video calls',
      'Fabricated FIR numbers and case details to establish credibility',
      'Isolation tactics — instructing victims to cut contact with family and friends',
      'Prolonged call durations (6–10 hours) to maintain psychological control',
      'Demand for immediate fund transfers to "safe accounts" or cryptocurrency wallets',
    ],
    howToIdentify: [
      'Any legitimate law enforcement agency will never demand money over the phone',
      'Official investigations require formal written notices served through proper legal channels',
      'Video calls with poor quality, green screens, or mismatched backgrounds are red flags',
      'Pressure to keep the call secret or isolate from family is a clear manipulation tactic',
    ],
    whatToDo: [
      'Hang up immediately and call the official CBI or police helpline to verify',
      'Report the call to Cyber Crime Portal (cybercrime.gov.in) or dial 1930',
      'If money was transferred, contact your bank immediately for a transaction reversal',
    ],
    stats: '₹47 Cr lost in 2024 alone',
    statsValue: 470000000,
  },
  {
    id: 'upi-fraud',
    name: 'UPI Fraud',
    icon: <Smartphone size={20} />,
    riskLevel: 'CRITICAL',
    shortDescription:
      'Fraudsters send collect requests or fake payment links through UPI apps, tricking users into approving transactions that drain their accounts.',
    fullDescription:
      'UPI (Unified Payments Interface) fraud exploits the speed and convenience of India\'s digital payment ecosystem. Scammers use social engineering to get victims to approve collect requests, scan malicious QR codes, or share UPI PINs. Common lures include fake refund requests from e-commerce platforms, cashback claims, or "accidental" transfer reversal schemes. The rise of UPI has also spawned a secondary market where stolen UPI credentials are sold on dark web forums. With over 10 billion monthly UPI transactions, even a small fraud rate translates to massive absolute losses.',
    tactics: [
      'Social engineering through fake customer support calls impersonating banks',
      'Sending UPI collect requests disguised as payment receipts or refunds',
      'Creating fake merchant QR codes that trigger payments instead of receiving them',
      'Phishing links that mimic official UPI apps to harvest login credentials',
      'Urgency framing — "Your account will be deactivated in 2 hours"',
    ],
    howToIdentify: [
      'Legitimate UPI transactions never require sharing your PIN or OTP',
      'Unsolicited calls claiming to offer refunds or cashback are almost always scams',
      'Always check the payee name and amount before authorizing any UPI transaction',
      'Collect requests from unknown numbers should be rejected without exception',
    ],
    whatToDo: [
      'Immediately block the UPI transaction through your bank app if still pending',
      'Report on the National Cyber Crime Portal and file a complaint at the local police station',
      'Enable UPI transaction limits and PIN protection for all payment apps',
    ],
    stats: '73,000+ reported cases in 2024',
    statsValue: 73000,
  },
  {
    id: 'qr-scam',
    name: 'QR Code Scam',
    icon: <QrCode size={20} />,
    riskLevel: 'HIGH',
    shortDescription:
      'Malicious QR codes are placed over legitimate ones or sent digitally. Scanning them can trigger unauthorized payments or install malware on your device.',
    fullDescription:
      'QR code scams exploit the ubiquity of QR-based payments in India. Attackers physically replace QR codes at merchant shops, parking meters, or public utilities with their own, redirecting payments to their accounts. Digitally, they send QR codes via WhatsApp or SMS claiming to be payment links for refunds, deliveries, or contest prizes. Some malicious QR codes install spyware that intercepts banking credentials and OTPs. The simplicity of QR code generation makes this an extremely low-barrier attack vector, and many victims don\'t realize they\'ve been compromised until they notice unauthorized debits.',
    tactics: [
      'Physical replacement of merchant QR codes at shops, restaurants, and parking lots',
      'Sending QR codes via SMS or WhatsApp disguised as payment confirmation links',
      'QR codes embedded in phishing emails that install malware upon scanning',
      'Social media posts offering free vouchers that require scanning a malicious QR',
      'Fake "scan to win" campaigns at public events or online giveaways',
    ],
    howToIdentify: [
      'Always verify the payee name before confirming any QR-triggered transaction',
      'Look for tamper-evident tape or stickers covering original QR codes at merchants',
      'Never scan QR codes received from unknown numbers via WhatsApp or SMS',
      'Be suspicious of QR codes that request payment when you expected to receive money',
    ],
    whatToDo: [
      'If a suspicious QR was scanned, immediately check bank statements for unauthorized transactions',
      'Run a security scan on your device and uninstall any recently added apps',
      'Report the incident to the shop owner (if physical) and to Cyber Crime Portal',
    ],
    stats: '15,000+ cases reported in 2024',
    statsValue: 15000,
  },
  {
    id: 'fake-jobs',
    name: 'Fake Job Scam',
    icon: <Briefcase size={20} />,
    riskLevel: 'HIGH',
    shortDescription:
      'Fraudulent recruitment agencies promise guaranteed high-paying jobs in exchange for upfront registration fees, training charges, or security deposits.',
    fullDescription:
      'Fake job scams have surged with the growth of remote work and gig economy platforms. Scammers create professional-looking recruitment websites and LinkedIn profiles, post enticing job listings with above-market salaries, and conduct fake interview rounds. Victims are then asked to pay "processing fees," "background verification charges," or "training deposits" ranging from ₹2,000 to ₹50,000. In more sophisticated variants, victims provide extensive personal data (Aadhaar, PAN, bank details) under the guise of onboarding — which is then used for identity theft. These operations often run from call centers that mimic legitimate recruitment firms.',
    tactics: [
      'Too-good-to-be-true salary offers significantly above market rate',
      'Advance fee demands for registration, training kits, or background checks',
      'Fake interview processes with professional-looking emails and offer letters',
      'Data harvesting through fake onboarding forms requiring sensitive personal information',
      'Pressure to accept the offer within 24 hours before the "position is filled"',
    ],
    howToIdentify: [
      'Legitimate companies never charge candidates fees at any stage of hiring',
      'Verify company registration on MCA21 or the Ministry of Corporate Affairs portal',
      'Cross-check recruiter profiles on LinkedIn and verify their employment history',
      'Search for the company on Glassdoor, AmbitionBox, and consumer complaint forums',
    ],
    whatToDo: [
      'Do not make any payment — legitimate employers cover all hiring costs',
      'Report fake job postings to the job portal and to Cyber Crime Portal',
      'If personal data was shared, place a fraud alert on your CIBIL and credit reports',
    ],
    stats: '28,000+ cases reported in 2024',
    statsValue: 28000,
  },
  {
    id: 'fake-investment',
    name: 'Fake Investment Scam',
    icon: <TrendingUp size={20} />,
    riskLevel: 'CRITICAL',
    shortDescription:
      'Ponzi schemes, pump-and-dump crypto scams, and fake stock tip groups promise guaranteed high returns to lure victims into depositing large sums.',
    fullDescription:
      'Investment scams are the highest-value fraud category in India, with losses exceeding ₹2,800 crore in 2024 alone. Scammers operate through Telegram groups, WhatsApp communities, and social media influencers who showcase fabricated trading profits. Victims are initially allowed small withdrawals to build trust before being urged to invest larger amounts. When they try to withdraw significant funds, the platform either freezes accounts or disappears entirely. Recent variants include fake cryptocurrency exchanges, "algo trading" bots, and P2P lending platforms that function as elaborate Ponzi schemes. Sophisticated operations maintain functional trading dashboards with fake profit indicators.',
    tactics: [
      'Social proof through fake testimonials, screenshots of profits, and influencer endorsements',
      'Guaranteed return promises ("1% daily profit," "double your money in 30 days")',
      'Urgency and exclusivity framing — "limited spots," "insider information"',
      'Initial small withdrawals allowed to build trust before large deposits',
      'Celebrity impersonation in deepfake videos endorsing the investment platform',
    ],
    howToIdentify: [
      'No legitimate investment guarantees returns — guaranteed profits = scam',
      'SEBI-registered platforms can be verified on the SEBI website (sebi.gov.in)',
      'Be wary of platforms that charge fees for withdrawing your own profits',
      'Telegram/WhatsApp groups with "expert tips" and fabricated profit screenshots are red flags',
    ],
    whatToDo: [
      'Stop all further deposits immediately and document all transaction records',
      'File a complaint with SEBI, Cyber Crime Portal, and local police',
      'If invested through crypto, report to the exchange and blockchain analytics firms',
    ],
    stats: '₹2,800 Cr lost in 2024',
    statsValue: 28000000000,
  },
  {
    id: 'fake-courier',
    name: 'Fake Courier Scam',
    icon: <Package size={20} />,
    riskLevel: 'MEDIUM',
    shortDescription:
      'Scammers send fake delivery notifications claiming a package is held up at customs or requires a small clearance fee before delivery.',
    fullDescription:
      'The fake courier scam exploits the growth of e-commerce and the anxiety people feel about pending deliveries. Victims receive SMS, WhatsApp messages, or calls claiming a package addressed to them is stuck at customs, a sorting facility, or requires "insurance clearance." The scam works because most people have multiple pending deliveries at any given time, making the pretext believable. Scammers request small upfront fees (₹200–₹5,000) for "clearance," "insurance," or "re-delivery charges." Some variants install tracking malware through delivery link phishing. While individual losses are lower, the sheer volume of attempts makes this a significant fraud category.',
    tactics: [
      'Fake delivery tracking links that harvest personal and payment information',
      'Claims of customs clearance fees or insurance charges for pending packages',
      'Package anxiety exploitation — victims often have multiple active deliveries',
      'Small fee requests that seem reasonable and reduce suspicion',
      'Impersonation of major courier companies like Blue Dart, Delhivery, or India Post',
    ],
    howToIdentify: [
      'Always track packages through the official courier app or website directly',
      'Legitimate courier companies do not ask for payment via personal UPI IDs',
      'Customs clearance for personal shipments is handled by the seller, not the buyer',
      'Verify the sender details by contacting the courier company\'s official helpline',
    ],
    whatToDo: [
      'Do not click on tracking links — use the official courier app instead',
      'If you paid, report to your bank and file a complaint on Cyber Crime Portal',
      'Block the sender number and report it as spam on your messaging app',
    ],
    stats: '8,500+ cases reported in 2024',
    statsValue: 8500,
  },
  {
    id: 'fake-kyc',
    name: 'Fake KYC Scam',
    icon: <Fingerprint size={20} />,
    riskLevel: 'HIGH',
    shortDescription:
      'Scammers send fake bank or RBI notifications claiming your KYC is expired, urging you to click a phishing link to update your details.',
    fullDescription:
      'KYC (Know Your Customer) scams exploit mandatory banking regulations that require periodic identity verification. Victims receive official-looking emails, SMS, or WhatsApp messages claiming their bank account, wallet, or SIM card will be deactivated unless KYC is updated within 24–48 hours. The phishing links lead to convincing replicas of banking portals or government websites where victims enter their account credentials, card numbers, OTPs, and Aadhaar details. This stolen data is then used for account takeover, unauthorized transactions, and identity theft. The scam is particularly effective because KYC deadlines are real — people fear genuine account suspension.',
    tactics: [
      'Account suspension threats tied to KYC expiry dates create urgency',
      'Official-looking phishing pages that closely replicate bank or RBI websites',
      'SMS sender IDs spoofed to display legitimate bank names',
      'Links disguised as "Click here to update KYC" directing to malicious domains',
      'Follow-up calls from "bank officials" to extract OTPs when victims hesitate',
    ],
    howToIdentify: [
      'Banks never ask for KYC updates via SMS links — use the official bank app or visit a branch',
      'Check the URL carefully — phishing domains often have subtle misspellings',
      'RBI has explicitly stated it never contacts individuals about KYC directly',
      'Legitimate KYC processes do not require sharing your debit card CVV or ATM PIN',
    ],
    whatToDo: [
      'Do not click the link — log into your bank account through the official app',
      'If you entered credentials, change your password immediately and enable 2FA',
      'Report to your bank\'s fraud department and file a complaint on Cyber Crime Portal',
    ],
    stats: '34,000+ cases reported in 2024',
    statsValue: 34000,
  },
  {
    id: 'whatsapp-scam',
    name: 'WhatsApp Scam',
    icon: <MessageCircle size={20} />,
    riskLevel: 'MEDIUM',
    shortDescription:
      'Fraudulent messages spread through WhatsApp groups and forwards — fake lotteries, viral giveaways, and chain messages designed to steal data or money.',
    fullDescription:
      'WhatsApp scams exploit the platform\'s massive user base in India (500M+ users) and the cultural tendency to forward messages without verification. Common variants include fake lottery wins ("You\'ve won ₹25 lakhs from WhatsApp/Meta!"), viral forwards claiming to be charity drives, "free iPhone" campaigns, and referral link scams. More dangerous variants include WhatsApp-based business impersonation where scammers pose as known contacts or businesses. The end-to-end encryption of WhatsApp makes it difficult for law enforcement to track these operations. Social proof dynamics — where scam messages appear to come from trusted contacts whose accounts have been compromised — make these particularly effective.',
    tactics: [
      'Curiosity and greed triggers through fake lottery and prize announcements',
      'Social proof exploitation — messages forwarded by compromised trusted contacts',
      'Genuine-looking business profiles impersonating known brands on WhatsApp Business',
      'Urgency framing — "Forward this to 10 groups to claim your reward"',
      'Referral scams that require sharing personal details or payment to "unlock rewards"',
    ],
    howToIdentify: [
      'If a message sounds too good to be true, it is always a scam',
      'Verify lottery or prize claims through the company\'s official website, not the message link',
      'WhatsApp/Meta does not give away prizes through random messages',
      'Forwarded messages labeled "Forwarded many times" are almost always misinformation or scams',
    ],
    whatToDo: [
      'Do not forward the message — report it within WhatsApp using the built-in report feature',
      'If you clicked a link, change passwords for any accounts you may have accessed',
      'Warn your contacts if your account appears to have been compromised',
    ],
    stats: '41,000+ cases reported in 2024',
    statsValue: 41000,
  },
  {
    id: 'phishing-email',
    name: 'Phishing Email Scam',
    icon: <Mail size={20} />,
    riskLevel: 'HIGH',
    shortDescription:
      'Deceptive emails impersonating banks, government agencies, or tech companies contain malicious links that harvest login credentials and personal data.',
    fullDescription:
      'Email phishing remains one of the most prevalent cybercrime vectors globally, and India is the second most targeted country. Attackers create pixel-perfect replicas of emails from banks (SBI, HDFC, ICBI), tax authorities (Income Tax Department, GST), government portals (DigiLocker, UMANG), and tech companies (Google, Microsoft). These emails create fear ("Your account has been compromised") or urgency ("Tax deadline in 24 hours") to drive immediate clicks. Sophisticated spear-phishing campaigns target specific individuals using data from previous breaches. Business Email Compromise (BEC) variants target company employees with fake vendor invoices or CEO fund transfer requests, resulting in losses averaging ₹10+ lakh per incident.',
    tactics: [
      'Official-looking email templates cloned from legitimate brand communications',
      'Fear of account closure, legal action, or financial penalties to drive urgency',
      'Display name spoofing — sender appears as "SBI Support" but the actual address is suspicious',
      'Malicious attachments disguised as PDFs, invoices, or "account statements"',
      'Targeted spear-phishing using personal data harvested from social media',
    ],
    howToIdentify: [
      'Hover over links before clicking — the actual URL often reveals a phishing domain',
      'Check the sender\'s full email address, not just the display name',
      'Legitimate organizations never ask for passwords, OTPs, or card details via email',
      'Look for poor grammar, generic greetings ("Dear Customer"), and unusual formatting',
    ],
    whatToDo: [
      'Do not click any links or download attachments from suspicious emails',
      'Mark as phishing/spam in your email client to improve future filtering',
      'If credentials were entered, immediately change passwords and enable MFA',
      'Report to your IT department (if work email) and to the Anti-Phishing Working Group',
    ],
    stats: '56,000+ cases reported in 2024',
    statsValue: 56000,
  },
];

const RISK_COLORS: Record<RiskLevel, { bg: string; border: string; text: string; borderLeft: string }> = {
  CRITICAL: {
    bg: 'rgba(244,63,94,0.1)',
    border: 'rgba(244,63,94,0.2)',
    text: '#fb7185',
    borderLeft: '#f43f5e',
  },
  HIGH: {
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.2)',
    text: '#fb923c',
    borderLeft: '#f97316',
  },
  MEDIUM: {
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    text: '#fbbf24',
    borderLeft: '#f59e0b',
  },
  LOW: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
    text: '#4ade80',
    borderLeft: '#22c55e',
  },
};

const FILTER_LABELS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'digital-arrest', label: 'Digital Arrest' },
  { id: 'upi-fraud', label: 'UPI Fraud' },
  { id: 'qr-scam', label: 'QR Scams' },
  { id: 'fake-jobs', label: 'Fake Jobs' },
  { id: 'fake-investment', label: 'Fake Investment' },
  { id: 'fake-courier', label: 'Fake Courier' },
  { id: 'fake-kyc', label: 'Fake KYC' },
  { id: 'whatsapp-scam', label: 'WhatsApp Scams' },
];

const AGGREGATE_STATS = [
  { label: 'Total Reported', value: '256K+', icon: <FileWarning size={18} /> },
  { label: 'Total Loss', value: '₹3,400 Cr+', icon: <IndianRupee size={18} /> },
  { label: 'Recovery Rate', value: '12%', icon: <CheckCircle2 size={18} /> },
  { label: 'Avg Response Time', value: '4.2 days', icon: <Clock size={18} /> },
];

export default function KnowledgeCenter() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredCategories = useMemo(() => {
    if (activeCategory === 'all') return CATEGORIES;
    return CATEGORIES.filter((c) => c.id === activeCategory);
  }, [activeCategory]);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCards(new Set(CATEGORIES.map((c) => c.id)));
  };

  const collapseAll = () => {
    setExpandedCards(new Set());
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto mobile-scroll pb-8" style={{ background: '#09090b' }}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="animate-fade-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.15)',
                color: '#60a5fa',
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gradient" style={{ color: '#fafafa' }}>
                Scam Knowledge Center
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: '#71717a' }}>
                Stay informed about the latest scam trends and protection strategies
              </p>
            </div>
          </div>
        </div>

        {/* ── Category Filter Bar ── */}
        <div className="animate-fade-slide-up stagger-1">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {FILTER_LABELS.map((filter) => {
              const isActive = activeCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveCategory(filter.id)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap touch-target"
                  style={{
                    background: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: isActive
                      ? '1px solid rgba(59,130,246,0.3)'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: isActive ? '#60a5fa' : '#71717a',
                    boxShadow: isActive ? '0 0 12px rgba(59,130,246,0.1)' : 'none',
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Expand/Collapse Controls ── */}
        <div className="flex items-center justify-between animate-fade-slide-up stagger-2">
          <p className="text-xs font-mono" style={{ color: '#52525b' }}>
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#71717a',
              }}
            >
              <span className="flex items-center gap-1.5">
                <ChevronDown size={12} className="rotate-180" />
                Expand All
              </span>
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#71717a',
              }}
            >
              <span className="flex items-center gap-1.5">
                <ChevronDown size={12} />
                Collapse All
              </span>
            </button>
          </div>
        </div>

        {/* ── Scam Categories Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-5 animate-fade-slide-up stagger-3">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCards.has(category.id);
            const colors = RISK_COLORS[category.riskLevel];

            return (
              <div
                key={category.id}
                className="glass-panel card-hover rounded-2xl overflow-hidden flex flex-col"
                style={{
                  borderLeft: `3px solid ${colors.borderLeft}`,
                }}
              >
                {/* Card Header (always visible) */}
                <button
                  onClick={() => toggleCard(category.id)}
                  className="w-full text-left p-5 flex flex-col gap-3 transition-colors duration-200"
                  style={{
                    background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      >
                        {category.icon}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold truncate" style={{ color: '#e4e4e7' }}>
                          {category.name}
                        </h2>
                        <span
                          className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold mt-1"
                          style={{
                            background: colors.bg,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                        >
                          {category.riskLevel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono hidden sm:block" style={{ color: '#52525b' }}>
                        {category.stats}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: '#52525b',
                          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
                    {category.shortDescription}
                  </p>
                  <div className="sm:hidden">
                    <span className="text-[10px] font-mono" style={{ color: '#52525b' }}>
                      {category.stats}
                    </span>
                  </div>
                </button>

                {/* Expanded Detail Section */}
                {isExpanded && (
                  <div
                    className="px-5 pb-5 flex flex-col gap-4 animate-content-reveal"
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* Full Description */}
                    <div className="pt-4">
                      <p className="text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>
                        {category.fullDescription}
                      </p>
                    </div>

                    {/* Common Tactics */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={13} style={{ color: colors.text }} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>
                          Common Tactics
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {category.tactics.map((tactic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                              style={{ background: colors.borderLeft }}
                            />
                            <span className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
                              {tactic}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How to Identify */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={13} style={{ color: '#60a5fa' }} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>
                          How to Identify
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {category.howToIdentify.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                              style={{ background: '#3b82f6' }}
                            />
                            <span className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to Do */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield size={13} style={{ color: '#10b981' }} />
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>
                          What to Do if Targeted
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {category.whatToDo.map((action, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
                              style={{
                                background: 'rgba(16,185,129,0.1)',
                                border: '1px solid rgba(16,185,129,0.2)',
                                color: '#34d399',
                              }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats Bar in Card */}
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <AlertTriangle size={12} style={{ color: colors.text }} />
                      <span className="text-[11px] font-mono font-medium" style={{ color: colors.text }}>
                        {category.stats}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Aggregate Stats Bar ── */}
        <div className="animate-fade-slide-up stagger-5 mt-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AGGREGATE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-2xl p-4 flex items-center gap-3 card-hover"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.12)',
                    color: '#60a5fa',
                  }}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-bold font-mono" style={{ color: '#fafafa' }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs truncate" style={{ color: '#71717a' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Emergency Contact Banner ── */}
        <div
          className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-slide-up stagger-6"
          style={{
            border: '1px solid rgba(244,63,94,0.15)',
            background: 'rgba(244,63,94,0.03)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.15)',
              color: '#f43f5e',
            }}
          >
            <Phone size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: '#fafafa' }}>
              Been targeted by a scam?
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>
              Report immediately to the National Cyber Crime Helpline at{' '}
              <span className="font-mono font-semibold" style={{ color: '#f43f5e' }}>
                1930
              </span>{' '}
              or visit{' '}
              <span className="font-mono font-semibold" style={{ color: '#60a5fa' }}>
                cybercrime.gov.in
              </span>
            </p>
          </div>
          <a
            href="tel:1930"
            className="btn-premium flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.25)',
              color: '#fb7185',
            }}
          >
            <Phone size={13} />
            Call 1930
          </a>
        </div>

      </div>
    </div>
  );
}
