import React, { useState } from 'react';
import { Constituency } from '../types/electoral';
import { PARTIES } from '../data/mockElectoralData';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Download,
  Info
} from 'lucide-react';

interface SwingSimulatorViewProps {
  constituency: Constituency;
  onOpenExportModal: () => void;
}

export const SwingSimulatorView: React.FC<SwingSimulatorViewProps> = ({
  constituency,
  onOpenExportModal
}) => {
  const currentElection = constituency.elections[constituency.currentYear] 
    || constituency.elections[2024] 
    || Object.values(constituency.elections)[0]
    || {
      year: constituency.currentYear || 2024,
      winningPartyId: 'IND_OTH',
      winningMargin: 0,
      winningMarginPercentage: 0,
      turnoutPercentage: 70,
      totalElectors: 250000,
      totalPolled: 175000,
      candidates: [],
      partyBreakdown: []
    };

  const electionYear = currentElection.year || constituency.currentYear || 2024;

  // Initialize swing state for parties present in this constituency
  const [swings, setSwings] = useState<{ [partyId: string]: number }>({});

  const handleSwingChange = (partyId: string, val: number) => {
    setSwings(prev => ({ ...prev, [partyId]: val }));
  };

  const resetSwings = () => {
    setSwings({});
  };

  const candidatesList = currentElection.candidates || [];

  // Calculate projected booth flips
  const projectedBooths = constituency.booths.map((booth) => {
    const originalVotes = { ...booth.candidateVotes };
    const projectedVotes: { [candId: string]: number } = {};

    Object.entries(originalVotes).forEach(([candId, votes]) => {
      // Find candidate party
      const cand = candidatesList.find(c => c.name === candId || c.id === candId);
      const partyId = cand?.partyId || 'IND_OTH';
      const swingPct = swings[partyId] || 0;

      // Adjust votes by swing multiplier
      const multiplier = 1 + (swingPct / 100);
      projectedVotes[candId] = Math.round(Number(votes) * multiplier);
    });

    // Find new winner in this booth
    let newWinnerId = booth.winningCandidateId;
    let maxVotes = -1;
    let newWinningPartyId = booth.winningPartyId;

    Object.entries(projectedVotes).forEach(([candId, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        newWinnerId = candId;
        const cand = candidatesList.find(c => c.name === candId || c.id === candId);
        newWinningPartyId = cand?.partyId || booth.winningPartyId;
      }
    });

    const isFlipped = newWinningPartyId !== booth.winningPartyId;

    return {
      ...booth,
      newWinningPartyId,
      newWinnerId,
      isFlipped
    };
  });

  const flippedBoothsCount = projectedBooths.filter(b => b.isFlipped).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Campaign Strategy Tool
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive Swing Scenario Simulator
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Simulate party vote share swings to model booth flips & projected constituency outcomes ({constituency.name})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSwings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset Sliders</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Scenario Simulation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders on Left (5 cols) & Projected Results on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Adjust Party Vote Swings</h2>
              <p className="text-xs text-slate-500 font-mono">
                Set +/- % vote share shift for each major party
              </p>
            </div>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-5">
            {(currentElection.partyBreakdown && currentElection.partyBreakdown.length > 0) ? (
              currentElection.partyBreakdown.map((item) => {
                const party = PARTIES[item.partyId] || PARTIES['IND_OTH'];
                const currentVal = swings[party.id] || 0;

                return (
                  <div key={party.id} className="space-y-2 p-3 bg-slate-50 rounded border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: party.color }}
                        ></span>
                        <span className="font-bold text-slate-900">{party.name}</span>
                      </div>
                      <span className={`font-extrabold ${
                        currentVal > 0 ? 'text-emerald-700' : currentVal < 0 ? 'text-rose-700' : 'text-slate-600'
                      }`}>
                        {currentVal > 0 ? `+${currentVal}%` : `${currentVal}%`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="0.5"
                      value={currentVal}
                      onChange={(e) => handleSwingChange(party.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>-15% Swing</span>
                      <span>Baseline (0%)</span>
                      <span>+15% Swing</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">
                No major party breakdown records registered for this election cycle.
              </div>
            )}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 space-y-1 font-mono">
            <span className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Simulation Methodology
            </span>
            <p className="text-slate-700 font-sans text-[11px] leading-snug">
              Swings apply uniform relative adjustments across all polling station counts. Results update booth flip projections dynamically.
            </p>
          </div>
        </div>

        {/* Projected Simulation Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary KPI Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                  PROJECTED SIMULATION OUTCOME
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {constituency.booths.length === 0
                    ? 'Form 20 Data: Data not available'
                    : flippedBoothsCount > 0 
                      ? `${flippedBoothsCount} Booths Flipped` 
                      : 'No Booth Flips (Baseline Maintained)'}
                </h3>
              </div>

              <div className="text-right font-mono">
                <span className="text-slate-400 text-[10px] block">TOTAL BOOTHS</span>
                <span className="text-2xl font-extrabold text-white">
                  {constituency.booths.length > 0 ? constituency.booths.length : 'N/A'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {constituency.booths.length === 0 ? (
                'Detailed swing simulation requires station-level Form 20 vote tallies. Form 20 booth records are currently not available for this constituency.'
              ) : (
                <>
                  Under this simulated swing scenario, <span className="font-bold text-amber-400 font-mono">{flippedBoothsCount} polling stations</span> would shift winning party leads compared to the official {electionYear} election outcome.
                </>
              )}
            </p>
          </div>

          {/* Flipped Booths Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Projected Booth Flip Detail ({constituency.booths.length > 0 ? `${flippedBoothsCount} Booths Affected` : 'Data not available'})
            </h3>

            {constituency.booths.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono space-y-2">
                <div className="font-bold text-slate-700">Form 20 Booth Data: Data not available</div>
                <div>Station-level polling records for {constituency.name} have not been uploaded yet.</div>
              </div>
            ) : flippedBoothsCount === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No booth flips detected at current slider settings. Adjust sliders on the left to test scenarios.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase">
                      <th className="p-2.5">Booth ID</th>
                      <th className="p-2.5 font-sans">Name</th>
                      <th className="p-2.5">{electionYear} Winner</th>
                      <th className="p-2.5 text-blue-700">Simulated Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {projectedBooths.filter(b => b.isFlipped).map((b) => {
                      const oldParty = PARTIES[b.winningPartyId] || PARTIES['IND_OTH'];
                      const newParty = PARTIES[b.newWinningPartyId] || PARTIES['IND_OTH'];

                      return (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">#{b.id}</td>
                          <td className="p-2.5 font-sans truncate max-w-[180px]">{b.name}</td>
                          <td className="p-2.5 font-bold" style={{ color: oldParty.color }}>
                            {oldParty.shortName}
                          </td>
                          <td className="p-2.5 font-extrabold" style={{ color: newParty.color }}>
                            {newParty.shortName} 🔄
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
