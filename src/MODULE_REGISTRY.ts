import {
  Scan, MessageCircle, ShieldAlert, AlertTriangle,
  Flag, Brain, HelpCircle, Settings,
  Banknote, Network, Map,
} from 'lucide-react';

export type ModuleId =
  | 'landing'
  | 'scam-scanner' | 'message-checker' | 'call-protection'
  | 'safety-center' | 'scam-alerts' | 'report-fraud'
  | 'threat-insights' | 'fraud-network' | 'crime-heatmap'
  | 'help-center' | 'settings';

export interface ModuleDef {
  id: ModuleId;
  label: string;
  section: string;
  icon: typeof Scan;
  shortLabel: string;
  description: string;
}

export const MODULES: ModuleDef[] = [
  { id: 'scam-scanner', label: 'Digital Arrest Scam Detector', section: 'Detection', icon: Scan, shortLabel: 'Detector', description: 'Real-time transcript analysis — flags impersonation scripts, urgency tactics & money-transfer demands during the call' },
  { id: 'message-checker', label: 'Citizen Fraud Shield', section: 'Detection', icon: MessageCircle, shortLabel: 'Shield', description: 'WhatsApp/IVR-style assistant — check any suspicious call or message in seconds, in your own language' },
  { id: 'call-protection', label: 'Counterfeit Currency Checker', section: 'Detection', icon: Banknote, shortLabel: 'Currency', description: 'RBI-standard security feature verification for ₹500 and ₹2000 notes with confidence scoring' },
  { id: 'safety-center', label: 'Safety Center', section: 'Protection', icon: ShieldAlert, shortLabel: 'Safety', description: 'Emergency contacts, safety score, and personal protection tools' },
  { id: 'scam-alerts', label: 'Live Scam Alerts', section: 'Protection', icon: AlertTriangle, shortLabel: 'Alerts', description: 'Real-time trending scam alerts and threat warnings across India' },
  { id: 'report-fraud', label: 'File NCRP Report', section: 'Protection', icon: Flag, shortLabel: 'Report', description: 'File complaints directly to NCRB/cybercrime.gov.in with auto-generated evidence packages' },
  { id: 'threat-insights', label: 'Threat Intelligence', section: 'Intelligence', icon: Brain, shortLabel: 'Intelligence', description: 'AI-powered threat intelligence mapping organized fraud operations and scam networks' },
  { id: 'fraud-network', label: 'Fraud Network Graph', section: 'Intelligence', icon: Network, shortLabel: 'Network', description: 'Force-directed graph mapping scammer numbers, UPI IDs & wallets to expose coordinated fraud rings' },
  { id: 'crime-heatmap', label: 'Crime Heatmap', section: 'Intelligence', icon: Map, shortLabel: 'Heatmap', description: 'Geospatial crime density visualization for patrol prioritization across Indian cities' },
  { id: 'help-center', label: 'Help Center', section: 'Support', icon: HelpCircle, shortLabel: 'Help', description: 'FAQs, guides, and documentation' },
  { id: 'settings', label: 'Settings', section: 'Support', icon: Settings, shortLabel: 'Settings', description: 'Account, preferences, and notification configuration' },
];

export const SECTIONS = ['Detection', 'Protection', 'Intelligence', 'Support'];

export function getModulesBySection(section: string): ModuleDef[] {
  return MODULES.filter(m => m.section === section);
}

export function getModuleById(id: ModuleId): ModuleDef | undefined {
  return MODULES.find(m => m.id === id);
}
