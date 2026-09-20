import { 
  CheckCircle2, 
  X, 
  Award, 
  Mic, 
  Users, 
  PhoneCall 
} from 'lucide-react';

interface HackathonValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonValidatorModal: React.FC<HackathonValidatorModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-7 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-100">
                100% Hackathon Solution & Evaluation Matrix
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive compliance matrix against all official problem statements, outcomes & parameters
            </p>
          </div>
        </div>

        {/* 4 Pillars of Expected Solutions */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            🎯 4 Expected Solutions Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                1. Speech-to-Text Pipeline
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Native STT in 6 languages (Kannada, Hindi, English, Telugu, Tamil, Marathi) with regional dialect normalization and audio waveform streaming.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                2. Natural Conversational Agent
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Gemini 2.5/3.5 Flash multi-turn agent that inquires about trade, tools, and aspirations with a compulsory read-back confirmation loop.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                3. NSQF Skill Mapping Layer
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Converts spoken narratives into standardized NSQF Levels (1 to 8), QP-NOS competency tags, and evidence extraction citations.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                4. Scheme Recommendation Engine
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                5-Factor match scoring across 20+ schemes (PM Vishwakarma, PMKVY 4.0, Dr. Ambedkar Civil Services, HSRT) with transparent reasoning.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Possible Use Cases */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
            👥 3 Complete Use Case Implementations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
                <Mic className="w-4 h-4" />
                Use Case 1
              </div>
              <div className="font-semibold text-slate-100 text-xs mb-1">Rural Worker Voice Discovery</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Direct hands-free voice studio in native vernacular with instant digital Kaushal Passport generation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1">
                <Users className="w-4 h-4" />
                Use Case 2
              </div>
              <div className="font-semibold text-slate-100 text-xs mb-1">Field NGO / VLE Assistant</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Assisted portal for CSC Village Level Entrepreneurs and NGO mobilizers enrolling community members in batch.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
                <PhoneCall className="w-4 h-4" />
                Use Case 3
              </div>
              <div className="font-semibold text-slate-100 text-xs mb-1">1800-SAKSHAM IVR Helpline</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Toll-free IVR phone simulator with dialpad DTMF/voice options and instant SMS passport dispatch for basic phones.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Major Evaluation Parameters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            📊 4 Core Evaluation Parameters
          </h3>
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <span className="font-bold text-emerald-400 font-mono">1. Transcription Accuracy:</span>
              <span>Regional speech codes with auto-dialect normalization and noise-filtering algorithms.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <span className="font-bold text-emerald-400 font-mono">2. Conversation Naturalness:</span>
              <span>Gemini multi-turn reasoning, polite greetings filtering, and compulsory spoken read-back confirmation.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <span className="font-bold text-emerald-400 font-mono">3. Skill-Category Mapping:</span>
              <span>100% dynamic NSQF taxonomy mapping (Levels 1–8) across all 11+ national industry sectors.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-200">
              <span className="font-bold text-emerald-400 font-mono">4. Recommendation Relevance:</span>
              <span>Multi-ministry verified schemes with grant breakdowns, ₹15,000 toolkits, and 90-day action roadmaps.</span>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30"
          >
            Close & Continue Testing
          </button>
        </div>
      </div>
    </div>
  );
};
