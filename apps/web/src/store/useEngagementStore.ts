import { create } from 'zustand';

export interface Reaction {
  id: string;
  emoji: string;
  participantId: string;
  timestamp: number;
}

export interface RaisedHand {
  participantId: string;
  name: string;
  timestamp: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  votedBy: string[];
}

interface EngagementStore {
  reactions: Reaction[];
  raisedHands: RaisedHand[];
  polls: Poll[];
  moodScores: number[];
  teamMood: number | null; 
  wordCloud: { text: string; value: number }[];
  
  addReaction: (reaction: Reaction) => void;
  removeReaction: (id: string) => void;
  
  raiseHand: (participantId: string, name: string) => void;
  lowerHand: (participantId: string) => void;
  
  addPoll: (poll: Poll) => void;
  closePoll: (pollId: string) => void;
  votePoll: (pollId: string, optionId: string, participantId: string) => void;
  
  submitMood: (score: number) => void;
  updateWordCloud: (words: { text: string; value: number }[]) => void;
}

export const useEngagementStore = create<EngagementStore>((set) => ({
  reactions: [],
  raisedHands: [],
  polls: [],
  moodScores: [],
  teamMood: null,
  wordCloud: [],

  addReaction: (reaction) => set((state) => ({
    reactions: [...state.reactions, reaction]
  })),

  removeReaction: (id) => set((state) => ({
    reactions: state.reactions.filter(r => r.id !== id)
  })),

  raiseHand: (participantId, name) => set((state) => {
    if (state.raisedHands.find(h => h.participantId === participantId)) return state;
    return { raisedHands: [...state.raisedHands, { participantId, name, timestamp: Date.now() }] };
  }),

  lowerHand: (participantId) => set((state) => ({
    raisedHands: state.raisedHands.filter(h => h.participantId !== participantId)
  })),

  addPoll: (poll) => set((state) => ({ polls: [poll, ...state.polls] })),

  closePoll: (pollId) => set((state) => ({
    polls: state.polls.map(p => p.id === pollId ? { ...p, active: false } : p)
  })),

  votePoll: (pollId, optionId, participantId) => set((state) => ({
    polls: state.polls.map(p => {
      if (p.id !== pollId || !p.active || p.votedBy.includes(participantId)) return p;
      return {
        ...p,
        votedBy: [...p.votedBy, participantId],
        options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
      };
    })
  })),

  submitMood: (score) => set((state) => {
    const newScores = [...state.moodScores, score];
    const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
    return { moodScores: newScores, teamMood: avg };
  }),

  updateWordCloud: (words) => set({ wordCloud: words })
}));
