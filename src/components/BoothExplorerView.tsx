import React, { useState, useMemo } from 'react';
import { Constituency, Booth, BoothFilterState } from '../types/electoral';
import { PARTIES } from '../data/mockElectoralData';
import { ConstituencySpatialMap } from './ConstituencySpatialMap';
import { BoothAnalysisWindow } from './BoothAnalysisWindow';
import { 
  Search, 
  Filter, 
  MapPin, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  Columns, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  BarChart2, 
  Info, 
  CheckCircle2, 
  SlidersHorizontal,
  Compass,
  Map as MapIcon,
  Table as TableIcon,
  FileQuestion,
  FileSpreadsheet
} from 'lucide-react';

interface BoothExplorerViewProps {
  constituency: Constituency;
  onOpenExportModal: () => void;
  onOpenImporterModal?: () => void;
  selectedBoothId: string | null;
  setSelectedBoothId: (id: string | null) => void;
}

export const BoothExplorerView: React.FC<BoothExplorerViewProps> = ({
  constituency,
  onOpenExportModal,
  onOpenImporterModal,
  selectedBoothId,
  setSelectedBoothId
}) => {
  // View mode state
  const [viewMode, setViewMode] = useState<'TABLE' | 'MAP' | 'SPLIT'>('TABLE');

  // Filter state
  const [filters, setFilters] = useState<BoothFilterState>({
    searchQuery: '',
    turnoutRange: 'ALL',
    winningPartyId: 'ALL',
    marginRange: 'ALL',
    boothType: 'ALL',
    dominantCommunity: 'ALL',
    sortBy: 'NUMBER',
    sortOrder: 'ASC'
  });

  // Booth comparison list
  const [comparedBoothIds, setComparedBoothIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Dominant community list
  const communities = Array.from(new Set(constituency.booths.map(b => b.dominantCommunity)));

  // Filtered & sorted booths
  const filteredBooths = useMemo(() => {
    return constituency.booths.filter((booth) => {
      // Search
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchName = booth.name.toLowerCase().includes(q);
        const matchLoc = booth.locationName.toLowerCase().includes(q);
        const matchId = booth.id.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchId) return false;
      }

      // Turnout Range
      if (filters.turnoutRange === 'UNDER_50' && booth.turnoutPercentage >= 50) return false;
      if (filters.turnoutRange === '50_TO_65' && (booth.turnoutPercentage < 50 || booth.turnoutPercentage > 65)) return false;
      if (filters.turnoutRange === '65_TO_80' && (booth.turnoutPercentage < 65 || booth.turnoutPercentage > 80)) return false;
      if (filters.turnoutRange === 'OVER_80' && booth.turnoutPercentage <= 80) return false;

      // Winning Party
      if (filters.winningPartyId !== 'ALL' && booth.winningPartyId !== filters.winningPartyId) return false;

      // Margin Range
      if (filters.marginRange === 'UNDER_5' && booth.winningMarginPercentage >= 5) return false;
      if (filters.marginRange === '5_TO_10' && (booth.winningMarginPercentage < 5 || booth.winningMarginPercentage > 10)) return false;
      if (filters.marginRange === 'OVER_10' && booth.winningMarginPercentage <= 10) return false;

      // Booth Type
      if (filters.boothType !== 'ALL' && booth.boothType !== filters.boothType) return false;

      // Community
      if (filters.dominantCommunity !== 'ALL' && booth.dominantCommunity !== filters.dominantCommunity) return false;

      return true;
    }).sort((a, b) => {
      let multiplier = filters.sortOrder === 'ASC' ? 1 : -1;
      if (filters.sortBy === 'NUMBER') return (a.number - b.number) * multiplier;
      if (filters.sortBy === 'ELECTORS') return (a.registeredElectors - b.registeredElectors) * multiplier;
      if (filters.sortBy === 'TURNOUT') return (a.turnoutPercentage - b.turnoutPercentage) * multiplier;
      if (filters.sortBy === 'MARGIN') return (a.winningMargin - b.winningMargin) * multiplier;
      return 0;
    });
  }, [constituency.booths, filters]);

  // Paginated list
  const totalPages = Math.ceil(filteredBooths.length / pageSize) || 1;
  const paginatedBooths = filteredBooths.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Active Selected Booth Object
  const activeBooth = constituency.booths.find(b => b.id === selectedBoothId) || paginatedBooths[0] || constituency.booths[0];

  // Comparison toggle
  const toggleCompareBooth = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (comparedBoothIds.includes(id)) {
      setComparedBoothIds(comparedBoothIds.filter(item => item !== id));
    } else {
      if (comparedBoothIds.length >= 3) {
        return;
      }
      setComparedBoothIds([...comparedBoothIds, id]);
    }
  };

  const handleSort = (field: 'NUMBER' | 'ELECTORS' | 'TURNOUT' | 'MARGIN') => {
    if (filters.sortBy === field) {
      setFilters({ ...filters, sortOrder: filters.sortOrder === 'ASC' ? 'DESC' : 'ASC' });
    } else {
      setFilters({ ...filters, sortBy: field, sortOrder: 'DESC' });
    }
  };

  if (constituency.booths.length === 0) {
    const latestElection = constituency.elections[constituency.currentYear] || Object.values(constituency.elections)[0];

    return (
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              Analysis &gt; Form 20 Electoral Data
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Form 20 Booth Explorer
              </h1>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-mono font-bold rounded-full">
                Data not available
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {constituency.name} (AC #{constituency.number}) &bull; {constituency.districtName} District, {constituency.stateName}
            </p>
          </div>
        </div>

        {/* Dedicated "Data not available" Notice Panel */}
        <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Form 20 Station Data: Data not available
                </h3>
                <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-[11px] font-mono font-bold rounded">
                  Awaiting Official Ingestion
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Official station-level Form 20 voting records, booth coordinates, and booth-wise tallies for <strong>{constituency.name} (AC #{constituency.number})</strong> are not available yet. Simulated or placeholder booth records are not shown to prevent any inaccuracies.
              </p>
              <div className="pt-2 text-xs text-slate-600 bg-white/90 p-3.5 rounded-lg border border-amber-200/80 font-mono space-y-2">
                <div className="font-bold text-slate-800">Ready for dataset ingestion:</div>
                <p>
                  When you have the official Form 20 table or CSV dataset for this assembly constituency, you can import and automatically geocode all polling booths using the spatial placement engine.
                </p>
                {onOpenImporterModal && (
                  <div className="pt-1">
                    <button
                      onClick={onOpenImporterModal}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-extrabold rounded-lg text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-500/40"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>Import Form 20 CSV for AC #{constituency.number} - {constituency.name}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Constituency Verified Aggregate Results (Always Accurate & Real) */}
        {latestElection && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
                  {latestElection.year} Vidhan Sabha Verified Aggregate Results
                </h3>
                <p className="text-xs text-slate-500">Official Election Commission of India Constituency Summary</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded">
                ECI Certified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Total Electors</span>
                <span className="text-base font-extrabold text-slate-900 mt-1 block">
                  {latestElection.totalElectors.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Votes Polled</span>
                <span className="text-base font-extrabold text-slate-900 mt-1 block">
                  {latestElection.totalPolled.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Voter Turnout</span>
                <span className="text-base font-extrabold text-emerald-700 mt-1 block">
                  {latestElection.turnoutPercentage}%
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Winning Margin</span>
                <span className="text-base font-extrabold text-blue-700 mt-1 block">
                  {latestElection.winningMargin.toLocaleString('en-IN')} ({latestElection.winningMarginPercentage}%)
                </span>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Party</th>
                    <th className="py-2.5 px-3 text-right">Votes</th>
                    <th className="py-2.5 px-3 text-right">Vote Share</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {latestElection.candidates.map((c) => {
                    const party = PARTIES[c.partyId] || { name: c.partyId, shortName: c.partyId, color: '#64748b' };
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          {c.photoUrl && (
                            <img src={c.photoUrl} alt={c.name} className="w-6 h-6 rounded-full object-cover border" />
                          )}
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span 
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-white"
                            style={{ backgroundColor: party.color }}
                          >
                            {party.shortName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {c.votes.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                          {c.voteSharePercentage}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {c.status === 'WON' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              WON (MLA)
                            </span>
                          ) : c.status === 'RUNNER_UP' ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                              RUNNER UP
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">OTHER</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Analysis &gt; Form 20 Electoral Data
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Form 20 Booth Explorer
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Polling booth level electors, votes polled, candidate leads, and margins ({constituency.booths.length} Booths Total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedBoothIds.length > 0 && (
            <button
              onClick={() => setIsComparisonModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-2xs transition-colors cursor-pointer animate-pulse"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare {comparedBoothIds.length} Selected Booths</span>
            </button>
          )}

          {onOpenImporterModal && (
            <button
              onClick={onOpenImporterModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import / Update CSV</span>
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Form 20 CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters({ ...filters, searchQuery: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="Search booth name, school, location, or ID (e.g. 042)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
            />
          </div>

          {/* View Mode Toggle (Table / Spatial Map / Split) */}
          <div className="inline-flex rounded-lg border border-slate-300 p-1 bg-slate-100 text-xs font-mono font-bold">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'MAP'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Spatial Map</span>
            </button>
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer hidden md:flex ${
                viewMode === 'SPLIT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Map &amp; Table</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1 border-t border-slate-100">
          {/* Turnout Range Filter */}
          <select
            value={filters.turnoutRange}
            onChange={(e) => {
              setFilters({ ...filters, turnoutRange: e.target.value as any });
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">Turnout: All Ranges</option>
            <option value="UNDER_50">Turnout &lt; 50%</option>
            <option value="50_TO_65">Turnout 50% - 65%</option>
            <option value="65_TO_80">Turnout 65% - 80%</option>
            <option value="OVER_80">Turnout &gt; 80%</option>
          </select>

          {/* Winning Party Filter */}
          <select
            value={filters.winningPartyId}
            onChange={(e) => {
              setFilters({ ...filters, winningPartyId: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">Winning Party: All</option>
            {Object.values(PARTIES).map((party) => (
              <option key={party.id} value={party.id}>
                Lead: {party.shortName}
              </option>
            ))}
          </select>

          {/* Margin Filter */}
          <select
            value={filters.marginRange}
            onChange={(e) => {
              setFilters({ ...filters, marginRange: e.target.value as any });
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">Margin: All</option>
            <option value="UNDER_5">Margin &lt; 5% (Close Contest)</option>
            <option value="5_TO_10">Margin 5% - 10%</option>
            <option value="OVER_10">Margin &gt; 10% (Stronghold)</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setFilters({
                searchQuery: '',
                turnoutRange: 'ALL',
                winningPartyId: 'ALL',
                marginRange: 'ALL',
                boothType: 'ALL',
                dominantCommunity: 'ALL',
                sortBy: 'NUMBER',
                sortOrder: 'ASC'
              });
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-bold text-[11px] transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Filter Summary Status */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200">
          <span>Showing {filteredBooths.length} of {constituency.booths.length} Form 20 Polling Stations</span>
          {comparedBoothIds.length > 0 && (
            <span className="text-blue-700 font-bold">
              {comparedBoothIds.length} booths selected for comparison
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area based on viewMode */}
      {viewMode === 'MAP' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 w-full">
            <ConstituencySpatialMap
              constituency={constituency}
              selectedBoothId={selectedBoothId}
              onSelectBooth={(id) => setSelectedBoothId(id)}
              mode="EXPANDED"
              initialLayer="STRONGHOLD"
              showControls={true}
            />
          </div>

          {/* Right side detail panel for selected booth (Color-coded window box) */}
          <div className="lg:col-span-4 sticky top-20">
            {activeBooth ? (
              <BoothAnalysisWindow
                booth={activeBooth}
                constituency={constituency}
                onClose={() => setSelectedBoothId(null)}
                onCompareToggle={toggleCompareBooth}
                isCompared={comparedBoothIds.includes(activeBooth.id)}
              />
            ) : (
              <div className="bg-slate-900 text-slate-300 rounded-xl border border-slate-800 p-6 text-center space-y-3 shadow-xl">
                <Compass className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Select a Polling Station</h4>
                <p className="text-xs text-slate-400">
                  Click on any station marker on the spatial map to launch the color-coded Form 20 booth analysis window.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* When in SPLIT Mode: Map on top, Table below */}
      {viewMode === 'SPLIT' && (
        <div className="w-full mb-6">
          <ConstituencySpatialMap
            constituency={constituency}
            selectedBoothId={selectedBoothId}
            onSelectBooth={(id) => setSelectedBoothId(id)}
            mode="COMPACT"
            initialLayer="STRONGHOLD"
            showControls={true}
          />
        </div>
      )}

      {/* Main Split Layout for TABLE & SPLIT modes */}
      {(viewMode === 'TABLE' || viewMode === 'SPLIT') && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form 20 High-Density Table Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">Compare</th>
                  <th
                    onClick={() => handleSort('NUMBER')}
                    className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Booth ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3 min-w-[200px]">Name / Location</th>
                  <th
                    onClick={() => handleSort('ELECTORS')}
                    className="p-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Electors</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('TURNOUT')}
                    className="p-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Turnout %</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3">Winning Party</th>
                  <th
                    onClick={() => handleSort('MARGIN')}
                    className="p-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Margin</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 font-mono text-xs text-slate-800">
                {paginatedBooths.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">
                      No Form 20 polling booths match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedBooths.map((booth) => {
                    const isSelected = activeBooth?.id === booth.id;
                    const isCompared = comparedBoothIds.includes(booth.id);
                    const party = PARTIES[booth.winningPartyId] || PARTIES['IND_OTH'];

                    return (
                      <tr
                        key={booth.id}
                        onClick={() => setSelectedBoothId(booth.id)}
                        className={`hover:bg-slate-100/80 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/80 font-semibold text-slate-900 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        {/* Checkbox for comparison */}
                        <td
                          className="p-3 text-center"
                          onClick={(e) => toggleCompareBooth(booth.id, e)}
                        >
                          <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
                            {isCompared ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Booth ID */}
                        <td className="p-3 font-bold text-slate-900">
                          #{booth.id}
                        </td>

                        {/* Name & Ward */}
                        <td className="p-3 font-sans">
                          <div className="font-bold text-slate-900 truncate max-w-[220px]">
                            {booth.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                            {booth.locationName}
                          </div>
                        </td>

                        {/* Registered Electors */}
                        <td className="p-3 text-right">
                          {booth.registeredElectors.toLocaleString('en-IN')}
                        </td>

                        {/* Turnout % */}
                        <td className="p-3 text-right font-bold">
                          <span className={booth.turnoutPercentage > 75 ? 'text-emerald-700' : 'text-slate-800'}>
                            {booth.turnoutPercentage}%
                          </span>
                        </td>

                        {/* Winning Party */}
                        <td className="p-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-xs shrink-0"
                              style={{ backgroundColor: party.color }}
                            ></span>
                            <span className="font-bold text-xs text-slate-900">{party.shortName}</span>
                          </div>
                        </td>

                        {/* Winning Margin */}
                        <td className="p-3 text-right font-bold font-mono">
                          <span className={booth.winningMarginPercentage < 5 ? 'text-rose-700' : 'text-emerald-700'}>
                            +{booth.winningMargin}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-mono text-xs text-slate-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Form 20 Active Booth Side Panel (Window Box Color-Coded to Leading Candidate/Party) */}
        <div className="lg:col-span-4 sticky top-20">
          {activeBooth ? (
            <BoothAnalysisWindow
              booth={activeBooth}
              constituency={constituency}
              onClose={() => setSelectedBoothId(null)}
              onCompareToggle={toggleCompareBooth}
              isCompared={comparedBoothIds.includes(activeBooth.id)}
            />
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center mx-auto text-slate-500">
                <TableIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Polling Station Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click on any table row or map station marker to launch the window-style Form 20 booth analysis box with color coding for the leading candidate.
              </p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Booth Comparison Modal */}
      {isComparisonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Side-by-Side Form 20 Booth Comparison Matrix
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Comparing {comparedBoothIds.length} selected polling stations
                </p>
              </div>
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-3 text-slate-500 uppercase">Parameter</th>
                    {comparedBoothIds.map((id) => {
                      const b = constituency.booths.find(item => item.id === id);
                      return (
                        <th key={id} className="p-3 text-slate-900 font-bold text-sm bg-blue-50/50">
                          Booth #{id}
                          <div className="text-[10px] font-normal text-slate-500 truncate max-w-[180px]">{b?.name}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-slate-600">Registered Electors</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      return <td key={id} className="p-3 font-bold">{b?.registeredElectors.toLocaleString('en-IN')}</td>;
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-600">Total Polled Votes</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      return <td key={id} className="p-3 font-bold">{b?.totalVotesPolled.toLocaleString('en-IN')}</td>;
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-600">Turnout %</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      return <td key={id} className="p-3 font-bold text-emerald-700">{b?.turnoutPercentage}%</td>;
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-600">Winning Party</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      const party = PARTIES[b?.winningPartyId || 'IND_OTH'];
                      return (
                        <td key={id} className="p-3 font-bold" style={{ color: party?.color }}>
                          {party?.name}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-600">Winning Margin</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      return <td key={id} className="p-3 font-bold text-blue-700">+{b?.winningMargin} votes ({b?.winningMarginPercentage}%)</td>;
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-600">Dominant Community</td>
                    {comparedBoothIds.map(id => {
                      const b = constituency.booths.find(item => item.id === id);
                      return <td key={id} className="p-3 font-sans text-slate-700">{b?.dominantCommunity}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
