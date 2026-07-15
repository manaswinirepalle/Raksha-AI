import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import RadarBackground from './components/RadarBackground';
import Sidebar, { type ModuleId } from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TopTicker from './components/TopTicker';
import Landing from './components/Landing';
import { ToastProvider } from './components/Toast';
import { Shield, Loader2 } from 'lucide-react';

const ScamDetector = lazy(() => import('./modules/ScamDetector'));
const MessageChecker = lazy(() => import('./modules/CitizenShield'));
const CallProtection = lazy(() => import('./modules/CounterfeitAgent'));
const SafetyCenter = lazy(() => import('./modules/SafetyCenter'));
const ScamAlerts = lazy(() => import('./modules/ScamAlerts'));
const ReportFraud = lazy(() => import('./modules/ReportFraud'));
const ThreatInsights = lazy(() => import('./modules/ThreatInsights'));
const ScamTrends = lazy(() => import('./modules/ScamTrends'));
const SafetyTips = lazy(() => import('./components/LearningMode'));
const ActivityDashboard = lazy(() => import('./modules/ActivityDashboard'));
const Reports = lazy(() => import('./modules/Reports'));
const SecurityOverview = lazy(() => import('./modules/SecurityOverview'));
const HelpCenter = lazy(() => import('./modules/HelpCenter'));
const ContactSupport = lazy(() => import('./modules/ContactSupport'));
const SettingsPage = lazy(() => import('./modules/SettingsPage'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODULE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'scam-scanner': ScamDetector,
  'message-checker': MessageChecker,
  'call-protection': CallProtection,
  'safety-center': SafetyCenter,
  'scam-alerts': ScamAlerts,
  'report-fraud': ReportFraud,
  'threat-insights': ThreatInsights,
  'scam-trends': ScamTrends,
  'safety-tips': SafetyTips,
  'activity-dashboard': ActivityDashboard,
  'reports': Reports,
  'security-overview': SecurityOverview,
  'help-center': HelpCenter,
  'contact-support': ContactSupport,
  'settings': SettingsPage,
};

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full gap-3">
      <Loader2 size={20} className="text-blue-400 animate-spin" />
      <span className="text-sm text-zinc-500">Loading...</span>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<ModuleId>('landing');
  const [pageKey, setPageKey] = useState(0);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  const handleEnter = useCallback(() => {
    setCurrentView('scam-scanner');
    setPageKey(k => k + 1);
  }, []);

  const handleModuleSelect = useCallback((id: ModuleId) => {
    scrollPositions.current.set(currentView, window.scrollY);
    setCurrentView(id);
    setPageKey(k => k + 1);
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'landing') return;
    const raf = requestAnimationFrame(() => {
      const pos = scrollPositions.current.get(currentView);
      window.scrollTo(0, pos ?? 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [currentView]);

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

  const ActiveComponent = MODULE_COMPONENTS[currentView];

  return (
    <ToastProvider>
      <div className="min-h-screen relative" style={{ background: '#09090b' }}>
        <RadarBackground />
        <Sidebar active={currentView} onSelect={handleModuleSelect} />
        <div
          className="flex flex-col min-w-0 relative z-10 overflow-x-hidden"
          style={{
            marginLeft: 'var(--sidebar-width, 0px)',
            transition: 'margin-left 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <TopTicker activeView={currentView} />
          <div className="flex lg:hidden h-11 items-center px-4 safe-top flex-shrink-0 sticky top-0 z-20"
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
          <div className="p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-6 relative pb-20 lg:pb-6">
            <div key={pageKey} className="animate-page-enter">
              {ActiveComponent && (
                <Suspense fallback={<PageLoader />}>
                  <ActiveComponent />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        <MobileNav active={currentView} onSelect={handleModuleSelect} />
      </div>
    </ToastProvider>
  );
}
