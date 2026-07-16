import type { TranscriptScenario } from './types';

export const SCENARIO_BATCH_2: TranscriptScenario[] = [
  {
    id: 'loan-app-scam',
    label: 'Fake Loan App Scam',
    description: 'Scammer poses as a loan agent from a fake lending app, demanding a processing fee before loan disbursal into the victim\'s bank account.',
    transcript: [
      { speaker: 'scammer', text: 'Namaste! I am calling from FinCredit Loans. Your personal loan of ₹3,50,000 has been pre-approved. Can you confirm your SBI account number?' },
      { speaker: 'victim', text: 'Yes, it is 39876543210. How did you get my details?' },
      { speaker: 'scammer', text: 'Sir, your KYC was submitted through the FinCredit app last week. I just need a small processing fee of ₹4,999 via UPI to release the funds immediately.' },
      { speaker: 'victim', text: 'Processing fee? I thought the loan amount itself would cover that.' },
      { speaker: 'scammer', text: 'No no sir, SEBI rules require a refundable processing fee before disbursal. Send it to our verified UPI ID: fincreditpayments@ybl. The money will be added to your loan amount.' },
      { speaker: 'victim', text: 'Let me think about it.' },
      { speaker: 'scammer', text: 'Sir, this offer expires today. If you do not pay now, your CIBIL score will be affected. Hurry up and send the amount.' }
    ],
    riskLevel: 'HIGH',
    finalScore: 83,
    redFlags: [
      { phrase: 'Pre-approved loan without application', category: 'Unsolicited Financial Offer', severity: 'HIGH' },
      { phrase: 'Processing fee required before disbursal', category: 'Advance Fee Fraud', severity: 'CRITICAL' },
      { phrase: 'Refundable processing fee via UPI', category: 'Payment Irregularity', severity: 'CRITICAL' },
      { phrase: 'Offer expires today', category: 'Urgency Tactic', severity: 'HIGH' },
      { phrase: 'CIBIL score threat', category: 'Intimidation', severity: 'HIGH' },
      { phrase: 'Unverified UPI handle', category: 'Suspicious Payment Method', severity: 'CRITICAL' },
      { phrase: 'SEBI rules cited falsely', category: 'Authority Impersonation', severity: 'MEDIUM' },
      { phrase: 'Loan amount to cover processing fee', category: 'Logical Contradiction', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'SentimentAgent', action: 'Detected coercive urgency patterns in speaker speech', timestamp: '00:02:15', triggeredBy: 'Urgency and intimidation phrases' },
      { agent: 'NetworkAgent', action: 'UPI ID fincreditpayments@ybl flagged as unregistered entity', timestamp: '00:03:00', triggeredBy: 'UPI verification failure' },
      { agent: 'BehaviorAgent', action: 'Identified advance fee scam pattern: fee before service delivery', timestamp: '00:03:30', triggeredBy: 'Processing fee demand' },
      { agent: 'KnowledgeAgent', action: 'Cross-referenced RBI guidelines: legitimate lenders never charge upfront fees', timestamp: '00:03:45', triggeredBy: 'Regulatory violation pattern' },
      { agent: 'AlertAgent', action: 'Escalated alert to user with HIGH risk warning', timestamp: '00:04:00', triggeredBy: 'Multiple red flag convergence' }
    ],
    evidencePackage: [
      { type: 'conversation_log', title: 'Full Transcript with Scam Indicators', content: 'Scammer demands ₹4,999 processing fee via UPI before loan disbursal. Uses urgency tactics and false SEBI references.' },
      { type: 'upi_lookup', title: 'UPI ID Verification Report', content: 'UPI ID fincreditpayments@ybl is not registered to any RBI-licensed NBFC. Associated phone number +91 98765 43210 has 3 prior fraud complaints on CyberCrime portal.' },
      { type: 'web_intel', title: 'Domain Intelligence Report', content: 'FinCredit Loans has no registered website on MCA records. The app link shared via SMS is hosted on a free domain registered 4 days ago.' }
    ],
    aiAnalysis: {
      confidence: 88,
      scamProbability: 91,
      threatCategory: 'Advance Fee Loan Fraud',
      deepReasoning: 'The scammer follows a textbook advance fee fraud pattern: offering an unsolicited loan, then demanding a upfront processing fee via UPI. Legitimate RBI-regulated lenders (SBI, HDFC, ICICI) never charge fees before loan disbursal. The urgency tactics ("offer expires today") and CIBIL score threats are classic pressure mechanisms designed to prevent the victim from verifying independently.',
      psychologicalTricks: [
        'Authority impersonation - citing SEBI rules to appear legitimate',
        'Scarcity pressure - claiming the offer expires today',
        'Fear of loss - threatening CIBIL score damage',
        'Anchoring - presenting a large loan amount to distract from the fee'
      ],
      safeActions: [
        'Do not send any money to the UPI ID provided',
        'Verify the lender on RBI\'s registered NBFC list at rbi.org.in',
        'Check the FinCredit app on official app stores and read reviews',
        'Contact your SBI branch directly to verify any loan offers'
      ],
      victimBehavior: 'The victim showed initial caution by questioning how their details were obtained and challenged the processing fee logic, which is a positive sign. However, they did not immediately hang up, suggesting they may still be persuadable.',
      preventionAdvice: 'Never pay upfront fees for loans. All legitimate lenders deduct charges from the loan amount. Verify any financial offer by calling the bank\'s official customer care number from their website. Report suspicious calls to 1930 (Cyber Crime Helpline).',
      insights: [
        { id: 'urgency', label: 'Urgency Level', value: 'Extreme', score: 92, icon: '⚡', color: '#ef4444' },
        { id: 'authority', label: 'Authority Impersonation', value: 'SEBI/RBI claimed', score: 85, icon: '🏛️', color: '#f97316' },
        { id: 'payment', label: 'Payment Risk', value: 'UPI to unknown entity', score: 95, icon: '💳', color: '#ef4444' },
        { id: 'pretext', label: 'Pretext Quality', value: 'Generic loan offer', score: 70, icon: '📋', color: '#eab308' }
      ],
      recommendations: [
        'Block the caller\'s phone number immediately',
        'Report the UPI ID to your bank and on the National Cybercrime Portal',
        'File a complaint at cybercrime.gov.in with call details',
        'Warn family members about this type of loan scam',
        'Install a call-blocking app to filter similar calls'
      ]
    }
  },
  {
    id: 'electricity-bill',
    label: 'Fake Electricity Bill Scam',
    description: 'Scammer impersonates a BSES/Delhi Electricity (or state discom) official claiming the victim\'s electricity will be disconnected for unpaid bills and demands immediate payment.',
    transcript: [
      { speaker: 'scammer', text: 'Hello, this is Rajesh Kumar from BSES Yamuna Power. Your electricity connection to flat 4B, Vasant Kunj is due for disconnection. Outstanding amount is ₹6,340.' },
      { speaker: 'victim', text: 'What? I paid my bill last week through PhonePe. Check your records.' },
      { speaker: 'scammer', text: 'Ma\'am, the payment was not reflected in our system. You need to pay immediately or the disconnection team will come within 2 hours. You will also face a reconnection charge of ₹2,500.' },
      { speaker: 'victim', text: 'Two hours? That is not enough time to verify anything.' },
      { speaker: 'scammer', text: 'I understand your concern. You can pay right now through our official UPI link. Send ₹6,340 to bsespayment@okaxis. I will send you the receipt on WhatsApp immediately.' },
      { speaker: 'victim', text: 'Can I pay at the BSES office instead?' },
      { speaker: 'scammer', text: 'The office is closed for lunch and will reopen tomorrow. By then your connection will be cut and you will have to pay reconnection charges. Better to pay now and save ₹2,500 extra.' }
    ],
    riskLevel: 'MEDIUM',
    finalScore: 68,
    redFlags: [
      { phrase: 'Immediate disconnection threat within 2 hours', category: 'Artificial Urgency', severity: 'HIGH' },
      { phrase: 'Payment via personal UPI instead of official channels', category: 'Suspicious Payment Method', severity: 'HIGH' },
      { phrase: 'Reconnection charge added as penalty', category: 'Financial Pressure Tactic', severity: 'MEDIUM' },
      { phrase: 'Office conveniently closed', category: 'Pretext to prevent verification', severity: 'HIGH' },
      { phrase: 'WhatsApp receipt instead of official receipt', category: 'Informal Documentation', severity: 'MEDIUM' },
      { phrase: 'Claiming payment not reflected', category: 'False System Error Claim', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'SentimentAgent', action: 'Detected fear-based manipulation in disconnection threat', timestamp: '00:01:30', triggeredBy: 'Disconnection urgency pattern' },
      { agent: 'NetworkAgent', action: 'Verified UPI ID bsespayment@okaxis does not belong to BSES Rajdhani/Yamuna', timestamp: '00:02:00', triggeredBy: 'UPI verification mismatch' },
      { agent: 'KnowledgeAgent', action: 'Cross-checked BSES official payment methods - UPI not accepted for bill payment', timestamp: '00:02:30', triggeredBy: 'Official process discrepancy' },
      { agent: 'BehaviorAgent', action: 'Identified pattern: prevent in-person verification by claiming office closure', timestamp: '00:03:00', triggeredBy: 'Verification avoidance pattern' },
      { agent: 'AlertAgent', action: 'Generated MEDIUM risk alert with disconnection scam warning', timestamp: '00:03:15', triggeredBy: 'Composite scam indicators' }
    ],
    evidencePackage: [
      { type: 'call_log', title: 'Caller Details and Pattern Match', content: 'Caller number +91 11 4567 8901 matches 12 similar scam reports in Delhi NCR over the past 30 days on Truecaller.' },
      { type: 'upi_lookup', title: 'UPI Verification Report', content: 'UPI ID bsespayment@okaxis is registered to an individual named Amit Sharma, not to BSES Delhi. No corporate GSTIN linked.' }
    ],
    aiAnalysis: {
      confidence: 75,
      scamProbability: 72,
      threatCategory: 'Utility Impersonation Fraud',
      deepReasoning: 'The scammer exploits the real fear of electricity disconnection, which is a common household concern. The addition of reconnection charges creates additional financial pressure. The key giveaway is the demand for UPI payment to a personal account and the claim that the office is closed, which is designed to prevent independent verification. Legitimate discoms send written notices before disconnection and never demand UPI payments over the phone.',
      psychologicalTricks: [
        'Fear of loss - threatening to cut electricity supply',
        'Financial penalty escalation - adding reconnection charges',
        'Time pressure - 2-hour disconnection deadline',
        'Convenience trap - offering "easy" UPI payment to avoid the hassle'
      ],
      safeActions: [
        'Do not pay through the UPI link provided',
        'Check your electricity bill on the official BSES or state discom website/app',
        'Call the official BSES customer care number from your bill',
        'Visit the nearest BSES office in person if needed',
        'Check your PhonePe transaction history for the payment confirmation'
      ],
      victimBehavior: 'The victim correctly remembered paying the bill and questioned the scammer\'s claim. They also asked about alternative payment methods at the office, showing healthy skepticism. However, they did not immediately disconnect the call.',
      preventionAdvice: 'Always verify utility bills through official apps (BSES Rajdhani app, DISCOM apps) or websites. Never make payments based on phone call demands. Legitimate utilities send disconnection notices by post at least 15 days in advance. Save your payment receipts.',
      insights: [
        { id: 'urgency', label: 'Urgency Level', value: 'High - 2hr deadline', score: 78, icon: '⏰', color: '#f97316' },
        { id: 'verification', label: 'Verification Blocked', value: 'Office claimed closed', score: 72, icon: '🚫', color: '#f97316' },
        { id: 'payment', label: 'Payment Channel', value: 'Unofficial UPI', score: 80, icon: '💰', color: '#ef4444' },
        { id: 'authority', label: 'Identity Verification', value: 'Unverifiable caller', score: 65, icon: '🔍', color: '#eab308' }
      ],
      recommendations: [
        'Check your BSES account on the official app or website',
        'Call BSES Delhi from the number on your electricity bill',
        'Report the scammer\'s number to the Cybercrime helpline 1930',
        'Share this warning with your housing society/RWA WhatsApp group',
        'File a complaint on cybercrime.gov.in'
      ]
    }
  },
  {
    id: 'sim-swap',
    label: 'SIM Swap Fraud Attempt',
    description: 'Scammer attempts to fraudulently port the victim\'s mobile number to a new SIM by impersonating them at a telecom operator or through a fake verification call.',
    transcript: [
      { speaker: 'scammer', text: 'Good afternoon, I am calling from Jio Customer Support. We are upgrading all 4G SIMs to 5G. Your SIM card will stop working tomorrow unless you complete the upgrade now.' },
      { speaker: 'victim', text: 'I just got this SIM six months ago. Why do I need an upgrade?' },
      { speaker: 'scammer', text: 'Sir, 4G networks are being decommissioned. I need to verify your identity to process the 5G SIM. Please share the OTP that was just sent to your number.' },
      { speaker: 'victim', text: 'I did not receive any OTP. And I thought Jio already has 5G.' },
      { speaker: 'scammer', text: 'The OTP is for SIM verification, not for the network. It was sent from Jio system. Check again, it should be a 6-digit code. Without this, your current SIM will be deactivated permanently.' },
      { speaker: 'victim', text: 'This does not sound right. Jio never called me before for upgrades.' },
      { speaker: 'scammer', text: 'Sir, this is a one-time mandatory upgrade. If you do not cooperate, we cannot guarantee your number will be retained. The OTP expires in 3 minutes.' },
      { speaker: 'victim', text: 'I am going to call Jio customer care myself to verify this.' }
    ],
    riskLevel: 'CRITICAL',
    finalScore: 93,
    redFlags: [
      { phrase: 'OTP sharing requested', category: 'Authentication Bypass', severity: 'CRITICAL' },
      { phrase: 'SIM deactivation threat', category: 'Intimidation', severity: 'CRITICAL' },
      { phrase: '4G decommissioned claim', category: 'False Technical Information', severity: 'HIGH' },
      { phrase: 'OTP expires in 3 minutes', category: 'Time Pressure', severity: 'HIGH' },
      { phrase: 'Permanent number loss threat', category: 'Fear Inducement', severity: 'CRITICAL' },
      { phrase: 'Unsolicited verification call', category: 'Unsolicited Contact', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'SentimentAgent', action: 'Detected escalating panic tactics - permanent deactivation threat', timestamp: '00:02:00', triggeredBy: 'Fear escalation pattern' },
      { agent: 'NetworkAgent', action: 'Caller number +91 85888 XXXXX flagged - not a registered Jio corporate number', timestamp: '00:01:15', triggeredBy: 'Caller ID verification failure' },
      { agent: 'KnowledgeAgent', action: 'Verified Jio 5G is available on existing 4G SIMs - no physical upgrade needed', timestamp: '00:02:30', triggeredBy: 'Technical claim contradiction' },
      { agent: 'BehaviorAgent', action: 'Identified SIM swap attack pattern: OTP interception for number hijacking', timestamp: '00:03:00', triggeredBy: 'OTP request pattern' },
      { agent: 'KnowledgeAgent', action: 'RBI advisory: Never share OTP with anyone, including bank/telecom officials', timestamp: '00:03:15', triggeredBy: 'OTP sharing request' },
      { agent: 'AlertAgent', action: 'CRITICAL alert - active SIM swap fraud attempt detected', timestamp: '00:03:30', triggeredBy: 'Multiple critical indicators' }
    ],
    evidencePackage: [
      { type: 'call_recording', title: 'Audio Transcript Analysis', content: 'Complete call recording showing scammer requesting OTP under pretext of 5G upgrade. Tone analysis indicates rehearsed script with escalating urgency.' },
      { type: 'telecom_lookup', title: 'Number Ownership Verification', content: 'Caller number registered to prepaid SIM purchased in bulk at Delhi NCR dealer. Jio confirms no 4G decommissioning planned and no OTP-based upgrades in progress.' }
    ],
    aiAnalysis: {
      confidence: 94,
      scamProbability: 96,
      threatCategory: 'SIM Swap / Number Hijacking',
      deepReasoning: 'This is a SIM swap attack, one of the most dangerous scams in India. If the victim shares the OTP, the scammer can port their number to a new SIM, gaining access to all OTPs for banking, UPI, and email accounts. The "5G upgrade" pretext is a well-documented vector used by organized fraud rings. Jio and all Indian telecom operators have confirmed they never ask for OTPs over the phone. The 3-minute expiry threat is designed to prevent the victim from calling the real Jio helpline.',
      psychologicalTricks: [
        'Fear of permanent loss - number deactivation threat',
        'Technical confusion - using 4G/5G jargon to appear credible',
        'Artificial time pressure - 3-minute OTP expiry',
        'Authority impersonation - posing as Jio customer support',
        'Social proof implication - suggesting this is a mass upgrade affecting everyone'
      ],
      safeActions: [
        'NEVER share the OTP with anyone over the phone',
        'Hang up immediately and call Jio from 199 (official helpline)',
        'Check the MyJio app for any upgrade notifications',
        'Lock your SIM with a port-out PIN through your telecom app',
        'If you already shared the OTP, immediately call your bank to block UPI'
      ],
      victimBehavior: 'The victim showed excellent awareness by refusing to share the OTP and correctly identifying that Jio does not call for upgrades. Their decision to call Jio directly is the ideal response. This victim behavior should be highlighted as a model response.',
      preventionAdvice: 'NEVER share OTPs with anyone, regardless of who they claim to be. Telecom operators do not need your OTP for any upgrades. Lock your SIM number porting through your operator\'s app. If you suspect SIM swap, immediately call your bank to block all digital transactions.',
      insights: [
        { id: 'otp_risk', label: 'OTP Request Risk', value: 'CRITICAL - Number hijack', score: 98, icon: '🔑', color: '#ef4444' },
        { id: 'technical', label: 'Technical Deception', value: '5G upgrade false claim', score: 88, icon: '📡', color: '#f97316' },
        { id: 'urgency', label: 'Time Pressure', value: '3-min expiry', score: 85, icon: '⏱️', color: '#ef4444' },
        { id: 'impact', label: 'Potential Impact', value: 'Full financial compromise', score: 97, icon: '💥', color: '#dc2626' }
      ],
      recommendations: [
        'Immediately call Jio helpline 199 to verify and report',
        'Lock SIM porting through the MyJio app settings',
        'If OTP was shared, call your bank immediately to freeze UPI',
        'Report to Cyber Crime at 1930 with call recording',
        'Enable SIM lock and PIN on your phone',
        'Warn family members - elderly are prime targets for this scam'
      ]
    }
  },
  {
    id: 'fake-customer-care',
    label: 'Fake Customer Care Scam',
    description: 'Scammer impersonates Amazon or Flipkart customer support, claiming a refund is pending and requesting access to the victim\'s phone to "process" it.',
    transcript: [
      { speaker: 'scammer', text: 'Namaste! I am Arjun from Amazon India Customer Service. I am calling regarding your recent order #OD-482917365. There was a billing error and we owe you a refund of ₹12,499.' },
      { speaker: 'victim', text: 'Oh really? I did order something last week. What do I need to do?' },
      { speaker: 'scammer', text: 'Nothing complicated, ma\'am. Just download an app called AnyDesk from the Play Store so I can guide you through the refund process on your screen. It will just take 2 minutes.' },
      { speaker: 'victim', text: 'Why do you need access to my phone? Can you not just refund to my original payment method?' },
      { speaker: 'scammer', text: 'The refund was flagged because your UPI address has changed. I need to verify your current banking details through screen sharing. This is standard procedure for amounts above ₹10,000.' },
      { speaker: 'victim', text: 'That does not make sense. Amazon does not ask for screen sharing.' },
      { speaker: 'scammer', text: 'Ma\'am, this is a new SEBI-mandated verification for high-value refunds. If you do not complete this by today, the refund amount will be forfeited and you will lose ₹12,499.' }
    ],
    riskLevel: 'HIGH',
    finalScore: 77,
    redFlags: [
      { phrase: 'AnyDesk app download requested', category: 'Remote Access Tool', severity: 'CRITICAL' },
      { phrase: 'Screen sharing for refund', category: 'Unnecessary Remote Access', severity: 'CRITICAL' },
      { phrase: 'Refund amount above ₹10,000 threshold', category: 'False Regulatory Reference', severity: 'HIGH' },
      { phrase: 'Refund forfeited if not completed today', category: 'Loss Aversion Pressure', severity: 'HIGH' },
      { phrase: 'UPI address changed claim', category: 'Fabricated Problem', severity: 'MEDIUM' },
      { phrase: 'Order number provided without verification', category: 'Pretext Building', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'Flagged AnyDesk as known remote access tool used in financial fraud', timestamp: '00:01:30', triggeredBy: 'AnyDesk reference detected' },
      { agent: 'BehaviorAgent', action: 'Identified screen-sharing scam pattern - remote access leads to UPI/banking theft', timestamp: '00:02:00', triggeredBy: 'Remote access request pattern' },
      { agent: 'NetworkAgent', action: 'Caller number traced to VoIP service, not Amazon corporate line', timestamp: '00:01:45', triggeredBy: 'Caller ID analysis' },
      { agent: 'KnowledgeAgent', action: 'Amazon India policy: refunds are always processed to original payment method automatically', timestamp: '00:02:30', triggeredBy: 'Process contradiction' },
      { agent: 'AlertAgent', action: 'HIGH risk alert - screen sharing scam with remote access tool', timestamp: '00:03:00', triggeredBy: 'AnyDesk + refund scam convergence' }
    ],
    evidencePackage: [
      { type: 'conversation_log', title: 'Scam Call Transcript Analysis', content: 'Scammer requests AnyDesk installation under refund pretext. Uses SEBI compliance claim to justify screen sharing. Pattern matches known refund scam playbook.' },
      { type: 'app_intel', title: 'AnyDesk Usage Risk Assessment', content: 'AnyDesk provides full remote access to device. When installed, scammer can view UPI PINs, banking apps, and OTPs in real-time. Has been flagged by CERT-In for fraud use.' }
    ],
    aiAnalysis: {
      confidence: 85,
      scamProbability: 83,
      threatCategory: 'Remote Access / Screen Sharing Fraud',
      deepReasoning: 'This is a classic refund scam where the scammer uses a screen-sharing app to gain full access to the victim\'s device. AnyDesk and TeamViewer allow the scammer to see everything on the screen including UPI PINs, OTPs, and banking credentials. The "refund" is the bait. Amazon and Flipkart never use third-party screen-sharing tools for refunds - they process refunds automatically to the original payment method. The SEBI mandate claim is fabricated.',
      psychologicalTricks: [
        'Greed trigger - offering an unexpected refund',
        'Authority impersonation - posing as Amazon customer service',
        'Loss aversion - threatening forfeiture of refund amount',
        'Technical complexity exploitation - using "standard procedure" to justify screen sharing',
        'False regulatory compliance - SEBI mandate fabrication'
      ],
      safeActions: [
        'NEVER download AnyDesk, TeamViewer, or similar apps when asked by a caller',
        'Hang up and call Amazon customer care from the app or website',
        'Check your Amazon order history directly - no refund pending means it is a scam',
        'If you installed AnyDesk, immediately uninstall it and disconnect',
        'If you shared screen access, immediately change all banking passwords and PINs'
      ],
      victimBehavior: 'The victim questioned the need for screen sharing and correctly identified that Amazon does not require such access. This skepticism is the ideal response. The victim should hang up immediately upon hearing "AnyDesk" or any remote access tool.',
      preventionAdvice: 'Amazon, Flipkart, and other e-commerce platforms never ask you to install screen-sharing apps. Refunds are always processed automatically to the original payment method. Never share your screen with anyone. If you suspect compromise, disconnect from the internet immediately.',
      insights: [
        { id: 'remote_access', label: 'Remote Access Risk', value: 'CRITICAL - AnyDesk', score: 96, icon: '🖥️', color: '#ef4444' },
        { id: 'financial', label: 'Financial Bait', value: '₹12,499 fake refund', score: 75, icon: '💰', color: '#f97316' },
        { id: 'authority', label: 'Impersonation Level', value: 'Amazon CS + SEBI', score: 80, icon: '🎭', color: '#f97316' },
        { id: 'impact', label: 'Data at Risk', value: 'All banking + UPI access', score: 94, icon: '🔓', color: '#ef4444' }
      ],
      recommendations: [
        'NEVER install AnyDesk or TeamViewer when asked by a caller',
        'Check your Amazon app for order status and refund status directly',
        'Call Amazon customer care from the number in the app',
        'If AnyDesk was installed, uninstall it and disconnect all sessions',
        'Report the number to Amazon India and Cybercrime.gov.in',
        'Educate family members about remote access scam'
      ]
    }
  },
  {
    id: 'courier-scam',
    label: 'Courier Package Scam',
    description: 'Scammer poses as customs or courier company official, claiming a package is stuck at customs or delivery hub and requires a fee for clearance or redelivery.',
    transcript: [
      { speaker: 'scammer', text: 'Hello, I am calling from BlueDart Courier Services. You have a package from Amazon UK worth ₹45,000 that is stuck at Mumbai customs. You need to pay ₹3,200 customs duty to release it.' },
      { speaker: 'victim', text: 'I did not order anything from the UK. What is in the package?' },
      { speaker: 'scammer', text: 'It is an iPhone 15 Pro Max registered to your Aadhaar number. Someone used your identity to place the order. If you do not pay the customs duty, the package will be seized and a case will be filed against you.' },
      { speaker: 'victim', text: 'A case against me? That does not sound right.' },
      { speaker: 'scammer', text: 'Yes, under the Customs Act, the recipient is responsible. You can avoid this by paying ₹3,200 to our UPI ID bluedart.clearance@paytm. I will email you the customs receipt.' },
      { speaker: 'victim', text: 'Can I just refuse the package?' },
      { speaker: 'scammer', text: 'No ma\'am, once the package is in your name, you cannot refuse it. You must pay or face legal action. The deadline is today 5 PM.' }
    ],
    riskLevel: 'MEDIUM',
    finalScore: 63,
    redFlags: [
      { phrase: 'Customs duty for undelivered package', category: 'Advance Fee Fraud', severity: 'HIGH' },
      { phrase: 'Legal action threat under Customs Act', category: 'Intimidation', severity: 'HIGH' },
      { phrase: 'UPI payment to non-corporate account', category: 'Suspicious Payment', severity: 'HIGH' },
      { phrase: 'Package registered to victim\'s Aadhaar', category: 'Identity Theft Pretext', severity: 'MEDIUM' },
      { phrase: 'Same-day payment deadline', category: 'Artificial Urgency', severity: 'MEDIUM' },
      { phrase: 'Cannot refuse package claim', category: 'False Legal Claim', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'Verified: BlueDart never collects customs duty via UPI - duties are paid to customs directly', timestamp: '00:02:00', triggeredBy: 'Payment method discrepancy' },
      { agent: 'NetworkAgent', action: 'UPI ID bluedart.clearance@paytm not linked to BlueDart Corp entity', timestamp: '00:02:15', triggeredBy: 'Corporate UPI verification failed' },
      { agent: 'BehaviorAgent', action: 'Identified customs scam pattern: fake duty demand for non-existent package', timestamp: '00:02:45', triggeredBy: 'Advance fee for clearance' },
      { agent: 'KnowledgeAgent', action: 'Customs Act does not impose personal liability for undelivered packages', timestamp: '00:03:00', triggeredBy: 'Legal claim verification' },
      { agent: 'AlertAgent', action: 'Generated MEDIUM risk alert for courier/customs impersonation scam', timestamp: '00:03:15', triggeredBy: 'Multiple scam indicators confirmed' }
    ],
    evidencePackage: [
      { type: 'call_analysis', title: 'Scam Call Pattern Analysis', content: 'Caller uses BlueDart branding and customs terminology to create legitimacy. Legal threat and deadline create panic. Matches known courier scam pattern reported across India.' },
      { type: 'web_intel', title: 'Package Tracking Verification', content: 'No active BlueDart shipment exists for the victim\'s address. The tracking number provided by the caller does not exist in BlueDart\'s system.' }
    ],
    aiAnalysis: {
      confidence: 78,
      scamProbability: 70,
      threatCategory: 'Courier/Customs Impersonation Fraud',
      deepReasoning: 'The scammer uses a combination of package delivery anxiety and legal intimidation. The claim that someone ordered an iPhone using the victim\'s Aadhaar creates fear of identity theft, while the customs duty demand creates an immediate financial obligation. In reality, customs duties are paid to the government, not to courier companies, and certainly not via personal UPI. BlueDart does not collect duty payments through UPI.',
      psychologicalTricks: [
        'Fear of identity theft - claiming Aadhaar misuse',
        'Legal intimidation - Customs Act reference',
        'Urgency - same-day deadline',
        'Loss aversion - threatening seizure and case filing',
        'False authority - impersonating government process'
      ],
      safeActions: [
        'Do not pay any customs duty via UPI to a courier company',
        'Check your BlueDart account and recent orders on Amazon/Flipkart',
        'Call BlueDart official number from their website to verify',
        'If you suspect identity theft, check your Aadhaar usage on uidai.gov.in',
        'Report the call to Cyber Crime at 1930'
      ],
      victimBehavior: 'The victim correctly noted they had not ordered anything from the UK and questioned the legal threat. Their suggestion to refuse the package is a reasonable response. The victim should be advised to hang up and verify independently.',
      preventionAdvice: 'Legitimate customs duties are paid at the port of entry, not via UPI. Courier companies collect duty on behalf of customs only through official channels. Never pay based on phone call demands. Always verify package status through the courier\'s official website.',
      insights: [
        { id: 'urgency', label: 'Deadline Pressure', value: 'Same-day 5PM', score: 72, icon: '⏰', color: '#f97316' },
        { id: 'legal', label: 'Legal Threat', value: 'Customs Act citation', score: 70, icon: '⚖️', color: '#eab308' },
        { id: 'identity', label: 'Identity Theft Fear', value: 'Aadhaar misuse claim', score: 75, icon: '🪪', color: '#f97316' },
        { id: 'payment', label: 'Payment Risk', value: 'UPI to fake corporate', score: 78, icon: '💸', color: '#ef4444' }
      ],
      recommendations: [
        'Check your Amazon/Flipkart accounts for any international orders',
        'Call BlueDart from their official website number',
        'Verify Aadhaar usage history at myaadhaar.uidai.gov.in',
        'Report the scammer\'s UPI ID to Paytm and Cybercrime',
        'Share warning with friends and family about courier scams',
        'File complaint at cybercrime.gov.in with call details'
      ]
    }
  },
  {
    id: 'investment-scam',
    label: 'Ponzi/Investment Scam',
    description: 'Scammer lures the victim into a fake investment scheme promising 40-60% monthly returns through a "proprietary trading algorithm" and asks for increasing deposits.',
    transcript: [
      { speaker: 'scammer', text: 'Hi! I am Priya from WealthGrow Capital. We are SEBI-registered and our algorithmic trading fund gives 2% daily returns. Several of your colleagues from TCS have already invested. Would you like to start with just ₹25,000?' },
      { speaker: 'victim', text: '2% daily? That sounds too good to be true. What is the risk?' },
      { speaker: 'scammer', text: 'Our AI-driven system has a 99.7% win rate. You can see live trading dashboards. I will send you a WhatsApp link to our investor group where people share their profits daily. Last month, someone turned ₹50,000 into ₹2,30,000.' },
      { speaker: 'victim', text: 'Can I withdraw my money anytime?' },
      { speaker: 'scammer', text: 'Absolutely! Instant withdrawal within 24 hours. We use ICICI escrow accounts. But the minimum lock-in for maximum returns is 30 days. After that, your profits compound daily.' },
      { speaker: 'victim', text: 'I need to think about this. Let me do some research first.' },
      { speaker: 'scammer', text: 'Of course! But I must tell you, this batch closes tomorrow. Our last batch saw 180% returns in 90 days. I can hold a spot for you if you transfer just ₹25,000 to our ICICI account before 6 PM today.' },
      { speaker: 'victim', text: 'WhatsApp group and daily profits? How do I know this is legitimate?' }
    ],
    riskLevel: 'CRITICAL',
    finalScore: 90,
    redFlags: [
      { phrase: '2% daily returns (40%+ monthly)', category: 'Unrealistic Returns', severity: 'CRITICAL' },
      { phrase: '99.7% win rate claim', category: 'Statistically Impossible', severity: 'CRITICAL' },
      { phrase: 'WhatsApp investor group with profit sharing', category: 'Social Proof Manipulation', severity: 'HIGH' },
      { phrase: 'Batch closes tomorrow', category: 'Artificial Scarcity', severity: 'HIGH' },
      { phrase: 'TCS colleagues already invested', category: 'Social Engineering', severity: 'HIGH' },
      { phrase: 'ICICI escrow account claim', category: 'False Institutional Association', severity: 'HIGH' },
      { phrase: 'Lock-in period for maximum returns', category: 'Fund Lock-In Tactic', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'Verified: SEBI has no registered entity named WealthGrow Capital matching this description', timestamp: '00:02:00', triggeredBy: 'SEBI registration claim' },
      { agent: 'KnowledgeAgent', action: '2% daily return = 730% annualized - far exceeds any legitimate investment', timestamp: '00:02:15', triggeredBy: 'Return rate analysis' },
      { agent: 'BehaviorAgent', action: 'Identified Ponzi scheme indicators: unrealistic returns, social proof, urgency', timestamp: '00:02:30', triggeredBy: 'Multi-signal Ponzi pattern' },
      { agent: 'NetworkAgent', action: 'ICICI account provided not under corporate name WealthGrow Capital', timestamp: '00:03:00', triggeredBy: 'Bank account verification' },
      { agent: 'KnowledgeAgent', action: 'Ponzi scheme characteristics match SEC/SEBI red flag checklist', timestamp: '00:03:15', triggeredBy: 'Ponzi pattern confirmation' },
      { agent: 'AlertAgent', action: 'CRITICAL alert - active investment fraud / Ponzi scheme attempt', timestamp: '00:03:30', triggeredBy: 'High-confidence Ponzi detection' }
    ],
    evidencePackage: [
      { type: 'web_intel', title: 'SEBI Registration Verification', content: 'Search of SEBI registered intermediaries database shows no entity named WealthGrow Capital. The claimed SEBI registration number provided by the scammer belongs to a completely different, unrelated brokerage firm.' },
      { type: 'financial_analysis', title: 'Return Rate Feasibility Analysis', content: '2% daily compound returns = 730% annualized. No legitimate trading strategy in history has sustained such returns. This matches classic Ponzi scheme return patterns documented by SEBI in past enforcement actions.' },
      { type: 'social_intel', title: 'WhatsApp Group Analysis', content: 'The investor WhatsApp group contains 200+ members but only 15 actual phone numbers. Remaining accounts are likely bots. Multiple "profit screenshots" have been reverse-image-searched and found to be fabricated.' }
    ],
    aiAnalysis: {
      confidence: 92,
      scamProbability: 95,
      threatCategory: 'Ponzi / Investment Fraud',
      deepReasoning: 'This is a textbook Ponzi scheme. The promised 2% daily returns are mathematically unsustainable and exceed any legitimate investment vehicle. The WhatsApp group with "profit-sharing" is a well-known social proof mechanism used by Indian Ponzi operators. SEBI has repeatedly warned about such schemes. The mention of ICICI escrow is designed to borrow credibility from a trusted bank name, but the account is likely a mule account. The "batch closing" creates artificial scarcity to prevent due diligence.',
      psychologicalTricks: [
        'Social proof - claiming TCS colleagues have invested',
        'Greed amplification - 2% daily / 180% in 90 days examples',
        'Authority borrowing - SEBI registration and ICICI escrow claims',
        'Scarcity - batch closing tomorrow',
        'Fear of missing out - profit examples creating FOMO',
        'Low barrier to entry - starting at ₹25,000'
      ],
      safeActions: [
        'DO NOT invest any money in this scheme',
        'Verify the company on SEBI\'s registered intermediaries list at sebi.gov.in',
        'Check SEBI\'s investor alerts and warnings page',
        'Report the scheme to SEBI at scores.gov.in',
        'Block the caller and WhatsApp contact',
        'Warn anyone in your network who may have been contacted'
      ],
      victimBehavior: 'The victim showed appropriate skepticism by questioning the high returns and asking about risk and withdrawal. Their instinct to "do research first" is exactly right. However, they engaged for multiple rounds - ideally they should hang up after hearing "2% daily returns."',
      preventionAdvice: 'Any investment promising more than 15-20% annual returns should be treated with extreme suspicion. Verify all SEBI registrations independently at sebi.gov.in. Never invest based on WhatsApp group social proof. Report suspicious schemes to SEBI and police.',
      insights: [
        { id: 'returns', label: 'Return Rate Analysis', value: '730% annualized - impossible', score: 98, icon: '📈', color: '#ef4444' },
        { id: 'sebi', label: 'Regulatory Status', value: 'Unverified / Fake registration', score: 92, icon: '🏛️', color: '#ef4444' },
        { id: 'ponzi', label: 'Ponzi Indicators', value: '6/7 classic signs matched', score: 95, icon: '⚠️', color: '#dc2626' },
        { id: 'social', label: 'Social Engineering', value: 'Workplace reference + WhatsApp group', score: 88, icon: '👥', color: '#f97316' }
      ],
      recommendations: [
        'Do NOT invest any money - this is almost certainly a Ponzi scheme',
        'Report to SEBI at scores.gov.in or email to investor@sebi.gov.in',
        'File a complaint at cybercrime.gov.in',
        'Report the WhatsApp group to WhatsApp for fraud',
        'Check if any acquaintances have already been victimized',
        'Share SEBI\'s investor alerts with family and friends'
      ]
    }
  },
  {
    id: 'matrimonial-scam',
    label: 'Matrimonial Site Scam',
    description: 'Scammer creates a fake profile on a matrimonial site, develops a romantic relationship, then fabricates emergencies to extract money from the victim over weeks or months.',
    transcript: [
      { speaker: 'scammer', text: 'Hey, I saw your profile on BharatMatrimony. I am Dr. Ananya Sharma, working as a consultant at AIIMS Delhi. Your profile really stood out. Can we talk on WhatsApp?' },
      { speaker: 'victim', text: 'Sure! I would like to get to know you. You are a doctor at AIIMS? That is impressive.' },
      { speaker: 'scammer', text: 'Yes! I have been very busy with a research project. Actually, that is why I am messaging you now - I am posted at a remote health camp in Ladakh for 3 months. The internet here is terrible. Can you help me with a small thing?' },
      { speaker: 'victim', text: 'Of course, what do you need?' },
      { speaker: 'scammer', text: 'My salary account is with Axis Bank but there is no branch here. I need ₹15,000 urgently for some medical supplies for patients. Can you transfer via Google Pay to my personal UPI? I will return it the day I get back to Delhi.' },
      { speaker: 'victim', text: 'Fifteen thousand for medical supplies? Shouldn\'t the hospital provide that?' },
      { speaker: 'scammer', text: 'It is for emergency supplies the government camp does not cover. I feel terrible asking, but you are the only person I trust here. I promise to pay you back with interest when we meet in Delhi.' }
    ],
    riskLevel: 'HIGH',
    finalScore: 81,
    redFlags: [
      { phrase: 'Rapid move to WhatsApp from matrimonial site', category: 'Platform Evasion', severity: 'MEDIUM' },
      { phrase: 'Posted at remote location with poor connectivity', category: 'Isolation Pretext', severity: 'HIGH' },
      { phrase: 'Financial emergency within days of first contact', category: 'Emergency Extraction', severity: 'CRITICAL' },
      { phrase: 'Personal UPI for "official" expenses', category: 'Payment Irregularity', severity: 'HIGH' },
      { phrase: 'Promise to return money with interest', category: 'Bait Promise', severity: 'HIGH' },
      { phrase: 'Authority claim - AIIMS doctor', category: 'Credential Impersonation', severity: 'HIGH' },
      { phrase: 'Emotional dependency building - "only person I trust"', category: 'Emotional Manipulation', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'BehaviorAgent', action: 'Detected romance scam pattern: rapid trust building followed by financial extraction', timestamp: '00:02:00', triggeredBy: 'Romance-to-money extraction pattern' },
      { agent: 'KnowledgeAgent', action: 'AIIMS Delhi doctor registry does not contain an Ananya Sharma matching this profile', timestamp: '00:02:30', triggeredBy: 'Credential verification failure' },
      { agent: 'SentimentAgent', action: 'Identified emotional manipulation tactics - guilt, trust, romantic interest', timestamp: '00:02:45', triggeredBy: 'Emotional exploitation phrases' },
      { agent: 'NetworkAgent', action: 'Profile photo linked to stock image from health blog', timestamp: '00:03:00', triggeredBy: 'Reverse image search match' },
      { agent: 'AlertAgent', action: 'HIGH risk alert - matrimonial romance fraud in progress', timestamp: '00:03:15', triggeredBy: 'Confirmed romance scam indicators' }
    ],
    evidencePackage: [
      { type: 'profile_analysis', title: 'Matrimonial Profile Verification', content: 'Profile photo matches a stock image from a health blog. Bio text contains phrases commonly found in romance scam templates. Account created 2 weeks ago with no verification badge.' },
      { type: 'call_log', title: 'Communication Pattern Analysis', content: 'Quick migration from matrimonial platform to WhatsApp. All messages sent between 11 PM and 2 AM, consistent with scammer working hours from a different timezone or shift pattern.' }
    ],
    aiAnalysis: {
      confidence: 82,
      scamProbability: 86,
      threatCategory: 'Romance / Matrimonial Fraud',
      deepReasoning: 'This is a romance scam adapted for the Indian matrimonial context. The scammer builds emotional connection quickly, establishes an impressive but unverifiable identity (AIIMS doctor), creates isolation (remote posting), and then introduces a financial emergency. The ₹15,000 amount is deliberately chosen to be small enough that the victim might pay to preserve the relationship. In reality, this is the first of many escalating demands. The profile and photo are almost certainly fabricated.',
      psychologicalTricks: [
        'Romantic idealization - flattering the victim\'s profile',
        'Authority and prestige - AIIMS doctor claim',
        'Vulnerability exploitation - remote, isolated location',
        'Reciprocity - offering to meet in Delhi and repay with interest',
        'Emotional dependency - "you are the only person I trust"',
        'Low initial ask - ₹15,000 to test compliance'
      ],
      safeActions: [
        'Do not send any money to this person',
        'Reverse-image search the profile photo using Google Images',
        'Verify the doctor\'s identity on AIIMS website or by calling AIIMS',
        'Insist on a video call before sending any money',
        'Report the profile to BharatMatrimony for fraud',
        'Talk to a trusted friend or family member about this situation'
      ],
      victimBehavior: 'The victim questioned the need for medical supplies (should the hospital provide them?), which shows good critical thinking. They should be encouraged to verify the person\'s identity before any financial involvement.',
      preventionAdvice: 'Never send money to someone you have not met in person. Video call before trusting. Verify professional credentials independently. Romance scammers escalate from small amounts to larger ones. Report suspicious profiles to the matrimonial platform immediately.',
      insights: [
        { id: 'romance', label: 'Romance Scam Pattern', value: 'Classic build-trust-extract', score: 88, icon: '💔', color: '#f97316' },
        { id: 'identity', label: 'Identity Verification', value: 'Unverifiable - stock photo', score: 90, icon: '🪪', color: '#ef4444' },
        { id: 'financial', label: 'Financial Extraction', value: '₹15,000 initial ask', score: 75, icon: '💸', color: '#f97316' },
        { id: 'emotional', label: 'Emotional Manipulation', value: 'Trust + guilt + romance', score: 82, icon: '🎭', color: '#f97316' }
      ],
      recommendations: [
        'Do NOT send any money - this is a romance scam',
        'Reverse-image search the profile photo immediately',
        'Report the profile to BharatMatrimony as fraudulent',
        'Cease all communication with this person',
        'If money was already sent, report to Cyber Crime at 1930',
        'Share your experience to help others avoid similar scams'
      ]
    }
  },
  {
    id: 'screen-sharing',
    label: 'Screen Sharing Scam',
    description: 'Scammer convinces the victim to install a remote access tool (AnyDesk/TeamViewer) under the pretense of tech support, then accesses banking apps and steals UPI PINs and credentials.',
    transcript: [
      { speaker: 'scammer', text: 'Hello, I am Rajiv from ICICI Bank Technical Support. We have detected 3 unauthorized transactions from your account totaling ₹87,500. We need to secure your account immediately.' },
      { speaker: 'victim', text: 'What?! ₹87,500? I did not do any such transactions. Please block my card right now!' },
      { speaker: 'scammer', text: 'We are already working on it. But to fully secure your account, I need you to install a screen-sharing app so I can guide you through the security verification steps. Please download AnyDesk from the Play Store.' },
      { speaker: 'victim', text: 'Why do I need screen sharing to block a card?' },
      { speaker: 'scammer', text: 'Sir, the fraud is happening through your mobile app. I need to see your screen to identify which device is compromised. This is a new SEBI protocol for high-value fraud cases. Please hurry - the transactions are still happening.' },
      { speaker: 'victim', text: 'The transactions are still happening? But you said you were blocking them!' },
      { speaker: 'scammer', text: 'We are trying, sir. The hacker is very fast. Please open AnyDesk and share the 9-digit code with me so I can connect and stop this immediately. Every second counts!' }
    ],
    riskLevel: 'CRITICAL',
    finalScore: 96,
    redFlags: [
      { phrase: 'AnyDesk installation requested', category: 'Remote Access Tool', severity: 'CRITICAL' },
      { phrase: 'Screen sharing for bank security', category: 'Unnecessary Remote Access', severity: 'CRITICAL' },
      { phrase: 'Ongoing unauthorized transactions', category: 'Fear Inducement', severity: 'CRITICAL' },
      { phrase: 'SEBI protocol claim for tech support', category: 'Authority Impersonation', severity: 'HIGH' },
      { phrase: '9-digit AnyDesk code requested', category: 'Remote Connection Setup', severity: 'CRITICAL' },
      { phrase: 'Contradiction: blocking but still happening', category: 'Logical Inconsistency', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'AnyDesk: known remote access tool used in ₹500Cr+ banking frauds in India', timestamp: '00:01:00', triggeredBy: 'AnyDesk reference' },
      { agent: 'BehaviorAgent', action: 'Fear-urgency contradiction detected: claiming to block while claiming fraud continues', timestamp: '00:02:00', triggeredBy: 'Logic contradiction in narrative' },
      { agent: 'KnowledgeAgent', action: 'ICICI Bank confirms: no SEBI protocol requires screen sharing for fraud prevention', timestamp: '00:02:15', triggeredBy: 'False SEBI protocol' },
      { agent: 'NetworkAgent', action: 'Caller number is VoIP, not from ICICI Bank corporate range', timestamp: '00:01:30', triggeredBy: 'Caller ID analysis' },
      { agent: 'BehaviorAgent', action: 'Identified urgency escalation: fake ongoing transactions to force immediate compliance', timestamp: '00:02:30', triggeredBy: 'Escalation pattern' },
      { agent: 'AlertAgent', action: 'CRITICAL alert - active remote access banking fraud attempt', timestamp: '00:03:00', triggeredBy: 'High-confidence remote access scam' }
    ],
    evidencePackage: [
      { type: 'call_recording', title: 'Urgency Manipulation Analysis', content: 'Scammer creates false emergency of ongoing fraud to pressure victim into installing AnyDesk. Contradicts self by claiming to block transactions while simultaneously claiming they continue.' },
      { type: 'threat_intel', title: 'AnyDesk Fraud Pattern Intel', content: 'AnyDesk has been used in numerous Indian banking frauds. Once the 9-digit code is shared, scammer gains full control of device including visibility of UPI PINs, banking credentials, and OTPs in real-time.' },
      { type: 'bank_verification', title: 'ICICI Bank Official Statement', content: 'ICICI Bank confirms they never ask customers to install screen-sharing apps. All fraud prevention is done through their secure systems. No SEBI protocol mandates screen sharing.' },
    ],
    aiAnalysis: {
      confidence: 96,
      scamProbability: 98,
      threatCategory: 'Remote Access Banking Fraud',
      deepReasoning: 'This is one of the most dangerous scams currently operating in India, with losses exceeding ₹500 crore annually. The scammer creates a panic about ongoing fraud, then uses that urgency to get the victim to install AnyDesk. Once installed and the 9-digit code is shared, the scammer has complete control of the device - they can see the screen, read OTPs, and even operate the banking app themselves. The victim loses everything in minutes. ICICI Bank, like all Indian banks, never asks for screen sharing.',
      psychologicalTricks: [
        'Panic induction - fake ongoing fraud',
        'Authority impersonation - ICICI Bank tech support',
        'Urgency maximization - every second counts',
        'Fear amplification - ₹87,500 already stolen',
        'False rescue framing - positioning as the savior',
        'Technical intimidation - SEBI protocol jargon'
      ],
      safeActions: [
        'NEVER install AnyDesk, TeamViewer, or any remote access app when asked',
        'Hang up and call your bank from the number on the back of your card',
        'Check your actual bank balance through the official app',
        'If you installed AnyDesk, immediately uninstall it and disconnect',
        'If you shared the code, disconnect from internet and call your bank immediately',
        'Block all UPI and net banking access through the bank\'s helpline'
      ],
      victimBehavior: 'The victim asked the right question about why screen sharing is needed for card blocking. They also caught the logical contradiction about blocking vs ongoing fraud. These are excellent critical thinking responses. They should hang up immediately if remote access is requested.',
      preventionAdvice: 'NEVER install screen-sharing apps when someone calls claiming to be from your bank. Banks have secure systems that do not require your device access. If you receive such a call, hang up and call your bank from the number on your card. If you installed the app, disconnect from internet immediately.',
      insights: [
        { id: 'remote', label: 'Remote Access Risk', value: 'CRITICAL - AnyDesk 9-digit code', score: 98, icon: '🖥️', color: '#ef4444' },
        { id: 'financial', label: 'Financial Exposure', value: 'Full banking access at risk', score: 96, icon: '🏦', color: '#dc2626' },
        { id: 'urgency', label: 'Panic Level', value: 'Maximum - ongoing fraud claim', score: 95, icon: '🚨', color: '#ef4444' },
        { id: 'authority', label: 'Impersonation', value: 'ICICI Bank + SEBI', score: 90, icon: '🎭', color: '#f97316' }
      ],
      recommendations: [
        'NEVER install AnyDesk or TeamViewer when asked by a caller',
        'Hang up and call ICICI Bank from 1800-10-800 (official helpline)',
        'Check your actual balance in the ICICI iMobile app',
        'If AnyDesk was installed, uninstall immediately and disconnect internet',
        'If code was shared, call bank to freeze all accounts immediately',
        'Report to Cyber Crime at 1930 and cybercrime.gov.in',
        'Share this warning with elderly family members'
      ]
    }
  },
  {
    id: 'instagram-scam',
    label: 'Instagram Clone Account Scam',
    description: 'Scammer creates a clone/duplicate of the victim\'s Instagram profile, then contacts the victim\'s followers requesting money for a "personal emergency."',
    transcript: [
      { speaker: 'scammer', text: 'Hey, I made a new account because my main one got hacked. Please follow this new account and let your friends know. I need to reach people urgently - I am stuck in Bangkok and need money for a flight home.' },
      { speaker: 'victim', text: 'Wait, this IS my account. Someone is using my photos and name. How did this happen?' },
      { speaker: 'friend', text: 'Hey, I just got a DM from what looked like your account asking me to send ₹8,000 to a Paytm number. It had your exact photos. I almost sent it!' },
      { speaker: 'victim', text: 'That was not me! Someone cloned my profile. What Paytm number did they give you?' },
      { speaker: 'friend', text: 'It was 98765 43210. They said you lost your wallet in Bangkok and needed emergency flight money. Had all your photos and even knew details about your trip to Thailand last year.' },
      { speaker: 'victim', text: 'This is terrifying. They must have gone through my Instagram highlights. I need to report this immediately.' }
    ],
    riskLevel: 'MEDIUM',
    finalScore: 58,
    redFlags: [
      { phrase: 'Clone profile with stolen photos', category: 'Identity Theft', severity: 'HIGH' },
      { phrase: 'Emergency money request via DM', category: 'Social Engineering', severity: 'HIGH' },
      { phrase: 'Stranded abroad emergency story', category: 'Fabricated Emergency', severity: 'MEDIUM' },
      { phrase: 'Paytm number for money transfer', category: 'Untraceable Payment', severity: 'MEDIUM' },
      { phrase: 'Knew personal details from profile', category: 'Open Source Intelligence', severity: 'MEDIUM' },
      { phrase: 'New account claim', category: 'Account Migration Pretext', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'NetworkAgent', action: 'Detected duplicate Instagram profile with matching photos', timestamp: '00:01:00', triggeredBy: 'Profile clone detection' },
      { agent: 'BehaviorAgent', action: 'Identified social engineering pattern: impersonation + emergency + financial request', timestamp: '00:01:30', triggeredBy: 'Clone-to-money extraction pattern' },
      { agent: 'KnowledgeAgent', action: 'Instagram profile scraping is common - public highlights/stories reveal personal info', timestamp: '00:02:00', triggeredBy: 'OSINT vulnerability identified' },
      { agent: 'AlertAgent', action: 'Generated MEDIUM alert for profile impersonation and social engineering', timestamp: '00:02:30', triggeredBy: 'Active impersonation fraud' }
    ],
    evidencePackage: [
      { type: 'social_intel', title: 'Clone Profile Analysis', content: 'Fake account created 3 days ago with identical profile photo, bio, and 15 scraped photos from the victim\'s account. Has followed 200+ of the victim\'s followers and sent DMs to 47 people requesting money.' },
      { type: 'message_log', title: 'DM Templates Recovered', content: 'Scammer sent templated messages to multiple followers with slight variations. Common elements: stranded abroad, lost wallet, need flight money. All messages contain the same Paytm number 98765 43210.' }
    ],
    aiAnalysis: {
      confidence: 80,
      scamProbability: 78,
      threatCategory: 'Profile Impersonation / Social Engineering',
      deepReasoning: 'This is a social engineering attack leveraging the victim\'s social media presence. The scammer scrapes publicly available photos and personal information to create a convincing clone. By contacting the victim\'s followers who recognize the photos, they exploit existing trust. The "stranded abroad" story creates empathy and urgency. While the victim caught it quickly, many followers may not verify before sending money. The Paytm number can be traced but may be a mule account.',
      psychologicalTricks: [
        'Trust exploitation - using victim\'s real photos and details',
        'Empathy trigger - stranded in foreign country',
        'Urgency - need to get home urgently',
        'Social proof - targeting people who already know and trust the victim',
        'Low amount - ₹8,000 small enough for friends to help without questioning'
      ],
      safeActions: [
        'Report the fake Instagram account immediately',
        'Post a warning story on your real account alerting followers',
        'Send a mass DM to followers warning about the clone',
        'File a complaint on cybercrime.gov.in',
        'Enable two-factor authentication on Instagram',
        'Make your profile private to limit photo scraping'
      ],
      victimBehavior: 'The victim immediately recognized the clone and took it seriously. Their friend\'s response of verifying before sending money is the correct behavior. The victim should post a public warning on their real account immediately.',
      preventionAdvice: 'Make your Instagram profile private to prevent photo scraping. Enable two-factor authentication. When you learn of a clone account, immediately alert all your followers. Always verify unusual money requests through a phone call or video call.',
      insights: [
        { id: 'identity', label: 'Identity Theft', value: 'Full profile clone', score: 72, icon: '👤', color: '#f97316' },
        { id: 'social', label: 'Social Engineering', value: 'Trust network exploitation', score: 75, icon: '👥', color: '#f97316' },
        { id: 'osint', label: 'Data Exposure', value: 'Public photos + stories scraped', score: 68, icon: '🔍', color: '#eab308' },
        { id: 'financial', label: 'Financial Request', value: '₹8,000 per target', score: 60, icon: '💸', color: '#eab308' }
      ],
      recommendations: [
        'Report the clone account to Instagram immediately',
        'Post a warning story on your real account',
        'DM all followers to warn about the fake account',
        'Enable two-factor authentication on all social media',
        'Set Instagram profile to private',
        'File a Cyber Crime complaint at 1930',
        'Review what personal information is publicly visible on your profiles'
      ]
    }
  },
  {
    id: 'aadhaar-scam',
    label: 'Aadhaar Suspension Scam',
    description: 'Scammer impersonates UIDAI (Unique Identification Authority of India) calling to inform the victim that their Aadhaar card is being suspended due to "linking issues" or "biometric mismatch."',
    transcript: [
      { speaker: 'scammer', text: 'Namaste! I am calling from UIDAI Aadhaar Helpline. Your Aadhaar number 4521-XXXX-7891 has been flagged for deactivation because it is not linked to your PAN card. Your Aadhaar will be suspended in 24 hours.' },
      { speaker: 'victim', text: 'What? I linked my Aadhaar with PAN last year through the income tax website. Check your records.' },
      { speaker: 'scammer', text: 'Sir, our records show it is not linked. To fix this, I need to verify your details. Please confirm your full name, date of birth, and the last 4 digits of your Aadhaar.' },
      { speaker: 'victim', text: 'You are calling me - you should already have my details. Why are you asking me to share them?' },
      { speaker: 'scammer', text: 'Sir, for security we need you to confirm your identity before we can access your file. This is UIDAI protocol. Also, your biometrics need re-verification. Visit the nearest Aadhaar centre or I can help you do it online for ₹250.' },
      { speaker: 'victim', text: 'UIDAI never calls people directly. I am going to check my Aadhaar status on the uidai.gov.in website myself.' },
      { speaker: 'scammer', text: 'Sir, the website takes 7-10 days to update. If you do not act now, your Aadhaar will be deactivated and you cannot use it for bank accounts, passports, or SIM cards. This affects your entire life.' }
    ],
    riskLevel: 'HIGH',
    finalScore: 74,
    redFlags: [
      { phrase: 'Aadhaar deactivation threat', category: 'Service Disruption Threat', severity: 'HIGH' },
      { phrase: 'Personal details requested back', category: 'Data Harvesting', severity: 'CRITICAL' },
      { phrase: 'UIDAI direct call claim', category: 'Authority Impersonation', severity: 'HIGH' },
      { phrase: '₹250 for biometric re-verification', category: 'Advance Fee', severity: 'HIGH' },
      { phrase: 'Website takes 7-10 days claim', category: 'Verification Prevention', severity: 'MEDIUM' },
      { phrase: 'Life impact escalation - bank, passport, SIM', category: 'Fear Amplification', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'UIDAI confirms they never call citizens directly for Aadhaar issues', timestamp: '00:01:30', triggeredBy: 'UIDAI impersonation claim' },
      { agent: 'BehaviorAgent', action: 'Detected data harvesting pattern: requesting personal details under verification pretext', timestamp: '00:02:00', triggeredBy: 'Personal data request pattern' },
      { agent: 'NetworkAgent', action: 'Caller number not from UIDAI or government range', timestamp: '00:01:15', triggeredBy: 'Caller ID verification' },
      { agent: 'KnowledgeAgent', action: 'Aadhaar linking with PAN is done through income tax portal, not by UIDAI helpline calls', timestamp: '00:02:30', triggeredBy: 'Process discrepancy' },
      { agent: 'KnowledgeAgent', action: 'UIDAI biometric re-verification is free at Aadhaar centres - no ₹250 fee exists', timestamp: '00:02:45', triggeredBy: 'Fee verification' },
      { agent: 'AlertAgent', action: 'HIGH risk alert - Aadhaar identity theft attempt', timestamp: '00:03:00', triggeredBy: 'Multiple identity fraud indicators' }
    ],
    evidencePackage: [
      { type: 'govt_verification', title: 'UIDAI Official Communication', content: 'UIDAI has repeatedly issued advisories stating they never call citizens to ask for Aadhaar details, threaten deactivation, or request payments. All Aadhaar services are available through uidai.gov.in and Aadhaar centres only.' },
      { type: 'call_analysis', title: 'Caller Profile Analysis', content: 'Caller number +91 11 2345 XXXX is a VoIP number, not a government line. Multiple similar complaints filed on Truecaller with "UIDAI Scam" tag in past 30 days.' }
    ],
    aiAnalysis: {
      confidence: 85,
      scamProbability: 82,
      threatCategory: 'Government Identity Impersonation',
      deepReasoning: 'The scammer impersonates UIDAI to create fear about Aadhaar suspension, which would affect the victim\'s banking, mobile, and government services. The request for personal details under "verification" is the actual goal - harvesting Aadhaar data for identity theft. The ₹250 fee claim exploits the common knowledge that Aadhaar services exist but lack of awareness about pricing. UIDAI has no direct call service and Aadhaar biometric update is free.',
      psychologicalTricks: [
        'Government authority impersonation - UIDAI name drop',
        'Life disruption fear - bank, passport, SIM all affected',
        'Data harvesting through fake verification',
        'Time pressure - 24-hour deactivation deadline',
        'Price anchoring - small ₹250 fee to seem legitimate',
        'Dismissal of alternatives - "website takes 7-10 days"'
      ],
      safeActions: [
        'NEVER share Aadhaar, PAN, or personal details with unsolicited callers',
        'Check Aadhaar status yourself at myaadhaar.uidai.gov.in',
        'Call UIDAI helpline 1947 to verify any claims',
        'Visit the nearest Aadhaar centre for any updates',
        'Report the caller to Cyber Crime at 1930',
        'Lock your Aadhaar biometrics through the UIDAI website'
      ],
      victimBehavior: 'The victim showed excellent awareness by questioning why the caller needed their details, correctly noting that UIDAI never calls citizens. Their decision to check independently on the official website is the ideal response. They should hang up and not engage further.',
      preventionAdvice: 'UIDAI never calls citizens. Always check your Aadhaar status at myaadhaar.uidai.gov.in. Lock your biometrics if not actively using them. Never share Aadhaar details over the phone. Report suspicious calls to 1930.',
      insights: [
        { id: 'authority', label: 'Authority Impersonation', value: 'UIDAI - government agency', score: 82, icon: '🏛️', color: '#f97316' },
        { id: 'data', label: 'Data Harvesting', value: 'Aadhaar + PAN + DOB targeted', score: 88, icon: '🪪', color: '#ef4444' },
        { id: 'fear', label: 'Life Disruption Fear', value: 'Bank + passport + SIM threat', score: 80, icon: '😰', color: '#f97316' },
        { id: 'fee', label: 'Fee Claim', value: '₹250 for free service', score: 70, icon: '💰', color: '#eab308' }
      ],
      recommendations: [
        'NEVER share Aadhaar details with unsolicited callers',
        'Check Aadhaar status at myaadhaar.uidai.gov.in',
        'Call UIDAI helpline 1947 to report the incident',
        'Lock Aadhaar biometrics through the UIDAI portal',
        'Report the number to Cyber Crime at 1930',
        'Enable Aadhaar lock to prevent misuse'
      ]
    }
  },
  {
    id: 'gold-investment',
    label: 'Fake Gold Investment Scam',
    description: 'Scammer invites the victim to invest in gold through a fake commodity trading platform, showing fabricated profits initially before demanding larger deposits and then disappearing.',
    transcript: [
      { speaker: 'scammer', text: 'Hello! I am Vikram from GoldStar Investments. We offer gold trading on MCX with guaranteed 15-20% monthly returns. Our analysts provide daily signals. You can start with just ₹10,000.' },
      { speaker: 'victim', text: 'Gold trading? Is this through a proper broker? I have heard of people losing money in commodity trading.' },
      { speaker: 'scammer', text: 'Absolutely! We are registered with MCX and SEBI. I will share our registration number. Many of our clients from Bangalore have made lakhs. Look, I will add you to our Telegram channel where we post daily profits. See this client made ₹3,40,000 profit last month.' },
      { speaker: 'victim', text: 'Can I start with ₹10,000 and see how it goes?' },
      { speaker: 'scammer', text: 'Of course! Once you see profits in the first week, you will want to invest more. Our VIP clients who invest ₹5,00,000+ get personalized calls and 25% guaranteed returns. Transfer ₹10,000 to our HDFC account and I will set up your trading account today.' },
      { speaker: 'victim', text: 'What if I want to withdraw my profits?' },
      { speaker: 'scammer', text: 'Instant withdrawal! Anytime. Just message me on Telegram and the amount is in your bank within 2 hours. We have never missed a single withdrawal in 3 years.' }
    ],
    riskLevel: 'HIGH',
    finalScore: 86,
    redFlags: [
      { phrase: 'Guaranteed 15-20% monthly returns', category: 'Unrealistic Returns', severity: 'CRITICAL' },
      { phrase: 'MCX/SEBI registration claim', category: 'Credential Verification Needed', severity: 'HIGH' },
      { phrase: 'Telegram channel for profit proof', category: 'Fabricated Social Proof', severity: 'HIGH' },
      { phrase: 'VIP tier with higher returns', category: 'Tiered Investment Trap', severity: 'HIGH' },
      { phrase: 'Guaranteed 25% for large investments', category: 'Escalating Promise', severity: 'CRITICAL' },
      { phrase: 'Never missed a withdrawal in 3 years', category: 'Too Good to Be True', severity: 'HIGH' },
      { phrase: 'Personal bank account for investment', category: 'Informal Payment', severity: 'HIGH' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'Searched SEBI/MCX database: no registered entity "GoldStar Investments"', timestamp: '00:02:00', triggeredBy: 'Registration claim verification' },
      { agent: 'KnowledgeAgent', action: 'Gold price volatility analysis: 15-20% monthly guaranteed returns are impossible in legitimate commodity trading', timestamp: '00:02:15', triggeredBy: 'Return rate feasibility' },
      { agent: 'BehaviorAgent', action: 'Identified Ponzi escalation pattern: small entry, promise of bigger returns, VIP tier', timestamp: '00:02:30', triggeredBy: 'Tiered investment trap pattern' },
      { agent: 'NetworkAgent', action: 'HDFC account provided does not match any registered commodity broker', timestamp: '00:03:00', triggeredBy: 'Bank account verification' },
      { agent: 'KnowledgeAgent', action: 'Telegram profit channels are a known vector for fabricated trading results', timestamp: '00:03:15', triggeredBy: 'Social proof fabrication pattern' },
      { agent: 'AlertAgent', action: 'HIGH risk alert - commodity trading fraud / investment scam', timestamp: '00:03:30', triggeredBy: 'Multiple fraud indicators confirmed' }
    ],
    evidencePackage: [
      { type: 'financial_analysis', title: 'Gold Price Historical Analysis', content: 'MCX Gold price history shows maximum monthly gain of 8.3% in the past 5 years. Guaranteed 15-20% monthly returns are 2-3x the best historical performance. This is mathematically impossible to guarantee.' },
      { type: 'registration_check', title: 'SEBI/MCX Entity Verification', content: 'No entity named "GoldStar Investments" is registered with SEBI or MCX as a broker, sub-broker, or investment advisor. The registration number provided by the scammer belongs to a different, unrelated brokerage.' },
      { type: 'social_intel', title: 'Telegram Channel Analysis', content: 'The Telegram channel contains profit screenshots that have been manipulated - EXIF data shows they were created in image editing software, not captured from actual trading platforms.' }
    ],
    aiAnalysis: {
      confidence: 87,
      scamProbability: 89,
      threatCategory: 'Commodity Trading / Investment Fraud',
      deepReasoning: 'This is a sophisticated investment scam using gold commodity trading as the vehicle. The scammer borrows credibility from legitimate institutions (MCX, SEBI, HDFC Bank) while operating a fraudulent operation. The initial small investment of ₹10,000 is designed to build trust - the victim may see fabricated profits and invest more. The VIP tier with ₹5,00,000+ investments and 25% guaranteed returns is where the real fraud occurs. This follows the classic Ponzi model where early investors\' "profits" come from later investors\' deposits.',
      psychologicalTricks: [
        'Authority borrowing - MCX, SEBI, HDFC Bank names',
        'Social proof - Telegram channel with profit screenshots',
        'Low barrier entry - ₹10,000 starting amount',
        'Escalation ladder - VIP tier with higher returns',
        'Guaranteed returns - removing perceived risk',
        'Withdrawal ease promise - reducing hesitation'
      ],
      safeActions: [
        'Do NOT invest any money in this scheme',
        'Verify the entity on SEBI\'s website at sebi.gov.in',
        'Check MCX registered brokers list',
        'Never invest through personal bank accounts - only through registered brokers',
        'Report to SEBI at scores.gov.in',
        'Block the Telegram channel and caller'
      ],
      victimBehavior: 'The victim showed appropriate caution by asking about broker registration and expressing concern about commodity trading losses. Their willingness to start small is better than jumping in large, but the fundamental issue is that this is a fraudulent scheme.',
      preventionAdvice: 'All legitimate gold/commodity trading must go through SEBI-registered brokers using SEBI-regulated platforms. Never invest through Telegram channels or personal bank accounts. Verify any broker on SEBI\'s website before investing. No one can guarantee returns in market-traded commodities.',
      insights: [
        { id: 'returns', label: 'Return Guarantee', value: '15-20% monthly - impossible', score: 92, icon: '📈', color: '#ef4444' },
        { id: 'registration', label: 'Broker Registration', value: 'Unverified / Fake SEBI number', score: 88, icon: '🏛️', color: '#ef4444' },
        { id: 'social', label: 'Social Proof', value: 'Fabricated Telegram profits', score: 82, icon: '📱', color: '#f97316' },
        { id: 'escalation', label: 'Escalation Risk', value: 'VIP tier targets ₹5L+', score: 90, icon: '📊', color: '#ef4444' }
      ],
      recommendations: [
        'Do NOT invest any money - this is a fraudulent scheme',
        'Verify any broker at sebi.gov.in before investing',
        'Check MCX registered members list',
        'Report to SEBI at scores.gov.in',
        'Report the Telegram channel as fraud',
        'Block all communication with this person',
        'Share this warning with anyone considering gold trading'
      ]
    }
  },
  {
    id: 'charity-scam',
    label: 'Fake Charity Scam',
    description: 'Scammer exploits a recent disaster or crisis (flood, earthquake, pandemic) by posing as a charity worker, soliciting donations via UPI for fake relief operations.',
    transcript: [
      { speaker: 'scammer', text: 'Namaste! I am calling from the Bharat Relief Foundation. As you know, the Assam floods have displaced 5 lakh people. We are running an emergency relief drive. Can you donate ₹500 to help families who have lost everything?' },
      { speaker: 'victim', text: 'I have seen the news, it is terrible. How do I know my money will actually reach the flood victims?' },
      { speaker: 'scammer', text: 'Ma\'am, we are a registered NGO under 12A of the Income Tax Act. You will get a tax deduction receipt. Send ₹500 to our Google Pay: bharatrelief@gpay. Every rupee goes directly to Assam.' },
      { speaker: 'victim', text: 'Can I donate through your website instead? I prefer using a payment gateway with a proper receipt.' },
      { speaker: 'scammer', text: 'Our website payment gateway is down due to heavy traffic from donations. Google Pay is the fastest way right now. We need to dispatch relief trucks by tomorrow morning. Your ₹500 can feed a family for a week.' },
      { speaker: 'victim', text: 'What is your 12A registration number? I want to verify on the Income Tax website.' },
      { speaker: 'scammer', text: 'Our registration number is AABCB1234F. But ma\'am, families are dying while we talk. Please, even ₹200 will help. Can I send you photos of the affected families to see the impact of your donation?' }
    ],
    riskLevel: 'MEDIUM',
    finalScore: 61,
    redFlags: [
      { phrase: 'Google Pay to personal ID for charity', category: 'Suspicious Payment Method', severity: 'HIGH' },
      { phrase: 'Website payment gateway conveniently down', category: 'Verification Prevention', severity: 'HIGH' },
      { phrase: 'Emotional photos as persuasion tool', category: 'Emotional Manipulation', severity: 'MEDIUM' },
      { phrase: 'Urgency - relief trucks dispatching tomorrow', category: 'Time Pressure', severity: 'MEDIUM' },
      { phrase: '12A registration claim needs verification', category: 'Credential Claim', severity: 'MEDIUM' },
      { phrase: 'Downgrading donation amount under pressure', category: 'Pressure Adaptation', severity: 'MEDIUM' }
    ],
    agentFires: [
      { agent: 'KnowledgeAgent', action: 'Cross-referenced 12A registration AABCB1234F - no matching NGO found in Income Tax database', timestamp: '00:02:00', triggeredBy: 'NGO registration verification' },
      { agent: 'BehaviorAgent', action: 'Detected emergency exploitation pattern: disaster + charity + UPI payment', timestamp: '00:02:15', triggeredBy: 'Disaster charity scam pattern' },
      { agent: 'NetworkAgent', action: 'Google Pay ID bharatrelief@gpay not linked to any registered NGO entity', timestamp: '00:02:30', triggeredBy: 'Payment ID verification' },
      { agent: 'KnowledgeAgent', action: 'Legitimate NGOs use payment gateways (Razorpay, PayU) not personal UPI for donations', timestamp: '00:03:00', triggeredBy: 'Donation channel analysis' },
      { agent: 'AlertAgent', action: 'Generated MEDIUM risk alert for fake charity / disaster fraud', timestamp: '00:03:15', triggeredBy: 'Charity fraud indicators' }
    ],
    evidencePackage: [
      { type: 'ngo_verification', title: '12A Registration Verification', content: 'Registration number AABCB1234F does not exist in the Income Tax Department\'s 12A/80G registered NGO database. The name "Bharat Relief Foundation" has no MCA or FCRA registration either.' },
      { type: 'social_intel', title: 'Disaster Exploitation Pattern', content: 'This scam appears within 48 hours of major disaster news. Similar calls were reported across 6 Indian cities during the Assam floods. The same Google Pay ID was used in all cases.' }
    ],
    aiAnalysis: {
      confidence: 76,
      scamProbability: 74,
      threatCategory: 'Charity / Disaster Fraud',
      deepReasoning: 'The scammer exploits genuine humanitarian concern about a real disaster to extract money. The use of a legitimate-sounding NGO name, 12A tax deduction claim, and emotional appeals are designed to overcome skepticism. The key indicator is the demand for Google Pay to a personal ID instead of through a legitimate payment gateway. Real NGOs have professional donation infrastructure. The website being "down" is a classic excuse to prevent verification.',
      psychologicalTricks: [
        'Emotional exploitation - real disaster affecting real people',
        'Tax benefit appeal - 12A deduction promise',
        'Urgency - trucks dispatching tomorrow',
        'Guilt pressure - "families are dying while we talk"',
        'Amount anchoring - starting at ₹500, then offering ₹200',
        'Visual persuasion - offering to send photos of affected families'
      ],
      safeActions: [
        'Do NOT send money via Google Pay to this number',
        'Verify the NGO on the Income Tax 12A/80G database',
        'Donate through established, verified organizations (PM Relief Fund, Red Cross, Goonj)',
        'Check the NGO\'s FCRA registration for foreign funding legitimacy',
        'Report the number to Cyber Crime at 1930',
        'Share the scam warning on social media'
      ],
      victimBehavior: 'The victim asked the right questions: how to verify the money reaches victims, requesting website payment, and asking for the 12A registration number. This is good skepticism. The victim should verify the registration number independently before any donation.',
      preventionAdvice: 'Only donate to verified, well-known charities. Check NGO registrations on the Income Tax and MCA websites. Never donate via personal UPI IDs. Use established platforms like GiveIndia, Ketto, or government relief funds for disaster donations.',
      insights: [
        { id: 'emotion', label: 'Emotional Exploitation', value: 'Real disaster, fake charity', score: 80, icon: '💔', color: '#f97316' },
        { id: 'payment', label: 'Payment Channel', value: 'Personal Google Pay - not NGO', score: 78, icon: '💸', color: '#ef4444' },
        { id: 'verification', label: 'NGO Verification', value: '12A number invalid', score: 85, icon: '🔍', color: '#ef4444' },
        { id: 'timing', label: 'Disaster Timing', value: 'Within 48hrs of news', score: 72, icon: '⏰', color: '#f97316' }
      ],
      recommendations: [
        'Do NOT send money to the Google Pay ID provided',
        'Donate through verified platforms: GiveIndia, Ketto, PM Relief Fund',
        'Check NGO at incometaxindia.gov.in for 12A/80G registration',
        'Report the scammer to Cyber Crime at 1930',
        'Share warning about fake charity calls with your network',
        'Verify any charity before donating through multiple sources'
      ]
    }
  }
];
