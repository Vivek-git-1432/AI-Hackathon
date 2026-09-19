import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Check, 
  X, 
  ExternalLink,
  Cpu,
  Zap,
  Sparkles,
  Bot
} from 'lucide-react';
import type { AIProvider } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: AIProvider;
  geminiKey: string;
  grokKey: string;
  onSaveConfig: (config: { provider: AIProvider; geminiKey: string; grokKey: string }) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentProvider,
  geminiKey,
  grokKey,
  onSaveConfig
}) => {
  const [provider, setProvider] = useState<AIProvider>(currentProvider || 'gemini');
  const [geminiInput, setGeminiInput] = useState(geminiKey || '');
  const [grokInput, setGrokInput] = useState(grokKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      provider,
      geminiKey: geminiInput.trim(),
      grokKey: grokInput.trim()
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
              Agentic AI Engine Settings
            </span>
            <h3 className="text-xl font-black text-slate-100">
              Multi-Model AI Configuration
            </h3>
          </div>
        </div>

        {/* Provider Selector Cards */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Select Active AI Reasoning Provider
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
                  <Sparkles className="w-3.5 h-3.5" /> Gemini 2.0
                </span>
                {provider === 'gemini' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Deep Indic dialect reasoning (Kannada default)
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

        {/* Key Configuration Form */}
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

          {/* Status Explanation Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-start gap-3">
            <Bot className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300">
              <div className="font-bold text-slate-100 mb-0.5">
                Execution Strategy:
              </div>
              {provider === 'gemini' && (
                <span className="text-amber-300">
                  {geminiInput.trim()
                    ? 'Using live Google Gemini 2.0 Flash for real-time multilingual voice comprehension.'
                    : 'Gemini key not entered: will automatically use the Built-in Contextual Engine without interruption.'}
                </span>
              )}
              {provider === 'grok' && (
                <span className="text-cyan-300">
                  {grokInput.trim()
                    ? 'Using live xAI Grok-2 for multi-agent reasoning and slot deduplication.'
                    : 'Grok key not entered: will automatically use the Built-in Contextual Engine without interruption.'}
                </span>
              )}
              {provider === 'local' && (
                <span className="text-emerald-300">
                  Using high-speed Built-in Contextual Neuro-Symbolic Agent Engine (no network latency or external keys).
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {(geminiInput || grokInput) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-colors"
              >
                Clear All Keys
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {savedSuccess ? 'Saved!' : 'Save & Activate'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
