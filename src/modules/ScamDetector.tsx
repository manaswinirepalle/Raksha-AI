import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { JSX } from 'react';
import {
  FileText, AlertTriangle,   ShieldAlert, ShieldCheck, Shield,
  Sparkles, RotateCcw,
  Zap, Eye, Brain, TrendingUp, BarChart3, BookOpen,
  GraduationCap,
} from 'lucide-react';
import { TRANSCRIPT_SCENARIOS } from '../mockData';
import type { ActivityEntry, TranscriptScenario, RiskLevel, AnalysisRecord } from '../types';
import RiskScore from '../components/RiskScore';
import ActivityLog from '../components/ActivityLog';
import EvidencePackage from '../components/EvidencePackage';
import Tooltip from '../components/Tooltip';
import { useToast } from '../components/Toast';
import RiskGauge from '../components/RiskGauge';
import AIInsights from '../components/AIInsights';
import AIExplanation from '../components/AIExplanation';
import SafetyTips from '../components/SafetyTips';
import Recommendations from '../components/Recommendations';
import ExportPanel from '../components/ExportPanel';
import TranscriptLearning from '../components/TranscriptLearning';
import ConfidenceBreakdown from '../components/ConfidenceBreakdown';
import WhatToDoNext from '../components/WhatToDoNext';
import ScamAlertFeed from '../components/ScamAlertFeed';
import SearchableCombobox from '../components/SearchableCombobox';
import { useCountUp } from '../hooks/useCountUp';

const RISK_META: Record<RiskLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  icon: typeof AlertTriangle;
  gradient: string;
}> = {
  CRITICAL: {
    label: 'Dangerous',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.25)',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    icon: ShieldAlert,
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0.03) 100%)',
  },
  HIGH: {
    label: 'Suspicious',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.08)',
    borderColor: 'rgba(249, 115, 22, 0.25)',
    glowColor: 'rgba(249, 115, 22, 0.15)',
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.03) 100%)',
  },
  MEDIUM: {
    label: 'Caution',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.08)',
    borderColor: 'rgba(234, 179, 8, 0.25)',
    glowColor: 'rgba(234, 179, 8, 0.15)',
    icon: Shield,
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(234,179,8,0.03) 100%)',
  },
  LOW: {
    label: 'Safe',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    icon: ShieldCheck,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 100%)',
  },
};

const TABS = [
  { id: 'analysis', label: 'Analysis', icon: FileText },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'learn', label: 'Learn', icon: GraduationCap },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
] as const;

type TabId = typeof TABS[number]['id'];

const SAFETY_TIPS: Record<RiskLevel, string[]> = {
  CRITICAL: [
    'Hang up immediately — do not continue the conversation',
    'Never share OTP, PIN, or bank credentials with anyone',
    'No government agency demands money via phone',
    'Call 1930 Cyber Crime Helpline to report',
    'Report at cybercrime.gov.in within 24 hours',
    'Alert your bank immediately if details were shared',
  ],
  HIGH: [
    'Do not share OTP or net banking credentials',
    'Hang up and call the official number yourself',
    'Verify through the bank\'s official app or website',
    'Report suspicious calls to your bank fraud department',
    'Never click links sent via SMS or WhatsApp',
    'Block the number after reporting',
  ],
  MEDIUM: [
    'Stay cautious — verify caller identity independently',
    'Never share card details over the phone',
    'Use official channels for all banking needs',
    'Keep your UPI PIN confidential at all times',
    'Enable transaction alerts on your accounts',
    'Report any suspicious activity promptly',
  ],
  LOW: [
    'This call appears legitimate',
    'Always verify through official banking apps',
    'Keep your financial credentials secure',
    'Enable two-factor authentication where possible',
    'Monitor your accounts regularly',
    'Stay informed about latest scam trends',
  ],
};

export default function ScamDetector() {
  const { addToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<TranscriptScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>('analysis');
  const [scenarioFilter, setScenarioFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const saveAnalysisRecord = useCallback((scenario: TranscriptScenario) => {
    try {
      const existing: AnalysisRecord[] = JSON.parse(localStorage.getItem('raksha-analysis-history') || '[]');
      const record: AnalysisRecord = {
        id: `rec-${Date.now()}`,
        scenarioId: scenario.id,
        scenarioLabel: scenario.label,
        riskLevel: scenario.riskLevel,
        score: scenario.finalScore,
        timestamp: Date.now(),
      };
      existing.unshift(record);
      localStorage.setItem('raksha-analysis-history', JSON.stringify(existing.slice(0, 50)));
    } catch { /* ignore localStorage errors */ }
  }, []);

  const runAnalysis = useCallback(
    (scenario: TranscriptScenario) => {
      clearTimeouts();
      setIsAnalyzing(true);
      setAnalyzed(false);
      setHighlightIndex(-1);
      setActivityEntries([]);
      setProgress(0);

      const totalSteps = scenario.redFlags.length + scenario.agentFires.length + 1;
      const stepRef = { current: 0 };

      const highlightDuration = Math.min(scenario.redFlags.length * 100, 1500);
      const highlightInterval = highlightDuration / Math.max(scenario.redFlags.length, 1);

      scenario.redFlags.forEach((_, i) => {
        const t = setTimeout(() => {
          setHighlightIndex(i);
          stepRef.current++;
          setProgress(Math.round((stepRef.current / totalSteps) * 100));
        }, i * highlightInterval);
        timeoutsRef.current.push(t);
      });

      scenario.agentFires.forEach((fire, i) => {
        const t = setTimeout(
          () => {
            setActivityEntries((prev) => [
              ...prev,
              { id: `entry-${i}`, agent: fire.agent, action: fire.action, timestamp: fire.timestamp, triggeredBy: fire.triggeredBy, color: '' },
            ]);
            stepRef.current++;
            setProgress(Math.round((stepRef.current / totalSteps) * 100));
          },
          200 + i * 150
        );
        timeoutsRef.current.push(t);
      });

      const completionTimeout = setTimeout(
        () => {
          setIsAnalyzing(false);
          setAnalyzed(true);
          setProgress(100);
          saveAnalysisRecord(scenario);
          addToast(
            `Analysis complete — ${scenario.riskLevel} risk detected`,
            scenario.riskLevel === 'CRITICAL' || scenario.riskLevel === 'HIGH' ? 'error' : 'info'
          );
        },
        Math.max(scenario.agentFires.length * 150 + 200, 1500)
      );
      timeoutsRef.current.push(completionTimeout);
    },
    [clearTimeouts, addToast, saveAnalysisRecord]
  );

  const handleSelectScenario = useCallback(
    (scenario: TranscriptScenario) => {
      setSelectedScenario(scenario);
      setActiveTab('analysis');
      runAnalysis(scenario);
    },
    [runAnalysis]
  );

  const handleReset = useCallback(() => {
    clearTimeouts();
    setSelectedScenario(null);
    setIsAnalyzing(false);
    setAnalyzed(false);
    setHighlightIndex(-1);
    setActivityEntries([]);
    setProgress(0);
    setActiveTab('analysis');
  }, [clearTimeouts]);

  const filteredScenarios = useMemo(() => {
    if (scenarioFilter === 'ALL') return TRANSCRIPT_SCENARIOS;
    return TRANSCRIPT_SCENARIOS.filter((s) => s.riskLevel === scenarioFilter);
  }, [scenarioFilter]);

  const highlightedTranscript = useMemo(() => {
    if (!selectedScenario) return null;
    return selectedScenario.transcript.map((line, lineIdx) => {
      const text = line.text;
      const flags = selectedScenario.redFlags
        .map((f, i) => ({ ...f, idx: i }))
        .filter((f) => f.idx <= highlightIndex && text.toLowerCase().includes(f.phrase.toLowerCase()));
      if (flags.length === 0) {
        return (
          <div key={lineIdx} className="transcript-line">
            <span className="transcript-speaker">{line.speaker}</span>
            <span className="transcript-text">{text}</span>
          </div>
        );
      }
      let parts: (string | JSX.Element)[] = [text];
      flags.forEach((flag) => {
        const newParts: (string | JSX.Element)[] = [];
        parts.forEach((part) => {
          if (typeof part !== 'string') { newParts.push(part); return; }
          const regex = new RegExp(`(${flag.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          part.split(regex).forEach((s, si) => {
            if (s.toLowerCase() === flag.phrase.toLowerCase()) {
              newParts.push(
                <span key={`${lineIdx}-${si}`} className={`flag-highlight flag-highlight-${flag.severity.toLowerCase()}`}>{s}</span>
              );
            } else { newParts.push(s); }
          });
        });
        parts = newParts;
      });
      return (
        <div key={lineIdx} className="transcript-line">
          <span className="transcript-speaker">{line.speaker}</span>
          <span className="transcript-text transcript-text-wrapped">{parts}</span>
        </div>
      );
    });
  }, [selectedScenario, highlightIndex]);

  const tips = useMemo(() =>
    selectedScenario ? SAFETY_TIPS[selectedScenario.riskLevel] : SAFETY_TIPS.LOW,
    [selectedScenario]
  );

  const renderAnalysisTab = () => (
    <>
      {isAnalyzing && (
        <div className="sd-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="sd-progress-header">
            <span className="sd-progress-label">Analyzing transcript...</span>
            <span className="sd-progress-value">{progress}%</span>
          </div>
          <div className="progress-premium">
            <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}>
              <div className="progress-glow" style={{ background: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      )}
      {analyzed && selectedScenario && (
        <div className="sd-banner" style={{
          background: selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH' ? 'rgba(244,63,94,0.06)' : 'rgba(59,130,246,0.06)',
          borderColor: selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH' ? 'rgba(244,63,94,0.15)' : 'rgba(59,130,246,0.15)',
        }}>
          <Sparkles size={14} className="text-blue-400 flex-shrink-0" />
          <div className="sd-banner-text">
            <span className="sd-banner-label">Analysis complete — </span>
            <span className={`sd-banner-risk sd-banner-risk-${selectedScenario.riskLevel.toLowerCase()}`}>{selectedScenario.riskLevel} RISK</span>
            <span className="sd-banner-meta">{selectedScenario.redFlags.length} flags across {new Set(selectedScenario.redFlags.map((f) => f.category)).size} categories</span>
          </div>
          <button onClick={handleReset} className="sd-btn-ghost-sm btn-ripple" aria-label="Analyze another transcript">
            <RotateCcw size={10} />
            <span className="sd-btn-label">New</span>
          </button>
        </div>
      )}
      <div className="sd-metrics">
        {[
          { label: 'Detection Precision', value: 97.3, color: '#3b82f6', icon: TargetIcon },
          { label: 'Recall', value: 94.8, color: '#10b981', icon: TrendingUp },
          { label: 'False Positive Rate', value: 2.1, color: '#06b6d4', highlight: 'LOW', icon: Eye },
          { label: 'Alert Lead Time', value: 14.2, color: '#8b5cf6', icon: Zap, suffix: ' days' },
        ].map((m, i) => (
          <div key={i} className="sd-metric glass-panel card-hover">
            <m.icon size={13} style={{ color: m.color }} strokeWidth={1.5} />
            <div className="sd-metric-content">
              <div className="sd-metric-value-row">
                {analyzed ? (
                  <CountUpMetric value={m.value} color={m.color} suffix={m.suffix || '%'} duration={1500 + i * 200} />
                ) : (
                  <span className="sd-metric-value" style={{ color: m.color }}>—</span>
                )}
                {m.highlight && <span className="sd-metric-badge">{m.highlight}</span>}
              </div>
              <span className="sd-metric-label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="sd-main">
        <div className="sd-transcript glass-panel card-hover">
          <div className="sd-transcript-header">
            <span className="sd-section-label">Transcript Analysis</span>
            {isAnalyzing && <span className="sd-status sd-status-live" aria-live="polite"><span className="sd-status-dot sd-status-dot-live" />ANALYZING</span>}
            {analyzed && <span className="sd-status sd-status-done" aria-live="polite"><Sparkles size={10} />COMPLETE</span>}
          </div>
          <div className="sd-transcript-body">
            {!selectedScenario && (
              <div className="sd-empty-state">
                <div className="sd-empty-icon"><FileText size={28} strokeWidth={1} /></div>
                <p className="sd-empty-title">Select a scam scenario above</p>
                <p className="sd-empty-desc">Choose from {TRANSCRIPT_SCENARIOS.length} pre-loaded scenarios to see real-time multi-agent analysis</p>
              </div>
            )}
            {selectedScenario && highlightedTranscript}
          </div>
        </div>
        <div className="sd-sidebar">
          <div className="sd-risk glass-panel card-hover">
            <span className="sd-section-label">Threat Assessment</span>
            {selectedScenario ? (
              <RiskScore score={analyzed || isAnalyzing ? selectedScenario.finalScore : 0} level={analyzed ? selectedScenario.riskLevel : 'LOW'} animate={isAnalyzing || analyzed} />
            ) : <div className="sd-risk-idle">Awaiting input</div>}
            {selectedScenario && analyzed && (
              <div className="sd-risk-summary"><p className="sd-risk-summary-text">{selectedScenario.redFlags.length} red flags detected across {new Set(selectedScenario.redFlags.map((f) => f.category)).size} categories</p></div>
            )}
          </div>
          <div className="sd-evidence glass-panel card-hover">
            {analyzed && selectedScenario && selectedScenario.evidencePackage.length > 0 ? (
              <EvidencePackage items={selectedScenario.evidencePackage} />
            ) : (
              <div className="sd-evidence-empty">
                <div className="sd-evidence-empty-icon"><FileText size={16} strokeWidth={1} /></div>
                <p className="sd-evidence-empty-text">{isAnalyzing ? 'Building evidence package...' : 'Complete analysis to generate evidence package'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sd-activity glass-panel card-hover">
        <ActivityLog entries={activityEntries} isAnimating={isAnalyzing} />
      </div>
    </>
  );

  const renderInsightsTab = () => {
    if (!selectedScenario || !analyzed) return (
      <div className="sd-tab-empty">
        <Brain size={40} strokeWidth={1} className="text-zinc-700 mb-4" />
        <p className="text-sm text-zinc-400 font-medium">No AI insights yet</p>
        <p className="text-xs text-zinc-600 mt-1">Complete an analysis to view AI-powered insights</p>
      </div>
    );
    const a = selectedScenario.aiAnalysis;
    return (
      <div className="sd-tab-content">
        <div className="sd-insights-top">
          <RiskGauge score={selectedScenario.finalScore} level={selectedScenario.riskLevel} animate={analyzed} />
          <div className="sd-insights-meta glass-panel card-hover">
            <span className="sd-section-label">Threat Classification</span>
            <div className="sd-threat-category" style={{ color: RISK_META[selectedScenario.riskLevel].color }}>{a.threatCategory}</div>
            <div className="sd-threat-stats">
              <div className="sd-threat-stat"><span className="sd-threat-stat-label">Confidence</span><span className="sd-threat-stat-value">{a.confidence}%</span></div>
              <div className="sd-threat-stat"><span className="sd-threat-stat-label">Scam Probability</span><span className="sd-threat-stat-value">{a.scamProbability}%</span></div>
              <div className="sd-threat-stat"><span className="sd-threat-stat-label">Risk Level</span><span className="sd-threat-stat-value" style={{ color: RISK_META[selectedScenario.riskLevel].color }}>{selectedScenario.riskLevel}</span></div>
            </div>
          </div>
        </div>
        <AIInsights insights={a.insights} visible={analyzed} />
        <AIExplanation analysis={a} visible={analyzed} />
        <ConfidenceBreakdown scenario={selectedScenario} visible={analyzed} />
      </div>
    );
  };

  const renderSafetyTab = () => {
    if (!selectedScenario || !analyzed) return (
      <div className="sd-tab-empty">
        <Shield size={40} strokeWidth={1} className="text-zinc-700 mb-4" />
        <p className="text-sm text-zinc-400 font-medium">No safety data yet</p>
        <p className="text-xs text-zinc-600 mt-1">Complete an analysis to view personalized safety recommendations</p>
      </div>
    );
    return (
      <div className="sd-tab-content">
        <SafetyTips tips={tips} visible={analyzed} />
        <WhatToDoNext riskLevel={selectedScenario.riskLevel} visible={analyzed} />
        <Recommendations recommendations={selectedScenario.aiAnalysis.recommendations} riskLevel={selectedScenario.riskLevel} visible={analyzed} />
        <ExportPanel scenario={selectedScenario} analyzed={analyzed} />
      </div>
    );
  };

  const renderLearnTab = () => (
    <div className="sd-tab-content">
      <TranscriptLearning scenario={selectedScenario} visible={true} />
    </div>
  );

  const renderAlertsTab = () => (
    <div className="sd-tab-content">
      <ScamAlertFeed />
    </div>
  );

  return (
    <div className="scam-detector" aria-busy={isAnalyzing}>
      <div className="sd-header">
        <div className="sd-header-left">
          <div className="sd-header-icon"><AlertTriangle size={16} strokeWidth={1.5} /></div>
          <div className="sd-header-text">
            <h2 className="sd-title">Digital Arrest Scam Detector</h2>
            <p className="sd-subtitle">AI-powered transcript analysis with multi-agent detection</p>
          </div>
        </div>
        <div className="sd-header-actions">
          {selectedScenario && (
            <button onClick={handleReset} className="sd-btn-ghost btn-ripple" aria-label="Reset analysis" disabled={isAnalyzing} style={{ opacity: isAnalyzing ? 0.5 : 1, pointerEvents: isAnalyzing ? 'none' : 'auto' }}>
              <RotateCcw size={13} strokeWidth={1.5} /><span className="sd-btn-label">Reset</span>
            </button>
          )}
          <div className="sd-tooltip-wrap"><Tooltip text="MHA Digital Arrest Advisory Compliance" /></div>
        </div>
      </div>

      {/* Scenario Picker + Risk Filter */}
      <div className="sd-combo-row">
        <SearchableCombobox
          scenarios={filteredScenarios}
          selectedId={selectedScenario?.id ?? null}
          onSelect={handleSelectScenario}
          placeholder="Choose a scam scenario to analyze..."
          disabled={isAnalyzing}
          riskMeta={RISK_META}
        />
        <select
          className="sd-risk-filter"
          value={scenarioFilter}
          onChange={(e) => setScenarioFilter(e.target.value as RiskLevel | 'ALL')}
          disabled={isAnalyzing}
          aria-label="Filter by risk level"
        >
          <option value="ALL">All Levels</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="sd-tabs" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sd-tab ${activeTab === tab.id ? 'sd-tab-active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span className="sd-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="sd-tab-panel sd-tab-panel-animated" style={{ marginTop: 0 }} key={activeTab}>
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'safety' && renderSafetyTab()}
        {activeTab === 'alerts' && renderAlertsTab()}
        {activeTab === 'learn' && renderLearnTab()}
        {activeTab === 'knowledge' && <KnowledgeCenterLazy />}
        {activeTab === 'dashboard' && <CyberDashboardLazy />}
      </div>
    </div>
  );
}

function CountUpMetric({ value, color, suffix = '%', duration = 1500 }: { value: number; color: string; suffix?: string; duration?: number }) {
  const count = useCountUp(value, duration);
  return <span className="sd-metric-value" style={{ color }}>{count.toFixed(1)}{suffix}</span>;
}

function TargetIcon({ size, style, strokeWidth }: { size: number; style?: React.CSSProperties; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 1.5} style={style}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function KnowledgeCenterLazy() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import('../components/KnowledgeCenter').then(m => setComp(() => m.default));
  }, []);
  if (!Comp) return <div className="sd-tab-empty"><div className="skeleton-line" style={{ width: '200px', height: '20px' }} /></div>;
  return <Comp />;
}

function CyberDashboardLazy() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import('../components/CyberDashboard').then(m => setComp(() => m.default));
  }, []);
  if (!Comp) return <div className="sd-tab-empty"><div className="skeleton-line" style={{ width: '200px', height: '20px' }} /></div>;
  return <Comp />;
}
