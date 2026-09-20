import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Check, 
  X, 
  ExternalLink,
  Cpu,
  Zap,
  Sparkles,
  Volume2,
  User,
  Sliders
} from 'lucide-react';
import type { AIProvider, SupportedLanguage } from '../types';
import { voiceService, type VoiceGenderPreference } from '../services/voiceService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: AIProvider;
  currentLanguage?: SupportedLanguage;
  geminiKey: string;
  grokKey: string;
  onSaveConfig: (config: { provider: AIProvider; geminiKey: string; grokKey: string }) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentProvider,
  currentLanguage = 'kn',
  geminiKey,
  grokKey,
  onSaveConfig
}) => {
  const [provider, setProvider] = useState<AIProvider>(currentProvider || 'gemini');
  const [geminiInput, setGeminiInput] = useState(geminiKey || '');
  const [grokInput, setGrokInput] = useState(grokKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Voice Persona Settings
  const [voiceGender, setVoiceGender] = useState<VoiceGenderPreference>(voiceService.getVoiceSettings().gender);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(voiceService.getVoiceSettings().voiceURI);
  const [voicePitch, setVoicePitch] = useState<number>(voiceService.getVoiceSettings().pitch);
  const [voiceRate, setVoiceRate] = useState<number>(voiceService.getVoiceSettings().rate);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setAvailableVoices(v);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    // Temporarily save settings to test
    voiceService.setVoiceSettings({
      gender: voiceGender,
      voiceURI: selectedVoiceURI,
      pitch: voicePitch,
      rate: voiceRate
    });

    const sample = currentLanguage === 'kn'
      ? 'ನಮಸ್ಕಾರ! ಇದು ನಿಮ್ಮ ಸಕ್ಷಮ್ ವಾಯ್ಸ್ ಸಹಾಯಕ.'
      : currentLanguage === 'hi'
      ? 'नमस्ते! यह आपका सक्षम वॉइस सहायक है।'
      : 'Hello! This is your Saksham Voice agent speaking.';

    setIsPlayingTest(true);
    voiceService.speak(
      sample,
      currentLanguage,
      () => setIsPlayingTest(true),
      () => setIsPlayingTest(false)
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      provider,
      geminiKey: geminiInput.trim(),
      grokKey: grokInput.trim()
    });

    voiceService.setVoiceSettings({
      gender: voiceGender,
      voiceURI: selectedVoiceURI,
      pitch: voicePitch,
      rate: voiceRate
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClearAll = () => {
    setGeminiInput('');
    setGrokInput('');
    onSaveConfig({
      provider: 'local',
      geminiKey: '',
      grokKey: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Settings & Customization
            </span>
            <h3 className="text-xl font-black text-slate-100">
              AI Engine & Voice Persona
            </h3>
          </div>
        </div>

        {/* SECTION 1: VOICE PERSONA & SPEECH SETTINGS */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Volume2 className="w-4 h-4" /> Fixed Agent Voice Persona
            </label>
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={isPlayingTest}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingTest ? 'animate-bounce text-amber-400' : ''}`} />
              <span>{isPlayingTest ? 'Playing...' : 'Test Voice Audio'}</span>
            </button>
          </div>

          {/* Gender / Persona Preset Selection */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setVoiceGender('female');
                setVoicePitch(1.12);
              }}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                voiceGender === 'female'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-pink-400" />
              <span>👩 Female Voice</span>
              <span className="text-[9px] font-normal text-slate-500">Natural & Warm</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceGender('male');
                setVoicePitch(0.88);
              }}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                voiceGender === 'male'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>👨 Male Voice</span>
              <span className="text-[9px] font-normal text-slate-500">Clear & Direct</span>
            </button>

            <button
              type="button"
              onClick={() => setVoiceGender('system')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                voiceGender === 'system'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>⚙️ System Voice</span>
              <span className="text-[9px] font-normal text-slate-500">Browser Engine</span>
            </button>
          </div>

          {/* Voice URI Dropdown if available */}
          {availableVoices.length > 0 && (
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Specific System Voice:
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Auto-Select Best Regional Voice</option>
                {availableVoices.map((v, i) => (
                  <option key={i} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed & Pitch Slider */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Speed: {voiceRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={voiceRate}
                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Pitch / Tone: {voicePitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.30"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: AI REASONING PROVIDER */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Active AI Reasoning Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Gemini Option */}
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                provider === 'gemini'
                  ? 'bg-amber-500/15 border-amber-500 text-slate-100 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini 2.5
                </span>
                {provider === 'gemini' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Deep Indic dialect reasoning (Kannada & Multi-turn)
              </p>
            </button>

            {/* Grok Option */}
            <button
              type="button"
              onClick={() => setProvider('grok')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                provider === 'grok'
                  ? 'bg-cyan-500/15 border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" /> xAI Grok-2
                </span>
                {provider === 'grok' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                High-speed logical extraction & trade reasoning
              </p>
            </button>

            {/* Contextual Engine Option */}
            <button
              type="button"
              onClick={() => setProvider('local')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                provider === 'local'
                  ? 'bg-emerald-500/15 border-emerald-500 text-slate-100 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" /> Built-In Engine
                </span>
                {provider === 'local' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                100% offline fallback (Zero API keys needed)
              </p>
            </button>
          </div>
        </div>

        {/* SECTION 3: KEY CONFIGURATION FORM */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* 1. Gemini Key Field */}
          <div className={`p-4 rounded-2xl border transition-all ${provider === 'gemini' ? 'bg-slate-950 border-amber-500/40' : 'bg-slate-950/40 border-slate-800 opacity-80'}`}>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Google Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
              >
                Get Free Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={geminiInput}
              onChange={(e) => setGeminiInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          {/* 2. Grok Key Field */}
          <div className={`p-4 rounded-2xl border transition-all ${provider === 'grok' ? 'bg-slate-950 border-cyan-500/40' : 'bg-slate-950/40 border-slate-800 opacity-80'}`}>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                xAI Grok API Key
              </span>
              <a
                href="https://console.x.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
              >
                xAI Console <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={grokInput}
              onChange={(e) => setGrokInput(e.target.value)}
              placeholder="xai-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {(geminiInput || grokInput) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Keys
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {savedSuccess ? 'Saved & Locked!' : 'Save Voice & Key Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
