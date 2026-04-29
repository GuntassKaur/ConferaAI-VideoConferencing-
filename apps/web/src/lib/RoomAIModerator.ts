import { useTranscriptStore } from '@/store/useTranscriptStore';

export class RoomAIModerator {
  private roomId: string;
  private goal: string;
  private lastSpokenTime: number;
  private silenceCheckInterval: NodeJS.Timeout | null = null;
  private summaryInterval: NodeJS.Timeout | null = null;
  private onPromptNeeded: (prompt: string) => void;
  private onSummaryGenerated: (summary: string) => void;

  constructor(
    roomId: string, 
    goal: string, 
    onPromptNeeded: (p: string) => void, 
    onSummaryGenerated: (s: string) => void
  ) {
    this.roomId = roomId;
    this.goal = goal;
    this.lastSpokenTime = Date.now();
    this.onPromptNeeded = onPromptNeeded;
    this.onSummaryGenerated = onSummaryGenerated;
  }

  public start() {
    console.log(`[AI Moderator] Started monitoring Room ${this.roomId}`);
    
    // Monitor for stalled discussion (Check every 10s)
    this.silenceCheckInterval = setInterval(() => {
      const now = Date.now();
      // Trigger if silence exceeds 2 minutes (120000ms)
      if (now - this.lastSpokenTime > 120000) {
        this.handleStall();
        // Reset clock to avoid spamming
        this.lastSpokenTime = now;
      }
    }, 10000);

    // Generate periodic progress summaries (Every 5 min)
    this.summaryInterval = setInterval(() => {
      this.generateSummary();
    }, 300000);
  }

  public stop() {
    console.log(`[AI Moderator] Stopped monitoring Room ${this.roomId}`);
    if (this.silenceCheckInterval) clearInterval(this.silenceCheckInterval);
    if (this.summaryInterval) clearInterval(this.summaryInterval);
  }

  public recordSpeechActivity() {
    this.lastSpokenTime = Date.now();
  }

  private async handleStall() {
    console.log(`[AI Moderator] Room stalled. Generating prompt...`);
    const segments = useTranscriptStore.getState().segments;
    const recent = segments.slice(-10).map(s => `${s.speakerName}: ${s.text}`).join('\n');
    
    try {
      const res = await fetch('/api/breakout', {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'moderate_stall', 
          payload: { goal: this.goal, recentTranscript: recent } 
        })
      });
      const data = await res.json();
      if (data.prompt) {
        this.onPromptNeeded(data.prompt);
      }
    } catch (e) {
      console.error("[AI Moderator] Failed to generate stall prompt", e);
    }
  }

  public async generateSummary() {
    console.log(`[AI Moderator] Generating room summary...`);
    const segments = useTranscriptStore.getState().segments;
    const transcript = segments.map(s => `${s.speakerName}: ${s.text}`).join('\n');
    
    try {
      const res = await fetch('/api/breakout', {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'room_summary', 
          payload: { goal: this.goal, transcript } 
        })
      });
      const data = await res.json();
      if (data.summary) {
        this.onSummaryGenerated(data.summary);
        return data.summary;
      }
    } catch (e) {
      console.error("[AI Moderator] Failed to generate summary", e);
    }
    return null;
  }
}
