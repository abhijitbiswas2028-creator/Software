'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Download, 
  Monitor, 
  Link, 
  Search,
  ArrowRight,
  Star,
  Users,
  Zap
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import StatsSection from '@/components/StatsSection'
import FeatureSection from '@/components/FeatureSection'

const categories = [
  {
    id: 'ai-tools',
    title: 'AI Tools & Webpages',
    description: 'Discover powerful AI tools and web applications for productivity, creativity, and automation.',
    icon: Bot,
    href: '/ai-tools',
    color: 'from-purple-500 to-pink-500',
    stats: '50+ Tools'
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems',
    description: 'Download Windows 11, 10, 7, Linux distributions, and Mac OS versions.',
    icon: Monitor,
    href: '/operating-systems',
    color: 'from-blue-500 to-cyan-500',
    stats: '20+ OS Versions'
  },
  {
    id: 'software',
    title: 'Software Downloads',
    description: 'Access productivity, graphics, development, and security software.',
    icon: Download,
    href: '/software',
    color: 'from-green-500 to-emerald-500',
    stats: '200+ Software'
  },
  {
    id: 'shortcuts',
    title: 'Useful Shortcuts',
    description: 'Curated collection of web shortcuts, developer tools, and resources.',
    icon: Link,
    href: '/shortcuts',
    color: 'from-orange-500 to-red-500',
    stats: '100+ Links'
  }
]

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find exactly what you need with our intelligent search system'
  },
  {
    icon: Zap,
    title: 'Fast Downloads',
    description: 'High-speed downloads with multiple mirror options'
  },
  {
    icon: Star,
    title: 'Curated Content',
    description: 'Hand-picked software and tools by our expert team'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of users who trust our platform'
  }
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-gradient">Abhijit Software Industry</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your central hub for software downloads, AI tools, operating systems, 
              and product information. Find everything you need in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search software, AI tools, or operating systems..."
              />
            </div>
          </motion.div>

          {/* Stats Section */}
          <StatsSection />

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <FeatureSection features={features} />

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center bg-white rounded-2xl shadow-xl p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our vast collection of software, AI tools, and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-3 flex items-center justify-center">
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


