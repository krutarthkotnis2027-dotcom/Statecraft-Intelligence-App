import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Vote, 
  FileSpreadsheet, 
  Sliders, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  LogOut,
  Building,
  Clock,
  ChevronDown,
  Sparkles,
  Award,
  Globe2
} from 'lucide-react';
import { StateData, District, Constituency } from '../types/electoral';
import { UserSession } from '../types/auth';
import { STATES_DATA, PARTIES, getConstituencyById } from '../data/mockElectoralData';

const RECENT_CONSTITUENCIES_KEY = 'statecraft_recent_constituencies';
const DEFAULT_RECENT_IDS = [
  'UP_302_SHOHRATGARH',
  'UP_303_KAPILVASTU',
  'UP_304_BANSI',
  'UP_305_ITWA',
  'UP_306_DOMARIYAGANJ',
  'MH_227_KARJAT_JAMKHED',
  'MP_1_SHEOPUR'
];

interface HomePageProps {
  currentUser: UserSession;
  onSelectConstituencyAndLaunch: (constituencyId: string) => void;
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onSelectConstituencyAndLaunch,
  onLogout
}) => {
  // 3-tier cascading dropdown states - no pre-selected state, district, or constituency
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>('');

  // Recently analysed constituencies state
  const [recentConstituencyIds, setRecentConstituencyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_CONSTITUENCIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_RECENT_IDS;
  });

  const recordRecentConstituency = (id: string) => {
    try {
      const updated = [id, ...recentConstituencyIds.filter(x => x !== id)].slice(0, 6);
      setRecentConstituencyIds(updated);
      localStorage.setItem(RECENT_CONSTITUENCIES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const currentState = useMemo(() => {
    if (!selectedStateId) return null;
    return STATES_DATA.find(s => s.id === selectedStateId) || null;
  }, [selectedStateId]);

  const currentDistrict = useMemo(() => {
    if (!currentState || !selectedDistrictId) return null;
    return currentState.districts.find(d => d.id === selectedDistrictId) || null;
  }, [currentState, selectedDistrictId]);

  const availableConstituencies = useMemo(() => {
    if (!currentState) return [];
    if (selectedDistrictId === 'ALL_DISTRICTS') {
      const all: Constituency[] = [];
      for (const d of currentState.districts) {
        all.push(...d.constituencies);
      }
      return all.sort((a, b) => a.number - b.number);
    }
    if (!currentDistrict) return [];
    return [...currentDistrict.constituencies].sort((a, b) => a.number - b.number);
  }, [currentState, selectedDistrictId, currentDistrict]);

  // Flat index of all constituencies
  const allConstituenciesWithMeta = useMemo(() => {
    const list: { state: StateData; district: District; constituency: Constituency }[] = [];
    for (const state of STATES_DATA) {
      for (const district of state.districts) {
        for (const constituency of district.constituencies) {
          list.push({ state, district, constituency });
        }
      }
    }
    return list;
  }, []);

  const totalConstituenciesCount = allConstituenciesWithMeta.length;

  // Currently selected constituency object (null if not chosen)
  const activeSelectedConst = useMemo(() => {
    if (!selectedConstituencyId) return null;
    return getConstituencyById(selectedConstituencyId);
  }, [selectedConstituencyId]);

  // Recently analysed constituencies for quick one-click access
  const recentlyAnalysedConstituencies = useMemo(() => {
    return recentConstituencyIds
      .map(id => allConstituenciesWithMeta.find(item => item.constituency.id === id))
      .filter(Boolean) as { state: StateData; district: District; constituency: Constituency }[];
  }, [recentConstituencyIds, allConstituenciesWithMeta]);

  // Cascading dropdown change handlers - without pre-selecting downstream children
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedDistrictId('');
    setSelectedConstituencyId('');
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setSelectedConstituencyId('');
  };

  const handleConstituencyChange = (constituencyId: string) => {
    setSelectedConstituencyId(constituencyId);
  };

  const handleLaunch = () => {
    if (activeSelectedConst) {
      recordRecentConstituency(activeSelectedConst.id);
      onSelectConstituencyAndLaunch(activeSelectedConst.id);
    }
  };

  const getParty = (partyId?: string) => {
    if (!partyId) return null;
    return PARTIES[partyId] || { name: partyId, shortName: partyId, color: '#64748b', bgLight: '#f8fafc' };
  };

  const latestElection = activeSelectedConst?.elections[activeSelectedConst?.currentYear || 2024];

  const displayName = (!currentUser.name || currentUser.name === 'Rajeshwar Kulkarni (IAS)') 
    ? 'Organisational user' 
    : currentUser.name;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Application Header */}
      <header className="bg-slate-950/90 border-b border-slate-800 h-16 w-full px-4 lg:px-8 z-30 flex items-center justify-between sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">Statecraft Intelligence</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950 text-blue-300 border border-blue-800 hidden sm:inline">
                {totalConstituenciesCount} ACs Across {STATES_DATA.length} States
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden md:block">
              Electoral Data & Demographic Intelligence System
            </p>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              {currentUser.organizationId.substring(0, 2)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-amber-400/90 font-mono">
                {currentUser.organizationId} &bull; {currentUser.roleTitle}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Sign out of current organizational session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Home Hub Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Welcome & Directive Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authenticated Organizational Access
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Constituency Intelligence Hub
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Select your target state, administrative district, and assembly constituency using the cascading dropdowns below to instantly launch verified Form 20 booth metrics, caste matrices, and live swing simulations.
            </p>
          </div>
        </div>

        {/* PRIMARY 3-TIER DROPDOWN SELECTOR CARD */}
        <section className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Select Assembly Constituency via Dropdown</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-semibold">
                    Zero Typing Required
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick your State &rarr; District &rarr; Assembly Constituency from the lists below.
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
              Total Database: <strong className="text-amber-400 font-bold">{totalConstituenciesCount} ACs Across MH & MP</strong>
            </div>
          </div>

          {/* 3 Cascading Dropdown Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            
            {/* 1. STATE DROPDOWN */}
            <div className="space-y-2">
              <label htmlFor="state-select" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                  1. Select State
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {STATES_DATA.length} States
                </span>
              </label>

              <div className="relative">
                <select
                  id="state-select"
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner pr-10"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    -- Select State --
                  </option>
                  {STATES_DATA.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-900 text-white py-1">
                      {st.name} ({st.code}) &mdash; {st.districts.reduce((acc, d) => acc + d.constituencies.length, 0)} ACs
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400">
                {currentState ? (
                  <>Selected: <strong className="text-slate-200">{currentState.name}</strong></>
                ) : (
                  <span className="text-slate-500">Please choose a state to proceed</span>
                )}
              </p>
            </div>

            {/* 2. DISTRICT DROPDOWN */}
            <div className="space-y-2">
              <label htmlFor="district-select" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  2. Select District
                </span>
                <span className="text-[10px] text-amber-400/80 font-semibold font-mono">
                  {currentState ? `${currentState.districts.length} Districts` : '0 Districts'}
                </span>
              </label>

              <div className="relative">
                <select
                  id="district-select"
                  value={selectedDistrictId}
                  disabled={!selectedStateId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={`w-full bg-slate-900 border ${
                    !selectedStateId 
                      ? 'border-slate-800 text-slate-500 cursor-not-allowed opacity-60' 
                      : 'border-slate-700 hover:border-slate-600 focus:border-amber-500 text-white cursor-pointer'
                  } rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner pr-10`}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    {selectedStateId ? '-- Select District --' : '-- Select State First --'}
                  </option>
                  {currentState && (
                    <option value="ALL_DISTRICTS" className="bg-slate-900 text-amber-300 font-bold py-1">
                      -- All Districts (Show All {currentState.districts.reduce((acc, d) => acc + d.constituencies.length, 0)} ACs in Numerical Order) --
                    </option>
                  )}
                  {currentState?.districts.map((dist) => (
                    <option key={dist.id} value={dist.id} className="bg-slate-900 text-white py-1">
                      {dist.name} ({dist.constituencies.length} ACs)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedDistrictId === 'ALL_DISTRICTS' ? (
                  <>Showing: <strong className="text-amber-400">All {availableConstituencies.length} Assembly Constituencies</strong> in ECI Numerical Order (1 to {availableConstituencies.length})</>
                ) : currentDistrict ? (
                  <>Selected: <strong className="text-slate-200">{currentDistrict.name} District</strong> ({availableConstituencies.length} ACs)</>
                ) : (
                  <span className="text-slate-500">{selectedStateId ? 'Please select a district or "All Districts"' : 'Awaiting state selection'}</span>
                )}
              </p>
            </div>

            {/* 3. ASSEMBLY CONSTITUENCY DROPDOWN */}
            <div className="space-y-2">
              <label htmlFor="ac-select" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-emerald-400" />
                  3. Select Assembly Constituency
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  {availableConstituencies.length > 0 ? `${availableConstituencies.length} ACs (ECI Order)` : '0 ACs'}
                </span>
              </label>

              <div className="relative">
                <select
                  id="ac-select"
                  value={selectedConstituencyId}
                  disabled={!selectedDistrictId}
                  onChange={(e) => handleConstituencyChange(e.target.value)}
                  className={`w-full bg-slate-900 border-2 ${
                    !selectedDistrictId
                      ? 'border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : 'border-amber-500 hover:border-amber-400 focus:border-amber-400 text-amber-300 cursor-pointer'
                  } rounded-xl px-4 py-3 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-inner pr-10 font-mono`}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    {selectedDistrictId ? '-- Select Assembly Constituency --' : '-- Select District First --'}
                  </option>
                  {availableConstituencies.map((ac) => (
                    <option key={ac.id} value={ac.id} className="bg-slate-900 text-white py-1">
                      {ac.number} - {ac.name}{ac.reservationCategory !== 'GEN' ? ` (${ac.reservationCategory})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400">
                {activeSelectedConst ? (
                  <>Selected: <strong className="text-amber-400">AC #{activeSelectedConst.number} - {activeSelectedConst.name}</strong></>
                ) : (
                  <span className="text-slate-500">{selectedDistrictId ? 'Please select a constituency' : 'Awaiting district selection'}</span>
                )}
              </p>
            </div>
          </div>

          {/* LIVE CONSTITUENCY DOSSIER PREVIEW & LAUNCH CTA */}
          {activeSelectedConst ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Summary Title & Meta */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-extrabold text-sm border border-amber-500/30">
                      AC #{activeSelectedConst.number}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {activeSelectedConst.reservationCategory === 'GEN' ? 'General Category' : `${activeSelectedConst.reservationCategory} Reserved`}
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentDistrict?.name} District, {currentState?.name}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>{activeSelectedConst.number} - {activeSelectedConst.name}</span>
                    {activeSelectedConst.booths.length > 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold rounded-full">
                        Form 20 Audited ({activeSelectedConst.booths.length} Booths)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold rounded-full">
                        Form 20: Data not available
                      </span>
                    )}
                  </h4>
                </div>

                {/* Right: Big Launch Dashboard Button */}
                <button
                  onClick={handleLaunch}
                  className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:from-amber-500 text-slate-950 font-extrabold rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer shrink-0 group border border-amber-400/40"
                >
                  <span>Launch AC #{activeSelectedConst.number} Workspace</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Key Quick Stats Bar for Selected AC */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">Registered Electors</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {latestElection?.totalElectors?.toLocaleString('en-IN') || '3,18,450'}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">Form 20 Polling Stations</div>
                  <div className={`text-sm font-bold ${activeSelectedConst.booths.length > 0 ? 'text-blue-400' : 'text-slate-400'} mt-0.5`}>
                    {activeSelectedConst.booths.length > 0 ? `${activeSelectedConst.booths.length} Booths Mapped` : 'Data not available'}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">{activeSelectedConst.currentYear} Voter Turnout</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {latestElection?.turnoutPercentage || 76.2}%
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">Demographic Profiling</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {activeSelectedConst.demographics.length} Blocs Stratified
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-2">
              <div className="inline-flex p-3 rounded-xl bg-slate-800/80 text-amber-400 mb-1">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">No Constituency Selected</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select your State, District, and Assembly Constituency using the cascading menus above to inspect verified metrics and enter the analysis workspace.
              </p>
            </div>
          )}
        </section>

        {/* Recently Analysed Constituencies (Quick 1-Click Cards) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Recently Analysed Constituencies
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Quick 1-Click Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyAnalysedConstituencies.map(({ state, district, constituency }) => {
              const latest = constituency.elections[constituency.currentYear];
              const winner = latest?.candidates?.[0];
              const party = getParty(latest?.winningPartyId);
              const isSelected = constituency.id === activeSelectedConst?.id;

              return (
                <div
                  key={constituency.id}
                  onClick={() => {
                    recordRecentConstituency(constituency.id);
                    setSelectedStateId(state.id);
                    setSelectedDistrictId(district.id);
                    setSelectedConstituencyId(constituency.id);
                    onSelectConstituencyAndLaunch(constituency.id);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs font-bold border border-slate-700">
                        AC #{constituency.number}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {district.name}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {constituency.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {constituency.reservationCategory === 'GEN' ? 'General' : `${constituency.reservationCategory} Reserved`} &bull; {constituency.totalBooths} Polling Stations
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* System Capabilities & Standards Footer Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">ECI Form 20 Audit Level</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every polling station elector registry and vote lead mapped with verified statutory integrity.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Chanakya PR Caste Census</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scientific demographic stratification modeling Maratha, OBC, SC, Dhangar, and minority voting blocs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Live Swing Simulation</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulate voter turnout shifts, alliance transfers, and dynamic booth margin projections in real time.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Statecraft Intelligence Platform &bull; Organization ID: <span className="text-amber-400">{currentUser.organizationId}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>UP 403 ACs &bull; MH 288 ACs &bull; {totalConstituenciesCount} ACs Mapped</span>
          <span>&bull;</span>
          <span>ECI Form 20 Audited</span>
        </div>
      </footer>
    </div>
  );
};
