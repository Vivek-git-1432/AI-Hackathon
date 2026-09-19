import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Send, 
  RotateCcw, 
  Radio,
  Headphones
} from 'lucide-react';
import type { SupportedLanguage, ConversationState, MicState, DialogueTurn } from '../types';
import { I18N_DATA } from '../data/i18n';

interface VoiceConversationHubProps {
  micState: MicState;
  conversationState: ConversationState;
  currentLanguage: SupportedLanguage;
  transcriptInterim: string;
  audioEnabled: boolean;
  autoListen: boolean;
  history: DialogueTurn[];
  onToggleMic: () => void;
  onSendMessage: (text: string) => void;
  onToggleAudio: () => void;
  onToggleAutoListen: () => void;
  onReplayAudio: (text: string) => void;
  onCorrectTurn?: (turn: DialogueTurn) => void;
  onResetSession: () => void;
}

export const VoiceConversationHub: React.FC<VoiceConversationHubProps> = ({
  micState,
  conversationState: _conversationState,
  currentLanguage,
  transcriptInterim,
  audioEnabled,
  autoListen,
  history: _history,
  onToggleMic,
  onSendMessage,
  onToggleAudio,
  onToggleAutoListen,
  onResetSession
}) => {
  const [inputText, setInputText] = useState('');
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const getMicStatusText = () => {
    switch (micState) {
      case 'LISTENING':
        return t.micListening;
      case 'PROCESSING':
        return t.micProcessing;
      case 'RESPONDING':
        return t.micResponding;
      default:
        return t.micIdle;
    }
  };

  const isMicActive = micState === 'LISTENING';
  const isSpeaking = micState === 'RESPONDING';

  const quickPrompts = [
    { label: '👨‍💻 AI Developer', text: 'I am an AI developer with 2 years experience building AI agents using Python and cloud tools.' },
    { label: '🌾 Precision Farmer', text: 'ನಾನು 5 ವರ್ಷಗಳಿಂದ ಟ್ರ್ಯಾಕ್ಟರ್ ಬಳಸಿ ಕೃಷಿ ಮಾಡುತ್ತಿದ್ದೇನೆ ಮತ್ತು ಡ್ರಿಪ್ ಆಟೊಮೇಷನ್ ಕಲಿಯಲು ಬಯಸುತ್ತೇನೆ.' },
    { label: '⚡ Solar Electrician', text: 'I am an electrician with 4 years experience in wiring and I want to learn solar installation.' },
    { label: '🧵 Master Tailor', text: 'I have 6 years tailoring experience using motorized sewing machines and want to learn CAD pattern design.' }
  ];

  return (
    <div className="w-full h-full min-h-[480px] glass-bento rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Glow Lights */}
      <div className={`absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-1000 ${
        isMicActive ? 'bg-amber-500 scale-125' : isSpeaking ? 'bg-emerald-500' : 'bg-indigo-600'
      }`} />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-cyan-500" />

      {/* Top Studio Controls */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80 z-10 gap-2">
        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isMicActive 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm animate-pulse' 
              : isSpeaking
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              : 'bg-slate-800/90 text-slate-300 border border-slate-700/80'
          }`}>
            <Radio className="w-3 h-3" />
            {getMicStatusText()}
          </span>

          {/* Hands-Free Auto-Listen Button */}
          <button
            onClick={onToggleAutoListen}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
              autoListen
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Automatically turn mic on after AI speaks"
          >
            <Headphones className="w-3 h-3 text-emerald-400" />
            <span>Hands-Free: {autoListen ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title={audioEnabled ? 'Mute spoken AI responses' : 'Unmute spoken AI responses'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
          </button>

          {/* Reset Conversation Button */}
          <button
            onClick={onResetSession}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title="Reset interview session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Center Interactive Orbital Microphone Core */}
      <div className="relative flex flex-col items-center my-auto py-2 z-10">
        {/* Animated Radiant Pulse Rings */}
        {isMicActive && (
          <>
            <span className="absolute inset-0 -m-4 rounded-full bg-amber-500/20 animate-ping duration-1000 pointer-events-none" />
            <span className="absolute inset-0 -m-8 rounded-full bg-amber-500/10 animate-pulse duration-1000 pointer-events-none" />
          </>
        )}

        {isSpeaking && (
          <span className="absolute inset-0 -m-4 rounded-full bg-emerald-500/20 animate-pulse duration-700 pointer-events-none" />
        )}

        {/* Main Microphone Action Sphere */}
        <button
          onClick={onToggleMic}
          aria-label={isMicActive ? 'Stop listening' : 'Start speaking'}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl focus:outline-none ${
            isMicActive
              ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 animate-orbital-pulse ring-6 ring-amber-500/25'
              : isSpeaking
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 ring-6 ring-emerald-500/25'
              : 'bg-gradient-to-tr from-slate-800 via-slate-800 to-slate-700 text-amber-400 hover:text-amber-300 hover:border-amber-500/50 border-2 border-slate-600 ring-6 ring-slate-800/40'
          }`}
        >
          <Mic className={`w-8 h-8 sm:w-10 sm:h-10 mb-0.5 ${isMicActive ? 'animate-bounce' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {isMicActive ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to Speak'}
          </span>
        </button>

        {/* Soundwave Frequency Visualizer */}
        <div className="flex items-center justify-center gap-1 mt-4 h-8 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isMicActive
                  ? 'bg-amber-400 animate-wave-bar'
                  : isSpeaking
                  ? 'bg-emerald-400 animate-wave-bar'
                  : 'bg-slate-700 h-1.5'
              }`}
              style={{
                animationDelay: `${(i % 5) * 0.12}s`,
                height: isMicActive || isSpeaking ? `${Math.max(6, ((i * 5) % 24) + 8)}px` : '4px'
              }}
            />
          ))}
        </div>

        {/* Interim Streaming Speech Transcript Indicator */}
        {transcriptInterim && (
          <div className="w-full max-w-sm mt-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium text-center animate-pulse shadow-sm">
            🎙️ Hearing: "{transcriptInterim}"
          </div>
        )}
      </div>

      {/* Bottom Controls: Prompts + Input */}
      <div className="w-full space-y-2.5 z-10 pt-2 border-t border-slate-800/60">
        {/* Instant 1-Click Persona Sample Chips */}
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            💡 Quick Test Prompts
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(p.text)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 hover:border-amber-500/40 transition-all hover:scale-102 shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Fallback Text Input Bar */}
        <form onSubmit={handleTextSubmit} className="w-full flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentLanguage === 'kn' ? 'ಅಥವಾ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...' :
              currentLanguage === 'hi' ? 'या अपना संदेश यहाँ टाइप करें...' :
              currentLanguage === 'te' ? 'లేదా మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...' :
              currentLanguage === 'ta' ? 'அல்லது உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...' :
              currentLanguage === 'mr' ? 'किंवा तुमचा संदेश येथे टाइप करा...' :
              'Or type your message here...'
            }
            className="flex-1 bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold transition-all shadow-sm disabled:shadow-none"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
