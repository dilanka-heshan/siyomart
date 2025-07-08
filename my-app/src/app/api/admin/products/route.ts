import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';
// import User from '@/lib/db/models/User';
import Story from '@/lib/db/models/Story';

// GET /api/admin/products - Get all products for admin management
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
    const category = searchParams.get('category');
    const withoutStories = searchParams.get('withoutStories') === 'true';

    // Build query
    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    
    if (withoutStories) {
      // Find all product IDs that already have stories
      const productsWithStories = await Story.distinct('productId');
      query._id = { $nin: productsWithStories };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('OperatorId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product (Admin only)
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
      category,
      categoryId,
      price,
      discount = 0,
      shipping_weight,
      stock,
      images = []
    } = body;

    // Validate required fields
    if (!name || !description || !category || !categoryId || !price || !shipping_weight || stock === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = new Product({
      OperatorId: session.user.id,
      name,
      description,
      category,
      categoryId,
      price: parseFloat(price),
      discount: parseFloat(discount),
      shipping_weight,
      stock: parseInt(stock),
      images,
      rating: [],
      reviews: []
    });

    await newProduct.save();
    
    // Populate the created product
    await newProduct.populate('categoryId', 'name slug');
    await newProduct.populate('OperatorId', 'name email');

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
