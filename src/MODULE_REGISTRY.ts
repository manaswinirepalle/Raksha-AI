import {
  Scan, MessageCircle, Phone, ShieldAlert, AlertTriangle,
  Flag, Brain, TrendingUp, Lightbulb, BarChart3,
  FileText, ShieldCheck, HelpCircle, Mail, Settings,
} from 'lucide-react';

export type ModuleId =
  | 'landing'
  | 'scam-scanner' | 'message-checker' | 'call-protection'
  | 'safety-center' | 'scam-alerts' | 'report-fraud'
  | 'threat-insights' | 'scam-trends' | 'safety-tips'
  | 'activity-dashboard' | 'reports' | 'security-overview'
  | 'help-center' | 'contact-support' | 'settings';

export interface ModuleDef {
  id: ModuleId;
  label: string;
  section: string;
  icon: typeof Scan;
  shortLabel: string;
  description: string;
}

export const MODULES: ModuleDef[] = [
  { id: 'scam-scanner', label: 'Scam Scanner', section: 'Detection', icon: Scan, shortLabel: 'Scan', description: 'Analyze text, calls, and messages for scam indicators' },
  { id: 'message-checker', label: 'Message Checker', section: 'Detection', icon: MessageCircle, shortLabel: 'Messages', description: 'Verify suspicious SMS, WhatsApp, and email messages' },
  { id: 'call-protection', label: 'Call Protection', section: 'Detection', icon: Phone, shortLabel: 'Calls', description: 'Real-time call analysis and spam detection' },
  { id: 'safety-center', label: 'Safety Center', section: 'Protection', icon: ShieldAlert, shortLabel: 'Safety', description: 'Emergency contacts, safety score, and protection tools' },
  { id: 'scam-alerts', label: 'Scam Alerts', section: 'Protection', icon: AlertTriangle, shortLabel: 'Alerts', description: 'Live trending scam alerts and threat warnings' },
  { id: 'report-fraud', label: 'Report Fraud', section: 'Protection', icon: Flag, shortLabel: 'Report', description: 'File fraud reports and track complaint status' },
  { id: 'threat-insights', label: 'Threat Insights', section: 'Insights', icon: Brain, shortLabel: 'Threats', description: 'AI-powered threat intelligence and analysis' },
  { id: 'scam-trends', label: 'Scam Trends', section: 'Insights', icon: TrendingUp, shortLabel: 'Trends', description: 'Emerging scam patterns and regional data' },
  { id: 'safety-tips', label: 'Safety Tips', section: 'Insights', icon: Lightbulb, shortLabel: 'Tips', description: 'Expert safety advice and best practices' },
  { id: 'activity-dashboard', label: 'Activity Dashboard', section: 'Analytics', icon: BarChart3, shortLabel: 'Activity', description: 'Overview of scans, alerts, and protection activity' },
  { id: 'reports', label: 'Reports', section: 'Analytics', icon: FileText, shortLabel: 'Reports', description: 'Detailed reports and exportable analytics' },
  { id: 'security-overview', label: 'Security Overview', section: 'Analytics', icon: ShieldCheck, shortLabel: 'Security', description: 'Security score breakdown and protection status' },
  { id: 'help-center', label: 'Help Center', section: 'Support', icon: HelpCircle, shortLabel: 'Help', description: 'FAQs, guides, and documentation' },
  { id: 'contact-support', label: 'Contact Support', section: 'Support', icon: Mail, shortLabel: 'Contact', description: 'Reach our support team' },
  { id: 'settings', label: 'Settings', section: 'Support', icon: Settings, shortLabel: 'Settings', description: 'Account, preferences, and notifications' },
];

export const SECTIONS = ['Detection', 'Protection', 'Insights', 'Analytics', 'Support'];

export function getModulesBySection(section: string): ModuleDef[] {
  return MODULES.filter(m => m.section === section);
}

export function getModuleById(id: ModuleId): ModuleDef | undefined {
  return MODULES.find(m => m.id === id);
}
