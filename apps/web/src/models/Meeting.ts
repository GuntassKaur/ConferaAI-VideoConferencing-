import { db } from '@/lib/firebase-admin';

export interface IMeetingJoinRequest {
  userId: string;
  name: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface IMeetingRecap {
  tldr?: string;
  keyPoints?: string[];
  actionItems?: { task: string; owner: string }[];
  sentiment?: string;
  engagementScore?: number;
}

export interface IMeeting {
  id?: string;
  meetingId: string;
  name?: string;
  hostId?: string;
  participants: string[];
  status: 'active' | 'ended' | 'idle';
  notes: string;
  notesLastEditedBy?: string;
  notesUpdatedAt?: Date | any;
  recap?: IMeetingRecap;
  joinRequests: IMeetingJoinRequest[];
  createdAt: Date | any;
}

export default class Meeting {
  _id: string;
  meetingId: string;
  name: string;
  hostId: string;
  participants: string[];
  status: string;
  notes: string;
  notesLastEditedBy?: string;
  notesUpdatedAt?: Date | any;
  recap?: IMeetingRecap;
  joinRequests: IMeetingJoinRequest[];
  createdAt: Date | any;

  constructor(data: any) {
    this._id = data._id || data.id || db.collection('meetings').doc().id;
    this.meetingId = data.meetingId;
    this.name = data.name || '';
    this.hostId = data.hostId || '';
    this.participants = data.participants || [];
    this.status = data.status || 'idle';
    this.notes = data.notes || '';
    this.notesLastEditedBy = data.notesLastEditedBy;
    this.notesUpdatedAt = data.notesUpdatedAt;
    this.recap = data.recap || {};
    this.joinRequests = data.joinRequests || [];
    this.createdAt = data.createdAt || new Date();
  }

  async save() {
    const dataToSave = { ...this };
    delete (dataToSave as any)._id;
    await db.collection('meetings').doc(this._id).set(dataToSave, { merge: true });
    return this;
  }

  static async findOne(query: any): Promise<Meeting | null> {
    if (!db) return null;
    let q: any = db.collection('meetings');
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snap = await q.limit(1).get();
    if (snap.empty) return null;
    return new Meeting({ _id: snap.docs[0].id, ...snap.docs[0].data() });
  }

  static find(query: any) {
    return {
      sort: (sortArgs: any) => {
        return {
          limit: async (limitArgs: number) => {
            if (!db) return [];
            let q: any = db.collection('meetings');
            // Simplified query logic for Firestore
            if (Object.keys(query).length > 0) {
                // If it's the `participants` query:
                if (query.participants) {
                    q = q.where('participants', 'array-contains', query.participants);
                } else {
                    for (const [key, value] of Object.entries(query)) {
                        q = q.where(key, '==', value);
                    }
                }
            }
            // For Firestore sorting we need an index, so we'll fetch and sort in memory if needed to avoid index issues
            const snap = await q.get();
            let results = snap.docs.map((doc: any) => new Meeting({ _id: doc.id, ...doc.data() }));
            
            if (sortArgs.createdAt === -1) {
                results.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            }
            return results.slice(0, limitArgs);
          }
        }
      }
    };
  }

  static async create(data: any): Promise<Meeting> {
    const meeting = new Meeting(data);
    await meeting.save();
    return meeting;
  }

  static async deleteOne(query: any): Promise<void> {
    const doc = await this.findOne(query);
    if (doc) {
      await db.collection('meetings').doc(doc._id).delete();
    }
  }

  static async findOneAndUpdate(query: any, update: any): Promise<Meeting | null> {
    const doc = await this.findOne(query);
    if (doc) {
      const updateData = update.$set || update;
      const docRef = db.collection('meetings').doc(doc._id);
      await docRef.set(updateData, { merge: true });
      const updatedSnap = await docRef.get();
      return new Meeting({ _id: updatedSnap.id, ...updatedSnap.data() });
    }
    return null;
  }
}
