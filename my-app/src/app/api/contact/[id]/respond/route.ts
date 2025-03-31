import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { ContactInquiry } from '@/lib/db/models/ContactInquiry'
import { sendEmail, getInquiryResponseEmailTemplate } from '@/lib/services/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you'd check for admin authentication here
    
    const { id } = params
    const { text, respondedBy } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'Response text is required' },
        { status: 400 }
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
    
    // Update the inquiry with the response
    const updatedInquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { 
        status: 'resolved',
        updatedAt: new Date(),
        response: {
          text,
          date: new Date(),
          respondedBy: respondedBy || 'Admin'
        }
      },
      { new: true }
    )
    
    // Send email notification to the user
    await sendEmail({
      to: inquiry.email,
      subject: `Response to your inquiry: ${inquiry.subject}`,
      html: getInquiryResponseEmailTemplate(
        inquiry.name,
        inquiry.message,
        text,
        inquiry._id.toString()
      )
    })
    
    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error('Error responding to inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to respond to inquiry' },
      { status: 500 }
    )
  }
}
