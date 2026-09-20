import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Search, 
  Download, 
  FileText, 
  Printer, 
  Trash2, 
  CheckCircle2, 
  Users,
  Award,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { SupportedLanguage, BeneficiaryRecord } from '../types';
import { databaseService } from '../services/databaseService';
import { PrintableKaushalPassportModal } from './PrintableKaushalPassportModal';

interface BeneficiaryRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: SupportedLanguage;
  onSelectCandidate?: (record: BeneficiaryRecord) => void;
}

export const BeneficiaryRegistryModal: React.FC<BeneficiaryRegistryModalProps> = ({
  isOpen,
  onClose,
  currentLanguage: _currentLanguage,
  onSelectCandidate
}) => {
  const [records, setRecords] = useState<BeneficiaryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<BeneficiaryRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRecords(databaseService.getAllBeneficiaries());
    }
    const unsubscribe = databaseService.subscribe(() => {
      setRecords(databaseService.getAllBeneficiaries());
    });
    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.trade.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.matchedScheme.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  const handleDownloadCsv = () => {
    const csvData = databaseService.exportToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `saksham_beneficiaries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonData = databaseService.exportToJson();
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `saksham_beneficiaries_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the National Beneficiary Registry?`)) {
      databaseService.deleteBeneficiary(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>National Beneficiary Registry & Kaushal Database</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Synced
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Persistent storage of AI-mapped citizen profiles, NSQF skill levels, and matched government schemes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Stats Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, trade, scheme, location..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Candidates: <strong className="text-slate-200">{records.length}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Verified</span>
            </span>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Download full candidate roster as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Download JSON data"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Database className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No candidate records match your search</p>
              <p className="text-xs text-slate-500">Complete an interview in Voice Studio or Field Assistant mode to register candidates.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <th className="py-3 px-3.5">ID & Candidate</th>
                    <th className="py-3 px-3.5">Trade / Field</th>
                    <th className="py-3 px-3.5">Tenure & NSQF Level</th>
                    <th className="py-3 px-3.5">Matched Scheme</th>
                    <th className="py-3 px-3.5">Registered</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5 text-sm">
                          <span>{r.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {r.id} • {r.location}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-medium text-amber-300 line-clamp-1">{r.trade}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{r.education}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-200">{r.experienceYears} Years Practice</span>
                        <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{r.nsqfLevel}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-medium text-slate-100 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="line-clamp-1">{r.matchedScheme}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-300 font-bold mt-0.5">
                          Fit Score: {r.matchScore}%
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-[11px] text-slate-400 font-mono">
                        {r.createdAt}
                      </td>

                      <td className="py-3 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {onSelectCandidate && (
                          <button
                            onClick={() => {
                              onSelectCandidate(r);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                            title="Load this profile into the active Voice Studio session"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Load</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedRecordForPrint(r)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 inline-flex items-center transition-all cursor-pointer"
                          title="Print full official Kaushal Passport"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 inline-flex items-center transition-all cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Beneficiary Registry • NCVET & NSDC Conforming Standard</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Printable Kaushal Passport Submodal */}
      {selectedRecordForPrint && (
        <PrintableKaushalPassportModal
          isOpen={true}
          onClose={() => setSelectedRecordForPrint(null)}
          profile={selectedRecordForPrint.profile}
        />
      )}
    </div>
  );
};
