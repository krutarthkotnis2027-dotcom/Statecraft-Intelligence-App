import React, { useState, useRef } from 'react';
import { Constituency } from '../types/electoral';
import { 
  parseForm20CSV, 
  generateSampleForm20CSV, 
  saveBoothsForAC, 
  clearBoothsForAC,
  getStoredBoothsForAC,
  Form20ParseResult 
} from '../data/form20Store';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Compass, 
  Sparkles, 
  X, 
  RefreshCw, 
  Trash2, 
  Download, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface Form20ImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  constituency: Constituency;
  onImportSuccess: (acNumber: number) => void;
}

export const Form20ImporterModal: React.FC<Form20ImporterModalProps> = ({
  isOpen,
  onClose,
  constituency,
  onImportSuccess
}) => {
  const [selectedAcNo, setSelectedAcNo] = useState<number>(constituency.number || 302);
  const [csvContent, setCsvContent] = useState<string>('');
  const [parseResult, setParseResult] = useState<Form20ParseResult | null>(null);
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'PASTE' | 'PREVIEW'>('PASTE');
  const [hasExistingData, setHasExistingData] = useState<boolean>(() => {
    const existing = getStoredBoothsForAC(constituency.number);
    return existing !== null && existing.length > 0;
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvContent(text);
        runParse(text);
      }
    };
    reader.readAsText(file);
  };

  const runParse = (text: string) => {
    const result = parseForm20CSV(text, selectedAcNo);
    setParseResult(result);
    if (result.success) {
      setActiveTab('PREVIEW');
    }
  };

  const handleLoadSample = (acNum: number) => {
    setSelectedAcNo(acNum);
    const sample = generateSampleForm20CSV(acNum);
    setCsvContent(sample);
    const result = parseForm20CSV(sample, acNum);
    setParseResult(result);
    setActiveTab('PREVIEW');
  };

  const handleCommit = () => {
    if (!parseResult || !parseResult.success || parseResult.booths.length === 0) return;

    // If multi-AC detected, save each AC separately or for target
    const targetAc = selectedAcNo;
    saveBoothsForAC(targetAc, parseResult.booths);
    setHasExistingData(true);
    onImportSuccess(targetAc);
    onClose();
  };

  const handleClear = () => {
    clearBoothsForAC(selectedAcNo);
    setHasExistingData(false);
    setParseResult(null);
    setCsvContent('');
    onImportSuccess(selectedAcNo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">Form 20 CSV Importer & Booth Mapper</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Spatial Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Automatic geographical booth placement by village/landmark names
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target AC Selector Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 font-mono uppercase">Target AC:</span>
            <select
              value={selectedAcNo}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSelectedAcNo(val);
                setHasExistingData(getStoredBoothsForAC(val) !== null);
              }}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={302}>302 - Shohratgarh (Siddharthnagar)</option>
              <option value={303}>303 - Kapilvastu [SC] (Siddharthnagar)</option>
              <option value={304}>304 - Bansi (Siddharthnagar)</option>
              <option value={305}>305 - Itwa (Siddharthnagar)</option>
              <option value={306}>306 - Domariyaganj (Siddharthnagar)</option>
              <option value={constituency.number}>{constituency.number} - {constituency.name} ({constituency.stateName})</option>
            </select>
          </div>

          {/* Quick Preset Buttons for AC 302-306 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-mono">Quick Preset:</span>
            {[302, 303, 304, 305, 306].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleLoadSample(num)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  selectedAcNo === num
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title={`Load official sample for AC ${num}`}
              >
                AC {num}
              </button>
            ))}
          </div>

          {hasExistingData && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset to 'Data Not Available'</span>
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('PASTE')}
            className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'PASTE'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Form 20 CSV
          </button>
          <button
            onClick={() => setActiveTab('UPLOAD')}
            className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'UPLOAD'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          {parseResult && parseResult.success && (
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PREVIEW'
                  ? 'border-amber-500 text-emerald-800 bg-white font-extrabold'
                  : 'border-transparent text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Geocoded Preview ({parseResult.booths.length} Booths)</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'PASTE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Paste your Form 20 tabular or CSV data below (supports comma, tab, or semicolon separated):</span>
                <span className="font-mono text-[11px] text-slate-400">{csvContent.length} chars</span>
              </div>
              <textarea
                rows={10}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder={`"AC No","Polling Station No","Polling Station Name & Location","Candidate 1","Candidate 2","NOTA","Total Valid"\n302,1,"Prathmik Vidyalaya Shohratgarh Nagar Ward 1 (Purab)",340,210,8,558\n302,2,"Kanya Purva Madhyamik Vidyalaya Barhni Bazar (North)",290,260,5,555`}
                className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleLoadSample(selectedAcNo)}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Insert Sample Form 20 CSV for AC {selectedAcNo}</span>
                </button>
                <button
                  type="button"
                  onClick={() => runParse(csvContent)}
                  disabled={!csvContent.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Parse & Geocode Booths</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'UPLOAD' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-amber-50/40 space-y-3"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Upload Form 20 CSV / Text File</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Click to browse or drag and drop your file (.csv, .tsv, .txt)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.tsv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="p-4 bg-slate-100 rounded-xl text-xs space-y-1 font-mono text-slate-700">
                <div className="font-bold text-slate-900">Automatic Geographical Intelligence:</div>
                <p className="text-slate-600">
                  The parser recognizes Hindi & English landmark tokens in polling booth names (e.g. <em>Shohratgarh Nagar, Barhni Bazar, Piprahwa Stupa, Naugarh Collectorate, Uska Mandi, Bansi Rapti, Khesraha, Itwa Khas, Biskohar, Domariyaganj, Hallaur, Bharatbhari</em>) and spatial qualifiers (<em>Purab, Paschim, Uttar, Dakshin, Ward, Nagar Panchayat</em>) to automatically calculate accurate spatial coordinates and sector divisions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'PREVIEW' && parseResult && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                parseResult.success 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}>
                {parseResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm">{parseResult.message}</div>
                  <div className="font-mono">
                    Total Polled Votes: {parseResult.totalVotesTallied.toLocaleString('en-IN')} &bull; Candidates Mapped: {parseResult.detectedCandidates.join(', ') || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Geographic Sectors Summary */}
              {parseResult.success && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    Geographical Placement Breakdown by Sector:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(parseResult.sectorsSummary).map(([sectorName, count]) => (
                      <div key={sectorName} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                        <div className="font-bold text-slate-900 truncate">{sectorName}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                          <span>{count} Polling Stations</span>
                          <span className="font-semibold text-amber-700">
                            {Math.round((Number(count) / parseResult.booths.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Parsed Booths Table */}
              {parseResult.success && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Sample Station Geocoding Preview:
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-56">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="p-2.5">PS #</th>
                          <th className="p-2.5">Station Name & Location</th>
                          <th className="p-2.5">Assigned Sector</th>
                          <th className="p-2.5">Zone</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5 text-right">Polled</th>
                          <th className="p-2.5 text-right">Lead</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {parseResult.booths.slice(0, 10).map((b) => (
                          <tr key={b.id} className="hover:bg-amber-50/50">
                            <td className="p-2.5 font-bold text-slate-900">#{b.number}</td>
                            <td className="p-2.5 text-slate-800 font-sans">{b.name}</td>
                            <td className="p-2.5 text-slate-600 font-sans truncate max-w-xs">{b.locationName}</td>
                            <td className="p-2.5 text-slate-500">{b.wardZone}</td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                b.boothType === 'URBAN' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {b.boothType}
                              </span>
                            </td>
                            <td className="p-2.5 text-right font-bold">{b.totalVotesPolled}</td>
                            <td className="p-2.5 text-right text-emerald-700 font-bold">+{b.winningMargin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="text-xs text-slate-500 font-mono">
            Targeting AC #{selectedAcNo}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {parseResult && parseResult.success && (
              <button
                onClick={handleCommit}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Commit & Update Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
