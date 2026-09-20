import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  Mic, 
  MicOff,
  MessageSquare, 
  Send, 
  Radio, 
  FileText,
  Sparkles
} from 'lucide-react';
import type { SupportedLanguage, ConversationState, DialogueTurn, LivelihoodProfile } from '../types';
import { voiceService } from '../services/voiceService';
import { agentPipeline } from '../services/agentPipeline';

interface IvrHelplineModeProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenProfile: () => void;
}

export const IvrHelplineMode: React.FC<IvrHelplineModeProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenProfile
}) => {
  const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'CONNECTED' | 'COMPLETED'>('IDLE');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [ivrStep, setIvrStep] = useState<number>(1);
  const [ivrLog, setIvrLog] = useState<{ sender: 'IVR' | 'CALLER'; text: string; time: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcriptInterim, setTranscriptInterim] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [smsSent, setSmsSent] = useState<boolean>(false);
  
  // Dynamic Multi-Turn Conversation State
  const [ivrConversationState, setIvrConversationState] = useState<ConversationState>('INTERVIEW_OCCUPATION');
  const [ivrHistory, setIvrHistory] = useState<DialogueTurn[]>([]);
  const [ivrProfile, setIvrProfile] = useState<Partial<LivelihoodProfile> | null>(null);

  const timerRef = useRef<any>(null);
  const currentLanguageRef = useRef<SupportedLanguage>(currentLanguage);
  currentLanguageRef.current = currentLanguage;

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (callState === 'CONNECTED') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ivrLog, transcriptInterim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addLog = (sender: 'IVR' | 'CALLER', text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIvrLog(prev => [...prev, { sender, text, time }]);
  };

  const speakIvr = (text: string, lang: SupportedLanguage, callback?: () => void) => {
    voiceService.stopListening();
    setIsListening(false);
    setIsSpeaking(true);

    voiceService.speak(
      text,
      lang,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        if (callback) callback();
      }
    );
  };

  const startIvrListening = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(true);
    setTranscriptInterim('');

    const success = voiceService.startListening(
      currentLanguageRef.current,
      (text, isFinal) => {
        if (isFinal) {
          setIsListening(false);
          setTranscriptInterim('');
          if (text && text.trim().length > 0) {
            addLog('CALLER', `Voice Input: "${text.trim()}"`);
            handleProcessSpokenIvr(text.trim());
          }
        } else {
          setTranscriptInterim(text);
        }
      },
      (err) => {
        console.warn('IVR speech warning:', err);
        setIsListening(false);
        setTranscriptInterim('');
      },
      () => {
        setIsListening(false);
      }
    );

    if (!success) {
      setIsListening(false);
    }
  };

  const handleToggleMic = () => {
    if (callState !== 'CONNECTED') return;

    if (isListening) {
      const pending = transcriptInterim.trim();
      voiceService.stopListening();
      setIsListening(false);
      setTranscriptInterim('');
      if (pending.length > 0) {
        addLog('CALLER', `Voice Input: "${pending}"`);
        handleProcessSpokenIvr(pending);
      }
    } else {
      startIvrListening();
    }
  };

  const startCall = () => {
    setCallState('CALLING');
    setCallDuration(0);
    setIvrStep(1);
    setIvrLog([]);
    setSmsSent(false);
    setIvrConversationState('INTERVIEW_OCCUPATION');
    setIvrHistory([]);
    setIvrProfile(null);
    setTranscriptInterim('');

    setTimeout(() => {
      setCallState('CONNECTED');
      const welcome = 'Welcome to 1800-SAKSHAM Toll-Free National Skilling Helpline. Press 1 for Kannada, 2 for Hindi, 3 for English, 4 for Telugu, 5 for Tamil, 6 for Marathi, or simply speak your native language.';
      addLog('IVR', welcome);
      speakIvr(welcome, 'en', () => {
        setTimeout(() => {
          startIvrListening();
        }, 500);
      });
    }, 1200);
  };

  const endCall = () => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
    setIsSpeaking(false);
    setIsListening(false);
    setTranscriptInterim('');
    setCallState('COMPLETED');
    addLog('IVR', 'Call completed. Your Kaushal Skill Passport and Scheme Eligibility links have been dispatched via SMS to your registered mobile number.');
  };

  const handleKeypadPress = (digit: string) => {
    addLog('CALLER', `Pressed [${digit}] on Dialpad`);

    if (ivrStep === 1) {
      // Language Selection
      let selectedLang: SupportedLanguage = 'en';
      let promptText = '';

      if (digit === '1') {
        selectedLang = 'kn';
        promptText = 'ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮುಖ್ಯ ಕೆಲಸ, ಅಧ್ಯಯನ ಅಥವಾ ಕೌಶಲ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ.';
      } else if (digit === '2') {
        selectedLang = 'hi';
        promptText = 'हिंदी भाषा चुनी गई है। कृपया अपने मुख्य काम, पढ़ाई या हुनर का नाम बोलकर बताएं।';
      } else if (digit === '3') {
        selectedLang = 'en';
        promptText = 'English selected. Please speak or state your primary trade, studies, or work experience.';
      } else if (digit === '4') {
        selectedLang = 'te';
        promptText = 'తెలుగు ఎంపిక చేయబడింది. దయచేసి మీ ప్రధాన పని లేదా చదువును చెప్పండి.';
      } else if (digit === '5') {
        selectedLang = 'ta';
        promptText = 'தமிழ் தேர்ந்தெடுக்கப்பட்டது. உங்கள் முக்கிய வேலை அல்லது படிப்பை சொல்லவும்.';
      } else if (digit === '6') {
        selectedLang = 'mr';
        promptText = 'मराठी निवडली आहे. कृपया आपले मुख्य काम किंवा शिक्षण सांगा.';
      } else {
        selectedLang = 'kn';
        promptText = 'ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕೆಲಸ ಅಥವಾ ಅಧ್ಯಯನವನ್ನು ಹೇಳಿ.';
      }

      onLanguageChange(selectedLang);
      setIvrStep(2);
      addLog('IVR', promptText);
      speakIvr(promptText, selectedLang, () => {
        setTimeout(() => startIvrListening(), 500);
      });
    } else if (ivrStep === 2) {
      // Quick Trade Options
      const tradeMap: Record<string, string> = {
        '1': 'Civil Services Aspirant & Student',
        '2': 'Event Management & Hospitality Assistant',
        '3': 'Software Engineer & AI Developer',
        '4': 'Electrician & Solar Technician',
        '5': 'Tailor & Garment Artisan',
        '6': 'Organic Farmer & Agri-Tech'
      };

      const chosenTrade = tradeMap[digit] || 'Student / Higher Education & Professional Candidate';
      addLog('CALLER', `Selected Trade: ${chosenTrade}`);

      handleProcessSpokenIvr(chosenTrade);
    } else if (ivrStep === 3) {
      if (digit === '1' || digit === '#') {
        const finalPrompt = `Thank you! Your Kaushal Skill Profile is 100% verified. You are matched with Central Government Schemes including ₹15,000 toolkits and stipends. Details sent via SMS.`;
        addLog('IVR', finalPrompt);
        setSmsSent(true);
        speakIvr(finalPrompt, currentLanguage, () => {
          setTimeout(() => endCall(), 1500);
        });
      } else {
        setIvrStep(2);
        const retryPrompt = 'Please speak your trade or press 1 for Civil Services, 2 for Event Management, 3 for Software, 4 for Solar, 5 for Tailoring, 6 for Farming.';
        addLog('IVR', retryPrompt);
        speakIvr(retryPrompt, currentLanguage, () => {
          setTimeout(() => startIvrListening(), 500);
        });
      }
    }
  };

  const handleProcessSpokenIvr = async (text: string) => {
    if (!text.trim()) return;

    addLog('IVR', `Analyzing response through Saksham AI Engine...`);

    const userTurn: DialogueTurn = {
      id: `ivr-turn-${Date.now()}`,
      speaker: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [...ivrHistory, userTurn];
    setIvrHistory(updatedHistory);

    const res = await agentPipeline.processUserInput(
      text.trim(),
      ivrConversationState,
      currentLanguageRef.current,
      updatedHistory,
      ivrProfile || undefined
    );

    setIvrConversationState(res.nextState);
    if (res.updatedProfile) {
      setIvrProfile(res.updatedProfile);
    }

    const aiTurn: DialogueTurn = {
      id: `ivr-ai-${Date.now()}`,
      speaker: 'ai',
      text: res.spokenText,
      translation: res.englishTranslation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentNode: res.activeNodeId
    };
    setIvrHistory(prev => [...prev, aiTurn]);

    addLog('IVR', res.spokenText);

    if (res.nextState === 'RESULTS_VIEW' || res.updatedProfile?.isConfirmed) {
      setSmsSent(true);
      setIvrStep(3);
    } else if (res.isReadbackPrompt) {
      setIvrStep(3);
    }

    speakIvr(res.spokenText, currentLanguageRef.current, () => {
      // Hands-free continuous interaction: if call still active, listen for next response!
      if (res.nextState !== 'RESULTS_VIEW') {
        setTimeout(() => {
          startIvrListening();
        }, 600);
      }
    });
  };

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim() && callState === 'CONNECTED') {
      const text = typedInput.trim();
      setTypedInput('');
      addLog('CALLER', `Spoken/Typed: "${text}"`);
      handleProcessSpokenIvr(text);
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/70 border border-purple-800/50 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  1800-SAKSHAM • National IVR Skilling Helpline
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Toll-Free Voice Gateway
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Interactive Voice Response (IVR) Telephony for Non-Smartphone & Basic Feature Phone Citizens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-purple-500/30 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>VoIP / PSTN Line Ready</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column IVR Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Phone Simulator & Dialpad (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative flex flex-col items-center">
          {/* Phone Screen Notch */}
          <div className="w-24 h-4 bg-slate-950 rounded-full mb-4 border border-slate-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
          </div>

          {/* Call Status Display */}
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-center mb-4 relative">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
              National Skilling Gateway
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-purple-400 tracking-wider">
              1800-725-7426 (SAKSHAM)
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${callState === 'CONNECTED' ? 'bg-emerald-400 animate-ping' : callState === 'CALLING' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-semibold text-slate-300">
                {callState === 'IDLE' && 'Line Idle • Ready to Dial'}
                {callState === 'CALLING' && 'Connecting to Toll-Free Server...'}
                {callState === 'CONNECTED' && `Call in Progress • ${formatTime(callDuration)}`}
                {callState === 'COMPLETED' && 'Call Disconnected • SMS Dispatched'}
              </span>
            </div>

            {/* Speaking Status */}
            {isSpeaking && (
              <div className="mt-2 text-[11px] font-medium text-amber-300 flex items-center justify-center gap-1.5 animate-pulse bg-amber-500/10 py-1 px-2.5 rounded-lg border border-amber-500/20">
                <Volume2 className="w-3.5 h-3.5" />
                IVR Voice Prompt Playing...
              </div>
            )}

            {/* Live Mic Listening Status & Interim Speech */}
            {isListening && (
              <div className="mt-2 space-y-1 bg-red-950/40 border border-red-500/40 p-2 rounded-xl text-left animate-in zoom-in-95">
                <div className="flex items-center justify-between text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Caller Microphone Live
                  </span>
                  <span>Speak Clearly</span>
                </div>
                <p className="text-xs text-slate-100 italic">
                  {transcriptInterim ? `"${transcriptInterim}"` : 'Listening for your voice...'}
                </p>
                {transcriptInterim && (
                  <button
                    onClick={handleToggleMic}
                    className="w-full py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] mt-1 transition-colors cursor-pointer"
                  >
                    Done Speaking (Submit Now)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* DTMF Dialpad Buttons */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-4">
            {[
              { num: '1', sub: 'KN / Civil' },
              { num: '2', sub: 'HI / Event' },
              { num: '3', sub: 'EN / Tech' },
              { num: '4', sub: 'TE / Solar' },
              { num: '5', sub: 'TA / Tailor' },
              { num: '6', sub: 'MR / Farm' },
              { num: '7', sub: 'Student' },
              { num: '8', sub: 'Health' },
              { num: '9', sub: 'Placement' },
              { num: '*', sub: 'Clear' },
              { num: '0', sub: 'Agent' },
              { num: '#', sub: 'Confirm' }
            ].map(({ num, sub }) => (
              <button
                key={num}
                disabled={callState !== 'CONNECTED'}
                onClick={() => handleKeypadPress(num)}
                className={`py-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center ${
                  callState === 'CONNECTED'
                    ? 'bg-slate-800/90 border-slate-700 hover:bg-purple-900/40 hover:border-purple-500/50 text-slate-100 active:scale-95 cursor-pointer shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className="text-base font-bold font-mono">{num}</span>
                <span className="text-[8px] text-slate-400 font-mono tracking-tighter uppercase">{sub}</span>
              </button>
            ))}
          </div>

          {/* Call Control Action Buttons */}
          <div className="flex items-center gap-2.5 w-full max-w-xs">
            {callState === 'IDLE' || callState === 'COMPLETED' ? (
              <button
                onClick={startCall}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-white" />
                Dial 1800-SAKSHAM
              </button>
            ) : (
              <>
                <button
                  onClick={handleToggleMic}
                  className={`py-3 px-3.5 rounded-2xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold text-xs ${
                    isListening
                      ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-600/40'
                      : 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-md'
                  }`}
                  title={isListening ? 'Stop Listening & Send' : 'Speak into IVR Line'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? 'Stop Mic' : 'Speak'}</span>
                </button>
                <button
                  onClick={endCall}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all active:scale-98 cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  Hang Up
                </button>
              </>
            )}
          </div>

          {/* Fallback Inline Typed Input for Call Line */}
          {callState === 'CONNECTED' && (
            <form onSubmit={handleSendTyped} className="w-full max-w-xs mt-3.5 flex gap-1.5">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Or speak/type in call..."
                className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                title="Send to IVR line"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Live Telephony Log & SMS Dispatch (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live IVR Dialogue Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Live Telephony Audio & DTMF Transcript
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-purple-300 border border-slate-700">
                Auto-Transcription Active
              </span>
            </div>

            <div className="h-[280px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
              {ivrLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                  <Phone className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
                  <p className="text-xs">
                    Press <strong className="text-purple-300 font-bold">"Dial 1800-SAKSHAM"</strong> to simulate a rural citizen calling the national helpline.
                  </p>
                </div>
              ) : (
                ivrLog.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      entry.sender === 'IVR'
                        ? 'bg-purple-950/40 border border-purple-800/40 text-purple-200 mr-4'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-100 ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-mono text-[10px] text-slate-400">
                        {entry.sender === 'IVR' ? '🤖 1800-SAKSHAM VOICE PROMPT' : '📞 CALLER AUDIO / KEYPAD'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">{entry.time}</span>
                    </div>
                    <p className="font-medium">{entry.text}</p>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* SMS / WhatsApp Dispatch Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-200">
                  SMS / WhatsApp Instant Delivery Gateway
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${smsSent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
                {smsSent ? '✓ SMS Dispatched' : 'Pending Verification'}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 font-mono leading-relaxed mb-3">
              <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Govt-Skill-SMS • SAKSHAM-ID: {ivrProfile?.id || '8849-KN'}
              </div>
              {ivrProfile ? (
                `"Namaskara! Your NSQF Kaushal Skill Passport for ${ivrProfile.occupation || 'Candidate'} is verified. Eligible for ${ivrProfile.matchedPrograms?.[0]?.title || 'PMKVY 4.0 Skilling'} (${ivrProfile.matchedPrograms?.[0]?.toolkitGrant || '₹15,000 Toolset'} + ${ivrProfile.matchedPrograms?.[0]?.stipend || 'Stipend'}). View: https://saksham.gov.in/p/${Date.now().toString(36)}"`
              ) : (
                `"Namaskara! Your NSQF Kaushal Skill Passport is approved. You are eligible for Skill India Digital & PMKVY 4.0 (₹15,000 Toolkit + Monthly Stipend). Click to download: https://saksham.gov.in/p/8849"`
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Delivers digital credentials to basic feature phone callers
              </span>
              <button
                onClick={onOpenProfile}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                View Full Kaushal Passport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

