export default function VictimIllustration() {
  return (
    <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto" role="img" aria-label="Illustration of a person overwhelmed by digital scam messages">
      {/* Background */}
      <rect width="600" height="320" rx="20" fill="#0c0c0f" />
      <rect x="1" y="1" width="598" height="318" rx="19" stroke="white" strokeOpacity="0.06" />

      {/* Scattered scam message bubbles */}
      <g opacity="0.6">
        {/* Phone call bubble */}
        <rect x="40" y="30" width="180" height="48" rx="12" fill="#1a1a1f" stroke="#f43f5e" strokeOpacity="0.3" />
        <circle cx="62" cy="54" r="10" fill="#f43f5e" fillOpacity="0.15" />
        <text x="62" y="58" textAnchor="middle" fill="#f43f5e" fontSize="10">☎</text>
        <text x="80" y="50" fill="#f43f5e" fontSize="8" fontFamily="monospace" opacity="0.7">CBI OFFICE — URGENT</text>
        <text x="80" y="64" fill="#71717a" fontSize="7" fontFamily="monospace">"Your Aadhaar is linked to..."</text>

        {/* SMS bubble */}
        <rect x="380" y="50" width="190" height="48" rx="12" fill="#1a1a1f" stroke="#f97316" strokeOpacity="0.3" />
        <circle cx="402" cy="74" r="10" fill="#f97316" fillOpacity="0.15" />
        <text x="402" y="78" textAnchor="middle" fill="#f97316" fontSize="10">✉</text>
        <text x="420" y="70" fill="#f97316" fontSize="8" fontFamily="monospace" opacity="0.7">LOTTERY WINNER</text>
        <text x="420" y="84" fill="#71717a" fontSize="7" fontFamily="monospace">"You have won ₹25,00,000..."</text>

        {/* WhatsApp bubble */}
        <rect x="60" y="230" width="200" height="48" rx="12" fill="#1a1a1f" stroke="#eab308" strokeOpacity="0.3" />
        <circle cx="82" cy="254" r="10" fill="#eab308" fillOpacity="0.15" />
        <text x="82" y="258" textAnchor="middle" fill="#eab308" fontSize="10">💬</text>
        <text x="100" y="250" fill="#eab308" fontSize="8" fontFamily="monospace" opacity="0.7">FAKE INVESTMENT</text>
        <text x="100" y="264" fill="#71717a" fontSize="7" fontFamily="monospace">"Join our stock tips group..."</text>

        {/* UPI request bubble */}
        <rect x="360" y="220" width="210" height="48" rx="12" fill="#1a1a1f" stroke="#8b5cf6" strokeOpacity="0.3" />
        <circle cx="382" cy="244" r="10" fill="#8b5cf6" fillOpacity="0.15" />
        <text x="382" y="248" textAnchor="middle" fill="#8b5cf6" fontSize="10">₹</text>
        <text x="400" y="240" fill="#8b5cf6" fontSize="8" fontFamily="monospace" opacity="0.7">UPI COLLECTION REQUEST</text>
        <text x="400" y="254" fill="#71717a" fontSize="7" fontFamily="monospace">"Pay ₹4,999 for KYC renewal"</text>
      </g>

      {/* Central figure — person with head in hands */}
      <g transform="translate(240, 80)">
        {/* Desk/table */}
        <rect x="-40" y="140" width="200" height="8" rx="4" fill="#1a1a1f" stroke="white" strokeOpacity="0.06" />

        {/* Phone on desk */}
        <rect x="80" y="118" width="32" height="52" rx="6" fill="#1a1a1f" stroke="#3b82f6" strokeOpacity="0.3" />
        <rect x="84" y="126" width="24" height="36" rx="2" fill="#3b82f6" fillOpacity="0.06" />
        <circle cx="96" cy="166" r="2" fill="white" fillOpacity="0.15" />
        {/* Phone screen glow */}
        <rect x="83" y="125" width="26" height="38" rx="3" fill="#3b82f6" fillOpacity="0.04" />

        {/* Body */}
        <path d="M60 80 C60 60 100 60 100 80 L105 140 L55 140 Z" fill="#1a1a1f" stroke="white" strokeOpacity="0.08" />

        {/* Shoulders */}
        <ellipse cx="100" cy="90" rx="30" ry="12" fill="#1a1a1f" stroke="white" strokeOpacity="0.06" />
        <ellipse cx="60" cy="90" rx="30" ry="12" fill="#1a1a1f" stroke="white" strokeOpacity="0.06" />

        {/* Head */}
        <circle cx="80" cy="55" r="25" fill="#1a1a1f" stroke="white" strokeOpacity="0.08" />

        {/* Hair */}
        <path d="M55 48 C55 30 105 30 105 48 C105 38 55 38 55 48" fill="#1a1a1f" stroke="white" strokeOpacity="0.06" />

        {/* Hands covering face */}
        <ellipse cx="68" cy="52" rx="12" ry="10" fill="#1a1a1f" stroke="white" strokeOpacity="0.1" />
        <ellipse cx="92" cy="52" rx="12" ry="10" fill="#1a1a1f" stroke="white" strokeOpacity="0.1" />

        {/* Stress lines around head */}
        <line x1="40" y1="35" x2="48" y2="40" stroke="#f43f5e" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="112" y1="35" x2="120" y2="40" stroke="#f43f5e" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="22" x2="80" y2="30" stroke="#f43f5e" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="55" y1="25" x2="62" y2="32" stroke="#f97316" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
        <line x1="98" y1="25" x2="105" y2="32" stroke="#f97316" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* RAKSHA AI shield — the solution */}
      <g transform="translate(270, 270)">
        <rect x="-50" y="-12" width="100" height="28" rx="14" fill="#3b82f6" fillOpacity="0.12" stroke="#3b82f6" strokeOpacity="0.3" />
        <text x="-30" y="7" fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="600">🛡 RAKSHA AI</text>
        <text x="22" y="7" fill="#10b981" fontSize="7" fontFamily="monospace">PROTECTED</text>
      </g>

      {/* Corner accents */}
      <line x1="20" y1="20" x2="50" y2="20" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="50" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="580" y1="300" x2="550" y2="300" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="580" y1="300" x2="580" y2="270" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="1" />
    </svg>
  );
}
