'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or doesn't exist.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 btn-primary text-lg px-6 py-3"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 btn-secondary text-lg px-6 py-3"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </button>
              
              <Link
                href="/ai-tools"
                className="inline-flex items-center space-x-2 btn-secondary text-lg px-6 py-3"
              >
                <Search className="h-5 w-5" />
                <span>Browse AI Tools</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
