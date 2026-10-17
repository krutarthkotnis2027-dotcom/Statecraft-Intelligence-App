import React, { useState } from 'react';
import { Constituency } from '../types/electoral';
import { 
  Database, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Code2, 
  Lock, 
  Info, 
  Download,
  FileSpreadsheet,
  Sparkles,
  Compass
} from 'lucide-react';
import { parseForm20CSV, generateSampleForm20CSV, saveBoothsForAC } from '../data/form20Store';

interface DataSourcesViewProps {
  constituency: Constituency;
  onOpenExportModal: () => void;
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({
  constituency,
  onOpenExportModal
}) => {
  const [customDataInput, setCustomDataInput] = useState<string>('');
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  const handleValidateJSON = () => {
    if (!customDataInput.trim()) {
      setParseStatus('ERROR: Input is empty');
      return;
    }
    try {
      JSON.parse(customDataInput);
      setParseStatus('SUCCESS: ECI Form 20 JSON schema validated successfully!');
    } catch (err: any) {
      setParseStatus(`ERROR: Invalid JSON syntax - ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Data Architecture & Governance
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Sources & Schema Specifications
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Source-agnostic data engine details, ECI Form 20 specification & Chanakya PR methodology
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Schema Specification</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Data Provenance Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specification 1: ECI Form 20 Electoral Data */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Election Commission of India (ECI) Form 20</h2>
              <p className="text-xs text-slate-500 font-mono">Final Result Sheet Data Standard</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Form 20 is the official tabular result sheet published by Returning Officers under Rule 56(7) of the Conduct of Elections Rules, 1961. It provides official booth-wise accounting of valid votes polled per candidate.
          </p>

          <ul className="space-y-2 text-xs font-mono text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Booth Registered Electors & Total Polled Votes</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Candidate/Party-wise Exact Vote Counts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tendered Votes & Rejected Votes Accounting</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Booth-level Turnout & Winning Margin Percentages</span>
            </li>
          </ul>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-600">
            <span className="font-bold block text-slate-800 mb-1">Status in Statecraft Intelligence:</span>
            Full 2024, 2019, and 2014 Form 20 datasets ingested for active assembly constituencies.
          </div>
        </div>

        {/* Specification 2: Demographic Data & Chanakya PR */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Chanakya Political Research (Demographics)</h2>
              <p className="text-xs text-slate-500 font-mono">Source-Agnostic Demographic Framework</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Constituency-level caste and community estimates are currently populated using Chanakya Political Research survey projections. The platform is designed to seamlessly integrate official Census / Caste Census data when published.
          </p>

          <ul className="space-y-2 text-xs font-mono text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Source-Agnostic Schema (Supports Multiple Sources)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Confidence Ratings per Community Estimate</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Category Standardizations (OBC, SC, ST, MINORITY, GEN)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Trend Notes & Local Influencer Density</span>
            </li>
          </ul>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-600">
            <span className="font-bold block text-slate-800 mb-1">Census Ingestion Pipeline Ready:</span>
            Will replace sample estimates upon official Registrar General of India release.
          </div>
        </div>
      </div>

      {/* Form 20 Custom CSV Ingestion & Geographical Placement Engine */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              ECI Form 20 CSV Ingestion & Spatial Placement Engine
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Target AC: AC #{constituency.number} &bull; {constituency.name} ({constituency.districtName}, {constituency.stateName})
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[302, 303, 304, 305, 306].includes(constituency.number) && (
              <button
                type="button"
                onClick={() => {
                  const sample = generateSampleForm20CSV(constituency.number);
                  setCustomDataInput(sample);
                  const res = parseForm20CSV(sample, constituency.number);
                  setParseStatus(`SUCCESS: Geocoded ${res.booths.length} stations across ${Object.keys(res.sectorsSummary).length} sectors! Click 'Commit Booths' below.`);
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Load AC {constituency.number} Sample CSV</span>
              </button>
            )}
            <button
              onClick={() => {
                if (!customDataInput.trim()) {
                  setParseStatus('ERROR: Input is empty. Please paste CSV rows.');
                  return;
                }
                const res = parseForm20CSV(customDataInput, constituency.number);
                if (res.success) {
                  setParseStatus(`SUCCESS: Validated & geocoded ${res.booths.length} stations! Detected candidates: ${res.detectedCandidates.join(', ')}. Sectors: ${Object.keys(res.sectorsSummary).join(', ')}`);
                } else {
                  setParseStatus(`ERROR: ${res.message}`);
                }
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Geocode & Validate</span>
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={customDataInput}
          onChange={(e) => setCustomDataInput(e.target.value)}
          placeholder={`Paste Form 20 CSV (with PS No, Station Name, Candidate votes, NOTA, Total):\n302,1,"Prathmik Vidyalaya Shohratgarh Nagar Ward 1 (Purab)",340,210,8,558\n302,2,"Kanya Purva Madhyamik Vidyalaya Barhni Bazar (North)",290,260,5,555`}
          className="w-full p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded border border-slate-800 focus:outline-none focus:border-slate-700"
        ></textarea>

        {parseStatus && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded text-xs font-mono font-bold border bg-slate-50 border-slate-300">
            <span className={parseStatus.startsWith('SUCCESS') ? 'text-emerald-700' : 'text-rose-700'}>
              {parseStatus}
            </span>
            {parseStatus.startsWith('SUCCESS') && (
              <button
                type="button"
                onClick={() => {
                  const res = parseForm20CSV(customDataInput, constituency.number);
                  if (res.success && res.booths.length > 0) {
                    saveBoothsForAC(constituency.number, res.booths);
                    alert(`Saved ${res.booths.length} geocoded Form 20 booths to platform!`);
                    window.location.reload();
                  }
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
              >
                Commit Booths to Platform &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* Privacy & Governance Notice */}
      <div className="p-5 bg-slate-900 text-white rounded-lg border border-slate-800 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white uppercase font-mono tracking-wider">
            Data Ethics & Privacy Compliance Statement
          </h4>
          <p className="text-slate-300 leading-relaxed">
            Statecraft Intelligence focuses strictly on aggregate electoral statistics, Form 20 result sheets, and demographic estimates. The system <span className="font-bold text-white underline">does not track individual voters</span>, create individual voter profiling dossiers, or attempt to monitor personal political affiliations. All data operations strictly adhere to public election data standards.
          </p>
        </div>
      </div>
    </div>
  );
};
