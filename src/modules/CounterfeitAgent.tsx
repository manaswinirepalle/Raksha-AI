import { useState } from 'react';
import { Banknote, Check, X } from 'lucide-react';
import { COUNTERFEIT_FEATURES_500, COUNTERFEIT_FEATURES_2000 } from '../mockData';
import Tooltip from '../components/Tooltip';

export default function CounterfeitAgent() {
  const [denomination, setDenomination] = useState<'500' | '2000' | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});
  const [analyzed, setAnalyzed] = useState(false);

  const features = denomination === '500' ? COUNTERFEIT_FEATURES_500 : denomination === '2000' ? COUNTERFEIT_FEATURES_2000 : [];

  const handleFeatureToggle = (name: string) => {
    setSelectedFeatures(prev => ({ ...prev, [name]: !prev[name] }));
    setAnalyzed(false);
  };

  const handleAnalyze = () => {
    setAnalyzed(true);
  };

  const getConfidence = () => {
    if (!denomination || Object.keys(selectedFeatures).length === 0) return 0;
    const featureList = denomination === '500' ? COUNTERFEIT_FEATURES_500 : COUNTERFEIT_FEATURES_2000;
    const presentFeatures = featureList.filter(f => f.present);
    const matchingPresent = featureList.filter(f => f.present && selectedFeatures[f.name]);
    const matchingAbsent = featureList.filter(f => !f.present && !selectedFeatures[f.name]);
    const total = presentFeatures.length + featureList.filter(f => !f.present).length;
    const correct = matchingPresent.length + matchingAbsent.length;
    return Math.round((correct / total) * 100);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-slide-up">
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center gap-2.5">
            <Banknote size={22} className="text-[#FBBF24]" />
            Counterfeit Currency Agent
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">Security feature verification and confidence scoring</p>
        </div>
        <Tooltip text="RBI FICN Detection Standards" />
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {/* Left: Feature checklist */}
        <div className="col-span-2 flex flex-col bg-[#131B2E] rounded-2xl border border-[#1F2937] overflow-hidden">
          {/* Denomination selector */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1F2937]">
            <span className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider">Select Note:</span>
            {(['500', '2000'] as const).map(d => (
              <button
                key={d}
                onClick={() => { setDenomination(d); setSelectedFeatures({}); setAnalyzed(false); }}
                className={`px-4 py-1.5 rounded-lg font-mono text-sm font-semibold border transition-all duration-150 cursor-pointer ${
                  denomination === d
                    ? 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/40'
                    : 'bg-[#1F2937] text-[#6B7280] border-[#1F2937] hover:border-[#6B7280]/30'
                }`}
              >
                ₹{d}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="flex-1 overflow-y-auto p-5">
            {!denomination && (
              <div className="flex flex-col items-center justify-center h-full text-[#6B7280]">
                <Banknote size={32} className="mb-3 opacity-30" />
                <p className="text-sm">Select a denomination to begin verification</p>
              </div>
            )}
            {denomination && (
              <div className="space-y-2">
                <p className="text-[#6B7280] text-xs mb-3">
                  Select the security features you observe on the note:
                </p>
                {features.map(feature => {
                  const isSelected = selectedFeatures[feature.name] || false;
                  const matchResult = analyzed
                    ? (feature.present && isSelected) || (!feature.present && !isSelected)
                    : null;

                  return (
                    <button
                      key={feature.name}
                      onClick={() => handleFeatureToggle(feature.name)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                        matchResult === true
                          ? 'bg-[#22D3EE]/8 border-[#22D3EE]/30'
                          : matchResult === false
                            ? 'bg-[#FF3B4E]/8 border-[#FF3B4E]/30'
                            : isSelected
                              ? 'bg-[#FBBF24]/8 border-[#FBBF24]/30'
                              : 'bg-[#0B1220] border-[#1F2937] hover:border-[#1F2937]/80'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border ${
                        isSelected
                          ? 'bg-[#FBBF24]/20 border-[#FBBF24]/50 text-[#FBBF24]'
                          : 'bg-[#1F2937] border-[#1F2937] text-transparent'
                      }`}>
                        {isSelected ? <Check size={14} /> : <span className="w-2 h-2 rounded-sm" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#E5E7EB] font-medium">{feature.name}</span>
                          {matchResult !== null && (
                            matchResult
                              ? <Check size={12} className="text-[#22D3EE]" />
                              : <X size={12} className="text-[#FF3B4E]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">{feature.description}</p>
                      </div>
                      <span className="font-mono text-[11px] text-[#6B7280]">
                        {feature.confidence}%
                      </span>
                    </button>
                  );
                })}
                {Object.keys(selectedFeatures).length > 0 && !analyzed && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full mt-3 px-4 py-3 rounded-lg bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30
                      font-semibold text-sm hover:bg-[#FBBF24]/25 hover:scale-[1.01] hover:shadow-[0_0_12px_rgba(251,191,36,0.15)]
                      active:scale-[0.99] transition-all duration-150 cursor-pointer"
                  >
                    Analyze Note Authenticity
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Score and results */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-6 flex flex-col items-center">
            <span className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-4">Confidence Score</span>
            {analyzed ? (
              <>
                <div
                  className={`font-mono font-bold text-5xl ${
                    getConfidence() >= 75 ? 'text-[#22D3EE]' : getConfidence() >= 50 ? 'text-[#FBBF24]' : 'text-[#FF3B4E]'
                  }`}
                >
                  {getConfidence()}%
                </div>
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                  getConfidence() >= 75
                    ? 'bg-[#22D3EE]/15 text-[#22D3EE]'
                    : getConfidence() >= 50
                      ? 'bg-[#FBBF24]/15 text-[#FBBF24]'
                      : 'bg-[#FF3B4E]/15 text-[#FF3B4E]'
                }`}>
                  {getConfidence() >= 75 ? 'LIKELY GENUINE' : getConfidence() >= 50 ? 'UNCERTAIN' : 'LIKELY COUNTERFEIT'}
                </div>
              </>
            ) : (
              <div className="text-[#6B7280] text-sm">Select features to analyze</div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">RBI FICN Data</h3>
            <div className="space-y-3">
              {[
                { label: '₹500 Detection Accuracy', value: '96.7%', color: '#22D3EE' },
                { label: '₹2000 Detection Accuracy', value: '94.2%', color: '#22D3EE' },
                { label: 'False Positive Rate', value: '1.8%', color: '#34D399' },
                { label: 'Notes Scanned (2024)', value: '2.4M', color: '#A78BFA' },
                { label: 'Counterfeits Found', value: '18,472', color: '#FF3B4E' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{stat.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
