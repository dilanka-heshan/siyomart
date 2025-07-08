import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { ContactInquiry } from '@/lib/db/models/ContactInquiry'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth';

export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    // Find inquiries that match the user's email
    const inquiries = await ContactInquiry.find({ 
      email: session.user.email 
    }).sort({ createdAt: -1 })
    
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching user inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
