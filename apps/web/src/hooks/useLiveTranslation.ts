import { useEffect, useRef } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';

export function useLiveTranslation() {
  const { segments, preferredLanguage, updateSegmentTranslation } = useTranscriptStore();
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // If the user's preferred language is English, we don't translate by default unless the speaker spoke a different language.
    // In this MVP, we assume the base meeting is multi-lingual and we target translation to the user's preferred language.
    if (preferredLanguage === 'en') return; 

    // Find finalized segments that don't have the preferred language translation yet
    const pendingSegments = segments.filter(
      s => s.isFinal && (!s.translations || !s.translations[preferredLanguage]) && !processingRef.current.has(`${s.id}-${preferredLanguage}`)
    );

    pendingSegments.forEach(async (segment) => {
      const cacheKey = `${segment.id}-${preferredLanguage}`;
      processingRef.current.add(cacheKey);
      
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ 
            text: segment.text, 
            targetLang: preferredLanguage,
            // Pass last 3 segments to Claude for high-context translation
            context: segments.slice(Math.max(0, segments.length - 4), segments.length - 1).map(s => s.text).join(' ') 
          })
        });
        const data = await res.json();
        
        if (data.translation) {
          updateSegmentTranslation(segment.id, preferredLanguage, data.translation, data.notes);
          
          // Browser Text-To-Speech (Multilingual Audio Mode)
          // Speak out the translation if the speaker is someone else
          if (segment.speakerId !== 'local' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(data.translation);
            utterance.lang = preferredLanguage; 
            utterance.rate = 1.1; // Slightly sped up to keep real-time pace
            // window.speechSynthesis.speak(utterance); // Commented out by default so it doesn't overlap actual voices unless explicitly enabled
          }
        }
      } catch (err) {
        console.error("Translation error", err);
      }
    });

  }, [segments, preferredLanguage, updateSegmentTranslation]);
}
