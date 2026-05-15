import { db } from '@/lib/firebase-admin';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | null;
  createdAt: Date | any; // allow Firestore Timestamp
  recentRooms: string[];
}

export default class User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | null;
  createdAt: Date | any;
  recentRooms: string[];

  constructor(data: any) {
    this._id = data._id || data.id || db.collection('users').doc().id;
    this.name = data.name;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role || 'user';
    this.resetPasswordToken = data.resetPasswordToken;
    this.resetPasswordExpires = data.resetPasswordExpires;
    this.createdAt = data.createdAt || new Date();
    this.recentRooms = data.recentRooms || [];
  }

  async save() {
    const dataToSave = { ...this };
    delete (dataToSave as any)._id; // don't save _id as a field if not wanted, but we can
    await db.collection('users').doc(this._id).set(dataToSave, { merge: true });
    return this;
  }

  static async findOne(query: any): Promise<User | null> {
    if (!db) {
        console.warn('Database not initialized');
        return null;
    }
    let q: any = db.collection('users');
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snap = await q.limit(1).get();
    if (snap.empty) return null;
    return new User({ _id: snap.docs[0].id, ...snap.docs[0].data() });
  }

  static async find(query: any, projection?: string): Promise<any> {
    // Basic mock of find().lean()
    let q: any = db.collection('users');
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snap = await q.get();
    const results = snap.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() }));
    return {
      lean: () => results
    };
  }

  static async create(data: any): Promise<User> {
    const user = new User(data);
    await user.save();
    return user;
  }
}
