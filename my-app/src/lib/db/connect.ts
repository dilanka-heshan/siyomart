import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check environment variable at runtime, not at module load time
  const MONGODB_URI = process.env.MONGODB_URI;
  
  // Debug environment variables
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI_EXISTS: !!MONGODB_URI,
    MONGODB_URI_LENGTH: MONGODB_URI?.length,
    MONGODB_URI_PREVIEW: MONGODB_URI?.substring(0, 20) + '...'
  });

  if (!MONGODB_URI) {
    console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new MongoDB connection...');
    console.log('Connecting to database:', new URL(MONGODB_URI).pathname.substring(1)); // Show database name from the URI

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB successfully!');
      // console.log('Database:', mongoose.connection.db.databaseName);
      console.log('Host:', mongoose.connection.host);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
