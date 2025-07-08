import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';
// import User from '@/lib/db/models/User';

// GET /api/admin/categories - Get all categories for admin management
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    // Build query
    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const categories = await Category.find(query)
      .populate('parentCategory', 'name')
      .populate('subCategories', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ displayOrder: 1, createdAt: -1 });

    const total = await Category.countDocuments(query);

    return NextResponse.json({
      categories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create new category (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      description,
      slug,
      parentCategory = null,
      image,
      isActive = true,
      displayOrder = 0,
      metadata = {}
    } = body;

    // Validate required fields
    if (!name || !description || !slug || !image) {
      return NextResponse.json(
        { message: 'Missing required fields: name, description, slug, and image are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify parent category exists if provided
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return NextResponse.json(
          { message: 'Parent category not found' },
          { status: 400 }
        );
      }
    }

    // Create new category
    const newCategory = new Category({
      name,
      description,
      slug,
      parentCategory,
      subCategories: [],
      image,
      productCount: 0,
      isActive,
      metadata,
      displayOrder
    });

    await newCategory.save();

    // If this category has a parent, add it to parent's subCategories
    if (parentCategory) {
      await Category.findByIdAndUpdate(
        parentCategory,
        { $addToSet: { subCategories: newCategory._id } }
      );
    }
    
    // Populate the created category
    await newCategory.populate('parentCategory', 'name');

    return NextResponse.json({
      message: 'Category created successfully',
      category: newCategory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
