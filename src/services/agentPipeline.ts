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

export const INITIAL_AGENT_NODES: AgentNode[] = [
  { id: 'voice_agent', name: 'Voice Agent', icon: '🎙️', role: 'Captures multilingual audio and isolates speech intent', status: 'completed' },
  { id: 'understanding_agent', name: 'Speech Understanding Agent', icon: '📝', role: 'Semantic parsing, filtering & dialect normalization', status: 'pending' },
  { id: 'profile_agent', name: 'Livelihood Profile Agent', icon: '👤', role: 'Constructs structured persona, years, tools & trade context', status: 'pending' },
  { id: 'skill_mapping_agent', name: 'Skill Mapping Agent', icon: '🧠', role: 'Maps informal evidence to NSQF category levels', status: 'pending' },
  { id: 'confirmation_agent', name: 'Confirmation Agent', icon: '✅', role: 'Formulates spoken read-back verification loop', status: 'pending' },
  { id: 'skill_gap_agent', name: 'Skill-Gap Agent', icon: '📚', role: 'Analyzes capability gaps vs aspirational market targets', status: 'pending' },
  { id: 'program_matching_agent', name: 'Program Matching Agent', icon: '🎯', role: 'Ranks government schemes & computes 5-factor match score', status: 'pending' },
  { id: 'coordinator_agent', name: 'Coordinator Agent', icon: '🤖', role: 'Synthesizes 90-day roadmap and transparent explainability chain', status: 'pending' }
];

export interface CitizenSlots {
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

export class AgentPipelineService {
  private activeProvider: AIProvider = 'gemini';
  private geminiKey: string = '';
  private grokKey: string = '';
  private openAiKey: string = '';

  private slots: CitizenSlots = {
    occupation: null,
    experienceYears: null,
    toolsEquipment: null,
    aspiration: null
  };

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

  public resetInterview() {
    this.slots = {
      occupation: null,
      experienceYears: null,
      toolsEquipment: null,
      aspiration: null
    };
  }

  public getInitialGreeting(lang: SupportedLanguage): DialogueTurn {
    let text = '';
    let translation = '';

    switch (lang) {
      case 'kn':
        text = 'ನಮಸ್ಕಾರ! ಸಕ್ಷಮ್ ವಾಯ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕೆಲಸ, ಕೌಶಲ್ಯ ಮತ್ತು ಅನುಭವವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಸರ್ಕಾರಿ ಕೌಶಲ್ಯ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?';
        translation = 'Welcome! I am Saksham Voice. I will help you discover government skilling programs based on your skills. What work do you currently do?';
        break;
      case 'hi':
        text = 'नमस्ते! सक्षम वॉइस में आपका स्वागत है। आपके काम और कौशल के आधार पर सरकारी कौशल योजनाओं को खोजने में मैं आपकी मदद करूँगा। आप वर्तमान में क्या काम करते हैं?';
        translation = 'Welcome! I am Saksham Voice. I will help you discover government skilling schemes. What work do you currently do?';
        break;
      case 'te':
        text = 'నమస్కారం! సక్షమ్ వాయిస్‌కు స్వాగతం. మీ నైపుణ్యాలు మరియు పని ఆధారంగా ఉత్తమ ప్రభుత్వ నైపుణ్య పథకాలను కనుగొనడంలో నేను మీకు సహాయం చేస్తాను. మీరు ప్రస్తుతం ఏ పని చేస్తున్నారు?';
        translation = 'Welcome! I am Saksham Voice. What work do you currently do?';
        break;
      case 'ta':
        text = 'வணக்கம்! சக்ஷம் வாய்ஸுக்கு வரவேற்கிறோம். உங்கள் வேலை மற்றும் திறன்களின் அடிப்படையில் சிறந்த அரசு திறன் திட்டங்களை கண்டறிய நான் உதவுகிறேன். தற்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்?';
        translation = 'Welcome! I am Saksham Voice. What work do you currently do?';
        break;
      case 'mr':
        text = 'नमस्कार! सक्षम व्हॉईसमध्ये आपले स्वागत आहे. आपल्या कौशल्य आणि अनुभवाच्या आधारे सर्वोत्तम सरकारी कौशल्य योजना शोधण्यात मी मदत करेन. आपण सध्या कोणते काम करता?';
        translation = 'Welcome! I am Saksham Voice. What work do you currently do?';
        break;
      default:
        text = 'Hello and Welcome! I am Saksham Voice. Tell me about the work you currently do so I can discover the best government skilling programs for you.';
        translation = 'Hello and Welcome! I am Saksham Voice. Tell me about the work you currently do so I can discover the best government skilling programs for you.';
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
        observation: `Citizen session initiated in locale: "${lang}"`,
        deduplicationCheck: 'All 4 skill slots empty',
        decision: 'Greet warmly and inquire about primary occupation',
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

    // 1. Confirmation Screen Handling (YES / NO Branch)
    if (currentState === 'READBACK_CONFIRMATION') {
      const isNo = this.isNegative(textLower);

      if (isNo) {
        this.slots.occupation = null;
        this.slots.toolsEquipment = null;
        this.slots.aspiration = null;

        let prompt = '';
        let trans = '';
        switch (lang) {
          case 'kn':
            prompt = 'ಸರಿ, ನಾನು ಇದನ್ನು ತಿದ್ದುತ್ತೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸರಿಯಾದ ಮುಖ್ಯ ವೃತ್ತಿ ಮತ್ತು ಬಳಸುವ ಮುಖ್ಯ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.';
            trans = 'Understood. Please clearly tell me your exact trade and tools so I can adjust your profile.';
            break;
          case 'hi':
            prompt = 'ठीक है, मैं इसे सुधारता हूँ। कृपया अपने सही काम और मुख्य औजारों के बारे में बताएं।';
            trans = 'Understood. Please clearly tell me your exact trade and main tools.';
            break;
          default:
            prompt = 'Understood. Please clarify your exact trade and the tools you use so I can update your profile accurately.';
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
            observation: 'Citizen requested correction on summary',
            deduplicationCheck: 'Resetting occupation & tools slots for fresh extraction',
            decision: 'Prompt citizen for exact trade clarification',
            confidence: 95
          }
        };
      }

      // Citizen Said YES: Build final verified profile
      const finalProfile = this.buildDynamicProfile(lang, existingProfile);

      let successMsg = '';
      let trans = '';
      switch (lang) {
        case 'kn':
          successMsg = 'ಅದ್ಭುತ! ನಿಮ್ಮ ಕೌಶಲ್ಯ ವಿವರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ. ನಿಮಗಾಗಿ ಹೊಂದಿಕೆಯಾದ ಅತ್ಯುತ್ತಮ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಕೆಳಗೆ ಪ್ರಸ್ತುತಪಡಿಸಲಾಗಿದೆ!';
          trans = 'Awesome! Your verified skill profile, identified gaps, and matched government programs are ready below!';
          break;
        case 'hi':
          successMsg = 'शानदार! आपकी कौशल प्रोफ़ाइल सत्यापित हो गई है। आपके लिए चुनी गई सरकारी योजनाएं नीचे दी गई हैं!';
          trans = 'Great! Your verified profile and scheme recommendations are ready below!';
          break;
        default:
          successMsg = 'Success! Your verified skill profile, identified skill gaps, and matched government programs have been generated below.';
          trans = 'Success! Your verified profile and recommendations are ready below.';
      }

      return {
        spokenText: successMsg,
        englishTranslation: trans,
        nextState: 'RESULTS_VIEW',
        activeNodeId: 'coordinator_agent',
        updatedProfile: finalProfile,
        reasoningStep: {
          step: 'Verification & Program Ranking',
          observation: 'Citizen affirmed read-back summary (✓ YES)',
          deduplicationCheck: 'All 4 slots validated and confirmed by applicant',
          decision: 'Compute 5-factor match score and generate 90-day action roadmap',
          confidence: 98
        }
      };
    }

    // 2. Groq Cloud / xAI Grok LLM Reasoning if selected and key available
    if (this.activeProvider === 'grok' && this.grokKey) {
      try {
        const isGroqCloud = this.grokKey.startsWith('gsk_');
        const endpoint = isGroqCloud ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
        const model = isGroqCloud ? 'qwen/qwen3.8-27b' : 'grok-2-latest';

        const grokRes = await this.callOpenAICompatibleAgent(
          endpoint,
          this.grokKey,
          model,
          textTrimmed,
          lang,
          history
        );
        if (grokRes) return grokRes;
      } catch (err) {
        console.warn('Grok/Groq call failed, attempting Gemini fallback:', err);
      }
    }

    // 3. Gemini LLM Reasoning (Default when key available)
    if (this.geminiKey && this.activeProvider !== 'local') {
      try {
        const geminiRes = await this.callGeminiAgent(textTrimmed, lang, history);
        if (geminiRes) return geminiRes;
      } catch (err) {
        console.warn('Gemini Live API call failed, falling back to Grok:', err);
      }
    }

    // 4. Fallback to Grok / Groq if available
    if (this.grokKey && this.activeProvider !== 'local') {
      try {
        const isGroqCloud = this.grokKey.startsWith('gsk_');
        const endpoint = isGroqCloud ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
        const model = isGroqCloud ? 'qwen/qwen3.8-27b' : 'grok-2-latest';

        const grokRes = await this.callOpenAICompatibleAgent(
          endpoint,
          this.grokKey,
          model,
          textTrimmed,
          lang,
          history
        );
        if (grokRes) return grokRes;
      } catch (err) {
        console.warn('Grok fallback failed:', err);
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

    const systemInstruction = `
You are SAKSHAM VOICE (ಸಕ್ಷಮ್ ವಾಯ್ಸ್), an intelligent conversational AI agent for livelihood skill mapping and government skilling schemes across ALL Indian sectors (Civil Services, Engineering, Event Management, Healthcare, Tech, Power, Retail, Agriculture, Crafts, etc.).
Target Language: "${lang}". Respond strictly in language "${lang}".

CRITICAL REASONING & EXTRACTION RULES:
1. GREETINGS & INTRODUCTIONS:
   - If citizen says "Good morning", "Hello", "Hi", "Namaskara", "Namaste", greet them back politely, introduce yourself as Saksham Voice, and ask what kind of trade or work they do.
   - NEVER assign greetings as an occupation!

2. IDENTITY QUESTIONS:
   - If citizen asks "What is your name?" or "Who are you?": Explain you are Saksham Voice and ask what work they do.

3. ACCURATE OCCUPATION & ASPIRATION EXTRACTION:
   - Extract the EXACT trade or background mentioned by the user (e.g. "Engineering Student & Event Management / Civil Services Aspirant", "Software Engineer", "Event Coordinator & Catering Assistant", "Civil Services Aspirant (IAS/IPS)", "Electrician", "Tailor", "Farmer", "Nurse", etc.).
   - If user talks about Civil Services (IAS, IPS, Police Officer, UPSC, Government Exams), CAPTURE Civil Services as aspiration/goal!
   - If user talks about Event Management / Catering / Companies, CAPTURE that as their work/experience!
   - If user did not mention any job/work, set "extractedOccupation": null.

4. MULTI-SLOT EXTRACTION:
   - Extract all available slots: extractedOccupation, extractedExperienceYears, extractedTools, extractedAspiration.

5. READ-BACK SYNTHESIS:
   - When all 4 slots are known: Set "isReadyForReadback": true and formulate a clear spoken read-back asking for confirmation (YES/NO).

Respond in strict JSON with schema:
{
  "intent": "GREETING" | "IDENTITY" | "OFF_TOPIC" | "CLARIFICATION" | "SLOT_UPDATE" | "READBACK",
  "extractedOccupation": string or null,
  "extractedExperienceYears": number or null,
  "extractedTools": string or null,
  "extractedAspiration": string or null,
  "isReadyForReadback": boolean,
  "spokenText": string (must be in "${lang}"),
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

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

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

    const isReady = parsed.isReadyForReadback || isAllSlotsFilled;

    const reasoningStep: AgentReasoningStep = {
      step: 'Live Gemini 2.0 Flash LLM Reasoning',
      observation: parsed.reasoningObservation || `Analyzed intent: ${parsed.intent || 'CONVERSATION'}`,
      deduplicationCheck: `Slots: Occupation=${this.slots.occupation || 'none'}, Exp=${this.slots.experienceYears ?? 'none'}, Tools=${this.slots.toolsEquipment || 'none'}, Asp=${this.slots.aspiration || 'none'}`,
      decision: parsed.reasoningDecision || (isReady ? 'Formulate Spoken Readback' : 'Contextual Follow-up'),
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
      activeNodeId: 'understanding_agent',
      isReadbackPrompt: false,
      reasoningStep
    };
  }

  private async callOpenAICompatibleAgent(
    endpoint: string,
    apiKey: string,
    model: string,
    userInput: string,
    lang: SupportedLanguage,
    history: DialogueTurn[]
  ): Promise<AgentPipelineResponse | null> {
    const systemInstruction = `You are SAKSHAM VOICE, an intelligent conversational AI agent in language "${lang}".
Rules:
1. Do NOT treat greetings ("good morning", "hello") as an occupation.
2. If asked about your identity or name, explain you are Saksham Voice.
3. Extract occupation, experienceYears, toolsEquipment, and aspiration accurately without forcing default agriculture assumptions.
4. Respond in strict JSON format with keys: intent, extractedOccupation, extractedExperienceYears, extractedTools, extractedAspiration, isReadyForReadback, spokenText (in "${lang}"), englishTranslation, reasoningObservation, reasoningDecision, confidence.`;

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
        observation: `Extracted intent from: "${userInput}"`,
        deduplicationCheck: `Slots status: Occ=${this.slots.occupation || 'none'}, Exp=${this.slots.experienceYears ?? 'none'}`,
        decision: isReady ? 'Formulate Readback' : 'Contextual Next Slot',
        confidence: 94
      }
    };
  }

  private processContextualEngine(userInput: string, lang: SupportedLanguage): AgentPipelineResponse {
    const textLower = userInput.toLowerCase().trim();

    // 1. Check for Greetings (e.g. "Good morning", "Hello", "Namaskara")
    if (this.isGreeting(textLower)) {
      let greetResp = '';
      let trans = '';
      switch (lang) {
        case 'kn':
          greetResp = 'ಶುಭೋದಯ ಮತ್ತು ನಮಸ್ಕಾರ! ಸಕ್ಷಮ್ ವಾಯ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕೌಶಲ್ಯಕ್ಕೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಲು, ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ ಅಥವಾ ವೃತ್ತಿ ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸಿ.';
          trans = 'Good morning and welcome! To discover the best government skilling schemes for you, please tell me what trade or work you currently do.';
          break;
        case 'hi':
          greetResp = 'शुभ प्रभात और नमस्ते! सक्षम वॉइस में आपका स्वागत है। आपके लिए सही सरकारी योजनाएं खोजने के लिए, कृपया बताएं कि आप अभी क्या काम करते हैं?';
          trans = 'Good morning and welcome! Please tell me what trade or work you currently do.';
          break;
        default:
          greetResp = 'Good morning and welcome! I am Saksham Voice. To help you discover the best government skilling programs, please tell me what kind of work or trade you currently do.';
          trans = 'Good morning and welcome! Please tell me what kind of work or trade you currently do.';
      }

      return {
        spokenText: greetResp,
        englishTranslation: trans,
        nextState: 'INTERVIEW_OCCUPATION',
        activeNodeId: 'voice_agent',
        reasoningStep: {
          step: 'Conversational Greeting Filter',
          observation: `Recognized pleasantry/greeting: "${userInput}"`,
          deduplicationCheck: 'Preserved empty occupation slot (did not misclassify greeting as trade)',
          decision: 'Greet citizen warmly and ask for primary trade/occupation',
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
          identResp = 'ನನ್ನ ಹೆಸರು ಸಕ್ಷಮ್ ವಾಯ್ಸ್ (Saksham Voice). ನಾನು ಗ್ರಾಮೀಣ ಮತ್ತು ಅಸಂಘಟಿತ ವಲಯದ ಕಾರ್ಮಿಕರ ಕೌಶಲ್ಯಗಳನ್ನು ಗುರುತಿಸಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಒದಗಿಸುವ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸಹಾಯಕ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತೀರಿ?';
          trans = 'My name is Saksham Voice. I am an AI assistant that maps workers’ practical skills and connects them with government skilling schemes. What work do you do?';
          break;
        case 'hi':
          identResp = 'मेरा नाम सक्षम वॉइस (Saksham Voice) है। मैं आपके कौशल और काम को समझकर सही सरकारी प्रशिक्षण योजनाओं से जोड़ने वाला एआई एजेंट हूँ। आप क्या काम करते हैं?';
          trans = 'My name is Saksham Voice. I help connect your skills with government training schemes. What work do you do?';
          break;
        default:
          identResp = 'My name is Saksham Voice. I am an Agentic AI system built to recognize your practical skills and match you with government skilling programs and certifications. What work do you currently do?';
          trans = 'My name is Saksham Voice. What work do you currently do?';
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
          decision: 'Explain Saksham Voice role and gently prompt for trade',
          confidence: 98
        }
      };
    }

    // 3. Extract Numeric Experience Years if present
    const yearsFound = this.extractNumericYears(userInput);
    if (yearsFound !== null) {
      this.slots.experienceYears = yearsFound;
    }

    // 4. Extract Occupation & Aspirations dynamically
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

    // If occupation is still unknown and user provided generic noise, ask clarification
    if (!this.slots.occupation) {
      let clarifyMsg = '';
      let trans = '';
      switch (lang) {
        case 'kn':
          clarifyMsg = 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ವೃತ್ತಿ, ಅಧ್ಯಯನ ಅಥವಾ ಕೆಲಸವನ್ನು ತಿಳಿಸಿ (ಉದಾ: ಇಂಜಿನಿಯರಿಂಗ್, ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್, ಸಿವಿಲ್ ಸರ್ವೀಸಸ್, ಸಾಫ್ಟ್‌ವೇರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಕೃಷಿ, ಇತ್ಯಾದಿ).';
          trans = 'Please tell me your occupation or field (e.g. Engineering, Event Management, Civil Services, Software, Electrical, Farming).';
          break;
        case 'hi':
          clarifyMsg = 'कृपया अपने काम, पढ़ाई या व्यवसाय का नाम बताएं (जैसे: इंजीनियरिंग, इवेंट मैनेजमेंट, सिविल सेवा, सॉफ्टवेयर, इलेक्ट्रीशियन, आदि)।';
          trans = 'Please specify your occupation or field.';
          break;
        default:
          clarifyMsg = 'Could you please share your specific occupation, studies, or trade (for example: Engineering, Event Management, Civil Services, Software, Electrical, Tailoring, or Farming)?';
          trans = 'Could you please share your specific occupation, studies, or trade?';
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

    // If Experience Years is missing, ask for experience
    if (this.slots.experienceYears === null) {
      const occ = this.slots.occupation;
      let prompt = '';
      let trans = '';

      switch (lang) {
        case 'kn':
          prompt = `ಅದ್ಭುತ! ನೀವು "${occ}" ಕ್ಷೇತ್ರದಲ್ಲಿ ಎಷ್ಟು ಸಮಯ ಅಥವಾ ವರ್ಷಗಳಿಂದ ತೊಡಗಿಸಿಕೊಂಡಿದ್ದೀರಿ?`;
          trans = `Great! How many years of experience or practice do you have in ${occ}?`;
          break;
        case 'hi':
          prompt = `बहुत अच्छा! आप "${occ}" में कितने समय या सालों से जुड़े हुए हैं?`;
          trans = `Great! How many years of experience do you have in ${occ}?`;
          break;
        default:
          prompt = `Great! How many years of experience or practice do you have in ${occ}?`;
          trans = `Great! How many years of experience or practice do you have in ${occ}?`;
      }

      return {
        spokenText: prompt,
        englishTranslation: trans,
        nextState: 'INTERVIEW_EXPERIENCE',
        activeNodeId: 'profile_agent',
        reasoningStep: {
          step: 'Experience Duration Probing',
          observation: `Locked Occupation: "${this.slots.occupation}". Probing tenure.`,
          deduplicationCheck: 'Occupation is confirmed. Prompting experience tenure.',
          decision: 'Ask how many years they have practiced their craft or studies',
          confidence: 96
        }
      };
    }

    // If Tools is missing, ask for tools
    if (this.slots.toolsEquipment === null) {
      let prompt = '';
      let trans = '';

      switch (lang) {
        case 'kn':
          prompt = 'ನಿಮ್ಮ ಕೆಲಸ ಅಥವಾ ಅಧ್ಯಯನದಲ್ಲಿ ನೀವು ಬಳಸುವ ಮುಖ್ಯ ಉಪಕರಣಗಳು, ಸಾಫ್ಟ್‌ವೇರ್ ಅಥವಾ ಸಲಕರಣೆಗಳು ಯಾವುವು?';
          trans = 'What specific tools, equipment, software, or systems do you use in your daily work or studies?';
          break;
        case 'hi':
          prompt = 'आप अपने काम या अध्ययन में मुख्य रूप से कौन-से टूल्स, उपकरण या सॉफ्टवेयर इस्तेमाल करते हैं?';
          trans = 'What tools, equipment, or software do you use?';
          break;
        default:
          prompt = 'What specific tools, equipment, software platforms, or systems do you use in your work or studies?';
          trans = 'What specific tools, equipment, software platforms, or systems do you use in your work or studies?';
      }

      return {
        spokenText: prompt,
        englishTranslation: trans,
        nextState: 'INTERVIEW_TOOLS_ACTIVITIES',
        activeNodeId: 'profile_agent',
        reasoningStep: {
          step: 'Tooling & Implement Mapping',
          observation: `Captured Occupation: "${this.slots.occupation}", Tenure: ${this.slots.experienceYears} Years.`,
          deduplicationCheck: 'Tools slot is empty. Probing physical/digital implements.',
          decision: 'Inquire about daily equipment and tool usage',
          confidence: 95
        }
      };
    }

    // If Aspiration is missing, ask for aspirations
    if (this.slots.aspiration === null) {
      let prompt = '';
      let trans = '';

      switch (lang) {
        case 'kn':
          prompt = 'ನಿಮ್ಮ ಭವಿಷ್ಯದ ವೃತ್ತಿಜೀವನ ಮತ್ತು ಆಕಾಂಕ್ಷೆಗಳೇನು? (ಉದಾಹರಣೆಗೆ: ಸಿವಿಲ್ ಸರ್ವೀಸಸ್/IAS/IPS, ಹೈ-ಟೆಕ್ ಕೌಶಲ್ಯಗಳು, ಅಥವಾ ಉದ್ಯಮ)?';
          trans = 'What are your future career aspirations and goals (e.g. Civil Services/IAS/IPS, High-Tech skills, or Enterprise)?';
          break;
        case 'hi':
          prompt = 'आपके भविष्य के लक्ष्य और करियर आकांक्षाएं क्या हैं (जैसे: सिविल सेवा/IAS/IPS, तकनीकी कौशल, या अपना उद्यम)?';
          trans = 'What are your career aspirations (e.g. Civil Services/IAS/IPS, Tech skills, or Enterprise)?';
          break;
        default:
          prompt = 'What are your future career aspirations and goals (for example: Civil Services / IAS / IPS, advanced technical certifications, or leadership roles)?';
          trans = 'What are your future career aspirations and goals?';
      }

      return {
        spokenText: prompt,
        englishTranslation: trans,
        nextState: 'INTERVIEW_ASPIRATION',
        activeNodeId: 'skill_mapping_agent',
        reasoningStep: {
          step: 'Aspirational Opportunity Probing',
          observation: `Known Trade=${this.slots.occupation}, Exp=${this.slots.experienceYears}yr, Tools=${this.slots.toolsEquipment}.`,
          deduplicationCheck: 'Capturing forward-looking skilling interest for scheme matching.',
          decision: 'Inquire about desired career aspirations',
          confidence: 94
        }
      };
    }

    // All 4 Slots Filled: Formulate Verbatim Read-back
    const occ = this.slots.occupation;
    const exp = this.slots.experienceYears;
    const tools = this.slots.toolsEquipment;
    const asp = this.slots.aspiration;

    let readback = '';
    let trans = '';

    switch (lang) {
      case 'kn':
        readback = `ನೀವು ${exp} ವರ್ಷಗಳ ಅನುಭವದೊಂದಿಗೆ "${occ}" ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ, "${tools}" ಬಳಸುತ್ತೀರಿ ಮತ್ತು "${asp}" ಗುರಿ ಹೊಂದಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಇದು ಸರಿಯೇ?`;
        trans = `I understood that you have ${exp} years of experience in ${occ}, use ${tools}, and aspire towards ${asp}. Is this correct?`;
        break;
      case 'hi':
        readback = `मैंने समझा कि आपके पास ${exp} वर्षों के अनुभव के साथ "${occ}" की पृष्ठभूमि है, आप "${tools}" का उपयोग करते हैं, और "${asp}" का लक्ष्य रखते हैं। क्या यह सही है?`;
        trans = `I understood that you have ${exp} years of experience in ${occ}, use ${tools}, and aspire towards ${asp}. Is this correct?`;
        break;
      default:
        readback = `I understood that you have ${exp} years of experience in ${occ}, utilize ${tools}, and aspire towards ${asp}. Is this correct?`;
        trans = `I understood that you have ${exp} years of experience in ${occ}, utilize ${tools}, and aspire towards ${asp}. Is this correct?`;
    }

    return {
      spokenText: readback,
      englishTranslation: trans,
      nextState: 'READBACK_CONFIRMATION',
      activeNodeId: 'confirmation_agent',
      isReadbackPrompt: true,
      reasoningStep: {
        step: 'Read-Back Verification Synthesis',
        observation: 'All 4 required skill mapping slots fully extracted.',
        deduplicationCheck: 'Formulating verbatim recap in citizen native language for explicit sign-off.',
        decision: 'Present Read-Back Confirmation Modal with YES/NO actions',
        confidence: 98
      }
    };
  }

  private determineNextState(): ConversationState {
    if (this.slots.experienceYears === null) return 'INTERVIEW_EXPERIENCE';
    if (this.slots.toolsEquipment === null) return 'INTERVIEW_TOOLS_ACTIVITIES';
    if (this.slots.aspiration === null) return 'INTERVIEW_ASPIRATION';
    return 'READBACK_CONFIRMATION';
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

    // 4. Healthcare & Nursing
    if (t.includes('nurse') || t.includes('health') || t.includes('asha') || t.includes('clinic') || t.includes('medical') || t.includes('hospital') || t.includes('ಆಶಾ') || t.includes('ನರ್ಸ್')) {
      return 'Healthcare & Community Nursing Assistance';
    }

    // 5. Electrical & Solar
    if (t.includes('electr') || t.includes('wireman') || t.includes('solar') || t.includes('panel') || t.includes('ವಿದ್ಯುತ್') || t.includes('ವೈರ್ಮನ್') || t.includes('बिजली') || t.includes('वायरमैन')) {
      return 'Electrical & Solar Power Systems';
    }

    // 6. Tailoring & Apparel
    if (t.includes('tailor') || t.includes('stitch') || t.includes('dress') || t.includes('cloth') || t.includes('sewing') || t.includes('garment') || t.includes('ಟೈಲರ್') || t.includes('ಬಟ್ಟೆ') || t.includes('दर्जी') || t.includes('सिलाई')) {
      return 'Tailoring & Garment Manufacturing';
    }

    // 7. Carpentry & Masonry
    if (t.includes('carpent') || t.includes('wood') || t.includes('mason') || t.includes('plumb') || t.includes('construct') || t.includes('ಮೇಸ್ತ್ರಿ') || t.includes('ಬಡಗಿ') || t.includes('ಪ್ಲಂಬರ್')) {
      return 'Construction, Carpentry & Plumbing';
    }

    // 8. Driving & Automotive
    if (t.includes('driver') || t.includes('cab') || t.includes('auto') || t.includes('mechanic') || t.includes('vehicle') || t.includes('ಡ್ರೈವರ್') || t.includes('ಮೆಕ್ಯಾನಿಕ್')) {
      return 'Automotive Repair & Commercial Driving';
    }

    // 9. Retail & Small Business
    if (t.includes('shop') || t.includes('store') || t.includes('retail') || t.includes('sales') || t.includes('kirana') || t.includes('ಅಂಗಡಿ') || t.includes('ದೊಕಾನ್')) {
      return 'Retail Store & Small Business Management';
    }

    // 10. Agriculture (Only when agricultural terms are explicitly present)
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
    const keywords = ['yes', 'correct', 'right', 'accurate', 'true', 'sure', 'ಹೌದು', 'ಸರಿ', 'ಸರಿಯಾಗಿದೆ', 'ಖಂಡಿತ', 'हाँ', 'सही', 'बिल्कुल', 'అవును', 'ஆம்', 'होय'];
    return keywords.some(kw => text.includes(kw));
  }

  public isNegative(text: string): boolean {
    const keywords = ['no', 'wrong', 'incorrect', 'not', 'change', 'ಇಲ್ಲ', 'ತಪ್ಪು', 'ಅಲ್ಲ', 'ತಿದ್ದು', 'नहीं', 'गलत', 'कादु', 'இல்லை', 'नाही'];
    return keywords.some(kw => text.includes(kw));
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
      { name: 'Event Coordination & Logistics', icon: '🎪' },
      { name: 'Public Communication & Team Leadership', icon: '🗣️' },
      { name: 'Engineering & Analytical Foundations', icon: '📐' },
      { name: 'Administrative Planning & Scheduling', icon: '📋' }
    ];

    let structuredCategories = [
      'Public Administration & Governance Aspirations',
      'Event Operations & Hospitality Management',
      'Engineering & Applied Problem Solving',
      'Civil Services Competitive Preparation'
    ];

    let skillGap: SkillGapItem = {
      id: `gap-${Date.now()}`,
      currentSkills: [
        '✓ Event Operations & Ground Logistics Planning',
        '✓ Public Communication & Crisis Handling',
        '✓ Engineering Aptitude & Analytical Problem Solving',
        '✓ High-Pressure Work Coordination'
      ],
      targetCapability: 'Civil Services Officer (IAS/IPS/KPSC) & Public Sector Administration Leadership',
      gapSkills: [
        '⚠️ UPSC / State PSC Syllabus Mastery & General Studies Core',
        '⚠️ Indian Constitution, Governance Frameworks & Administrative Law',
        '⚠️ Public Policy Formulation & Ethics Case Analysis',
        '⚠️ Analytical Essay Writing & Personality Interview Protocols'
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

    const citizenName = isKn ? 'ಅರ್ಜಿದಾರ (Citizen)' : isHi ? 'नागरिक (Citizen)' : 'Applicant (Citizen)';

    return {
      id: `profile-${Date.now()}`,
      citizenName,
      occupation: occ,
      experienceYears: exp,
      education,
      location: 'Karnataka Hub',
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
  }

  public buildCompleteProfile(lang: SupportedLanguage, _partial?: Partial<LivelihoodProfile>): LivelihoodProfile {
    return this.buildDynamicProfile(lang, _partial);
  }
}

export const agentPipeline = new AgentPipelineService();
