import { NextRequest, NextResponse } from 'next/server'
import { getUsers, blockUser, unblockUser, getUserFromRequest, getActivityLogs, getUserActivitySummary, resetWarnings } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId')

  // Get activity logs
  if (action === 'logs') {
    const logs = getActivityLogs(100, userId || undefined)
    return NextResponse.json({ logs })
  }

  // Get user activity summary
  if (action === 'summary' && userId) {
    const summary = getUserActivitySummary(userId)
    return NextResponse.json({ summary })
  }

  // List users
  const users = getUsers().map(u => ({
    id: u.id, username: u.username, firstName: u.firstName, lastName: u.lastName,
    email: u.email, role: u.role, blocked: u.blocked, blockReason: u.blockReason,
    warningCount: u.warningCount, createdAt: u.createdAt,
  }))

  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { action, userId, reason } = body

    if (action === 'block') {
      const blocked = blockUser(userId, reason || 'Violated security policy')
      if (!blocked) return NextResponse.json({ error: 'Cannot block admin or user not found' }, { status: 400 })
      return NextResponse.json({ success: true, message: `User ${blocked.username} blocked` })
    }

    if (action === 'unblock') {
      const unblocked = unblockUser(userId)
      if (!unblocked) return NextResponse.json({ error: 'User not found' }, { status: 400 })
      return NextResponse.json({ success: true, message: `User ${unblocked.username} unblocked` })
    }

    if (action === 'resetWarnings') {
      resetWarnings(userId)
      return NextResponse.json({ success: true, message: 'Warnings reset' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
