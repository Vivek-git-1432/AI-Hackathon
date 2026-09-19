import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Volume2, 
  ShieldCheck,
  Edit2
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface ReadbackConfirmationModalProps {
  promptText: string;
  translation?: string;
  currentLanguage: SupportedLanguage;
  onConfirm: (isConfirmed: boolean) => void;
  onReplayAudio: () => void;
  onSendCorrection?: (correctionText: string) => void;
}

export const ReadbackConfirmationModal: React.FC<ReadbackConfirmationModalProps> = ({
  promptText,
  translation,
  currentLanguage,
  onConfirm,
  onReplayAudio,
  onSendCorrection
}) => {
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);
  const [customCorrection, setCustomCorrection] = useState('');
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  const handleNoClick = () => {
    setShowCorrectionInput(true);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCorrection.trim() && onSendCorrection) {
      onSendCorrection(customCorrection.trim());
      setShowCorrectionInput(false);
      setCustomCorrection('');
    } else {
      onConfirm(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-400 relative overflow-hidden">
      {/* Decorative pulse ring */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-300">
              {t.readbackHeader}
            </h3>
            <p className="text-xs text-slate-300">
              {t.readbackUnderstood}
            </p>
          </div>
        </div>

        <button
          onClick={onReplayAudio}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          title="Replay Spoken Summary"
        >
          <Volume2 className="w-4 h-4" />
          {t.replayBtn}
        </button>
      </div>

      {/* Spoken Text Callout Box */}
      <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 relative">
        <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
          "{promptText || t.readbackPromptText}"
        </p>
        {translation && currentLanguage !== 'en' && (
          <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800 italic">
            English Translation: {translation}
          </p>
        )}
      </div>

      {/* Action Buttons: YES / NO */}
      {!showCorrectionInput ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* YES Button */}
          <button
            onClick={() => onConfirm(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-98"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            {t.readbackYesBtn}
          </button>

          {/* NO Button */}
          <button
            onClick={handleNoClick}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
          >
            <X className="w-5 h-5" />
            {t.readbackNoBtn}
          </button>
        </div>
      ) : (
        /* Correction Input Form */
        <form onSubmit={handleCorrectionSubmit} className="pt-2 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Edit2 className="w-4 h-4" />
            {t.correctionTitle}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customCorrection}
              onChange={(e) => setCustomCorrection(e.target.value)}
              placeholder="e.g. Actually I have 7 years experience with solar pumps..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Submit
            </button>
          </div>
          <button
            type="button"
            onClick={() => onConfirm(false)}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Or let AI ask a clarifying question
          </button>
        </form>
      )}
    </div>
  );
};
