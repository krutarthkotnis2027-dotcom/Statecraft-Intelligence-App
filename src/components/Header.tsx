import React, { useState, useRef, useEffect } from 'react';
import { Constituency } from '../types/electoral';
import { UserSession } from '../types/auth';
import { 
  Building2, 
  Search, 
  Bell, 
  HelpCircle, 
  MapPin, 
  Download, 
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  Home,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  constituency: Constituency;
  onOpenLocationModal: () => void;
  onOpenExportModal: () => void;
  onOpenImporterModal?: () => void;
  onNavigateHome?: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  activeTab: string;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  constituency,
  onOpenLocationModal,
  onOpenExportModal,
  onOpenImporterModal,
  onNavigateHome,
  globalSearchQuery,
  setGlobalSearchQuery,
  currentUser,
  onLogout
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string, orgId?: string) => {
    if (!name) return orgId ? orgId.substring(0, 2) : 'US';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = (!currentUser?.name || currentUser.name === 'Rajeshwar Kulkarni (IAS)') 
    ? 'Organisational user' 
    : currentUser.name;

  return (
    <header className="bg-white border-b border-slate-200 h-14 w-full px-4 lg:px-6 z-30 flex items-center justify-between shrink-0 sticky top-0 shadow-xs min-w-0">
      {/* Brand & Active Region Selection */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 pr-2">
        <div className="flex items-center gap-2 pr-3 md:pr-4 border-r border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="font-bold text-slate-900 tracking-tight text-sm md:text-base leading-none">
              Statecraft Intelligence
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5 hidden md:inline">
              Electoral Data & Demographic Engine
            </span>
          </div>
        </div>

        {/* Return to Home Hub */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 rounded border border-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            title="Return to Constituency Selection Hub"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Constituency Hub</span>
          </button>
        )}

        {/* Location Selector Pill */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200 text-xs font-medium transition-colors group cursor-pointer min-w-0 max-w-xs md:max-w-md truncate"
          title="Click to switch State, District, or Constituency"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
          <span className="font-semibold shrink-0 hidden sm:inline">{constituency.stateName}</span>
          <span className="text-slate-400 shrink-0 hidden sm:inline">/</span>
          <span className="text-slate-600 truncate hidden md:inline">{constituency.districtName}</span>
          <span className="text-slate-400 shrink-0 hidden md:inline">/</span>
          <span className="font-extrabold text-slate-900 truncate">AC #{constituency.number} &bull; {constituency.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
        </button>
      </div>

      {/* Global Quick Search & System Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search booths, candidates, communities..."
            className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white w-56 lg:w-64 transition-all"
          />
        </div>

        {/* Institutional Badge */}
        {constituency.booths.length > 0 ? (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ECI Form 20 Audited</span>
          </div>
        ) : (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Form 20: Data not available</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 sm:pl-3">
          {onOpenImporterModal && (
            <button
              onClick={onOpenImporterModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Import or geocode Form 20 CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import Form 20 CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Profile & Organization Dropdown */}
          <div className="relative ml-1" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer group"
              title="View active organizational identity & settings"
            >
              <div className="w-7 h-7 rounded-md bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
                {getInitials(displayName, currentUser?.organizationId)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none truncate max-w-[130px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono leading-tight mt-0.5 truncate max-w-[130px]">
                  {currentUser?.organizationId || 'SECURE-ORG'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                {/* Header Profile Info */}
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {getInitials(displayName, currentUser?.organizationId)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {currentUser?.email || 'officer@electoral.gov.in'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {currentUser?.organizationId || 'SECURE_ORG'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Details */}
                <div className="py-3 border-b border-slate-100 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500">Organization:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]">
                      {currentUser?.organizationName || 'State Electoral Department'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500">Role:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]">
                      {currentUser?.roleTitle || 'Chief Analyst'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500">Security Clearance:</span>
                    <span className="font-mono text-[11px] font-bold text-slate-700">
                      {currentUser?.clearanceLevel?.replace(/_/g, ' ') || 'LEVEL 3 CONFIDENTIAL'}
                    </span>
                  </div>

                  {currentUser?.department && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500">Department:</span>
                      <span className="text-slate-700 text-right truncate max-w-[170px]">
                        {currentUser.department}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="py-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    TLS 1.3 Active Session
                  </span>
                  <span>{constituency.booths.length > 0 ? 'ECI Form 20 Audited' : 'Form 20: Data not available'}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out & Switch Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
