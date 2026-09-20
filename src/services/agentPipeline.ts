import { GoogleGenAI } from '@google/genai';
import type {
  SupportedLanguage,
  AIProvider,
  AgentNode,
  AgentNodeId,
  ConversationState,
  DialogueTurn,
  LivelihoodProfile,
  SkillEvidence,
  SkillGapItem,
  AgentReasoningStep
} from '../types';
import { getMatchedProgramsForProfile, DEFAULT_90_DAY_ROADMAP } from '../data/programsData';
import { databaseService } from './databaseService';

export const INITIAL_AGENT_NODES: AgentNode[] = [
  { id: 'voice_agent', name: 'Voice & Intake Agent', icon: '🎙️', role: 'Captures multilingual audio & candidate identity', status: 'completed' },
  { id: 'understanding_agent', name: 'Speech Understanding Agent', icon: '📝', role: 'Semantic parsing, filtering & dialect normalization', status: 'pending' },
  { id: 'profile_agent', name: 'Livelihood Profile Agent', icon: '👤', role: 'Constructs structured persona, years, tools & trade context', status: 'pending' },
  { id: 'skill_mapping_agent', name: 'Skill Mapping Agent', icon: '🧠', role: 'Maps informal evidence to NSQF category levels', status: 'pending' },
  { id: 'confirmation_agent', name: 'Confirmation Agent', icon: '✅', role: 'Formulates spoken read-back verification loop', status: 'pending' },
  { id: 'skill_gap_agent', name: 'Skill-Gap Agent', icon: '📚', role: 'Analyzes capability gaps vs aspirational market targets', status: 'pending' },
  { id: 'program_matching_agent', name: 'Program Matching Agent', icon: '🎯', role: 'Ranks government schemes & computes 5-factor match score', status: 'pending' },
  { id: 'coordinator_agent', name: 'Coordinator Agent', icon: '🤖', role: 'Synthesizes 90-day roadmap and Kaushal Passport', status: 'pending' }
];

export interface CitizenSlots {
  citizenName: string | null;
  location: string | null;
  education: string | null;
  occupation: string | null;
  experienceYears: number | null;
  toolsEquipment: string | null;
  aspiration: string | null;
}

export interface AgentPipelineResponse {
  spokenText: string;
  englishTranslation?: string;
  nextState: ConversationState;
  activeNodeId: AgentNodeId;
  updatedProfile?: LivelihoodProfile;
  isReadbackPrompt?: boolean;
  reasoningStep?: AgentReasoningStep;
}

export function parseToolTokens(toolsInput: string | string[]): string[] {
  if (!toolsInput) return ['Standard Professional Tools'];
  const text = Array.isArray(toolsInput) ? toolsInput.join(' ') : toolsInput;

  const known = [
    // Tech & Computing
    'Generative AI', 'Machine Learning', 'AI Agents', 'VS Code', 'GitHub', 'Python', 'Git',
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Docker', 'Kubernetes', 'Cloud', 'PostgreSQL',
    'React', 'Node.js', 'PyTorch', 'TensorFlow', 'Computer Systems',
    // Civil Services & Administration
    'UPSC Study Materials', 'Government Portals', 'Legal Reference Docs', 'Office Productivity Suite',
    // Event & Management
    'Event Scheduling Tools', 'Catering Kitchenware', 'Sound & Stage Systems', 'Vendor Coordination Log',
    // Healthcare
    'Diagnostic Kits', 'BP Monitor', 'Pulse Oximeter', 'First Aid Station', 'EHR System',
    // Electrical & Solar
    'Multimeter', 'MCB Box', 'Wire Stripper', 'Drill Machine', 'Solar PV Array', 'Earthing Kit',
    // Tailoring
    'Motorized Sewing Machine', 'Overlock Machine', 'Pattern Cutter', 'CAD Software',
    // Automotive
    'Mechanical Toolkit', 'OBD Scanner', 'Hydraulic Jack', 'Spanner Set',
    // Agriculture (only if explicitly agricultural)
    'Tractor', 'Drip Irrigation', 'Solar Pump', 'Sprayer', 'Soil Sensor', 'Plough'
  ];

  const matched: string[] = [];
  let remaining = text;

  for (const k of known) {
    if (remaining.toLowerCase().includes(k.toLowerCase())) {
      matched.push(k);
      remaining = remaining.replace(new RegExp(k, 'gi'), ' ');
    }
  }

  const extra = remaining
    .split(/[,;|\n/]+/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && !matched.some(m => m.toLowerCase() === s.toLowerCase()));

  const result = [...matched, ...extra];
  return result.length > 0 ? result : [text.trim()];
}

export function sanitizeOfficialPortalUrl(url?: string, programTitle?: string): string {
  if (!url || typeof url !== 'string') return 'https://www.skillindiadigital.gov.in';
  const u = url.toLowerCase().trim();
  const t = (programTitle || '').toLowerCase();
  
  if (u.includes('futureskills') || t.includes('futureskills') || t.includes('artificial intelligence') || t.includes('software') || t.includes('ai & machine')) {
    return 'https://futureskillsprime.in';
  }
  if (u.includes('socialjustice') || t.includes('ambedkar') || t.includes('civil services') || t.includes('upsc') || t.includes('ias')) {
    return 'https://socialjustice.gov.in';
  }
  if (u.includes('ncs.gov.in') || t.includes('national career service')) {
    return 'https://www.ncs.gov.in';
  }
  if (u.includes('igotkarmayogi') || t.includes('karmayogi')) {
    return 'https://igotkarmayogi.gov.in';
  }
  if (u.includes('pmvishwakarma') || t.includes('vishwakarma') || t.includes('artisan') || t.includes('darzi')) {
    return 'https://pmvishwakarma.gov.in';
  }
  if (u.includes('pmsuryaghar') || t.includes('surya') || t.includes('solar') || t.includes('green job')) {
    return 'https://pmsuryaghar.gov.in';
  }
  if (u.includes('tourism') || t.includes('hunar se rozgar') || t.includes('hsrt') || t.includes('hospitality')) {
    return 'https://tourism.gov.in';
  }
  if (u.includes('samarth') || t.includes('samarth') || t.includes('textile')) {
    return 'https://samarth-textiles.gov.in';
  }
  if (u.includes('nielit') || t.includes('nielit')) {
    return 'https://www.nielit.gov.in';
  }
  if (u.includes('apprenticeship') || t.includes('naps')) {
    return 'https://www.apprenticeshipindia.gov.in';
  }
  if (u.includes('nhm') || t.includes('health') || t.includes('paramedic')) {
    return 'https://nhm.gov.in';
  }
  if (u.includes('abdm') || t.includes('ayushman')) {
    return 'https://abdm.gov.in';
  }
  if (u.includes('pmkvy') || t.includes('pmkvy') || t.includes('skill india') || t.includes('nsdc')) {
    return 'https://www.pmkvyofficial.org';
  }
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return url;
  }
  return 'https://www.skillindiadigital.gov.in';
}

export class AgentPipelineService {
  private activeProvider: AIProvider = 'gemini';
  private geminiKey: string = '';
  private grokKey: string = '';
  private openAiKey: string = '';

  private slots: CitizenSlots = {
    citizenName: null,
    location: null,
    education: null,
    occupation: null,
    experienceYears: null,
    toolsEquipment: null,
    aspiration: null
  };

  public setCitizenName(name: string) {
    const cleaned = this.cleanExtractedName(name);
    this.slots.citizenName = cleaned || name.trim();
  }

  public cleanExtractedName(rawName: string): string | null {
    if (!rawName) return null;
    let text = rawName.trim();
    // Strip trailing or leading punctuation
    text = text.replace(/^[^\w\u0C80-\u0CFF\u0900-\u097F]+|[^\w\u0C80-\u0CFF\u0900-\u097F]+$/g, '');

    const tokens = text
      .replace(/[,.:;!?'"()]+/g, ' ')
      .split(/\s+/)
      .map(w => w.trim())
      .filter(Boolean);

    const blacklist = new Set([
      'self', 'myself', 'i', 'am', 'im', 'a', 'an', 'the', 'is', 'are', 'was', 'were', 'here',
      'student', 'farmer', 'engineer', 'tailor', 'worker', 'doing', 'working', 'studying',
      'ready', 'yes', 'no', 'saksham', 'voice', 'sir', 'madam', 'assist', 'assistant', 'there',
      'who', 'what', 'where', 'how', 'when', 'good', 'morning', 'afternoon', 'evening', 'night',
      'from', 'in', 'at', 'city', 'district', 'state', 'village', 'town', 'college', 'school',
      'mr', 'mrs', 'ms', 'dr', 'shri', 'smt',
      'ನಮಸ್ಕಾರ', 'ಶುಭೋದಯ', 'ನಾನು', 'ಹೆಸರು', 'ವಿದ್ಯಾರ್ಥಿ', 'ಕೆಲಸ', 'ಇದ್ದೇನೆ', 'ಆಗಿದ್ದೇನೆ', 'ಇವರು',
      'नमस्ते', 'शुभ', 'नाम', 'छात्र', 'काम', 'है', 'हूँ', 'हुँ'
    ]);

    const validTokens = tokens.filter(tok => !blacklist.has(tok.toLowerCase()));
    if (validTokens.length === 0) return null;

    return validTokens
      .map(tok => tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase())
      .join(' ');
  }

  public getCitizenName(): string | null {
    return this.slots.citizenName;
  }

  public setLocation(loc: string) {
    this.slots.location = loc.trim();
  }

  public getLocation(): string | null {
    return this.slots.location;
  }

  public setEducation(edu: string) {
    this.slots.education = edu.trim();
  }

  public getEducation(): string | null {
    return this.slots.education;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.geminiKey = localStorage.getItem('saksham_gemini_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      this.grokKey = localStorage.getItem('saksham_grok_key') || (import.meta as any).env?.VITE_GROK_API_KEY || '';
      this.openAiKey = localStorage.getItem('saksham_openai_key') || (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
      this.activeProvider = (localStorage.getItem('saksham_provider') as AIProvider) || 'gemini';
    }
  }

  public setProvider(provider: AIProvider) {
    this.activeProvider = provider;
    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_provider', provider);
    }
  }

  public getProvider(): AIProvider {
    return this.activeProvider;
  }

  public setApiKey(key: string) {
    this.geminiKey = key.trim();
    if (typeof window !== 'undefined') localStorage.setItem('saksham_gemini_key', this.geminiKey);
  }

  public getApiKey(): string {
    return this.geminiKey || this.grokKey || this.openAiKey || '';
  }

  public setApiKeys(keys: { gemini?: string; grok?: string; openai?: string }) {
    if (keys.gemini !== undefined) {
      this.geminiKey = keys.gemini.trim();
      if (typeof window !== 'undefined') localStorage.setItem('saksham_gemini_key', this.geminiKey);
    }
    if (keys.grok !== undefined) {
      this.grokKey = keys.grok.trim();
      if (typeof window !== 'undefined') localStorage.setItem('saksham_grok_key', this.grokKey);
    }
    if (keys.openai !== undefined) {
      this.openAiKey = keys.openai.trim();
      if (typeof window !== 'undefined') localStorage.setItem('saksham_openai_key', this.openAiKey);
    }
  }

  public getApiKeys() {
    return {
      gemini: this.geminiKey,
      grok: this.grokKey,
      openai: this.openAiKey
    };
  }

  public resetInterview(preserveName: boolean = false) {
    const prevName = preserveName ? this.slots.citizenName : null;
    this.slots = {
      citizenName: prevName,
      location: null,
      education: null,
      occupation: null,
      experienceYears: null,
      toolsEquipment: null,
      aspiration: null
    };
  }

  public getInitialGreeting(lang: SupportedLanguage, nameOverride?: string | null): DialogueTurn {
    const cName = nameOverride || this.slots.citizenName;
    let text = '';
    let translation = '';

    if (cName) {
      switch (lang) {
        case 'kn':
          text = `ನಮಸ್ಕಾರ ${cName}! ಸಕ್ಷಮ್ ವಾಯ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕೌಶಲ್ಯ ಮತ್ತು ಆಕಾಂಕ್ಷೆಗಳಿಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಒದಗಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ, ವೃತ್ತಿ ಅಥವಾ ಅಧ್ಯಯನ ಮಾಡುತ್ತಿದ್ದೀರಿ?`;
          translation = `Namaste ${cName}! Welcome to Saksham Voice. Tell me about the work, trade, or studies you currently do so I can discover government skilling schemes for you.`;
          break;
        case 'hi':
          text = `नमस्ते ${cName}! सक्षम वॉइस में आपका स्वागत है। आपकी आजीविका और कौशल के अनुसार सर्वश्रेष्ठ सरकारी योजनाएं खोजने के लिए, आप वर्तमान में क्या काम या पढ़ाई करते हैं?`;
          translation = `Namaste ${cName}! Welcome to Saksham Voice. What work, trade, or studies are you currently doing?`;
          break;
        case 'te':
          text = `నమస్కారం ${cName}! సక్షమ్ వాయిస్‌కు స్వాగతం. మీ నైపుణ్యాలు మరియు పని ఆధారంగా ఉత్తమ ప్రభుత్వ పథకాలను కనుగొనడానికి, మీరు ప్రస్తుతం ఏ పని చేస్తున్నారు?`;
          translation = `Namaste ${cName}! Welcome to Saksham Voice. What work or studies do you currently do?`;
          break;
        case 'ta':
          text = `வணக்கம் ${cName}! சக்ஷம் வாய்ஸுக்கு வரவேற்கிறோம். உங்கள் வேலை மற்றும் திறன்களின் அடிப்படையில் சிறந்த அரசு திட்டங்களை கண்டறிய, தற்போது நீங்கள் என்ன செய்கிறீர்கள்?`;
          translation = `Namaste ${cName}! Welcome to Saksham Voice. What work or studies do you currently do?`;
          break;
        case 'mr':
          text = `नमस्कार ${cName}! सक्षम व्हॉईसमध्ये आपले स्वागत आहे. आपल्या कौशल्य आणि अभ्यासाच्या आधारे सर्वोत्तम सरकारी योजना शोधण्यासाठी, आपण सध्या कोणते काम करता?`;
          translation = `Namaste ${cName}! Welcome to Saksham Voice. What work or studies do you currently do?`;
          break;
        default:
          text = `Namaste ${cName} and Welcome to Saksham Voice! Tell me about the work, trade, or studies you currently do so I can discover the best government skilling programs for you.`;
          translation = `Namaste ${cName} and Welcome to Saksham Voice! Tell me about the work, trade, or studies you currently do so I can discover the best government skilling programs for you.`;
      }
    } else {
      switch (lang) {
        case 'kn':
          text = 'ನಮಸ್ಕಾರ! ಸಕ್ಷಮ್ ವಾಯ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಾನು ಭಾರತ ಸರ್ಕಾರದ ಕೌಶಲ್ಯ ಮತ್ತು ಆಜೀವಿಕಾ ಯೋಜನೆಗಳ ನಿಮ್ಮ AI ಮಾರ್ಗದರ್ಶಿ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ನೀವು ಯಾವ ಊರಿನವರು ಎಂದು ತಿಳಿಸುವಿರಾ?';
          translation = 'Namaste and Welcome to Saksham Voice! I am your personal AI skilling & livelihood counselor. May I please know your name and which city or district you are from?';
          break;
        case 'hi':
          text = 'नमस्ते! सक्षम वॉइस में आपका स्वागत है। मैं आपका व्यक्तिगत AI कौशल व आजीविका सलाहकार हूँ। कृपया अपना नाम और शहर बताएं?';
          translation = 'Namaste and Welcome to Saksham Voice! I am your personal AI skilling & livelihood counselor. May I please know your name and city?';
          break;
        case 'te':
          text = 'నమస్కారం! సక్షమ్ వాయిస్‌కు స్వాగతం. మీ నైపుణ్యాల ఆధారంగా ప్రభుత్వ పథకాలను అందించే మీ AI గైడ్ నేను. దయచేసి మీ పేరు మరియు మీరు ఏ ఊరి వారో చెబుతారా?';
          translation = 'Namaste and Welcome to Saksham Voice! May I please know your name and city?';
          break;
        case 'ta':
          text = 'வணக்கம்! சக்ஷம் வாய்ஸுக்கு வரவேற்கிறோம். நான் உங்கள் தனிப்பட்ட AI வழிகாட்டி. தயவுசெய்து உங்கள் பெயர் மற்றும் உங்கள் ஊர் என்னவென்று கூறுங்கள்?';
          translation = 'Namaste and Welcome to Saksham Voice! May I please know your name and location?';
          break;
        case 'mr':
          text = 'नमस्कार! सक्षम व्हॉईसमध्ये आपले स्वागत आहे. मी आपला वैयक्तिक AI कौशल्य सल्लागार आहे. कृपया आपले नाव आणि गाव/शहर सांगा?';
          translation = 'Namaste and Welcome to Saksham Voice! Please tell me your name and city/district?';
          break;
        default:
          text = 'Namaste and Welcome to Saksham Voice! I am your personal AI livelihood & skilling counselor. May I please know your name and which city or district you are from?';
          translation = 'Namaste and Welcome to Saksham Voice! I am your personal AI livelihood & skilling counselor. May I please know your name and which city or district you are from?';
      }
    }

    return {
      id: `turn-init-${Date.now()}`,
      speaker: 'ai',
      text,
      translation,
      audioText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentNode: 'voice_agent',
      reasoningStep: {
        step: 'Agent Initial Handshake',
        observation: cName ? `Citizen session initiated for "${cName}" in locale: "${lang}"` : `Citizen session initiated in locale: "${lang}"`,
        deduplicationCheck: 'All 4 skill slots initialized',
        decision: cName ? `Greet ${cName} warmly by name and inquire about trade/studies` : 'Greet warmly and inquire about primary occupation',
        confidence: 99
      }
    };
  }

  public async processUserInput(
    userInput: string,
    currentState: ConversationState,
    lang: SupportedLanguage,
    history: DialogueTurn[],
    existingProfile?: Partial<LivelihoodProfile>
  ): Promise<AgentPipelineResponse> {
    const textTrimmed = userInput.trim();
    const textLower = textTrimmed.toLowerCase();

    // Check if user stated their name in natural speech
    const detectedName = this.detectName(textTrimmed);
    if (detectedName && !this.slots.citizenName) {
      this.slots.citizenName = this.cleanExtractedName(detectedName) || detectedName;
    }

    // 0. Session Reset / "Start from the beginning" Command
    if (this.isResetCommand(textLower)) {
      this.resetInterview();
      const greeting = this.getInitialGreeting(lang);
      return {
        spokenText: greeting.text,
        englishTranslation: greeting.translation,
        nextState: 'INTERVIEW_OCCUPATION',
        activeNodeId: 'voice_agent',
        updatedProfile: undefined,
        isReadbackPrompt: false,
        reasoningStep: {
          step: 'Session Reset Command',
          observation: `Citizen commanded restart: "${textTrimmed}"`,
          deduplicationCheck: 'Cleared all 4 slots, reset profile, returned to initial greeting',
          decision: 'Restart fresh conversational interview from the beginning',
          confidence: 100
        }
      };
    }

    // 1. Confirmation Screen Handling (YES / NO / CORRECTION Branch)
    if (currentState === 'READBACK_CONFIRMATION' || textTrimmed === 'CONFIRMED_YES' || textTrimmed === 'CORRECTION_NO') {
      const isYes = textTrimmed === 'CONFIRMED_YES' || this.isAffirmative(textLower);
      const isNo = textTrimmed === 'CORRECTION_NO' || this.isNegative(textLower);

      if (isYes) {
        // Citizen Said YES: Call Gemini AI to build full tailored profile
        const finalProfile = await this.generateFullAIProfile(lang, history, existingProfile);

        let successMsg = '';
        let trans = '';
        switch (lang) {
          case 'kn':
            successMsg = 'ಅದ್ಭುತ! ನಿಮ್ಮ ಕೌಶಲ್ಯ ವಿವರವನ್ನು AI ಮೂಲಕ ಯಶಸ್ವಿಯಾಗಿ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ. ನಿಮಗಾಗಿ ಹೊಂದಿಕೆಯಾದ ಅತ್ಯುತ್ತಮ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು 90 ದಿನಗಳ ಕ್ರಿಯಾ ಯೋಜನೆ ಕೆಳಗೆ ಸಿದ್ಧವಾಗಿದೆ!';
            trans = 'Awesome! Your verified skill profile, identified gaps, and AI-matched government programs are ready below!';
            break;
          case 'hi':
            successMsg = 'शानदार! आपकी कौशल प्रोफ़ाइल AI द्वारा सत्यापित और तैयार हो गई है। आपके लिए चुनी गई सरकारी योजनाएं नीचे दी गई हैं!';
            trans = 'Great! Your verified profile and scheme recommendations are ready below!';
            break;
          default:
            successMsg = 'Success! Your verified skill profile, identified skill gaps, and AI-matched government schemes have been generated below.';
            trans = 'Success! Your verified profile and recommendations are ready below.';
        }

        return {
          spokenText: successMsg,
          englishTranslation: trans,
          nextState: 'RESULTS_VIEW',
          activeNodeId: 'coordinator_agent',
          updatedProfile: finalProfile,
          reasoningStep: {
            step: 'Gemini AI Profile & Scheme Synthesis',
            observation: 'Citizen affirmed read-back summary (✓ YES)',
            deduplicationCheck: 'All slots validated. Synthesized 100% custom AI profile & schemes.',
            decision: 'Render dynamic Kaushal Passport, Skill Gap, and Scheme Recommendations',
            confidence: 98
          }
        };
      }

      if (isNo) {
        this.slots.occupation = null;
        this.slots.toolsEquipment = null;
        this.slots.aspiration = null;

        let prompt = '';
        let trans = '';
        switch (lang) {
          case 'kn':
            prompt = 'ಸರಿ, ನಾನು ಇದನ್ನು ತಿದ್ದುತ್ತೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸರಿಯಾದ ಮುಖ್ಯ ವೃತ್ತಿ, ಅನುಭವ ಮತ್ತು ಬಳಸುವ ಮುಖ್ಯ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.';
            trans = 'Understood. Please clearly tell me your exact trade, experience, and tools so I can adjust your profile.';
            break;
          case 'hi':
            prompt = 'ठीक है, मैं इसे सुधारता हूँ। कृपया अपने सही काम, अनुभव और मुख्य औजारों के बारे में बताएं।';
            trans = 'Understood. Please clearly tell me your exact trade and main tools.';
            break;
          default:
            prompt = 'Understood. Please clarify your exact trade, experience, and tools so I can update your profile accurately.';
            trans = 'Understood. Please clarify your exact trade and tools.';
        }

        return {
          spokenText: prompt,
          englishTranslation: trans,
          nextState: 'INTERVIEW_OCCUPATION',
          activeNodeId: 'understanding_agent',
          isReadbackPrompt: false,
          reasoningStep: {
            step: 'Read-Back Correction Branch',
            observation: 'Citizen requested correction on summary (✗ NO)',
            deduplicationCheck: 'Resetting slots for fresh user input',
            decision: 'Prompt citizen for exact trade clarification',
            confidence: 95
          }
        };
      }

      // If user provided specific correction in their sentence (e.g. "Actually I have 5 years experience with computers")
      const detectedOcc = this.detectOccupation(textTrimmed);
      const detectedExp = this.extractNumericYears(textTrimmed);
      const detectedTools = this.detectTools(textTrimmed);
      const detectedAsp = this.detectAspiration(textTrimmed);

      if (detectedOcc || detectedExp !== null || detectedTools || detectedAsp) {
        if (detectedOcc) this.slots.occupation = detectedOcc;
        if (detectedExp !== null) this.slots.experienceYears = detectedExp;
        if (detectedTools) this.slots.toolsEquipment = detectedTools;
        if (detectedAsp) this.slots.aspiration = detectedAsp;

        const occU = this.slots.occupation || 'Professional Trade';
        const expU = this.slots.experienceYears ?? 1;
        const toolsU = this.slots.toolsEquipment || 'Standard Tools';
        const aspU = this.slots.aspiration || 'Career Growth';

        let newReadback = '';
        let newTrans = '';
        switch (lang) {
          case 'kn':
            newReadback = `ನಾನು ನಿಮ್ಮ ವಿವರವನ್ನು ತಿದ್ದಿದ್ದೇನೆ: "${occU}", ${expU} ವರ್ಷಗಳ ಅನುಭವ, "${toolsU}" ಉಪಕರಣಗಳು ಮತ್ತು "${aspU}" ಗುರಿ. ಇದು ಸರಿಯೇ?`;
            newTrans = `I updated your details: ${occU}, ${expU} yrs exp, ${toolsU} tools, and ${aspU} goal. Is this correct?`;
            break;
          case 'hi':
            newReadback = `मैंने आपका विवरण अपडेट कर दिया है: "${occU}", ${expU} साल का अनुभव, "${toolsU}" टूल्स और "${aspU}" लक्ष्य। क्या यह सही है?`;
            newTrans = `I updated your details: ${occU}, ${expU} yrs exp, ${toolsU} tools, and ${aspU} goal. Is this correct?`;
            break;
          default:
            newReadback = `I have updated your summary: ${occU} with ${expU} years experience, using ${toolsU}, aspiring towards ${aspU}. Is this correct?`;
            newTrans = `I have updated your summary. Is this correct?`;
        }

        return {
          spokenText: newReadback,
          englishTranslation: newTrans,
          nextState: 'READBACK_CONFIRMATION',
          activeNodeId: 'confirmation_agent',
          isReadbackPrompt: true,
          reasoningStep: {
            step: 'Slot Update & Re-Readback',
            observation: `Updated slots from user utterance: "${textTrimmed}"`,
            deduplicationCheck: 'Re-prompting confirmation with updated values',
            decision: 'Present revised readback for citizen confirmation',
            confidence: 96
          }
        };
      }

      // If user input was unclear / ambiguous, DO NOT default to YES! Ask for clarification
      let clarifyConfirm = '';
      let clarifyTrans = '';
      switch (lang) {
        case 'kn':
          clarifyConfirm = `ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳು ಸರಿಯಾಗಿದ್ದರೆ 'ಹೌದು' (Yes) ಎಂದು ಹೇಳಿ, ಅಥವಾ ಬದಲಾಯಿಸಬೇಕಾದ ಮಾಹಿತಿಯನ್ನು ತಿಳಿಸಿ.`;
          clarifyTrans = `Please say 'Yes' if your summary is correct, or tell me what to update.`;
          break;
        case 'hi':
          clarifyConfirm = `कृपया विवरण सही होने पर 'हाँ' (Yes) कहें, या बदलने वाली जानकारी बताएं।`;
          clarifyTrans = `Please say 'Yes' if the details are correct, or tell me what to update.`;
          break;
        default:
          clarifyConfirm = `Please confirm if this summary is correct by saying 'Yes', or tell me what needs to be changed.`;
          clarifyTrans = `Please say 'Yes' or tell me what to change.`;
      }

      return {
        spokenText: clarifyConfirm,
        englishTranslation: clarifyTrans,
        nextState: 'READBACK_CONFIRMATION',
        activeNodeId: 'confirmation_agent',
        isReadbackPrompt: true,
        reasoningStep: {
          step: 'Confirmation Intent Clarification',
          observation: `Ambiguous confirmation utterance: "${textTrimmed}"`,
          deduplicationCheck: 'Awaiting explicit YES/NO or specific correction details',
          decision: 'Re-prompt for explicit confirmation',
          confidence: 90
        }
      };
    }

    // 2. Groq Cloud / xAI Grok LLM Reasoning if selected and key available
    if (this.grokKey && this.activeProvider !== 'local') {
      try {
        const isGroqCloud = this.grokKey.startsWith('gsk_');
        const endpoint = isGroqCloud ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
        const models = isGroqCloud ? ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'groq/compound-mini'] : ['grok-2-latest'];

        for (const model of models) {
          try {
            const grokRes = await this.callOpenAICompatibleAgent(
              endpoint,
              this.grokKey,
              model,
              textTrimmed,
              lang,
              history
            );
            if (grokRes) return grokRes;
          } catch (mErr) {
            console.warn(`Model ${model} failed, trying next:`, mErr);
          }
        }
      } catch (err) {
        console.warn('Groq/Grok call failed:', err);
      }
    }

    // 3. Gemini LLM Reasoning
    if (this.geminiKey && this.activeProvider !== 'local') {
      try {
        const geminiRes = await this.callGeminiAgent(textTrimmed, lang, history);
        if (geminiRes) return geminiRes;
      } catch (err) {
        console.warn('Gemini call failed:', err);
      }
    }

    // 5. Intelligent Neuro-Symbolic Agent Engine (Built-In Conversational Reasoning)
    return this.processContextualEngine(textTrimmed, lang);
  }

  private async callGeminiAgent(
    userInput: string,
    lang: SupportedLanguage,
    history: DialogueTurn[]
  ): Promise<AgentPipelineResponse | null> {
    const ai = new GoogleGenAI({ apiKey: this.geminiKey });

    const cName = this.slots.citizenName ? (this.cleanExtractedName(this.slots.citizenName) || this.slots.citizenName) : '';

    const systemInstruction = `
You are SAKSHAM VOICE (ಸಕ್ಷಮ್ ವಾಯ್ಸ್), an empathetic, polite, highly intelligent conversational AI counselor for livelihood skill mapping and government welfare/skilling schemes across India.
Target Language: "${lang}". Respond strictly in language "${lang}".

CRITICAL HUMAN-LIKE CONVERSATIONAL RULES:
1. CITIZEN NAME & WARM ADDRESS:
   - If the candidate's name is known (e.g., "${cName}"), ALWAYS greet and address them respectfully and warmly by name (e.g., "Namaste ${cName}!", "ನಮಸ್ಕಾರ ${cName}!", "नमस्ते ${cName}!").
   - If candidate introduces themselves with phrases like "Self Vijay", "Myself Vijay", "Self, Vijay", "I am Vijay", "My name is Vijay", extract ONLY the person's actual name ("Vijay"). NEVER include "Self", "Myself", "Student", or "Here" in the name!

2. NATURAL STEP-BY-STEP PROBING (NEVER ASK FOR EVERYTHING ALL AT ONCE):
   - Turn 1 (Only Name provided, trade unknown): Greet warmly by name (e.g., "Namaste ${cName || 'friend'}! Welcome to Saksham Voice. Tell me about the work, trade, course of study, or profession you currently do.")
   - Turn 2 (Trade/Studies provided, experience/goals unknown): Acknowledge their trade warmly and ask how long they have been doing it and what their main career goals or aspirations are.
   - Turn 3 (Trade + Experience + Goals known): Formulate a clear, concise read-back summarizing their details (Name, Trade, Experience, Tools, Aspirations) and ask for confirmation ("Is this correct? / ಇದು ಸರಿಯೇ?").
   - NEVER ask for city, occupation, experience, tools, and aspirations in a single sentence. Keep the conversation natural, friendly, and step-by-step.

3. GREETINGS & INTRODUCTIONS:
   - If citizen says "Good morning", "Hello", "Hi", "Namaskara", "Namaste", greet them back politely as Saksham Voice.
   - NEVER misclassify greetings or pleasantries as an occupation!

Respond in strict JSON with schema:
{
  "intent": "GREETING" | "IDENTITY" | "NAME_LOCATION" | "SLOT_UPDATE" | "READBACK",
  "extractedCitizenName": string or null,
  "extractedLocation": string or null,
  "extractedOccupation": string or null,
  "extractedExperienceYears": number or null,
  "extractedTools": string or null,
  "extractedAspiration": string or null,
  "isReadyForReadback": boolean,
  "spokenText": string (in "${lang}"),
  "englishTranslation": string,
  "reasoningObservation": string,
  "reasoningDecision": string,
  "confidence": number
}
`;

    const conversationContext = history
      .slice(-6)
      .map(t => `${t.speaker.toUpperCase()}: ${t.text}`)
      .join('\n');

    const prompt = `
Context:\n${conversationContext}\n
Citizen Input: "${userInput}"\n
Current Known Slots: ${JSON.stringify(this.slots)}
`;

    const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');

        if (parsed.extractedCitizenName) {
          const cleanN = this.cleanExtractedName(parsed.extractedCitizenName);
          if (cleanN && !this.slots.citizenName) {
            this.slots.citizenName = cleanN;
          }
        }
        if (parsed.extractedLocation && !this.slots.location) {
          this.slots.location = parsed.extractedLocation;
        }
        if (parsed.extractedOccupation) this.slots.occupation = parsed.extractedOccupation;
        if (parsed.extractedExperienceYears !== undefined && parsed.extractedExperienceYears !== null) {
          this.slots.experienceYears = parsed.extractedExperienceYears;
        }
        if (parsed.extractedTools) this.slots.toolsEquipment = parsed.extractedTools;
        if (parsed.extractedAspiration) this.slots.aspiration = parsed.extractedAspiration;

        const isAllSlotsFilled = Boolean(
          this.slots.occupation &&
          this.slots.experienceYears !== null &&
          this.slots.toolsEquipment &&
          this.slots.aspiration
        );

        // Strict: Only trigger read-back if ALL slots are filled!
        const isReady = isAllSlotsFilled && Boolean(parsed.isReadyForReadback);

        const reasoningStep: AgentReasoningStep = {
          step: `Live Gemini (${model}) AI Reasoning`,
          observation: parsed.reasoningObservation || `Candidate ${this.slots.citizenName || 'Applicant'}: Analyzed intent: ${parsed.intent || 'CONVERSATION'}`,
          deduplicationCheck: `Slots: Name=${this.slots.citizenName || 'missing'}, Occ=${this.slots.occupation || 'missing'}, Exp=${this.slots.experienceYears ?? 'missing'}, Tools=${this.slots.toolsEquipment || 'missing'}, Asp=${this.slots.aspiration || 'missing'}`,
          decision: parsed.reasoningDecision || (isReady ? 'Formulate Spoken Readback' : 'Multi-Turn Contextual Probing'),
          confidence: parsed.confidence || 96
        };

        if (isReady) {
          return {
            spokenText: parsed.spokenText,
            englishTranslation: parsed.englishTranslation,
            nextState: 'READBACK_CONFIRMATION',
            activeNodeId: 'confirmation_agent',
            isReadbackPrompt: true,
            reasoningStep
          };
        }

        return {
          spokenText: parsed.spokenText,
          englishTranslation: parsed.englishTranslation,
          nextState: this.determineNextState(),
          activeNodeId: this.slots.toolsEquipment === null || this.slots.experienceYears === null ? 'profile_agent' : 'skill_mapping_agent',
          isReadbackPrompt: false,
          reasoningStep
        };
      } catch (err) {
        console.warn(`Gemini model ${model} failed, trying next:`, err);
      }
    }

    return null;
  }

  private async callOpenAICompatibleAgent(
    endpoint: string,
    apiKey: string,
    model: string,
    userInput: string,
    lang: SupportedLanguage,
    history: DialogueTurn[]
  ): Promise<AgentPipelineResponse | null> {
    const cName = this.slots.citizenName ? (this.cleanExtractedName(this.slots.citizenName) || this.slots.citizenName) : '';
    const systemInstruction = `You are SAKSHAM VOICE (ಸಕ್ಷಮ್ ವಾಯ್ಸ್), an empathetic, polite conversational AI counselor for skill mapping and government welfare/skilling schemes across India.
Target Language: "${lang}". Respond strictly in "${lang}".

CRITICAL HUMAN-LIKE CONVERSATIONAL RULES:
1. CANDIDATE NAME:
   - If candidate name is known (e.g., "${cName}"), ALWAYS greet and address them respectfully by name (e.g. "Namaste ${cName}!", "ನಮಸ್ಕಾರ ${cName}!", "नमस्ते ${cName}!").
   - If candidate introduces themselves (e.g., "Self Vijay", "Myself Vijay", "Self, Vijay", "I am Vijay", "My name is Vijay"), extract ONLY the actual first/last name ("Vijay"). NEVER include "Self", "Myself", "Student", or "Here" in the name!

2. NATURAL STEP-BY-STEP PROBING (NEVER ASK FOR EVERYTHING ALL AT ONCE):
   - Turn 1 (Only Name provided, trade unknown): Greet warmly by name (e.g., "Namaste ${cName || 'friend'}! Welcome to Saksham Voice. Tell me about the work, trade, course of study, or profession you currently do.")
   - Turn 2 (Trade/Studies provided, experience/goals unknown): Acknowledge their trade warmly and ask how long they have been doing it and what their main career goals or aspirations are.
   - Turn 3 (Trade + Experience + Goals known): Formulate a clear, concise read-back summarizing their details (Name, Trade, Experience, Tools, Aspirations) and ask for confirmation ("Is this correct? / ಇದು ಸರಿಯೇ?").
   - NEVER dump a question asking for city, occupation, experience, tools, and aspirations in a single sentence! Keep the dialogue natural and friendly.

3. GREETINGS & INTRODUCTIONS:
   - If citizen says "Good morning", "Hello", "Hi", "Namaskara", "Namaste", greet them back politely as Saksham Voice.
   - NEVER misclassify greetings or pleasantries as an occupation!

Respond in strict JSON format:
{
  "intent": "NAME_GREETING" | "TRADE_PROBING" | "READBACK_CONFIRM",
  "extractedCitizenName": string or null,
  "extractedLocation": string or null,
  "extractedOccupation": string or null,
  "extractedExperienceYears": number or null,
  "extractedTools": string or null,
  "extractedAspiration": string or null,
  "isReadyForReadback": boolean,
  "spokenText": string (in "${lang}"),
  "englishTranslation": string,
  "reasoningObservation": string,
  "reasoningDecision": string,
  "confidence": number
}`;

    const messages = [
      { role: 'system', content: systemInstruction },
      ...history.slice(-4).map(h => ({
        role: h.speaker === 'user' ? 'user' : 'assistant',
        content: h.text
      })),
      { role: 'user', content: userInput }
    ];

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: 'json_object' }
      })
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.extractedCitizenName) {
      const cleanN = this.cleanExtractedName(parsed.extractedCitizenName);
      if (cleanN && !this.slots.citizenName) {
        this.slots.citizenName = cleanN;
      }
    }
    if (parsed.extractedLocation && !this.slots.location) this.slots.location = parsed.extractedLocation;
    if (parsed.extractedOccupation) this.slots.occupation = parsed.extractedOccupation;
    if (parsed.extractedExperienceYears !== undefined && parsed.extractedExperienceYears !== null) {
      this.slots.experienceYears = parsed.extractedExperienceYears;
    }
    if (parsed.extractedTools) this.slots.toolsEquipment = parsed.extractedTools;
    if (parsed.extractedAspiration) this.slots.aspiration = parsed.extractedAspiration;

    const isReady = Boolean(
      parsed.isReadyForReadback ||
      (this.slots.occupation && this.slots.experienceYears !== null && this.slots.toolsEquipment && this.slots.aspiration)
    );

    return {
      spokenText: parsed.spokenText || parsed.message || 'Thank you, let me analyze that.',
      englishTranslation: parsed.englishTranslation || 'Processing your trade information.',
      nextState: isReady ? 'READBACK_CONFIRMATION' : this.determineNextState(),
      activeNodeId: isReady ? 'confirmation_agent' : 'understanding_agent',
      isReadbackPrompt: isReady,
      reasoningStep: {
        step: `${model.toUpperCase()} Cloud Agent`,
        observation: `Extracted intent for ${this.slots.citizenName || 'Applicant'}: "${userInput}"`,
        deduplicationCheck: `Slots: Occ=${this.slots.occupation || 'none'}, Exp=${this.slots.experienceYears ?? 'none'}`,
        decision: isReady ? 'Formulate Readback' : 'Contextual Next Slot',
        confidence: 94
      }
    };
  }

  private processContextualEngine(userInput: string, lang: SupportedLanguage): AgentPipelineResponse {
    const textLower = userInput.toLowerCase().trim();
    const cName = this.slots.citizenName;

    // 1. Check for Greetings (e.g. "Good morning", "Hello", "Namaskara")
    if (this.isGreeting(textLower)) {
      let greetResp = '';
      let trans = '';
      if (cName) {
        switch (lang) {
          case 'kn':
            greetResp = `ಶುಭೋದಯ ಮತ್ತು ನಮಸ್ಕಾರ ${cName}! ನಿಮ್ಮ ಕೌಶಲ್ಯಕ್ಕೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಲು, ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ, ವೃತ್ತಿ ಅಥವಾ ಅಧ್ಯಯನ ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸಿ.`;
            trans = `Good morning and Namaste ${cName}! To discover the best government skilling schemes for you, please tell me what trade or studies you currently do.`;
            break;
          case 'hi':
            greetResp = `शुभ प्रभात और नमस्ते ${cName}! आपके लिए सही सरकारी योजनाएं खोजने के लिए, कृपया बताएं कि आप अभी क्या काम या पढ़ाई करते हैं?`;
            trans = `Good morning and Namaste ${cName}! Please tell me what trade or studies you currently do.`;
            break;
          default:
            greetResp = `Good morning and Namaste ${cName}! To help you discover the best government skilling programs, please tell me what kind of work, trade, or studies you currently do.`;
            trans = `Good morning and Namaste ${cName}! Please tell me what work, trade, or studies you currently do.`;
        }
      } else {
        switch (lang) {
          case 'kn':
            greetResp = 'ಶುಭೋದಯ ಮತ್ತು ನಮಸ್ಕಾರ! ಸಕ್ಷಮ್ ವಾಯ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ನೀವು ಯಾವ ಊರಿನವರು ಎಂದು ತಿಳಿಸುವಿರಾ?';
            trans = 'Good morning and Welcome to Saksham Voice! May I please know your name and where you are from?';
            break;
          case 'hi':
            greetResp = 'शुभ प्रभात और नमस्ते! सक्षम वॉइस में आपका स्वागत है। कृपया अपना नाम और शहर बताएं?';
            trans = 'Good morning and Welcome to Saksham Voice! May I please know your name and city?';
            break;
          default:
            greetResp = 'Good morning and Welcome to Saksham Voice! I am your personal AI skilling counselor. May I please know your name and which city or district you are from?';
            trans = 'Good morning and Welcome to Saksham Voice! May I please know your name and city?';
        }
      }

      return {
        spokenText: greetResp,
        englishTranslation: trans,
        nextState: cName ? 'INTERVIEW_OCCUPATION' : 'INTERVIEW_NAME_LOCATION',
        activeNodeId: 'voice_agent',
        reasoningStep: {
          step: 'Conversational Greeting Filter',
          observation: `Recognized pleasantry/greeting: "${userInput}"`,
          deduplicationCheck: 'Preserved empty occupation slot (did not misclassify greeting as trade)',
          decision: cName ? `Greet ${cName} warmly and ask for trade` : 'Greet warmly and ask for candidate name',
          confidence: 99
        }
      };
    }

    // 2. Check for Identity & Name Questions ("What is your name?", "Who are you?")
    if (this.isIdentityQuestion(textLower)) {
      let identResp = '';
      let trans = '';
      switch (lang) {
        case 'kn':
          identResp = 'ನನ್ನ ಹೆಸರು ಸಕ್ಷಮ್ ವಾಯ್ಸ್ (Saksham Voice). ನಾನು ಗ್ರಾಮೀಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ/ಕಾರ್ಮಿಕರ ಕೌಶಲ್ಯಗಳನ್ನು ಗುರುತಿಸಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಒದಗಿಸುವ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸಹಾಯಕ. ನಿಮ್ಮ ಹೆಸರೇನು ಮತ್ತು ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತೀರಿ?';
          trans = 'My name is Saksham Voice. I am an AI assistant that maps practical skills and connects you with government skilling schemes. What is your name and what work do you do?';
          break;
        case 'hi':
          identResp = 'मेरा नाम सक्षम वॉइस (Saksham Voice) है। मैं आपके कौशल और काम को समझकर सही सरकारी प्रशिक्षण योजनाओं से जोड़ने वाला एआई एजेंट हूँ। आपका नाम क्या है और आप क्या काम करते हैं?';
          trans = 'My name is Saksham Voice. I help connect your skills with government training schemes. What is your name and work?';
          break;
        default:
          identResp = 'My name is Saksham Voice. I am an Agentic AI counselor built to recognize your practical skills and match you with government skilling programs. May I know your name and what work or studies you do?';
          trans = 'My name is Saksham Voice. May I know your name and work?';
      }

      return {
        spokenText: identResp,
        englishTranslation: trans,
        nextState: 'INTERVIEW_OCCUPATION',
        activeNodeId: 'understanding_agent',
        reasoningStep: {
          step: 'Persona Identity Response',
          observation: 'Citizen inquired about AI identity and name',
          deduplicationCheck: 'Answered persona question clearly without advancing empty slots',
          decision: 'Explain Saksham Voice role and gently prompt for name/trade',
          confidence: 98
        }
      };
    }

    // 3. Extract Name & Location if detected
    const foundName = this.detectName(userInput);
    if (foundName && !this.slots.citizenName) {
      this.slots.citizenName = this.cleanExtractedName(foundName) || foundName;
    }

    const foundLoc = this.detectLocation(userInput);
    if (foundLoc && !this.slots.location) {
      this.slots.location = foundLoc;
    }

    const foundEdu = this.detectEducation(userInput);
    if (foundEdu && !this.slots.education) {
      this.slots.education = foundEdu;
    }

    // 4. Extract Numeric Experience Years if present
    const yearsFound = this.extractNumericYears(userInput);
    if (yearsFound !== null) {
      this.slots.experienceYears = yearsFound;
    }

    // 5. Extract Occupation & Aspirations dynamically
    const detectedOcc = this.detectOccupation(userInput);
    if (detectedOcc) {
      this.slots.occupation = detectedOcc;
    }

    const detectedTools = this.detectTools(userInput);
    if (detectedTools) {
      this.slots.toolsEquipment = detectedTools;
    }

    const detectedAspiration = this.detectAspiration(userInput);
    if (detectedAspiration) {
      this.slots.aspiration = detectedAspiration;
    }

    const activeName = this.slots.citizenName;

    // If Name was just provided and occupation is still missing:
    if (activeName && !this.slots.occupation) {
      let welcomeMsg = '';
      let welcomeTrans = '';

      switch (lang) {
        case 'kn':
          welcomeMsg = `ನಮಸ್ಕಾರ ${activeName}! ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಲು ಸಂತೋಷವಾಗಿದೆ. ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ, ವೃತ್ತಿ ಅಥವಾ ಅಧ್ಯಯನ ಮಾಡುತ್ತಿದ್ದೀರಿ?`;
          welcomeTrans = `Namaste ${activeName}! It is a pleasure to speak with you. Tell me about the work, trade, or studies you currently do.`;
          break;
        case 'hi':
          welcomeMsg = `नमस्ते ${activeName}! आपसे बात करके बहुत खुशी हुई। आप वर्तमान में क्या काम, व्यवसाय या पढ़ाई करते हैं?`;
          welcomeTrans = `Namaste ${activeName}! Great to speak with you. What work, trade, or studies do you currently do?`;
          break;
        default:
          welcomeMsg = `Namaste ${activeName}! It is a pleasure to meet you. Tell me about the work, trade, or studies you currently do so I can discover the best government skilling programs for you.`;
          welcomeTrans = `Namaste ${activeName}! Tell me about the work, trade, or studies you currently do.`;
      }

      return {
        spokenText: welcomeMsg,
        englishTranslation: welcomeTrans,
        nextState: 'INTERVIEW_OCCUPATION',
        activeNodeId: 'understanding_agent',
        reasoningStep: {
          step: 'Candidate Name Acknowledgement',
          observation: `Locked candidate name: "${activeName}"`,
          deduplicationCheck: 'Acknowledged candidate warmly by name, prompting for occupation/field',
          decision: `Address ${activeName} and probe for primary trade`,
          confidence: 99
        }
      };
    }

    // If occupation is still unknown and user provided generic noise, ask clarification
    if (!this.slots.occupation) {
      let clarifyMsg = '';
      let trans = '';
      const prefix = activeName ? `${activeName}, ` : '';
      switch (lang) {
        case 'kn':
          clarifyMsg = `${prefix}ದಯವಿಟ್ಟು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ವೃತ್ತಿ, ಅಧ್ಯಯನ ಅಥವಾ ಕೆಲಸವನ್ನು ತಿಳಿಸಿ (ಉದಾ: ಇಂಜಿನಿಯರಿಂಗ್, ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್, ಸಿವಿಲ್ ಸರ್ವೀಸಸ್, ಸಾಫ್ಟ್‌ವೇರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಕೃಷಿ, ಇತ್ಯಾದಿ).`;
          trans = `${prefix}Please tell me your occupation or field (e.g. Engineering, Event Management, Civil Services, Software, Electrical, Farming).`;
          break;
        case 'hi':
          clarifyMsg = `${prefix}कृपया अपने काम, पढ़ाई या व्यवसाय का नाम बताएं (जैसे: इंजीनियरिंग, इवेंट मैनेजमेंट, सिविल सेवा, सॉफ्टवेयर, इलेक्ट्रीशियन, आदि)।`;
          trans = `${prefix}Please specify your occupation or field.`;
          break;
        default:
          clarifyMsg = `${prefix}could you please share your specific occupation, studies, or trade (for example: Engineering, Event Management, Civil Services, Software, Electrical, Tailoring, or Farming)?`;
          trans = `${prefix}could you please share your specific occupation, studies, or trade?`;
      }

      return {
        spokenText: clarifyMsg,
        englishTranslation: trans,
        nextState: 'INTERVIEW_OCCUPATION',
        activeNodeId: 'understanding_agent',
        reasoningStep: {
          step: 'Trade Clarification Probing',
          observation: `Input "${userInput}" analyzed for occupation`,
          deduplicationCheck: 'Awaiting valid occupation before locking slot',
          decision: 'Prompt citizen with broad multi-sector trade examples',
          confidence: 90
        }
      };
    }

    // If user provided occupation but experience or aspirations are not yet given, ask a friendly follow-up:
    if (this.slots.experienceYears === null && !this.detectAspiration(userInput)) {
      const occ = this.slots.occupation;
      let prompt = '';
      let trans = '';
      const prefix = activeName ? `${activeName}, ` : '';

      switch (lang) {
        case 'kn':
          prompt = `ಅದ್ಭುತ ${prefix}! ನೀವು "${occ}" ಕ್ಷೇತ್ರದಲ್ಲಿ ಎಷ್ಟು ಸಮಯ ಅಥವಾ ವರ್ಷಗಳಿಂದ ತೊಡಗಿಸಿಕೊಂಡಿದ್ದೀರಿ ಮತ್ತು ನಿಮ್ಮ ಮುಖ್ಯ ವೃತ್ತಿ ಆಕಾಂಕ್ಷೆಗಳೇನು (ಉದಾ: ಎಐ, ಕ್ಲೌಡ್, ಅಥವಾ ಸಿವಿಲ್ ಸರ್ವೀಸಸ್)?`;
          trans = `Great ${prefix}! How many years of experience or studies do you have in ${occ}, and what are your main career aspirations?`;
          break;
        case 'hi':
          prompt = `बहुत अच्छा ${prefix}! "${occ}" में आपका कितने वर्षों का अनुभव या अध्ययन है, और आपके करियर के मुख्य लक्ष्य क्या हैं?`;
          trans = `Great ${prefix}! How many years of experience do you have in ${occ}, and what are your career goals?`;
          break;
        default:
          prompt = `Great ${prefix}! How many years of experience or studies do you have in ${occ}, and what are your main career goals or aspirations (for example: AI, Cloud Development, or Civil Services)?`;
          trans = `Great ${prefix}! How many years of experience do you have in ${occ}, and what are your career aspirations?`;
      }

      return {
        spokenText: prompt,
        englishTranslation: trans,
        nextState: 'INTERVIEW_ASPIRATION',
        activeNodeId: 'profile_agent',
        reasoningStep: {
          step: 'Experience & Aspiration Probing',
          observation: `Captured Occupation: "${this.slots.occupation}". Inquiring tenure and goals for ${activeName || 'Citizen'}.`,
          deduplicationCheck: 'Occupation is confirmed. Probing experience and career goal.',
          decision: 'Ask for experience duration and aspirations',
          confidence: 96
        }
      };
    }

    // Auto-populate intelligent defaults for tools, experience, and aspirations if not yet set
    if (this.slots.experienceYears === null) {
      this.slots.experienceYears = 1;
    }
    if (!this.slots.toolsEquipment) {
      this.slots.toolsEquipment = this.detectTools(userInput) || this.getDefaultToolsForSector(this.slots.occupation);
    }
    if (!this.slots.aspiration) {
      this.slots.aspiration = this.detectAspiration(userInput) || this.getDefaultAspirationForSector(this.slots.occupation);
    }

    // All Slots Filled: Formulate Verbatim Read-back with candidate name
    const occ = this.slots.occupation;
    const exp = this.slots.experienceYears;
    const tools = this.slots.toolsEquipment;
    const asp = this.slots.aspiration;

    let readback = '';
    let trans = '';
    const nameGreeting = activeName ? `${activeName}, ` : '';

    switch (lang) {
      case 'kn':
        readback = `${nameGreeting}ನೀವು ${exp} ವರ್ಷಗಳ ಅನುಭವದೊಂದಿಗೆ "${occ}" ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ, "${tools}" ಬಳಸುತ್ತೀರಿ ಮತ್ತು "${asp}" ಗುರಿ ಹೊಂದಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಇದು ಸರಿಯೇ?`;
        trans = `${nameGreeting}I understood that you have ${exp} years of experience in ${occ}, use ${tools}, and aspire towards ${asp}. Is this correct?`;
        break;
      case 'hi':
        readback = `${nameGreeting}मैंने समझा कि आपके पास ${exp} वर्षों के अनुभव के साथ "${occ}" की पृष्ठभूमि है, आप "${tools}" का उपयोग करते हैं, और "${asp}" का लक्ष्य रखते हैं। क्या यह सही है?`;
        trans = `${nameGreeting}I understood that you have ${exp} years of experience in ${occ}, use ${tools}, and aspire towards ${asp}. Is this correct?`;
        break;
      default:
        readback = `${nameGreeting}I understood that you have ${exp} years of experience in ${occ}, utilize ${tools}, and aspire towards ${asp}. Is this correct?`;
        trans = `${nameGreeting}I understood that you have ${exp} years of experience in ${occ}, utilize ${tools}, and aspire towards ${asp}. Is this correct?`;
    }

    return {
      spokenText: readback,
      englishTranslation: trans,
      nextState: 'READBACK_CONFIRMATION',
      activeNodeId: 'confirmation_agent',
      isReadbackPrompt: true,
      reasoningStep: {
        step: 'Read-Back Verification Synthesis',
        observation: `All required skill mapping slots fully extracted for ${activeName || 'Citizen'}.`,
        deduplicationCheck: 'Formulating verbatim recap in citizen native language for explicit sign-off.',
        decision: 'Present Read-Back Confirmation Modal with YES/NO actions',
        confidence: 98
      }
    };
  }

  private determineNextState(): ConversationState {
    if (!this.slots.citizenName) return 'INTERVIEW_NAME_LOCATION';
    if (this.slots.experienceYears === null) return 'INTERVIEW_EXPERIENCE';
    if (this.slots.toolsEquipment === null) return 'INTERVIEW_TOOLS_ACTIVITIES';
    if (this.slots.aspiration === null) return 'INTERVIEW_ASPIRATION';
    return 'READBACK_CONFIRMATION';
  }

  public isResetCommand(text: string): boolean {
    const t = text.toLowerCase().trim();
    const resetPhrases = [
      'start from the beginning',
      'start from beginning',
      'start over',
      'start again',
      'restart',
      'reset',
      'restart conversation',
      'clear all',
      'clear everything',
      'begin again',
      'start from start',
      'from the beginning',
      'from beginning',
      'ಮೊದಲಿನಿಂದ ಪ್ರಾರಂಭಿಸಿ',
      'ಮೊದಲಿಂದ ಶುರು ಮಾಡಿ',
      'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
      'ರೀಸೆಟ್',
      'ಶುರು ಮಾಡಿ',
      'ಆರಂಭದಿಂದ',
      'ಶುರುವಿನಿಂದ',
      'शुरू से शुरू करें',
      'शुरू से',
      'दोबारा शुरू करें',
      'रीसेट करें',
      'फिर से शुरू करें',
      'మొదటి నుండి ప్రారంభించండి',
      'మళ్లీ ప్రారంభించండి',
      'రీసెట్',
      'மீண்டும் தொடங்கவும்',
      'ஆரம்பத்தில் இருந்து தொடங்கவும்'
    ];
    return resetPhrases.some(p => t === p || t.includes(p) || p.includes(t));
  }

  private isGreeting(text: string): boolean {
    const greetings = [
      'good morning', 'good afternoon', 'good evening', 'hello', 'hi', 'hey', 'namaste', 'namaskar',
      'namaskara', 'vanakkam', 'namaskaram', 'ಸುಪ್ರಭಾತ', 'ಶುಭೋದಯ', 'ನಮಸ್ಕಾರ', 'ಹಲೋ', 'ಪ್ರಣಾಮ',
      'नमस्ते', 'शुभ प्रभात', 'வணக்கம்', 'నమస్కారం'
    ];
    return greetings.some(g => text === g || text.startsWith(g + ' ') || text.endsWith(' ' + g));
  }

  private isIdentityQuestion(text: string): boolean {
    const identityPhrases = [
      'what is your name', 'whats your name', 'who are you', 'who made you', 'tell me about you',
      'what is your purpose', 'what do you do', 'ನಿಮ್ಮ ಹೆಸರೇನು', 'ಯಾರು ನೀವು', 'ನಿಮ್ಮ ಹೆಸರು',
      'आपका नाम क्या है', 'आप कौन हैं', 'तुमचं नाव काय', 'మీ పేరు ఏమిటి', 'உங்கள் பெயர் என்ன'
    ];
    return identityPhrases.some(p => text.includes(p));
  }

  public detectName(text: string): string | null {
    if (!text) return null;
    let t = text.trim();
    t = t.replace(/[.,!?;:]+$/, '').trim();

    // 1. Explicit Intro regexes: "Self Vijay", "Myself Vijay", "Self, Vijay", "I am Vijay", "My name is Vijay", "This is Vijay", "I'm Vijay", "Call me Vijay", "ಹೆಸರು ವಿಜಯ್", "ನನ್ನ ಹೆಸರು ವಿಜಯ್", "मेरा नाम विजय है"
    const introRegex = /(?:myself(?:\s+is)?|self(?:,|:)?|my name is|i am|i'm|this is|call me|name is|it's|its|ನನ್ನ ಹೆಸರು|ಹೆಸರು|ನಾನು|मेरा नाम|नाम है|नाम)\s+([A-Za-z\u0C80-\u0CFF\u0900-\u097F]+(?:\s+[A-Za-z\u0C80-\u0CFF\u0900-\u097F]+)?)/i;
    const match = t.match(introRegex);
    if (match && match[1]) {
      const candidate = match[1].replace(/[,.:;]+$/, '').trim();
      const cleaned = this.cleanExtractedName(candidate);
      if (cleaned) return cleaned;
    }

    // 2. Direct 1-3 words where one of the words is an Indian / English proper name (e.g. "Vijay", "Vijay Kumar", "Basavaraj Patil")
    // First remove conversational leading words like "Self,", "Myself", "Hi", "Hello"
    let stripped = t.replace(/^(?:self[,:]?|myself|hi|hello|hey|namaste|namaskara|vanakkam|ನಮಸ್ಕಾರ|नमस्ते)\s+/i, '').trim();
    stripped = stripped.replace(/[.,!?;:]+$/, '').trim();

    const words = stripped.split(/\s+/).filter(Boolean);
    if (words.length >= 1 && words.length <= 3) {
      const cleaned = this.cleanExtractedName(words.join(' '));
      if (cleaned) return cleaned;
    }

    return null;
  }

  public detectLocation(text: string): string | null {
    const t = text.trim();
    const commonLocations = [
      'Bengaluru', 'Bangalore', 'Kalaburagi', 'Gulbarga', 'Mysuru', 'Mysore', 'Hubballi', 'Hubli',
      'Belagavi', 'Belgaum', 'Dharwad', 'Mangaluru', 'Mangalore', 'Shivamogga', 'Udupi', 'Ballari',
      'Bellary', 'Vijayapura', 'Bijapur', 'Tumakuru', 'Tumkur', 'Raichur', 'Bidar', 'Davangere',
      'Hassan', 'Mandya', 'Chikkamagaluru', 'Kolar', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Delhi'
    ];
    for (const loc of commonLocations) {
      if (t.toLowerCase().includes(loc.toLowerCase())) {
        return `${loc}, Karnataka Hub`;
      }
    }
    const locRegex = /(?:from|in|at|city|district|living in|stays in|ಬೆಂಗಳೂರು|ಕಲಬುರಗಿ|ಮೈಸೂರು|ಹುಬ್ಬಳ್ಳಿ|ಬೆಳಗಾವಿ|ಧಾರವಾಡ|ಮಂಗಳೂರು|ಶಿವಮೊಗ್ಗ|ಉಡುಪಿ|ಬಳ್ಳಾರಿ|विजयपुर|బెంగళూరు|నగరం|హైదరాబాద్|చెన్నై|पुणे|दिल्ली)\s+([A-Za-z\u0C80-\u0CFF\u0900-\u097F]+)/i;
    const match = t.match(locRegex);
    if (match && match[1]) {
      const cand = match[1].trim();
      if (cand.length >= 3) return `${cand}, India`;
    }
    return null;
  }

  public detectEducation(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes('engineering') || t.includes('b.e') || t.includes('btech') || t.includes('b.tech') || t.includes('mtech') || t.includes('m.tech') || t.includes('bachelor of engineering')) {
      return 'Bachelor of Engineering (B.E. / B.Tech)';
    }
    if (t.includes('degree') || t.includes('graduate') || t.includes('graduation') || t.includes('b.sc') || t.includes('bsc') || t.includes('b.com') || t.includes('bcom') || t.includes('ba ') || t.includes('b.a')) {
      return 'Undergraduate University Degree';
    }
    if (t.includes('diploma') || t.includes('polytechnic')) {
      return 'Technical Diploma';
    }
    if (t.includes('iti') || t.includes('vocational')) {
      return 'ITI Vocational Certificate';
    }
    if (t.includes('12th') || t.includes('puc') || t.includes('inter') || t.includes('higher secondary')) {
      return 'Higher Secondary (12th / PUC)';
    }
    if (t.includes('10th') || t.includes('sslc') || t.includes('matric') || t.includes('secondary school')) {
      return 'Secondary School (10th / SSLC)';
    }
    return null;
  }

  private detectOccupation(text: string): string | null {
    const t = text.toLowerCase();

    // 1. Civil Services / IAS / IPS / Police / Public Administration
    if (
      t.includes('civil service') || t.includes('ias') || t.includes('ips') || t.includes('police') ||
      t.includes('upsc') || t.includes('kpsc') || t.includes('psc') || t.includes('government officer') ||
      t.includes('public admin') || t.includes('governance') || t.includes('ಸಿವಿಲ್') || t.includes('ಐಎಎಸ್') || t.includes('ಐಪಿಎಸ್')
    ) {
      if (t.includes('event') || t.includes('catering') || t.includes('engineer')) {
        return 'Engineering Student & Event Management / Civil Services Aspirant';
      }
      return 'Civil Services (IAS / IPS) & Public Administration Aspirant';
    }

    // 2. Event Management & Catering
    if (t.includes('event') || t.includes('catering') || t.includes('hospitality') || t.includes('hotel') || t.includes('ಇವೆಂಟ್') || t.includes('ಕ್ಯಾಟರಿಂಗ್')) {
      if (t.includes('engineer') || t.includes('study')) {
        return 'Engineering Student & Event Management / Catering Assistant';
      }
      return 'Event Management & Catering Assistant';
    }

    // 3. Software, AI & Computer Engineering
    if (t.includes('software') || t.includes('engineer') || t.includes('comput') || t.includes('code') || t.includes('developer') || t.includes('agent') || t.includes('python') || t.includes('it professional') || t.includes('ಕಂಪ್ಯೂಟರ್') || t.includes('ಇಂಜಿನಿಯರ್') || t.includes('ಸಾಫ್ಟ್‌ವೇರ್')) {
      return 'Software Engineering & AI Agent Development';
    }

    // 4. Student, Academic, College & Degree Studies
    if (
      t.includes('student') || t.includes('college') || t.includes('school') || t.includes('studies') ||
      t.includes('undergrad') || t.includes('graduate') || t.includes('degree') || t.includes('diploma') ||
      t.includes('ವಿದ್ಯಾರ್ಥಿ') || t.includes('ಸ್ಟೂಡೆಂಟ್') || t.includes('छात्र') || t.includes('विद्यार्थी')
    ) {
      if (t.includes('engineer') || t.includes('software') || t.includes('tech') || t.includes('comput') || t.includes('cs') || t.includes('it')) {
        return 'Engineering Student & Technology Skilling Candidate';
      }
      if (t.includes('civil') || t.includes('ias') || t.includes('upsc') || t.includes('admin')) {
        return 'Civil Services (IAS / IPS) Aspirant & College Student';
      }
      if (t.includes('event') || t.includes('cater')) {
        return 'Engineering Student & Event Management / Catering Assistant';
      }
      return 'Student / Higher Education & Professional Career Candidate';
    }

    // 5. Healthcare & Nursing
    if (t.includes('nurse') || t.includes('health') || t.includes('asha') || t.includes('clinic') || t.includes('medical') || t.includes('hospital') || t.includes('ಆಶಾ') || t.includes('ನರ್ಸ್')) {
      return 'Healthcare & Community Nursing Assistance';
    }

    // 6. Electrical & Solar
    if (t.includes('electr') || t.includes('wireman') || t.includes('solar') || t.includes('panel') || t.includes('ವಿದ್ಯುತ್') || t.includes('ವೈರ್ಮನ್') || t.includes('बिजली') || t.includes('वायरमैन')) {
      return 'Electrical & Solar Power Systems';
    }

    // 7. Tailoring & Apparel
    if (t.includes('tailor') || t.includes('stitch') || t.includes('dress') || t.includes('cloth') || t.includes('sewing') || t.includes('garment') || t.includes('ಟೈಲರ್') || t.includes('ಬಟ್ಟೆ') || t.includes('दर्जी') || t.includes('सिलाई')) {
      return 'Tailoring & Garment Manufacturing';
    }

    // 8. Carpentry & Masonry
    if (t.includes('carpent') || t.includes('wood') || t.includes('mason') || t.includes('plumb') || t.includes('construct') || t.includes('ಮೇಸ್ತ್ರಿ') || t.includes('ಬಡಗಿ') || t.includes('ಪ್ಲಂಬರ್')) {
      return 'Construction, Carpentry & Plumbing';
    }

    // 9. Driving & Automotive
    if (t.includes('driver') || t.includes('cab') || t.includes('auto') || t.includes('mechanic') || t.includes('vehicle') || t.includes('ಡ್ರೈವರ್') || t.includes('ಮೆಕ್ಯಾನಿಕ್')) {
      return 'Automotive Repair & Commercial Driving';
    }

    // 10. Retail & Small Business
    if (t.includes('shop') || t.includes('store') || t.includes('retail') || t.includes('sales') || t.includes('kirana') || t.includes('ಅಂಗಡಿ') || t.includes('ದೊಕಾನ್')) {
      return 'Retail Store & Small Business Management';
    }

    // 11. Agriculture (Only when agricultural terms are explicitly present)
    if (t.includes('farm') || t.includes('agri') || t.includes('crop') || t.includes('farmer') || t.includes('dairy') || t.includes('tractor') || t.includes('soil') || t.includes('ಕೃಷಿ') || t.includes('ರೈತ') || t.includes('किसान') || t.includes('खेती')) {
      return 'Agriculture & Sustainable Crop Farming';
    }

    return null;
  }

  private detectTools(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes('civil') || t.includes('ias') || t.includes('ips') || t.includes('upsc') || t.includes('police') || t.includes('law') || t.includes('study')) {
      return 'Competitive Study Materials, Legal References, Government Reports & Digital Portals';
    }
    if (t.includes('event') || t.includes('cater') || t.includes('hotel') || t.includes('hospitality')) {
      return 'Event Logistics Schedules, Catering Kitchenware & Vendor Coordination Systems';
    }
    if (t.includes('comput') || t.includes('laptop') || t.includes('python') || t.includes('code') || t.includes('system') || t.includes('engineer') || t.includes('ಕಂಪ್ಯೂಟರ್')) {
      return 'Computer Systems, Code Editors & Cloud Development Tools';
    }
    if (t.includes('student') || t.includes('college') || t.includes('study') || t.includes('academic') || t.includes('book') || t.includes('course') || t.includes('ವಿದ್ಯಾರ್ಥಿ') || t.includes('छात्र')) {
      return 'Academic Course Materials, Digital Learning Platforms & Computer Systems';
    }
    if (t.includes('nurse') || t.includes('health') || t.includes('medical') || t.includes('clinic')) {
      return 'Diagnostic Monitoring Kits, BP Gauges, Patient Charts & Health Informatics';
    }
    if (t.includes('multimeter') || t.includes('drill') || t.includes('wire') || t.includes('tester') || t.includes('solar')) {
      return 'Digital Multimeters, Wire Strippers & Circuit Testers';
    }
    if (t.includes('sewing') || t.includes('scissor') || t.includes('needle') || t.includes('machine') || t.includes('tailor')) {
      return 'Motorized Sewing Machines, Pattern Cutters & Overlock Tools';
    }
    if (t.includes('wrench') || t.includes('spanner') || t.includes('jack') || t.includes('toolkit')) {
      return 'Mechanical Toolkits, Wrenches & Diagnostic Scanners';
    }
    if (t.includes('tractor') || t.includes('pump') || t.includes('drip') || t.includes('plough')) {
      return 'Tractors, Drip Irrigation Valves & Agricultural Implements';
    }
    return null;
  }

  private detectAspiration(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes('ias') || t.includes('ips') || t.includes('civil service') || t.includes('police') || t.includes('upsc') || t.includes('government officer') || t.includes('public admin')) {
      return 'Civil Services Examination (IAS / IPS / State PSC) & Public Administration Leadership';
    }
    if (t.includes('event') || t.includes('cater') || t.includes('hotel') || t.includes('hospitality')) {
      return 'Commercial Event Production, Corporate Hospitality & Large-Scale Operations';
    }
    if (t.includes('ai') || t.includes('artificial') || t.includes('intelligence') || t.includes('machine learning') || t.includes('deep learning') || t.includes('cloud')) {
      return 'Applied Artificial Intelligence, Cloud Systems & Agent Architecture';
    }
    if (t.includes('student') || t.includes('placement') || t.includes('job') || t.includes('exam') || t.includes('campus') || t.includes('career') || t.includes('degree') || t.includes('graduat')) {
      return 'Graduate Campus Placement, Competitive Examinations & Industry Skill Certification';
    }
    if (t.includes('health') || t.includes('nurse') || t.includes('hospital') || t.includes('medical')) {
      return 'Advanced Clinical Nursing, Emergency Triage & Hospital Coordination';
    }
    if (t.includes('cad') || t.includes('boutique') || t.includes('export') || t.includes('fashion')) {
      return 'Digital CAD Pattern Design & Commercial Boutique Production';
    }
    if (t.includes('solar') || t.includes('ev') || t.includes('electric vehicle')) {
      return 'Electric Vehicle Servicing & Certified Solar Grid Installation';
    }
    if (t.includes('farm') || t.includes('crop') || t.includes('drip') || t.includes('drone')) {
      return 'Precision Drip Automation, Drone Monitoring & Solar Irrigation';
    }
    return null;
  }

  private extractNumericYears(text: string): number | null {
    const t = text.toLowerCase();
    if (t.includes('zero') || t.includes('0 year') || t.includes('0 yr') || t.includes('no experience') || t.includes('zero experience')) return 0;
    if (t.includes('one') || t.includes('1 year') || t.includes('1 yr') || t.includes('ಒಂದು') || t.includes('एक')) return 1;
    if (t.includes('two') || t.includes('2 year') || t.includes('2 yr') || t.includes('ಎರಡು') || t.includes('दो')) return 2;
    if (t.includes('three') || t.includes('3 year') || t.includes('3 yr') || t.includes('ಮೂರು') || t.includes('तीन')) return 3;
    if (t.includes('four') || t.includes('4 year') || t.includes('4 yr') || t.includes('ನಾಲ್ಕು') || t.includes('चार')) return 4;
    if (t.includes('five') || t.includes('5 year') || t.includes('5 yr') || t.includes('ಐದು') || t.includes('पाँच')) return 5;
    if (t.includes('six') || t.includes('6 year')) return 6;
    if (t.includes('seven') || t.includes('7 year')) return 7;
    if (t.includes('eight') || t.includes('8 year')) return 8;
    if (t.includes('nine') || t.includes('9 year')) return 9;
    if (t.includes('ten') || t.includes('10 year')) return 10;

    const match = text.match(/\b\d+\b/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 0 && num <= 45) return num;
    }
    return null;
  }

  public isAffirmative(text: string): boolean {
    const t = text.toLowerCase().trim();
    if (t === 'confirmed_yes' || t === 'yes' || t === 'y') return true;
    const regex = /\b(yes|confirm|confirmed|correct|accurate|right|true|sure|perfect|fine|done|ok|okay|proceed|yep|yeah|yup|agree|agreed|approved|save|continue)\b/i;
    if (regex.test(t)) return true;
    const phrases = [
      'that is correct', 'thats correct', 'it is correct', 'its correct', 'it is confirmed', 'its confirmed',
      'that is right', 'thats right', 'it is right', 'its right', 'looks good', 'all good', 'go ahead',
      'ಹೌದು', 'ಸರಿ', 'ಸರಿಯಾಗಿದೆ', 'ಖಂಡಿತ', 'ಖಚಿತ', 'ಖಚಿತಪಡಿಸಿ', 'ಮುಂದುವರಿಯಿರಿ', 'ಕನ್ಫರ್ಮ್', 'ಸರಿ ಇದೆ', 'ಹೌದ', 'ಅಸ್ತು', 'ನಿಜ', 'ಕರೆಕ್ಟ್',
      'हाँ', 'हाँजी', 'सही', 'बिल्कुल', 'कन्फर्म', 'कन्फर्म है', 'पुष्टि', 'पक्का', 'ठीक', 'ठीक है', 'आगे बढ़ें', 'स्वीकृत', 'करेक्ट', 'सही है',
      'అవును', 'సరే', 'ఖరారు', 'ஆம்', 'சரி', 'உறுதி', 'होय', 'बरोबर', 'योग्य'
    ];
    return phrases.some(p => t === p || t.includes(p));
  }

  public isNegative(text: string): boolean {
    const t = text.toLowerCase().trim();
    if (t === 'correction_no' || t === 'no' || t === 'n') return true;
    const keywords = ['no', 'wrong', 'incorrect', 'not', 'change', 'ಇಲ್ಲ', 'ತಪ್ಪು', 'ಅಲ್ಲ', 'ತಿದ್ದು', 'नहीं', 'गलत', 'कादु', 'இல்லை', 'नाही'];
    return keywords.some(kw => t.includes(kw));
  }

  public getDefaultToolsForSector(occ: string): string {
    const o = occ.toLowerCase();
    if (o.includes('software') || o.includes('ai') || o.includes('engineer') || o.includes('code') || o.includes('comput')) {
      return 'Computer Systems, Code Editors & Cloud Development Tools';
    }
    if (o.includes('civil') || o.includes('ias') || o.includes('ips') || o.includes('upsc') || o.includes('admin')) {
      return 'Competitive Study Materials, Legal References & Governance Portals';
    }
    if (o.includes('event') || o.includes('catering') || o.includes('hotel') || o.includes('hospitality')) {
      return 'Event Logistics Schedules, Catering Equipment & Client Coordination Tools';
    }
    if (o.includes('nurse') || o.includes('health') || o.includes('medical')) {
      return 'Diagnostic Monitoring Kits, Patient Care Systems & Health Informatics';
    }
    if (o.includes('electr') || o.includes('solar') || o.includes('wireman')) {
      return 'Digital Multimeters, Wire Strippers & Circuit Testers';
    }
    if (o.includes('tailor') || o.includes('garment') || o.includes('sewing')) {
      return 'Motorized Sewing Machines, Pattern Cutters & Overlock Tools';
    }
    if (o.includes('farm') || o.includes('agri') || o.includes('crop') || o.includes('tractor')) {
      return 'Tractors, Drip Irrigation Valves & Agricultural Implements';
    }
    if (o.includes('student') || o.includes('college') || o.includes('study')) {
      return 'Academic Course Materials, Digital Learning Platforms & Computer Systems';
    }
    return 'Standard Professional Tools & Systems';
  }

  public getDefaultAspirationForSector(occ: string): string {
    const o = occ.toLowerCase();
    if (o.includes('software') || o.includes('ai') || o.includes('engineer') || o.includes('code') || o.includes('comput')) {
      return 'Applied Artificial Intelligence, Cloud Systems & Agent Architecture';
    }
    if (o.includes('civil') || o.includes('ias') || o.includes('ips') || o.includes('upsc') || o.includes('admin')) {
      return 'Civil Services Examination (IAS / IPS / State PSC) & Public Administration Leadership';
    }
    if (o.includes('event') || o.includes('catering') || o.includes('hotel') || o.includes('hospitality')) {
      return 'Commercial Event Production, Corporate Hospitality & Large-Scale Operations';
    }
    if (o.includes('nurse') || o.includes('health') || o.includes('medical')) {
      return 'Advanced Clinical Nursing, Emergency Triage & Hospital Coordination';
    }
    if (o.includes('electr') || o.includes('solar') || o.includes('wireman')) {
      return 'Electric Vehicle Servicing & Certified Solar Grid Installation';
    }
    if (o.includes('tailor') || o.includes('garment') || o.includes('sewing')) {
      return 'Digital CAD Pattern Design & Commercial Boutique Production';
    }
    if (o.includes('farm') || o.includes('agri') || o.includes('crop') || o.includes('tractor')) {
      return 'Precision Drip Automation, Drone Monitoring & Solar Irrigation';
    }
    if (o.includes('student') || o.includes('college') || o.includes('study')) {
      return 'Graduate Placement, Competitive Examinations & Industry Skill Certification';
    }
    return 'Career Growth, Professional Certification & Leadership';
  }

  public async generateFullAIProfile(
    lang: SupportedLanguage,
    history: DialogueTurn[],
    existingProfile?: Partial<LivelihoodProfile>
  ): Promise<LivelihoodProfile> {
    const occ = this.slots.occupation || 'Engineering Student & Event Management / Civil Services Aspirant';
    const exp = this.slots.experienceYears !== null ? this.slots.experienceYears : 1;
    const rawTools = this.slots.toolsEquipment || 'Standard Professional Tools & Systems';
    const asp = this.slots.aspiration || 'Career Growth & Public Leadership';

    // 1. Try Live Gemini Models First
    if (this.geminiKey && this.activeProvider !== 'local') {
      try {
        const ai = new GoogleGenAI({ apiKey: this.geminiKey });
        const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];

        const systemPrompt = `You are the Chief NSQF Skill Architect and National Government Welfare Policy Engine of India.
Target Output Language for display: "${lang}".

CRITICAL INSTRUCTIONS:
Analyze the citizen's exact background from their conversation and slots:
- Occupation: "${occ}"
- Experience: ${exp} years
- Tools & Implements: "${rawTools}"
- Career Aspiration: "${asp}"
- Conversation History:
${history.map(h => `${h.speaker.toUpperCase()}: ${h.text}`).join('\n')}

Generate a 100% customized, AI-reasoned, high-fidelity National Livelihood & Skilling Profile for this citizen.
NEVER default to agriculture or unrelated sectors unless the user is specifically a farmer.
- For students preparing for Civil Services / IAS / IPS, generate UPSC/KPSC coaching schemes (e.g. Dr. Ambedkar Central Free Coaching Scheme), governance skills, general studies gaps, and administration roadmaps.
- For event management / catering / hospitality, generate Hunar Se Rozgar Tak (HSRT), PMKVY 4.0 Event Operations, and commercial logistics schemes.
- For software / engineering / AI, generate IT, AI Agent, and cloud emerging technology skilling programs.
- For healthcare / nursing, generate Ayushman Bharat & Healthcare Sector Skill Council schemes.
- For electrical / solar, generate PM Surya Ghar Muft Bijli Skilling & EV tech programs.

Respond with strict JSON matching this schema:
{
  "id": "profile-${Date.now()}",
  "citizenName": string,
  "occupation": string (Synthesized exact occupation title),
  "experienceYears": number,
  "education": string (Inferred education level),
  "location": string,
  "currentSkills": [
    { "name": string, "icon": string (single emoji) }
  ] (4-6 realistic skills extracted from their conversation),
  "structuredCategories": [ string, string, string, string ] (4 competency domains),
  "toolsEquipment": [ string, string, string, string ] (4 specific tools/software/systems they use or learn),
  "targetAspiration": string,
  "mappingConfidence": number (92-99),
  "evidences": [
    {
      "userQuote": string,
      "extractedSkill": string,
      "structuredCategory": string,
      "confidenceScore": number
    }
  ] (2-4 quote-evidence pairs),
  "skillGap": {
    "id": "gap-${Date.now()}",
    "currentSkills": [ string, string, string, string ] (starting with "✓ "),
    "targetCapability": string,
    "gapSkills": [ string, string, string, string ] (starting with "⚠️ ")
  },
  "matchedPrograms": [
    {
      "id": string,
      "title": string (Official Government Scheme or National Program Name),
      "provider": string (Ministry / Department),
      "category": string,
      "eligibility": string,
      "matchPercentage": number (88-98),
      "rankBadge": "BEST MATCH" | "SECOND OPTION" | "THIRD OPTION",
      "whyMatched": [ string, string, string ],
      "aiExplanation": string,
      "skillsGained": [ string, string, string, string ],
      "duration": string,
      "mode": string,
      "stipend": string,
      "toolkitGrant": string,
      "loanSupport": string,
      "officialPortalUrl": string,
      "matchFactors": {
        "occupationMatch": number,
        "skillMatch": number,
        "interestMatch": number,
        "eligibilityMatch": number,
        "locationMatch": number
      }
    }
  ] (2-3 top matched official programs),
  "roadmap": [
    { "weekRange": "Days 1–30", "title": string, "description": string, "milestone": string, "icon": string },
    { "weekRange": "Days 31–60", "title": string, "description": string, "milestone": string, "icon": string },
    { "weekRange": "Days 61–90", "title": string, "description": string, "milestone": string, "icon": string }
  ],
  "isConfirmed": true,
  "confirmedAt": "${new Date().toISOString()}"
}`;

        for (const model of modelsToTry) {
          try {
            const res = await ai.models.generateContent({
              model,
              contents: 'Generate the complete JSON profile for this citizen.',
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json'
              }
            });
            const text = res.text?.trim();
            if (text) {
              const parsed = JSON.parse(text);
              if (parsed.occupation && parsed.currentSkills && parsed.matchedPrograms && parsed.matchedPrograms.length > 0) {
                parsed.id = parsed.id || `profile-${Date.now()}`;
                parsed.citizenName = parsed.citizenName || this.slots.citizenName || (lang === 'kn' ? 'ಅರ್ಜಿದಾರ (Citizen)' : lang === 'hi' ? 'नागरिक (Citizen)' : 'Applicant (Citizen)');
                parsed.location = parsed.location || this.slots.location || 'Karnataka Hub';
                parsed.education = parsed.education || this.slots.education || 'Higher Secondary / Degree Foundation';
                parsed.isConfirmed = true;
                parsed.confirmedAt = new Date().toISOString();
                parsed.matchedPrograms = parsed.matchedPrograms.map((p: any) => ({
                  ...p,
                  officialPortalUrl: sanitizeOfficialPortalUrl(p.officialPortalUrl, p.title)
                }));
                const saved = databaseService.saveBeneficiary(parsed as LivelihoodProfile);
                return saved.profile;
              }
            }
          } catch (modelErr) {
            console.warn(`Gemini profile gen with ${model} failed:`, modelErr);
          }
        }
      } catch (err) {
        console.warn('Gemini generateFullAIProfile failed:', err);
      }
    }

    // 2. Try Groq Cloud if Gemini is unavailable
    if (this.grokKey && this.activeProvider !== 'local') {
      try {
        const isGroqCloud = this.grokKey.startsWith('gsk_');
        const endpoint = isGroqCloud ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
        const models = isGroqCloud ? ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'groq/compound-mini'] : ['grok-2-latest'];

        for (const model of models) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.grokKey}`
              },
              body: JSON.stringify({
                model,
                messages: [
                  {
                    role: 'system',
                    content: `You are the Chief NSQF Skill Architect of India. Generate a 100% customized JSON LivelihoodProfile for:
Candidate Name: ${this.slots.citizenName || 'Citizen'}, Location: ${this.slots.location || 'Karnataka'}, Trade: ${occ}, Experience: ${exp} yrs, Tools: ${rawTools}, Aspiration: ${asp}.
Target language for display: "${lang}".
Include: id, citizenName, occupation, experienceYears, education, location, currentSkills (array of 4 objects with name & icon emoji), structuredCategories (4 strings), toolsEquipment (4 strings), targetAspiration, mappingConfidence (95-99), evidences (2 quote objects), skillGap (currentSkills starting with "✓ ", targetCapability, gapSkills starting with "⚠️ "), matchedPrograms (array of 2-3 government schemes with title, provider, category, eligibility, matchPercentage, rankBadge, whyMatched, aiExplanation, skillsGained, duration, mode, stipend, toolkitGrant, officialPortalUrl, matchFactors), roadmap (3 objects: Days 1–30, Days 31–60, Days 61–90), isConfirmed: true, confirmedAt.`
                  },
                  { role: 'user', content: 'Output the full customized JSON profile.' }
                ],
                response_format: { type: 'json_object' }
              })
            });

            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (parsed.occupation && parsed.currentSkills && parsed.matchedPrograms && parsed.matchedPrograms.length > 0) {
                parsed.id = parsed.id || `profile-${Date.now()}`;
                parsed.citizenName = parsed.citizenName || this.slots.citizenName || (lang === 'kn' ? 'ಅರ್ಜಿದಾರ (Citizen)' : lang === 'hi' ? 'नागरिक (Citizen)' : 'Applicant (Citizen)');
                parsed.location = parsed.location || this.slots.location || 'Karnataka Hub';
                parsed.education = parsed.education || this.slots.education || 'Higher Secondary / Degree Foundation';
                parsed.isConfirmed = true;
                parsed.confirmedAt = new Date().toISOString();
                parsed.matchedPrograms = parsed.matchedPrograms.map((p: any) => ({
                  ...p,
                  officialPortalUrl: sanitizeOfficialPortalUrl(p.officialPortalUrl, p.title)
                }));
                const saved = databaseService.saveBeneficiary(parsed as LivelihoodProfile);
                return saved.profile;
              }
            }
          } catch (mErr) {
            console.warn(`Groq model ${model} profile gen failed:`, mErr);
          }
        }
      } catch (grokErr) {
        console.warn('Groq profile gen failed:', grokErr);
      }
    }

    // 3. Fallback to Dynamic Multi-Sector Heuristic Engine
    return this.buildDynamicProfile(lang, existingProfile);
  }

  public buildDynamicProfile(lang: SupportedLanguage, _partial?: Partial<LivelihoodProfile>): LivelihoodProfile {
    const isKn = lang === 'kn';
    const isHi = lang === 'hi';

    const occ = this.slots.occupation || 'Engineering Student & Event Management / Civil Services Aspirant';
    const exp = this.slots.experienceYears !== null ? this.slots.experienceYears : 1;
    const rawTools = this.slots.toolsEquipment || 'Competitive Study Materials, Event Operations Logs & Digital Productivity Systems';
    const asp = this.slots.aspiration || 'Civil Services Examination (IAS / IPS / State PSC) & Public Administration Leadership';

    const parsedTools = parseToolTokens(rawTools);
    const matchedPrograms = getMatchedProgramsForProfile(occ, asp);

    const occLower = occ.toLowerCase();
    const aspLower = asp.toLowerCase();
    const combined = `${occLower} ${aspLower}`;

    const isStudent = combined.includes('student') || combined.includes('academic') || combined.includes('college') || combined.includes('study') || combined.includes('studies') || combined.includes('degree') || combined.includes('diploma') || combined.includes('ವಿದ್ಯಾರ್ಥಿ') || combined.includes('छात्र');
    const isCivilServices = combined.includes('civil') || combined.includes('ias') || combined.includes('ips') || combined.includes('police') || combined.includes('upsc') || combined.includes('kpsc') || combined.includes('public admin') || combined.includes('governance');
    const isEventHospitality = combined.includes('event') || combined.includes('cater') || combined.includes('hotel') || combined.includes('hospitality') || combined.includes('tourism');
    const isTech = combined.includes('comput') || combined.includes('software') || combined.includes('engineer') || combined.includes('developer') || combined.includes('ai') || combined.includes('agent') || combined.includes('python') || combined.includes('code');
    const isHealth = combined.includes('nurse') || combined.includes('health') || combined.includes('medical') || combined.includes('clinic') || combined.includes('hospital');
    const isElec = combined.includes('electr') || combined.includes('solar') || combined.includes('wireman') || combined.includes('power');
    const isTailor = combined.includes('tailor') || combined.includes('stitch') || combined.includes('dress') || combined.includes('cloth') || combined.includes('fashion');
    const isAuto = combined.includes('driver') || combined.includes('mechanic') || combined.includes('auto') || combined.includes('vehicle');
    const isAgri = combined.includes('farm') || combined.includes('crop') || combined.includes('tractor') || combined.includes('agri') || combined.includes('dairy');

    let education = 'Undergraduate Degree / Technical Diploma Foundation';
    let currentSkills = [
      { name: 'Digital Research & Analysis', icon: '📚' },
      { name: 'Core Domain Academics', icon: '🎓' },
      { name: 'Computer & Practical Literacy', icon: '💻' },
      { name: 'Team Collaboration & Presentation', icon: '🗣️' }
    ];

    let structuredCategories = [
      'Higher Education & Professional Skilling',
      'Digital Competencies & Emerging Tech',
      'Academic Foundations & Applied Projects',
      'National Apprenticeship & Placement Pathways'
    ];

    let skillGap: SkillGapItem = {
      id: `gap-${Date.now()}`,
      currentSkills: [
        '✓ Strong Academic Foundations & Conceptual Theory',
        '✓ Fast Learner & Digital Tools Research Aptitude',
        '✓ Collaborative Project Execution & Teamwork',
        '✓ Analytical Problem Solving & Fast Comprehension'
      ],
      targetCapability: 'Industry-Ready Graduate with Certified Practical NSQF Competencies & High-Growth Placement',
      gapSkills: [
        '⚠️ Hands-on Industry-Standard Frameworks & Automated Tooling',
        '⚠️ Recognized NSQF Professional Skill Certification',
        '⚠️ Corporate & Competitive Examination Problem-Solving Mastery',
        '⚠️ Technical Interview Protocols & Soft Skills Polish'
      ]
    };

    if (isCivilServices) {
      education = 'Bachelor of Engineering / University Degree Graduate';
      currentSkills = [
        { name: 'Analytical Aptitude & Critical Reasoning', icon: '🧠' },
        { name: 'Public Administration Awareness', icon: '🏛️' },
        { name: 'Event & Public Interaction Mastery', icon: '🗣️' },
        { name: 'Governance Case Study Analysis', icon: '📜' }
      ];

      structuredCategories = [
        'Civil Services (IAS / IPS / State PSC)',
        'Public Administration & Policy Delivery',
        'Constitutional Governance & Law',
        'National Leadership & Civil Administration'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Critical Thinking & Analytical Reasoning Base',
          '✓ Public Engagement & Practical Ground Experience',
          '✓ Multi-Disciplinary Engineering & Event Coordination',
          '✓ Broad Awareness of Public Governance Issues'
        ],
        targetCapability: 'Civil Services Officer (IAS/IPS) & Strategic Public Administration Leadership',
        gapSkills: [
          '⚠️ UPSC / State PSC General Studies Comprehensive Mastery',
          '⚠️ Constitutional Law, Indian Polity & Governance Systems',
          '⚠️ Ethics, Integrity & Administrative Aptitude (GS-IV)',
          '⚠️ Structured Essay Synthesis & Personality Interview Preparation'
        ]
      };
    } else if (isEventHospitality) {
      education = 'Event Management Diploma / Degree with Field Experience';
      currentSkills = [
        { name: 'Event Logistics & Stage Floor Coordination', icon: '🎪' },
        { name: 'Catering & Food Service Supervision', icon: '🍽️' },
        { name: 'Vendor Procurement & Budget Scheduling', icon: '📊' },
        { name: 'Crowd Protocol & Safety Management', icon: '🛡️' }
      ];

      structuredCategories = [
        'Tourism & Hospitality Operations',
        'Event Management & Convention Planning',
        'Food & Beverage Service Management',
        'Corporate Logistics & Client Relations'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Hands-on Floor Coordination & Banquet Setup',
          '✓ Catering Service & Vendor Management',
          '✓ Fast-Paced Ground Problem Resolution',
          '✓ Customer Care & Client Communication'
        ],
        targetCapability: 'Certified Event Operations Manager & Commercial Hospitality Enterprise Lead',
        gapSkills: [
          '⚠️ Large-Scale Event Digital Scheduling & CAD Floor Layouts',
          '⚠️ Commercial Financial Budgeting & Contract Negotiations',
          '⚠️ FSSAI Food Safety Compliance & National Tourism Protocols',
          '⚠️ Digital Marketing & Corporate Client Acquisition'
        ]
      };
    } else if (isTech) {
      education = "Bachelor's Degree / Technical Certification in Computing & AI";
      currentSkills = [
        { name: 'Python, JavaScript & Programming Logic', icon: '💻' },
        { name: 'AI Agents & LLM Integration', icon: '🤖' },
        { name: 'Git, GitHub & Version Control', icon: '⚙️' },
        { name: 'API Design, Full-Stack & Cloud Systems', icon: '🌐' }
      ];

      structuredCategories = [
        'Information Technology (IT-ITeS)',
        'Artificial Intelligence & Data Engineering',
        'Software Engineering & Cloud Architecture',
        'Autonomous Agent Systems'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Core Software Engineering & Programming Logic',
          '✓ AI Agent System Development & Tool Usage',
          '✓ Code Implementation, Debugging & Git Workflow',
          '✓ Data Structures & Cloud Foundations'
        ],
        targetCapability: 'Applied Artificial Intelligence, Machine Learning & Enterprise Agentic Systems',
        gapSkills: [
          '⚠️ Multi-Agent Orchestration Frameworks & Autonomous Tools',
          '⚠️ PyTorch / TensorFlow Neural Network Architectures',
          '⚠️ Cloud GPU Deployment & Scalable Inference Clusters',
          '⚠️ Vector Databases, Embeddings & RAG Architectures'
        ]
      };
    } else if (isStudent) {
      education = 'Undergraduate Degree / Academic Studies (In Progress)';
      currentSkills = [
        { name: 'Digital Research & Analytical Problem Solving', icon: '📚' },
        { name: 'Foundational Domain Academics & Projects', icon: '🎓' },
        { name: 'Computer & Information Literacy', icon: '💻' },
        { name: 'Team Collaboration & Presentation Skills', icon: '🗣️' }
      ];

      structuredCategories = [
        'Higher Education & Professional Skilling',
        'Digital Competencies & Emerging Tech',
        'Academic Foundations & Applied Projects',
        'National Apprenticeship & Placement Pathways'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Strong Academic Foundations & Conceptual Theory',
          '✓ Fast Learner & Digital Tools Research Aptitude',
          '✓ Collaborative Project Execution & Teamwork',
          '✓ Problem Analysis & Technical Presentation'
        ],
        targetCapability: 'Industry-Ready Graduate with Certified Practical NSQF Competencies & High-Growth Placement',
        gapSkills: [
          '⚠️ Hands-on Industry-Standard Frameworks & Automated Tooling',
          '⚠️ Professional NSQF Certification & Practical Project Portfolio',
          '⚠️ Corporate & Competitive Examination Problem-Solving Mastery',
          '⚠️ Technical Interview Protocols & Soft Skills Polish'
        ]
      };
    } else if (isHealth) {
      education = 'Paramedic / Nursing Assistant Certification';
      currentSkills = [
        { name: 'Patient Vitals & Clinical Observation', icon: '🩺' },
        { name: 'First Aid & Emergency Response', icon: '🚑' },
        { name: 'Infection Control & Medical Sanitation', icon: '🧼' },
        { name: 'Hospital Patient Assistance', icon: '🏥' }
      ];

      structuredCategories = [
        'Healthcare & Allied Medical Services',
        'General Duty & Patient Care',
        'Emergency Medical Assistance',
        'Community Health Management'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Patient Basic Care & Vital Sign Monitoring',
          '✓ Emergency First Aid & Dressing Protocols',
          '✓ Hospital Ward Cleanliness & Sanitation',
          '✓ Compassionate Patient Communication'
        ],
        targetCapability: 'Certified General Duty Assistant & Emergency Triage Medical Technician',
        gapSkills: [
          '⚠️ Advanced Pre-Hospital Life Support (BLS / ACLS)',
          '⚠️ Digital Health Records & Ayushman Bharat Portal Coordination',
          '⚠️ ICU Patient Monitoring & Medical Equipment Sterilization',
          '⚠️ Pharmacy Dispensation & Clinical Triage Standards'
        ]
      };
    } else if (isElec) {
      education = 'ITI Certified / Diploma in Electrical Engineering';
      currentSkills = [
        { name: 'Domestic & Commercial Conduit Wiring', icon: '⚡' },
        { name: 'Switchboard & MCB Assembly', icon: '🔌' },
        { name: 'Multimeter & Circuit Testing', icon: '🛠️' },
        { name: 'Motor & Pump Power Setup', icon: '⚙️' }
      ];

      structuredCategories = [
        'Power Infrastructure & Grid Systems',
        'Renewable Solar PV Energy',
        'Electrical Installations',
        'Industrial Maintenance'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Domestic & Commercial Conduit Wiring',
          '✓ Standard MCB & Distribution Board Assembly',
          '✓ Circuit Continuity & Voltage Troubleshooting',
          '✓ Basic Motor Starter Maintenance'
        ],
        targetCapability: 'Certified Grid-Tied Solar Rooftop, Smart Inverter & Green Power Specialist',
        gapSkills: [
          '⚠️ Rooftop Solar Array Design & DC Earthing Arrays',
          '⚠️ Smart Net-Metering & Grid-Tied Inverter Synchronization',
          '⚠️ Battery Energy Storage Systems (BESS) Integration',
          '⚠️ Solar Safety Regulations & MNRE Compliance Standards'
        ]
      };
    } else if (isTailor) {
      education = 'Apparel Vocational Training / Certified Craftsperson';
      currentSkills = [
        { name: 'Pattern Drafting & Custom Cutting', icon: '✂️' },
        { name: 'Motorized Sewing Machine Handling', icon: '🧵' },
        { name: 'Garment Fitting & Alterations', icon: '👗' },
        { name: 'Fabric Selection & Finishing', icon: '🪡' }
      ];

      structuredCategories = [
        'Apparel & Textiles',
        'Fashion Technology & Design',
        'Garment Manufacturing',
        'Boutique Entrepreneurship'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Manual Sewing Machine Stitching & Seam Finishing',
          '✓ Custom Measurements & Pattern Cutting',
          '✓ Everyday Garment Repair & Alterations',
          '✓ Basic Traditional Embroidery Work'
        ],
        targetCapability: 'Modern Industrial Garment Production, CAD Pattern Design & Boutique Enterprise',
        gapSkills: [
          '⚠️ High-Speed Motorized & Overlock Industrial Sewing Machines',
          '⚠️ CAD-Assisted Digital Pattern Drafting & Grading',
          '⚠️ Quality Control Standards for Export & High-Volume Boutiques',
          '⚠️ E-Commerce Cataloging & GeM Government Portal Selling'
        ]
      };
    } else if (isAuto) {
      education = 'Commercial Driving & Automotive Repair License';
      currentSkills = [
        { name: 'Commercial & Passenger Driving', icon: '🚗' },
        { name: 'Vehicle Routine Maintenance', icon: '🔧' },
        { name: 'Road Safety & GPS Navigation', icon: '📍' },
        { name: 'Basic Engine & Fluid Diagnostics', icon: '⚙️' }
      ];

      structuredCategories = [
        'Automotive & Transportation',
        'Vehicle Maintenance',
        'Commercial Logistics',
        'Electric Mobility'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Safe Commercial & Passenger Driving Practices',
          '✓ Routine Engine Oil & Coolant Maintenance',
          '✓ Basic Tyre & Brake Inspection',
          '✓ Navigation & Digital Route Management'
        ],
        targetCapability: 'Certified Electric Vehicle (EV) Fleet Diagnostic & Maintenance Specialist',
        gapSkills: [
          '⚠️ High-Voltage EV Powertrain & Battery Diagnostics',
          '⚠️ OBD-II Computerized Sensor Scanning',
          '⚠️ Regenerative Braking System Maintenance',
          '⚠️ NSQF Level 5 EV Service Technician'
        ]
      };
    } else if (isAgri) {
      education = 'Agricultural Vocational Training / Practical Field Practice';
      currentSkills = [
        { name: 'Traditional Field Cultivation', icon: '🌱' },
        { name: 'Irrigation management', icon: '💧' },
        { name: 'Tractor & Implement Operation', icon: '🚜' },
        { name: 'Field Maintenance', icon: '🌾' }
      ];

      structuredCategories = [
        'Agriculture & Allied Sectors',
        'Precision Irrigation',
        'Farm Machinery Operation',
        'Crop Production'
      ];

      skillGap = {
        id: `gap-${Date.now()}`,
        currentSkills: [
          '✓ Traditional Soil Cultivation & Field Prep',
          '✓ Manual & Drip Irrigation Control',
          '✓ Tractor & Farm Implement Operation',
          '✓ Harvest Handling & Field Maintenance'
        ],
        targetCapability: 'Modern Precision Agriculture, Automated Sensor Drip & Solar Farming',
        gapSkills: [
          '⚠️ Smart Sensor-Based Drip Automation',
          '⚠️ Digital Soil Health & Micro-Nutrient Mapping',
          '⚠️ Solar Agricultural Pumping & Net-Metering (PM-KUSUM)',
          '⚠️ Precision Agri-Drone Aerial Crop Monitoring'
        ]
      };
    }

    const evidences: SkillEvidence[] = [
      {
        userQuote: occ,
        extractedSkill: structuredCategories[0] || 'Primary Trade Competency',
        structuredCategory: structuredCategories[0] || 'Core Domain',
        confidenceScore: 98
      },
      {
        userQuote: `${exp} Year(s) of Practical Tenure & Practice`,
        extractedSkill: 'Applied Industry Practice & Capability',
        structuredCategory: structuredCategories[1] || 'Applied Skills',
        confidenceScore: 95
      },
      {
        userQuote: rawTools,
        extractedSkill: 'Equipment & Tooling Proficiency',
        structuredCategory: structuredCategories[2] || 'Tools & Implements',
        confidenceScore: 94
      },
      {
        userQuote: asp,
        extractedSkill: 'Aspirational Opportunity & Career Growth',
        structuredCategory: structuredCategories[3] || 'Future Skilling',
        confidenceScore: 96
      }
    ];

    const citizenName = this.slots.citizenName || (isKn ? 'ಅರ್ಜಿದಾರ (Citizen)' : isHi ? 'नागरिक (Citizen)' : 'Applicant (Citizen)');

    const resultProfile: LivelihoodProfile = {
      id: `profile-${Date.now()}`,
      citizenName,
      occupation: occ,
      experienceYears: exp,
      education: this.slots.education || education,
      location: this.slots.location || 'Karnataka Hub',
      currentSkills,
      structuredCategories,
      toolsEquipment: parsedTools,
      targetAspiration: asp,
      mappingConfidence: 96,
      evidences,
      skillGap,
      matchedPrograms,
      roadmap: DEFAULT_90_DAY_ROADMAP,
      isConfirmed: true,
      confirmedAt: new Date().toLocaleTimeString()
    };

    const saved = databaseService.saveBeneficiary(resultProfile);
    return saved.profile;
  }

  public buildCompleteProfile(lang: SupportedLanguage, _partial?: Partial<LivelihoodProfile>): LivelihoodProfile {
    return this.buildDynamicProfile(lang, _partial);
  }
}

export const agentPipeline = new AgentPipelineService();
