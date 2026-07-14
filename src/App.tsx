import { useState, useCallback } from 'react';
import RadarBackground from './components/RadarBackground';
import Sidebar, { type ModuleId } from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TopTicker from './components/TopTicker';
import Landing from './components/Landing';
import { ToastProvider } from './components/Toast';
import ScamDetector from './modules/ScamDetector';
import CounterfeitAgent from './modules/CounterfeitAgent';
import FraudNetwork from './modules/FraudNetwork';
import CrimeHeatmap from './modules/CrimeHeatmap';
import CitizenShield from './modules/CitizenShield';
import { Shield } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ModuleId>('landing');
  const [pageKey, setPageKey] = useState(0);

  const handleEnter = useCallback(() => {
    setCurrentView('scam-detector');
    setPageKey(k => k + 1);
  }, []);

  const handleModuleSelect = useCallback((id: ModuleId) => {
    setCurrentView(id);
    setPageKey(k => k + 1);
  }, []);

  if (currentView === 'landing') {
    return (
      <ToastProvider>
        <div className="w-full h-full flex flex-col" style={{ background: '#09090b' }}>
          <RadarBackground />
          <Landing onEnter={handleEnter} onModuleSelect={id => handleModuleSelect(id as ModuleId)} />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="w-full h-full flex" style={{ background: '#09090b' }}>
        <RadarBackground />
        <Sidebar active={currentView} onSelect={handleModuleSelect} />
        <div className="flex-1 flex flex-col min-w-0 relative z-10 min-h-0">
          <TopTicker activeView={currentView} />
          <div className="flex lg:hidden h-14 items-center px-4 safe-top flex-shrink-0"
            style={{
              background: 'rgba(9,9,11,0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' }}>
                <Shield size={14} className="text-blue-400" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-semibold text-zinc-200 tracking-wide">RAKSHA AI</span>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] text-blue-400/80 font-medium px-2.5 py-1 rounded-full truncate max-w-[140px] block"
                style={{ background: 'rgba(59,130,246,0.08)' }}>
                {currentView.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
          </div>
          <div className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden relative pb-20 lg:pb-6 mobile-scroll min-h-0">
            <div key={pageKey} className="h-full animate-page-enter">
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
        <MobileNav active={currentView} onSelect={handleModuleSelect} />
      </div>
    </ToastProvider>
  );
}
