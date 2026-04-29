import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined');
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
    };



    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('=> MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    await cached.promise;
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Connection not ready");
    }
    cached.conn = mongoose.connection;
  } catch (e) {
    cached.promise = null;
    return null; 
  }



  return cached.conn;
}

export const connectDB = connectToDatabase;
export default connectToDatabase;
