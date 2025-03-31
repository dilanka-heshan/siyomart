import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'

import { ContactInquiry } from '@/lib/db/models/ContactInquiry'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the required fields
    const { name, email, subject, inquiryType, message } = body
    
    if (!name || !email || !subject || !inquiryType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Connect to the database
    await connectToDatabase()
    
    // Create a new contact inquiry record
    const newInquiry = new ContactInquiry({
      name,
      email,
      phone: body.phone || '',
      subject,
      inquiryType,
      message,
      status: 'pending', // Default status
      createdAt: new Date(),
    })
    
    // Save to database
    await newInquiry.save()
    
    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting contact inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch all inquiries (admin access only)
export async function GET(request: Request) {
  try {
    // In a real app, you would check for admin authentication here
    // For example: if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    // Connect to the database
    await connectToDatabase()
    
    // Fetch all inquiries, sorted by most recent first
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 })
    
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching contact inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
