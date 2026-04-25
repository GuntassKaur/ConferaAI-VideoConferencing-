'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTracks } from '@livekit/components-react';
import { useIsSpeaking } from '@livekit/components-react';
import { Track } from 'livekit-client';

export interface HealthData {
  score: number;
  status: 'excellent' | 'good' | 'lagging' | 'critical';
  insights: string[];
  participantTalkTimes: Record<string, number>;
}

// Per-participant speaking tracker component helper
function useSpeakingTracker(
  participants: { isSpeaking: boolean, identity: string }[],
  talkTimeRef: React.MutableRefObject<Record<string, number>>,
  silenceRef: React.MutableRefObject<number>
) {
  // We track speaking states via a simple polling approach
  useEffect(() => {
    const interval = setInterval(() => {
      let anyoneSpeaking = false;
      participants.forEach(p => {
        if (p.isSpeaking) {
          anyoneSpeaking = true;
          talkTimeRef.current[p.identity] = (talkTimeRef.current[p.identity] || 0) + 1;
        }
      });
      if (!anyoneSpeaking) {
        silenceRef.current += 1;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [participants, talkTimeRef, silenceRef]);
}

export function useMeetingHealth(roomId: string, reactionCount: number) {
  const [healthData, setHealthData] = useState<HealthData>({
    score: 75,
    status: 'good',
    insights: ['Session initializing...'],
    participantTalkTimes: {},
  });

  const talkTimeRef = useRef<Record<string, number>>({});
  const silenceRef = useRef(0);
  const [startTime] = useState(() => Date.now());
  const startTimeRef = useRef(startTime);

  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);
  const participants = tracks.map(t => t.participant);

  // Track talking time
  useSpeakingTracker(participants, talkTimeRef, silenceRef);

  const calculateHealth = useCallback(() => {
    const talkTimes = { ...talkTimeRef.current };
    const totalTalkTime = Object.values(talkTimes).reduce((a, b) => a + b, 0);
    const participantCount = Math.max(Object.keys(talkTimes).length, 1);
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

    // 1. Talk time balance score (0-40 pts): lower std deviation = better
    let balanceScore = 40;
    if (totalTalkTime > 0 && participantCount > 1) {
      const avgTalk = totalTalkTime / participantCount;
      const variance = Object.values(talkTimes).reduce((acc, t) => acc + Math.pow(t - avgTalk, 2), 0) / participantCount;
      const stdDev = Math.sqrt(variance);
      const dominanceRatio = stdDev / Math.max(avgTalk, 1);
      balanceScore = Math.max(0, Math.round(40 - dominanceRatio * 20));
    }

    // 2. Reaction engagement (0-25 pts)
    const reactionScore = Math.min(25, reactionCount * 5);

    // 3. Silence penalty (0-20 pts): > 30% silence is bad
    const silenceRatio = elapsed > 0 ? silenceRef.current / elapsed : 0;
    const silenceScore = Math.round(Math.max(0, 20 - silenceRatio * 30));

    // 4. Base activity (0-15 pts)
    const activityScore = totalTalkTime > 10 ? 15 : Math.round(totalTalkTime * 1.5);

    const total = Math.min(100, balanceScore + reactionScore + silenceScore + activityScore);

    const status: HealthData['status'] =
      total >= 80 ? 'excellent' : total >= 60 ? 'good' : total >= 40 ? 'lagging' : 'critical';

    const insights: string[] = [];
    if (balanceScore < 20 && participantCount > 1)
      insights.push('One participant is dominating the conversation.');
    if (silenceScore < 8) insights.push('Extended silence detected — consider re-engaging.');
    if (reactionScore > 15) insights.push('High reaction rate — participants are engaged!');
    if (total >= 80) insights.push('Excellent session energy and balance.');
    if (insights.length === 0) insights.push('Session proceeding within normal parameters.');

    return { score: total, status, insights, participantTalkTimes: talkTimes };
  }, [reactionCount]);

  // Recalculate every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const data = calculateHealth();
      setHealthData(data);
    }, 30000);
    return () => clearInterval(interval);
  }, [calculateHealth]);

  // Persist to MongoDB every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = calculateHealth();
      setHealthData(data);
      try {
        await fetch('/api/meeting/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, ...data }),
        });
      } catch (e) {
        console.error('Health save failed:', e);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [roomId, calculateHealth]);

  return healthData;
}
