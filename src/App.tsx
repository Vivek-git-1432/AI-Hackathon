import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  SupportedLanguage, 
  AIProvider,
  ConversationState, 
  MicState, 
  AgentNode, 
  AgentNodeId, 
  DialogueTurn, 
  LivelihoodProfile,
  BeneficiaryRecord
} from './types';
import { agentPipeline, INITIAL_AGENT_NODES } from './services/agentPipeline';
import { voiceService } from './services/voiceService';
import { databaseService } from './services/databaseService';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { AgentWorkflowVisualizer } from './components/AgentWorkflowVisualizer';
import { VoiceConversationHub } from './components/VoiceConversationHub';
import { ReadbackConfirmationModal } from './components/ReadbackConfirmationModal';
import { SkillProfileCard } from './components/SkillProfileCard';
import { SkillGapAnalysisCard } from './components/SkillGapAnalysisCard';
import { ProgramRecommendations } from './components/ProgramRecommendations';
import { Roadmap90Days } from './components/Roadmap90Days';
import { FieldAssistantMode, type FieldQueueRecord } from './components/FieldAssistantMode';
import { IvrHelplineMode } from './components/IvrHelplineMode';
import { HackathonValidatorModal } from './components/HackathonValidatorModal';
import { BeneficiaryRegistryModal } from './components/BeneficiaryRegistryModal';
import { ImpactDashboard } from './components/ImpactDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FinalOpportunityBanner } from './components/FinalOpportunityBanner';
import { MessageSquare, ShieldCheck, TrendingUp, Award, Layers } from 'lucide-react';

export const App: React.FC = () => {
  // Primary Demo Language: Default to Kannada ('kn') or saved preference
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saksham_language');
      if (saved && ['kn', 'hi', 'te', 'ta', 'mr', 'en'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    }
    return 'kn';
  });

  const [activeMode, setActiveMode] = useState<'voice' | 'field' | 'ivr' | 'dashboard'>('voice');
  const [isValidatorOpen, setIsValidatorOpen] = useState<boolean>(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState<boolean>(false);
  const [beneficiaryCount, setBeneficiaryCount] = useState<number>(() => databaseService.getAllBeneficiaries().length);
  const [conversationState, setConversationState] = useState<ConversationState>('LANDING');
  const [micState, setMicState] = useState<MicState>('IDLE');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [autoListen, setAutoListen] = useState<boolean>(true); // Continuous hands-free loop
  const [transcriptInterim, setTranscriptInterim] = useState<string>('');
  
  // Right panel view tab when chatting
  const [rightPanelTab, setRightPanelTab] = useState<'feed' | 'passport' | 'gap' | 'schemes'>('feed');

  // Multi-Agent Pipeline Nodes State
  const [agentNodes, setAgentNodes] = useState<AgentNode[]>(INITIAL_AGENT_NODES);
  const [activeNodeId, setActiveNodeId] = useState<AgentNodeId>('voice_agent');
  
  // Dialogue History & Output Profile
  const [history, setHistory] = useState<DialogueTurn[]>([]);
  const [profile, setProfile] = useState<LivelihoodProfile | undefined>();
  const [readbackPrompt, setReadbackPrompt] = useState<{ text: string; translation?: string } | null>(null);

  // Field Queue Synchronized Records
  const [fieldQueue, setFieldQueue] = useState<FieldQueueRecord[]>([
    { id: '1', name: 'Basavaraj Patil', trade: 'Farmer / Tractor Operator', time: '10:45 AM', match: 'PMKVY 4.0 (94%)', status: 'Completed' },
    { id: '2', name: 'Lakshmi Bai', trade: 'Tailor & Handicrafts', time: '11:15 AM', match: 'PM Vishwakarma (91%)', status: 'Completed' },
    { id: '3', name: 'Ramesh Kumar', trade: 'Mason / Concrete Worker', time: '12:00 PM', match: 'PMAY Skill (88%)', status: 'Completed' },
    { id: '4', name: 'Manjula S.', trade: 'Dairy Farm Worker', time: '01:30 PM', match: 'Rashtriya Gokul (92%)', status: 'Completed' },
    { id: '5', name: 'Mallikarjun', trade: 'Electrician / Wireman', time: '02:15 PM', match: 'PM Surya Ghar (86%)', status: 'Completed' }
  ]);

  // Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [provider, setProvider] = useState<AIProvider>(agentPipeline.getProvider());
  const [apiKeys, setApiKeys] = useState<{ gemini: string; grok: string; openai: string }>(agentPipeline.getApiKeys());

  const autoListenRef = useRef(autoListen);
  autoListenRef.current = autoListen;

  const conversationStateRef = useRef(conversationState);
  conversationStateRef.current = conversationState;

  const historyRef = useRef<DialogueTurn[]>(history);
  historyRef.current = history;

  const currentLanguageRef = useRef<SupportedLanguage>(currentLanguage);
  currentLanguageRef.current = currentLanguage;

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Subscribe to beneficiary database count
  useEffect(() => {
    const unsubscribe = databaseService.subscribe(() => {
      setBeneficiaryCount(databaseService.getAllBeneficiaries().length);
    });
    return unsubscribe;
  }, []);

  // Initialize Greeting on Mount or Language Switch
  useEffect(() => {
    resetConversation(currentLanguage);
  }, [currentLanguage]);

  const updateAgentNodeStatus = (activeId: AgentNodeId) => {
    setActiveNodeId(activeId);
    setAgentNodes(prev => {
      const nodeOrder: AgentNodeId[] = [
        'voice_agent',
        'understanding_agent',
        'profile_agent',
        'skill_mapping_agent',
        'confirmation_agent',
        'skill_gap_agent',
        'program_matching_agent',
        'coordinator_agent'
      ];
      const activeIdx = nodeOrder.indexOf(activeId);

      return prev.map(node => {
        const idx = nodeOrder.indexOf(node.id);
        if (idx < activeIdx) {
          return { ...node, status: 'completed' };
        } else if (idx === activeIdx) {
          return { ...node, status: 'active' };
        } else {
          return { ...node, status: 'pending' };
        }
      });
    });
  };

  const startListeningInternal = useCallback(() => {
    voiceService.stopSpeaking();
    setMicState('LISTENING');

    const success = voiceService.startListening(
      currentLanguageRef.current,
      (text, isFinal) => {
        if (isFinal) {
          setTranscriptInterim('');
          setMicState('PROCESSING');
          handleProcessUserInput(text);
        } else {
          setTranscriptInterim(text);
        }
      },
      (error) => {
        console.warn('Speech Recognition notice:', error);
        setMicState('IDLE');
        setTranscriptInterim('');
      },
      () => {
        setMicState('IDLE');
      }
    );

    if (!success) {
      setMicState('IDLE');
    }
  }, []);

  const resetConversation = (lang: SupportedLanguage = currentLanguageRef.current, nameOverride?: string) => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
    if (nameOverride && nameOverride.trim()) {
      agentPipeline.setCitizenName(nameOverride.trim());
    }
    agentPipeline.resetInterview(Boolean(nameOverride || agentPipeline.getCitizenName()));
    setMicState('IDLE');
    setTranscriptInterim('');
    setConversationState('LANDING');
    setProfile(undefined);
    setReadbackPrompt(null);
    setRightPanelTab('feed');
    updateAgentNodeStatus('voice_agent');

    const greeting = agentPipeline.getInitialGreeting(lang, nameOverride);
    setHistory([greeting]);

    if (audioEnabled) {
      voiceService.speak(
        greeting.text,
        lang,
        () => setMicState('RESPONDING'),
        () => {
          setMicState('IDLE');
          // Hands-free continuous loop: start listening after greeting finishes
          if (autoListenRef.current && conversationStateRef.current !== 'RESULTS_VIEW') {
            setTimeout(() => {
              startListeningInternal();
            }, 500);
          }
        }
      );
    }
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_language', newLang);
    }
    voiceService.setLanguage(newLang);
  };

  const handleToggleMic = () => {
    if (micState === 'LISTENING') {
      const interim = transcriptInterim;
      voiceService.stopListening();
      setMicState('IDLE');
      setTranscriptInterim('');
      if (interim && interim.trim().length > 0) {
        handleProcessUserInput(interim.trim());
      }
    } else {
      startListeningInternal();
    }
  };

  const handleProcessUserInput = async (userInput: string) => {
    if (!userInput.trim()) return;

    // Immediately stop mic and audio to prevent feedback loops
    voiceService.stopListening();
    voiceService.stopSpeaking();

    // Add User turn (clean up display if internal command)
    const displayText = userInput === 'CONFIRMED_YES' 
      ? (currentLanguageRef.current === 'kn' ? 'ಹೌದು, ಇದು ಸಂಪೂರ್ಣ ಸರಿಯಾಗಿದೆ.' : currentLanguageRef.current === 'hi' ? 'हाँ, यह बिल्कुल सही है।' : 'Yes, this is completely correct.')
      : userInput === 'CORRECTION_NO'
      ? (currentLanguageRef.current === 'kn' ? 'ಇಲ್ಲ, ನಾನು ಇದನ್ನು ತಿದ್ದುತ್ತೇನೆ.' : currentLanguageRef.current === 'hi' ? 'नहीं, मैं इसमें सुधार करना चाहता हूँ।' : 'No, let me correct it.')
      : userInput.trim();

    const userTurn: DialogueTurn = {
      id: `turn-${Date.now()}`,
      speaker: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...historyRef.current, userTurn];
    setHistory(updatedHistory);
    setMicState('PROCESSING');

    // Process through Agent Pipeline with the latest state ref
    const res = await agentPipeline.processUserInput(
      userInput.trim(),
      conversationStateRef.current,
      currentLanguageRef.current,
      updatedHistory,
      profile
    );

    // If Session Reset Command: Clear profile, reset visualizer and restart fresh
    if (res.reasoningStep?.step === 'Session Reset Command' || agentPipeline.isResetCommand(userInput)) {
      setProfile(undefined);
      setReadbackPrompt(null);
      setConversationState('INTERVIEW_OCCUPATION');
      setRightPanelTab('feed');
      updateAgentNodeStatus('voice_agent');

      const greetingTurn: DialogueTurn = {
        id: `turn-ai-${Date.now()}`,
        speaker: 'ai',
        text: res.spokenText,
        translation: res.englishTranslation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentNode: 'voice_agent'
      };

      setHistory([userTurn, greetingTurn]);

      if (audioEnabled) {
        voiceService.speak(
          res.spokenText,
          currentLanguageRef.current,
          () => setMicState('RESPONDING'),
          () => {
            setMicState('IDLE');
            if (autoListenRef.current) {
              setTimeout(() => {
                startListeningInternal();
              }, 600);
            }
          }
        );
      } else {
        setMicState('IDLE');
      }
      return;
    }

    if (res.nextState === 'RESULTS_VIEW') {
      // Step sequentially through confirmation_agent -> skill_gap_agent -> program_matching_agent -> coordinator_agent
      updateAgentNodeStatus('confirmation_agent');
      await new Promise(r => setTimeout(r, 350));
      updateAgentNodeStatus('skill_gap_agent');
      await new Promise(r => setTimeout(r, 400));
      updateAgentNodeStatus('program_matching_agent');
      await new Promise(r => setTimeout(r, 400));
      updateAgentNodeStatus('coordinator_agent');
    } else {
      updateAgentNodeStatus(res.activeNodeId);
    }
    setConversationState(res.nextState);

    if (res.updatedProfile) {
      setProfile(res.updatedProfile);
      if (res.nextState === 'RESULTS_VIEW') {
        setRightPanelTab('passport');
        const citizenName = res.updatedProfile.citizenName || agentPipeline.getCitizenName() || 'Citizen Applicant';
        const bestScheme = res.updatedProfile.matchedPrograms?.[0];
        const matchStr = bestScheme ? `${bestScheme.title.slice(0, 18)}... (${bestScheme.matchPercentage}%)` : 'PMKVY 4.0 (95%)';
        const newRecord: FieldQueueRecord = {
          id: res.updatedProfile.id || String(Date.now()),
          name: citizenName,
          trade: res.updatedProfile.occupation,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          match: matchStr,
          status: 'Completed',
          profile: res.updatedProfile
        };
        setFieldQueue(prev => [newRecord, ...prev.filter(r => r.id !== newRecord.id)]);
      }
    }

    if (res.isReadbackPrompt) {
      setReadbackPrompt({
        text: res.spokenText,
        translation: res.englishTranslation
      });
    } else {
      setReadbackPrompt(null);
    }

    // Add AI Turn
    const aiTurn: DialogueTurn = {
      id: `turn-ai-${Date.now()}`,
      speaker: 'ai',
      text: res.spokenText,
      translation: res.englishTranslation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentNode: res.activeNodeId
    };

    setHistory(prev => [...prev, aiTurn]);

    // Speak response + Hands-free automatic loop
    if (audioEnabled) {
      voiceService.speak(
        res.spokenText,
        currentLanguageRef.current,
        () => setMicState('RESPONDING'),
        () => {
          setMicState('IDLE');
          // If auto-listen is enabled and we still need user input, trigger mic automatically with safe delay!
          if (
            autoListenRef.current && 
            res.nextState !== 'RESULTS_VIEW'
          ) {
            setTimeout(() => {
              startListeningInternal();
            }, 600);
          }
        }
      );
    } else {
      setMicState('IDLE');
    }
  };

  const handleReadbackConfirm = (isConfirmed: boolean) => {
    const command = isConfirmed ? 'CONFIRMED_YES' : 'CORRECTION_NO';
    handleProcessUserInput(command);
  };

  const handleSelectCandidate = (candidate: BeneficiaryRecord) => {
    setActiveMode('voice');
    setProfile(candidate.profile);
    setConversationState('RESULTS_VIEW');
    setRightPanelTab('passport');
    updateAgentNodeStatus('coordinator_agent');
    setIsRegistryOpen(false);

    // Add brief summary turn to history
    const loadTurn: DialogueTurn = {
      id: `turn-load-${Date.now()}`,
      speaker: 'ai',
      text: `Loaded candidate profile: ${candidate.name} (${candidate.trade}) - ${candidate.nsqfLevel}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentNode: 'coordinator_agent'
    };
    setHistory(prev => [...prev, loadTurn]);
  };

  const handleStartFieldSession = (name: string, trade: string) => {
    setActiveMode('voice');
    if (name && name.trim()) {
      agentPipeline.setCitizenName(name.trim());
    }
    resetConversation(currentLanguageRef.current, name.trim());
    if (trade && trade.trim()) {
      setTimeout(() => {
        handleProcessUserInput(trade.trim());
      }, 500);
    }
  };

  const handleSaveConfig = (config: { provider: AIProvider; geminiKey: string; grokKey: string }) => {
    setProvider(config.provider);
    setApiKeys({
      gemini: config.geminiKey,
      grok: config.grokKey,
      openai: ''
    });
    agentPipeline.setProvider(config.provider);
    agentPipeline.setApiKeys({
      gemini: config.geminiKey,
      grok: config.grokKey
    });
  };

  const hasConfiguredKey = Boolean(apiKeys.gemini || apiKeys.grok);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenValidator={() => setIsValidatorOpen(true)}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        beneficiaryCount={beneficiaryCount}
        hasApiKey={hasConfiguredKey}
        isListening={micState === 'LISTENING'}
        isSpeaking={micState === 'RESPONDING'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* USE CASE 2: FIELD ASSISTANT MODE */}
        {activeMode === 'field' && (
          <FieldAssistantMode
            currentLanguage={currentLanguage}
            onLaunchCitizenSession={handleStartFieldSession}
            queueRecords={fieldQueue}
          />
        )}

        {/* USE CASE 3: 1800-SAKSHAM IVR HELPLINE MODE */}
        {activeMode === 'ivr' && (
          <IvrHelplineMode
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onOpenProfile={() => {
              setActiveMode('voice');
              setRightPanelTab('passport');
            }}
          />
        )}

        {/* IMPACT & EVALUATION DASHBOARD */}
        {activeMode === 'dashboard' && (
          <ImpactDashboard currentLanguage={currentLanguage} />
        )}

        {/* USE CASE 1: CITIZEN VOICE DISCOVERY STUDIO (CORE JOURNEY) */}
        {activeMode === 'voice' && (
          <>
            {/* Hero Landing Section (When at initial state) */}
            {conversationState === 'LANDING' && !profile && (
              <HeroLanding
                currentLanguage={currentLanguage}
                onStartVoice={() => {
                  setConversationState('INTERVIEW_NAME_LOCATION');
                  handleToggleMic();
                }}
              />
            )}

            {/* AI Multi-Agent Workflow Visualizer */}
            <AgentWorkflowVisualizer
              nodes={agentNodes}
              activeNodeId={activeNodeId}
              currentLanguage={currentLanguage}
            />

            {/* Prominent Read-Back Confirmation Banner when in Confirmation State */}
            {conversationState === 'READBACK_CONFIRMATION' && readbackPrompt && (
              <div className="w-full animate-in zoom-in-95 duration-300">
                <ReadbackConfirmationModal
                  promptText={readbackPrompt.text}
                  translation={readbackPrompt.translation}
                  currentLanguage={currentLanguage}
                  onConfirm={handleReadbackConfirm}
                  onReplayAudio={() =>
                    voiceService.speak(
                      readbackPrompt.text,
                      currentLanguage,
                      () => setMicState('RESPONDING'),
                      () => setMicState('IDLE')
                    )
                  }
                  onSendCorrection={(corr) => handleProcessUserInput(corr)}
                />
              </div>
            )}

            {/* Symmetrical Dual-Pane AI Studio (Equal Heights, No Bottom Gaps) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: Voice Studio (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <VoiceConversationHub
                  micState={micState}
                  conversationState={conversationState}
                  currentLanguage={currentLanguage}
                  transcriptInterim={transcriptInterim}
                  audioEnabled={audioEnabled}
                  autoListen={autoListen}
                  history={history}
                  onToggleMic={handleToggleMic}
                  onSendMessage={handleProcessUserInput}
                  onToggleAudio={() => setAudioEnabled(!audioEnabled)}
                  onToggleAutoListen={() => setAutoListen(!autoListen)}
                  onReplayAudio={(text) =>
                    voiceService.speak(
                      text,
                      currentLanguage,
                      () => setMicState('RESPONDING'),
                      () => setMicState('IDLE')
                    )
                  }
                  onResetSession={() => resetConversation(currentLanguage)}
                />
              </div>

              {/* Right Column: Live Intelligence Workspace (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[480px]">
                {/* Tab Header */}
                <div className="mb-3 pb-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <button
                      onClick={() => setRightPanelTab('feed')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                        rightPanelTab === 'feed'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Dialogue Feed ({history.length})</span>
                    </button>

                    {profile && (
                      <>
                        <button
                          onClick={() => setRightPanelTab('passport')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                            rightPanelTab === 'passport'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Kaushal Passport</span>
                        </button>

                        <button
                          onClick={() => setRightPanelTab('gap')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                            rightPanelTab === 'gap'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Skill Gap</span>
                        </button>

                        <button
                          onClick={() => setRightPanelTab('schemes')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                            rightPanelTab === 'schemes'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Schemes ({profile.matchedPrograms.length})</span>
                        </button>
                      </>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    State: {conversationState}
                  </span>
                </div>

                {/* Tab 1: Dialogue History Stream */}
                {rightPanelTab === 'feed' && (
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
                    {history.map((turn) => {
                      const isAi = turn.speaker === 'ai';
                      return (
                        <div
                          key={turn.id}
                          className={`flex gap-2.5 text-xs sm:text-sm ${
                            isAi ? 'items-start' : 'items-start flex-row-reverse'
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                              isAi
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-emerald-600 text-white font-bold'
                            }`}
                          >
                            {isAi ? 'AI' : 'YOU'}
                          </div>

                          {/* Bubble */}
                          <div
                            className={`p-3.5 rounded-xl max-w-[85%] space-y-1 ${
                              isAi
                                ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                                : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 rounded-tr-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400">
                              <span className="font-bold uppercase tracking-wider">
                                {isAi ? 'Saksham Agent' : 'Citizen Input'}
                              </span>
                              <span>{turn.timestamp}</span>
                            </div>

                            <p className="font-normal leading-relaxed">{turn.text}</p>

                            {turn.translation && currentLanguage !== 'en' && (
                              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-700/50">
                                EN: {turn.translation}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Tab 2: Embedded Passport Preview */}
                {rightPanelTab === 'passport' && profile && (
                  <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
                    <SkillProfileCard profile={profile} currentLanguage={currentLanguage} />
                  </div>
                )}

                {/* Tab 3: Embedded Skill Gap Preview */}
                {rightPanelTab === 'gap' && profile && (
                  <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
                    <SkillGapAnalysisCard skillGap={profile.skillGap} currentLanguage={currentLanguage} />
                  </div>
                )}

                {/* Tab 4: Embedded Schemes Preview */}
                {rightPanelTab === 'schemes' && profile && (
                  <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
                    <ProgramRecommendations programs={profile.matchedPrograms} currentLanguage={currentLanguage} />
                  </div>
                )}
              </div>
            </div>

            {/* FULL OUTPUT SECTION: Mapped Profile, Skill Gap, Recommendations & Roadmap */}
            {profile && (
              <div className="space-y-6 pt-4 animate-in fade-in duration-500">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Complete Kaushal Skill Dossier & Action Plan
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    NSQF Level Verified
                  </span>
                </div>

                {/* 1. Kaushal Skill Profile Card */}
                <SkillProfileCard
                  profile={profile}
                  currentLanguage={currentLanguage}
                />

                {/* 2. Skill Gap Analysis Card */}
                <SkillGapAnalysisCard
                  skillGap={profile.skillGap}
                  currentLanguage={currentLanguage}
                />

                {/* 3. Program Recommendations with AI Explainability */}
                <ProgramRecommendations
                  programs={profile.matchedPrograms}
                  currentLanguage={currentLanguage}
                />

                {/* 4. 90-Day Action Roadmap */}
                <Roadmap90Days
                  steps={profile.roadmap}
                  currentLanguage={currentLanguage}
                />

                {/* 5. Final Opportunity Banner */}
                <FinalOpportunityBanner
                  currentLanguage={currentLanguage}
                  onRestartSession={() => resetConversation(currentLanguage)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* AI Settings / Multi-Model AI Key & Voice Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProvider={provider}
        currentLanguage={currentLanguage}
        geminiKey={apiKeys.gemini}
        grokKey={apiKeys.grok}
        onSaveConfig={handleSaveConfig}
      />

      {/* 100% Hackathon Solution & Evaluation Matrix Modal */}
      <HackathonValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
      />

      {/* Beneficiary Database & Candidate Registry Modal */}
      <BeneficiaryRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        currentLanguage={currentLanguage}
        onSelectCandidate={handleSelectCandidate}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-[11px] text-slate-500 space-y-0.5">
        <p className="font-semibold text-slate-400">
          SAKSHAM VOICE — National Agentic AI Livelihood Platform
        </p>
        <p>
          Empowering rural and informal workers with multilingual voice accessibility & NSQF skill recognition.
        </p>
      </footer>
    </div>
  );
};

export default App;
