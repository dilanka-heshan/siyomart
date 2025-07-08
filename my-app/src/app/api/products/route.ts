import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { getToken } from 'next-auth/jwt';

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt_desc';

    // Build query - focus only on category and search
    let query: any = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    let sortOptions: any = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'createdAt_asc':
        sortOptions.createdAt = 1;
        break;
      case 'rating_desc':
        sortOptions['rating.value'] = -1;
        break;
      case 'createdAt_desc':
      default:
        sortOptions.createdAt = -1;
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

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
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = await getToken({ req: request as any });
    if (!token || (token.role !== 'operator' && token.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.description || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product with operator ID from token
    const product = await Product.create({
      ...data,
      OperatorId: token.id
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
