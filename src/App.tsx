import { useState, useCallback } from 'react';
import RadarBackground from './components/RadarBackground';
import Sidebar, { type ModuleId } from './components/Sidebar';
import TopTicker from './components/TopTicker';
import Landing from './components/Landing';
import ScamDetector from './modules/ScamDetector';
import CounterfeitAgent from './modules/CounterfeitAgent';
import FraudNetwork from './modules/FraudNetwork';
import CrimeHeatmap from './modules/CrimeHeatmap';
import CitizenShield from './modules/CitizenShield';
import { Shield } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ModuleId>('landing');

  const handleEnter = useCallback(() => {
    setCurrentView('scam-detector');
  }, []);

  const handleModuleSelect = useCallback((id: ModuleId) => {
    setCurrentView(id);
  }, []);

  if (currentView === 'landing') {
    return (
      <div className="w-full h-full flex flex-col bg-[#0B1220]">
        <RadarBackground />
        <Landing onEnter={handleEnter} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-[#0B1220]">
      <RadarBackground />
      <Sidebar active={currentView} onSelect={handleModuleSelect} />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <div className="h-12 border-b border-[#1F2937] flex items-center bg-[#0B1220]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 border-r border-[#1F2937] h-full">
            <Shield size={16} className="text-[#22D3EE]" />
            <span className="font-mono text-xs font-bold text-[#E5E7EB] tracking-wide">RAKSHA AI</span>
          </div>
          <TopTicker />
        </div>
        <div className="flex-1 p-6 overflow-clip relative">
          {/* All modules mounted once, shown/hidden via CSS. State never resets. */}
          <div style={{ display: currentView === 'scam-detector' ? 'block' : 'none' }} className="h-full">
            <ScamDetector />
          </div>
          <div style={{ display: currentView === 'counterfeit' ? 'block' : 'none' }} className="h-full">
            <CounterfeitAgent />
          </div>
          <div style={{ display: currentView === 'fraud-network' ? 'block' : 'none' }} className="h-full">
            <FraudNetwork />
          </div>
          <div style={{ display: currentView === 'heatmap' ? 'block' : 'none' }} className="h-full">
            <CrimeHeatmap />
          </div>
          <div style={{ display: currentView === 'citizen-shield' ? 'block' : 'none' }} className="h-full">
            <CitizenShield />
          </div>
        </div>
      </div>
    </div>
  );
}
