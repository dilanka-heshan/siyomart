import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db/connect'
import User from '@/lib/db/models/User'

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (role !== 'user' && role !== 'operator' && role !== 'admin') {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }
    
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB for registration');
    
    // Check if user already exists
    console.log('Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create new user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role === 'operator' ? 'operator' : 'user', // Only allow user/operator roles
      wishlist: [],
      orderlist: [],
      favourite: []
    };
    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    
    const user = await User.create(userData);
    console.log('User created with ID:', user._id);
    
    // Remove password from response
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
    
    return NextResponse.json(
      { message: 'User registered successfully', user: newUser },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: `Failed to register user: ${error.message}` },
      { status: 500 }
    )
  }
}
