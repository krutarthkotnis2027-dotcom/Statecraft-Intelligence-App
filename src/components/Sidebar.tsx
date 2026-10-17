import React from 'react';
import { Constituency } from '../types/electoral';
import { UserSession } from '../types/auth';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  TrendingUp, 
  Sliders, 
  Database, 
  Settings, 
  LifeBuoy,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Building,
  Home,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  constituency: Constituency;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLocationModal: () => void;
  onNavigateHome?: () => void;
  currentUser?: UserSession | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  constituency,
  activeTab,
  setActiveTab,
  onOpenLocationModal,
  onNavigateHome,
  currentUser
}) => {
  const navItems = [
    {
      id: 'OVERVIEW',
      label: 'Constituency Dashboard',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: 'Snapshot'
    },
    {
      id: 'DEMOGRAPHICS',
      label: 'Demographics & Caste',
      shortLabel: 'Demographics',
      icon: Users,
      badge: 'Chanakya PR'
    },
    {
      id: 'BOOTHS',
      label: 'Form 20 Booth Explorer',
      shortLabel: 'Booth Explorer',
      icon: MapPin,
      badge: `${constituency.booths.length} Booths`
    },
    {
      id: 'TRENDS',
      label: 'Historical Trends',
      shortLabel: 'Electoral Trends',
      icon: TrendingUp,
      badge: '2014-2024'
    },
    {
      id: 'SIMULATOR',
      label: 'Swing Scenario Simulator',
      shortLabel: 'Swing Simulator',
      icon: Sliders,
      badge: 'Interactive'
    },
    {
      id: 'DATA_SOURCES',
      label: 'Sources & Provenance',
      shortLabel: 'Data Provenance',
      icon: Database,
      badge: 'Audit Log'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 min-h-0 hidden md:flex">
      {/* Active Constituency Summary Header Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 min-w-0">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
          <span>ACTIVE CONSTITUENCY</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
            AC #{constituency.number}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate tracking-tight">
              {constituency.name}
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {constituency.districtName}, {constituency.stateName}
            </p>
          </div>
        </div>

        {/* Return to Home / Hub Button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-2.5 py-1.5 mb-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Constituency Selection Hub</span>
            </div>
            <ArrowLeft className="w-3 h-3 text-amber-400/80 rotate-180" />
          </button>
        )}

        {/* Change Selection Quick Trigger */}
        <button
          onClick={onOpenLocationModal}
          className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700/60 text-xs font-medium transition-colors cursor-pointer"
        >
          <span className="text-[11px]">Quick Modal (288 ACs)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Primary Navigation Menu */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto min-w-0">
        <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Analytics Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-4 border-amber-500 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Organization Session Pill */}
      {currentUser && (
        <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
              <Building className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] text-amber-400 font-semibold truncate leading-tight">
                {currentUser.organizationId}
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                {currentUser.name}
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Connected" />
          </div>
        </div>
      )}

      {/* System Information & Data Provenance Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
            <span className="flex items-center gap-1">
              <FileSpreadsheet className={`w-3.5 h-3.5 ${constituency.booths.length > 0 ? 'text-blue-400' : 'text-amber-400'}`} />
              {constituency.booths.length > 0 ? 'ECI Form 20 Sync' : 'Form 20 Status'}
            </span>
            <span className={`text-[10px] ${
              constituency.booths.length > 0 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                : 'bg-rose-950 text-rose-300 border-rose-800'
            } border px-1 rounded font-mono`}>
              {constituency.booths.length > 0 ? 'VERIFIED' : 'NOT AVAILABLE'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {constituency.booths.length > 0
              ? 'Booth electors & votes mapped from official Form 20 counts. Demographic estimates powered by Chanakya PR.'
              : 'Station-level Form 20 booth tallies: Data not available. Constituency aggregates and demographics active.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
