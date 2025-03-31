import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { ContactInquiry } from '@/lib/db/models/ContactInquiry'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you'd check for admin authentication here
    
    const { id } = params
    const { status } = await request.json()
    
    if (!status || !['pending', 'in-progress', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    const updatedInquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { 
        status, 
        updatedAt: new Date() 
      },
      { new: true } // Return the updated document
    )
    
    if (!updatedInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry status' },
      { status: 500 }
    )
  }
}
