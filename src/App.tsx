import React, { useState } from 'react';
import { getConstituencyById, DEFAULT_CONSTITUENCY_ID } from './data/mockElectoralData';
import { UserSession } from './types/auth';
import { getStoredSession, clearSession } from './data/mockAuthData';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { ExportReportModal } from './components/ExportReportModal';
import { OverviewView } from './components/OverviewView';
import { DemographicsView } from './components/DemographicsView';
import { BoothExplorerView } from './components/BoothExplorerView';
import { TrendsAndSwingView } from './components/TrendsAndSwingView';
import { SwingSimulatorView } from './components/SwingSimulatorView';
import { DataSourcesView } from './components/DataSourcesView';
import { Form20ImporterModal } from './components/Form20ImporterModal';

export function App() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getStoredSession());
  
  // Navigation View: 'HOME' (Constituency Selection Hub) vs 'DASHBOARD' (Deep Constituency Analytics)
  const [currentView, setCurrentView] = useState<'HOME' | 'DASHBOARD'>('HOME');

  // Active electoral dashboard state
  const [activeConstituencyId, setActiveConstituencyId] = useState<string>(DEFAULT_CONSTITUENCY_ID);
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);

  // Data update counter to trigger reactivity across the app
  const [dataRevision, setDataRevision] = useState<number>(0);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isImporterModalOpen, setIsImporterModalOpen] = useState<boolean>(false);

  // Active constituency instance
  const constituency = React.useMemo(() => {
    return getConstituencyById(activeConstituencyId);
  }, [activeConstituencyId, dataRevision]);

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentView('HOME');
  };

  const handleLaunchConstituency = (constituencyId: string) => {
    setActiveConstituencyId(constituencyId);
    setSelectedBoothId(null);
    setActiveTab('OVERVIEW');
    setCurrentView('DASHBOARD');
  };

  // Step 1: If user is not authenticated, ONLY display the dedicated login page
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={(session) => {
          if (session.name === 'Rajeshwar Kulkarni (IAS)' || !session.name) {
            session.name = 'Organisational user';
          }
          setCurrentUser(session);
          // If assigned constituency exists on user session, pre-select it
          if (session.assignedConstituency) {
            setActiveConstituencyId(session.assignedConstituency);
          }
          // Direct them to the Home page for constituency selection
          setCurrentView('HOME');
        }} 
      />
    );
  }

  // Step 2: Once logged in, show the Home page where user selects the constituency and state/district overview
  if (currentView === 'HOME') {
    return (
      <HomePage
        currentUser={currentUser}
        onSelectConstituencyAndLaunch={handleLaunchConstituency}
        onLogout={handleLogout}
      />
    );
  }

  // Step 3: Deep constituency analytics dashboard workspace
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header Navigation */}
      <Header
        constituency={constituency}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenImporterModal={() => setIsImporterModalOpen(true)}
        onNavigateHome={() => setCurrentView('HOME')}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
        activeTab={activeTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          constituency={constituency}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onNavigateHome={() => setCurrentView('HOME')}
          currentUser={currentUser}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'OVERVIEW' && (
            <OverviewView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'DEMOGRAPHICS' && (
            <DemographicsView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'BOOTHS' && (
            <BoothExplorerView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenImporterModal={() => setIsImporterModalOpen(true)}
              selectedBoothId={selectedBoothId}
              setSelectedBoothId={setSelectedBoothId}
            />
          )}

          {activeTab === 'TRENDS' && (
            <TrendsAndSwingView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'SIMULATOR' && (
            <SwingSimulatorView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'DATA_SOURCES' && (
            <DataSourcesView
              constituency={constituency}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Location / Constituency Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedConstituency={constituency}
        onSelectConstituency={(selected) => {
          setActiveConstituencyId(selected.id);
          setSelectedBoothId(null);
        }}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        constituency={constituency}
      />

      {/* Form 20 CSV Importer & Geographical Placement Engine Modal */}
      <Form20ImporterModal
        isOpen={isImporterModalOpen}
        onClose={() => setIsImporterModalOpen(false)}
        constituency={constituency}
        onImportSuccess={(acNo) => {
          setDataRevision(r => r + 1);
        }}
      />
    </div>
  );
}

export default App;
