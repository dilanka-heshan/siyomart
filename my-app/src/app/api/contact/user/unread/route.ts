import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { ContactInquiry } from '@/lib/db/models/ContactInquiry'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    // Find inquiries that have responses but have not been viewed by the user
    const count = await ContactInquiry.countDocuments({ 
      email: session.user.email,
      response: { $exists: true },
      responseViewed: { $ne: true }
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching unread responses count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
}
