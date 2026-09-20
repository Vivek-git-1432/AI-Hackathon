import React from 'react';
import { Mic, Globe, Users, BarChart3, Sparkles, Settings, PhoneCall, Award } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { I18N_DATA } from '../data/i18n';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeMode: 'voice' | 'field' | 'ivr' | 'dashboard';
  onSelectMode: (mode: 'voice' | 'field' | 'ivr' | 'dashboard') => void;
  onOpenSettings: () => void;
  onOpenValidator: () => void;
  hasApiKey: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeMode,
  onSelectMode,
  onOpenSettings,
  onOpenValidator,
  hasApiKey,
  isListening,
  isSpeaking
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-2.5 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 shadow-md shadow-emerald-500/20 flex-shrink-0">
            <Mic className="w-5 h-5 text-slate-950 font-bold" />
            {(isListening || isSpeaking) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                SAKSHAM VOICE
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-emerald-400" />
                Govt-Grade AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 3 Official Use Case Modes + Impact Dashboard */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            {/* Use Case 1: Voice Discovery */}
            <button
              onClick={() => onSelectMode('voice')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'voice'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Use Case 1: Rural Worker Voice Discovery"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Studio</span>
            </button>

            {/* Use Case 2: Field NGO / VLE */}
            <button
              onClick={() => onSelectMode('field')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'field'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Use Case 2: Field NGO / CSC VLE Assistant"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Field NGO</span>
              <span className="sm:hidden">NGO</span>
            </button>

            {/* Use Case 3: IVR Helpline */}
            <button
              onClick={() => onSelectMode('ivr')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'ivr'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
              title="Use Case 3: 1800-SAKSHAM IVR Toll-Free Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1800-IVR</span>
              <span className="sm:hidden">IVR</span>
            </button>

            {/* Impact Dashboard */}
            <button
              onClick={() => onSelectMode('dashboard')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Impact Metrics & Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Impact</span>
            </button>
          </div>

          {/* Hackathon 100% Evaluation Matrix Button */}
          <button
            onClick={onOpenValidator}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/50 shadow-sm"
            title="View 100% Solution & Evaluation Compliance Matrix"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">100% Solution Matrix</span>
            <span className="md:hidden">Matrix</span>
          </button>

          {/* AI Settings (API Key) Button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              hasApiKey
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800'
            }`}
            title="Configure AI Engine & API Keys"
          >
            {hasApiKey ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">AI Active</span>
              </>
            ) : (
              <>
                <Settings className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">AI Engine</span>
              </>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Select Language"
              className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
