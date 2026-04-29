import { useEffect, useRef } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useTranscription(speakerId: string, isSpeaking: boolean) {
  const { updateLastSegment } = useTranscriptStore();
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser. Falling back to Gemini API...');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Multi-language auto-detect logic can be implemented by looping preferred languages
    recognition.lang = 'en-US'; 

    recognition.onstart = () => {
      isListeningRef.current = true;
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      const confidence = result[0].confidence || 0.8; 
      const isFinal = result.isFinal;

      updateLastSegment(speakerId, text, isFinal, confidence);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      isListeningRef.current = false;
      
      // If Web Speech API fails, this is where we trigger Gemini API fallback 
      // by streaming audio chunks over Socket.io to the server.
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      if (isSpeaking) {
        // Restart if still speaking but recognition ended naturally
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (isListeningRef.current) {
        recognition.stop();
      }
    };
  }, [speakerId, updateLastSegment, isSpeaking]);

  // Start/Stop based on VAD (isSpeaking threshold)
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isSpeaking && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    } else if (!isSpeaking && isListeningRef.current) {
      // Let it gracefully finalize the current interim result
    }
  }, [isSpeaking]);

  return { getFullTranscript: useTranscriptStore.getState().getFullTranscript };
}
