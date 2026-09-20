import React, { useState } from 'react';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  GraduationCap, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  Quote, 
  Target, 
  Cpu, 
  Terminal, 
  Database, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import type { LivelihoodProfile, SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';
import { parseToolTokens } from '../services/agentPipeline';

interface SkillProfileCardProps {
  profile: LivelihoodProfile;
  currentLanguage: SupportedLanguage;
}

export const SkillProfileCard: React.FC<SkillProfileCardProps> = ({
  profile,
  currentLanguage
}) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  const occLower = (profile.occupation || '').toLowerCase();
  const aspLower = (profile.targetAspiration || '').toLowerCase();
  const combined = `${occLower} ${aspLower}`;

  const isCivilServices = combined.includes('civil') || combined.includes('ias') || combined.includes('ips') || combined.includes('upsc') || combined.includes('kpsc') || combined.includes('public admin') || combined.includes('governance');
  const isEventHospitality = combined.includes('event') || combined.includes('cater') || combined.includes('hotel') || combined.includes('hospitality');
  const isTech = combined.includes('comput') || combined.includes('software') || combined.includes('engineer') || combined.includes('developer') || combined.includes('ai') || combined.includes('agent') || combined.includes('python');
  const isHealth = combined.includes('nurse') || combined.includes('health') || combined.includes('medical') || combined.includes('clinic') || combined.includes('hospital');
  const isElec = combined.includes('electr') || combined.includes('solar') || combined.includes('wireman');
  const isTailor = combined.includes('tailor') || combined.includes('stitch') || combined.includes('dress') || combined.includes('cloth');
  const isAuto = combined.includes('driver') || combined.includes('mechanic') || combined.includes('auto') || combined.includes('vehicle');
  const isAgri = combined.includes('farm') || combined.includes('crop') || combined.includes('tractor') || combined.includes('agri') || combined.includes('dairy');

  const sectorIcon = isCivilServices ? '🏛️' : isEventHospitality ? '🎪' : isTech ? '💻' : isHealth ? '🩺' : isElec ? '⚡' : isTailor ? '🧵' : isAuto ? '🚗' : isAgri ? '🌾' : '🎓';
  const sectorBadge = isCivilServices ? 'Civil Services & Public Administration' : isEventHospitality ? 'Tourism & Event Operations' : isTech ? 'IT & Artificial Intelligence' : isHealth ? 'Healthcare & Allied Medical' : isElec ? 'Renewable Energy & Power' : isTailor ? 'Apparel & Fashion Tech' : isAuto ? 'Automotive & Logistics' : isAgri ? 'Agriculture & Agri-Tech' : 'National Skilling & Enterprise';
  const nsqfLevel = isCivilServices ? 'Level 6-8' : isEventHospitality ? 'Level 4-6' : isTech ? 'Level 6-7' : isHealth ? 'Level 4-5' : isElec ? 'Level 4-5' : isTailor ? 'Level 3-4' : isAuto ? 'Level 4' : 'Level 3-5';

  const toolsList = parseToolTokens(profile.toolsEquipment);

  const getToolIcon = (toolName: string) => {
    const tl = toolName.toLowerCase();
    if (tl.includes('python') || tl.includes('code') || tl.includes('git')) return <Terminal className="w-3 h-3 text-cyan-400" />;
    if (tl.includes('ai') || tl.includes('learning') || tl.includes('agent')) return <Cpu className="w-3 h-3 text-amber-400" />;
    if (tl.includes('data') || tl.includes('sql') || tl.includes('cloud')) return <Database className="w-3 h-3 text-indigo-400" />;
    return <Layers className="w-3 h-3 text-blue-400" />;
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/40 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Government-grade Seal Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Banner with Digital Passport & Confidence Stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 flex-shrink-0">
            {sectorIcon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {t.profileTitle}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Verified Kaushal Passport
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                {sectorBadge} • {nsqfLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              National Skills Qualifications Framework (NSQF) Aligned Livelihood Profile
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-800/80 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-sm">
          <div className="text-right">
            <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
              {t.confidenceLabel}
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              {profile.mappingConfidence}% Confidence
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Profile Overview Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 relative z-10">
        {/* Core Attributes */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {t.occupationLabel}
            </span>
            <span className="text-sm font-bold text-slate-100 mt-0.5 block">
              {profile.occupation}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-700/50">
            <div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {t.experienceLabel}
              </span>
              <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                {profile.experienceYears} Years
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-400" />
                {t.educationLabel}
              </span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5 block leading-tight">
                {profile.education}
              </span>
            </div>
          </div>
        </div>

        {/* Current Extracted Skills */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            {t.currentSkillsLabel}
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.currentSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xs"
              >
                <span>{skill.icon}</span>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tools & Equipment Handled */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            Tools & Equipment Handled
          </span>
          <div className="flex flex-wrap gap-1 pt-0.5 max-h-32 overflow-y-auto pr-1">
            {toolsList.map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
              >
                {getToolIcon(tool)}
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured NSQF Categories */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs mr-1">
            <Target className="w-3.5 h-3.5" />
            <span>{t.categoriesLabel}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.structuredCategories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Evidence Toggle Button */}
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="self-start sm:self-auto text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20"
        >
          {t.evidenceBreakdownTitle}
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Evidence Breakdown Table */}
      {showEvidence && (
        <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in duration-300 relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            Transparent Multilingual Grounding Proof & Evidence Mapping
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3.5">Citizen Spoken Input</th>
                  <th className="py-2.5 px-3.5">Extracted Competency</th>
                  <th className="py-2.5 px-3.5">NSQF Aligned Category</th>
                  <th className="py-2.5 px-3.5 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {profile.evidences.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono text-slate-300 italic">
                      "{ev.userQuote}"
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      {ev.extractedSkill}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-300 font-mono text-[11px]">
                      {ev.structuredCategory}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-amber-400">
                      {ev.confidenceScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
