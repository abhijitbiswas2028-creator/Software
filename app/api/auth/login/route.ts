import { NextRequest, NextResponse } from 'next/server'
import { validatePassword, createToken, findUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const user = validatePassword(username, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.blocked) {
      return NextResponse.json(
        { 
          error: 'Account blocked',
          message: user.blockReason 
            ? `Your account has been blocked: ${user.blockReason}`
            : 'Your account has been blocked. Contact the administrator.'
        },
        { status: 403 }
      )
    }

    const token = createToken(user)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
