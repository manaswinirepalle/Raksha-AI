import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import RadarBackground from './components/RadarBackground';
import Sidebar, { type ModuleId } from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Landing from './components/Landing';
import { ToastProvider } from './components/Toast';
import { Loader2 } from 'lucide-react';

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
          <div className="p-2 sm:p-3 lg:p-4 xl:p-5 2xl:p-5 relative pb-20 lg:pb-6">
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
