import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    const dbName = mongoose.connection.db.databaseName;
    
    // Get counts for each collection
    const collectionData = await Promise.all(
      collections.map(async (collection) => {
        const count = await mongoose.connection.db
          .collection(collection.name)
          .countDocuments();
        return {
          name: collection.name,
          count,
        };
      })
    );

    // Get a sample of the users collection if it exists
    let userSample = [];
    if (collectionData.some(c => c.name === 'users')) {
      userSample = await mongoose.connection.db
        .collection('users')
        .find({}, { projection: { password: 0 } })
        .limit(5)
        .toArray();
    }

    return NextResponse.json({
      message: 'Database connection successful',
      database: dbName,
      collections: collectionData,
      userSample: userSample.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json(
      { message: 'Failed to connect to database', error: String(error) },
      { status: 500 }
    );
  }
}
