import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type VoiceGenderPreference = 'female' | 'male' | 'system';

export interface VoiceSettingsConfig {
  gender: VoiceGenderPreference;
  voiceURI: string;
  pitch: number;
  rate: number;
}

export class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private currentLanguage: SupportedLanguage = 'kn';
  private speechTimeout: any = null;
  private silenceTimer: any = null;
  private accumulatedText: string = '';
  private interimText: string = '';
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  // Voice Persona Settings
  private preferredGender: VoiceGenderPreference = 'female';
  private preferredVoiceURI: string = '';
  private preferredPitch: number = 1.05;
  private preferredRate: number = 0.95;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedGender = localStorage.getItem('saksham_voice_gender') as VoiceGenderPreference;
      if (savedGender && ['female', 'male', 'system'].includes(savedGender)) {
        this.preferredGender = savedGender;
      }
      this.preferredVoiceURI = localStorage.getItem('saksham_voice_uri') || '';
      const savedPitch = parseFloat(localStorage.getItem('saksham_voice_pitch') || '1.05');
      if (!isNaN(savedPitch)) this.preferredPitch = savedPitch;
      const savedRate = parseFloat(localStorage.getItem('saksham_voice_rate') || '0.95');
      if (!isNaN(savedRate)) this.preferredRate = savedRate;
    }
  }

  public getVoiceSettings(): VoiceSettingsConfig {
    return {
      gender: this.preferredGender,
      voiceURI: this.preferredVoiceURI,
      pitch: this.preferredPitch,
      rate: this.preferredRate
    };
  }

  public setVoiceSettings(config: Partial<VoiceSettingsConfig>) {
    if (config.gender !== undefined) {
      this.preferredGender = config.gender;
      if (typeof window !== 'undefined') localStorage.setItem('saksham_voice_gender', config.gender);
    }
    if (config.voiceURI !== undefined) {
      this.preferredVoiceURI = config.voiceURI;
      if (typeof window !== 'undefined') localStorage.setItem('saksham_voice_uri', config.voiceURI);
    }
    if (config.pitch !== undefined) {
      this.preferredPitch = config.pitch;
      if (typeof window !== 'undefined') localStorage.setItem('saksham_voice_pitch', config.pitch.toString());
    }
    if (config.rate !== undefined) {
      this.preferredRate = config.rate;
      if (typeof window !== 'undefined') localStorage.setItem('saksham_voice_rate', config.rate.toString());
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    if (this.recognition && this.isListening) {
      this.stopListening();
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public startListening(
    lang: SupportedLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    const SpeechRec = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRec) {
      onError('Browser Speech Recognition is not supported. Please type your message.');
      return false;
    }

    try {
      this.stopSpeaking();
      this.stopListening();

      this.accumulatedText = '';
      this.interimText = '';
      this.onResultCallback = onResult;
      this.onEndCallback = onEnd;

      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.currentLanguage = lang;
      const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      const speechCode = meta ? meta.speechCode : (lang === 'kn' ? 'kn-IN' : 'en-IN');
      this.recognition.lang = speechCode;

      const resetSilenceTimer = () => {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          const fullText = (this.accumulatedText + ' ' + this.interimText).trim();
          if (fullText.length > 0 && this.isListening) {
            this.commitResultAndStop(fullText);
          }
        }, 2200);
      };

      this.recognition.onresult = (event: any) => {
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            this.accumulatedText = (this.accumulatedText + ' ' + transcriptChunk).trim();
          } else {
            currentInterim += transcriptChunk;
          }
        }

        this.interimText = currentInterim;
        const currentFull = (this.accumulatedText + ' ' + this.interimText).trim();

        if (currentFull.length > 0) {
          onResult(currentFull, false);
          resetSilenceTimer();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event for locale', speechCode, ':', event.error);
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error !== 'aborted') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          const fullText = (this.accumulatedText + ' ' + this.interimText).trim();
          if (fullText.length > 0) {
            this.commitResultAndStop(fullText);
          } else {
            this.isListening = false;
            if (this.onEndCallback) this.onEndCallback();
          }
        }
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      this.isListening = false;
      onError(err.message || 'Could not start microphone');
      return false;
    }
  }

  private commitResultAndStop(fullText: string) {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const callback = this.onResultCallback;
    const endCb = this.onEndCallback;

    this.stopListening();

    if (callback && fullText.trim().length > 0) {
      callback(fullText.trim(), true);
    }
    if (endCb) {
      endCb();
    }
  }

  public finishSpeakingNow() {
    const fullText = (this.accumulatedText + ' ' + this.interimText).trim();
    if (fullText.length > 0) {
      this.commitResultAndStop(fullText);
    } else {
      this.stopListening();
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  public stopListening() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  private selectBestVoice(speechCode: string, lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // 1. If user explicitly selected a fixed voice URI, use it
    if (this.preferredVoiceURI) {
      const explicit = voices.find(v => v.voiceURI === this.preferredVoiceURI || v.name === this.preferredVoiceURI);
      if (explicit) return explicit;
    }

    // 2. Filter voices for current language / locale
    const langLower = lang.toLowerCase();
    const codeLower = speechCode.toLowerCase();
    const matchingVoices = voices.filter(v => 
      v.lang.toLowerCase() === codeLower || 
      v.lang.toLowerCase().startsWith(langLower) ||
      v.lang.toLowerCase().replace('_', '-').startsWith(codeLower)
    );

    const candidates = matchingVoices.length > 0 ? matchingVoices : voices;

    // 3. Filter by preferred Gender
    if (this.preferredGender === 'female') {
      const femaleKeywords = ['female', 'girl', 'woman', 'zira', 'heera', 'neerja', 'priya', 'kalpana', 'swara', 'sangeeta', 'ananya', 'veena'];
      const foundFemale = candidates.find(v => femaleKeywords.some(kw => v.name.toLowerCase().includes(kw)));
      if (foundFemale) return foundFemale;
    } else if (this.preferredGender === 'male') {
      const maleKeywords = ['male', 'boy', 'man', 'david', 'ravi', 'george', 'madhav', 'prabhat', 'mohan', 'karthik', 'hemanth'];
      const foundMale = candidates.find(v => maleKeywords.some(kw => v.name.toLowerCase().includes(kw)));
      if (foundMale) return foundMale;
    }

    return candidates[0] || null;
  }

  public speak(
    text: string,
    lang: SupportedLanguage = this.currentLanguage,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopListening();
      this.stopSpeaking();

      const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      const speechCode = meta ? meta.speechCode : (lang === 'kn' ? 'kn-IN' : 'en-IN');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechCode;

      // Apply User's Fixed Speed and Pitch
      utterance.rate = this.preferredRate || 0.95;
      
      if (this.preferredGender === 'female') {
        utterance.pitch = Math.max(1.1, this.preferredPitch || 1.12);
      } else if (this.preferredGender === 'male') {
        utterance.pitch = Math.min(0.9, this.preferredPitch || 0.88);
      } else {
        utterance.pitch = this.preferredPitch || 1.0;
      }

      const voice = this.selectBestVoice(speechCode, lang);
      if (voice) {
        utterance.voice = voice;
      }

      let hasEnded = false;
      const safeEnd = () => {
        if (!hasEnded) {
          hasEnded = true;
          this.isSpeaking = false;
          if (this.speechTimeout) clearTimeout(this.speechTimeout);
          if (onEnd) onEnd();
        }
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();

        const estimatedDurationMs = Math.max(3000, (text.length / 10) * 1000 + 2500);
        if (this.speechTimeout) clearTimeout(this.speechTimeout);
        this.speechTimeout = setTimeout(() => {
          if (this.isSpeaking) {
            safeEnd();
          }
        }, estimatedDurationMs);
      };

      utterance.onend = () => {
        safeEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance notice:', e);
        safeEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isSpeaking = false;
  }
}

export const voiceService = new VoiceService();
