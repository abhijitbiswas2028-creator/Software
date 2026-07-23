'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, LogOut, Users, Terminal, Activity, FileText,
  UserCheck, UserX, Search, MessageCircle, X, Send,
  Bot, Loader2, Server, HardDrive, Clock, AlertTriangle
} from 'lucide-react'

// ============ Admin User Management ============
function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.users) setUsers(data.users)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleBlock = async (userId: string, block: boolean, reason?: string) => {
    const token = localStorage.getItem('token')
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: block ? 'block' : 'unblock', userId, reason: reason || 'Security violation' })
    })
    fetchUsers()
  }

  if (loading) return <div className="text-center py-8 text-gray-400">Loading users...</div>

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-400" /> Registered Users
      </h3>
      {users.map(u => (
        <div key={u.id} className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              u.role === 'admin' ? 'bg-purple-600' : u.blocked ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              {u.username[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{u.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.role === 'admin' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {u.role}
                </span>
                {u.blocked && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300" title={u.blockReason}>
                    BLOCKED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">ID: {u.id} • Joined {new Date(u.createdAt).toLocaleDateString()}</p>
              {u.blocked && u.blockReason && (
                <p className="text-xs text-red-400 mt-1">Reason: {u.blockReason}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {u.role !== 'admin' && (
              u.blocked ? (
                <button onClick={() => toggleBlock(u.id, false)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 text-sm transition-all">
                  <UserCheck className="h-3.5 w-3.5" /> Unblock
                </button>
              ) : (
                <button onClick={() => {
                  const reason = prompt('Block reason:')
                  if (reason) toggleBlock(u.id, true, reason)
                }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 text-sm transition-all">
                  <UserX className="h-3.5 w-3.5" /> Block
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ System Monitor ============
function SystemMonitor() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const run = async (cmd: string) => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/admin/exec', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    })
    return (await res.json()).stdout || ''
  }

  useEffect(() => {
    (async () => {
      const [disk, uptime, mem] = await Promise.all([
        run("df -h / | tail -1 | awk '{print $3 \"/\" $2 \" (\" $5 \")\"}'"),
        run('uptime'),
        run("free -h | grep Mem | awk '{print $3 \"/\" $2}'"),
      ])
      setMetrics({ disk, uptime, mem })
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="text-center py-4 text-gray-400">Loading metrics...</div>

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <HardDrive className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Disk</span>
        </div>
        <p className="text-white text-sm font-mono">{metrics?.disk || 'N/A'}</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Uptime</span>
        </div>
        <p className="text-white text-sm font-mono truncate">{metrics?.uptime?.split('up')[1]?.split(',')[0]?.trim() || 'N/A'}</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-400 mb-1">
          <Server className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Memory</span>
        </div>
        <p className="text-white text-sm font-mono">{metrics?.mem || 'N/A'}</p>
      </div>
    </div>
  )
}

// ============ Log Viewer ============
function LogViewer() {
  const [logs, setLogs] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/admin/exec', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: 'tail -50 /workspaces/Software/.next/server/app/api/chat/route.js 2>/dev/null || echo "No logs yet"' })
    })
    const data = await res.json()
    setLogs(data.stdout || data.stderr || 'No output')
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-400" /> Server Logs
        </h3>
        <button onClick={fetchLogs} disabled={loading}
          className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <pre className="bg-gray-950 border border-gray-700 rounded-xl p-4 text-xs text-gray-400 font-mono max-h-64 overflow-y-auto whitespace-pre-wrap">
        {logs || 'Loading...'}
      </pre>
    </div>
  )
}

// ============ Admin AI Assistant ============
function AdminAIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{id:string; text:string; isUser:boolean}[]>([
    { id: '0', text: '🛡️ Admin AI ready. I have full system access. Ask me to check logs, run commands, manage users, or fix issues.', isUser: false }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const msgsEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { msgsEnd.current?.scrollIntoView() }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), text: msg, isUser: true }])
    setLoading(true)

    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, role: 'admin' })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: data.response || 'No response', isUser: false }])
    } catch {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: 'Error connecting', isUser: false }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat FAB */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl z-50 flex items-center justify-center hover:scale-110 transition-all">
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <span className="text-white font-semibold">Admin AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  m.isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </div>
              </div>
            )}
            <div ref={msgsEnd} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder="Ask me anything... (run commands, check logs, etc.)"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button onClick={send} disabled={!input.trim() || loading}
                className="px-3 py-2 bg-purple-600 disabled:bg-gray-700 text-white rounded-xl transition-all">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============ Main Admin Dashboard ============
export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'users' | 'system' | 'logs'>('users')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!stored || !token) {
      router.push('/login')
      return
    }
    const u = JSON.parse(stored)
    if (u.role !== 'admin') {
      router.push('/')
      return
    }
    setUser(u)
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Nav */}
      <nav className="bg-gray-900/80 border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-purple-400" />
              <span className="text-white font-bold text-lg">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                <span className="text-purple-400">●</span> {user.username}
              </span>
              <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                View Site →
              </a>
              <button onClick={logout}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
          <SystemMonitor />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          {([
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'system', label: 'System Tools', icon: Terminal },
            { id: 'logs', label: 'Log Viewer', icon: FileText },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-purple-600/20 text-purple-300 border border-purple-600/30' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
          {tab === 'users' && <UserManagement />}
          {tab === 'system' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" /> Command Terminal
              </h3>
              <p className="text-sm text-gray-400">Use the Admin AI assistant (bottom-right button) to run commands, check logs, restart services, or modify files.</p>
              <div className="grid grid-cols-2 gap-3">
                {['df -h', 'free -h', 'uptime', 'ps aux --sort=-%mem | head -10', 'ls -la /workspaces/Software', 'cat /workspaces/Software/.env.local'].map(cmd => (
                  <button key={cmd} onClick={() => {
                    const chatInput = document.querySelector('input[placeholder*="Ask me anything"]') as HTMLInputElement
                    if (chatInput) {
                      chatInput.value = cmd
                      chatInput.focus()
                    }
                  }}
                    className="text-left px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-400 font-mono hover:border-gray-600 hover:text-gray-200 transition-all">
                    $ {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === 'logs' && <LogViewer />}
        </div>
      </div>

      {/* Admin AI Chat */}
      <AdminAIChat />
    </div>
  )
}
