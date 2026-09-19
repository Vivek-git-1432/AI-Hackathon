import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle, 
  Sparkles, 
  DollarSign, 
  Gift, 
  Landmark, 
  X
} from 'lucide-react';
import type { MatchedProgram, SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface ProgramRecommendationsProps {
  programs: MatchedProgram[];
  currentLanguage: SupportedLanguage;
}

export const ProgramRecommendations: React.FC<ProgramRecommendationsProps> = ({
  programs,
  currentLanguage
}) => {
  const [selectedWhyProgram, setSelectedWhyProgram] = useState<MatchedProgram | null>(null);
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Award className="w-5 h-5" />
            </span>
            {t.recommendationsTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.recommendationsSubtitle}
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {programs.length} Government Schemes Matched
        </span>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {programs.map((program) => {
          const isBest = program.rankBadge === 'BEST MATCH';
          const isSecond = program.rankBadge === 'SECOND OPTION';

          return (
            <div
              key={program.id}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border ${
                isBest
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/25 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : isSecond
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              {/* Decorative Rank Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isBest
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : isSecond
                    ? 'bg-slate-700 text-amber-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {program.rankBadge}
                </span>

                <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                  <span>{program.matchPercentage}%</span>
                  <span className="text-[10px] text-slate-400 font-normal uppercase">Match</span>
                </div>
              </div>

              {/* Title & Provider */}
              <div className="space-y-1 mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                  {program.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {program.provider}
                </p>
              </div>

              {/* Match Factors Progress Bar */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">{t.matchingFactorsTitle}</span>
                  <span className="text-amber-400 font-mono font-bold text-xs">
                    {program.matchPercentage}% Alignment
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBest ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-amber-500'
                    }`}
                    style={{ width: `${program.matchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Financial Support / Benefits */}
              <div className="space-y-1.5 mb-3 text-xs">
                {program.stipend && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{program.stipend}</span>
                  </div>
                )}
                {program.toolkitGrant && (
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <Gift className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{program.toolkitGrant}</span>
                  </div>
                )}
                {program.loanSupport && (
                  <div className="flex items-center gap-1.5 text-blue-300 font-medium">
                    <Landmark className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{program.loanSupport}</span>
                  </div>
                )}
              </div>

              {/* Skills Gained Tags */}
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.skillsGainedLabel}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {program.skillsGained.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2.5 border-t border-slate-800">
                <button
                  onClick={() => setSelectedWhyProgram(program)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {t.whyThisRecommendationBtn}
                </button>

                <a
                  href={program.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isBest
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {t.viewProgramBtn}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* "WHY THIS RECOMMENDATION?" Explainability Modal */}
      {selectedWhyProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-7 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedWhyProgram(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {t.whyModalTitle}
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  {selectedWhyProgram.title}
                </h3>
              </div>
            </div>

            {/* AI Reasoning Narrative */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Coordinator Agent Justification:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedWhyProgram.aiExplanation}
              </p>
            </div>

            {/* Key Alignment Points */}
            <div className="space-y-1.5 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Direct Alignment Reasons:
              </span>
              {selectedWhyProgram.whyMatched.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {/* Five Factor Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-800 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <span className="text-[9px] text-slate-400 block">Occupation</span>
                <span className="text-xs font-bold text-amber-400">
                  {selectedWhyProgram.matchFactors.occupationMatch}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <span className="text-[9px] text-slate-400 block">Skill Base</span>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedWhyProgram.matchFactors.skillMatch}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <span className="text-[9px] text-slate-400 block">Aspiration</span>
                <span className="text-xs font-bold text-blue-400">
                  {selectedWhyProgram.matchFactors.interestMatch}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <span className="text-[9px] text-slate-400 block">Eligibility</span>
                <span className="text-xs font-bold text-purple-400">
                  {selectedWhyProgram.matchFactors.eligibilityMatch}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-400 block">Location</span>
                <span className="text-xs font-bold text-teal-400">
                  {selectedWhyProgram.matchFactors.locationMatch}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
