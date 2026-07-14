export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIAnalysis {
  confidence: number;
  scamProbability: number;
  threatCategory: string;
  deepReasoning: string;
  psychologicalTricks: string[];
  safeActions: string[];
  victimBehavior: string;
  preventionAdvice: string;
  insights: AIInsight[];
  recommendations: string[];
}

export interface AIInsight {
  id: string;
  label: string;
  value: string;
  score: number;
  icon: string;
  color: string;
}

export interface TranscriptScenario {
  id: string;
  label: string;
  description: string;
  transcript: { speaker: string; text: string }[];
  riskLevel: RiskLevel;
  finalScore: number;
  redFlags: { phrase: string; category: string; severity: RiskLevel }[];
  agentFires: { agent: string; action: string; timestamp: string; triggeredBy: string }[];
  evidencePackage: EvidenceItem[];
  aiAnalysis: AIAnalysis;
}

export interface EvidenceItem {
  type: string;
  title: string;
  content: string;
}

export interface ActivityEntry {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  triggeredBy: string;
  color: string;
}

export interface AnalysisRecord {
  id: string;
  scenarioId: string;
  scenarioLabel: string;
  riskLevel: RiskLevel;
  score: number;
  timestamp: number;
}

export interface FraudNode {
  id: string;
  label: string;
  type: 'phone' | 'upi' | 'wallet' | 'person' | 'complaint';
  x: number;
  y: number;
  connections: string[];
  complaints?: number;
  amount?: string;
}

export interface CounterfeitFeature {
  name: string;
  present: boolean;
  description: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isVerdict?: boolean;
  verdict?: string;
}
