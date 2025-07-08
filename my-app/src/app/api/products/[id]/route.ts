import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { getToken } from 'next-auth/jwt';

// GET /api/products/[id] - Get a single product
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("API route: Fetching product ID:", params.id);

    // Database Connection
    await connectDB();

    // Fetch product
    const product = await Product.findById(params.id)
      .populate('OperatorId', 'name rating')
      .lean()
      .exec();


    if (!product) {
      console.log("API route: Product not found");
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }



    return NextResponse.json(product, { status: 200 }); // ✅ Now returns actual product data
  } catch (error) {
    console.error('Error fetching product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch product', message: errorMessage }, { status: 500 });
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request as any });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Only allow owner or admin to update
    if (product.OperatorId.toString() !== token.id && token.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, { $set: data }, { new: true, runValidators: true });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update product', message: errorMessage }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request as any });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Only allow owner or admin to delete
    if (product.OperatorId.toString() !== token.id && token.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to delete product', message: errorMessage }, { status: 500 });
  }
}
