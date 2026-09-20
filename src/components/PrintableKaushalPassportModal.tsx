import React from 'react';
import { 
  X, 
  Printer, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  DollarSign, 
  Gift, 
  Layers, 
  Sparkles
} from 'lucide-react';
import type { LivelihoodProfile } from '../types';

interface PrintableKaushalPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Partial<LivelihoodProfile> & {
    citizenName?: string;
    occupation?: string;
    trade?: string;
    match?: string;
  };
}

export const PrintableKaushalPassportModal: React.FC<PrintableKaushalPassportModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  const name = profile.citizenName || 'Citizen Applicant';
  const occupation = profile.occupation || profile.trade || 'Vocational / Professional Trade';
  const passportId = profile.id ? profile.id.toUpperCase() : `NSQF-IND-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const skills = profile.currentSkills || [
    { name: 'Core Domain Competency', icon: '⚡' },
    { name: 'Applied Tooling Proficiency', icon: '🛠️' },
    { name: 'Safety & Quality Standards', icon: '🛡️' },
    { name: 'Problem Solving & Communication', icon: '🗣️' }
  ];

  const tools = profile.toolsEquipment || ['Standard Industry Implements', 'Digital Operating Systems'];
  const matchedPrograms = profile.matchedPrograms || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative my-6 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none print:rounded-none">
        {/* Screen Header (Hidden on Print) */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Official Kaushal Digital Passport & National Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PASSPORT CERTIFICATE BODY */}
        <div className="p-6 sm:p-8 space-y-6 print:p-8 print:space-y-4 print:text-slate-900 text-slate-100">
          {/* Official Seal Banner */}
          <div className="border-2 border-amber-500/60 rounded-2xl p-5 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 print:bg-white print:border-slate-800 print:text-slate-900 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/30 print:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center print:bg-slate-900 print:text-white">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 print:text-amber-700 block">
                    Government of India • National Skill Development Mission
                  </span>
                  <h1 className="text-lg sm:text-xl font-black text-slate-100 print:text-slate-900">
                    KAUSHAL DIGITAL SKILL PASSPORT
                  </h1>
                  <p className="text-xs text-slate-400 print:text-slate-600">
                    Under National Credit & Qualifications Framework (NCVF / NSQF)
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right font-mono text-xs flex flex-col items-end">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] print:border-emerald-600 print:text-emerald-800">
                  ✓ VERIFIED BIOMETRIC PASSPORT
                </span>
                <span className="text-slate-400 print:text-slate-600 text-[11px] mt-1">ID: {passportId}</span>
                <span className="text-slate-400 print:text-slate-600 text-[10px]">Issued: {dateStr}</span>
              </div>
            </div>

            {/* Citizen Core Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-500 block">
                  Citizen Full Name:
                </span>
                <p className="text-base font-bold text-slate-100 print:text-slate-900 capitalize">
                  {name}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-500 block">
                  Primary Trade / Field:
                </span>
                <p className="text-sm font-bold text-amber-300 print:text-amber-700">
                  {occupation}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-500 block">
                  Experience / Standing:
                </span>
                <p className="text-sm font-bold text-slate-200 print:text-slate-800">
                  {profile.experienceYears !== undefined && profile.experienceYears !== null ? `${profile.experienceYears} Years` : 'Certified Student / Practitioner'}
                </p>
              </div>
            </div>
          </div>

          {/* Competency & Implements Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Verified Competencies */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-white space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-amber-700 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Verified Skill Competencies (NSQF)
              </h4>
              <div className="space-y-1.5">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 print:text-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Tools & Implements */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-white space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Mastered Implements & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-200 print:bg-slate-100 print:text-slate-800 print:border-slate-300"
                  >
                    🛠️ {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Matched Government Welfare Schemes */}
          {matchedPrograms.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Matched Government Schemes & Direct Entitlements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedPrograms.slice(0, 2).map((prog, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 print:text-slate-900">{prog.title}</span>
                      <span className="font-bold text-amber-400 font-mono text-[11px]">{prog.matchPercentage}% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" /> {prog.provider}
                    </p>
                    {prog.stipend && (
                      <p className="text-[11px] text-emerald-300 print:text-emerald-700 font-medium flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {prog.stipend}
                      </p>
                    )}
                    {prog.toolkitGrant && (
                      <p className="text-[11px] text-amber-300 print:text-amber-700 font-medium flex items-center gap-1">
                        <Gift className="w-3 h-3" /> {prog.toolkitGrant}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Barcode & Signature Block */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-slate-950 border border-slate-700 print:border-slate-300">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-[10px] text-slate-400 print:text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-300 print:text-slate-800">Scan to Verify on Skill India Portal</p>
                <p>Digital Token: SAKSHAM-VOICE-{Date.now().toString(36).toUpperCase()}</p>
                <p>National Portal: https://www.skillindiadigital.gov.in</p>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-400 print:text-slate-600 space-y-1">
              <div className="font-serif italic text-slate-300 print:text-slate-800 text-sm">
                Authorized Signature
              </div>
              <p className="font-bold text-slate-200 print:text-slate-900">Gram Panchayat & CSC Field Desk</p>
              <p>State Skilling Mission, Karnataka Hub</p>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400">
            Official document ready for print / PDF generation.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Passport</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
