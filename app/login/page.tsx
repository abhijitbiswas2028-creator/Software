'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Shield, User, Eye, EyeOff, AlertTriangle, ChevronRight,
  Fingerprint, Scan, Zap, Activity
} from 'lucide-react'

// ===== Floating Particle Canvas =====
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1, alpha: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 180,
      })
    }

    let mouseX = -1000, mouseY = -1000
    const handleMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', handleMouse)

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) { p.vx += dx / dist * 0.2; p.vy += dy / dist * 0.2 }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.98; p.vy *= 0.98
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha})`
        ctx.fill()
        ctx.shadowBlur = 10
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.2)`
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('mousemove', handleMouse); window.removeEventListener('resize', handleResize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Login state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user')

  // Register state
  const [regData, setRegData] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '',
    emailPermission: true, username: ''
  })
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'admin' || role === 'user') setSelectedRole(role)
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(res.status === 403 ? `⛔ ${data.message || 'Account blocked'}` : data.error || 'Invalid credentials')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Use window.location for reliable full page redirect
      if (data.user.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }
    } catch {
      setError('Connection error')
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    setRegSuccess('')
    setRegLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      })
      const data = await res.json()

      if (!res.ok) { setRegError(data.error || 'Registration failed'); setRegLoading(false); return }

      setRegSuccess(`✅ Registered! Username: ${data.user.username}. You can now login.`)
      setRegData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', emailPermission: true, username: '' })
      setTimeout(() => setMode('login'), 2000)
    } catch { setRegError('Connection error') }
    setRegLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050816] overflow-hidden relative font-['Segoe UI',system-ui,sans-serif]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(0,217,255,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(124,58,237,0.15),transparent)]" />
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 blur-[100px] animate-aurora1" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-[120px] animate-aurora2" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 blur-[100px] animate-aurora3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <Particles />

      {/* Centered Login Panel */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md animate-slideUp">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

              {/* Tab Selector */}
              <div className="flex p-1.5 gap-1 bg-white/5 mx-4 mt-4 rounded-xl">
                <button onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}>
                  Sign In
                </button>
                <button onClick={() => setMode('register')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}>
                  Create Account
                </button>
              </div>

              {/* Role Selector */}
              {mode === 'login' && (
                <div className="flex gap-3 mx-4 mt-4">
                  {[
                    { role: 'admin' as const, label: 'Admin', desc: 'Full system control', icon: Shield },
                    { role: 'user' as const, label: 'User', desc: 'Browse & explore', icon: User },
                  ].map(({ role, label, desc, icon: Icon }) => (
                    <button key={role} onClick={() => setSelectedRole(role)}
                      className={`flex-1 p-3 rounded-xl border transition-all ${
                        selectedRole === role
                          ? 'border-white/20 bg-white/10 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}>
                      <div className="flex items-center gap-2 justify-center">
                        <Icon className={`h-4 w-4 ${selectedRole === role ? 'text-white' : 'text-white/50'}`} />
                        <span className={`text-sm font-medium ${selectedRole === role ? 'text-white' : 'text-white/60'}`}>{label}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <div className="p-6 pt-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                      selectedRole === 'admin' ? 'from-purple-500 to-blue-500' : 'from-blue-500 to-cyan-500'
                    } flex items-center justify-center shadow-xl ${selectedRole === 'admin' ? 'shadow-purple-500/30' : 'shadow-blue-500/30'} relative overflow-hidden`}>
                      {selectedRole === 'admin' ? <Shield className="h-8 w-8 text-white" /> : <User className="h-8 w-8 text-white" />}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                    </div>
                  </div>

                  <h2 className="text-center text-white text-xl font-semibold mb-1">
                    {selectedRole === 'admin' ? 'Administrator' : 'Welcome Back'}
                  </h2>
                  <p className="text-center text-white/40 text-sm mb-6">
                    {selectedRole === 'admin' ? 'Sign in with your admin credentials' : 'Sign in to your account'}
                  </p>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-4 animate-shake">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" /><span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder={selectedRole === 'admin' ? 'admin' : 'user123'} required autoFocus />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder={selectedRole === 'admin' ? 'admin123' : 'user123'} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-2">
                      <div className="flex items-center gap-1.5 text-white/30 text-xs">
                        <Fingerprint className="h-4 w-4" /> <span className="hidden sm:inline">Windows Hello</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-1.5 text-white/30 text-xs">
                        <Scan className="h-4 w-4" /> <span className="hidden sm:inline">Face Unlock</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-1.5 text-white/30 text-xs">
                        <Zap className="h-4 w-4" /> <span className="hidden sm:inline">PIN</span>
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      {loading ? (
                        <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
                      ) : (
                        <><span className="relative z-10">Sign In</span><ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Quick Access</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between text-white/30">
                        <span className="text-purple-400/60">Admin</span>
                        <code className="text-purple-300/50">admin / admin123</code>
                      </div>
                      <div className="flex justify-between text-white/30">
                        <span className="text-blue-400/60">User</span>
                        <code className="text-blue-300/50">user123 / user123</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <div className="p-6 pt-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-center text-white text-xl font-semibold mb-1">Create Account</h2>
                  <p className="text-center text-white/40 text-sm mb-5">Fill in your details to register</p>

                  {regError && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" /><span>{regError}</span>
                    </div>
                  )}
                  {regSuccess && (
                    <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
                      <Activity className="h-4 w-4 flex-shrink-0 mt-0.5" /><span>{regSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">First Name</label>
                        <input type="text" value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">Last Name</label>
                        <input type="text" value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">Email</label>
                      <input type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">Username (optional)</label>
                      <input type="text" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" placeholder="Auto-generated if empty" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">Password</label>
                      <input type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" required minLength={6} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">Confirm Password</label>
                      <input type="password" value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm" required />
                    </div>
                    <label className="flex items-center gap-2 text-white/50 text-xs cursor-pointer hover:text-white/70 transition-colors">
                      <input type="checkbox" checked={regData.emailPermission} onChange={e => setRegData({...regData, emailPermission: e.target.checked})}
                        className="rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-500/30" />
                      I agree to receive product updates via email
                    </label>
                    <button type="submit" disabled={regLoading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {regLoading ? (
                        <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating Account...</>
                      ) : 'Create Account'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Bottom links */}
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={() => { setSelectedRole('admin'); setUsername('admin') }}
              className="text-xs text-white/30 hover:text-purple-400 transition-colors flex items-center gap-1">
              <Shield className="h-3 w-3" /> Admin Access
            </button>
            <span className="text-white/10">|</span>
            <button onClick={() => { setSelectedRole('user'); setUsername('user123') }}
              className="text-xs text-white/30 hover:text-blue-400 transition-colors flex items-center gap-1">
              <User className="h-3 w-3" /> User Login
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(50px, -30px) scale(1.1); opacity: 0.5; }
          66% { transform: translate(-20px, 40px) scale(0.9); opacity: 0.4; }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          33% { transform: translate(-40px, 20px) scale(1.2); opacity: 0.4; }
          66% { transform: translate(30px, -30px) scale(0.8); opacity: 0.3; }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(20px, 20px) scale(1.3); opacity: 0.3; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-aurora1 { animation: aurora1 15s ease-in-out infinite; }
        .animate-aurora2 { animation: aurora2 18s ease-in-out infinite; }
        .animate-aurora3 { animation: aurora3 12s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-out; }
      `}</style>
    </div>
  )
}
