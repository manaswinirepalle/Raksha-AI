import { useState, useEffect, useCallback, useRef } from 'react';
import type { JSX } from 'react';
import {
  FileText, AlertTriangle, ShieldAlert, ShieldCheck, Shield,
  Sparkles, RotateCcw, ChevronRight,
  Zap, Eye, Brain, TrendingUp,
} from 'lucide-react';
import { TRANSCRIPT_SCENARIOS } from '../mockData';
import type { ActivityEntry, TranscriptScenario, RiskLevel } from '../types';
import RiskScore from '../components/RiskScore';
import ActivityLog from '../components/ActivityLog';
import EvidencePackage from '../components/EvidencePackage';
import Tooltip from '../components/Tooltip';
import { useToast } from '../components/Toast';

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

function ScenarioSkeletonCard() {
  return (
    <div className="scenario-card-skeleton" aria-hidden="true">
      <div className="skeleton-icon" />
      <div className="skeleton-lines">
        <div className="skeleton-line skeleton-line-title" />
        <div className="skeleton-line skeleton-line-desc" />
        <div className="skeleton-line skeleton-line-desc-short" />
      </div>
      <div className="skeleton-badge" />
    </div>
  );
}

function ScenarioSkeletonGrid() {
  return (
    <div className="scenario-grid">
      <ScenarioSkeletonCard />
      <ScenarioSkeletonCard />
      <ScenarioSkeletonCard />
    </div>
  );
}

export default function ScamDetector() {
  const { addToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<TranscriptScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState(-1);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const modalCardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingScenarios(false), 800);
    return () => clearTimeout(t);
  }, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const runAnalysis = useCallback(
    (scenario: TranscriptScenario) => {
      clearTimeouts();
      setIsAnalyzing(true);
      setAnalyzed(false);
      setHighlightIndex(-1);
      setActivityEntries([]);
      setProgress(0);

      const totalSteps = scenario.redFlags.length + scenario.agentFires.length + 1;
      let step = 0;

      const highlightDuration = Math.min(scenario.redFlags.length * 100, 1500);
      const highlightInterval = highlightDuration / Math.max(scenario.redFlags.length, 1);

      scenario.redFlags.forEach((_, i) => {
        const t = setTimeout(() => {
          setHighlightIndex(i);
          step++;
          setProgress(Math.round((step / totalSteps) * 100));
        }, i * highlightInterval);
        timeoutsRef.current.push(t);
      });

      scenario.agentFires.forEach((fire, i) => {
        const t = setTimeout(
          () => {
            setActivityEntries((prev) => [
              ...prev,
              {
                id: `entry-${i}`,
                agent: fire.agent,
                action: fire.action,
                timestamp: fire.timestamp,
                triggeredBy: fire.triggeredBy,
                color: '',
              },
            ]);
            step++;
            setProgress(Math.round((step / totalSteps) * 100));
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
          addToast(
            `Analysis complete — ${scenario.riskLevel} risk detected`,
            scenario.riskLevel === 'CRITICAL' || scenario.riskLevel === 'HIGH' ? 'error' : 'info'
          );
        },
        Math.max(scenario.agentFires.length * 150 + 200, 1500)
      );
      timeoutsRef.current.push(completionTimeout);
    },
    [clearTimeouts, addToast]
  );

  const handleSelectScenario = (scenario: TranscriptScenario) => {
    setSelectedScenario(scenario);
    setShowScenarioModal(false);
    runAnalysis(scenario);
  };

  const handleReset = () => {
    clearTimeouts();
    setSelectedScenario(null);
    setIsAnalyzing(false);
    setAnalyzed(false);
    setHighlightIndex(-1);
    setActivityEntries([]);
    setProgress(0);
  };

  const openModal = () => {
    setFocusedCardIndex(-1);
    setShowScenarioModal(true);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    const count = TRANSCRIPT_SCENARIOS.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = focusedCardIndex < count - 1 ? focusedCardIndex + 1 : 0;
      setFocusedCardIndex(next);
      modalCardRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = focusedCardIndex > 0 ? focusedCardIndex - 1 : count - 1;
      setFocusedCardIndex(prev);
      modalCardRefs.current[prev]?.focus();
    }
    if (e.key === 'Enter' && focusedCardIndex >= 0) {
      e.preventDefault();
      handleSelectScenario(TRANSCRIPT_SCENARIOS[focusedCardIndex]);
    }
  };

  const renderHighlightedTranscript = () => {
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
          if (typeof part !== 'string') {
            newParts.push(part);
            return;
          }
          const regex = new RegExp(
            `(${flag.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
            'gi'
          );
          const splits = part.split(regex);
          splits.forEach((s, si) => {
            if (s.toLowerCase() === flag.phrase.toLowerCase()) {
              newParts.push(
                <span
                  key={`${lineIdx}-${si}`}
                  className={`flag-highlight flag-highlight-${flag.severity.toLowerCase()}`}
                >
                  {s}
                </span>
              );
            } else {
              newParts.push(s);
            }
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
  };

  return (
    <div className="scam-detector">
      {/* Header */}
      <div className="sd-header">
        <div className="sd-header-left">
          <div className="sd-header-icon">
            <AlertTriangle size={16} strokeWidth={1.5} />
          </div>
          <div className="sd-header-text">
            <h2 className="sd-title">Digital Arrest Scam Detector</h2>
            <p className="sd-subtitle">Real-time transcript analysis with multi-agent detection</p>
          </div>
        </div>
        <div className="sd-header-actions">
          {selectedScenario && (
            <button
              onClick={handleReset}
              className="sd-btn-ghost btn-ripple"
              aria-label="Reset analysis"
            >
              <RotateCcw size={13} strokeWidth={1.5} />
              <span className="sd-btn-label">Reset</span>
            </button>
          )}
          <div className="sd-tooltip-wrap">
            <Tooltip text="MHA Digital Arrest Advisory Compliance" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {isAnalyzing && (
        <div className="sd-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="sd-progress-header">
            <span className="sd-progress-label">Analyzing transcript...</span>
            <span className="sd-progress-value">{progress}%</span>
          </div>
          <div className="progress-premium">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              }}
            >
              <div className="progress-glow" style={{ background: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {analyzed && selectedScenario && (
        <div
          className="sd-banner"
          style={{
            background:
              selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH'
                ? 'rgba(244,63,94,0.06)'
                : 'rgba(59,130,246,0.06)',
            borderColor:
              selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH'
                ? 'rgba(244,63,94,0.15)'
                : 'rgba(59,130,246,0.15)',
          }}
        >
          <Sparkles size={14} className="text-blue-400 flex-shrink-0" />
          <div className="sd-banner-text">
            <span className="sd-banner-label">Analysis complete — </span>
            <span className={`sd-banner-risk sd-banner-risk-${selectedScenario.riskLevel.toLowerCase()}`}>
              {selectedScenario.riskLevel} RISK
            </span>
            <span className="sd-banner-meta">
              {selectedScenario.redFlags.length} flags across{' '}
              {new Set(selectedScenario.redFlags.map((f) => f.category)).size} categories
            </span>
          </div>
          <button
            onClick={handleReset}
            className="sd-btn-ghost-sm btn-ripple"
            aria-label="Analyze another transcript"
          >
            <RotateCcw size={10} />
            <span className="sd-btn-label">New</span>
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="sd-metrics">
        {[
          { label: 'Detection Precision', value: '97.3%', color: '#3b82f6', icon: Target },
          { label: 'Recall (Sensitivity)', value: '94.8%', color: '#10b981', icon: TrendingUp },
          { label: 'False Positive Rate', value: '2.1%', color: '#06b6d4', highlight: 'LOW', icon: Eye },
          { label: 'Alert Lead Time', value: '14.2 days', color: '#8b5cf6', icon: Zap },
        ].map((m, i) => (
          <div key={i} className="sd-metric glass-panel card-hover">
            <m.icon size={13} style={{ color: m.color }} strokeWidth={1.5} />
            <div className="sd-metric-content">
              <div className="sd-metric-value-row">
                <span className="sd-metric-value" style={{ color: m.color }}>
                  {m.value}
                </span>
                {m.highlight && (
                  <span className="sd-metric-badge">{m.highlight}</span>
                )}
              </div>
              <span className="sd-metric-label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Selector Button */}
      <div className="sd-scenario-trigger">
        <button
          onClick={openModal}
          className="sd-trigger-btn btn-premium btn-ripple"
          aria-haspopup="dialog"
          aria-label="Select a transcript scenario to analyze"
        >
          <div className="sd-trigger-left">
            <FileText size={15} strokeWidth={1.5} />
            <span className="sd-trigger-text">
              {selectedScenario ? selectedScenario.label : 'Choose a scam scenario to analyze...'}
            </span>
          </div>
          <ChevronRight size={15} strokeWidth={1.5} className="sd-trigger-chevron" />
        </button>
      </div>

      {/* Main content */}
      <div className="sd-main">
        {/* Transcript */}
        <div className="sd-transcript glass-panel card-hover">
          <div className="sd-transcript-header">
            <span className="sd-section-label">Transcript Analysis</span>
            {isAnalyzing && (
              <span className="sd-status sd-status-live" aria-live="polite">
                <span className="sd-status-dot sd-status-dot-live" />
                ANALYZING
              </span>
            )}
            {analyzed && (
              <span className="sd-status sd-status-done" aria-live="polite">
                <Sparkles size={10} />
                COMPLETE
              </span>
            )}
          </div>
          <div className="sd-transcript-body mobile-scroll">
            {!selectedScenario && (
              <div className="sd-empty-state">
                <div className="sd-empty-icon">
                  <FileText size={28} strokeWidth={1} />
                </div>
                <p className="sd-empty-title">Select a scam scenario above</p>
                <p className="sd-empty-desc">
                  Choose from {TRANSCRIPT_SCENARIOS.length} pre-loaded scenarios to see real-time
                  multi-agent analysis
                </p>
                <div className="sd-empty-legend">
                  {TRANSCRIPT_SCENARIOS.map((s, i) => {
                    const meta = RISK_META[s.riskLevel];
                    return (
                      <div key={i} className="sd-legend-item">
                        <div className="sd-legend-dot" style={{ background: meta.color }} />
                        <span className="sd-legend-text">{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedScenario && renderHighlightedTranscript()}
          </div>
        </div>

        {/* Risk Score + Evidence */}
        <div className="sd-sidebar">
          <div className="sd-risk glass-panel card-hover">
            <span className="sd-section-label">Threat Assessment</span>
            {selectedScenario ? (
              <RiskScore
                score={analyzed || isAnalyzing ? selectedScenario.finalScore : 0}
                level={analyzed ? selectedScenario.riskLevel : 'LOW'}
                animate={isAnalyzing || analyzed}
              />
            ) : (
              <div className="sd-risk-idle">Awaiting input</div>
            )}
            {selectedScenario && analyzed && (
              <div className="sd-risk-summary">
                <p className="sd-risk-summary-text">
                  {selectedScenario.redFlags.length} red flags detected across{' '}
                  {new Set(selectedScenario.redFlags.map((f) => f.category)).size} categories
                </p>
              </div>
            )}
          </div>

          <div className="sd-evidence glass-panel card-hover">
            {analyzed && selectedScenario && selectedScenario.evidencePackage.length > 0 ? (
              <EvidencePackage items={selectedScenario.evidencePackage} />
            ) : (
              <div className="sd-evidence-empty">
                <div className="sd-evidence-empty-icon">
                  <FileText size={16} strokeWidth={1} />
                </div>
                <p className="sd-evidence-empty-text">
                  {isAnalyzing ? 'Building evidence package...' : 'Complete analysis to generate evidence package'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="sd-activity glass-panel card-hover">
        <ActivityLog entries={activityEntries} isAnimating={isAnalyzing} />
      </div>

      {/* ─── Scenario Selection Modal ─── */}
      <div
        className={`sd-modal ${showScenarioModal ? 'sd-modal-open' : ''}`}
        onClick={() => setShowScenarioModal(false)}
        aria-hidden={!showScenarioModal}
      >
        <div className="sd-modal-backdrop" />
        <div
          className="sd-modal-content"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Select a scenario to analyze"
        >
          <div className="sd-modal-panel">
            <div className="sd-modal-header">
              <div>
                <h3 className="sd-modal-title">Select Scenario</h3>
                <p className="sd-modal-subtitle">
                  Choose a transcript to begin multi-agent analysis
                </p>
              </div>
              <button
                onClick={() => setShowScenarioModal(false)}
                className="sd-modal-close"
                aria-label="Close scenario picker"
                type="button"
              >
                <span className="sd-modal-close-x">&times;</span>
              </button>
            </div>

            {isLoadingScenarios ? (
              <ScenarioSkeletonGrid />
            ) : (
              <div className="scenario-grid" onKeyDown={handleModalKeyDown}>
                {TRANSCRIPT_SCENARIOS.map((scenario, index) => {
                  const meta = RISK_META[scenario.riskLevel];
                  const IconComponent = meta.icon;
                  const isHovered = hoveredCard === scenario.id;
                  const isSelected = selectedScenario?.id === scenario.id;
                  const isFocused = focusedCardIndex === index;

                  return (
                    <button
                      key={scenario.id}
                      ref={(el) => { modalCardRefs.current[index] = el; }}
                      className={`scenario-card ${isSelected ? 'scenario-card-selected' : ''}`}
                      style={{
                        background: isHovered || isSelected ? meta.gradient : undefined,
                        borderColor: isHovered || isSelected || isFocused ? meta.borderColor : undefined,
                        boxShadow: isHovered || isSelected ? `0 0 30px ${meta.glowColor}, 0 8px 32px rgba(0,0,0,0.3)` : undefined,
                      }}
                      onClick={() => handleSelectScenario(scenario)}
                      onMouseEnter={() => setHoveredCard(scenario.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onFocus={() => { setHoveredCard(scenario.id); setFocusedCardIndex(index); }}
                      onBlur={() => setHoveredCard(null)}
                      tabIndex={0}
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${scenario.label} — ${meta.label} risk, score ${scenario.finalScore}`}
                    >
                      <div className="scenario-card-header">
                        <div
                          className="scenario-card-icon"
                          style={{
                            background: meta.bgColor,
                            borderColor: meta.borderColor,
                          }}
                        >
                          <IconComponent size={20} style={{ color: meta.color }} strokeWidth={1.5} />
                        </div>
                        <div
                          className="scenario-card-badge"
                          style={{
                            background: meta.bgColor,
                            color: meta.color,
                            borderColor: meta.borderColor,
                          }}
                        >
                          {meta.label}
                        </div>
                      </div>

                      <div className="scenario-card-body">
                        <h4 className="scenario-card-title">{scenario.label}</h4>
                        <p className="scenario-card-desc">{scenario.description}</p>
                      </div>

                      <div className="scenario-card-footer">
                        <div className="scenario-card-stats">
                          <span className="scenario-stat">
                            <span className="scenario-stat-icon">
                              <Brain size={11} strokeWidth={1.5} />
                            </span>
                            {scenario.agentFires.length} agents
                          </span>
                          <span className="scenario-stat">
                            <span className="scenario-stat-icon">
                              <AlertTriangle size={11} strokeWidth={1.5} />
                            </span>
                            {scenario.redFlags.length} flags
                          </span>
                        </div>
                        <div className="scenario-card-score">
                          <span className="scenario-score-label">Risk</span>
                          <span className="scenario-score-value" style={{ color: meta.color }}>
                            {scenario.finalScore}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!isLoadingScenarios && (
              <div className="sd-modal-footer">
                <span className="sd-modal-footer-text">
                  {TRANSCRIPT_SCENARIOS.length} scenarios available
                </span>
                <span className="sd-modal-footer-hint">
                  Use arrow keys + Enter to navigate
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Target({ size, style, strokeWidth }: { size: number; style?: React.CSSProperties; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 1.5} style={style}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
