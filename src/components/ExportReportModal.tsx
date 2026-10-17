import React, { useState } from 'react';
import { Constituency } from '../types/electoral';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  CheckSquare, 
  Square,
  FileSpreadsheet
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  constituency: Constituency;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  constituency
}) => {
  const [includeOverview, setIncludeOverview] = useState<boolean>(true);
  const [includeForm20, setIncludeForm20] = useState<boolean>(true);
  const [includeDemographics, setIncludeDemographics] = useState<boolean>(true);
  const [includeTrends, setIncludeTrends] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    if (constituency.booths.length === 0) {
      const latestElection = constituency.elections[constituency.currentYear] || Object.values(constituency.elections)[0];
      const headers = ['Constituency_No', 'Constituency_Name', 'District', 'State', 'Form_20_Status', 'Total_Electors', 'Total_Polled', 'Turnout_Pct'];
      const row = [
        constituency.number,
        `"${constituency.name}"`,
        `"${constituency.districtName}"`,
        `"${constituency.stateName}"`,
        '"Form 20 Station Data: Data not available (Awaiting Ingestion)"',
        latestElection?.totalElectors || 'N/A',
        latestElection?.totalPolled || 'N/A',
        latestElection?.turnoutPercentage || 'N/A'
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ECI_Form20_${constituency.name.replace(/\s+/g, '_')}_Summary.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate Form 20 CSV
    const headers = ['Booth_ID', 'Booth_Name', 'Location', 'Registered_Electors', 'Votes_Polled', 'Turnout_Pct', 'Winning_Party', 'Margin'];
    const rows = constituency.booths.map(b => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.locationName.replace(/"/g, '""')}"`,
      b.registeredElectors,
      b.totalVotesPolled,
      b.turnoutPercentage,
      b.winningPartyId,
      b.winningMargin
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ECI_Form20_${constituency.name.replace(/\s+/g, '_')}_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
              <Download className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Export Executive Intelligence Report
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {constituency.name} (AC-{constituency.number})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Options */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase text-slate-600 block">
            Select Data Sections to Include
          </label>

          <div
            onClick={() => setIncludeOverview(!includeOverview)}
            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {includeOverview ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-900">1. Constituency Dashboard Executive Snapshot</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Summary</span>
          </div>

          <div
            onClick={() => setIncludeForm20(!includeForm20)}
            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {includeForm20 ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-900">
                2. ECI Form 20 Booth Table ({constituency.booths.length > 0 ? `${constituency.booths.length} Booths` : 'Data not available'})
              </span>
            </div>
            <span className={`text-[10px] font-mono ${constituency.booths.length > 0 ? 'text-emerald-700' : 'text-slate-400'} font-bold`}>
              {constituency.booths.length > 0 ? 'CSV / Tabular' : 'Pending Ingestion'}
            </span>
          </div>

          <div
            onClick={() => setIncludeDemographics(!includeDemographics)}
            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {includeDemographics ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-900">3. Caste & Community Demographic Distribution</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Chanakya PR</span>
          </div>

          <div
            onClick={() => setIncludeTrends(!includeTrends)}
            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {includeTrends ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-900">4. Multi-Year Swing & Competitiveness Matrix</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">2014-2024</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadCSV}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Download Form 20 CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
