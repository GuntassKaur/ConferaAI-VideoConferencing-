import '@/lib/firebase-admin';

export async function connectDB() {
  // Firebase Admin is initialized in the import above.
  // We return true to maintain compatibility with existing API routes
  // that do `await connectDB()`.
  return true;
}
