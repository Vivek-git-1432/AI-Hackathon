import React from 'react';
import { 
  Calendar, 
  Flag, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RoadmapStep, SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface Roadmap90DaysProps {
  steps: RoadmapStep[];
  currentLanguage: SupportedLanguage;
}

export const Roadmap90Days: React.FC<Roadmap90DaysProps> = ({
  steps,
  currentLanguage
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
              {t.roadmapTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.roadmapSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={triggerCelebration}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Celebrate Milestones
        </button>
      </div>

      {/* Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative group hover:border-amber-500/50 transition-all duration-300"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {step.weekRange}
              </span>
              <span className="text-2xl">{step.icon}</span>
            </div>

            {/* Content */}
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-bold text-slate-100 leading-snug">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Milestone Tag */}
            <div className="pt-3 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <Flag className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{step.milestone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
