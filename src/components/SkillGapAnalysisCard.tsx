import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  TrendingUp 
} from 'lucide-react';
import type { SkillGapItem, SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface SkillGapAnalysisCardProps {
  skillGap: SkillGapItem;
  currentLanguage: SupportedLanguage;
}

export const SkillGapAnalysisCard: React.FC<SkillGapAnalysisCardProps> = ({
  skillGap,
  currentLanguage
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              {t.skillGapTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative Analysis: Current Competencies vs Upgraded Market Capability
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Identified Skill Roadmap
        </span>
      </div>

      {/* Target Capability Highlight */}
      <div className="my-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-800/80 to-emerald-500/10 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              {t.targetCapabilityLabel}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5">
              {skillGap.targetCapability}
            </h4>
          </div>
        </div>
        <span className="text-xs text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 self-start sm:self-auto">
          High Income Potential
        </span>
      </div>

      {/* 2-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Current Skills */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Existing Confirmed Skills
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Verified Base</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {skillGap.currentSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{skill.replace(/^✓\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Gap / Recommended Skills */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              {t.recommendedAdditionalSkills}
            </h4>
            <span className="text-[10px] font-mono text-amber-400 font-bold">Key Bridge</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {skillGap.gapSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-200 flex items-center gap-2"
              >
                <span className="text-amber-400">⚠️</span>
                <span>{skill.replace(/^⚠️\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
