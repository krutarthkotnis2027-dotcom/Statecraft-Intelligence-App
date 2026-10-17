import React, { useState } from 'react';
import { Booth, Party, Constituency } from '../types/electoral';
import { PARTIES } from '../data/mockElectoralData';
import { 
  Award, 
  TrendingUp, 
  Users, 
  MapPin, 
  Vote, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  X, 
  Compass, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

interface BoothAnalysisWindowProps {
  booth: Booth;
  constituency?: Constituency;
  onClose?: () => void;
  onCompareToggle?: (boothId: string) => void;
  isCompared?: boolean;
  isFloating?: boolean;
  compact?: boolean;
}

export const BoothAnalysisWindow: React.FC<BoothAnalysisWindowProps> = ({
  booth,
  constituency,
  onClose,
  onCompareToggle,
  isCompared = false,
  isFloating = false,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'VOTES' | 'TRENDS' | 'DEMOGRAPHICS'>('VOTES');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  const winningParty: Party = PARTIES[booth.winningPartyId] || PARTIES['IND_OTH'] || {
    id: booth.winningPartyId,
    name: booth.winningPartyId,
    shortName: booth.winningPartyId,
    color: '#3b82f6',
    bgLight: '#eff6ff',
    flagSymbol: 'Symbol'
  };

  const runnerUpParty: Party = PARTIES[booth.runnerUpPartyId] || PARTIES['IND_OTH'] || {
    id: booth.runnerUpPartyId,
    name: booth.runnerUpPartyId,
    shortName: booth.runnerUpPartyId,
    color: '#64748b',
    bgLight: '#f8fafc',
    flagSymbol: 'Symbol'
  };

  // Lead Margin classification
  const isClose = booth.winningMarginPercentage < 5;
  const isStronghold = booth.winningMarginPercentage >= 10;
  const marginLabel = isClose
    ? 'High-Risk Swing Zone (<5%)'
    : isStronghold
    ? 'Decisive Stronghold (>10%)'
    : 'Moderate Lead (5-10%)';

  // Sort candidate votes descending
  const sortedCandidates = Object.entries(booth.candidateVotes)
    .map(([candidateName, votes]) => {
      const voteCount = Number(votes);
      const voteShare = booth.validVotes > 0 
        ? Number(((voteCount / booth.validVotes) * 100).toFixed(1))
        : 0;
      
      const isWinner = candidateName === booth.winningCandidateId;
      const isRunnerUp = candidateName === booth.runnerUpCandidateId;
      
      // Determine candidate party color
      let partyColor = '#64748b';
      let partyShort = 'OTH';
      if (isWinner) {
        partyColor = winningParty.color;
        partyShort = winningParty.shortName;
      } else if (isRunnerUp) {
        partyColor = runnerUpParty.color;
        partyShort = runnerUpParty.shortName;
      } else {
        // Try finding matching party
        const matchedParty = Object.values(PARTIES).find(p => candidateName.toLowerCase().includes(p.shortName.toLowerCase()));
        if (matchedParty) {
          partyColor = matchedParty.color;
          partyShort = matchedParty.shortName;
        }
      }

      return {
        name: candidateName,
        votes: voteCount,
        percentage: voteShare,
        isWinner,
        isRunnerUp,
        partyColor,
        partyShort
      };
    })
    .sort((a, b) => b.votes - a.votes);

  const handleCopySummary = () => {
    const summaryText = `[Form 20 Analysis] Booth #${booth.id} - ${booth.name}\n` +
      `Location: ${booth.locationName}, ${booth.wardZone || ''}\n` +
      `Winner: ${booth.winningCandidateId} (${winningParty.shortName}) with ${booth.candidateVotes[booth.winningCandidateId] || 0} votes\n` +
      `Lead Margin: +${booth.winningMargin} votes (${booth.winningMarginPercentage}%)\n` +
      `Turnout: ${booth.turnoutPercentage}% (${booth.totalVotesPolled}/${booth.registeredElectors} electors)\n` +
      `Dominant Caste/Group: ${booth.dominantCommunity}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border shadow-2xl overflow-hidden font-sans transition-all duration-300 ${
        isFloating 
          ? 'w-96 max-w-[95vw] fixed bottom-6 right-6 z-50 bg-white' 
          : 'w-full bg-white'
      }`}
      style={{
        borderColor: winningParty.color,
        boxShadow: `0 10px 30px -5px ${winningParty.color}33, 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
      }}
    >
      {/* WINDOW TITLE BAR (Color-Coded to Leading Party) */}
      <div 
        className="px-3.5 py-2.5 flex items-center justify-between text-white select-none relative overflow-hidden"
        style={{ 
          backgroundColor: winningParty.color,
          backgroundImage: `linear-gradient(135deg, ${winningParty.color} 0%, ${winningParty.color}ee 100%)`
        }}
      >
        {/* Subtle decorative pattern in title bar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Window Left: OS-like Dots + Window Title */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white/40 border border-white/60 hover:bg-rose-400 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40 border border-white/60 hover:bg-amber-400 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40 border border-white/60 hover:bg-emerald-400 transition-colors" />
          </div>
          
          <div className="h-3 w-px bg-white/30" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded text-white/95">
              Booth #{booth.id}
            </span>
            <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-[200px] text-white">
              {booth.name}
            </span>
          </div>
        </div>

        {/* Window Right: Quick Window Controls */}
        <div className="flex items-center gap-1.5 z-10">
          <button
            onClick={handleCopySummary}
            className="p-1 rounded bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Copy Form 20 summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Window' : 'Expand Window'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-black/20 hover:bg-rose-600/80 text-white/90 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close window"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* LEAD CANDIDATE & PARTY HERO CARD (Themed by Leading Party Color) */}
      <div 
        className="p-3.5 border-b transition-all duration-200"
        style={{ 
          backgroundColor: `${winningParty.color}0c`,
          borderColor: `${winningParty.color}30`
        }}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Winner details */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span 
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white font-mono shadow-xs"
                style={{ backgroundColor: winningParty.color }}
              >
                <Award className="w-3 h-3" />
                <span>LEAD: {winningParty.shortName}</span>
              </span>

              <span 
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isClose 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                    : isStronghold
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {marginLabel}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
              <span>{booth.winningCandidateId}</span>
              <span className="text-amber-500 text-xs">★</span>
            </h3>

            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{booth.locationName}</span>
              {booth.wardZone && (
                <span className="text-slate-400 font-mono text-[11px]">({booth.wardZone})</span>
              )}
            </p>
          </div>

          {/* Lead Margin Callout Box */}
          <div 
            className="text-right p-2 rounded-lg border bg-white shadow-xs shrink-0"
            style={{ borderColor: `${winningParty.color}40` }}
          >
            <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">
              Winning Margin
            </span>
            <span 
              className="text-base font-black font-mono block leading-none my-0.5"
              style={{ color: winningParty.color }}
            >
              +{booth.winningMargin.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              +{booth.winningMarginPercentage}% lead
            </span>
          </div>
        </div>
      </div>

      {/* EXPANDABLE BODY CONTENT */}
      {isExpanded && (
        <div className="p-3.5 space-y-3.5">
          {/* QUICK 4-GRID METRICS PILL BOXES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {/* Registered Electors */}
            <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Electors</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {booth.registeredElectors.toLocaleString()}
              </span>
            </div>

            {/* Polled Votes */}
            <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Votes Polled</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {booth.totalVotesPolled.toLocaleString()}
              </span>
            </div>

            {/* Turnout % */}
            <div 
              className="p-2 border rounded-lg text-center"
              style={{ 
                backgroundColor: booth.turnoutPercentage >= 75 ? '#ecfdf5' : '#f8fafc',
                borderColor: booth.turnoutPercentage >= 75 ? '#a7f3d0' : '#e2e8f0'
              }}
            >
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Turnout</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                {booth.turnoutPercentage}%
              </span>
            </div>

            {/* Booth Type */}
            <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Category</span>
              <span className="font-bold text-slate-700 text-xs">
                {booth.boothType || 'RURAL'}
              </span>
            </div>
          </div>

          {/* WINDOW NAVIGATION TABS */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-xs font-mono">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('VOTES')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  activeTab === 'VOTES'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Candidate Votes
              </button>

              <button
                onClick={() => setActiveTab('TRENDS')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  activeTab === 'TRENDS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Turnout Trend
              </button>

              <button
                onClick={() => setActiveTab('DEMOGRAPHICS')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  activeTab === 'DEMOGRAPHICS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Demographics
              </button>
            </div>

            {onCompareToggle && (
              <button
                onClick={() => onCompareToggle(booth.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {isCompared ? '✓ Selected' : '+ Compare'}
              </button>
            )}
          </div>

          {/* TAB 1: CANDIDATE VOTE SHARE BREAKDOWN */}
          {activeTab === 'VOTES' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Candidate / Party</span>
                <span>Form 20 Tally (Valid: {booth.validVotes.toLocaleString()})</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sortedCandidates.map((cand) => (
                  <div key={cand.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cand.partyColor }}
                        />
                        <span className={`truncate max-w-[170px] ${cand.isWinner ? 'font-bold text-slate-950' : ''}`}>
                          {cand.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          [{cand.partyShort}]
                        </span>
                        {cand.isWinner && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                            WIN
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-right shrink-0">
                        <span className={`font-bold ${cand.isWinner ? 'text-slate-900' : 'text-slate-700'}`}>
                          {cand.votes.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1">
                          ({cand.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with exact Party Color */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${cand.percentage}%`,
                          backgroundColor: cand.partyColor 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rejected & NOTA row */}
              {(booth.notaVotes > 0 || booth.rejectedVotes > 0) && (
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                  <span>NOTA: <strong className="text-slate-600">{booth.notaVotes || 0}</strong></span>
                  <span>Rejected: <strong className="text-slate-600">{booth.rejectedVotes || 0}</strong></span>
                  <span>Total Polled: <strong className="text-slate-800">{booth.totalVotesPolled}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORICAL TURNOUT TREND (3 Cycles) */}
          {activeTab === 'TRENDS' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-slate-500 block">
                Vidhan Sabha 3-Cycle Participation Rate:
              </span>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                {/* 2014 */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">2014</span>
                  <span className="text-sm font-black text-slate-700 block mt-0.5">
                    {booth.historicalResults[2014]?.turnoutPercentage || 65.4}%
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {booth.historicalResults[2014]?.winningPartyId || 'NDA_BJP'}
                  </span>
                </div>

                {/* 2019 */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">2019</span>
                  <span className="text-sm font-black text-slate-700 block mt-0.5">
                    {booth.historicalResults[2019]?.turnoutPercentage || 69.1}%
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {booth.historicalResults[2019]?.winningPartyId || 'NCP_SP'}
                  </span>
                </div>

                {/* 2024 (Color Coded to current winner) */}
                <div 
                  className="p-2.5 rounded-lg border text-white"
                  style={{ 
                    backgroundColor: winningParty.color,
                    borderColor: winningParty.color 
                  }}
                >
                  <span className="text-[10px] text-white/80 uppercase block font-bold">2024</span>
                  <span className="text-sm font-black text-white block mt-0.5">
                    {booth.turnoutPercentage}%
                  </span>
                  <span className="text-[9px] text-white/90 font-bold">
                    {winningParty.shortName} (+{booth.winningMargin})
                  </span>
                </div>
              </div>

              {/* Trend commentary note */}
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>Turnout Shift:</span>
                </div>
                <p>
                  Voter participation in this polling station shifted by{' '}
                  <strong className="text-slate-900 font-mono">
                    {booth.turnoutPercentage > (booth.historicalResults[2019]?.turnoutPercentage || 68) ? '+' : ''}
                    {(booth.turnoutPercentage - (booth.historicalResults[2019]?.turnoutPercentage || 68)).toFixed(1)}%
                  </strong>{' '}
                  compared to the 2019 general assembly election.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DEMOGRAPHICS & COMMUNITY DYNAMICS */}
          {activeTab === 'DEMOGRAPHICS' && (
            <div className="space-y-3 text-xs">
              <div 
                className="p-3 rounded-lg border space-y-1.5"
                style={{ 
                  backgroundColor: `${winningParty.color}0a`,
                  borderColor: `${winningParty.color}30` 
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Users className="w-4 h-4" style={{ color: winningParty.color }} />
                  <span>Dominant Community Bloc</span>
                </div>

                <div className="text-sm font-extrabold text-slate-950">
                  {booth.dominantCommunity}
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Key voter demographic driving booth turnout. Influenced by local agricultural societies, gram panchayat networks, and regional leadership.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[9px] uppercase">Zone Category</span>
                  <span className="font-bold text-slate-800">{booth.wardZone || 'Rural Gramin'}</span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[9px] uppercase">Voting Center</span>
                  <span className="font-bold text-slate-800 truncate block">{booth.name.split(' ')[0]} Hub</span>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER BAR */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: winningParty.color }} />
              ECI Form 20 Certified
            </span>

            <span>AC #{constituency?.number || 227} &bull; Station #{booth.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};
