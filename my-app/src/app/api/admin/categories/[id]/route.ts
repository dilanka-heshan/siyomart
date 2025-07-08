import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';
import User from '@/lib/db/models/User';

// GET /api/admin/categories/[id] - Get single category
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

    const category = await Category.findById(params.id)
      .populate('parentCategory', 'name')
      .populate('subCategories', 'name');

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id] - Update category
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
      slug,
      parentCategory,
      image,
      isActive,
      displayOrder,
      metadata
    } = body;

    // Check if category exists
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current category)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await Category.findOne({ 
        slug, 
        _id: { $ne: params.id } 
      });
      if (slugExists) {
        return NextResponse.json(
          { message: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Verify parent category exists if provided
    if (parentCategory && parentCategory !== existingCategory.parentCategory?.toString()) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return NextResponse.json(
          { message: 'Parent category not found' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(slug && { slug }),
        ...(parentCategory !== undefined && { parentCategory }),
        ...(image && { image }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(metadata && { metadata })
      },
      { new: true }
    ).populate('parentCategory', 'name');

    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
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

    // Check if category exists
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has subcategories
    if (category.subCategories && category.subCategories.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    // TODO: Check if category has products (implement based on your product model)
    // const hasProducts = await Product.findOne({ categoryId: params.id });
    // if (hasProducts) {
    //   return NextResponse.json(
    //     { message: 'Cannot delete category with products' },
    //     { status: 400 }
    //   );
    // }

    // Remove from parent category's subcategories if it has a parent
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(
        category.parentCategory,
        { $pull: { subCategories: params.id } }
      );
    }

    // Delete the category
    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
