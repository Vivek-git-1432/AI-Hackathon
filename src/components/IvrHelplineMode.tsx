import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  Mic, 
  MessageSquare, 
  Send, 
  Radio, 
  FileText 
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
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
  const [smsSent, setSmsSent] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

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

  const startCall = () => {
    setCallState('CALLING');
    setCallDuration(0);
    setIvrStep(1);
    setIvrLog([]);
    setSmsSent(false);

    setTimeout(() => {
      setCallState('CONNECTED');
      const welcome = 'Welcome to 1800-SAKSHAM Toll-Free National Skilling Helpline. Press 1 for Kannada, 2 for Hindi, 3 for English, 4 for Telugu, 5 for Tamil, 6 for Marathi, or simply speak your native language.';
      addLog('IVR', welcome);
      speakIvr(welcome, 'en');
    }, 1200);
  };

  const endCall = () => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
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
        promptText = 'ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮುಖ್ಯ ಕೆಲಸ ಅಥವಾ ಕೌಶಲ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ.';
      } else if (digit === '2') {
        selectedLang = 'hi';
        promptText = 'हिंदी भाषा चुनी गई है। कृपया अपने मुख्य काम या हुनर का नाम बोलकर बताएं।';
      } else if (digit === '3') {
        selectedLang = 'en';
        promptText = 'English selected. Please speak or state your primary trade or work experience.';
      } else if (digit === '4') {
        selectedLang = 'te';
        promptText = 'తెలుగు ఎంపిక చేయబడింది. దయచేసి మీ ప్రధాన పని లేదా నైపుణ్యాన్ని చెప్పండి.';
      } else if (digit === '5') {
        selectedLang = 'ta';
        promptText = 'தமிழ் தேர்ந்தெடுக்கப்பட்டது. உங்கள் முக்கிய வேலையை சொல்லவும்.';
      } else if (digit === '6') {
        selectedLang = 'mr';
        promptText = 'मराठी निवडली आहे. कृपया आपले मुख्य काम सांगा.';
      } else {
        selectedLang = 'kn';
        promptText = 'ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮುಖ್ಯ ಕೆಲಸವನ್ನು ಹೇಳಿ.';
      }

      onLanguageChange(selectedLang);
      setIvrStep(2);
      addLog('IVR', promptText);
      speakIvr(promptText, selectedLang);
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

      const chosenTrade = tradeMap[digit] || 'Engineering & Public Administration Aspirant';
      addLog('CALLER', `Selected Trade: ${chosenTrade}`);

      const confirmPrompt = `I registered your trade as ${chosenTrade}. Press 1 to confirm and receive your Kaushal Skill Passport and Government Scheme benefits via SMS, or Press 2 to change.`;
      setIvrStep(3);
      addLog('IVR', confirmPrompt);
      speakIvr(confirmPrompt, currentLanguage);
    } else if (ivrStep === 3) {
      if (digit === '1') {
        const finalPrompt = `Thank you! Your Kaushal Skill Profile is 100% verified. You are matched with Central Government Schemes including ₹15,000 grants and free training stipends. Details sent via SMS.`;
        addLog('IVR', finalPrompt);
        setSmsSent(true);
        speakIvr(finalPrompt, currentLanguage, () => {
          setTimeout(() => endCall(), 1500);
        });
      } else {
        setIvrStep(2);
        const retryPrompt = 'Please select your trade: Press 1 for Civil Services, 2 for Event Management, 3 for Software, 4 for Solar, 5 for Tailoring, 6 for Farming.';
        addLog('IVR', retryPrompt);
        speakIvr(retryPrompt, currentLanguage);
      }
    }
  };

  const handleSpeechInput = () => {
    voiceService.stopSpeaking();
    voiceService.startListening(
      currentLanguage,
      (text, isFinal) => {
        if (isFinal) {
          addLog('CALLER', `Spoken: "${text}"`);
          handleProcessSpokenIvr(text);
        }
      },
      (err) => console.warn('IVR speech err:', err),
      () => {}
    );
  };

  const handleProcessSpokenIvr = async (text: string) => {
    addLog('IVR', `Analyzing spoken input through Gemini Voice AI...`);
    const res = await agentPipeline.processUserInput(text, 'INTERVIEW_OCCUPATION', currentLanguage, []);
    
    addLog('IVR', res.spokenText);
    speakIvr(res.spokenText, currentLanguage, () => {
      setIvrStep(3);
    });
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
                Simulated Interactive Voice Response (IVR) Helpline for Non-Smartphone & Basic Feature Phone Users
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
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative flex flex-col items-center">
          {/* Phone Screen Notch */}
          <div className="w-24 h-4 bg-slate-950 rounded-full mb-4 border border-slate-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
          </div>

          {/* Call Status Display */}
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-center mb-5 relative">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
              National Skilling Gateway
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-purple-400 tracking-wider">
              1800-725-7426 (SAKSHAM)
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${callState === 'CONNECTED' ? 'bg-emerald-400 animate-ping' : callState === 'CALLING' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-semibold text-slate-300">
                {callState === 'IDLE' && 'Line Idle • Ready to Dial'}
                {callState === 'CALLING' && 'Connecting to Toll-Free Server...'}
                {callState === 'CONNECTED' && `Call in Progress • ${formatTime(callDuration)}`}
                {callState === 'COMPLETED' && 'Call Disconnected • SMS Dispatched'}
              </span>
            </div>
            {isSpeaking && (
              <div className="mt-2 text-[11px] font-medium text-amber-300 flex items-center justify-center gap-1.5 animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                IVR Voice Prompt Playing...
              </div>
            )}
          </div>

          {/* DTMF Dialpad Buttons */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-5">
            {[
              { num: '1', sub: 'KN / Civil' },
              { num: '2', sub: 'HI / Event' },
              { num: '3', sub: 'EN / Tech' },
              { num: '4', sub: 'TE / Solar' },
              { num: '5', sub: 'TA / Tailor' },
              { num: '6', sub: 'MR / Farm' },
              { num: '7', sub: 'PRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: 'Clear' },
              { num: '0', sub: 'Operator' },
              { num: '#', sub: 'Confirm' }
            ].map(({ num, sub }) => (
              <button
                key={num}
                disabled={callState !== 'CONNECTED'}
                onClick={() => handleKeypadPress(num)}
                className={`py-3 rounded-2xl border transition-all flex flex-col items-center justify-center ${
                  callState === 'CONNECTED'
                    ? 'bg-slate-800/90 border-slate-700 hover:bg-purple-900/40 hover:border-purple-500/50 text-slate-100 active:scale-95 cursor-pointer shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className="text-lg font-bold font-mono">{num}</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{sub}</span>
              </button>
            ))}
          </div>

          {/* Call Control Action Buttons */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            {callState === 'IDLE' || callState === 'COMPLETED' ? (
              <button
                onClick={startCall}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
              >
                <Phone className="w-4 h-4 fill-white" />
                Dial 1800-SAKSHAM
              </button>
            ) : (
              <>
                <button
                  onClick={handleSpeechInput}
                  className="py-3 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 flex items-center justify-center transition-all"
                  title="Speak into IVR Line"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={endCall}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-98"
                >
                  <PhoneOff className="w-4 h-4" />
                  Hang Up Call
                </button>
              </>
            )}
          </div>
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
              <div className="text-emerald-400 font-bold mb-1">
                Govt-Skill-SMS • SAKSHAM-ID: 8849-KN
              </div>
              "Namaskara! Your NSQF Kaushal Skill Passport is approved. You are eligible for Dr. Ambedkar Civil Services Free Coaching & PMKVY 4.0 (₹15,000 Toolkit + ₹4,000 Monthly Stipend). Click to download: https://saksham.gov.in/p/8849"
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Delivers digital credentials to basic feature phone callers
              </span>
              <button
                onClick={onOpenProfile}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
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
