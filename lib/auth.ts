// Full auth system with registration, activity logs, warnings, blocking

const TOKEN_PREFIX = 'asi_'

export interface AppUser {
  id: string
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  emailPermission: boolean
  role: 'admin' | 'user'
  blocked: boolean
  blockReason?: string
  warningCount: number
  createdAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  detail: string
  timestamp: string
  ip?: string
}

// ===== In-Memory Stores =====
let users: AppUser[] = [
  {
    id: '1', username: 'admin', password: 'admin123',
    firstName: 'System', lastName: 'Admin', email: 'admin@abhijit.com',
    emailPermission: true, role: 'admin', blocked: false,
    warningCount: 0, createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2', username: 'user123', password: 'user123',
    firstName: 'Default', lastName: 'User', email: 'user@abhijit.com',
    emailPermission: true, role: 'user', blocked: false,
    warningCount: 0, createdAt: '2026-01-01T00:00:00Z',
  },
]

let activityLogs: ActivityLog[] = []
let nextId = 3

// ===== User Management =====
export function getUsers(): AppUser[] {
  return JSON.parse(JSON.stringify(users))
}

export function findUser(username: string): AppUser | undefined {
  return users.find(u => u.username === username)
}

export function findUserById(id: string): AppUser | undefined {
  return users.find(u => u.id === id)
}

export function findUserByEmail(email: string): AppUser | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function registerUser(data: {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  emailPermission: boolean
}): AppUser {
  const newUser: AppUser = {
    id: String(nextId++),
    username: data.username,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    emailPermission: data.emailPermission,
    role: 'user',
    blocked: false,
    warningCount: 0,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  logActivity(newUser.id, newUser.username, 'REGISTER', 'User registered account')
  return { ...newUser, password: undefined } as any
}

export function blockUser(id: string, reason: string): AppUser | null {
  const user = users.find(u => u.id === id)
  if (!user || user.role === 'admin') return null
  user.blocked = true
  user.blockReason = reason
  logActivity(user.id, user.username, 'BLOCK', `Blocked: ${reason}`)
  return user
}

export function unblockUser(id: string): AppUser | null {
  const user = users.find(u => u.id === id)
  if (!user) return null
  user.blocked = false
  user.blockReason = undefined
  user.warningCount = 0
  logActivity(user.id, user.username, 'UNBLOCK', 'Unblocked by admin')
  return user
}

// ===== Progressive Warning System =====
const MAX_WARNINGS = 5

export function getUserWarningCount(userId: string): number {
  const user = users.find(u => u.id === userId)
  return user?.warningCount || 0
}

export function incrementWarning(userId: string): { warnings: number; blocked: boolean; maxWarnings: number } {
  const user = users.find(u => u.id === userId)
  if (!user || user.role === 'admin') return { warnings: 0, blocked: false, maxWarnings: MAX_WARNINGS }

  user.warningCount++
  const warnings = user.warningCount
  logActivity(user.id, user.username, 'WARNING', `Violation warning ${warnings}/${MAX_WARNINGS}`)

  // Auto-block on 6th violation
  if (warnings > MAX_WARNINGS) {
    user.blocked = true
    user.blockReason = `Auto-blocked after ${warnings} security violations`
    logActivity(user.id, user.username, 'AUTO_BLOCK', `Auto-blocked: ${warnings} violations`)
    return { warnings, blocked: true, maxWarnings: MAX_WARNINGS }
  }

  return { warnings, blocked: false, maxWarnings: MAX_WARNINGS }
}

export function resetWarnings(userId: string): void {
  const user = users.find(u => u.id === userId)
  if (user) {
    user.warningCount = 0
    logActivity(user.id, user.username, 'WARNINGS_RESET', 'Warnings reset by admin')
  }
}

// ===== Activity Logging =====
export function logActivity(userId: string, username: string, action: string, detail: string, ip?: string): ActivityLog {
  const log: ActivityLog = {
    id: String(Date.now()) + String(Math.random()).slice(2, 6),
    userId, username, action, detail,
    timestamp: new Date().toISOString(),
    ip,
  }
  activityLogs.push(log)
  // Keep last 1000 logs
  if (activityLogs.length > 1000) activityLogs = activityLogs.slice(-1000)
  return log
}

export function getActivityLogs(limit = 100, userId?: string): ActivityLog[] {
  let logs = [...activityLogs].reverse()
  if (userId) logs = logs.filter(l => l.userId === userId)
  return logs.slice(0, limit)
}

export function getUserActivitySummary(userId: string): {
  totalActions: number
  warnings: number
  blockHistory: ActivityLog[]
  recentActivity: ActivityLog[]
} {
  const userLogs = activityLogs.filter(l => l.userId === userId)
  return {
    totalActions: userLogs.length,
    warnings: userLogs.filter(l => l.action === 'WARNING').length,
    blockHistory: userLogs.filter(l => l.action === 'BLOCK' || l.action === 'AUTO_BLOCK' || l.action === 'UNBLOCK'),
    recentActivity: userLogs.slice(-20).reverse(),
  }
}

// ===== Token Management =====
export function createToken(user: AppUser): string {
  const payload = {
    id: user.id, username: user.username, role: user.role,
    fn: user.firstName, ln: user.lastName,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }
  return TOKEN_PREFIX + Buffer.from(JSON.stringify(payload)).toString('base64')
}

export function verifyToken(token: string): { id: string; username: string; role: 'admin' | 'user'; firstName: string; lastName: string } | null {
  try {
    if (!token.startsWith(TOKEN_PREFIX)) return null
    const decoded = JSON.parse(Buffer.from(token.slice(TOKEN_PREFIX.length), 'base64').toString())
    if (decoded.exp < Date.now()) return null
    const user = findUserById(decoded.id)
    if (!user || user.blocked) return null
    return { id: decoded.id, username: decoded.username, role: decoded.role, firstName: decoded.fn || '', lastName: decoded.ln || '' }
  } catch { return null }
}

export function getUserFromRequest(request: Request): { id: string; username: string; role: 'admin' | 'user'; firstName: string; lastName: string } | null {
  const auth = request.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return verifyToken(auth.slice(7))
}

export function validatePassword(username: string, password: string): AppUser | null {
  const user = users.find(u => u.username === username && u.password === password)
  if (user) logActivity(user.id, user.username, 'LOGIN', 'User logged in')
  return user || null
}
