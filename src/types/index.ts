export type SupportedLanguage = 
  | 'kn' // Kannada (Primary Demo Language)
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'mr' // Marathi
  | 'en'; // English

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
  isPrimaryDemo?: boolean;
}

export type AIProvider = 'gemini' | 'grok' | 'openai' | 'local';

export type AgentNodeId = 
  | 'voice_agent'
  | 'understanding_agent'
  | 'profile_agent'
  | 'skill_mapping_agent'
  | 'confirmation_agent'
  | 'program_matching_agent'
  | 'skill_gap_agent'
  | 'coordinator_agent';

export interface AgentNode {
  id: AgentNodeId;
  name: string;
  icon: string;
  role: string;
  status: 'pending' | 'active' | 'completed';
  outputPreview?: string;
}

export interface AgentReasoningStep {
  step: string;
  observation: string;
  deduplicationCheck: string;
  decision: string;
  confidence: number;
}

export type ConversationState = 
  | 'LANDING'
  | 'INTERVIEW_NAME_LOCATION'
  | 'INTERVIEW_OCCUPATION'
  | 'INTERVIEW_EXPERIENCE'
  | 'INTERVIEW_TOOLS_ACTIVITIES'
  | 'INTERVIEW_ASPIRATION'
  | 'READBACK_CONFIRMATION'
  | 'CORRECTION_CLARIFICATION'
  | 'RESULTS_VIEW';

export interface BeneficiaryRecord {
  id: string;
  name: string;
  location: string;
  trade: string;
  education: string;
  experienceYears: number;
  nsqfLevel: string;
  matchedScheme: string;
  matchScore: number;
  createdAt: string;
  status: 'Verified' | 'Completed' | 'Pending Enrolment';
  profile: LivelihoodProfile;
}

export type MicState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONDING';

export interface DialogueTurn {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  translation?: string;
  audioText?: string;
  timestamp: string;
  agentNode?: AgentNodeId;
  reasoningStep?: AgentReasoningStep;
}

export interface SkillEvidence {
  userQuote: string;
  extractedSkill: string;
  structuredCategory: string;
  confidenceScore: number;
}

export interface SkillGapItem {
  id: string;
  currentSkills: string[];
  targetCapability: string;
  gapSkills: string[];
}

export interface MatchedProgram {
  id: string;
  title: string;
  provider: string;
  category: string;
  eligibility: string;
  matchPercentage: number;
  rankBadge: 'BEST MATCH' | 'SECOND OPTION' | 'THIRD OPTION';
  whyMatched: string[];
  aiExplanation: string;
  skillsGained: string[];
  duration: string;
  mode: string;
  stipend?: string;
  toolkitGrant?: string;
  loanSupport?: string;
  officialPortalUrl: string;
  matchFactors: {
    occupationMatch: number;
    skillMatch: number;
    interestMatch: number;
    eligibilityMatch: number;
    locationMatch: number;
  };
}

export interface RoadmapStep {
  weekRange: string;
  title: string;
  description: string;
  milestone: string;
  icon: string;
}

export interface LivelihoodProfile {
  id: string;
  citizenName?: string;
  occupation: string;
  experienceYears: number;
  education: string;
  location?: string;
  currentSkills: { name: string; icon: string }[];
  structuredCategories: string[];
  toolsEquipment: string[];
  targetAspiration: string;
  mappingConfidence: number;
  evidences: SkillEvidence[];
  skillGap: SkillGapItem;
  matchedPrograms: MatchedProgram[];
  roadmap: RoadmapStep[];
  isConfirmed: boolean;
  confirmedAt?: string;
}

export interface FieldAssistantSession {
  totalAssistedToday: number;
  profilesCompleted: number;
  recommendationsGenerated: number;
  recentProfiles: {
    name: string;
    occupation: string;
    matchedProgram: string;
    time: string;
  }[];
}
