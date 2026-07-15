import { useState } from 'react';
import { Banknote, Check, X, RotateCcw } from 'lucide-react';
import { COUNTERFEIT_FEATURES_500, COUNTERFEIT_FEATURES_2000 } from '../mockData';
import Tooltip from '../components/Tooltip';
import { useToast } from '../components/Toast';
import SuccessCheck from '../components/SuccessCheck';

export default function CounterfeitAgent() {
  const { addToast } = useToast();
  const [denomination, setDenomination] = useState<'500' | '2000' | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});
  const [analyzed, setAnalyzed] = useState(false);

  const features = denomination === '500' ? COUNTERFEIT_FEATURES_500 : denomination === '2000' ? COUNTERFEIT_FEATURES_2000 : [];
  const selectedCount = Object.values(selectedFeatures).filter(Boolean).length;
  const totalFeatures = features.length;

  const handleFeatureToggle = (name: string) => {
    setSelectedFeatures(prev => ({ ...prev, [name]: !prev[name] }));
    setAnalyzed(false);
  };

  const handleAnalyze = () => {
    setAnalyzed(true);
    const conf = getConfidence();
    addToast(
      conf >= 75 ? 'Note likely genuine' : conf >= 50 ? 'Analysis uncertain — manual verification recommended' : 'Note likely counterfeit — report to authorities',
      conf >= 75 ? 'success' : conf >= 50 ? 'info' : 'error'
    );
  };

  const handleDenominationChange = (d: '500' | '2000') => {
    setDenomination(d);
    setSelectedFeatures({});
    setAnalyzed(false);
  };

  const handleReset = () => {
    setSelectedFeatures({});
    setAnalyzed(false);
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
      <div className="flex items-start sm:items-center justify-between gap-2.5 mb-3 animate-fade-slide-up">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <Banknote size={14} className="text-amber-400" strokeWidth={1.5} />
            </div>
            <span className="truncate">Counterfeit Currency Agent</span>
          </h2>
          <p className="text-zinc-500 text-[10px] mt-0.5 hidden sm:block">Security feature verification and confidence scoring</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {Object.keys(selectedFeatures).length > 0 && (
            <button onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg glass-subtle text-[10px] text-zinc-500 hover:text-zinc-200 transition-all duration-300 cursor-pointer touch-target btn-ripple relative overflow-hidden"
              aria-label="Reset feature selections">
              <RotateCcw size={10} strokeWidth={1.5} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
          <div className="hidden sm:block">
            <Tooltip text="RBI FICN Detection Standards" />
          </div>
        </div>
      </div>

      {/* Feature progress indicator */}
      {denomination && (
        <div className="mb-3 flex items-center gap-2.5 animate-fade-in">
          <div className="progress-premium h-1.5 flex-1" role="progressbar" aria-valuenow={totalFeatures > 0 ? (selectedCount / totalFeatures) * 100 : 0} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill"
              style={{
                width: totalFeatures > 0 ? `${(selectedCount / totalFeatures) * 100}%` : '0%',
                background: analyzed
                  ? getConfidence() >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : getConfidence() >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #f43f5e, #fb7185)'
                  : 'linear-gradient(90deg, #f59e0b, #eab308)',
              }} />
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono flex-shrink-0" aria-live="polite">
            {selectedCount}/{totalFeatures} features
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        <div className="lg:col-span-2 flex flex-col glass-panel card-hover rounded-xl sm:rounded-2xl overflow-hidden min-h-[240px] lg:min-h-0">
          <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">Note:</span>
            {(['500', '2000'] as const).map(d => (
              <button
                key={d}
                onClick={() => handleDenominationChange(d)}
                className={`touch-target px-2.5 sm:px-3 py-1 rounded-lg font-mono text-[10px] sm:text-xs font-medium border transition-all duration-300 cursor-pointer ${
                  denomination === d
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:border-white/10'
                }`}
                aria-pressed={denomination === d}
                aria-label={`Select ₹${d} denomination`}
              >
                ₹{d}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 mobile-scroll">
            {!denomination && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Banknote size={20} className="text-zinc-600" strokeWidth={1} />
                </div>
                <p className="text-[11px] text-center font-medium text-zinc-400 mb-0.5">Select a denomination above</p>
                <p className="text-[9px] text-center text-zinc-600 max-w-[200px]">
                  Choose ₹500 or ₹2000 to begin checking security features
                </p>
                <div className="flex items-center gap-3 mt-3">
                  {(['500', '2000'] as const).map(d => (
                    <div key={d} className="flex items-center gap-1 text-[9px] text-zinc-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                      <span className="font-mono">₹{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {denomination && (
              <div className="space-y-1.5">
                <p className="text-zinc-500 text-[9px] sm:text-[10px] mb-1.5">
                  Tap each security feature you observe on the note:
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
                      className={`w-full flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 cursor-pointer text-left touch-target ${
                        matchResult === true
                          ? 'bg-emerald-500/[0.06] border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.03)]'
                          : matchResult === false
                            ? 'bg-rose-500/[0.06] border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.03)]'
                            : isSelected
                              ? 'bg-amber-500/[0.06] border-amber-500/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.03)]'
                              : 'glass-subtle border-white/[0.04] hover:border-white/10 hover:bg-white/[0.03]'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${feature.name} — ${feature.description}`}
                    >
                      <div className={`w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-white/[0.04] border-white/[0.08] text-transparent'
                      }`}>
                        {isSelected ? <Check size={10} strokeWidth={2} /> : <span className="w-1 h-1 rounded-sm" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] sm:text-[11px] text-zinc-200 font-medium truncate">{feature.name}</span>
                          {matchResult !== null && (
                            matchResult
                              ? <Check size={8} className="text-emerald-400 flex-shrink-0" strokeWidth={2} />
                              : <X size={8} className="text-rose-400 flex-shrink-0" strokeWidth={2} />
                          )}
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{feature.description}</p>
                      </div>
                      <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 flex-shrink-0">
                        {feature.confidence}%
                      </span>
                    </button>
                  );
                })}
                {Object.keys(selectedFeatures).length > 0 && !analyzed && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full mt-2 px-3 py-2.5 rounded-xl font-semibold text-[11px] sm:text-xs btn-premium btn-ripple cursor-pointer touch-target relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,179,8,0.08))', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}
                    aria-label="Analyze note authenticity"
                  >
                    Analyze Note Authenticity
                  </button>
                )}
                {analyzed && (
                  <button
                    onClick={handleReset}
                    className="w-full mt-2 px-3 py-2 rounded-xl text-[11px] sm:text-xs cursor-pointer touch-target flex items-center justify-center gap-1.5 glass-subtle text-zinc-400 hover:text-zinc-200 transition-all btn-ripple relative overflow-hidden"
                    aria-label="Reset and check another note"
                  >
                    <RotateCcw size={10} />
                    Check Another Note
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center">
            <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider mb-2.5">Confidence Score</span>
            {analyzed ? (
              <div className="flex flex-col items-center animate-scale-in">
                {getConfidence() >= 75 && (
                  <div className="mb-2">
                    <SuccessCheck size={36} color="#10b981" />
                  </div>
                )}
                <div className={`font-mono font-bold text-3xl sm:text-4xl ${
                  getConfidence() >= 75 ? 'text-emerald-400' : getConfidence() >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {getConfidence()}%
                </div>
                <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium ${
                  getConfidence() >= 75
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : getConfidence() >= 50
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {getConfidence() >= 75 ? 'LIKELY GENUINE' : getConfidence() >= 50 ? 'UNCERTAIN' : 'LIKELY COUNTERFEIT'}
                </div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-2 text-center">
                  {selectedCount} of {totalFeatures} features checked
                </p>
              </div>
            ) : (
              <div className="text-zinc-500 text-[10px] sm:text-[11px] text-center">
                {denomination ? 'Select features and analyze' : 'Select a denomination first'}
              </div>
            )}
          </div>

          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <h3 className="font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider mb-2">RBI FICN Data</h3>
            <div className="space-y-2">
              {[
                { label: '₹500 Detection Accuracy', value: '96.7%', color: '#10b981' },
                { label: '₹2000 Detection Accuracy', value: '94.2%', color: '#10b981' },
                { label: 'False Positive Rate', value: '1.8%', color: '#06b6d4' },
                { label: 'Notes Scanned (2024)', value: '2.4M', color: '#8b5cf6' },
                { label: 'Counterfeits Found', value: '18,472', color: '#f43f5e' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 truncate">{stat.label}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold flex-shrink-0" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
