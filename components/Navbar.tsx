'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Menu, X, Home, Bot, Download, Monitor, 
  Link as LinkIcon, Info, LogIn, LogOut, Shield, User
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'AI Tools', href: '/ai-tools', icon: Bot },
  { name: 'Operating Systems', href: '/operating-systems', icon: Monitor },
  { name: 'Software', href: '/software', icon: Download },
  { name: 'Shortcuts', href: '/shortcuts', icon: LinkIcon },
  { name: 'About', href: '/about', icon: Info },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authUser, setAuthUser] = useState<{username: string; role: string} | null>(null)
  const [hidden, setHidden] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/login') || pathname?.startsWith('/admin')) {
      setHidden(true)
      return
    }
    setHidden(false)
  }, [pathname])

  useEffect(() => {
    const check = () => {
      const data = localStorage.getItem('user')
      if (data) {
        try { setAuthUser(JSON.parse(data)) } catch { setAuthUser(null) }
      } else {
        setAuthUser(null)
      }
    }
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  if (hidden) return null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthUser(null)
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Abhijit Software
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {authUser ? (
              <>
                {authUser.role === 'admin' && (
                  <Link href="/admin"
                    className="flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Link>
                )}
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="h-3.5 w-3.5" /> {authUser.username}
                </span>
                <button onClick={logout}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </>
            ) : (
              <Link href="/login"
                className="flex items-center gap-1 text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {authUser && authUser.role === 'admin' && (
              <Link href="/admin" className="text-purple-600">
                <Shield className="h-5 w-5" />
              </Link>
            )}
            {!authUser && (
              <Link href="/login" className="text-primary-600">
                <LogIn className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {authUser ? (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="px-4 py-2 text-sm text-gray-500">Signed in as {authUser.username}</div>
                  {authUser.role === 'admin' && (
                    <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileMenuOpen(false) }}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-50 rounded-lg w-full">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
