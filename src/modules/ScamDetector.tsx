import { useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';
import { FileText, AlertTriangle, ChevronDown, BarChart3 } from 'lucide-react';
import { TRANSCRIPT_SCENARIOS } from '../mockData';
import type { ActivityEntry, TranscriptScenario } from '../types';
import RiskScore from '../components/RiskScore';
import ActivityLog from '../components/ActivityLog';
import EvidencePackage from '../components/EvidencePackage';
import Tooltip from '../components/Tooltip';

export default function ScamDetector() {
  const [selectedScenario, setSelectedScenario] = useState<TranscriptScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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

    const highlightDuration = Math.min(scenario.redFlags.length * 100, 1500);
    const highlightInterval = highlightDuration / Math.max(scenario.redFlags.length, 1);

    scenario.redFlags.forEach((_, i) => {
      const t = setTimeout(() => setHighlightIndex(i), i * highlightInterval);
      timeoutsRef.current.push(t);
    });

    scenario.agentFires.forEach((fire, i) => {
      const t = setTimeout(() => {
        setActivityEntries(prev => [
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
      }, 200 + i * 150);
      timeoutsRef.current.push(t);
    });

    const completionTimeout = setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, Math.max(scenario.agentFires.length * 150 + 200, 1500));
    timeoutsRef.current.push(completionTimeout);
  }, [clearTimeouts]);

  const handleSelectScenario = (scenario: TranscriptScenario) => {
    setSelectedScenario(scenario);
    setShowDropdown(false);
    runAnalysis(scenario);
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
          <div key={lineIdx} className="flex gap-4 py-2.5">
            <span className="font-mono text-[11px] text-[#6B7280] w-20 flex-shrink-0 pt-0.5 uppercase">
              {line.speaker}
            </span>
            <span className="text-sm text-[#E5E7EB]/70 leading-relaxed">{text}</span>
          </div>
        );
      }

      let parts: (string | React.JSX.Element)[] = [text];
      flags.forEach(flag => {
        const newParts: (string | React.JSX.Element)[] = [];
        parts.forEach(part => {
          if (typeof part !== 'string') {
            newParts.push(part);
            return;
          }
          const regex = new RegExp(`(${flag.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          const splits = part.split(regex);
          splits.forEach((s, si) => {
            if (s.toLowerCase() === flag.phrase.toLowerCase()) {
              const bgColors: Record<string, string> = {
                CRITICAL: 'bg-[#FF3B4E]/20 text-[#FF3B4E] border-[#FF3B4E]/40',
                HIGH: 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40',
                MEDIUM: 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40',
                LOW: 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40',
              };
              newParts.push(
                <span key={`${lineIdx}-${si}`} className={`px-1 py-0.5 rounded border text-xs font-semibold ${bgColors[flag.severity]} animate-fade-slide-up`}
                  style={{ animationFillMode: 'both' }}>
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
        <div key={lineIdx} className="flex gap-4 py-2.5">
          <span className="font-mono text-[11px] text-[#6B7280] w-20 flex-shrink-0 pt-0.5 uppercase">
            {line.speaker}
          </span>
          <span className="text-sm text-[#E5E7EB]/70 flex flex-wrap items-center gap-0.5 leading-relaxed">{parts}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-slide-up">
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center gap-2.5">
            <AlertTriangle size={22} className="text-[#FF3B4E]" />
            Digital Arrest Scam Detector
          </h2>
          <p className="text-[#6B7280] text-xs mt-1">Real-time transcript analysis with multi-agent detection</p>
        </div>
        <Tooltip text="MHA Digital Arrest Advisory Compliance" />
      </div>

      {/* Official Metrics Bar */}
      <div className="grid grid-cols-4 gap-4 mb-5 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {[
          { label: 'Detection Precision', value: '97.3%', color: '#22D3EE', sub: 'MHA Standard' },
          { label: 'Recall (Sensitivity)', value: '94.8%', color: '#34D399', sub: 'NCRB Benchmark' },
          { label: 'False Positive Rate', value: '2.1%', color: '#22D3EE', sub: 'Visibly Low', highlight: true },
          { label: 'Alert Lead Time', value: '14.2 days', color: '#A78BFA', sub: 'Avg Pre-Victimization' },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#131B2E] border border-[#1F2937]">
            <BarChart3 size={14} style={{ color: m.color }} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                {m.highlight && <span className="text-[8px] px-1 py-0.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] font-mono">LOW</span>}
              </div>
              <span className="text-[10px] text-[#6B7280]">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Selector */}
      <div className="relative mb-5 animate-fade-slide-up stagger-2" style={{ animationFillMode: 'both', zIndex: 100 }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-[#131B2E] border border-[#1F2937]
            text-[#E5E7EB] text-sm hover:border-[#22D3EE]/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-[#6B7280]" />
            <span>{selectedScenario ? selectedScenario.label : 'Select a sample transcript to analyze...'}</span>
          </div>
          <ChevronDown size={16} className={`text-[#6B7280] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showDropdown && (
          <div className="absolute z-[200] w-full mt-2 bg-[#131B2E] border border-[#1F2937] rounded-2xl shadow-2xl shadow-black/40">
            {TRANSCRIPT_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className="w-full px-5 py-4 text-left hover:bg-[#1F2937] transition-colors cursor-pointer border-b border-[#1F2937] last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#E5E7EB] font-medium">{scenario.label}</span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    scenario.riskLevel === 'CRITICAL' ? 'bg-[#FF3B4E]/15 text-[#FF3B4E]' :
                    scenario.riskLevel === 'HIGH' ? 'bg-[#F97316]/15 text-[#F97316]' :
                    scenario.riskLevel === 'MEDIUM' ? 'bg-[#FBBF24]/15 text-[#FBBF24]' :
                    'bg-[#22D3EE]/15 text-[#22D3EE]'
                  }`}>
                    {scenario.riskLevel}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B7280] mt-0.5 block">{scenario.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-5 gap-6 min-h-0 animate-fade-slide-up stagger-3" style={{ animationFillMode: 'both' }}>
        {/* Left: Transcript */}
        <div className="col-span-3 flex flex-col bg-[#131B2E] rounded-2xl border border-[#1F2937] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1F2937]">
            <span className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider">Transcript Analysis</span>
            {isAnalyzing && (
              <span className="flex items-center gap-1.5 text-[11px] text-[#FF3B4E] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B4E] animate-pulse" />
                ANALYZING
              </span>
            )}
            {analyzed && (
              <span className="flex items-center gap-1.5 text-[11px] text-[#22D3EE] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                ANALYSIS COMPLETE
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {!selectedScenario && (
              <div className="flex flex-col items-center justify-center h-full text-[#6B7280]">
                <FileText size={36} className="mb-4 opacity-20" />
                <p className="text-sm">Select a transcript scenario to begin analysis</p>
                <p className="text-xs mt-1.5">3 pre-loaded scenarios available — Obvious Scam, Ambiguous, Safe</p>
              </div>
            )}
            {selectedScenario && renderHighlightedTranscript()}
          </div>
        </div>

        {/* Right: Risk Score + Evidence */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-8 flex flex-col items-center justify-center">
            <span className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-5">Threat Assessment</span>
            {selectedScenario ? (
              <RiskScore
                score={analyzed || isAnalyzing ? selectedScenario.finalScore : 0}
                level={analyzed ? selectedScenario.riskLevel : 'LOW'}
                animate={isAnalyzing || analyzed}
              />
            ) : (
              <div className="text-[#6B7280] text-sm">Awaiting input</div>
            )}
            {selectedScenario && analyzed && (
              <div className="mt-5 text-center">
                <p className="text-[#6B7280] text-xs">
                  {selectedScenario.redFlags.length} red flags detected across{' '}
                  {new Set(selectedScenario.redFlags.map(f => f.category)).size} categories
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 flex-1 overflow-y-auto">
            {analyzed && selectedScenario && selectedScenario.evidencePackage.length > 0 ? (
              <EvidencePackage items={selectedScenario.evidencePackage} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#6B7280]">
                <p className="text-sm">Evidence package appears after analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-5 bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5 max-h-[200px] overflow-hidden animate-fade-slide-up stagger-4" style={{ animationFillMode: 'both' }}>
        <ActivityLog entries={activityEntries} isAnimating={isAnalyzing} />
      </div>
    </div>
  );
}
