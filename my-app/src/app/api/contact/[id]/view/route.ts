import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { ContactInquiry } from '@/lib/db/models/ContactInquiry'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const inquiry = await ContactInquiry.findById(id)
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Check if the user is authorized to view this inquiry
    if (inquiry.email !== session.user.email && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // If there's a response and it's not already viewed
    if (inquiry.response && !inquiry.responseViewed) {
      await ContactInquiry.findByIdAndUpdate(id, {
        responseViewed: true,
        updatedAt: new Date()
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking inquiry as viewed:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry view status' },
      { status: 500 }
    )
  }
}
