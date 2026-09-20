import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private currentLanguage: SupportedLanguage = 'en'; // Default initial language or synced
  private speechTimeout: any = null;

  constructor() {
    // Initialized dynamically per session
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public startListening(
    lang: SupportedLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onError('Browser Speech Recognition is not supported. Please type in the text box or use demo mode.');
      return false;
    }

    try {
      this.stopSpeaking();
      this.stopListening();

      // Clean, fresh recognition instance per session with exact locale
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.currentLanguage = lang;
      const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      const speechCode = meta ? meta.speechCode : (lang === 'kn' ? 'kn-IN' : 'en-IN');
      this.recognition.lang = speechCode;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final.trim().length > 0) {
          onResult(final.trim(), true);
        } else if (interim.trim().length > 0) {
          onResult(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Voice recognition error for locale', speechCode, ':', event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
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

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
      this.isListening = false;
    }
  }

  public speak(
    text: string,
    lang: SupportedLanguage = this.currentLanguage,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!('speechSynthesis' in window)) {
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
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.toLowerCase() === speechCode.toLowerCase() || v.lang.startsWith(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
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

        // Safety timeout in case browser speech synth stalls
        const estimatedDurationMs = Math.max(3000, (text.length / 10) * 1000 + 2000);
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
        console.warn('Speech synthesis utterance error:', e);
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
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeaking = false;
  }
}

export const voiceService = new VoiceService();
