import React, { useState } from 'react';
import { Constituency } from '../types/electoral';
import { 
  Users, 
  Database, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  CheckCircle2, 
  Download, 
  PieChart, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface DemographicsViewProps {
  constituency: Constituency;
  onOpenExportModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DemographicsView: React.FC<DemographicsViewProps> = ({
  constituency,
  onOpenExportModal,
  onNavigateTab
}) => {
  const [activeSourceId, setActiveSourceId] = useState<string>(
    constituency.activeDemographicSourceId || constituency.demographicSources[0]?.id || 'CHANAKYA_PR_2024'
  );

  const activeSourceMeta = constituency.demographicSources.find(s => s.id === activeSourceId) || constituency.demographicSources[0];

  // Total electors for population calculation
  const totalElectors = constituency.elections[2024]?.totalElectors || 350000;

  // Category Colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'OBC': return { bar: 'bg-amber-600', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'SC': return { bar: 'bg-blue-600', badge: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'ST': return { bar: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'MINORITY': return { bar: 'bg-purple-600', badge: 'bg-purple-100 text-purple-900 border-purple-300' };
      default: return { bar: 'bg-slate-700', badge: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Intelligence Base &gt; Demographic Profile
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Caste & Community Distribution
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Constituency-level demographic estimation model ({constituency.name}, AC-{constituency.number})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Demographic Sheet</span>
          </button>
        </div>
      </div>

      {/* Data Source Provenance Card / Selector */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Demographic Data Architecture & Source Provenance</h2>
              <p className="text-xs text-slate-500 font-mono">Source-agnostic framework supporting Census & Political Surveys</p>
            </div>
          </div>

          {/* Source Toggle Pills */}
          <div className="inline-flex rounded border border-slate-300 p-0.5 bg-slate-50 text-xs font-mono font-bold">
            {constituency.demographicSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setActiveSourceId(source.id)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeSourceId === source.id
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Source Meta Summary */}
        {activeSourceMeta && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200/80 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">ACTIVE METHODOLOGY</span>
              <span className="font-bold text-slate-900">{activeSourceMeta.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SAMPLE SIZE / SCOPE</span>
              <span className="font-bold text-slate-800">{activeSourceMeta.sampleSize || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">RELIABILITY RATING</span>
              <span className="font-bold text-emerald-700">{activeSourceMeta.reliabilityScore}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DESCRIPTION</span>
              <span className="text-slate-600 truncate block">{activeSourceMeta.description}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Horizontal Distribution Bar Chart & Key Demographic Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Distribution Breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Demographic Composition Breakdown</h3>
              <p className="text-xs text-slate-500 font-mono">Estimated community percentages and voter share counts</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
              Total Population Base: ~{totalElectors.toLocaleString('en-IN')} Electors
            </span>
          </div>

          {/* Demographic Rows */}
          <div className="space-y-4">
            {constituency.demographics.map((item, idx) => {
              const catColors = getCategoryColor(item.category);
              const estimatedVoters = Math.round((totalElectors * item.percentage) / 100);

              return (
                <div key={idx} className="p-3 bg-slate-50/70 rounded border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-slate-900 text-sm truncate">{item.communityName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${catColors.badge}`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs shrink-0">
                      <span className="text-slate-500 text-[11px]">
                        ~{estimatedVoters.toLocaleString('en-IN')} electors
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">{item.percentage}%</span>
                      <span className={`px-1.5 py-0.2 text-[9px] rounded font-mono font-bold ${
                        item.confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${catColors.bar}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>

                  {/* Source Tag & Trend Note */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                    <span>Source: {item.sourceTag}</span>
                    {item.trendNote && (
                      <span className="text-slate-600 font-sans italic truncate max-w-md">
                        "{item.trendNote}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Estimates are source-attributed to Chanakya Political Research field surveys.
            </span>
            <button
              onClick={() => onNavigateTab('BOOTHS')}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Examine Booth-Level Community Concentration &rarr;
            </button>
          </div>
        </div>

        {/* Key Demographic Shifts Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
              Key Demographic Realignment Shifts
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analysis indicates significant demographic realignment compared to previous census cycles, driven by urbanization, migration, and local economic development.
            </p>

            <ul className="space-y-3.5 text-xs">
              <li className="flex gap-2.5 items-start">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Agrarian & OBC Mobilization</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Recorded <span className="font-bold text-slate-900">+2.4%</span> relative growth in concentrated rural and semi-urban polling stations.
                  </p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start pt-3 border-t border-slate-100">
                <Minus className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">SC Core Voting Discipline</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Maintained high baseline turnout representation across municipal ward strongholds with minimal variance.
                  </p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start pt-3 border-t border-slate-100">
                <TrendingDown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Urban Migration Shifts</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Outmigration recorded in peripheral agricultural booths, offset by high-density housing society expansion.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Booth Spatial Link Card */}
          <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
              <Layers className="w-4 h-4" />
              <span>Spatial Concentration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demographic dominance directly influences booth-level turnout and party margins. View spatial overlays in the Form 20 Booth Explorer.
            </p>
            <button
              onClick={() => onNavigateTab('BOOTHS')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <span>Explore Booth-Wise Dominance</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
