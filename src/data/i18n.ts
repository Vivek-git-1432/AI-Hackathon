import type { SupportedLanguage } from '../types';

export interface AppDictionary {
  brandName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  startVoiceBtn: string;
  selectLanguageLabel: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  startNowCta: string;
  
  // Voice states
  micIdle: string;
  micListening: string;
  micProcessing: string;
  micResponding: string;
  youSaidLabel: string;
  replayBtn: string;
  correctBtn: string;
  speakAgainBtn: string;
  
  // Agent Workflow
  workflowTitle: string;
  workflowSubtitle: string;
  
  // Skill Profile
  profileTitle: string;
  occupationLabel: string;
  experienceLabel: string;
  educationLabel: string;
  currentSkillsLabel: string;
  categoriesLabel: string;
  confidenceLabel: string;
  evidenceBreakdownTitle: string;
  
  // Readback Confirmation (COMPULSORY FEATURE)
  readbackHeader: string;
  readbackUnderstood: string;
  readbackPromptText: string;
  readbackYesBtn: string;
  readbackNoBtn: string;
  correctionTitle: string;
  correctionPrompt: string;
  
  // Skill Gap
  skillGapTitle: string;
  targetCapabilityLabel: string;
  recommendedAdditionalSkills: string;
  
  // Recommendations
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  viewProgramBtn: string;
  whyThisRecommendationBtn: string;
  whyModalTitle: string;
  skillsGainedLabel: string;
  durationLabel: string;
  eligibilityLabel: string;
  matchingFactorsTitle: string;
  
  // 90 Day Roadmap
  roadmapTitle: string;
  roadmapSubtitle: string;
  
  // Modes & Navigation
  modeVoice: string;
  modeFieldAssistant: string;
  modeImpactDashboard: string;
  modeDemo: string;
  
  // Final Opportunity Banner
  finalHeadline: string;
  finalCta: string;
}

export const I18N_DATA: Record<SupportedLanguage, AppDictionary> = {
  // --------------------------------------------------------------------------
  // KANNADA (Primary Demo Language)
  // --------------------------------------------------------------------------
  kn: {
    brandName: 'ಸಕ್ಷಮ್ ವಾಯ್ಸ್ (SAKSHAM VOICE)',
    brandTagline: 'ಸ್ವಾಭಾವಿಕವಾಗಿ ಮಾತನಾಡಿ. ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಕಂಡುಕೊಳ್ಳಿ.',
    heroHeadline: 'ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ.\nನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಅನ್ವೇಷಿಸಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    heroSubheadline: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಮಾತನಾಡಿ — ದೀರ್ಘ ಫಾರ್ಮ್‌ಗಳನ್ನು ತುಂಬುವ ಅಗತ್ಯವಿಲ್ಲ.',
    startVoiceBtn: 'ಧ್ವನಿ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
    selectLanguageLabel: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    benefit1Title: 'ಸ್ವಾಭಾವಿಕವಾಗಿ ಮಾತನಾಡಿ',
    benefit1Desc: 'ಯಾವುದೇ ಪಠ್ಯ ಫಾರ್ಮ್‌ಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಸರಳವಾಗಿ ಮಾತನಾಡಿ.',
    benefit2Title: 'AI ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಗ್ರಹಿಸುತ್ತದೆ',
    benefit2Desc: 'ಬುದ್ಧಿವಂತ ಏಜೆಂಟ್‌ಗಳು ನಿಮ್ಮ ಅನುಭವವನ್ನು ರಚನಾತ್ಮಕ ಕೌಶಲ್ಯಗಳಾಗಿ ಮ್ಯಾಪ್ ಮಾಡುತ್ತವೆ.',
    benefit3Title: 'ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ತರಬೇತಿ ಪಡೆಯಿರಿ',
    benefit3Desc: 'ನಿಮ್ಮ ಕೌಶಲ್ಯಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ನೇರವಾಗಿ ಪಡೆಯಿರಿ.',
    startNowCta: 'ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ',
    
    micIdle: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    micListening: 'ನಾನು ಆಲಿಸುತ್ತಿದ್ದೇನೆ...',
    micProcessing: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...',
    micResponding: 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
    youSaidLabel: 'ನೀವು ಹೇಳಿದ್ದು:',
    replayBtn: 'ಮತ್ತೆ ಆಲಿಸಿ',
    correctBtn: 'ತಿದ್ದಿ',
    speakAgainBtn: 'ಮತ್ತೆ ಮಾತನಾಡಿ',
    
    workflowTitle: 'AI ಏಜೆಂಟ್ ಕಾರ್ಯಪ್ರವಾಹ (AI AGENT WORKFLOW)',
    workflowSubtitle: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಸರ್ಕಾರಿ ಕೌಶಲ್ಯ ಯೋಜನೆಗಳಿಗೆ ಪರಿವರ್ತಿಸುವ ಸ್ವಾಯತ್ತ ಏಜೆಂಟ್‌ಗಳ ಸರಪಳಿ',
    
    profileTitle: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ವಿವರ (YOUR SKILL PROFILE)',
    occupationLabel: 'ವೃತ್ತಿ',
    experienceLabel: 'ಅನುಭವ',
    educationLabel: 'ಶಿಕ್ಷಣ',
    currentSkillsLabel: 'ಪ್ರಸ್ತುತ ಕೌಶಲ್ಯಗಳು',
    categoriesLabel: 'ರಚನಾತ್ಮಕ ವಿಭಾಗಗಳು',
    confidenceLabel: 'ಕೌಶಲ್ಯ ಮ್ಯಾಪಿಂಗ್ ವಿಶ್ವಾಸಾರ್ಹತೆ',
    evidenceBreakdownTitle: 'ಸಾಕ್ಷ್ಯ ಆಧಾರಿತ ಕೌಶಲ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ',
    
    readbackHeader: 'ಯೋಜನೆಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡುವ ಮೊದಲು...',
    readbackUnderstood: 'ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದು ಇಲ್ಲಿದೆ.',
    readbackPromptText: 'ನೀವು 5 ವರ್ಷಗಳಿಂದ ಕೃಷಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ಟ್ರಾಕ್ಟರ್ ಮತ್ತು ನೀರಾವರಿ ಉಪಕರಣಗಳನ್ನು ಬಳಸುತ್ತೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಇದು ಸರಿಯೇ?',
    readbackYesBtn: '✓ ಹೌದು, ಇದು ಸಂಪೂರ್ಣ ಸರಿಯಾಗಿದೆ',
    readbackNoBtn: '✕ ಇಲ್ಲ, ನಾನು ಇದನ್ನು ತಿದ್ದುತ್ತೇನೆ',
    correctionTitle: 'ಯಾವ ಭಾಗವನ್ನು ನಾನು ಸರಿಪಡಿಸಬೇಕು?',
    correctionPrompt: 'ಸರಿ. ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿದುಕೊಳ್ಳಲು ನಾನು ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳುತ್ತೇನೆ.',
    
    skillGapTitle: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ಅಂತರ (YOUR SKILL GAP)',
    targetCapabilityLabel: 'ಗುರಿ ಸಾಮರ್ಥ್ಯ',
    recommendedAdditionalSkills: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಹೆಚ್ಚುವರಿ ಕೌಶಲ್ಯಗಳು',
    
    recommendationsTitle: 'ನಿಮಗಾಗಿ ಹೊಂದಿಕೆಯಾದ ಯೋಜನೆಗಳು (PROGRAMS MATCHED FOR YOU)',
    recommendationsSubtitle: 'ನಿಮ್ಮ ದೃಢೀಕರಿಸಿದ ಕೌಶಲ್ಯ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಅಂತರವನ್ನು ಆಧರಿಸಿ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
    viewProgramBtn: 'ಯೋಜನೆ ವೀಕ್ಷಿಸಿ',
    whyThisRecommendationBtn: 'ಈ ಶಿಫಾರಸು ಏಕೆ? (WHY?)',
    whyModalTitle: 'AI ಶಿಫಾರಸು ಸಮರ್ಥನೆ (AI EXPLAINABILITY CHAIN)',
    skillsGainedLabel: 'ಗಳಿಸುವ ಕೌಶಲ್ಯಗಳು',
    durationLabel: 'ಅವಧಿ',
    eligibilityLabel: 'ಅರ್ಹತೆ',
    matchingFactorsTitle: 'ಹೊಂದಾಣಿಕೆ ಅಂಶಗಳು',
    
    roadmapTitle: 'ನಿಮ್ಮ ಮುಂದಿನ 90 ದಿನಗಳು (YOUR NEXT 90 DAYS)',
    roadmapSubtitle: 'ಕೌಶಲ್ಯದಿಂದ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಉದ್ಯೋಗದವರೆಗಿನ ನಿಮ್ಮ ಹಂತ-ಹಂತದ ಮಾರ್ಗಸೂಚಿ',
    
    modeVoice: 'ನಾಗರಿಕ ಧ್ವನಿ ಮೋಡ್',
    modeFieldAssistant: 'ಫೀಲ್ಡ್ ಅಸಿಸ್ಟೆಂಟ್ (NGO)',
    modeImpactDashboard: 'ಪ್ರಭಾವ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    modeDemo: 'ಹ್ಯಾಕಥಾನ್ ಡೆಮೊ ಸಿಮ್ಯುಲೇಶನ್',
    
    finalHeadline: 'ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವು ನಿಮಗೆ ಈಗಾಗಲೇ ತಿಳಿದಿರುವುದರೊಂದಿಗೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
    finalCta: 'ಮತ್ತೊಂದು ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ'
  },

  // -------------------------------------------------------------
  // ENGLISH
  // -------------------------------------------------------------
  en: {
    brandName: 'SAKSHAM VOICE',
    brandTagline: 'Speak naturally. Discover your skills. Find your next opportunity.',
    heroHeadline: 'Tell us about your work.\nWe’ll help you discover your next opportunity.',
    heroSubheadline: 'Speak naturally in your preferred Indian language — no long forms required.',
    startVoiceBtn: 'START VOICE CONVERSATION',
    selectLanguageLabel: 'Select Your Language',
    benefit1Title: 'Speak naturally',
    benefit1Desc: 'Simply talk in your everyday language without filling complex text forms.',
    benefit2Title: 'AI understands your skills',
    benefit2Desc: 'Autonomous agents map your informal experience to standardized NSQF qualifications.',
    benefit3Title: 'Get personalized training recommendations',
    benefit3Desc: 'Discover high-impact government skilling programs with toolkits and stipends.',
    startNowCta: 'START NOW',
    
    micIdle: 'Tap to speak',
    micListening: "I'm listening…",
    micProcessing: 'Understanding…',
    micResponding: 'Let me think…',
    youSaidLabel: 'You said:',
    replayBtn: 'Replay',
    correctBtn: 'Correct',
    speakAgainBtn: 'Speak again',
    
    workflowTitle: 'AI AGENT WORKFLOW',
    workflowSubtitle: 'Autonomous multi-agent architecture executing sequential reasoning',
    
    profileTitle: 'YOUR SKILL PROFILE',
    occupationLabel: 'Occupation',
    experienceLabel: 'Experience',
    educationLabel: 'Education',
    currentSkillsLabel: 'Current Skills',
    categoriesLabel: 'Structured Categories',
    confidenceLabel: 'Skill Mapping Confidence',
    evidenceBreakdownTitle: 'Evidence-Based Skill Extraction',
    
    readbackHeader: 'Before I recommend programs…',
    readbackUnderstood: 'Here’s what I understood.',
    readbackPromptText: 'I understood that you have 5 years of experience in agriculture and farming, utilizing equipment including tractors and modern irrigation systems. Is this correct?',
    readbackYesBtn: "✓ YES, THAT'S CORRECT",
    readbackNoBtn: '✕ NO, LET ME CORRECT IT',
    correctionTitle: 'Which part should I correct?',
    correctionPrompt: 'Understood. Let me ask a follow-up question to accurately capture your trade details.',
    
    skillGapTitle: 'YOUR SKILL GAP',
    targetCapabilityLabel: 'Target Capability',
    recommendedAdditionalSkills: 'Recommended Additional Skills',
    
    recommendationsTitle: 'PROGRAMS MATCHED FOR YOU',
    recommendationsSubtitle: 'Curated government programs addressing your identified skill gaps',
    viewProgramBtn: 'VIEW PROGRAM',
    whyThisRecommendationBtn: 'WHY THIS RECOMMENDATION?',
    whyModalTitle: 'AI Explainability & Reasoning Chain',
    skillsGainedLabel: 'Skills Gained',
    durationLabel: 'Duration',
    eligibilityLabel: 'Eligibility',
    matchingFactorsTitle: 'Matching Factors',
    
    roadmapTitle: 'YOUR NEXT 90 DAYS',
    roadmapSubtitle: 'Your progressive step-by-step roadmap from training to formal opportunity',
    
    modeVoice: 'Citizen Voice Mode',
    modeFieldAssistant: 'Field Assistant (NGO)',
    modeImpactDashboard: 'Impact Dashboard',
    modeDemo: 'Hackathon Demo Mode',
    
    finalHeadline: 'Your next opportunity starts with what you already know.',
    finalCta: 'START ANOTHER CONVERSATION'
  },

  // -------------------------------------------------------------
  // HINDI
  // -------------------------------------------------------------
  hi: {
    brandName: 'सक्षम वॉइस (SAKSHAM VOICE)',
    brandTagline: 'सहजता से बोलें। अपने हुनर को पहचानें। अपने नए अवसर पाएं।',
    heroHeadline: 'हमें अपने काम के बारे में बताएं।\nहम आपके लिए सही अवसर खोजने में मदद करेंगे।',
    heroSubheadline: 'अपनी पसंदीदा भारतीय भाषा में खुलकर बोलें — कोई लंबा फॉर्म भरने की जरूरत नहीं।',
    startVoiceBtn: 'वॉइस बातचीत शुरू करें',
    selectLanguageLabel: 'अपनी भाषा चुनें',
    benefit1Title: 'सहजता से बोलें',
    benefit1Desc: 'बिना किसी फॉर्म के अपनी आम बोलचाल की भाषा में बात करें।',
    benefit2Title: 'AI आपके हुनर को समझता है',
    benefit2Desc: 'स्मार्ट एजेंट्स आपके अनुभव को राष्ट्रीय मानक कौशलों में बदलते हैं।',
    benefit3Title: 'सटीक सरकारी योजनाएं पाएं',
    benefit3Desc: 'टूलकिट, वजीफा और प्रमाणन वाली कल्याणकारी योजनाएं प्राप्त करें।',
    startNowCta: 'अभी शुरू करें',
    
    micIdle: 'बोलने के लिए टैप करें',
    micListening: 'मैं सुन रहा हूँ…',
    micProcessing: 'समझ रहा हूँ…',
    micResponding: 'सोच रहा हूँ…',
    youSaidLabel: 'आपने कहा:',
    replayBtn: 'फिर से सुनें',
    correctBtn: 'सुधारें',
    speakAgainBtn: 'फिर से बोलें',
    
    workflowTitle: 'AI एजेंट वर्कफ़्लो (AI AGENT WORKFLOW)',
    workflowSubtitle: 'आपकी आवाज को सरकारी योजनाओं से जोड़ने वाली ऑटोनॉमस एजेंट श्रृंखला',
    
    profileTitle: 'आपका कौशल प्रोफाइल (YOUR SKILL PROFILE)',
    occupationLabel: 'व्यवसाय',
    experienceLabel: 'अनुभव',
    educationLabel: 'शिक्षा',
    currentSkillsLabel: 'वर्तमान कौशल',
    categoriesLabel: 'संरचित श्रेणियां',
    confidenceLabel: 'कौशल मैपिंग सटीकता',
    evidenceBreakdownTitle: 'साक्ष्य आधारित कौशल विश्लेषण',
    
    readbackHeader: 'योजनाओं की सिफारिश करने से पहले…',
    readbackUnderstood: 'मैंने जो समझा वह यहाँ है।',
    readbackPromptText: 'मैंने समझा कि आप पिछले 5 वर्षों से खेती का काम कर रहे हैं और ट्रैक्टर व सिंचाई उपकरणों का उपयोग करते हैं। क्या यह सही है?',
    readbackYesBtn: '✓ हाँ, यह बिल्कुल सही है',
    readbackNoBtn: '✕ नहीं, मैं सुधार करना चाहता हूँ',
    correctionTitle: 'मुझे किस हिस्से में सुधार करना चाहिए?',
    correctionPrompt: 'ठीक है। आपके काम को सही से समझने के लिए मैं एक और सवाल पूछता हूँ।',
    
    skillGapTitle: 'आपका कौशल अंतर (YOUR SKILL GAP)',
    targetCapabilityLabel: 'लक्षित क्षमता',
    recommendedAdditionalSkills: 'अनुशंसित अतिरिक्त कौशल',
    
    recommendationsTitle: 'आपके लिए चुनी गई योजनाएं (PROGRAMS MATCHED FOR YOU)',
    recommendationsSubtitle: 'आपके सत्यापित कौशल प्रोफाइल और अंतर के आधार पर तैयार',
    viewProgramBtn: 'योजना देखें',
    whyThisRecommendationBtn: 'यह सिफारिश क्यों? (WHY?)',
    whyModalTitle: 'AI सिफारिश का कारण (EXPLAINABILITY CHAIN)',
    skillsGainedLabel: 'सीखे जाने वाले कौशल',
    durationLabel: 'अवधि',
    eligibilityLabel: 'पात्रता',
    matchingFactorsTitle: 'मिलान कारक',
    
    roadmapTitle: 'आपके अगले 90 दिन (YOUR NEXT 90 DAYS)',
    roadmapSubtitle: 'प्रशिक्षण से प्रमाणन और आजीविका तक का स्पष्ट रोडमैप',
    
    modeVoice: 'नागरिक वॉइस मोड',
    modeFieldAssistant: 'फील्ड असिस्टेंट (NGO)',
    modeImpactDashboard: 'इम्पैक्ट डैशबोर्ड',
    modeDemo: 'डेमो सिमुलेशन',
    
    finalHeadline: 'आपका अगला अवसर वहीं से शुरू होता है जो आप पहले से जानते हैं।',
    finalCta: 'नई बातचीत शुरू करें'
  },

  // -------------------------------------------------------------
  // TELUGU
  // -------------------------------------------------------------
  te: {
    brandName: 'సక్షమ్ వాయిస్ (SAKSHAM VOICE)',
    brandTagline: 'సహజంగా మాట్లాడండి. మీ నైపుణ్యాలను తెలుసుకోండి. కొత్త అవకాశాలను కనుగొనండి.',
    heroHeadline: 'మీ పని గురించి మాకు చెప్పండి.\nమీ తదుపరి అవకాశాన్ని కనుగొనడంలో మేము సహాయం చేస్తాము.',
    heroSubheadline: 'మీ స్వంత భాషలో మాట్లాడండి — పొడవైన ఫారమ్‌లు అవసరం లేదు.',
    startVoiceBtn: 'వాయిస్ సంభాషణ ప్రారంభించండి',
    selectLanguageLabel: 'భాషను ఎంచుకోండి',
    benefit1Title: 'సహజంగా మాట్లాడండి',
    benefit1Desc: 'ఎటువంటి ఫారమ్‌లు లేకుండా మీ రోజువారీ భాషలో మాట్లాడండి.',
    benefit2Title: 'AI మీ నైపుణ్యాలను అర్థం చేసుకుంటుంది',
    benefit2Desc: 'స్మార్ట్ ఏజెంట్లు మీ పనిని ప్రామాణిక నైపుణ్యాలుగా మ్యాప్ చేస్తాయి.',
    benefit3Title: 'వ్యక్తిగతీకరించిన శిక్షణ పొందండి',
    benefit3Desc: 'మీ నైపుణ్యాలకు తగిన ప్రభుత్వ పథకాలను నేరుగా పొందండి.',
    startNowCta: 'ఇప్పుడే ప్రారంభించండి',
    
    micIdle: 'మాట్లాడటానికి నొక్కండి',
    micListening: 'నేను వింటున్నాను…',
    micProcessing: 'అర్థం చేసుకుంటున్నాను…',
    micResponding: 'ఆలోచిస్తున్నాను…',
    youSaidLabel: 'మీరు చెప్పారు:',
    replayBtn: 'మళ్లీ వినండి',
    correctBtn: 'సవరించండి',
    speakAgainBtn: 'మళ్లీ మాట్లాడండి',
    
    workflowTitle: 'AI ఏజెంట్ వర్క్‌ఫ్లో (AI AGENT WORKFLOW)',
    workflowSubtitle: 'మీ వాయిస్‌ని ప్రభుత్వ పథకాలతో అనుసంధానించే స్వయంప్రతిపత్తి ఏజెంట్లు',
    
    profileTitle: 'మీ నైపుణ్య ప్రొఫైల్ (YOUR SKILL PROFILE)',
    occupationLabel: 'వృత్తి',
    experienceLabel: 'అనుభవం',
    educationLabel: 'విద్య',
    currentSkillsLabel: 'ప్రస్తుత నైపుణ్యాలు',
    categoriesLabel: 'వర్గాలు',
    confidenceLabel: 'మ్యాపింగ్ ఖచ్చితత్వం',
    evidenceBreakdownTitle: 'సాక్ష్య ఆధారిత నైపుణ్య విశ్లేషణ',
    
    readbackHeader: 'పథకాలను సిఫార్సు చేయడానికి ముందు…',
    readbackUnderstood: 'నేను అర్థం చేసుకున్న వివరాలు ఇక్కడ ఉన్నాయి.',
    readbackPromptText: 'మీరు 5 సంవత్సరాలుగా వ్యవసాయం చేస్తున్నారని మరియు ట్రాక్టర్లు, నీటిపారుదల పరికరాలను ఉపయోగిస్తున్నారని నేను అర్థం చేసుకున్నాను. ఇది సరైనదేనా?',
    readbackYesBtn: '✓ అవును, ఇది పూర్తిగా సరైనది',
    readbackNoBtn: '✕ కాదు, నేను సవరించాలనుకుంటున్నాను',
    correctionTitle: 'నేను ఏ భాగాన్ని సరిదిద్దాలి?',
    correctionPrompt: 'సరే. మీ పనిని స్పష్టంగా అర్థం చేసుకోవడానికి నేను మరొక ప్రశ్న అడుగుతాను.',
    
    skillGapTitle: 'మీ నైపుణ్య అంతరం (YOUR SKILL GAP)',
    targetCapabilityLabel: 'లక్ష్య సామర్థ్యం',
    recommendedAdditionalSkills: 'సిఫార్సు చేయబడిన అదనపు నైపుణ్యాలు',
    
    recommendationsTitle: 'మీ కోసం సరిపోలిన పథకాలు (PROGRAMS MATCHED FOR YOU)',
    recommendationsSubtitle: 'మీ ధృవీకరించిన నైపుణ్యాలు మరియు గ్యాప్ ఆధారంగా ఎంపిక చేయబడ్డాయి',
    viewProgramBtn: 'పథకం చూడండి',
    whyThisRecommendationBtn: 'ఈ సిఫార్సు ఎందుకు? (WHY?)',
    whyModalTitle: 'AI సిఫార్సు సమర్థన (REASONING CHAIN)',
    skillsGainedLabel: 'నేర్చుకునే నైపుణ్యాలు',
    durationLabel: 'వ్యవధి',
    eligibilityLabel: 'అర్హత',
    matchingFactorsTitle: 'హోలిక అంశాలు',
    
    roadmapTitle: 'మీ తదుపరి 90 రోజులు (YOUR NEXT 90 DAYS)',
    roadmapSubtitle: 'శిక్షణ నుండి సర్టిఫికేట్ మరియు ఉపాధి వరకు స్పష్టమైన ప్రణాళిక',
    
    modeVoice: 'సిటిజన్ వాయిస్ మోడ్',
    modeFieldAssistant: 'ఫీల్డ్ అసిస్టెంట్ (NGO)',
    modeImpactDashboard: 'ఇంపాక్ట్ డాష్‌బోర్డ్',
    modeDemo: 'డెమో సిమ్యులేషన్',
    
    finalHeadline: 'మీ తదుపరి అవకాశం మీకు ఇప్పటికే తెలిసిన దానితో ప్రారంభమవుతుంది.',
    finalCta: 'మరొక సంభాషణ ప్రారంభించండి'
  },

  // -------------------------------------------------------------
  // TAMIL
  // -------------------------------------------------------------
  ta: {
    brandName: 'சக்ஷம் வாய்ஸ் (SAKSHAM VOICE)',
    brandTagline: 'இயல்பாகப் பேசுங்கள். உங்கள் திறன்களைக் கண்டறியுங்கள். புதிய வாய்ப்புகளைப் பெறுங்கள்.',
    heroHeadline: 'உங்கள் வேலையைப் பற்றி எங்களிடம் கூறுங்கள்.\nஉங்கள் அடுத்த வாய்ப்பைக் கண்டறிய நாங்கள் உதவுகிறோம்.',
    heroSubheadline: 'உங்கள் தாய்மொழியில் எளிதாகப் பேசுங்கள் — நீண்ட படிவங்கள் தேவையில்லை.',
    startVoiceBtn: 'குரல் உரையாடலைத் தொடங்குங்கள்',
    selectLanguageLabel: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    benefit1Title: 'இயல்பாகப் பேசுங்கள்',
    benefit1Desc: 'எந்தவொரு படிவமும் இல்லாமல் உங்கள் சொந்த மொழியில் பேசுங்கள்.',
    benefit2Title: 'AI உங்கள் திறனைப் புரிந்து கொள்கிறது',
    benefit2Desc: 'திறமையான ஏஜெண்டுகள் உங்கள் அனுபவத்தை தேசிய தகுதிகளாக மாற்றுகின்றன.',
    benefit3Title: 'தனிப்பயனாக்கப்பட்ட திட்டங்களைப் பெறுங்கள்',
    benefit3Desc: 'உபகரண மானியம் மற்றும் உதவித்தொகையுடன் கூடிய அரசு திட்டங்களைக் கண்டறியவும்.',
    startNowCta: 'இப்போதே தொடங்குங்கள்',
    
    micIdle: 'பேச தட்டவும்',
    micListening: 'நான் கேட்கிறேன்…',
    micProcessing: 'புரிந்துகொள்கிறேன்…',
    micResponding: 'சிந்திக்கிறேன்…',
    youSaidLabel: 'நீங்கள் கூறியது:',
    replayBtn: 'மீண்டும் கேள்',
    correctBtn: 'திருத்து',
    speakAgainBtn: 'மீண்டும் பேசு',
    
    workflowTitle: 'AI ஏஜென்ட் பணிப்பாய்வு (AI AGENT WORKFLOW)',
    workflowSubtitle: 'உங்கள் குரலை அரசு திட்டங்களுடன் இணைக்கும் தானியங்கி ஏஜென்ட்கள்',
    
    profileTitle: 'உங்கள் திறன் சுயவிவரம் (YOUR SKILL PROFILE)',
    occupationLabel: 'தொழில்',
    experienceLabel: 'அனுபவம்',
    educationLabel: 'கல்வி',
    currentSkillsLabel: 'தற்போதைய திறன்கள்',
    categoriesLabel: 'வகைப்பாடுகள்',
    confidenceLabel: 'மேப்பிங் துல்லியம்',
    evidenceBreakdownTitle: 'சான்று அடிப்படையிலான திறன் பகுப்பாய்வு',
    
    readbackHeader: 'திட்டங்களை பரிந்துரைக்கும் முன்…',
    readbackUnderstood: 'நான் புரிந்து கொண்டது இதோ.',
    readbackPromptText: 'நீங்கள் 5 வருடங்களாக விவசாயம் செய்து வருகிறீர்கள் என்றும் டிராக்டர் மற்றும் பாசன உபகரணங்களைப் பயன்படுத்துகிறீர்கள் என்றும் புரிந்து கொண்டேன். இது சரியானதா?',
    readbackYesBtn: '✓ ஆம், இது முற்றிலும் சரியானது',
    readbackNoBtn: '✕ இல்லை, நான் திருத்த விரும்புகிறேன்',
    correctionTitle: 'நான் எந்தப் பகுதியைத் திருத்த வேண்டும்?',
    correctionPrompt: 'சரி. உங்கள் வேலையை தெளிவாகப் புரிந்துகொள்ள நான் மற்றொரு கேள்வி கேட்கிறேன்.',
    
    skillGapTitle: 'உங்கள் திறன் இடைவெளி (YOUR SKILL GAP)',
    targetCapabilityLabel: 'இலக்கு திறன்',
    recommendedAdditionalSkills: 'பரிந்துரைக்கப்படும் கூடுதல் திறன்கள்',
    
    recommendationsTitle: 'உங்களுக்கான பொருத்தமான திட்டங்கள் (PROGRAMS MATCHED FOR YOU)',
    recommendationsSubtitle: 'உங்கள் உறுதிப்படுத்தப்பட்ட திறன் மற்றும் இடைவெளியின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டது',
    viewProgramBtn: 'திட்டத்தைப் பார்க்கவும்',
    whyThisRecommendationBtn: 'ஏன் இந்த பரிந்துரை? (WHY?)',
    whyModalTitle: 'AI பரிந்துரை விளக்கம் (REASONING CHAIN)',
    skillsGainedLabel: 'பெறப்படும் திறன்கள்',
    durationLabel: 'கால அளவு',
    eligibilityLabel: 'தகுதி',
    matchingFactorsTitle: 'பொருந்தும் காரணிகள்',
    
    roadmapTitle: 'உங்கள் அடுத்த 90 நாட்கள் (YOUR NEXT 90 DAYS)',
    roadmapSubtitle: 'பயிற்சியிலிருந்து சான்றிதழ் மற்றும் வேலைவாய்ப்புக்கான வரைபடம்',
    
    modeVoice: 'குரல் முறை',
    modeFieldAssistant: 'கள உதவியாளர் (NGO)',
    modeImpactDashboard: 'தாக்க டாஷ்போர்டு',
    modeDemo: 'டெமோ உருவகப்படுத்துதல்',
    
    finalHeadline: 'உங்கள் அடுத்த வாய்ப்பு உங்களுக்கு ஏற்கனவே தெரிந்தவற்றிலிருந்து தொடங்குகிறது.',
    finalCta: 'புதிய உரையாடலைத் தொடங்குங்கள்'
  },

  // -------------------------------------------------------------
  // MARATHI
  // -------------------------------------------------------------
  mr: {
    brandName: 'सक्षम व्हॉइस (SAKSHAM VOICE)',
    brandTagline: 'सहज बोला. तुमची कौशल्ये ओळखा. नवीन संधी शोधा.',
    heroHeadline: 'तुमच्या कामाबद्दल आम्हाला सांगा.\nआम्ही तुमची पुढची संधी शोधण्यात मदत करू.',
    heroSubheadline: 'तुमच्या मातृभाषेत सहज बोला — कोणतेही मोठे फॉर्म भरण्याची गरज नाही.',
    startVoiceBtn: 'व्हॉइस संभाषण सुरू करा',
    selectLanguageLabel: 'भाषा निवडा',
    benefit1Title: 'सहज बोला',
    benefit1Desc: 'कोणत्याही फॉर्मशिवाय तुमच्या रोजच्या भाषेत बोला.',
    benefit2Title: 'AI तुमची कौशल्ये समजून घेते',
    benefit2Desc: 'स्मार्ट एजंट्स तुमच्या अनुभवाला अधिकृत कौशल्यांमध्ये रूपांतरित करतात.',
    benefit3Title: 'योग्य सरकारी योजना मिळवा',
    benefit3Desc: 'टूलकिट, भत्ता आणि प्रमाणपत्रासह सरकारी योजना मिळवा.',
    startNowCta: 'आता सुरू करा',
    
    micIdle: 'बोलण्यासाठी टॅप करा',
    micListening: 'मी ऐकत आहे…',
    micProcessing: 'समजून घेत आहे…',
    micResponding: 'विचार करत आहे…',
    youSaidLabel: 'तुम्ही म्हणालात:',
    replayBtn: 'पुन्हा ऐका',
    correctBtn: 'दुरुस्त करा',
    speakAgainBtn: 'पुन्हा बोला',
    
    workflowTitle: 'AI एजंट कार्यप्रणाली (AI AGENT WORKFLOW)',
    workflowSubtitle: 'तुमच्या आवाजाला सरकारी योजनांशी जोडणारी स्वायत्त एजंट साखळी',
    
    profileTitle: 'तुमचे कौशल्य प्रोफाइल (YOUR SKILL PROFILE)',
    occupationLabel: 'व्यवसाय',
    experienceLabel: 'अनुभव',
    educationLabel: 'शिक्षण',
    currentSkillsLabel: 'सध्याची कौशल्ये',
    categoriesLabel: 'रचनात्मक श्रेणी',
    confidenceLabel: 'मॅपिंग अचूकता',
    evidenceBreakdownTitle: 'पुरावा आधारित कौशल्य विश्लेषण',
    
    readbackHeader: 'योजनांची शिफारस करण्यापूर्वी…',
    readbackUnderstood: 'मी जे समजलो ते येथे आहे.',
    readbackPromptText: 'मी समजलो की तुम्ही गेल्या ५ वर्षांपासून शेती करत आहात आणि ट्रॅक्टर व सिंचन उपकरणे वापरत आहात. हे बरोबर आहे का?',
    readbackYesBtn: '✓ होय, हे अगदी बरोबर आहे',
    readbackNoBtn: '✕ नाही, मला दुरुस्ती करायची आहे',
    correctionTitle: 'मी कोणता भाग दुरुस्त करावा?',
    correctionPrompt: 'ठीक आहे. तुमचे काम नीट समजून घेण्यासाठी मी एक प्रश्न विचारतो.',
    
    skillGapTitle: 'तुमची कौशल्य तफावत (YOUR SKILL GAP)',
    targetCapabilityLabel: 'ध्येय क्षमता',
    recommendedAdditionalSkills: 'शिफारस केलेली अतिरिक्त कौशल्ये',
    
    recommendationsTitle: 'तुमच्यासाठी निवडलेल्या योजना (PROGRAMS MATCHED FOR YOU)',
    recommendationsSubtitle: 'तुमच्या पडताळणी केलेल्या कौशल्य प्रोफाइलवर आधारित',
    viewProgramBtn: 'योजना पहा',
    whyThisRecommendationBtn: 'ही शिफारस का? (WHY?)',
    whyModalTitle: 'AI शिफारसीचे कारण (REASONING CHAIN)',
    skillsGainedLabel: 'मिळणारी कौशल्ये',
    durationLabel: 'कालावधी',
    eligibilityLabel: 'पात्रता',
    matchingFactorsTitle: 'जुळणी घटक',
    
    roadmapTitle: 'तुमचे पुढील ९० दिवस (YOUR NEXT 90 DAYS)',
    roadmapSubtitle: 'प्रशिक्षणापासून प्रमाणपत्र आणि उपजीविकेपर्यंतचा रोडमॅप',
    
    modeVoice: 'नागरिक व्हॉइस मोड',
    modeFieldAssistant: 'फील्ड असिस्टंट (NGO)',
    modeImpactDashboard: 'इम्पॅक्ट डॅशबोर्ड',
    modeDemo: 'डेमो सिम्युलेशन',
    
    finalHeadline: 'तुमची पुढची संधी तुम्ही आधीपासून जाणता तिथूनच सुरू होते.',
    finalCta: 'नवीन संभाषण सुरू करा'
  }
};
