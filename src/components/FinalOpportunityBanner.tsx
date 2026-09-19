import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Share2 
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface FinalOpportunityBannerProps {
  currentLanguage: SupportedLanguage;
  onRestartSession: () => void;
}

export const FinalOpportunityBanner: React.FC<FinalOpportunityBannerProps> = ({
  currentLanguage,
  onRestartSession
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Saksham Voice - My Kaushal Skill Passport',
        text: 'I mapped my skills and matched with PMKVY & PM Vishwakarma using Saksham Voice!',
        url: window.location.href
      }).catch(() => {});
    } else {
      alert('Link copied to clipboard! Share with your Gram Panchayat mobilizer.');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Headline & Subtitle */}
      <div className="space-y-2 max-w-2xl z-10 text-center md:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-950/15 text-slate-950 border border-slate-950/20">
          <Sparkles className="w-3.5 h-3.5" />
          Saksham Voice National Mission
        </span>
        <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
          {t.finalHeadline}
        </h2>
        <p className="text-sm font-medium text-slate-900/80">
          Your voice has the power to transform informal experience into recognized livelihood qualifications and government grants.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto">
        <button
          onClick={onRestartSession}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          {t.finalCta}
        </button>

        <button
          onClick={handleShare}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/30 hover:bg-white/40 text-slate-950 font-black text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all border border-white/40"
        >
          <Share2 className="w-4 h-4" />
          Share Passport
        </button>
      </div>
    </div>
  );
};
