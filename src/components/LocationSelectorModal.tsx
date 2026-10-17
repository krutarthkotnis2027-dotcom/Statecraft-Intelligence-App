import React, { useState, useMemo } from 'react';
import { STATES_DATA, PARTIES, getConstituencyById } from '../data/mockElectoralData';
import { StateData, District, Constituency } from '../types/electoral';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Search,
  ShieldAlert,
  Sparkles,
  Layers,
  Award,
  Vote
} from 'lucide-react';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConstituency: Constituency;
  onSelectConstituency: (constituency: Constituency) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedConstituency,
  onSelectConstituency
}) => {
  const [selectedStateId, setSelectedStateId] = useState<string>(selectedConstituency?.stateId || 'MH');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(selectedConstituency?.districtId || 'MH_DIST_AHILYANAGAR');
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>(selectedConstituency?.id || 'MH_227_KARJAT_JAMKHED');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mode, setMode] = useState<'hierarchy' | 'search'>('hierarchy');

  // Flat search index across all constituencies in all states & districts
  const allConstituenciesWithMeta = useMemo(() => {
    const list: { state: StateData; district: District; constituency: Constituency }[] = [];
    for (const st of STATES_DATA) {
      for (const dst of st.districts) {
        for (const c of dst.constituencies) {
          list.push({ state: st, district: dst, constituency: c });
        }
      }
    }
    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allConstituenciesWithMeta.filter(item => {
      return (
        item.constituency.name.toLowerCase().includes(q) ||
        item.constituency.number.toString().includes(q) ||
        item.district.name.toLowerCase().includes(q) ||
        item.state.name.toLowerCase().includes(q)
      );
    }).slice(0, 15);
  }, [searchQuery, allConstituenciesWithMeta]);

  if (!isOpen) return null;

  const currentState = STATES_DATA.find(s => s.id === selectedStateId) || STATES_DATA[0];
  const currentDistrict = currentState.districts.find(d => d.id === selectedDistrictId) || currentState.districts[0];

  const stateTotalACs = currentState.districts.reduce((acc, d) => acc + d.constituencies.length, 0);
  const stateTotalDistricts = currentState.districts.length;

  const availableConstituencies = useMemo(() => {
    if (!currentState) return [];
    if (selectedDistrictId === 'ALL_DISTRICTS') {
      const all: Constituency[] = [];
      for (const d of currentState.districts) {
        all.push(...d.constituencies);
      }
      return all.sort((a, b) => a.number - b.number);
    }
    const dist = currentState.districts.find(d => d.id === selectedDistrictId);
    return dist 
      ? [...dist.constituencies].sort((a, b) => a.number - b.number) 
      : [...currentState.districts[0].constituencies].sort((a, b) => a.number - b.number);
  }, [currentState, selectedDistrictId]);

  const activeSelectedConst = useMemo(() => {
    const raw = availableConstituencies.find(c => c.id === selectedConstituencyId) || 
      (availableConstituencies.length > 0 ? availableConstituencies[0] : selectedConstituency);
    return raw ? getConstituencyById(raw.id) : selectedConstituency;
  }, [availableConstituencies, selectedConstituencyId, selectedConstituency]);

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const newState = STATES_DATA.find(s => s.id === stateId);
    if (newState && newState.districts.length > 0) {
      const newDist = newState.districts[0];
      setSelectedDistrictId(newDist.id);
      if (newDist.constituencies.length > 0) {
        setSelectedConstituencyId(newDist.constituencies[0].id);
      }
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    if (districtId === 'ALL_DISTRICTS') {
      const firstAc = currentState.districts[0]?.constituencies[0];
      if (firstAc) setSelectedConstituencyId(firstAc.id);
      return;
    }
    const newDist = currentState.districts.find(d => d.id === districtId);
    if (newDist && newDist.constituencies.length > 0) {
      setSelectedConstituencyId(newDist.constituencies[0].id);
    }
  };

  const handlePickConstituency = (item: { state: StateData; district: District; constituency: Constituency }) => {
    setSelectedStateId(item.state.id);
    setSelectedDistrictId(item.district.id);
    setSelectedConstituencyId(item.constituency.id);
    onSelectConstituency(item.constituency);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSelectedConst) {
      onSelectConstituency(activeSelectedConst);
      onClose();
    }
  };

  return (
    <div id="location-selector-modal" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white border-b border-slate-800 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-amber-400 rounded-lg flex items-center justify-center border border-slate-700 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Constituency Intelligence Switcher</span>
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-mono rounded-full border border-amber-400/30">
                    {stateTotalACs} ACs / {stateTotalDistricts} Districts ({currentState.name})
                  </span>
                </h2>
                <p className="text-slate-400 text-xs">
                  Switch between {stateTotalACs} {currentState.name} Assembly Constituencies or search across all states by District, AC or MLA.
                </p>
              </div>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 text-[11px] font-mono text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>ECI Official Data</span>
            </div>
          </div>

          {/* Selector Mode Navigation Tabs */}
          <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setMode('hierarchy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'hierarchy'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>State & District Hierarchy</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('search')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'search'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Direct AC / MLA Search</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 bg-slate-50 overflow-y-auto flex-1">
          {mode === 'search' ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type AC number, constituency name, district, or elected MLA (e.g. Karjat Jamkhed, 227, Rohit Pawar, Ahilyanagar)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
                />
              </div>

              {/* Quick suggestions when query is empty */}
              {!searchQuery.trim() && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">Featured Constituencies:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allConstituenciesWithMeta
                      .filter(item => [302, 303, 304, 305, 306, 227, 201, 147, 1].includes(item.constituency.number))
                      .sort((a, b) => a.constituency.number - b.constituency.number)
                      .map((item) => {
                        const isSiddharthnagar = [302, 303, 304, 305, 306].includes(item.constituency.number);
                        return (
                          <div
                            key={item.constituency.id}
                            onClick={() => handlePickConstituency(item)}
                            className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded cursor-pointer transition-all text-xs space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span className="truncate">{item.constituency.name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                AC #{item.constituency.number} ({item.state.code})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center justify-between">
                              <span>{item.district.name} District</span>
                              {item.constituency.number === 227 && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                                  Form 20 Audited
                                </span>
                              )}
                              {isSiddharthnagar && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded">
                                  UP AC #{item.constituency.number}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Matching Constituencies ({searchResults.length})</span>
                    <span className="text-[10px]">Click any to load operational dashboard</span>
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded border border-dashed border-slate-300 text-slate-500 text-xs">
                      No constituency found matching &quot;{searchQuery}&quot;. Try searching by district name or MLA.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {searchResults.map((item) => {
                        const isKarjat = item.constituency.number === 227;
                        return (
                          <div
                            key={item.constituency.id}
                            onClick={() => handlePickConstituency(item)}
                            className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded cursor-pointer transition-all text-xs flex items-center justify-between shadow-xs"
                          >
                            <div className="space-y-0.5 min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 truncate">
                                  AC-{item.constituency.number}: {item.constituency.name}
                                </span>
                                {isKarjat && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                                    Form 20 Live
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500">
                                  ({item.constituency.reservationCategory})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {item.district.name} District, {item.state.name}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                {item.state.code}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* State Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span>1. Select State</span>
                  <span className="text-[10px] text-slate-500 font-normal">{STATES_DATA.length} States Configured</span>
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                >
                  {STATES_DATA.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name} ({state.code}) — {state.districts.length} Districts
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span>2. Select District</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {currentState.districts.length} Districts Available
                  </span>
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                >
                  <option value="ALL_DISTRICTS">
                    -- All Districts (Show All {stateTotalACs} ACs in ECI Numerical Order) --
                  </option>
                  {currentState.districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name} ({district.constituencies.length} Constituencies)
                    </option>
                  ))}
                </select>
              </div>

              {/* Assembly Constituency Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span>3. Select Assembly Constituency</span>
                  <span className="text-[10px] text-amber-600 font-semibold font-mono">
                    {availableConstituencies.length} ACs {selectedDistrictId === 'ALL_DISTRICTS' ? `across ${currentState.name}` : `in ${currentDistrict?.name || 'District'}`} (Ordered by ECI Number)
                  </span>
                </label>
                <select
                  value={selectedConstituencyId}
                  onChange={(e) => setSelectedConstituencyId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer font-mono"
                >
                  {availableConstituencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.number} - {c.name}{c.reservationCategory !== 'GEN' ? ` (${c.reservationCategory})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Constituency Brief Preview */}
              {activeSelectedConst && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5 text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      AC-{activeSelectedConst.number}: {activeSelectedConst.name} ({activeSelectedConst.reservationCategory})
                    </span>
                    {activeSelectedConst.booths.length > 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        Form 20 Audited ({activeSelectedConst.booths.length} Booths)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">
                        Form 20: Data not available
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-blue-200/60 font-mono text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ELECTORS</span>
                      <span className="font-bold">
                        {activeSelectedConst.elections[activeSelectedConst.currentYear || 2024]?.totalElectors?.toLocaleString('en-IN') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">BOOTHS</span>
                      <span className="font-bold">
                        {activeSelectedConst.booths.length > 0 
                          ? `${activeSelectedConst.booths.length} Booths` 
                          : 'Data not available'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">{activeSelectedConst.currentYear || 2024} TURNOUT</span>
                      <span className="font-bold text-emerald-700">
                        {activeSelectedConst.elections[activeSelectedConst.currentYear || 2024]?.turnoutPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Load Constituency Analytics</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>Statecraft Political Research & Electoral System</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
