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
  private currentLanguage: SupportedLanguage = 'en';
  private speechTimeout: any = null;
  private silenceTimer: any = null;
  private accumulatedText: string = '';
  private interimText: string = '';
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch {
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
      onError('Browser Speech Recognition is not supported. Please type in the text box.');
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
      // Enable continuous listening so the mic stays open while the user speaks multiple sentences/phrases
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.currentLanguage = lang;
      const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      const speechCode = meta ? meta.speechCode : (lang === 'kn' ? 'kn-IN' : 'en-IN');
      this.recognition.lang = speechCode;

      const resetSilenceTimer = () => {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        // After 2.0 seconds of silence with spoken content, commit the final result
        this.silenceTimer = setTimeout(() => {
          const fullText = (this.accumulatedText + ' ' + this.interimText).trim();
          if (fullText.length > 0 && this.isListening) {
            this.commitResultAndStop(fullText);
          }
        }, 2000);
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
        console.warn('Voice recognition notice for locale', speechCode, ':', event.error);
        if (event.error === 'no-speech') {
          // Keep listening rather than closing immediately on mild pauses
          return;
        }
        if (event.error !== 'aborted') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // If recognition ended naturally, check if we have text to commit
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
    if ('speechSynthesis' in window) {
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
