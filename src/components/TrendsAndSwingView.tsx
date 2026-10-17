import React from 'react';
import { Constituency } from '../types/electoral';
import { PARTIES } from '../data/mockElectoralData';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Share2, 
  Info, 
  Award,
  AlertCircle,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

interface TrendsAndSwingViewProps {
  constituency: Constituency;
  onOpenExportModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const TrendsAndSwingView: React.FC<TrendsAndSwingViewProps> = ({
  constituency,
  onOpenExportModal,
  onNavigateTab
}) => {
  const availableYears = Object.keys(constituency.elections).map(Number).sort((a, b) => b - a);
  const latestYear = constituency.currentYear || availableYears[0] || 2024;
  const latestElection = constituency.elections[latestYear] 
    || constituency.elections[2024] 
    || Object.values(constituency.elections)[0];
  const previousYear = availableYears.find(yr => yr < latestYear);
  const previousElection = previousYear ? constituency.elections[previousYear] : undefined;

  const turnoutDelta = (latestElection && previousElection)
    ? Number((latestElection.turnoutPercentage - previousElection.turnoutPercentage).toFixed(1))
    : 0;

  // Competitiveness clusters
  const totalBooths = constituency.booths.length;
  const closeBooths = constituency.booths.filter(b => b.winningMarginPercentage < 5);
  const strongholdBooths = constituency.booths.filter(b => b.winningMarginPercentage > 10);
  const moderateBooths = constituency.booths.filter(b => b.winningMarginPercentage >= 5 && b.winningMarginPercentage <= 10);

  const closePercent = totalBooths > 0 ? Number(((closeBooths.length / totalBooths) * 100).toFixed(0)) : 0;
  const strongholdPercent = totalBooths > 0 ? Number(((strongholdBooths.length / totalBooths) * 100).toFixed(0)) : 0;
  const moderatePercent = totalBooths > 0 ? Number(((moderateBooths.length / totalBooths) * 100).toFixed(0)) : 0;

  // Compute swing data per party
  const partySwingData = Object.values(PARTIES).map((party) => {
    const latestShare = latestElection?.partyBreakdown.find(p => p.partyId === party.id)?.voteSharePercentage || 0;
    const prevShare = previousElection?.partyBreakdown.find(p => p.partyId === party.id)?.voteSharePercentage || 0;

    const netSwing = Number((latestShare - prevShare).toFixed(1));

    return {
      party,
      latestShare,
      prevShare,
      netSwing
    };
  }).filter(item => item.latestShare > 0 || item.prevShare > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Analysis / Historical Trends
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Electoral Comparison & Trends ({availableYears.join(', ')})
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Electoral trajectory, vote share swing analysis & competitiveness clustering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Trends Report</span>
          </button>
        </div>
      </div>

      {/* Top Card: Turnout Trend Across Cycles */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
              OVERALL CONSTITUENCY TURNOUT TRAJECTORY
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {latestElection?.turnoutPercentage || 0}%
              </span>
              {turnoutDelta !== 0 && (
                <span className={`text-xs font-mono font-bold flex items-center ${turnoutDelta > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {turnoutDelta > 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                  {turnoutDelta > 0 ? `+${turnoutDelta}pp` : `${turnoutDelta}pp`} vs {previousYear}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ECI verified turnout recorded across official election cycles ({constituency.name})
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('SIMULATOR')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Swing Simulator</span>
          </button>
        </div>

        {/* Turnout Visual Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          {availableYears.map((yr) => {
            const elec = constituency.elections[yr];
            const isLatest = yr === latestYear;

            return (
              <div
                key={yr}
                className={`p-4 rounded border text-center space-y-1 ${
                  isLatest ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-[10px] block ${isLatest ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                  {yr} ELECTION {isLatest ? '(ACTIVE)' : ''}
                </span>
                <span className={`text-2xl font-extrabold ${isLatest ? 'text-blue-950' : 'text-slate-800'}`}>
                  {elec?.turnoutPercentage}%
                </span>
                <span className={`text-[11px] block ${isLatest ? 'text-blue-800' : 'text-slate-500'}`}>
                  {elec?.totalPolled?.toLocaleString('en-IN') || 0} votes polled
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Competitiveness Clusters Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-500">
          Booth Competitiveness Clusters ({totalBooths > 0 ? `${totalBooths} Booths Total` : 'Data not available'})
        </h3>
        {totalBooths === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-1 font-mono text-xs text-slate-500">
            <div className="font-bold text-slate-700">Form 20 Booth Data: Data not available</div>
            <p>Station-level competitiveness clustering will activate once official Form 20 tables for {constituency.name} are provided.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Close Contest */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-mono font-bold text-rose-700 uppercase block">
                CLOSE CONTEST BOOTHS (&lt;5% MARGIN)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-slate-900">{closePercent}%</span>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  {closeBooths.length} Booths
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Highly sensitive swing booths where small mobilization swings alter leads.
              </p>
            </div>

            {/* Card 2: Moderate Margin */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-mono font-bold text-amber-700 uppercase block">
                MODERATE MARGIN (5% - 10%)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-slate-900">{moderatePercent}%</span>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  {moderateBooths.length} Booths
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Competitive territory requiring targeted voter persuasion campaign.
              </p>
            </div>

            {/* Card 3: Strongholds */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase block">
                STRONGHOLD BOOTHS (&gt;10% MARGIN)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-slate-900">{strongholdPercent}%</span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {strongholdBooths.length} Booths
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Stable base territory with high vote retention discipline.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Swing Analysis Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Party Swing Analysis (Vote Share Shifts)
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Net percentage point (pp) vote share shift {previousYear ? `between ${previousYear} and ${latestYear}` : `for ${latestYear}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase">
                <th className="p-3 font-sans">Political Party</th>
                {previousYear && <th className="p-3 text-right">{previousYear} Share</th>}
                <th className="p-3 text-right">{latestYear} Share</th>
                {previousYear && <th className="p-3 text-right">Net Swing (pp)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-xs">
              {partySwingData.map((item) => {
                const isPositive = item.netSwing > 0;
                const isZero = item.netSwing === 0;

                return (
                  <tr key={item.party.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: item.party.color }}
                        ></span>
                        <span className="font-bold text-slate-900">{item.party.name}</span>
                        <span className="text-slate-500 font-mono text-[11px]">({item.party.shortName})</span>
                      </div>
                    </td>

                    {previousYear && <td className="p-3 text-right text-slate-600">{item.prevShare}%</td>}
                    <td className="p-3 text-right font-bold text-slate-900">{item.latestShare}%</td>

                    {previousYear && (
                      <td className="p-3 text-right font-bold">
                        <span className={
                          isZero ? 'text-slate-500' : isPositive ? 'text-emerald-700' : 'text-rose-700'
                        }>
                          {isPositive ? `+${item.netSwing}pp` : `${item.netSwing}pp`}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
          <span className="font-mono text-[11px]">Calculated from official ECI election records</span>
          <button
            onClick={() => onNavigateTab('SIMULATOR')}
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Simulate Custom Vote Swing Scenarios &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
