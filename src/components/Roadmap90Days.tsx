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
  steps?: RoadmapStep[];
  currentLanguage: SupportedLanguage;
}

export const Roadmap90Days: React.FC<Roadmap90DaysProps> = ({
  steps = [],
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

  // Safe fallback steps if steps array is empty or partial
  const fallbackSteps: RoadmapStep[] = [
    {
      weekRange: 'Days 1–30',
      title: 'Foundational Skilling & Portal Registration',
      description: 'Enroll in official government skill schemes, complete baseline assessment, and access foundational digital courseware.',
      milestone: 'Enrollment Confirmed & NSQF Baseline Verified',
      icon: '📝'
    },
    {
      weekRange: 'Days 31–60',
      title: 'Hands-on Specialization & Toolkit Mastery',
      description: 'Engage in intensive practical workshops, master specialized trade equipment, and bridge core competency gaps.',
      milestone: 'Skill Gap Competency Badge Earned',
      icon: '⚡'
    },
    {
      weekRange: 'Days 61–90',
      title: 'Government Certification & Placement / Grant Access',
      description: 'Complete capstone practical assessment, receive government-certified Kaushal credential, and link with placement drives or enterprise loans.',
      milestone: 'National Skill Certificate & Employment Linked',
      icon: '🏆'
    }
  ];

  const activeSteps = (steps && steps.length > 0) ? steps : fallbackSteps;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              {t.roadmapTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                Active Plan
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.roadmapSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={triggerCelebration}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Trophy className="w-4 h-4" />
          Celebrate Milestones
        </button>
      </div>

      {/* Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {activeSteps.map((rawStep: any, idx: number) => {
          const weekRange = rawStep.weekRange || rawStep.phase || rawStep.days || (idx === 0 ? 'Days 1–30' : idx === 1 ? 'Days 31–60' : 'Days 61–90');
          const title = rawStep.title || rawStep.heading || (idx === 0 ? 'Foundational Skilling & Registration' : idx === 1 ? 'Hands-on Specialization & Toolkit Mastery' : 'Government Certification & Placement');
          const description = rawStep.description || rawStep.action || rawStep.details || 'Engage in structured competency training aligned with NSQF national occupational standards.';
          const milestone = rawStep.milestone || rawStep.goal || 'Milestone Assessment Verified';
          const icon = rawStep.icon || (idx === 0 ? '📝' : idx === 1 ? '⚡' : '🏆');

          return (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 relative group transition-all duration-300 shadow-md"
            >
              {/* Top Indicator */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {weekRange}
                </span>
                <span className="text-xl">{icon}</span>
              </div>

              {/* Content */}
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {description}
                </p>
              </div>

              {/* Milestone Tag */}
              <div className="pt-2.5 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <Flag className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                <span className="truncate">{milestone}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
