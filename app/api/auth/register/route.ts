import { NextRequest, NextResponse } from 'next/server'
import { registerUser, findUser, findUserByEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, confirmPassword, username, emailPermission } = body

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const generatedUsername = username || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '')

    if (findUser(generatedUsername)) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    if (findUserByEmail(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const user = registerUser({
      username: generatedUsername,
      password,
      firstName,
      lastName,
      email,
      emailPermission: emailPermission !== false,
    })

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.',
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
