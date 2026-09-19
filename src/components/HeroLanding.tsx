import React from 'react';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  ShieldCheck, 
  Award,
  Radio
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface HeroLandingProps {
  currentLanguage: SupportedLanguage;
  onStartVoice: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  currentLanguage,
  onStartVoice
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-5 sm:p-7 shadow-xl">
      {/* Decorative Glow Orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Government-Grade Access Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          National Livelihood & Skilling AI Mission
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>NSQF Level 1–8 Aligned</span>
        </div>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-snug whitespace-pre-line">
          {t.heroHeadline}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
          {t.heroSubheadline}
        </p>
      </div>

      {/* Audio Waveform and Start CTA */}
      <div className="mt-5 flex flex-col sm:flex-row items-center gap-4">
        {/* Pulsing Mic CTA Button */}
        <button
          onClick={onStartVoice}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 hover:scale-102 active:scale-98 transition-all duration-200 ring-2 ring-amber-500/20"
        >
          <div className="p-1 rounded-full bg-slate-950 text-amber-400">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <span>{t.startVoiceBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Animated Waveform Visualizer */}
        <div className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse mr-1.5" />
          {[10, 22, 14, 28, 16, 32, 18, 30, 14, 24, 12, 20].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 90}ms`
              }}
            />
          ))}
          <span className="text-xs text-slate-300 font-mono ml-2">Spoken Input Ready</span>
        </div>
      </div>

      {/* 3 Core Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs mb-1.5">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">{t.benefit1Title}</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">{t.benefit1Desc}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">{t.benefit2Title}</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">{t.benefit2Desc}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs mb-1.5">
            <Award className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">{t.benefit3Title}</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">{t.benefit3Desc}</p>
        </div>
      </div>
    </div>
  );
};
