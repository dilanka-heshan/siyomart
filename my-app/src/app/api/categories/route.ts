import connectDB from '../../../lib/db/connect';
import Category from '../../../lib/db/models/Category';
import { NextResponse } from 'next/server';

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// New function to check if categories exist and add initial ones if needed
export async function ensureCategories(): Promise<boolean> {
  try {
    await connectDB();
    const count = await Category.countDocuments();
    
    if (count > 0) {
      console.log('Categories exist in the database.');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error ensuring categories exist:', error);
    return false;
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  try {
    // Ensure we have a valid DB connection
    await connectDB();
    
    
    // Check if there are any categories in the database
    const count = await Category.countDocuments();
    console.log(`Total categories in database: ${count}`);
    
    // Fetch categories without the isActive filter that's causing issues
    const categories = await Category.find({})  // Removed isActive filter
      .select('name slug image') 
      .sort({ name: 1 })
      .limit(10)
      .lean();
    
    if (!categories || categories.length === 0) {
      console.log('No categories found in the database.');
      return [];
    }
    
    console.log(`Found ${categories.length} categories`);
    // Log the first category to see its structure
    if (categories.length > 0) {
      console.log('First category sample:', categories[0]);
    }
    
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    return [];
  }
}

// Add this HTTP GET handler for the API route
export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true })
      .select('name slug image')
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
