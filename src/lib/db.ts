// src/lib/db.ts
// Robust in-memory DB for development that mimics a real DB
// In a real production app, this would be MongoDB/PostgreSQL

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  hostId: string;
  participants: string[]; // User IDs
  status: 'live' | 'completed' | 'scheduled';
  createdAt: string;
  transcript: string[];
}

class Database {
  users: User[] = [];
  meetings: Meeting[] = [];

  constructor() {
    this.users = [
      {
        id: 'admin-id',
        name: 'Admin User',
        email: 'admin@confera.ai',
        password: 'password123',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

// Global singleton to persist data during dev server runtime
const globalForDb = global as unknown as { db: Database };
export const db = globalForDb.db || new Database();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
