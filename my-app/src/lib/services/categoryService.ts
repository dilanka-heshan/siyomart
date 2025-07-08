// src/lib/services/categoryService.ts

import connectDB from '../db/connect';
import Category from '../db/models/Category';
import { Category as CategoryType } from '@/types/database';

export async function ensureCategories(): Promise<boolean> {
  try {
    await connectDB();
    const count = await Category.countDocuments();
    return count > 0;
  } catch (error) {
    console.error('Error ensuring categories exist:', error);
    return false;
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  try {
    await connectDB();
    const categories = await Category.find({})
      .select('name slug image description')
      .sort({ name: 1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
