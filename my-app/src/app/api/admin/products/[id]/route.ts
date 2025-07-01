import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';
import User from '@/lib/db/models/User';

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findById(params.id)
      .populate('categoryId', 'name slug')
      .populate('OperatorId', 'name email');

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      discount,
      shipping_weight,
      stock,
      images
    } = body;

    // Check if product exists
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify category exists if provided
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(categoryId && { categoryId }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(shipping_weight && { shipping_weight }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(images && { images })
      },
      { new: true }
    )
    .populate('categoryId', 'name slug')
    .populate('OperatorId', 'name email');

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if product exists
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Check if product is in any active orders
    // const hasActiveOrders = await Order.findOne({ 
    //   'products.productId': params.id,
    //   status: { $nin: ['delivered', 'cancelled'] }
    // });
    // if (hasActiveOrders) {
    //   return NextResponse.json(
    //     { message: 'Cannot delete product with active orders' },
    //     { status: 400 }
    //   );
    // }

    // Delete the product
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
