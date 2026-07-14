import { useState, useEffect, useCallback, useRef } from 'react';
import type { JSX } from 'react';
import { FileText, AlertTriangle, ChevronDown, BarChart3, Sparkles, RotateCcw } from 'lucide-react';
import { TRANSCRIPT_SCENARIOS } from '../mockData';
import type { ActivityEntry, TranscriptScenario } from '../types';
import RiskScore from '../components/RiskScore';
import ActivityLog from '../components/ActivityLog';
import EvidencePackage from '../components/EvidencePackage';
import Tooltip from '../components/Tooltip';
import { useToast } from '../components/Toast';

export default function ScamDetector() {
  const { addToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<TranscriptScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const runAnalysis = useCallback((scenario: TranscriptScenario) => {
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
      const t = setTimeout(() => {
        setActivityEntries(prev => [
          ...prev,
          { id: `entry-${i}`, agent: fire.agent, action: fire.action, timestamp: fire.timestamp, triggeredBy: fire.triggeredBy, color: '' },
        ]);
        step++;
        setProgress(Math.round((step / totalSteps) * 100));
      }, 200 + i * 150);
      timeoutsRef.current.push(t);
    });

    const completionTimeout = setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
      setProgress(100);
      addToast(`Analysis complete — ${scenario.riskLevel} risk detected`, scenario.riskLevel === 'CRITICAL' || scenario.riskLevel === 'HIGH' ? 'error' : 'info');
    }, Math.max(scenario.agentFires.length * 150 + 200, 1500));
    timeoutsRef.current.push(completionTimeout);
  }, [clearTimeouts]);

  const handleSelectScenario = (scenario: TranscriptScenario) => {
    setSelectedScenario(scenario);
    setShowDropdown(false);
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

  const renderHighlightedTranscript = () => {
    if (!selectedScenario) return null;
    return selectedScenario.transcript.map((line, lineIdx) => {
      const text = line.text;
      const flags = selectedScenario.redFlags
        .map((f, i) => ({ ...f, idx: i }))
        .filter(f => f.idx <= highlightIndex && text.toLowerCase().includes(f.phrase.toLowerCase()));

      if (flags.length === 0) {
        return (
          <div key={lineIdx} className="flex gap-3 sm:gap-4 py-2.5">
            <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 w-14 sm:w-20 flex-shrink-0 pt-0.5 uppercase">
              {line.speaker}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{text}</span>
          </div>
        );
      }

      let parts: (string | JSX.Element)[] = [text];
      flags.forEach(flag => {
        const newParts: (string | JSX.Element)[] = [];
        parts.forEach(part => {
          if (typeof part !== 'string') { newParts.push(part); return; }
          const regex = new RegExp(`(${flag.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          const splits = part.split(regex);
          splits.forEach((s, si) => {
            if (s.toLowerCase() === flag.phrase.toLowerCase()) {
              const bgColors: Record<string, string> = {
                CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              };
              newParts.push(
                <span key={`${lineIdx}-${si}`} className={`px-1.5 py-0.5 rounded-md border text-[11px] sm:text-xs font-medium ${bgColors[flag.severity]} animate-fade-slide-up`}
                  style={{ animationFillMode: 'both' }}>{s}</span>
              );
            } else { newParts.push(s); }
          });
        });
        parts = newParts;
      });

      return (
        <div key={lineIdx} className="flex gap-3 sm:gap-4 py-2.5">
          <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 w-14 sm:w-20 flex-shrink-0 pt-0.5 uppercase">
            {line.speaker}
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 flex flex-wrap items-center gap-0.5 leading-relaxed">{parts}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 animate-fade-slide-up">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-zinc-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,63,94,0.1)' }}>
              <AlertTriangle size={16} className="text-rose-400" strokeWidth={1.5} />
            </div>
            <span className="truncate">Digital Arrest Scam Detector</span>
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 hidden sm:block">Real-time transcript analysis with multi-agent detection</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedScenario && (
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-subtle text-[10px] sm:text-[11px] text-zinc-500 hover:text-zinc-200 transition-all duration-300 cursor-pointer touch-target btn-ripple relative overflow-hidden"
              aria-label="Reset analysis">
              <RotateCcw size={12} strokeWidth={1.5} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
          <div className="hidden sm:block">
            <Tooltip text="MHA Digital Arrest Advisory Compliance" />
          </div>
        </div>
      </div>

      {/* Progress bar during analysis */}
      {isAnalyzing && (
        <div className="mb-4 sm:mb-5 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">Analyzing transcript...</span>
            <span className="text-[10px] sm:text-[11px] text-blue-400 font-mono">{progress}%</span>
          </div>
          <div className="progress-premium h-1.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              }}>
              <div className="progress-glow" style={{ background: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {analyzed && selectedScenario && (
        <div className="mb-4 sm:mb-5 p-3 rounded-xl flex items-center gap-3 animate-fade-slide-up"
          style={{
            background: selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH'
              ? 'rgba(244,63,94,0.06)' : 'rgba(59,130,246,0.06)',
            border: `1px solid ${selectedScenario.riskLevel === 'CRITICAL' || selectedScenario.riskLevel === 'HIGH'
              ? 'rgba(244,63,94,0.15)' : 'rgba(59,130,246,0.15)'}`,
          }}>
          <Sparkles size={14} className="text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs text-zinc-200 font-medium">Analysis complete — </span>
            <span className={`text-[11px] sm:text-xs font-mono font-semibold ${
              selectedScenario.riskLevel === 'CRITICAL' ? 'text-rose-400' :
              selectedScenario.riskLevel === 'HIGH' ? 'text-orange-400' :
              selectedScenario.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'
            }`}>{selectedScenario.riskLevel} RISK</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-500 ml-2">
              {selectedScenario.redFlags.length} flags across {new Set(selectedScenario.redFlags.map(f => f.category)).size} categories
            </span>
          </div>
          <button onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer btn-ripple relative overflow-hidden"
            aria-label="Analyze another transcript">
            <RotateCcw size={10} />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {[
          { label: 'Detection Precision', value: '97.3%', color: '#3b82f6' },
          { label: 'Recall (Sensitivity)', value: '94.8%', color: '#10b981' },
          { label: 'False Positive Rate', value: '2.1%', color: '#06b6d4', highlight: true },
          { label: 'Alert Lead Time', value: '14.2 days', color: '#8b5cf6' },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl glass-panel card-hover">
            <BarChart3 size={13} className="flex-shrink-0" style={{ color: m.color }} strokeWidth={1.5} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs sm:text-sm font-semibold" style={{ color: m.color }}>{m.value}</span>
                {m.highlight && <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-medium">LOW</span>}
              </div>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 truncate block">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Selector */}
      <div className="relative mb-4 sm:mb-5 animate-fade-slide-up stagger-2" style={{ animationFillMode: 'both', zIndex: 50 }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 rounded-xl glass-panel btn-premium btn-ripple relative overflow-hidden
            text-zinc-300 text-xs sm:text-sm cursor-pointer touch-target"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
          aria-label="Select a transcript scenario"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={14} className="text-zinc-500 flex-shrink-0" strokeWidth={1.5} />
            <span className="truncate">{selectedScenario ? selectedScenario.label : 'Choose a scam scenario to analyze...'}</span>
          </div>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`} strokeWidth={1.5} />
        </button>
        {showDropdown && (
          <div className="absolute z-[200] w-full mt-2 glass-panel-strong rounded-xl shadow-2xl shadow-black/40 overflow-hidden" role="listbox" aria-label="Scam scenarios">
            {TRANSCRIPT_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left hover:bg-white/[0.04] transition-colors cursor-pointer border-b border-white/[0.04] last:border-b-0 touch-target"
                role="option"
                aria-selected={selectedScenario?.id === scenario.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-zinc-200 font-medium">{scenario.label}</span>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                    scenario.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' :
                    scenario.riskLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                    scenario.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>{scenario.riskLevel}</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 block">{scenario.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 min-h-0 animate-fade-slide-up stagger-3" style={{ animationFillMode: 'both' }}>
        {/* Transcript */}
        <div className="lg:col-span-3 flex flex-col glass-panel card-hover rounded-xl sm:rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[280px] lg:min-h-0">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider">Transcript Analysis</span>
            {isAnalyzing && (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-rose-400 font-mono" aria-live="polite">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                ANALYZING
              </span>
            )}
            {analyzed && (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-blue-400 font-mono" aria-live="polite">
                <Sparkles size={10} />
                COMPLETE
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-1 mobile-scroll">
            {!selectedScenario && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <FileText size={24} className="text-zinc-600" strokeWidth={1} />
                </div>
                <p className="text-xs sm:text-sm text-center font-medium text-zinc-400 mb-1">Select a scam scenario above</p>
                <p className="text-[10px] sm:text-xs text-center text-zinc-600 max-w-[260px]">
                  Choose from {TRANSCRIPT_SCENARIOS.length} pre-loaded scenarios to see real-time multi-agent analysis
                </p>
                <div className="flex items-center gap-3 mt-4">
                  {TRANSCRIPT_SCENARIOS.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] text-zinc-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        s.riskLevel === 'CRITICAL' ? 'bg-rose-500/40' :
                        s.riskLevel === 'HIGH' ? 'bg-orange-500/40' :
                        s.riskLevel === 'MEDIUM' ? 'bg-amber-500/40' : 'bg-blue-500/40'
                      }`} />
                      <span className="font-mono">{s.riskLevel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedScenario && renderHighlightedTranscript()}
          </div>
        </div>

        {/* Risk Score + Evidence */}
        <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 lg:gap-5">
          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-4 sm:mb-5">Threat Assessment</span>
            {selectedScenario ? (
              <RiskScore
                score={analyzed || isAnalyzing ? selectedScenario.finalScore : 0}
                level={analyzed ? selectedScenario.riskLevel : 'LOW'}
                animate={isAnalyzing || analyzed}
              />
            ) : (
              <div className="text-zinc-600 text-xs sm:text-sm">Awaiting input</div>
            )}
            {selectedScenario && analyzed && (
              <div className="mt-4 sm:mt-5 text-center animate-fade-slide-up">
                <p className="text-zinc-500 text-[10px] sm:text-xs">
                  {selectedScenario.redFlags.length} red flags detected across{' '}
                  {new Set(selectedScenario.redFlags.map(f => f.category)).size} categories
                </p>
              </div>
            )}
          </div>

          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5 flex-1 overflow-y-auto mobile-scroll">
            {analyzed && selectedScenario && selectedScenario.evidencePackage.length > 0 ? (
              <EvidencePackage items={selectedScenario.evidencePackage} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <FileText size={16} className="text-zinc-600" strokeWidth={1} />
                </div>
                <p className="text-[10px] sm:text-xs text-center text-zinc-500">
                  {isAnalyzing ? 'Building evidence package...' : 'Complete analysis to generate evidence package'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-3 sm:mt-4 glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5 max-h-[160px] sm:max-h-[200px] overflow-hidden animate-fade-slide-up stagger-4" style={{ animationFillMode: 'both' }}>
        <ActivityLog entries={activityEntries} isAnimating={isAnalyzing} />
      </div>
    </div>
  );
}
