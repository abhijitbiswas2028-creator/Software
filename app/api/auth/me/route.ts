import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = verifyToken(auth.slice(7))
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}
